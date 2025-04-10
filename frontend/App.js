import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, View, StyleSheet, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import Dashboard from "./screens/Dashboard";
import Inventory from "./screens/Inventory";
import Chatbot from "./screens/Chatbot";
import Insights from "./services/Insights";
import Account from "./screens/Account";
import LanguageSwitcher from "./src/components/LanguageSwitcher";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MainTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: t("Dashboard"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Insights"
        component={Insights}
        options={{
          title: t("Insights"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Chatbot"
        component={Chatbot}
        options={{
          title: t("MEX"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Inventory"
        component={Inventory}
        options={{
          title: t("Inventory"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="archive" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          title: t("Account"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Screen
              name="Dashboard"
              component={MainTabs}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      <LanguageSwitcher />
    </SafeAreaView>
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
