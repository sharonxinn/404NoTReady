import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    // Associate each report with a User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: { type: Number }, // kg
    height: { type: Number }, // cm
    bodyTemperature: { type: Number }, // °C
    heartRate: { type: Number }, // bpm
    bloodPressure: { type: String }, // e.g. "120/80"
    oxygenSaturation: { type: Number }, // e.g. 98
    bloodSugar: { type: Number }, // mg/dL
    waterIntake: { type: Number }, // liters
    mealTimes: { type: String }, // user input text
    calorieIntake: { type: Number },
    macronutrients: { type: String }, // user input text for Carbs/Protein/Fats
    exerciseMinutes: { type: Number },
    stepCount: { type: Number },
    sleepDuration: { type: Number }, // hours
    sleepQuality: { type: String }, // e.g. "Good / Fair / Poor"
    workoutType: { type: String },
    moodLevel: { type: String }, // e.g. "Happy / Neutral / Sad"
    stressLevel: { type: String }, // e.g. "High / Medium / Low"

    // If you want to store the AI's generated analysis:
    aiAnalysis: { type: String },

    // Timestamps
  },
  {
    timestamps: true, // automatically adds createdAt, updatedAt
  }
);

export default mongoose.model("Report", reportSchema);
