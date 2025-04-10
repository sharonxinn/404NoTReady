import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   POST /api/diet/entry
 * @desc    Add a diet entry for a user
 * @access  Public or Private (adjust if you use sessions)
 */
router.post("/entry", async (req, res) => {
  const { userId, mealType, food } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.dietEntries.push({ date: new Date(), mealType, food });
    await user.save();

    res.json({ message: "Diet entry added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/diet/entries/:userId
 * @desc    Get all diet entries for a user
 * @access  Public or Private (adjust if you use sessions)
 */
router.get("/entries/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ dietEntries: user.dietEntries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
