import React, { createContext, useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import Diet from "./screens/Diet";
import Game from "./screens/Game";
import Health from "./screens/Health";
import Monitor from "./screens/Monitor";
import Report from "./services/Report";
import Chatbot from "./screens/Chatbot";
import "./src/i18n";
import LanguageSwitcher from "./src/components/LanguageSwitcher";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthContext = createContext();

// Logout Function
const LogoutButton = ({ navigation }) => {
  const { t } = useTranslation();
  const { setUser } = useContext(AuthContext);
  const API_KEY = process.env.EXPO_PUBLIC_API_URL;

  const handleLogout = async () => {
    try {
      await axios.post(`${API_KEY}/api/auth/logout`);
      setUser(null); // Clear authentication state
      navigation.replace("Login"); // Redirect to login page
    } catch (error) {
      alert(t("logout_failed"));
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
      <Text style={{ color: "#002147", fontSize: 16, fontWeight: "bold" }}>
        {t("logout")}
      </Text>
    </TouchableOpacity>
  );
};

// Bottom Tab Navigator
function MainTabs({ navigation }) {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <LogoutButton navigation={navigation} />,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: t("dashboard"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Diet"
        component={Diet}
        options={{
          title: t("diet"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Game"
        component={Game}
        options={{
          title: t("game"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={Health}
        options={{
          title: t("health"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Monitor"
        component={Monitor}
        options={{
          title: t("monitor"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={Report}
        options={{
          title: t("report"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const { t } = useTranslation();

  const [user, setUser] = useState(null); // Manage authentication state

  return (
    <AuthProvider>
      <AuthContext.Provider value={{ user, setUser }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="SignUp">
                <Stack.Screen
                  name="SignUp"
                  component={SignUp}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Dashboard"
                  component={MainTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Chatbot"
                  component={Chatbot}
                  options={{ headerShown: true, title: t("ai_chatbot") }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
          <LanguageSwitcher />
        </SafeAreaView>
      </AuthContext.Provider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
