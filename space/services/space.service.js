const relationshipRepository = require("../../relationship/repositories/relationship.repository");

class SpaceService {
  /**
   * Returns the current working space of the user.
   *
   * Personal Space:
   * {
   *   type: "personal",
   *   relationship: null
   * }
   *
   * Shared Space:
   * {
   *   type: "shared",
   *   relationship: RelationshipDocument
   * }
   */
  async getCurrentSpace(userId) {
    const relationship =
      await relationshipRepository.findActiveRelationship(userId);

    if (!relationship) {
      return {
        type: "personal",
        relationship: null,
      };
    }

    return {
      type: "shared",
      relationship,
    };
  }

  async isPersonalSpace(userId) {
    const space = await this.getCurrentSpace(userId);
    return space.type === "personal";
  }

  async isSharedSpace(userId) {
    const space = await this.getCurrentSpace(userId);
    return space.type === "shared";
  }
}

module.exports = new SpaceService();