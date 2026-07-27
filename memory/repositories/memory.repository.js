const Memory = require("../../models/Memory");

class MemoryRepository {
  async create(data) {
    return Memory.create(data);
  }

  async findById(id) {
    return Memory.findById(id);
  }

  async findByRelationship(relationshipId) {
    return Memory.find({
      relationship: relationshipId,
    })
      .populate("uploadedBy", "name email avatar")
      .sort({ createdAt: -1 });
  }

  async update(id, data) {
    return Memory.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id) {
    return Memory.findByIdAndDelete(id);
  }

  async save(memory) {
    return memory.save();
  }
}

module.exports = new MemoryRepository();