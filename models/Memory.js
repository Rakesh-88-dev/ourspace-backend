const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    relationship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Relationship",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // Personal / Shared Space
    // ==========================================

    space: {
      type: String,
      enum: ["personal", "shared"],
      default: "shared",
      index: true,
    },

    // ==========================================
    // Memory Details
    // ==========================================

    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // ==========================================
    // Media
    // ==========================================

    media: {
      url: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["image", "video"],
        default: "image",
      },
    },

    // ==========================================
    // Extra Details
    // ==========================================

    location: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    memoryDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // ==========================================
    // User Interactions
    // ==========================================

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isFavourite: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // AI
    // ==========================================

    aiReflection: {
      type: String,
      default: "",
    },

    // ==========================================
    // Soft Delete
    // ==========================================

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// Indexes
// ==========================================

// Fast loading of Personal / Shared memories
memorySchema.index({
  relationship: 1,
  space: 1,
  memoryDate: -1,
});

// Fast search for favourites
memorySchema.index({
  relationship: 1,
  isFavourite: 1,
});

// Fast tag searching
memorySchema.index({
  tags: 1,
});

module.exports = mongoose.model("Memory", memorySchema);