const wishlistService = require("../services/wishlist.service");
const asyncHandler = require("../../middleware/asyncHandler");

class WishlistController {
  // ==========================================
  // Get Current Space Wishlist
  // ==========================================
  getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user._id);

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  });

  // ==========================================
  // Get Personal Wishlist
  // ==========================================
  getPersonalWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getPersonalWishlist(
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  });

  // ==========================================
  // Get Shared Wishlist
  // ==========================================
  getSharedWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getSharedWishlist(
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  });

  // ==========================================
  // Create Wishlist
  // ==========================================
  createWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.createWishlist(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Wishlist item created successfully.",
      data: wishlist,
    });
  });

  // ==========================================
  // Share Wishlist
  // ==========================================
  shareWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.shareWishlist(
      req.user._id,
      req.params.id
    );

    res.status(201).json({
      success: true,
      message: "Wishlist item shared successfully.",
      data: wishlist,
    });
  });

  // ==========================================
  // Update Wishlist
  // ==========================================
  updateWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.updateWishlist(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Wishlist item updated successfully.",
      data: wishlist,
    });
  });

  // ==========================================
  // Delete Wishlist
  // ==========================================
  deleteWishlist = asyncHandler(async (req, res) => {
    await wishlistService.deleteWishlist(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Wishlist item deleted successfully.",
    });
  });

  // ==========================================
  // Toggle Bought
  // ==========================================
  toggleBought = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.toggleBought(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: `Wishlist item marked as ${
        wishlist.bought ? "bought" : "not bought"
      }.`,
      data: wishlist,
    });
  });

  // ==========================================
  // Toggle Reaction
  // ==========================================
  toggleReaction = asyncHandler(async (req, res) => {
    const { reaction } = req.body;

    const wishlist = await wishlistService.toggleReaction(
      req.user._id,
      req.params.id,
      reaction
    );

    res.status(200).json({
      success: true,
      message: "Reaction updated successfully.",
      data: wishlist,
    });
  });
}

module.exports = new WishlistController();