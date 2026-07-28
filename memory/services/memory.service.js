const memoryRepository = require("../repositories/memory.repository");
const relationshipRepository = require("../../relationship/repositories/relationship.repository");

const ForbiddenError = require("../../errors/ForbiddenError");
const NotFoundError = require("../../errors/NotFoundError");

class MemoryService {
  // ==========================================
  // Active Relationship
  // ==========================================

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

  // ==========================================
  // Create Memory
  // ==========================================

  async createMemory(userId, data) {
    const relationship =
      await this.getActiveRelationship(userId);

    return memoryRepository.create({
      relationship: relationship._id,
      uploadedBy: userId,

      space: data.space || "shared",

      title: data.title,

      media: {
        url: data.media.url,
        type: data.media.type || "image",
      },

      caption: data.caption,
      location: data.location,
      tags: data.tags || [],
      memoryDate: data.memoryDate,
    });
  }

  // ==========================================
  // Get Memories
  // ==========================================

  async getMemories(userId, space = "shared") {

  if (space === "personal") {
    return memoryRepository.findPersonalMemories(userId);
  }

  const relationship =
    await this.getActiveRelationship(userId);

  return memoryRepository.findByRelationshipAndSpace(
    relationship._id,
    "shared"
  );
}

  // ==========================================
  // Update Memory
  // ==========================================

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
      space: data.space,

      title: data.title,

      media: data.media
        ? {
            url: data.media.url,
            type: data.media.type || "image",
          }
        : memory.media,

      caption: data.caption,
      location: data.location,
      tags: data.tags,
      memoryDate: data.memoryDate,
      isFavourite: data.isFavourite,
    });
  }

  // ==========================================
  // Delete Memory
  // ==========================================

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

    await memoryRepository.softDelete(memoryId);

    return {
      message: "Memory deleted successfully.",
    };
  }

  // ==========================================
  // Toggle Like
  // ==========================================

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

  // ==========================================
  // On This Day
  // ==========================================

  async getOnThisDay(userId) {
    const relationship =
      await this.getActiveRelationship(userId);

    const today = new Date();

    return memoryRepository.findOnThisDay(
      relationship._id,
      today.getMonth() + 1,
      today.getDate()
    );
  }


}

module.exports = new MemoryService();