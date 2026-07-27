const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    // 📝 TITLE
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔗 PRODUCT LINK
    link: {
      type: String,
      default: "",
      trim: true,
    },

    // 🖼️ IMAGE URL
    image: {
      type: String,
      default: "",
      trim: true,
    },

    // 🌈 CATEGORY
    category: {
      type: String,
      default: "General",
      trim: true,
    },

    // ✅ PURCHASE STATUS
    bought: {
      type: Boolean,
      default: false,
    },

    // 💑 SHARED WITH PARTNER
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    // ❤️ REACTIONS
   // ❤️ REACTIONS
// ❤️ REACTIONS
reactions: {
  type: [
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
  default: [],
},
    // 👤 OWNER
    relationship: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Relationship",
  required: true,
}


  },
  {
    timestamps: true,
  }
);

// =============================
// INDEXES
// =============================

// Fast lookup of a user's wishlist
wishlistSchema.index({ relationship: 1 });

wishlistSchema.index({
  relationship: 1,
  bought: 1,
});

wishlistSchema.index({
  relationship: 1,
  category: 1,
});



module.exports = mongoose.model("Wishlist", wishlistSchema);