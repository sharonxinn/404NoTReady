import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   POST /api/health/bmi
 * @desc    Store/replace the user's latest BMI data
 * @access  Private (session-based)
 */
router.post("/bmi", async (req, res) => {
  // 1) Check if the user is logged in
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized - not logged in" });
  }
  const userId = req.session.user;

  // 2) Extract data from the request body
  const { height, weight, age } = req.body;

  // 3) Optionally compute BMI on the server
  // If any field is missing, you can handle it or allow partial updates
  let computedBmi = null;
  if (height && weight) {
    const heightMeters = Number(height) / 100;
    computedBmi = (Number(weight) / (heightMeters * heightMeters)).toFixed(2);
  }

  try {
    // 4) Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 5) Overwrite or set the user's latest BMI fields
    // If they already exist, we are now replacing them.
    user.latestHeight = height || null;
    user.latestWeight = weight || null;
    user.latestAge = age || null;
    user.latestBmi = computedBmi; // or pass in from client if you prefer

    // 6) Save to DB
    await user.save();

    res.json({
      message: "Latest BMI data updated successfully",
      latestBmi: user.latestBmi,
      height: user.latestHeight,
      weight: user.latestWeight,
      age: user.latestAge,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/health/heartrate
 * @desc    Overwrite the heartRateWeek array for the logged-in user
 * @access  Private
 */
router.post("/heartrate", async (req, res) => {
  const userId = req.session.user;
  if (!userId)
    return res.status(401).json({ message: "Unauthorized - not logged in" });

  const { heartRateWeek } = req.body; // Expect an array of length 7

  if (!Array.isArray(heartRateWeek) || heartRateWeek.length !== 7) {
    return res
      .status(400)
      .json({ message: "heartRateWeek must be an array of 7 numbers" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.heartRateWeek = heartRateWeek; // Overwrite
    await user.save();

    res.json({
      message: "Heart rate updated successfully",
      heartRateWeek: user.heartRateWeek,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/health/steps
 * @desc    Overwrite the stepsWeek array for the logged-in user
 * @access  Private
 */
router.post("/steps", async (req, res) => {
  const userId = req.session.user;
  if (!userId)
    return res.status(401).json({ message: "Unauthorized - not logged in" });

  const { stepsWeek } = req.body; // Expect an array of length 7

  if (!Array.isArray(stepsWeek) || stepsWeek.length !== 7) {
    return res
      .status(400)
      .json({ message: "stepsWeek must be an array of 7 numbers" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.stepsWeek = stepsWeek; // Overwrite
    await user.save();

    res.json({
      message: "Steps updated successfully",
      stepsWeek: user.stepsWeek,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/health/cals
 * @desc    Add a new calorie record for the logged-in user
 * @access  Private
 */
router.post("/cals", async (req, res) => {
  const userId = req.session.user;
  if (!userId)
    return res.status(401).json({ message: "Unauthorized - not logged in" });

  // Expect 'burned' and 'consumed' in request body
  const { burned, consumed } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // push a new record with date_created automatically set
    user.calorieRecords.push({
      burned: Number(burned) || 0,
      consumed: Number(consumed) || 0,
    });

    await user.save();
    res.json({
      message: "Calorie record added successfully",
      calorieRecords: user.calorieRecords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
