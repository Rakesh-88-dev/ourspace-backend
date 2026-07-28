const Relationship = require("../models/Relationship");

class RelationshipRepository {
  async create(data) {
    return Relationship.create(data);
  }

  async createRelationship(data, session) {
    const [relationship] = await Relationship.create([data], {
      session,
    });

    return relationship;
  }

  async findById(id) {
    return Relationship.findById(id);
  }

  async findByIdWithUsers(id) {
    return Relationship.findById(id).populate(
      "members",
      "name email avatar bio lastSeen createdAt"
    );
  }

  async findByRelationshipKey(key) {
    return Relationship.findOne({
      relationshipKey: key,
    });
  }

  async findByMember(userId) {
    return Relationship.findOne({
      members: userId,
      status: { $ne: "disconnected" }, // only active relationships
    }).populate(
      "members",
      "name email avatar bio lastSeen createdAt"
    );
  }

  async findActiveRelationship(userId) {
    return this.findByMember(userId);
  }

  async update(id, data) {
    return Relationship.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
  }

  // Used when a couple disconnects
  
async disconnectRelationship(
  relationshipId,
  disconnectedBy,
  session
) {
  return Relationship.findByIdAndDelete(
    relationshipId,
    {
      session,
    }
  );
}
  // Keep this for admin use or permanent deletion
  async deleteRelationship(id) {
    return Relationship.findByIdAndDelete(id);
  }

  async exists(userId) {
    return Relationship.exists({
      members: userId,
      status: { $ne: "disconnected" },
    });
  }

  async getPartner(userId) {
    const relationship =
      await this.findActiveRelationship(userId);

    if (!relationship) return null;

    return relationship.members.find(
      (member) =>
        member._id.toString() !== userId.toString()
    );
  }
}

module.exports = new RelationshipRepository();