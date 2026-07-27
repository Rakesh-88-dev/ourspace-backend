const WishlistRepository = require("../wishlist/wishlist.query");
const { TOOL_TYPES } = require("./tool.types");

const WishlistTool = {
  [TOOL_TYPES.CREATE_WISHLIST_ITEM]: async ({
    args,
    context,
  }) => {
    return WishlistRepository.addWishlistItem({
      userId: context.userId,
      item: args,
    });
  },

  [TOOL_TYPES.GET_WISHLIST]: async ({
    context,
  }) => {
    return WishlistRepository.getWishlist({
      userId: context.userId,
    });
  },

  [TOOL_TYPES.UPDATE_WISHLIST_ITEM]: async ({
    args,
    context,
  }) => {
    return WishlistRepository.updateWishlistItem({
      userId: context.userId,
      title: args.title,
      updates: args.updates,
    });
  },

  [TOOL_TYPES.DELETE_WISHLIST_ITEM]: async ({
    args,
    context,
  }) => {
    return WishlistRepository.deleteWishlistItem({
      userId: context.userId,
      title: args.title,
    });
  },
};

module.exports = WishlistTool;