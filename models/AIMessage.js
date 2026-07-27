const mongoose = require("mongoose");

const aiMessageSchema = new mongoose.Schema(
  {
    // Parent conversation
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    // Who sent the message
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
      index: true,
    },

    // Main message
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // Future attachments
    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "file", "audio"],
        },

        url: String,

        mimeType: String,

        fileName: String,
      },
    ],

    // AI Provider
    provider: {
      type: String,
      enum: ["gemini", "openai", "claude", "groq"],
      default: "gemini",
    },

    // AI Model
    model: {
      type: String,
      default: process.env.GEMINI_MODEL,
    },

    // Usage analytics
    usage: {
      promptTokens: {
        type: Number,
        default: 0,
      },

      completionTokens: {
        type: Number,
        default: 0,
      },

      totalTokens: {
        type: Number,
        default: 0,
      },
    },

    // Performance analytics
    latency: {
      type: Number,
      default: 0,
    },

    // Future semantic search
    embedding: {
      type: [Number],
      default: undefined,
      select: false,
    },

    // Message state
    status: {
      type: String,
      enum: ["completed", "streaming", "failed"],
      default: "completed",
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
  timestamps: true,
  versionKey: false,
}
);

module.exports = mongoose.model(
  "AIMessage",
  aiMessageSchema
);