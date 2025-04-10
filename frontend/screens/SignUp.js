import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};
    if (!username.trim()) newErrors.username = t("required");
    if (!email.trim()) newErrors.email = t("required");
    if (!password) newErrors.password = t("required");
    if (!confirmPassword) newErrors.confirmPassword = t("required");
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = t("password_mismatch");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    // Validate user input
    if (!validateFields()) return;

    try {
      const newUser = {
        username,
        email,
        password,
        phone,
      };

      // Save user data locally using AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      // Show success message and navigate to login page
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Login"); // ✅ Navigate to Login page
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Signup failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t("sign_up")}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={t("username")}
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

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
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        style={styles.input}
        placeholder={t("confirm_password")}
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <TextInput
        style={styles.input}
        placeholder={t("phone number")}
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />

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
  errorText: {
    color: "#ff0000",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
});

export default SignUp;
