const User = require("../../models/User");

/**
 * Get current user's profile
 */
const getProfile = async (userId) => {
  const profile = await User.findById(userId).select(
    "name email avatar bio lastSeen createdAt"
  );

  if (!profile) {
    throw new Error("User not found.");
  }

  return profile;
};

/**
 * Update current user's profile
 */
const updateProfile = async (userId, updates) => {
  const profile = await User.findByIdAndUpdate(
    userId,
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("name email avatar bio lastSeen createdAt");

  if (!profile) {
    throw new Error("User not found.");
  }

  return profile;
};

module.exports = {
  getProfile,
  updateProfile,
};