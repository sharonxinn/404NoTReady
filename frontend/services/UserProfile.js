import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_KEY}/api/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data.user);
      } else {
        Alert.alert(
          "Profile Error",
          data.message || "Failed to fetch profile data."
        );
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      Alert.alert("Network Error", "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#002147" />
      ) : profile ? (
        <View style={styles.profileCard}>
          <Text style={styles.profileTitle}>
            Hello, {profile.username || "-"}!
          </Text>
          <View style={styles.infoContainer}>
            <Text style={styles.profileInfo}>
              📧 Email: {profile.email || "-"}
            </Text>
            <Text style={styles.profileInfo}>
              👤 Username: {profile.username || "-"}
            </Text>
            <Text style={styles.profileInfo}>
              ⚧ Gender: {profile.gender || "-"}
            </Text>
            <Text style={styles.profileInfo}>🎂 Age: {profile.age || "-"}</Text>
            {profile.heartbeat && (
              <Text style={styles.profileInfo}>
                ❤️ Heartbeat: {profile.heartbeat} BPM
              </Text>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Failed to load profile.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={fetchProfile}>
        <Text style={styles.buttonText}>Refresh Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F0F4F8",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    width: "auto",
    alignItems: "center",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#002147",
    marginBottom: 15,
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 10,
  },
  profileInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
    textAlign: "left",
    width: "100%",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#002147",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default UserProfile;
