const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// 👤 GET CURRENT USER
router.get("/me", protect, async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✏️ UPDATE PROFILE + AVATAR UPLOAD
router.put(
  "/me",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // 🔥 ADD THESE LINES
      console.log("FILE:", req.file);
      console.log("BODY:", req.body);

      const { name, bio } = req.body;

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (bio) user.bio = bio;

      // 🔥 Cloudinary URL
      if (req.file) {
        user.avatar = req.file.path;
      }

      await user.save();

      res.json(user);
    } catch (err) {
      console.error("ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;