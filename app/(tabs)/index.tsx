import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import Header from "@/components/Header";
import { Octicons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

const LikedYou = () => {
  const button = () => <Octicons name="filter" size={24} color="#007AFF" />;
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Header headerTitle={"Liked You"} button={button} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#55b165" />
          <Text style={styles.infoText}>
            When people like you, they'll appear here
          </Text>
        </View>

        {/* Under Construction Section */}
        <View style={styles.mainContent}>
          {/* Construction Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="construction" size={80} color="#55b165" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Coming Soon</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            This feature is currently under construction
          </Text>

          {/* Feature Cards */}
          <View style={styles.featureContainer}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="heart" size={32} color="#FF6B9D" />
              </View>
              <Text style={styles.featureTitle}>See Who Likes You</Text>
              <Text style={styles.featureDescription}>
                Discover people who are interested in you before you swipe
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="flash" size={32} color="#FFD700" />
              </View>
              <Text style={styles.featureTitle}>Get Priority</Text>
              <Text style={styles.featureDescription}>
                Stand out and get more matches with spotlight features
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="star" size={32} color="#34C759" />
              </View>
              <Text style={styles.featureTitle}>Premium Features</Text>
              <Text style={styles.featureDescription}>
                Unlock exclusive features to enhance your experience
              </Text>
            </View>
          </View>

          {/* CTA Button */}
          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.buttonPressed
            ]}
          >
            <LinearGradient
              colors={['#69b97f', '#379f3d']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="notifications" size={20} color="#FFF" />
              <Text style={styles.ctaButtonText}>Notify Me When Ready</Text>
            </LinearGradient>
          </Pressable>

          {/* Bottom Text */}
          <Text style={styles.bottomText}>
            We're working hard to bring you this feature. Stay tuned!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default LikedYou;

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
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cee6ca',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#379f3d',
    fontWeight: '500',
  },
  mainContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#d8f8e6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#379f3d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  featureContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#379f3d',
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
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  bottomText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});