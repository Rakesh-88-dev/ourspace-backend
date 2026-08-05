const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    onboardingCompleted: {
  type: Boolean,
  default: false,
},

isDemo: {
  type: Boolean,
  default: false,
},

    // NEW
    profession: {
      type: String,
      default: "",
    },

    // NEW
    location: {
      type: String,
      default: "",
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    specialDates: [
      {
        title: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);