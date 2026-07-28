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

// ==========================================
// Get Current Space Wishlist
// ==========================================
router.get(
  "/",
  protect,
  wishlistController.getWishlist
);

// ==========================================
// Get Personal Wishlist
// ==========================================
router.get(
  "/personal",
  protect,
  wishlistController.getPersonalWishlist
);

// ==========================================
// Get Shared Wishlist
// ==========================================
router.get(
  "/shared",
  protect,
  wishlistController.getSharedWishlist
);

// ==========================================
// Create Wishlist Item
// ==========================================
router.post(
  "/",
  protect,
  createWishlistValidation,
  validate,
  wishlistController.createWishlist
);

// ==========================================
// Share Personal Wishlist Item
// ==========================================
router.post(
  "/:id/share",
  protect,
  wishlistIdValidation,
  validate,
  wishlistController.shareWishlist
);

// ==========================================
// Update Wishlist Item
// ==========================================
router.put(
  "/:id",
  protect,
  wishlistIdValidation,
  updateWishlistValidation,
  validate,
  wishlistController.updateWishlist
);

// ==========================================
// Toggle Bought Status
// ==========================================
router.put(
  "/:id/bought",
  protect,
  wishlistIdValidation,
  validate,
  wishlistController.toggleBought
);

// ==========================================
// React to Wishlist Item
// ==========================================
router.put(
  "/:id/reaction",
  protect,
  wishlistIdValidation,
  reactionValidation,
  validate,
  wishlistController.toggleReaction
);

// ==========================================
// Delete Wishlist Item
// ==========================================
router.delete(
  "/:id",
  protect,
  wishlistIdValidation,
  validate,
  wishlistController.deleteWishlist
);

module.exports = router;