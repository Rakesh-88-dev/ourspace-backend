const mongoose = require("mongoose");

const auraPermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    permissions: {
      type: [String],
      default: [],
    },

    version: {
      type: Number,
      default: 1,
    },

    lastRevokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model(
  "AuraPermission",
  auraPermissionSchema
);