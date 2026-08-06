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

  const cloudinary = require("../config/cloudinary");
  const streamifier = require("streamifier");

  const uploadToCloudinary = () =>
    new Promise((resolve, reject) => {

      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder: "ourspace/profile",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(stream);

    });

  const result = await uploadToCloudinary();

  user.avatar = result.secure_url;
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