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
  return res.status(400).json({
    success: false,
    message: "Please fill all fields",
  });
}
    const userExists = await User.findOne({ email });

    if (userExists) {
  return res.status(400).json({
    success: false,
    message: "User already exists",
  });
}

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

   res.status(201).json({
  success: true,
  message: "Registration successful.",

  token: generateToken(user._id),

  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,

    bio: user.bio,
    profession: user.profession,
    location: user.location,

    relationshipStatus: user.relationshipStatus,

    onboardingCompleted: user.onboardingCompleted,

    isDemo: user.isDemo,
  },
});

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
  success: false,
  message: error.message,
});
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
    success: false,
    message: "User not found",
  });
}

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (isMatch) {

      user.lastSeen = new Date();
        await user.save();

      return res.json({
  success: true,
  message: "Login successful.",

  token: generateToken(user._id),

  user: {
    _id: user._id,
    name: user.name,
    email: user.email,

    avatar: user.avatar,

    bio: user.bio,
    profession: user.profession,
    location: user.location,

    relationshipStatus: user.relationshipStatus,

    onboardingCompleted: user.onboardingCompleted,

    isDemo: user.isDemo,
  },
});

    } else {
     return res.status(401).json({
  success: false,
  message: "Invalid password",
});
    }

  } catch (error) {
    console.error("LOGIN ERROR:", error);
   res.status(500).json({
  success: false,
  message: error.message,
});
  }
};

exports.demoLogin = async (req, res) => {
  try {
    const user = await User.findOne({ isDemo: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Demo account not found.",
      });
    }

    user.lastSeen = new Date();
    await user.save();

    return res.json({
  success: true,
  message: "Demo login successful.",

  token: generateToken(user._id),

  user: {
    _id: user._id,
    name: user.name,
    email: user.email,

    avatar: user.avatar,

    bio: user.bio,
    profession: user.profession,
    location: user.location,

    relationshipStatus: user.relationshipStatus,

    onboardingCompleted: user.onboardingCompleted,

    isDemo: true,
  },
});

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
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

