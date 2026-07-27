const wishlistRepository = require("../repositories/wishlist.repository");
const relationshipRepository = require("../../relationship/repositories/relationship.repository");

const NotFoundError = require("../../errors/NotFoundError");
const ForbiddenError = require("../../errors/ForbiddenError");

class WishlistService {
  async getActiveRelationship(userId) {
    const relationship =
      await relationshipRepository.findActiveRelationship(userId);

    if (!relationship) {
      throw new ForbiddenError(
        "You must connect with a partner before using Wishlist."
      );
    }

    return relationship;
  }

  async createWishlist(userId, wishlistData) {
    const relationship = await this.getActiveRelationship(userId);

    return wishlistRepository.create({
      ...wishlistData,
      relationship: relationship._id,
      createdBy: userId,
    });
  }

  async getWishlist(userId) {
    const relationship = await this.getActiveRelationship(userId);

    return wishlistRepository.findByRelationship(relationship._id);
  }

  async updateWishlist(userId, wishlistId, updateData) {
    const relationship = await this.getActiveRelationship(userId);

    const wishlist = await wishlistRepository.findById(wishlistId);

    if (!wishlist) {
      throw new NotFoundError("Wishlist item not found.");
    }

    if (!wishlist.relationship.equals(relationship._id)) {
      throw new ForbiddenError(
        "You are not authorized to update this wishlist item."
      );
    }

    return wishlistRepository.update(wishlistId, updateData);
  }

  async deleteWishlist(userId, wishlistId) {
    const relationship = await this.getActiveRelationship(userId);

    const wishlist = await wishlistRepository.findById(wishlistId);

    if (!wishlist) {
      throw new NotFoundError("Wishlist item not found.");
    }

    if (!wishlist.relationship.equals(relationship._id)) {
      throw new ForbiddenError(
        "You are not authorized to delete this wishlist item."
      );
    }

    await wishlistRepository.delete(wishlistId);
  }

  async toggleBought(userId, wishlistId) {
    const relationship = await this.getActiveRelationship(userId);

    const wishlist = await wishlistRepository.findById(wishlistId);

    if (!wishlist) {
      throw new NotFoundError("Wishlist item not found.");
    }

    if (!wishlist.relationship.equals(relationship._id)) {
      throw new ForbiddenError(
        "You are not authorized to modify this wishlist item."
      );
    }

    wishlist.bought = !wishlist.bought;

    return wishlistRepository.save(wishlist);
  }

 async toggleReaction(userId, wishlistId, emoji) {
  const relationship = await this.getActiveRelationship(userId);

  const wishlist = await wishlistRepository.findById(wishlistId);

  if (!wishlist) {
    throw new NotFoundError("Wishlist item not found.");
  }

  if (!wishlist.relationship.equals(relationship._id)) {
    throw new ForbiddenError(
      "You are not authorized to react to this wishlist item."
    );
  }

 const existingReaction = wishlist.reactions.find(
  (reaction) => reaction.user.toString() === userId.toString()
);

if (existingReaction) {
  if (existingReaction.emoji === emoji) {
    wishlist.reactions = wishlist.reactions.filter(
      (reaction) => reaction.user.toString() !== userId.toString()
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