const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    // 🌈 CATEGORY (match frontend EXACTLY)
    category: {
      type: String,
      default: "🌍 Places",
    },

    // ✅ STATUS
    bought: {
      type: Boolean,
      default: false,
    },

    // 💑 SHARED
    shared: {
      type: Boolean,
      default: false,
    },

    // ❤️ REACTIONS (safe structure)
    reactions: {
      type: Map,
      of: Number,
      default: {},
    },

    // 👤 USER
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);