import { AntDesign, Ionicons } from "@expo/vector-icons";
import { supabase, getCurrentUser } from "@/constants/supabase";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";

interface SuggestedUser {
  id: string;
  nickname: string;
  profile_image: string;
}

const { width, height } = Dimensions.get("window");

const PeopleCard = () => {
  const router = useRouter();
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedUser, setMatchedUser] = useState<SuggestedUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [swipeLoading, setSwipeLoading] = useState(false);
  
  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const errorFadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchUsers();
  },
  swipeLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  }, []);

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(errorFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2700),
        Animated.timing(errorFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setError(null));
    }
  }, [error]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setError("Please log in to continue");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, nickname, profile_image')
        .eq('approved', true)
        .neq('id', currentUser.id);

      if (fetchError) throw fetchError;

      const shuffledUsers = data ? [...data].sort(() => Math.random() - 0.5) : [];
      setSuggestedUsers(shuffledUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError("Failed to load profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showMatchModal = (user: SuggestedUser) => {
    setMatchedUser(user);
    setMatchModalVisible(true);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideMatchModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMatchModalVisible(false);
      setMatchedUser(null);
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    });
  };

  const handleSwipeRight = async (cardIndex: number) => {
    const card = suggestedUsers[cardIndex];
    if (!card) return;

    try {
      setSwipeLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setError("Session expired. Please log in again.");
        return;
      }

      // Insert like
      const { error: likeError } = await supabase
        .from('likes')
        .insert({
          liker_id: currentUser.id,
          liked_id: card.id,
        });

      if (likeError) {
        if (likeError.code === '23505') {
          // Already liked, silent fail
          return;
        }
        throw likeError;
      }

      // Check for mutual like
      const { data: mutualLike, error: mutualError } = await supabase
        .from('likes')
        .select('id')
        .eq('liker_id', card.id)
        .eq('liked_id', currentUser.id)
        .single();

      if (mutualError && mutualError.code !== 'PGRST116') throw mutualError;

      if (mutualLike) {
        // It's a match, insert into matches
        const { error: matchError } = await supabase
          .from('matches')
          .insert({
            user1_id: currentUser.id < card.id ? currentUser.id : card.id,
            user2_id: currentUser.id < card.id ? card.id : currentUser.id,
          });

        if (matchError && matchError.code !== '23505') throw matchError;

        // Show beautiful match modal
        showMatchModal(card);
      }
    } catch (error: any) {
      console.error('Error handling like:', error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSwipeLoading(false);
    }
  };

  const handleSwipeLeft = (cardIndex: number) => {
    // Optional: Track pass/reject action
  };

  const goToChat = () => {
    if (matchedUser) {
      hideMatchModal();
      router.push({ 
        pathname: '/(tabs)/(chats)/chatScreen', 
        params: { otherUserId: matchedUser.id } 
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Finding people for you...</Text>
      </View>
    );
  }

  if (suggestedUsers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={80} color="#CCC" />
        <Text style={styles.emptyTitle}>No more profiles</Text>
        <Text style={styles.emptySubtitle}>Check back later for new matches!</Text>
        <Pressable style={styles.refreshButton} onPress={fetchUsers}>
          <Ionicons name="refresh" size={20} color="#FFF" />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Error Toast */}
      {error && (
        <Animated.View style={[styles.errorToast, { opacity: errorFadeAnim }]}>
          <Ionicons name="alert-circle" size={20} color="#FFF" />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}

      {/* Swiper */}
      <Swiper
        cards={suggestedUsers}
        renderCard={(card) => (
          <View style={styles.card}>
            <ImageBackground 
              source={{ uri: card.profile_image || 'https://via.placeholder.com/400' }} 
              style={styles.image}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
              >
                <View style={styles.infoSection}>
                  <Text style={styles.nameText}>{card.nickname}</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="school" size={16} color="#FFF" />
                    <Text style={styles.infoText}>Student</Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        )}
        onSwipedRight={handleSwipeRight}
        onSwipedLeft={handleSwipeLeft}
        infinite={false}
        backgroundColor="transparent"
        cardVerticalMargin={20}
        cardHorizontalMargin={20}
        stackSize={3}
        stackSeparation={15}
        animateCardOpacity
        overlayLabels={{
          left: {
            title: 'NOPE',
            style: {
              label: {
                backgroundColor: '#FF3B30',
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold',
                borderRadius: 10,
                padding: 10,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: -30,
              },
            },
          },
          right: {
            title: 'LIKE',
            style: {
              label: {
                backgroundColor: '#34C759',
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold',
                borderRadius: 10,
                padding: 10,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: 30,
              },
            },
          },
        }}
        disableTopSwipe={true}
        disableBottomSwipe={true}
      />

      {/* Swipe Loading Indicator */}
      {swipeLoading && (
        <View style={styles.swipeLoadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {/* Match Modal */}
      <Modal
        visible={matchModalVisible}
        transparent
        animationType="none"
        onRequestClose={hideMatchModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={hideMatchModal}
          />
          
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Decorative hearts */}
            <View style={styles.heartsContainer}>
              <Ionicons name="heart" size={40} color="#FF6B9D" style={styles.heartLeft} />
              <Ionicons name="heart" size={40} color="#FF6B9D" style={styles.heartRight} />
            </View>

            {/* Match Title */}
            <LinearGradient
              colors={['#FF6B9D', '#C44569']}
              style={styles.titleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.matchTitle}>It's a Match!</Text>
            </LinearGradient>

            {/* Match Message */}
            <Text style={styles.matchMessage}>
              You and {matchedUser?.nickname || 'this person'} liked each other!
            </Text>

            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <ImageBackground
                  source={{ uri: matchedUser?.profile_image || 'https://via.placeholder.com/80' }}
                  style={styles.avatarImage}
                  imageStyle={styles.avatarImageStyle}
                >
                  {!matchedUser?.profile_image && (
                    <Ionicons name="person" size={40} color="#FFF" />
                  )}
                </ImageBackground>
              </View>
              <View style={styles.heartIconContainer}>
                <Ionicons name="heart" size={32} color="#FF6B9D" />
              </View>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarImage}>
                  <Ionicons name="person" size={40} color="#FFF" />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={goToChat}
              >
                <LinearGradient
                  colors={['#007AFF', '#0051D5']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="chatbubble" size={20} color="#FFF" />
                  <Text style={styles.primaryButtonText}>Send Message</Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={hideMatchModal}
              >
                <Text style={styles.secondaryButtonText}>Keep Swiping</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default PeopleCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorToast: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  card: {
    height: height * 0.7,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFF",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  gradient: {
    width: '100%',
    paddingTop: 100,
  },
  infoSection: {
    padding: 20,
    gap: 8,
  },
  nameText: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  overlayLabel: {
    alignItems: 'center',
    gap: 12,
  },
  overlayCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  overlayText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  leftLabel: {},
  rightLabel: {},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heartsContainer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  heartLeft: {
    transform: [{ rotate: '-15deg' }],
  },
  heartRight: {
    transform: [{ rotate: '15deg' }],
  },
  titleGradient: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  matchMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 16,
  },
  avatarWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImageStyle: {
    borderRadius: 40,
  },
  heartIconContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});