import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { supabase, getCurrentUser } from "@/constants/supabase";

const Chats = () => {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const button = () => <AntDesign name="search1" size={24} color="white" />;

  useEffect(() => {
    const fetchMatches = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const { data: matchesData, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      if (!matchesData || matchesData.length === 0) {
        setMatches([]);
        return;
      }

      // Get all other user IDs
      const otherUserIds = matchesData.map(match =>
        match.user1_id === user.id ? match.user2_id : match.user1_id
      );

      // Fetch profiles for other users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nickname, profile_image')
        .in('id', otherUserIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Combine matches with profiles
      const transformedMatches = matchesData.map(match => {
        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        const profile = profilesData?.find(p => p.id === otherUserId);
        return {
          id: match.id,
          otherUserId,
          nickname: profile?.nickname || 'Unknown',
          profile_image: profile?.profile_image || '',
        };
      });

      setMatches(transformedMatches);
    };

    fetchMatches();
  }, []);
  return (
    <ScrollView style={{ paddingHorizontal: 8 }}>
      <View style={{ gap: 10, backgroundColor: '#214723', padding: 10, borderRadius: 10, minHeight: '100%' }}>
        <Header headerTitle={"Chats"} button={button} />
        <View style={styles.headerSection}>
          <Text style={styles.logo}>Your Matches</Text>
          <MaterialCommunityIcons name="sort-variant" size={24} color="white" />
        </View>
        {matches.length === 0 ? (
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
            No matches yet. Keep swiping!
          </Text>
        ) : (
          matches.map(match => (
            <Pressable
              key={match.id}
              style={styles.matchItem}
              onPress={() => {
                router.push({ pathname: '/(tabs)/(chats)/chatScreen', params: { otherUserId: match.otherUserId } });
              }}
            >
              <Avatar size={60} image={match.profile_image} />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                  {match.nickname}
                </Text>
                <Text style={{ color: '#888' }}>Tap to chat</Text>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Chats;

const styles = StyleSheet.create({
  headerSection: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 8,
    marginBottom: 6,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "white",
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    marginVertical: 5,
  },
});
