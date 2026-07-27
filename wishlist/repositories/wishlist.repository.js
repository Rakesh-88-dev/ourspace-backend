const Wishlist = require("../../models/Wishlist");

class WishlistRepository {
  async create(data) {
    return Wishlist.create(data);
  }

  async findById(id) {
    return Wishlist.findById(id);
  }

  async findByRelationship(relationshipId) {
    return Wishlist.find({ relationship: relationshipId }).sort({
      createdAt: -1,
    });
  }

  async update(id, data) {
    return Wishlist.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return Wishlist.findByIdAndDelete(id);
  }

  async save(wishlist) {
    return wishlist.save();
  }
}

module.exports = new WishlistRepository();