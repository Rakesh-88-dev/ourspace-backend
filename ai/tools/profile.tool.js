const { TOOL_TYPES } = require("./tool.types");

const ProfileRepository = require("../profile/profile.query");

/**
 * Resolve the authenticated user ID from Aura tool context.
 *
 * Supports both:
 *   context.userId
 *   context.actor.userId
 */
const getUserIdFromContext = (context = {}) => {
  return (
    context?.actor?.userId ||
    context?.userId ||
    null
  );
};

/**
 * Profile Tool Handlers
 */
const ProfileTool = {

  /**
   * ==========================================
   * Get Profile
   * ==========================================
   */
  [TOOL_TYPES.GET_PROFILE]: async ({
    context,
  }) => {

    const userId =
      getUserIdFromContext(context);

    if (!userId) {
      throw new Error(
        "Authenticated user is required for profile access."
      );
    }

    const profile =
      await ProfileRepository.getProfile(
        userId
      );

    return {
      success: true,
      profile,
    };
  },


  /**
   * ==========================================
   * Update Profile
   * ==========================================
   */
  [TOOL_TYPES.UPDATE_PROFILE]: async ({
    args,
    context,
  }) => {

    const userId =
      getUserIdFromContext(context);

    if (!userId) {
      throw new Error(
        "Authenticated user is required for profile update."
      );
    }

    console.log(
      "[AURA] Updating profile for user:",
      userId
    );

    console.log(
      "[AURA] Profile updates:",
      JSON.stringify(args, null, 2)
    );

    const profile =
      await ProfileRepository.updateProfile(
        userId,
        args
      );

    return {
      success: true,
      profile,
    };
  },
};


module.exports = ProfileTool;