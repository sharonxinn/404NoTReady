import express from "express";
import Report from "../models/Report.js"; // The Mongoose model you showed
import User from "../models/User.js"; // Only if you want to verify the user exists

const router = express.Router();

/**
 * @route   POST /api/report
 * @desc    Save a new health report for the currently logged-in user (by session)
 * @access  Private (requires session)
 */
router.post("/generated", async (req, res) => {
  // 1) Confirm the user is logged in by checking session
  const userId = req.session.user;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - not logged in" });
  }

  // 2) Extract the report data from the request body
  const {
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
  } = req.body;

  try {
    // (Optional) check if the user actually exists in DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3) Create a new report document
    const newReport = new Report({
      userId, // store the user ID
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
    });

    // 4) Save the report to MongoDB
    await newReport.save();

    // 5) Return a success response
    res.json({ message: "Report added successfully", report: newReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/report/:userId
 * @desc    Get all reports for a specific user
 * @access  Public or Private (depending on your needs)
 */
router.get("/:userId", async (req, res) => {
  try {
    // 1) Check if user with userId exists (optional)
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2) Find all reports belonging to that user
    const reports = await Report.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    // 3) Return the reports
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
