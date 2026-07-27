const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Owner of the conversation
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Chat title
    title: {
      type: String,
      default: "New Chat",
      trim: true,
      maxlength: 100,
    },

    // AI Provider
    provider: {
      type: String,
      enum: ["gemini", "openai", "claude", "groq"],
      default: "gemini",
    },

    // AI Model Used
    model: {
      type: String,
      default: process.env.GEMINI_MODEL,
    },

    // Last activity time
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

     // Cached metadata
lastMessage: {
  type: String,
  default: null,
},

// Total number of messages (user + assistant)
messageCount: {
  type: Number,
  default: 0,
},

lastMessageAt: {
  type: Date,
  default: null,
},

    // Archive
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

   
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({
  user: 1,
  isDeleted: 1,
  lastActivityAt: -1,
}

);



module.exports = mongoose.model("Conversation", conversationSchema);