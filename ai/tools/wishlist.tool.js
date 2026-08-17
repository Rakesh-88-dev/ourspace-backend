const WishlistRepository = require("../wishlist/wishlist.query");
const { TOOL_TYPES } = require("./tool.types");

/**
 * Wishlist Tool Handlers
 */
const WishlistTool = {
  // =====================================================
  // CREATE WISHLIST ITEM
  // =====================================================

  [TOOL_TYPES.CREATE_WISHLIST_ITEM]: async ({
    args,
    context,
  }) => {
    const userId =
      context?.actor?.userId ||
      context?.userId;

    if (!userId) {
      throw new Error(
        "Authenticated user is required for wishlist access."
      );
    }

    return WishlistRepository.addWishlistItem({
      userId,
      item: args,
    });
  },

  // =====================================================
  // GET WISHLIST
  // =====================================================

  [TOOL_TYPES.GET_WISHLIST]: async ({
    context,
  }) => {
    const userId =
      context?.actor?.userId ||
      context?.userId;

    if (!userId) {
      throw new Error(
        "Authenticated user is required for wishlist access."
      );
    }

    const items =
      await WishlistRepository.getWishlist({
        userId,
      });

    return {
      success: true,
      items,
      count: items.length,
    };
  },

  // =====================================================
  // UPDATE WISHLIST ITEM
  // =====================================================

  [TOOL_TYPES.UPDATE_WISHLIST_ITEM]: async ({
    args,
    context,
  }) => {
    const userId =
      context?.actor?.userId ||
      context?.userId;

    if (!userId) {
      throw new Error(
        "Authenticated user is required for wishlist access."
      );
    }

    return WishlistRepository.updateWishlistItem({
      userId,
      title: args.title,
      updates: args.updates,
    });
  },

  // =====================================================
  // DELETE WISHLIST ITEM
  // =====================================================

  [TOOL_TYPES.DELETE_WISHLIST_ITEM]: async ({
    args,
    context,
  }) => {
    const userId =
      context?.actor?.userId ||
      context?.userId;

    if (!userId) {
      throw new Error(
        "Authenticated user is required for wishlist access."
      );
    }

    return WishlistRepository.deleteWishlistItem({
      userId,
      title: args.title,
    });
  },
};

module.exports = WishlistTool;