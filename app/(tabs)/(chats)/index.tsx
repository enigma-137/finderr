import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { supabase, getCurrentUser } from "@/constants/supabase";

const Chats = () => {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const button = () => <AntDesign name="search1" size={24} color="#007AFF" />;

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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header headerTitle={"Chats"} button={button} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.sectionTitle}>Your Matches</Text>
          <Pressable style={styles.sortButton}>
            <MaterialCommunityIcons name="sort-variant" size={22} color="#666" />
          </Pressable>
        </View>

        {matches.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
            </View>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySubtitle}>Keep swiping to find your perfect match!</Text>
          </View>
        ) : (
          <View style={styles.matchesList}>
            {matches.map((match, index) => (
              <Pressable
                key={match.id}
                style={({ pressed }) => [
                  styles.matchCard,
                  pressed && styles.matchCardPressed
                ]}
                onPress={() => {
                  router.push({ 
                    pathname: '/(tabs)/(chats)/chatScreen', 
                    params: { otherUserId: match.otherUserId } 
                  });
                }}
              >
                <View style={styles.avatarContainer}>
                  <Avatar size={56} image={match.profile_image} />
                  <View style={styles.onlineIndicator} />
                </View>
                
                <View style={styles.matchInfo}>
                  <Text style={styles.matchName} numberOfLines={1}>
                    {match.nickname}
                  </Text>
                  <Text style={styles.matchMessage} numberOfLines={1}>
                    Tap to start chatting
                  </Text>
                </View>

                <View style={styles.chevronContainer}>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 0.3,
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  matchesList: {
    gap: 12,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  matchCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  avatarContainer: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  matchInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  matchName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  matchMessage: {
    fontSize: 15,
    color: '#666',
  },
  chevronContainer: {
    marginLeft: 8,
    opacity: 0.5,
  },
});