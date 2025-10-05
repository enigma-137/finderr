import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { supabase, getCurrentUser } from "@/constants/supabase";
import { useLocalSearchParams } from "expo-router";
import * as Crypto from 'expo-crypto';

const ENCRYPTION_KEY = 'mySecretKey123456mySecretKey123456'; // In production, we are to use proper key management

// Simple XOR encryption (for basic obfuscation)
// For production, consider using expo-crypto with proper key derivation
const encryptMessage = (message: string) => {
  const key = ENCRYPTION_KEY;
  let encrypted = '';
  for (let i = 0; i < message.length; i++) {
    encrypted += String.fromCharCode(message.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(encrypted); // Base64 encode
};

const decryptMessage = (encryptedMessage: string) => {
  try {
    const key = ENCRYPTION_KEY;
    const decoded = atob(encryptedMessage); // Base64 decode
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err);
    return '';
  }
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

    try {
      console.log('Original message:', inputText);
      const encrypted = encryptMessage(inputText);
      console.log('Encrypted message:', encrypted);
      console.log('Encrypted length:', encrypted.length);
      
      // Test decryption immediately
      const testDecrypt = decryptMessage(encrypted);
      console.log('Test decrypt:', testDecrypt);
      console.log('Decryption matches:', testDecrypt === inputText);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: encrypted
        })
        .select();

      console.log('Insert response:', { data, error });

      if (error) {
        console.error('Send error details:', JSON.stringify(error, null, 2));
        Alert.alert('Error', `Failed to send message: ${error.message}`);
      } else {
        console.log('Message sent successfully');
        setInputText('');
      }
    } catch (err) {
      console.error('Insert exception:', err);
      Alert.alert('Error', `Failed to send message: ${err}`);
    }
  };

  const renderMessage = ({ item }: any) => (
    <View style={[
      styles.messageContainer,
      item.sender_id === currentUser?.id ? styles.sent : styles.received
    ]}>
      <Text style={item.sender_id === currentUser?.id ? styles.SendMessageText : styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
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
    backgroundColor: '#FFFFFF',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#379f3d',
    borderBottomRightRadius: 4,
    
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9ECEF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    
  },
  SendMessageText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
    
  },
  // sent: {
  //   alignSelf: 'flex-end',
  //   backgroundColor: '#007AFF',
  //   borderBottomRightRadius: 4,
  // },
  // received: {
  //   alignSelf: 'flex-start',
  //   backgroundColor: '#E9ECEF',
  //   borderBottomLeftRadius: 4,
  // },
  // messageText: {
  //   fontSize: 16,
  //   lineHeight: 20,
  //   color: '#FFFFFF',
  // },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#F8F9FA',
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#379f3d',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});