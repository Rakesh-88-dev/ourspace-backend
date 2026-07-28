const wishlistRepository = require("../repositories/wishlist.repository");
const { spaceService } = require("../../space");

const NotFoundError = require("../../errors/NotFoundError");
const ForbiddenError = require("../../errors/ForbiddenError");

class WishlistService {
  // ==========================================
  // Determine Wishlist Context
  // ==========================================
  async getWishlistContext(userId) {
  return await spaceService.getCurrentSpace(userId);
}

    // ==========================================
  // Get Wishlist
  // ==========================================
  async getWishlist(userId) {
    const context = await this.getWishlistContext(userId);

    if (context.type === "shared") {
      return wishlistRepository.findSharedWishlist(
        context.relationship._id
      );
    }

    return wishlistRepository.findPersonalWishlist(userId);
  }

  // ==========================================
  // Get Personal Wishlist
  // ==========================================
  async getPersonalWishlist(userId) {
    return wishlistRepository.findPersonalWishlist(userId);
  }

  // ==========================================
  // Get Shared Wishlist
  // ==========================================
  async getSharedWishlist(userId) {
    const context = await spaceService.getCurrentSpace(userId);

    // User isn't connected yet
    if (context.type !== "shared") {
      return [];
    }

    return wishlistRepository.findSharedWishlist(
      context.relationship._id
    );
  }

  // ==========================================
  // Create Wishlist
  // ==========================================
  async createWishlist(userId, wishlistData) {
  const currentSpace = await this.getWishlistContext(userId);

  // Requested space from frontend
  const requestedSpace = wishlistData.space;

  // Remove it so it isn't stored in MongoDB
  delete wishlistData.space;

  // ==========================================
  // PERSONAL SPACE
  // ==========================================
  if (requestedSpace === "personal") {
    return wishlistRepository.create({
      ...wishlistData,
      createdBy: userId,
      relationship: null,
      visibility: "personal",
    });
  }

  // ==========================================
  // SHARED SPACE
  // ==========================================
  if (requestedSpace === "shared") {
    if (currentSpace.type !== "shared") {
      throw new ForbiddenError(
        "You must connect with a partner to create a shared wishlist."
      );
    }

    return wishlistRepository.create({
      ...wishlistData,
      createdBy: userId,
      relationship: currentSpace.relationship._id,
      visibility: "shared",
    });
  }

  // ==========================================
  // DEFAULT BEHAVIOUR (Backward Compatibility)
  // ==========================================

  // Connected user → Shared
  if (currentSpace.type === "shared") {
    return wishlistRepository.create({
      ...wishlistData,
      createdBy: userId,
      relationship: currentSpace.relationship._id,
      visibility: "shared",
    });
  }

  // Single user → Personal
  return wishlistRepository.create({
    ...wishlistData,
    createdBy: userId,
    relationship: null,
    visibility: "personal",
  });
}

  // ==========================================
// Share Wishlist
// ==========================================
async shareWishlist(userId, wishlistId) {
  // Find the personal wishlist item
  const wishlist = await wishlistRepository.findById(wishlistId);

  if (!wishlist) {
    throw new NotFoundError("Wishlist item not found.");
  }

  // Only personal wishlist can be shared
  if (wishlist.visibility !== "personal") {
    throw new ForbiddenError(
      "Only personal wishlist items can be shared."
    );
  }

  // Verify ownership
  if (!wishlist.createdBy.equals(userId)) {
    throw new ForbiddenError(
      "You are not authorized to share this wishlist item."
    );
  }

  // Get current space
  const space = await spaceService.getCurrentSpace(userId);

  if (space.type !== "shared") {
    throw new ForbiddenError(
      "Connect with your partner to share wishlist items."
    );
  }

  // Check if already shared
  const existingShared =
    await wishlistRepository.findSharedBySource(
      wishlist._id,
      space.relationship._id
    );

  if (existingShared) {
    throw new ForbiddenError(
      "This wishlist item has already been shared."
    );
  }

  // Create shared copy
  return wishlistRepository.create({
    title: wishlist.title,
    link: wishlist.link,
    image: wishlist.image,
    category: wishlist.category,

    bought: wishlist.bought,

    createdBy: userId,

    sourceWishlist: wishlist._id,

    relationship: space.relationship._id,

    visibility: "shared",
  });
}

  // ==========================================
  // Check Access
  // ==========================================
  async verifyAccess(userId, wishlist) {
    if (wishlist.visibility === "personal") {
      if (!wishlist.createdBy.equals(userId)) {
        throw new ForbiddenError(
          "You are not authorized to access this wishlist item."
        );
      }

      return;
    }

    const space = await spaceService.getCurrentSpace(userId);

if (space.type !== "shared") {
  throw new ForbiddenError(
    "You are not authorized to access this wishlist item."
  );
}

if (!wishlist.relationship.equals(space.relationship._id)) {
  throw new ForbiddenError(
    "You are not authorized to access this wishlist item."
  );
}
  }

  // ==========================================
  // Update Wishlist
  // ==========================================
  async updateWishlist(userId, wishlistId, updateData) {
    const wishlist =
      await wishlistRepository.findById(wishlistId);

    if (!wishlist) {
      throw new NotFoundError(
        "Wishlist item not found."
      );
    }

    await this.verifyAccess(userId, wishlist);

    return wishlistRepository.update(
      wishlistId,
      updateData
    );
  }

  // ==========================================
  // Delete Wishlist
  // ==========================================
  async deleteWishlist(userId, wishlistId) {
    const wishlist =
      await wishlistRepository.findById(wishlistId);

    if (!wishlist) {
      throw new NotFoundError(
        "Wishlist item not found."
      );
    }

    await this.verifyAccess(userId, wishlist);

    await wishlistRepository.delete(wishlistId);
  }

  // ==========================================
  // Toggle Bought
  // ==========================================
  async toggleBought(userId, wishlistId) {
    const wishlist =
      await wishlistRepository.findById(wishlistId);

    if (!wishlist) {
      throw new NotFoundError(
        "Wishlist item not found."
      );
    }

    await this.verifyAccess(userId, wishlist);

    wishlist.bought = !wishlist.bought;

    return wishlistRepository.save(wishlist);
  }

  // ==========================================
  // Toggle Reaction
  // ==========================================
  async toggleReaction(userId, wishlistId, emoji) {
    const wishlist =
      await wishlistRepository.findById(wishlistId);

    if (!wishlist) {
      throw new NotFoundError(
        "Wishlist item not found."
      );
    }

    await this.verifyAccess(userId, wishlist);

    const existingReaction =
      wishlist.reactions.find(
        (reaction) =>
          reaction.user.toString() ===
          userId.toString()
      );

    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        wishlist.reactions =
          wishlist.reactions.filter(
            (reaction) =>
              reaction.user.toString() !==
              userId.toString()
          );
      } else {
        existingReaction.emoji = emoji;
      }
    } else {
      wishlist.reactions.push({
        user: userId,
        emoji,
      });
    }

    return wishlistRepository.save(wishlist);
  }
}

module.exports = new WishlistService();