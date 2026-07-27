const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validate");

const specialDateController = require("../controllers/specialDate.controller");

const {
  createSpecialDateValidation,
  updateSpecialDateValidation,
  specialDateIdValidation,
} = require("../validators/specialDate.validator");

router.post(
  "/",
  protect,
  createSpecialDateValidation,
  validate,
  specialDateController.createSpecialDate
);

router.get(
  "/",
  protect,
  specialDateController.getSpecialDates
);

router.put(
  "/:id",
  protect,
  specialDateIdValidation,
  updateSpecialDateValidation,
  validate,
  specialDateController.updateSpecialDate
);

router.delete(
  "/:id",
  protect,
  specialDateIdValidation,
  validate,
  specialDateController.deleteSpecialDate
);

router.get(
  "/upcoming",
  protect,
  specialDateController.getUpcomingSpecialDates
);

router.get(
  "/today",
  protect,
  specialDateController.getTodaySpecialDates
);

router.patch(
  "/:id/pin",
  protect,
  specialDateController.togglePin
);

router.get(
  "/pinned",
  protect,
  specialDateController.getPinnedEvents
);

module.exports = router;