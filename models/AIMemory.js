const mongoose = require("mongoose");
const MEMORY_TYPES = require("../ai/memory/memory.types");

const aiMemorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
  type: String,
  enum: Object.values(MEMORY_TYPES),
  required: true,
  trim: true,
  lowercase: true,
},

    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    source: {
      type: String,
      enum: ["ai", "user", "system"],
      default: "ai",
    },

    confidence: {
      type: Number,
      default: 1,
      min: 0,
      max: 1,
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    lastAccessedAt: {
      type: Date,
      default: null,
    },

    metadata: {
  type: mongoose.Schema.Types.Mixed,
  default: () => ({}),
},

    isDeleted: {
      type: Boolean,
      default: false,
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

/**
 * Prevent duplicate active memories
 */
aiMemorySchema.index(
  {
    user: 1,
    type: 1,
    key: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  }
);

/**
 * Fast retrieval of user memories
 */
aiMemorySchema.index({
  user: 1,
  isDeleted: 1,
  updatedAt: -1,
});

aiMemorySchema.index({
  user: 1,
  usageCount: -1,
  lastAccessedAt: -1,
});

module.exports = mongoose.model("AIMemory", aiMemorySchema);