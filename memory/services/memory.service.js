const memoryRepository = require("../repositories/memory.repository");
const relationshipRepository = require("../../relationship/repositories/relationship.repository");

const ForbiddenError = require("../../errors/ForbiddenError");
const NotFoundError = require("../../errors/NotFoundError");

class MemoryService {
  async getActiveRelationship(userId) {
    const relationship =
      await relationshipRepository.findActiveRelationship(userId);

    if (!relationship) {
      throw new ForbiddenError(
        "You must connect with a partner before using Memories."
      );
    }

    return relationship;
  }

  async createMemory(userId, data) {
    const { imageUrl, caption } = data;

    const relationship =
      await this.getActiveRelationship(userId);

    return memoryRepository.create({
      relationship: relationship._id,
      uploadedBy: userId,
      imageUrl,
      caption,
    });
  }

  async getMemories(userId) {
    const relationship =
      await this.getActiveRelationship(userId);

    return memoryRepository.findByRelationship(
      relationship._id
    );
  }

  async updateMemory(userId, memoryId, data) {
    const relationship =
      await this.getActiveRelationship(userId);

    const memory =
      await memoryRepository.findById(memoryId);

    if (!memory) {
      throw new NotFoundError("Memory not found.");
    }

    if (
      memory.relationship.toString() !==
      relationship._id.toString()
    ) {
      throw new ForbiddenError(
        "You are not allowed to update this memory."
      );
    }

    return memoryRepository.update(memoryId, {
      caption: data.caption,
    });
  }

  async deleteMemory(userId, memoryId) {
    const relationship =
      await this.getActiveRelationship(userId);

    const memory =
      await memoryRepository.findById(memoryId);

    if (!memory) {
      throw new NotFoundError("Memory not found.");
    }

    if (
      memory.relationship.toString() !==
      relationship._id.toString()
    ) {
      throw new ForbiddenError(
        "You are not allowed to delete this memory."
      );
    }

    await memoryRepository.delete(memoryId);

    return {
      message: "Memory deleted successfully.",
    };
  }

  async toggleLike(userId, memoryId) {
    const relationship =
      await this.getActiveRelationship(userId);

    const memory =
      await memoryRepository.findById(memoryId);

    if (!memory) {
      throw new NotFoundError("Memory not found.");
    }

    if (
      memory.relationship.toString() !==
      relationship._id.toString()
    ) {
      throw new ForbiddenError(
        "You are not allowed to like this memory."
      );
    }

    const alreadyLiked = memory.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      memory.likes = memory.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      memory.likes.push(userId);
    }

    return memoryRepository.save(memory);
  }

  async getOnThisDay(userId) {
    const relationship =
      await this.getActiveRelationship(userId);

    const memories =
      await memoryRepository.findByRelationship(
        relationship._id
      );

    const today = new Date();

    return memories.filter((memory) => {
      const date = new Date(memory.createdAt);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth()
      );
    });
  }
}

module.exports = new MemoryService();