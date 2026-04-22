const Memory = require("../models/Memory");

// CREATE MEMORY
exports.createMemory = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    const memory = await Memory.create({
      userId: req.user._id, // from JWT
      imageUrl,
      caption,
    });

    res.status(201).json(memory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL MEMORIES
exports.getMemories = async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};