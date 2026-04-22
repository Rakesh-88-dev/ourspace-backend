const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile,updateProfile,addSpecialDate } = require("../controllers/authController");

// ✅ FIXED IMPORT (NO destructuring)
const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/profile", protect,getUserProfile);
router.put("/profile", protect, updateProfile);
router.post("/special-date", protect, addSpecialDate);


module.exports = router;