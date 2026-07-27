const { body, param } = require("express-validator");

const createSpecialDateValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),

  body("date")
    .notEmpty()
    .withMessage("Date is required.")
    .isISO8601()
    .withMessage("Invalid date."),

  body("type")
    .optional()
    .isIn([
      "Birthday",
      "Anniversary",
      "Interview",
      "Exam",
      "Meeting",
      "Holiday",
      "Travel",
      "Custom",
    ])
    .withMessage("Invalid special date type."),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters."),

  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be a boolean."),

  body("reminderEnabled")
    .optional()
    .isBoolean()
    .withMessage("reminderEnabled must be a boolean."),

  body("reminderDaysBefore")
    .optional()
    .isInt({ min: 0, max: 365 })
    .withMessage("Reminder days must be between 0 and 365."),
];

const updateSpecialDateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date."),

  body("type")
    .optional()
    .isIn([
      "Birthday",
      "Anniversary",
      "Interview",
      "Exam",
      "Meeting",
      "Holiday",
      "Travel",
      "Custom",
    ])
    .withMessage("Invalid special date type."),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters."),

  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be a boolean."),

  body("reminderEnabled")
    .optional()
    .isBoolean()
    .withMessage("reminderEnabled must be a boolean."),

  body("reminderDaysBefore")
    .optional()
    .isInt({ min: 0, max: 365 })
    .withMessage("Reminder days must be between 0 and 365."),
];

const specialDateIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Special Date ID."),
];

module.exports = {
  createSpecialDateValidation,
  updateSpecialDateValidation,
  specialDateIdValidation,
};