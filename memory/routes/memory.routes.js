const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validate");
const demoGuard = require("../../demo/middleware/demoGuard");

const memoryController = require("../controllers/memory.controller");

const {
  createMemoryValidation,
  updateMemoryValidation,
  memoryIdValidation,
} = require("../validators/memory.validator");

// ==========================================
// Create Memory
// ==========================================

router.post(
  "/",
  protect,
  demoGuard,
  createMemoryValidation,
  validate,
  memoryController.createMemory
);

// ==========================================
// Get Memories
// Personal / Shared
// ==========================================

router.get(
  "/",
  protect,
  memoryController.getMemories
);

// ==========================================
// Get Dashboard Memories
// Personal + Shared
// ==========================================

router.get(
  "/dashboard",
  protect,
  memoryController.getDashboardMemories
);

// ==========================================
// On This Day
// ==========================================

router.get(
  "/on-this-day",
  protect,
  memoryController.getOnThisDay
);

// ==========================================
// Generate Aura Reflection
// ==========================================

router.post(
  "/:id/reflection",
  protect,
  demoGuard,
  memoryIdValidation,
  validate,
  memoryController.generateReflection
);

// ==========================================
// Update Memory
// ==========================================

router.put(
  "/:id",
  protect,
  demoGuard,
  memoryIdValidation,
  updateMemoryValidation,
  validate,
  memoryController.updateMemory
);

// ==========================================
// Move Memory
// ==========================================

router.patch(
  "/:id/move",
  protect,
  demoGuard,
  memoryIdValidation,
  validate,
  memoryController.moveMemory
);

// ==========================================
// Like / Unlike Memory
// ==========================================

router.put(
  "/:id/like",
  protect,
  demoGuard,
  memoryIdValidation,
  validate,
  memoryController.toggleLike
);

// ==========================================
// Delete Memory
// ==========================================

router.delete(
  "/:id",
  protect,
  demoGuard,
  memoryIdValidation,
  validate,
  memoryController.deleteMemory
);

module.exports = router;