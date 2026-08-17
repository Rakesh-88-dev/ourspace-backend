const User = require("../../models/User");

const relationshipRepository = require("../../relationship/repositories/relationship.repository");

const {
  getPermissions,
} = require("../authorization/permission.service");

/**
 * Builds the authoritative context for an Aura request.
 *
 * This service does not fetch large domain datasets.
 * Memories, wishlist items, messages, etc. remain dynamic
 * resources accessed through authorized tools.
 */
const buildContext = async ({
  userId,
  conversationId,
}) => {
  if (!userId) {
    const error = new Error(
      "Authenticated user is required."
    );

    error.statusCode = 401;
    error.code = "AURA_USER_REQUIRED";

    throw error;
  }

  // --------------------------------------------------
  // 1. Load authenticated user
  // --------------------------------------------------

  const user = await User.findById(userId)
    .select(
      "_id name email avatar bio profession location relationshipStatus"
    )
    .lean();

  if (!user) {
    const error = new Error(
      "Authenticated user not found."
    );

    error.statusCode = 401;
    error.code = "AURA_USER_NOT_FOUND";

    throw error;
  }

  // --------------------------------------------------
  // 2. Load Aura permissions
  // --------------------------------------------------

  const permissionDocument =
    await getPermissions(userId);

  // --------------------------------------------------
  // 3. Resolve relationship from authenticated user
  // --------------------------------------------------

  const relationship =
    await relationshipRepository.findByMember(
      userId
    );

  let relationshipContext = null;

  if (relationship) {
    const partner =
      relationship.members?.find(
        (member) =>
          member._id.toString() !==
          userId.toString()
      );

    relationshipContext = {
      id: relationship._id.toString(),

      status: relationship.status,

      anniversaryDate:
        relationship.anniversaryDate || null,

      connectedAt:
        relationship.connectedAt || null,

      partner: partner
        ? {
            id: partner._id.toString(),
            name: partner.name,
            avatar: partner.avatar || "",
            bio: partner.bio || "",
          }
        : null,

      relationshipPermissions: {
        allowSharedMemories:
          relationship.settings
            ?.allowSharedMemories ?? true,

        allowSharedWishlist:
          relationship.settings
            ?.allowSharedWishlist ?? true,

        allowSharedCalendar:
          relationship.settings
            ?.allowSharedCalendar ?? true,

        allowAuraInsights:
          relationship.settings
            ?.allowAuraInsights ?? true,
      },
    };
  }

  // --------------------------------------------------
  // 4. Return minimal AI context
  // --------------------------------------------------

  return {
    version: 1,

    actor: {
      userId: user._id.toString(),
    },

    user: {
      id: user._id.toString(),
      name: user.name,
      avatar: user.avatar || "",
      bio: user.bio || "",
      profession: user.profession || "",
      location: user.location || "",
      relationshipStatus:
        user.relationshipStatus,
    },

    conversation: {
      id: conversationId
        ? conversationId.toString()
        : null,
    },

    permissions: {
      version: permissionDocument.version,
      capabilities:
        permissionDocument.permissions,
    },

    relationship: relationshipContext,
  };
};

module.exports = {
  buildContext,
};