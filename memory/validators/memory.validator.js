const { body, param } = require("express-validator");

// ==========================================
// Create Memory Validation
// ==========================================

const createMemoryValidation = [
  body("space")
    .optional()
    .isIn(["personal", "shared"])
    .withMessage("Space must be either 'personal' or 'shared'."),

  body("title")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),

  body("media.url")
    .notEmpty()
    .withMessage("Media URL is required.")
    .isURL()
    .withMessage("Media URL must be a valid URL."),

  body("media.type")
    .optional()
    .isIn(["image", "video"])
    .withMessage("Media type must be image or video."),

  body("caption")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Caption cannot exceed 1000 characters."),

  body("location")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters."),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array."),

  body("tags.*")
    .optional()
    .isString()
    .trim()
    .withMessage("Each tag must be a string."),

  body("memoryDate")
    .optional()
    .isISO8601()
    .withMessage("Memory date must be a valid date."),
];

// ==========================================
// Update Memory Validation
// ==========================================

const updateMemoryValidation = [
  body("space")
    .optional()
    .isIn(["personal", "shared"])
    .withMessage("Space must be either 'personal' or 'shared'."),

  body("title")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),

  body("media.url")
    .optional()
    .isURL()
    .withMessage("Media URL must be a valid URL."),

  body("media.type")
    .optional()
    .isIn(["image", "video"])
    .withMessage("Media type must be image or video."),

  body("caption")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Caption cannot exceed 1000 characters."),

  body("location")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters."),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array."),

  body("tags.*")
    .optional()
    .isString()
    .trim()
    .withMessage("Each tag must be a string."),

  body("memoryDate")
    .optional()
    .isISO8601()
    .withMessage("Memory date must be a valid date."),

  body("isFavourite")
    .optional()
    .isBoolean()
    .withMessage("Favourite must be true or false."),
];

// ==========================================
// Memory ID Validation
// ==========================================

const memoryIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid memory ID."),
];

module.exports = {
  createMemoryValidation,
  updateMemoryValidation,
  memoryIdValidation,
};