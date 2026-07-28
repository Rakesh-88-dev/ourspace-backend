const Wishlist = require("../../models/Wishlist");

class WishlistRepository {
  // =============================
  // CREATE
  // =============================

  async create(data) {
    return Wishlist.create(data);
  }

  // =============================
  // FIND BY ID
  // =============================

  async findById(id) {
    return Wishlist.findById(id);
  }

  // =============================
  // PERSONAL WISHLIST
  // =============================

  async findPersonalWishlist(userId) {
    return Wishlist.find({
      createdBy: userId,
      visibility: "personal",
    }).sort({
      createdAt: -1,
    });
  }

  // =============================
  // SHARED WISHLIST
  // =============================

  async findSharedWishlist(relationshipId) {
    return Wishlist.find({
      relationship: relationshipId,
      visibility: "shared",
    })
      .populate("createdBy", "name avatar")
      .sort({
        createdAt: -1,
      });
  }

  // =============================
  // UPDATE
  // =============================

  async update(id, data) {
    return Wishlist.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  // =============================
  // DELETE
  // =============================

  async delete(id) {
    return Wishlist.findByIdAndDelete(id);
  }

  // =============================
  // SAVE
  // =============================

  async save(wishlist) {
    return wishlist.save();
  }

  // ==========================================
// Find Shared Wishlist by Source
// ==========================================
async findSharedBySource(sourceWishlistId, relationshipId) {
  return Wishlist.findOne({
    sourceWishlist: sourceWishlistId,
    relationship: relationshipId,
    visibility: "shared",
  });
}




}



module.exports = new WishlistRepository();