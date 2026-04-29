const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  addItem,
  getItems,
  toggleBought, // we'll upgrade this controller
  deleteItem,
  addReaction,
} = require("../controllers/wishlistController");

// 🌍 PUBLIC - GET ALL WISHLISTS (NO LOGIN NEEDED)
router.get("/public", async (req, res) => {
  try {
    const items = await require("../models/Wishlist")
      .find()
      .populate("userId", "name avatar") // 👈 shows who added it
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➕ CREATE
router.post("/", protect, addItem);

// 📥 GET ALL
router.get("/", protect, getItems);

// 🔄 UPDATE (bought + shared handled here)
router.put("/:id", protect, toggleBought);

// ❌ DELETE
router.delete("/:id", protect, deleteItem);

// ❤️ REACTION
router.put("/react", protect, addReaction);

module.exports = router;