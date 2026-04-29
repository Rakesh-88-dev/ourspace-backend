const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const Wishlist = require("../models/Wishlist");
const Memory = require("../models/Memory");
const Message = require("../models/Message");

// 📊 GET USER STATS
router.get("/", protect, async (req, res) => {
  try {
    console.log("USER ID:", req.user._id);

    const dreams = await Wishlist.countDocuments({
      userId: req.user._id,
    });

    const achieved = await Wishlist.countDocuments({
      userId: req.user._id,
      bought: true, // based on your schema
    });

    const memories = await Memory.countDocuments({
      userId: req.user._id,
    });

    const shared = await Message.countDocuments({
      userId: req.user._id,
    });

    res.json({
      dreams,
      achieved,
      shared,
      memories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;