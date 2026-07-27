const Wishlist = require("../../models/Wishlist");

/**
 * Create a wishlist item.
 */
const createWishlistItem = async ({
  userId,
  title,
  link = "",
  image = "",
  category = "General",
  shared = false,
}) => {
  return Wishlist.create({
    userId,
    title: title.trim(),
    link: link.trim(),
    image: image.trim(),
    category: (category || "General").trim(),
    shared,
  });
};

/**
 * Find a wishlist item by title.
 */
const findWishlistItem = async ({
  userId,
  title,
}) => {
  return Wishlist.findOne({
    userId,
    title: new RegExp(`^${title.trim()}$`, "i"),
  }).lean();
};

/**
 * Get all wishlist items for a user.
 */
const getWishlist = async ({
  userId,
}) => {
  return Wishlist.find({
    userId,
  })
    .sort({
      createdAt: -1,
    })
    .lean();
};

/**
 * Update a wishlist item.
 */
const updateWishlistItem = async ({
  userId,
  title,
  updates,
}) => {
  return Wishlist.findOneAndUpdate(
    {
      userId,
      title: new RegExp(`^${title.trim()}$`, "i"),
    },
    {
      $set: updates,
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};

/**
 * Delete a wishlist item.
 */
const deleteWishlistItem = async ({
  userId,
  title,
}) => {
  return Wishlist.findOneAndDelete({
    userId,
    title: new RegExp(`^${title.trim()}$`, "i"),
  });
};

/**
 * Add a wishlist item only if it doesn't already exist.
 */
const addWishlistItem = async ({
  userId,
  item,
}) => {
  const existingItem = await findWishlistItem({
    userId,
    title: item.title,
  });

  if (existingItem) {
    return {
      success: false,
      reason: "already_exists",
      item: existingItem,
    };
  }

  const createdItem = await createWishlistItem({
    userId,
    title: item.title,
    link: item.link,
    image: item.image,
    category: item.category,
    shared: item.shared,
  });

  return {
    success: true,
    item: createdItem,
  };
};

const WishlistRepository = {
  createWishlistItem,
  findWishlistItem,
  getWishlist,
  updateWishlistItem,
  deleteWishlistItem,
  addWishlistItem,
};

module.exports = WishlistRepository;