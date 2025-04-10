import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import Svg, { Polyline } from "react-native-svg";
import GoogleFit, { Scopes } from "react-native-google-fit";
import UserProfile from "../services/UserProfile";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const API_KEY = process.env.EXPO_PUBLIC_API_URL;

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [heartbeat, setHeartbeat] = useState(67);
  const [profileVisible, setProfileVisible] = useState(false);
  const submitBmi = async () => {
    try {
      const response = await fetch(`${API_KEY}/api/health/bmi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ height, weight, age }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update BMI");
      }
      Alert.alert("Success", data.message);
    } catch (error) {
      console.error("Error updating BMI:", error);
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeartbeat = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
      setHeartbeat(newHeartbeat);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = parseFloat(height) / 100;
      const bmiValue = (
        parseFloat(weight) /
        (heightInMeters * heightInMeters)
      ).toFixed(2);
      setBmi(bmiValue);
      determineBMICategory(bmiValue);
      submitBmi();
    }
  };

  const determineBMICategory = (bmi) => {
    let category = "";
    if (bmi < 18.5) {
      category = t("underweight");
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = t("healthy");
    } else if (bmi >= 25 && bmi < 29.9) {
      category = t("overweight");
    } else {
      category = t("obese");
    }
    setBmiCategory(category);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("dashboard_title")}</Text>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => setProfileVisible(true)}
      >
        <Text style={styles.refreshButtonText}>{t("Profile")}</Text>
      </TouchableOpacity>

      <Modal visible={profileVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <UserProfile />
            <TouchableOpacity
              onPress={() => setProfileVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>{t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Svg height="100" width="300" style={styles.heartbeatGraph}>
        <Polyline
          points="0,50 20,30 40,70 60,20 80,50 100,30 120,70 140,20 160,50"
          fill="none"
          stroke="red"
          strokeWidth="2"
        />
      </Svg>

      <Text style={styles.heartbeatText}>
        {t("heartbeat")}: {heartbeat} bpm ❤️
      </Text>

      <TextInput
        style={styles.input}
        placeholder={t("age_placeholder")}
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder={t("weight_placeholder")}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder={t("height_placeholder")}
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>{t("Calculate_BMI")}</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={styles.resultContainer}>
          <Text style={styles.bmiText}>
            {t("your_bmi")}: {bmi}
          </Text>
          <Text style={styles.bmiCategory}>{bmiCategory}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  refreshButton: {
    width: "60%",
    backgroundColor: "#002147",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  refreshButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#002147",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: { color: "#fff", fontSize: 16 },
  heartbeatGraph: { marginBottom: 10 },
  heartbeatText: { fontSize: 18, color: "red", marginBottom: 20 },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resultContainer: { marginTop: 10, alignItems: "center" },
  bmiText: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  bmiCategory: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    color: "#002147",
  },
  button: {
    width: "60%",
    backgroundColor: "#002147",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default Dashboard;
