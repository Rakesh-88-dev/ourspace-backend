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
// COUNT SHARED WISHLIST
// =============================

async countSharedWishlist(
  relationshipId
) {
  return Wishlist.countDocuments({
    relationship: relationshipId,
    visibility: "shared",
  });
}

// =============================
// COUNT COMPLETED SHARED WISHLIST
// =============================

async countCompletedSharedWishlist(
  relationshipId
) {
  return Wishlist.countDocuments({
    relationship: relationshipId,
    visibility: "shared",
    bought: true,
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
// RETURN SHARED WISHLIST TO OWNERS
// =============================

async returnSharedWishlistToOwners(
  relationshipId,
  session
) {
  return Wishlist.updateMany(
    {
      relationship: relationshipId,
      visibility: "shared",
    },
    {
      $set: {
        visibility: "personal",
        relationship: null,
      },
    },
    {
      session,
    }
  );
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