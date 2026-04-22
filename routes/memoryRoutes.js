const express = require("express");
const router = express.Router();
const Memory = require("../models/Memory");
const protect = require("../middleware/authMiddleware");

// ✅ CREATE MEMORY
router.post("/", protect, async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    const memory = await Memory.create({
      userId: req.user._id,
      imageUrl,
      caption,
    });

    res.status(201).json(memory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL MEMORIES
router.get("/", protect, async (req, res) => {
  try {
    const memories = await Memory.find()
  .populate("userId", "name email") // 👈 add this
  .sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE
router.put("/:id", protect, async (req, res) => {
  try {
    const { caption } = req.body;

    const updated = await Memory.findByIdAndUpdate(
      req.params.id,
      { caption },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❤️ LIKE / UNLIKE
router.put("/:id/like", protect, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    const userId = req.user._id.toString();

    // check already liked
    const isLiked = memory.likes.some(
      (id) => id.toString() === userId
    );

    if (isLiked) {
      // remove like
      memory.likes = memory.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // add like
      memory.likes.push(userId);
    }

    await memory.save();

    res.json(memory);
  } catch (err) {
    console.log("LIKE ERROR:", err); // 🔥 important
    res.status(500).json({ message: err.message });
  }
});

router.get("/on-this-day", protect, async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();

   const memories = await Memory.find()
  .populate("userId", "name") // optional (show user name)
  .sort({ createdAt: -1 });   // latest first

    const filtered = memories.filter((m) => {
      const d = new Date(m.createdAt);
      return d.getDate() === day && d.getMonth() === month;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;