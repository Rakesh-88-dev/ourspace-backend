const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const demoGuard = require("../demo/middleware/demoGuard");

const upload = require("../middleware/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");

// ==========================================
// Upload File
// ==========================================

router.post(
  "/",
  protect,
  demoGuard,
  upload.single("image"),
  uploadImage
);

module.exports = router;