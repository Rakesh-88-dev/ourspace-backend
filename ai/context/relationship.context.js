const relationshipRepository = require("../../repositories/relationship.repository");

/**
 * Build safe relationship context for Aura.
 *
 * The relationship is resolved from the authenticated user.
 * Aura never trusts a partnerId supplied by the user.
 */
const buildRelationshipContext = async ({ userId }) => {
  if (!userId) {
    return null;
  }

  const relationship =
    await relationshipRepository.findByMember(userId);

  if (!relationship) {
    return null;
  }

  // Find the other member in the relationship.
  const partner = relationship.members?.find(
    (member) =>
      member._id.toString() !== userId.toString()
  );

  return {
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
          profession: partner.profession || "",
          location: partner.location || "",
        }
      : null,

    settings: {
      allowSharedMemories:
        relationship.settings?.allowSharedMemories ?? true,

      allowSharedWishlist:
        relationship.settings?.allowSharedWishlist ?? true,

      allowSharedCalendar:
        relationship.settings?.allowSharedCalendar ?? true,

      allowAuraInsights:
        relationship.settings?.allowAuraInsights ?? true,
    },
  };
};

module.exports = {
  buildRelationshipContext,
};