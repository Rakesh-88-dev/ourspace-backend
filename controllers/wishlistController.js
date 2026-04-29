const Wishlist = require("../models/Wishlist");

// ➕ ADD ITEM
exports.addItem = async (req, res) => {
  try {
    const { title, link, category } = req.body;

    const item = await Wishlist.create({
      title,
      link,
      category: category || "🌍 Places",
      userId: req.user._id,
      shared: false,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 GET ITEMS
exports.getItems = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 TOGGLE BOUGHT + UPDATE SHARED
exports.toggleBought = async (req, res) => {
  try {
    const { shared } = req.body;

    const item = await Wishlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔒 SECURITY: ensure user owns item
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 👉 If shared provided → update shared
    if (shared !== undefined) {
      item.shared = shared;
    } 
    // 👉 Else toggle bought
    else {
      item.bought = !item.bought;
    }

    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ DELETE ITEM
exports.deleteItem = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔒 SECURITY CHECK
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❤️ ADD REACTION
exports.addReaction = async (req, res) => {
  try {
    const { id, emoji } = req.body;

    const item = await Wishlist.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔒 SECURITY CHECK
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // initialize if missing
    if (!item.reactions) {
      item.reactions = {};
    }

    // increment safely
    item.reactions.set
      ? item.reactions.set(emoji, (item.reactions.get(emoji) || 0) + 1)
      : (item.reactions[emoji] = (item.reactions[emoji] || 0) + 1);

    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};