import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import React from "react";
import Header from "@/components/Header";
import { EvilIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

export default function Discover() {
  const button = () => <EvilIcons name="question" size={24} color="#379f3d" />;
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Header headerTitle={"Discover"} button={button} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="sparkles" size={20} color="#FF9500" />
          <Text style={styles.infoText}>
            New people refresh daily - Connect with your perfect match
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="compass" size={80} color="#379f3d" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Discover Coming Soon</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Connect with people who match your vibe through shared interests and communities
          </Text>

          {/* Feature Preview Cards */}
          <View style={styles.featureGrid}>
            {/* Row 1 */}
            <View style={styles.featureRow}>
              <View style={styles.featureCard}>
                <View style={[styles.featureIconWrapper, { backgroundColor: '#FFE5E5' }]}>
                  <Ionicons name="heart-circle" size={40} color="#FF6B9D" />
                </View>
                <Text style={styles.featureTitle}>Same Dating Goal</Text>
                <Text style={styles.featureDescription}>
                  Find people with similar relationship intentions
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconWrapper, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialCommunityIcons name="account-group" size={40} color="#379f3d" />
                </View>
                <Text style={styles.featureTitle}>Common Communities</Text>
                <Text style={styles.featureDescription}>
                  Connect through shared groups and interests
                </Text>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.featureRow}>
              <View style={styles.featureCard}>
                <View style={[styles.featureIconWrapper, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="star" size={40} color="#9C27B0" />
                </View>
                <Text style={styles.featureTitle}>Similar Interests</Text>
                <Text style={styles.featureDescription}>
                  Match with people who share your hobbies
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconWrapper, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="bulb" size={40} color="#FF9500" />
                </View>
                <Text style={styles.featureTitle}>Smart Recommendations</Text>
                <Text style={styles.featureDescription}>
                  AI-powered matches based on compatibility
                </Text>
              </View>
            </View>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>What You'll Get:</Text>
            
            <View style={styles.benefitItem}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </View>
              <Text style={styles.benefitText}>
                Daily refreshed profiles tailored to your preferences
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </View>
              <Text style={styles.benefitText}>
                Discover people through shared communities
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </View>
              <Text style={styles.benefitText}>
                Connect based on interests and values
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </View>
              <Text style={styles.benefitText}>
                Find meaningful connections faster
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
              colors={['#479b82', '#379f3d']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="notifications-outline" size={20} color="#FFF" />
              <Text style={styles.ctaButtonText}>Get Notified</Text>
            </LinearGradient>
          </Pressable>

          {/* Bottom Text */}
          <View style={styles.bottomContainer}>
            <Ionicons name="time-outline" size={18} color="#999" />
            <Text style={styles.bottomText}>
              We're building something special for you
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#E65100',
    fontWeight: '500',
    lineHeight: 20,
  },
  mainContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#e3fdf2',
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  featureGrid: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
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
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  bottomText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});