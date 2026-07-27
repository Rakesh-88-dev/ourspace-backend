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

router.post(
  "/",
  protect,
  createMemoryValidation,
  validate,
  memoryController.createMemory
);

router.get(
  "/",
  protect,
  memoryController.getMemories
);

router.get(
  "/on-this-day",
  protect,
  memoryController.getOnThisDay
);

router.put(
  "/:id",
  protect,
  memoryIdValidation,
  updateMemoryValidation,
  validate,
  memoryController.updateMemory
);

router.put(
  "/:id/like",
  protect,
  memoryIdValidation,
  validate,
  memoryController.toggleLike
);

router.delete(
  "/:id",
  protect,
  memoryIdValidation,
  validate,
  memoryController.deleteMemory
);

module.exports = router;