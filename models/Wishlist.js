const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    // Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional Link
    link: {
      type: String,
      default: "",
      trim: true,
    },

    // Optional Image
    image: {
      type: String,
      default: "",
      trim: true,
    },

    // Category
    category: {
      type: String,
      default: "General",
      trim: true,
    },

    // Completed
    bought: {
      type: Boolean,
      default: false,
    },

    // Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sourceWishlist: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Wishlist",
  default: null,
},

    // Relationship (NULL = Personal Wishlist)
    relationship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Relationship",
      default: null,
      index: true,
    },

    // Personal or Shared
    visibility: {
      type: String,
      enum: ["personal", "shared"],
      default: "personal",
      index: true,
    },

    // Emoji Reactions
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        emoji: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ===============================
// Indexes
// ===============================

wishlistSchema.index({
  createdBy: 1,
  visibility: 1,
});

wishlistSchema.index({
  relationship: 1,
  visibility: 1,
});

wishlistSchema.index({
  category: 1,
  bought: 1,
});

module.exports = mongoose.model("Wishlist", wishlistSchema);