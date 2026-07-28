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
// Validate Memory Access
// ==========================================

async validateMemoryAccess(userId, memory) {
  if (memory.space === "personal") {
    if (
      memory.uploadedBy._id.toString() !==
      userId.toString()
    ) {
      throw new ForbiddenError(
        "You are not allowed to access this memory."
      );
    }

    return;
  }

  const relationship =
    await this.getActiveRelationship(userId);

  if (
    !memory.relationship ||
    memory.relationship.toString() !==
      relationship._id.toString()
  ) {
    throw new ForbiddenError(
      "You are not allowed to access this memory."
    );
  }
}

 // ==========================================
// Create Memory
// ==========================================

async createMemory(userId, data) {
  let relationship = null;

  if (data.space === "shared") {
    relationship = await this.getActiveRelationship(userId);
  }

  return memoryRepository.create({
    relationship: relationship ? relationship._id : null,
    uploadedBy: userId,

    space: data.space || "personal",

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

  async getMemories(userId, space = "personal") {
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
    const memory =
  await memoryRepository.findById(memoryId);

if (!memory) {
  throw new NotFoundError("Memory not found.");
}

await this.validateMemoryAccess(userId, memory);

    return memoryRepository.update(memoryId, {
      
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
// Move Memory
// ==========================================

async moveMemory(userId, memoryId, space) {
  const memory = await memoryRepository.findById(memoryId);

  if (!memory) {
    throw new NotFoundError("Memory not found.");
  }

  await this.validateMemoryAccess(userId, memory);

  if (!["personal", "shared"].includes(space)) {
    throw new ForbiddenError("Invalid memory space.");
  }

  if (space === memory.space) {
    return memory;
  }

  // Move to Shared
  if (space === "shared") {
    const relationship =
      await this.getActiveRelationship(userId);

    return memoryRepository.moveMemory(memoryId, {
      space: "shared",
      relationship: relationship._id,
    });
  }

  // Move to Personal
  return memoryRepository.moveMemory(memoryId, {
    space: "personal",
    relationship: null,
  });
}


  // ==========================================
  // Delete Memory
  // ==========================================

  async deleteMemory(userId, memoryId) {
    const memory =
  await memoryRepository.findById(memoryId);

if (!memory) {
  throw new NotFoundError("Memory not found.");
}

await this.validateMemoryAccess(userId, memory);

    await memoryRepository.softDelete(memoryId);

    return {
      message: "Memory deleted successfully.",
    };
  }

  // ==========================================
  // Toggle Like
  // ==========================================

  async toggleLike(userId, memoryId) {
    const memory =
  await memoryRepository.findById(memoryId);

if (!memory) {
  throw new NotFoundError("Memory not found.");
}

await this.validateMemoryAccess(userId, memory);


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

  /// ==========================================
// On This Day
// ==========================================

async getOnThisDay(userId) {
  const today = new Date();

  const relationship =
    await relationshipRepository.findActiveRelationship(userId);

  return memoryRepository.findOnThisDay(
    userId,
    relationship ? relationship._id : null,
    today.getMonth() + 1,
    today.getDate()
  );
}


}

module.exports = new MemoryService();