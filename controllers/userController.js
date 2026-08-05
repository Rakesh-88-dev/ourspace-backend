const User = require("../models/User");

// ==========================================
// GET /api/users/me
// ==========================================

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// PUT /api/users/me
// ==========================================

exports.updateProfile = async (req, res) => {
  try {

    const {
      name,
      profession,
      bio,
      location,
      relationshipStatus,
      onboardingCompleted,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Profile

    if (name !== undefined)
      user.name = name;

    if (profession !== undefined)
      user.profession = profession;

    if (bio !== undefined)
      user.bio = bio;

    if (location !== undefined)
      user.location = location;

    // Relationship

    if (relationshipStatus !== undefined)
      user.relationshipStatus = relationshipStatus;

    // Onboarding

    if (onboardingCompleted !== undefined)
      user.onboardingCompleted = onboardingCompleted;

    // Avatar

    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};