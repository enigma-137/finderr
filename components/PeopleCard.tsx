import { AntDesign, Ionicons } from "@expo/vector-icons";
import { supabase, getCurrentUser } from "@/constants/supabase";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Swiper from "react-native-deck-swiper";

interface SuggestedUser {
  id: string;
  nickname: string;
  profile_image: string;
}

const { width, height } = Dimensions.get("window");

const PeopleCard = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('id, nickname, profile_image')
          .eq('approved', true)
          .neq('id', currentUser.id);

        if (error) throw error;

        // Shuffle the users array
        const shuffledUsers = data ? [...data].sort(() => Math.random() - 0.5) : [];

        setSuggestedUsers(shuffledUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleSwipeRight = async (cardIndex: number) => {
    const card = suggestedUsers[cardIndex];
    if (!card) return;

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      // Insert like
      const { error: likeError } = await supabase
        .from('likes')
        .insert({
          liker_id: currentUser.id,
          liked_id: card.id,
        });

      if (likeError) throw likeError;

      // Check for mutual like
      const { data: mutualLike, error: mutualError } = await supabase
        .from('likes')
        .select('id')
        .eq('liker_id', card.id)
        .eq('liked_id', currentUser.id)
        .single();

      if (mutualError && mutualError.code !== 'PGRST116') throw mutualError; // PGRST116 is no rows

      if (mutualLike) {
        // It's a match, insert into matches
        const { error: matchError } = await supabase
          .from('matches')
          .insert({
            user1_id: currentUser.id < card.id ? currentUser.id : card.id,
            user2_id: currentUser.id < card.id ? card.id : currentUser.id,
          });

        if (matchError) throw matchError;

        Alert.alert('It\'s a match!', `You matched with ${card.nickname}`);
      }
    } catch (error: any) {
      console.error('Error handling like:', error);
      if (error.code === '23505') {
        Alert.alert('Already liked', 'You have already liked this person.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  const handleSwipeLeft = (cardIndex: number) => {
    // For now, do nothing on left swipe
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={suggestedUsers}
        renderCard={(card) => (
          <View style={styles.card}>
            <ImageBackground source={{ uri: card.profile_image }} style={styles.image}>
              <View style={styles.infoSection}>
                <Text style={styles.text}>
                  {card.nickname}
                </Text>
              </View>
            </ImageBackground>
          </View>
        )}
        onSwipedRight={handleSwipeRight}
        onSwipedLeft={handleSwipeLeft}
        infinite
        backgroundColor="transparent"
        cardVerticalMargin={10}
        stackSize={3}
        overlayLabels={{
          left: {
            title: (
              <View style={[styles.overlayLabel, styles.leftLabel]}>
                <AntDesign name="close" size={100} color="red" />
              </View>
            ),
            style: {
              wrapper: {
                justifyContent: "center",
                alignItems: "center",
              },
            },
          },
          right: {
            title: (
              <View style={[styles.overlayLabel, styles.rightLabel]}>
                <Ionicons
                  name="checkmark-circle-sharp"
                  size={100}
                  color="green"
                />
              </View>
            ),
            style: {
              wrapper: {
                justifyContent: "center",
                alignItems: "center",
              },
            },
          },
        }}
        disableTopSwipe={true}
        disableBottomSwipe={true}
      />
    </View>
  );
};

export default PeopleCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width * 0.9,
    height: height * 0.8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  infoSection: {
    width: "100%",
    height: 60,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  overlayLabel: {
    position: "absolute",
    top: "50%",
    // transform: [{ translateY: -30 }],
  },
  leftLabel: {
    left: 30,
  },
  rightLabel: {
    right: 30,
  },
});
