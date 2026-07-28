const { body, param } = require("express-validator");

const createWishlistValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),
    
body("link")
  .optional({ values: "falsy" })
  .trim()
  .isURL()
  .withMessage("Link must be a valid URL."),

  body("image")
  .optional({ values: "falsy" })
  .trim()
  .isURL()
  .withMessage("Image must be a valid URL."),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters."),
];

const updateWishlistValidation = [
  body("space")
    .optional()
    .trim()
    .isIn(["personal", "shared"])
    .withMessage("Space must be either 'personal' or 'shared'."),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty.")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),

 body("link")
  .optional({ values: "falsy" })
  .trim()
  .isURL()
  .withMessage("Link must be a valid URL."),

  body("image")
  .optional({ values: "falsy" })
  .trim()
  .isURL()
  .withMessage("Image must be a valid URL."),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters."),
];

const wishlistIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid wishlist ID."),
];

const reactionValidation = [
  body("reaction")
    .trim()
    .notEmpty()
    .withMessage("Reaction is required.")
    .isLength({ max: 10 })
    .withMessage("Reaction cannot exceed 10 characters."),
];

module.exports = {
  createWishlistValidation,
  updateWishlistValidation,
  wishlistIdValidation,
  reactionValidation,
};