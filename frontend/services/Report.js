import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  Alert,
} from "react-native";

const AiHealthReport = () => {
  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
  const API_KEY_V2 = process.env.EXPO_PUBLIC_API_URL;

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bodyTemperature, setBodyTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [mealTimes, setMealTimes] = useState("");
  const [calorieIntake, setCalorieIntake] = useState("");
  const [macronutrients, setMacronutrients] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [stepCount, setStepCount] = useState("");
  const [sleepDuration, setSleepDuration] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [moodLevel, setMoodLevel] = useState("");
  const [stressLevel, setStressLevel] = useState("");

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1) This function calls OpenAI to get an AI-based "report"
  const getAiAnalysisFromOpenAI = async () => {
    // Build a string with all inputs
    const userInputsText = `
Weight: ${weight} kg
Height: ${height} cm
Body Temperature: ${bodyTemperature} °C
Heart Rate: ${heartRate} bpm
Blood Pressure: ${bloodPressure} mmHg
Oxygen Saturation: ${oxygenSaturation}%
Blood Sugar: ${bloodSugar} mg/dL
Water Intake: ${waterIntake} liters
Meal Times & Type: ${mealTimes}
Calorie Intake: ${calorieIntake}
Macronutrients: ${macronutrients}
Exercise Minutes: ${exerciseMinutes}
Step Count: ${stepCount}
Sleep Duration: ${sleepDuration} hours
Sleep Quality: ${sleepQuality}
Workout Type: ${workoutType}
Mood Level: ${moodLevel}
Stress Level: ${stressLevel}
`;

    const prompt = `
You are a helpful medical AI assistant. The user has provided these health metrics:

${userInputsText}

Please provide:
1) A quick summary of their metrics (including approximate BMI).
2) Observations or suggestions for improvement.
3) Any interesting insights (like correlation between mood and sleep, or consistency in water intake).
`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a medical AI assistant." },
              { role: "user", content: prompt },
            ],
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error calling OpenAI API");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI Error:", error);
      throw error; // rethrow to handle outside
    }
  };

  // 2) After we get the AI analysis, post all data + analysis to the backend
  const postReportToBackend = async (analysis) => {
    try {
      // If your backend requires a session cookie, also set credentials: "include"
      const response = await fetch(`${API_KEY_V2}/api/report/generated`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          weight,
          height,
          bodyTemperature,
          heartRate,
          bloodPressure,
          oxygenSaturation,
          bloodSugar,
          waterIntake,
          mealTimes,
          calorieIntake,
          macronutrients,
          exerciseMinutes,
          stepCount,
          sleepDuration,
          sleepQuality,
          workoutType,
          moodLevel,
          stressLevel,
          aiAnalysis: analysis,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert(
          "Success",
          result.message || "Report submitted successfully"
        );
      } else {
        Alert.alert("Error", result.error || "Failed to submit report");
      }
    } catch (error) {
      console.error("Backend Error:", error);
      Alert.alert("Error", "Failed to post report to the backend");
    }
  };

  // 3) Single function to handle the entire "Submit Report" process
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Step A: Get the AI analysis from OpenAI
      const analysis = await getAiAnalysisFromOpenAI();

      // Step B: Save that analysis + user data to your backend
      setAiAnalysis(analysis); // So user can see it
      // await postReportToBackend(analysis);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Health Report</Text>

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Height (cm)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Body Temperature (°C)</Text>
      <TextInput
        style={styles.input}
        value={bodyTemperature}
        onChangeText={setBodyTemperature}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Heart Rate (bpm)</Text>
      <TextInput
        style={styles.input}
        value={heartRate}
        onChangeText={setHeartRate}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Blood Pressure (mmHg)</Text>
      <TextInput
        style={styles.input}
        value={bloodPressure}
        onChangeText={setBloodPressure}
        placeholder="e.g. 120/80"
      />

      <Text style={styles.label}>Oxygen Saturation (%)</Text>
      <TextInput
        style={styles.input}
        value={oxygenSaturation}
        onChangeText={setOxygenSaturation}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Blood Sugar (mg/dL)</Text>
      <TextInput
        style={styles.input}
        value={bloodSugar}
        onChangeText={setBloodSugar}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Water Intake (liters)</Text>
      <TextInput
        style={styles.input}
        value={waterIntake}
        onChangeText={setWaterIntake}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Meal Times & Type</Text>
      <TextInput
        style={styles.input}
        value={mealTimes}
        onChangeText={setMealTimes}
        placeholder="e.g. Breakfast at 8am, Chicken salad"
      />

      <Text style={styles.label}>Calorie Intake</Text>
      <TextInput
        style={styles.input}
        value={calorieIntake}
        onChangeText={setCalorieIntake}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Macronutrients</Text>
      <TextInput
        style={styles.input}
        value={macronutrients}
        onChangeText={setMacronutrients}
        placeholder="e.g. Carbs: 200g, Protein: 50g, Fat: 60g"
      />

      <Text style={styles.label}>Exercise Minutes</Text>
      <TextInput
        style={styles.input}
        value={exerciseMinutes}
        onChangeText={setExerciseMinutes}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Step Count</Text>
      <TextInput
        style={styles.input}
        value={stepCount}
        onChangeText={setStepCount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Sleep Duration (hours)</Text>
      <TextInput
        style={styles.input}
        value={sleepDuration}
        onChangeText={setSleepDuration}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Sleep Quality</Text>
      <TextInput
        style={styles.input}
        value={sleepQuality}
        onChangeText={setSleepQuality}
        placeholder="Good / Fair / Poor"
      />

      <Text style={styles.label}>Workout Type</Text>
      <TextInput
        style={styles.input}
        value={workoutType}
        onChangeText={setWorkoutType}
        placeholder="Strength / Cardio / Yoga / Skateboard"
      />

      <Text style={styles.label}>Mood Level</Text>
      <TextInput
        style={styles.input}
        value={moodLevel}
        onChangeText={setMoodLevel}
        placeholder="Happy / Neutral / Sad / etc."
      />

      <Text style={styles.label}>Stress Level</Text>
      <TextInput
        style={styles.input}
        value={stressLevel}
        onChangeText={setStressLevel}
        placeholder="High / Medium / Low"
      />

      <View style={{ marginVertical: 10 }}>
        <Button
          title={loading ? "Analyzing..." : "Submit Report"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>

      {aiAnalysis && (
        <View style={styles.aiContainer}>
          <Text style={styles.aiTitle}>AI Analysis</Text>
          <Text style={styles.aiText}>{aiAnalysis}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AiHealthReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
    backgroundColor: "#fff",
  },
  aiContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e2e2e2",
    borderRadius: 8,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  aiText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
