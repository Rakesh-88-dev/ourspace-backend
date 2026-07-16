const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const protect = require("../middleware/authMiddleware");
const { searchMessages } = require("../controllers/messageController");

// ✅ GET ALL MY MESSAGES (for testing or general use)
router.get("/", protect, async (req, res) => {
  try {
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId },
        { receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/search/:userId", protect, searchMessages);

// 💬 GET CHAT BETWEEN TWO USERS
router.get("/:userId", protect, async (req, res) => {
  try {
    const myId = req.user._id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;