const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  title: String,
  link: String,
  image: String,
  bought: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);