import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const genders = ["Male", "Female", "Non-Binary"];

const SignUp = () => {
  const API_KEY = process.env.EXPO_PUBLIC_API_URL;

  const navigation = useNavigation();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};
    if (!username.trim()) newErrors.username = t("required");
    if (!email.trim()) newErrors.email = t("required");
    if (!password) newErrors.password = t("required");
    if (!confirmPassword) newErrors.confirmPassword = t("required");
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = t("password_mismatch");
    if (!gender) newErrors.gender = t("required");
    if (!age || isNaN(age) || age <= 0) newErrors.age = t("invalid_age");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    const userData = {
      username,
      email,
      password,
      gender,
      age: parseInt(age), // Convert age to number
    };

    try {
      const response = await fetch(`${API_KEY}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("success", t("registration_successful"));
        navigation.replace("Login"); // Navigate to Login on success
      } else {
        Alert.alert(
          t("registration_failed"),
          data.message || t("something_wrong")
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("error", t("server_error"));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require("../assets/NewGen.png")} style={styles.logo} />
        <Text style={styles.title}>{t("sign_up")}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={t("username")}
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder={t("email")}
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder={t("password")}
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder={t("confirm_password")}
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      {/* Gender Selection */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={gender ? styles.inputText : styles.placeholderText}>
          {gender ? t(gender.toLowerCase()) : t("select_gender")}
        </Text>
      </TouchableOpacity>
      {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

      {/* Gender Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={genders}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.genderOption}
                  onPress={() => {
                    setGender(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.genderText}>{t(item.toLowerCase())}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.input}
        placeholder={t("age")}
        placeholderTextColor="#999"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>{t("sign_up")}</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        {t("already_have_account")}{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          {t("login")}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#001F3F",
  },
  input: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: "#F0F0F0",
    color: "#333",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  inputText: {
    color: "#333",
    fontSize: 16,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  button: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: "#002147",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    color: "#555",
    marginTop: 20,
    fontSize: 14,
  },
  loginLink: {
    color: "#002147",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 450,
    alignItems: "center",
  },
  genderOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  genderText: {
    fontSize: 18,
    color: "#333",
  },
  cancelText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
});

export default SignUp;
