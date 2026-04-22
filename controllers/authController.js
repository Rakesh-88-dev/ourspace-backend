const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.registerUser = async (req, res) => {
  console.log("BODY:", req.body);

  try {
    const name = req.body?.name;
    const email = req.body?.email;
    const password = req.body?.password;

    console.log("Parsed:", name, email, password); // 👈 IMPORTANT

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body?.email;
    const password = req.body?.password;

    const user = await User.findOne({ email });

    console.log("USER:", user);
    console.log("INPUT PASSWORD:", password);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (isMatch) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  res.json(req.user);
};

exports.createMemory = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    const memory = await Memory.create({
      userId: req.user._id, // ✅ correct
      imageUrl,
      caption,
    });

    res.status(201).json(memory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.birthday = req.body.birthday || user.birthday;
    user.anniversary = req.body.anniversary || user.anniversary;
    user.metDate = req.body.metDate || user.metDate;

    const updated = await user.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSpecialDate = async (req, res) => {
  try {
    const { title, date } = req.body;

    const user = await User.findById(req.user._id);

    user.specialDates.push({ title, date });

    await user.save();

    res.json(user.specialDates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

