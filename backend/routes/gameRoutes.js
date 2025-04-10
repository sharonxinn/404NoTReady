import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   POST /api/games/score
 * @desc    Save a game score for the currently logged-in user (by session)
 * @access  Private
 */
router.post("/score", async (req, res) => {
  const { score } = req.body;
  // Check the session user ID
  const userId = req.session.user;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - not logged in" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // "gameScores" array is defined in our schema, so we can safely push
    user.gameScores.push({ date: new Date(), score });
    await user.save();

    res.json({ message: "Score added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/games/scores/:userId
 * @desc    Get all game scores for a specific user
 * @access  Public or Private (adjust if you use sessions)
 */
router.get("/scores/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ gameScores: user.gameScores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
