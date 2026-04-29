const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");

// 👤 GET USER
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

// ✏️ UPDATE PROFILE + AVATAR
router.put("/me", protect, upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update text fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.bio) user.bio = req.body.bio;

    // 🔥 Upload avatar to Cloudinary
    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ourspace_avatars" },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: error.message });
          }

          user.avatar = result.secure_url;
          await user.save();

          return res.json(user);
        }
      );

      stream.end(req.file.buffer);
      return;
    }

    await user.save();
    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;