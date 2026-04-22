const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    // ❌ Prevent crash if no file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    res.json({
      url: result.secure_url,
    });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};