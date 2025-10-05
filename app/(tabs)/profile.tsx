import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useUser } from "@/constants/UserContext";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const Profile = () => {
  const { userProfile, loading } = useUser();
  const router = useRouter();

  // Loading State
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  // No User State
  if (!userProfile) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="person-circle-outline" size={100} color="#CCC" />
          </View>
          <Text style={styles.emptyTitle}>No Profile Found</Text>
          <Text style={styles.emptySubtitle}>
            Please sign in to view your profile and connect with others
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.replace("/auth/signin")}
          >
            <LinearGradient
              colors={['#1d9b4d', '#12bf7a']}
              style={styles.signInGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              
              <Text style={styles.signInButtonText}>Sign In</Text>
              <Ionicons name="log-in-outline" size={24} color="#FFF" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  }

  // Profile Content
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <LinearGradient
          colors={['#32bc79', '#22a067']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Avatar
                size={100}
                image={userProfile.profile_image || "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
              />
              <Pressable style={styles.editAvatarButton}>
                <Ionicons name="camera" size={20} color="#FFF" />
              </Pressable>
            </View>
            
            <View style={styles.headerInfo}>
              <Text style={styles.nameText}>
                {userProfile.name}
              </Text>
              {userProfile.nickname && (
                <Text style={styles.nicknameText}>@{userProfile.nickname}</Text>
              )}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{userProfile.age_range}</Text>
                  <Text style={styles.statLabel}>Age</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{userProfile.gender}</Text>
                  <Text style={styles.statLabel}>Gender</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <View style={[
              styles.statusIndicator,
              userProfile.approved ? styles.approvedIndicator : styles.pendingIndicator
            ]}>
              <Ionicons 
                name={userProfile.approved ? "checkmark-circle" : "time"} 
                size={18} 
                color="#FFF" 
              />
              <Text style={styles.statusText}>
                {userProfile.approved ? "Verified" : "Pending"}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Academic Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="school" size={24} color="#3eaf71" />
          <Text style={styles.sectionTitle}>Academic Information</Text>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="business" size={18} color="#666" />
              <Text style={styles.labelText}>College</Text>
            </View>
            <Text style={styles.valueText}>{userProfile.college}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="book" size={18} color="#666" />
              <Text style={styles.labelText}>Department</Text>
            </View>
            <Text style={styles.valueText}>{userProfile.department}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="trending-up" size={18} color="#666" />
              <Text style={styles.labelText}>Level</Text>
            </View>
            <Text style={styles.valueText}>{userProfile.level}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="card" size={18} color="#666" />
              <Text style={styles.labelText}>Matric Number</Text>
            </View>
            <Text style={styles.valueText}>{userProfile.matric_number}</Text>
          </View>
        </View>
      </View>

      {/* Interests Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="heart" size={24} color="#FF6B9D" />
          <Text style={styles.sectionTitle}>Interests</Text>
        </View>
        
        <View style={styles.interestsCard}>
          <View style={styles.interestsContainer}>
            {userProfile.interests && userProfile.interests.length > 0 ? (
              userProfile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No interests added yet</Text>
            )}
          </View>
        </View>
      </View>

      {/* Activities Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="sports-soccer" size={24} color="#34C759" />
          <Text style={styles.sectionTitle}>Activities</Text>
        </View>
        
        <View style={styles.activitiesCard}>
          <Text style={styles.activitiesText}>
            {userProfile.activities || "No activities added yet"}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => {/* Edit profile */}}
        >
          <Ionicons name="create-outline" size={20} color="#0b6908" />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => {/* Settings */}}
        >
          <Ionicons name="settings-outline" size={20} color="#0b6908" />
          <Text style={styles.actionButtonText}>Settings</Text>
        </Pressable>
      </View>

      {/* Sign Out Button */}
      <Pressable
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.buttonPressed
        ]}
        onPress={() => {/* Sign out */}}
      >
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  signInButton: {
    width: '100%',
    // borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#299d69',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerCard: {
    marginBottom: 20,
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerGradient: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#163512',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  headerInfo: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  nicknameText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
  },
  statusBadge: {
    alignItems: 'center',
    marginTop: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  approvedIndicator: {
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
  },
  pendingIndicator: {
    backgroundColor: 'rgba(255, 149, 0, 0.9)',
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  labelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  valueText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  interestsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: '#44810f',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    fontStyle: 'italic',
  },
  activitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activitiesText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0b6908',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});