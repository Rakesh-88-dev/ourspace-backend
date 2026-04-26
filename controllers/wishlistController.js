const Wishlist = require("../models/Wishlist");

exports.addItem = async (req, res) => {
  try {
    const { title, link } = req.body;

    const item = await Wishlist.create({
      title,
      link,
      userId: req.user._id,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getItems = async (req, res) => {
  const items = await Wishlist.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
};

exports.toggleBought = async (req, res) => {
  const item = await Wishlist.findById(req.params.id);
  item.bought = !item.bought;
  await item.save();
  res.json(item);
};

exports.deleteItem = async (req, res) => {
  await Wishlist.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};