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