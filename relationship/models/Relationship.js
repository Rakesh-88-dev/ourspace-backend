const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    relationshipKey: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "paused", "ended"],
      default: "active",
      index: true,
    },

    anniversaryDate: {
      type: Date,
      default: null,
    },

    connectedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },

    // NEW
    endedAt: {
      type: Date,
      default: null,
    },

    // NEW
    endedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    aiContextVersion: {
      type: Number,
      default: 1,
    },

    settings: {
      allowSharedMemories: {
        type: Boolean,
        default: true,
      },

      allowSharedWishlist: {
        type: Boolean,
        default: true,
      },

      allowSharedCalendar: {
        type: Boolean,
        default: true,
      },

      allowAuraInsights: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

relationshipSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

module.exports = mongoose.model(
  "Relationship",
  relationshipSchema
);