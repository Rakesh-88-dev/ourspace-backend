const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validate");

// ✅ Demo Guard
const demoGuard = require("../../demo/middleware/demoGuard");

const specialDateController = require("../controllers/specialDate.controller");

const {
  createSpecialDateValidation,
  updateSpecialDateValidation,
  specialDateIdValidation,
} = require("../validators/specialDate.validator");

// ==========================================
// Create Special Date
// ==========================================

router.post(
  "/",
  protect,
  demoGuard,
  createSpecialDateValidation,
  validate,
  specialDateController.createSpecialDate
);

// ==========================================
// Get All Special Dates
// ==========================================

router.get(
  "/",
  protect,
  specialDateController.getSpecialDates
);

// ==========================================
// Update Special Date
// ==========================================

router.put(
  "/:id",
  protect,
  demoGuard,
  specialDateIdValidation,
  updateSpecialDateValidation,
  validate,
  specialDateController.updateSpecialDate
);

// ==========================================
// Delete Special Date
// ==========================================

router.delete(
  "/:id",
  protect,
  demoGuard,
  specialDateIdValidation,
  validate,
  specialDateController.deleteSpecialDate
);

// ==========================================
// Upcoming Special Dates
// ==========================================

router.get(
  "/upcoming",
  protect,
  specialDateController.getUpcomingSpecialDates
);

// ==========================================
// Today's Special Dates
// ==========================================

router.get(
  "/today",
  protect,
  specialDateController.getTodaySpecialDates
);

// ==========================================
// Pin / Unpin Special Date
// ==========================================

router.patch(
  "/:id/pin",
  protect,
  demoGuard,
  specialDateController.togglePin
);

// ==========================================
// Get Pinned Events
// ==========================================

router.get(
  "/pinned",
  protect,
  specialDateController.getPinnedEvents
);

module.exports = router;