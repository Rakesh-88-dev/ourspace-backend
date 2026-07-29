const { TOOL_TYPES } = require("./tool.types");

const ProfileRepository = require("../profile/profile.query");

/**
 * Profile Tool Handlers
 */
const ProfileTool = {
  /**
   * Get Profile
   */
  [TOOL_TYPES.GET_PROFILE]: async ({ context }) => {
    const profile = await ProfileRepository.getProfile(
      context.userId
    );

    return {
      success: true,
      profile,
    };
  },

  /**
   * Update Profile
   */
  [TOOL_TYPES.UPDATE_PROFILE]: async ({
    args,
    context,
  }) => {
    const profile =
      await ProfileRepository.updateProfile(
        context.userId,
        args
      );

    return {
      success: true,
      profile,
    };
  },
};

module.exports = ProfileTool;