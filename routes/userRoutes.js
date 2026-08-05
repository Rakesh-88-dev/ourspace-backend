const express = require("express");
const router = express.Router();

const User = require("../models/User");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Controllers
const userController = require("../controllers/userController");

// Demo Guard
const demoGuard = require("../demo/middleware/demoGuard");

// ======================================================
// GET ALL USERS (except myself)
// ======================================================

router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");

    res.json(users);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

// ======================================================
// GET MY PROFILE
// ======================================================

router.get(
  "/me",
  protect,
  userController.getProfile
);

// ======================================================
// UPDATE PROFILE
// ======================================================

router.put(
  "/me",
  protect,
  demoGuard,
  upload.single("avatar"),
  userController.updateProfile
);

module.exports = router;