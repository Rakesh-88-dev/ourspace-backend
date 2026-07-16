const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================
    // Message Type
    // ==========================
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },

    // ==========================
    // Text Message
    // ==========================
    text: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // Media
    // ==========================
    mediaUrl: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    caption: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // File Details
    // ==========================
    fileName: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    mimeType: {
      type: String,
      default: "",
    },

    // ==========================
    // Message Status
    // ==========================
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },

    // ==========================
    // Edit / Delete
    // ==========================
    edited: {
      type: Boolean,
      default: false,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);