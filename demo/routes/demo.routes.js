const express = require("express");

const router = express.Router();

const demoController = require("../controllers/demo.controller");
const healthController = require("../controllers/health.controller");



// ==========================================
// Health
// ==========================================

router.get(
  "/health",
  healthController.getHealth
);

// ==========================================
// Demo Information
// ==========================================

router.get(
  "/info",
  demoController.getInfo
);

// ==========================================
// Demo Session
// ==========================================

router.post(
  "/session",
  demoController.createSession
);

module.exports = router;

// =============================
// Demo APIs
// =============================

// Get demo information
router.get(
  "/info",
  demoController.getInfo
);

// Create demo session
router.post(
  "/session",
  demoController.createSession
);

module.exports = router;