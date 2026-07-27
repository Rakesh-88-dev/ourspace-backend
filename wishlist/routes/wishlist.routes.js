const express = require("express");

const wishlistController = require("../controllers/wishlist.controller");

const protect = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validate");

const {
  createWishlistValidation,
  updateWishlistValidation,
  wishlistIdValidation,
  reactionValidation,
} = require("../validators/wishlist.validator");

const router = express.Router();

// Create Wishlist Item
router.post(
  "/",
  protect,
  createWishlistValidation,
  validate,
  wishlistController.createWishlist
);

// Get All Wishlist Items
router.get(
  "/",
  protect,
  wishlistController.getWishlist
);

// Update Wishlist Item
router.put(
  "/:id",
  protect,
  wishlistIdValidation,
  updateWishlistValidation,
  validate,
  wishlistController.updateWishlist
);

// Toggle Bought Status
router.put(
  "/:id/bought",
  protect,
  wishlistIdValidation,
  validate,
  wishlistController.toggleBought
);

// React to Wishlist Item
router.put(
  "/:id/reaction",
  protect,
  wishlistIdValidation,
  reactionValidation,
  validate,
  wishlistController.toggleReaction
);

// Delete Wishlist Item
router.delete(
  "/:id",
  protect,
  wishlistIdValidation,
  validate,
  wishlistController.deleteWishlist
);

module.exports = router;