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
    createdBy: userId,

    title: title.trim(),

    link: link.trim(),

    image: image.trim(),

    category: (category || "General").trim(),

    visibility: shared ? "shared" : "personal",

    relationship: null,
  });
};


/**
 * Find a personal wishlist item by title.
 */
const findWishlistItem = async ({
  userId,
  title,
}) => {
  return Wishlist.findOne({
    createdBy: userId,

    title: new RegExp(
      `^${title.trim()}$`,
      "i"
    ),

    visibility: "personal",

    relationship: null,
  }).lean();
};


/**
 * Get the current user's personal wishlist.
 */
const getWishlist = async ({
  userId,
}) => {
  console.log(
    "[WISHLIST] Searching personal wishlist for:",
    userId
  );

  const items = await Wishlist.find({
    createdBy: userId,

    visibility: "personal",

    relationship: null,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  console.log(
    "[WISHLIST] Personal wishlist items:",
    items
  );

  return items;
};


/**
 * Update a personal wishlist item.
 */
const updateWishlistItem = async ({
  userId,
  title,
  updates,
}) => {
  return Wishlist.findOneAndUpdate(
    {
      createdBy: userId,

      title: new RegExp(
        `^${title.trim()}$`,
        "i"
      ),

      visibility: "personal",

      relationship: null,
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
 * Delete a personal wishlist item.
 */
const deleteWishlistItem = async ({
  userId,
  title,
}) => {
  return Wishlist.findOneAndDelete({
    createdBy: userId,

    title: new RegExp(
      `^${title.trim()}$`,
      "i"
    ),

    visibility: "personal",

    relationship: null,
  });
};


/**
 * Add a wishlist item only if it
 * doesn't already exist.
 */
const addWishlistItem = async ({
  userId,
  item,
}) => {
  const existingItem =
    await findWishlistItem({
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

  const createdItem =
    await createWishlistItem({
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