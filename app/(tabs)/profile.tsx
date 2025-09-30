import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useUser } from "@/constants/UserContext";

const profile = () => {
  const { userProfile, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <ScrollView style={{ paddingHorizontal: 8, backgroundColor: "white" }}>
        <View style={{ gap: 10, paddingTop: 20 }}>
          <View style={{ alignItems: "center", padding: 20 }}>
            <Text>Loading profile...</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (!userProfile) {
    return (
      <ScrollView style={{ paddingHorizontal: 8, backgroundColor: "white" }}>
        <View style={{ gap: 10, paddingTop: 20 }}>
          <View style={{ alignItems: "center", padding: 20 }}>
            <Text>No profile found. Please sign in.</Text>
            <Button
              style={{ backgroundColor: "#214723", marginTop: 10 }}
              textStyle={{ color: "white" }}
              onPress={() => router.replace("/auth/signin")}
            >
              Sign In
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ paddingHorizontal: 8, backgroundColor: "white" }}>
      <View style={{ gap: 10, paddingTop: 20 }}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Avatar
            size={80}
            image={userProfile.profile_image || "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
          />
          <View>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>
              {userProfile.name}{userProfile.nickname ? ` (${userProfile.nickname})` : ""}
            </Text>
            <Text style={{ fontSize: 16, color: "#666" }}>
              {userProfile.age_range}, {userProfile.gender}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>College:</Text>
            <Text style={styles.value}>{userProfile.college}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{userProfile.department}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Level:</Text>
            <Text style={styles.value}>{userProfile.level}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Matric Number:</Text>
            <Text style={styles.value}>{userProfile.matric_number}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {userProfile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <Text style={styles.activitiesText}>{userProfile.activities}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Status</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, userProfile.approved ? styles.approved : styles.pending]}>
              {userProfile.approved ? "Approved" : "Pending Approval"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#214723",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    backgroundColor: "#214723",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  interestText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  activitiesText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  statusContainer: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  approved: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  pending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
});

