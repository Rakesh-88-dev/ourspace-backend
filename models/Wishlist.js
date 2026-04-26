const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  title: String,
  link: String,
  image: String,
  category: { type: String, default: "Places" },  // ← ADD THIS LINE
  bought: {
    type: Boolean,
    default: false,
  },
  reactions: { type: Object, default: {} },        // ← ADD THIS LINE (if not already in your routes)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);