const wishlistService = require("../services/wishlist.service");
const asyncHandler = require("../../middleware/asyncHandler");

class WishlistController {
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

  getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user._id);

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  });

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