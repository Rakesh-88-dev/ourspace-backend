const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");

// 👥 GET ALL USERS (except myself)
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

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
    user.name = req.body.name ?? user.name;
user.bio = req.body.bio ?? user.bio;
user.profession = req.body.profession ?? user.profession;
user.location = req.body.location ?? user.location;
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

         res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user,
});
        }
      );

      stream.end(req.file.buffer);
      return;
    }

    await user.save();
    res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user,
});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;