const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  addItem,
  getItems,
  toggleBought,
  deleteItem,
} = require("../controllers/wishlistController");

router.post("/", protect, addItem);
router.get("/", protect, getItems);
router.put("/:id", protect, toggleBought);
router.delete("/:id", protect, deleteItem);

module.exports = router;