const Relationship = require("../models/Relationship");

class RelationshipRepository {
  async create(data) {
    return Relationship.create(data);
  }

  async findById(id) {
    return Relationship.findById(id);
  }

  async findByRelationshipKey(key) {
    return Relationship.findOne({
      relationshipKey: key,
    });
  }

  async findByMember(userId) {
  return Relationship.findOne({
    members: userId,
  }).populate(
    "members",
    "name email avatar bio lastSeen createdAt"
  );
}
  async update(id, data) {
    return Relationship.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
  }

 async createRelationship(data, session) {
  const [relationship] = await Relationship.create([data], {
    session,
  });

  return relationship;
}



async deleteRelationship(id) {
  return Relationship.findByIdAndDelete(id);
}

async findActiveRelationship(userId) {
  return Relationship.findOne({
    members: userId,
  }).populate(
    "members",
    "name email avatar bio lastSeen createdAt"
  );
}

async exists(userId) {
  return Relationship.exists({
    members: userId,
  });
}

async getPartner(userId) {
  const relationship =
    await this.findActiveRelationship(userId);

  if (!relationship) return null;

  return relationship.members.find(
    member => member._id.toString() !== userId.toString()
  );
}
async findActiveRelationship(userId) {
  return this.findByMember(userId);
}

async findActiveRelationship(userId) {
  return this.findByMember(userId);
}

async findByIdWithUsers(id) {
  return Relationship.findById(id).populate(
    "members",
    "name email avatar bio lastSeen createdAt"
  );
}

}

module.exports = new RelationshipRepository();