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
      lowercase:true,
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

   
    relationshipId: {
      type: String,
      default: null,
    },

   // 💖 Special Dates
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