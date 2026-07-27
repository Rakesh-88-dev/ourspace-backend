const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    receiverEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    invitationToken: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "expired",
      ],
      default: "pending",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    respondedAt: Date,
    acceptedAt: Date,
    rejectedAt: Date,
    cancelledAt: Date,

    emailSent: {
      type: Boolean,
      default: false,
    },

    emailSentAt: Date,

    lastReminderAt: Date,

    reminderCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

invitationSchema.virtual("isExpired").get(function () {
  return new Date() > this.expiresAt;
});

module.exports = mongoose.model(
  "Invitation",
  invitationSchema
);