const { body, param } = require("express-validator");

const createMemoryValidation = [
  body("imageUrl")
    .notEmpty()
    .withMessage("Image URL is required.")
    .isURL()
    .withMessage("Image URL must be a valid URL."),

  body("caption")
    .optional()
    .isString()
    .withMessage("Caption must be a string.")
    .isLength({ max: 500 })
    .withMessage("Caption cannot exceed 500 characters."),
];

const updateMemoryValidation = [
  body("caption")
    .optional()
    .isString()
    .withMessage("Caption must be a string.")
    .isLength({ max: 500 })
    .withMessage("Caption cannot exceed 500 characters."),
];

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