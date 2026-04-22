const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

// ✅ IMPORT UPLOAD MIDDLEWARE
const upload = require("../middleware/uploadMiddleware");

const {
  addSpecialDate,
  getAllDates,
  deleteDate,
} = require("../controllers/specialDateController");

// ➕ CREATE (WITH IMAGE)
router.post(
  "/",
  protect,
  upload.single("image"), // 🔥 CRITICAL FIX
  addSpecialDate
);

// 📥 GET
router.get("/", getAllDates);

// ❌ DELETE
router.delete("/:id", protect, deleteDate);

module.exports = router;