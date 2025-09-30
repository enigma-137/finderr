import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { supabase, getCurrentUser } from "@/constants/supabase";
import { useLocalSearchParams } from "expo-router";
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'mySecretKey'; // In production, use proper key management

const encryptMessage = (message: string) => {
  return CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
};

const decryptMessage = (encryptedMessage: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const ChatScreen = () => {
  const params = useLocalSearchParams();
  const otherUserId = params.otherUserId as string;
  console.log('ChatScreen mounted with params:', params);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string>('');

  useEffect(() => {
    const initializeChat = async () => {
      console.log('initializeChat called with otherUserId:', otherUserId);
      const user = await getCurrentUser();
      console.log('Current user:', user);
      if (!user || !otherUserId) {
        console.log('Missing user or otherUserId');
        return;
      }
      setCurrentUser(user);

      // Ensure consistent ordering for conversation lookup/creation
      const user1Id = user.id < otherUserId ? user.id : otherUserId;
      const user2Id = user.id < otherUserId ? otherUserId : user.id;
      console.log('Ordered IDs:', { user1Id, user2Id });

      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('user1_id', user1Id)
        .eq('user2_id', user2Id)
        .single();

      console.log('Conversation lookup result:', { conv, convError });

      if (conv) {
        console.log('Found existing conversation:', conv.id);
        setConversationId(conv.id);
      } else {
        // Create conversation with ordered IDs
        console.log('Creating new conversation');
        const { data, error } = await supabase
          .from('conversations')
          .insert({ user1_id: user1Id, user2_id: user2Id })
          .select('id')
          .single();
        console.log('Conversation creation result:', { data, error });
        if (data) setConversationId(data.id);
        if (error) console.error('Error creating conversation:', error);
      }
    };

    initializeChat();
  }, [otherUserId]);

  useEffect(() => {
    if (!conversationId) return;

    // Fetch messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (data) {
        // const decrypted = data.map(msg => ({
        //   ...msg,
        //   content: decryptMessage(msg.content)
        // }));
        setMessages(data); // Temporarily disable decryption
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        console.log('Real-time message received:', payload.new);
        // const newMsg = {
        //   ...payload.new,
        //   content: decryptMessage(payload.new.content)
        // };
        setMessages(prev => [...prev, payload.new]); // Temporarily disable decryption
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = async () => {
    console.log('sendMessage called', { inputText, currentUser, conversationId });
    if (!inputText.trim() || !currentUser || !conversationId) {
      console.log('Missing required data:', { inputText: !!inputText.trim(), currentUser: !!currentUser, conversationId: !!conversationId });
      return;
    }

    console.log('Before encrypt');
    // const encrypted = encryptMessage(inputText);
    const encrypted = inputText; // Temporarily disable encryption for testing
    console.log('After encrypt', encrypted);
    console.log('Sending message:', { conversation_id: conversationId, sender_id: currentUser.id, content: encrypted });
    console.log('About to insert');
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: encrypted
        });
      console.log('Insert done', { error });

      if (error) {
        console.error('Send error:', error);
        Alert.alert('Error', 'Failed to send message');
      } else {
        console.log('Message sent successfully');
        setInputText('');
      }
    } catch (err) {
      console.error('Insert exception:', err);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }: any) => (
    <View style={[
      styles.messageContainer,
      item.sender_id === currentUser?.id ? styles.sent : styles.received
    ]}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#214723',
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#214723',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fdffff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'white',
    backgroundColor: '#444',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#214723',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
