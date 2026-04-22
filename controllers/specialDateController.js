const SpecialDate = require("../models/SpecialDate");

// ➕ ADD (WITH IMAGE)
exports.addSpecialDate = async (req, res) => {
  try {

    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    const { title, date, type } = req.body;

    const newDate = await SpecialDate.create({
      title,
      date,
      type: type || "memory",
      userId: req.user._id,
      image: req.file ? req.file.filename : null,
    });

    res.json(newDate);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// 🌍 GET USER-SPECIFIC DATA
exports.getAllDates = async (req, res) => {
  try {
    const dates = await SpecialDate.find()
      .populate("userId", "name") // optional but useful
      .sort({ date: 1 });

    res.json(dates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ❌ DELETE (you didn’t include this, add it)
exports.deleteDate = async (req, res) => {
  try {
    await SpecialDate.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};