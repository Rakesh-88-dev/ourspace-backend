const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// 👤 GET CURRENT USER
router.get("/me", protect, async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; // ✅ THIS IS CRITICAL