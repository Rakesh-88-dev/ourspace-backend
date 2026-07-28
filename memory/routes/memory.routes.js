const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validate");

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
  createMemoryValidation,
  validate,
  memoryController.createMemory
);

// ==========================================
// Get Memories
// Query: ?space=shared | personal
// ==========================================

router.get(
  "/",
  protect,
  memoryController.getMemories
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
// Update Memory
// ==========================================

router.put(
  "/:id",
  protect,
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
  memoryIdValidation,
  validate,
  memoryController.toggleLike
);

// ==========================================
// Delete Memory (Soft Delete)
// ==========================================

router.delete(
  "/:id",
  protect,
  memoryIdValidation,
  validate,
  memoryController.deleteMemory
);

module.exports = router;