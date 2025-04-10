import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";

const Diet = () => {
  const { t } = useTranslation();

  const [selectedPreference, setSelectedPreference] = useState("Balanced");
  const [vegetables, setVegetables] = useState("");
  const [meats, setMeats] = useState("");
  const [mealPlan, setMealPlan] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });
  const [randomMeal, setRandomMeal] = useState(null);

  const mealSuggestions = {
    Balanced: {
      breakfast: "Oatmeal with banana 🍌",
      lunch: "Grilled chicken & rice 🍗",
      dinner: "Salmon with quinoa 🐟",
    },
    Vegetarian: {
      breakfast: "Smoothie bowl 🍓",
      lunch: "Vegetable stir-fry 🍛",
      dinner: "Lentil soup & bread 🍞",
    },
    Keto: {
      breakfast: "Omelet with spinach 🍳",
      lunch: "Grilled steak & avocado 🥑",
      dinner: "Salmon with butter sauce 🐟",
    },
  };

  // Fetch random meal from API
  const fetchRandomMeal = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      if (data.meals) {
        setRandomMeal(data.meals[0]);
      } else {
        Alert.alert("Error", t("fetch_failed"));
      }
    } catch (error) {
      Alert.alert("Error", t("fetch_error"));
    }
  };

  const generateMealPlan = () => {
    if (!vegetables || !meats) {
      Alert.alert("Error", t("enter_ingredients"));
      return;
    }
    fetchRandomMeal();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t("diet_title")}</Text>

      <Text style={styles.subtitle}>{t("select_preference")}</Text>
      <View style={styles.optionsContainer}>
        {["Balanced", "Vegetarian", "Keto"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedPreference === option && styles.selectedOption,
            ]}
            onPress={() => setSelectedPreference(option)}
          >
            <Text style={styles.optionText}>{t(option.toLowerCase())}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>{t("fav_vegetables")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("veg_placeholder")}
        value={vegetables}
        onChangeText={setVegetables}
      />

      <Text style={styles.subtitle}>{t("fav_meats")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("meat_placeholder")}
        value={meats}
        onChangeText={setMeats}
      />

      <TouchableOpacity
        style={styles.darkBlueButton}
        onPress={generateMealPlan}
      >
        <Text style={styles.darkBlueButtonText}>{t("get_meal_plan")}</Text>
      </TouchableOpacity>

      {(mealPlan.breakfast || randomMeal) && (
        <View style={styles.mealContainer}>
          {mealPlan.breakfast && (
            <>
              <Text style={styles.mealTitle}>{t("daily_meal_plan")}</Text>
              <Text style={styles.mealText}>
                {t("breakfast")}: {mealPlan.breakfast}
              </Text>
              <Text style={styles.mealText}>
                {t("lunch")}: {mealPlan.lunch}
              </Text>
              <Text style={styles.mealText}>
                {t("dinner")}: {mealPlan.dinner}
              </Text>
            </>
          )}
          {randomMeal && (
            <>
              <Text style={styles.mealTitle}>{t("recommended_meal")}</Text>{" "}
              {/* 🏷️ wrap "Recommended Meal:" */}
              <Text style={styles.mealText}>🍽️ {randomMeal.strMeal}</Text>
              <Text style={styles.mealText}>
                🌍 {t("origin")}: {randomMeal.strArea}
              </Text>{" "}
              {/* 🏷️ wrap "Origin" */}
              <Text style={styles.mealText}>
                🥘 {t("category")}: {randomMeal.strCategory}
              </Text>{" "}
              {/* 🏷️ wrap "Category" */}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  optionButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007bff",
    backgroundColor: "#fff",
  },
  selectedOption: { backgroundColor: "#007bff" },
  optionText: { fontSize: 16, color: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#000",
  },
  darkBlueButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#003366",
    borderRadius: 10,
    alignItems: "center",
  },
  darkBlueButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  mealContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#000",
  },
  mealText: { fontSize: 16, marginVertical: 2, color: "#000" },
});

export default Diet;
