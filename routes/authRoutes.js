const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ===========================
// Authentication
// ===========================

router.post(
  "/register",
  upload.single("avatar"),
  authController.registerUser
);

router.post("/login", authController.loginUser);

// ⭐ NEW Demo Login Route
router.post("/demo-login", authController.demoLogin);

// ===========================
// Profile
// ===========================

router.get(
  "/profile",
  protect,
  authController.getUserProfile
);

router.put(
  "/profile",
  protect,
  authController.updateProfile
);

// ===========================
// Special Date
// ===========================

router.post(
  "/special-date",
  protect,
  authController.addSpecialDate
);

module.exports = router;