const AURA_PERMISSIONS = Object.freeze({
  // ==========================================
  // Profile
  // ==========================================

  PROFILE_READ: "profile.read",
  PROFILE_UPDATE: "profile.update",

  // ==========================================
  // Relationship
  // ==========================================

  RELATIONSHIP_READ: "relationship.read",

  // ==========================================
  // Aura Long-Term Memory
  // ==========================================

  AI_MEMORY_READ: "aiMemory.read",
  AI_MEMORY_CREATE: "aiMemory.create",
  AI_MEMORY_UPDATE: "aiMemory.update",
  AI_MEMORY_DELETE: "aiMemory.delete",

  // ==========================================
  // OurSpace Memories / Photos / Videos
  // ==========================================

  MEMORY_PERSONAL_READ: "memory.personal.read",
  MEMORY_SHARED_READ: "memory.shared.read",

  MEMORY_CREATE: "memory.create",
  MEMORY_UPDATE: "memory.update",
  MEMORY_DELETE: "memory.delete",

  // ==========================================
  // Wishlist
  // ==========================================

  WISHLIST_READ: "wishlist.read",
  WISHLIST_CREATE: "wishlist.create",
  WISHLIST_UPDATE: "wishlist.update",
  WISHLIST_DELETE: "wishlist.delete",

  // ==========================================
  // Special Dates
  // ==========================================

  SPECIAL_DATE_READ: "specialDate.read",
  SPECIAL_DATE_CREATE: "specialDate.create",
  SPECIAL_DATE_UPDATE: "specialDate.update",
  SPECIAL_DATE_DELETE: "specialDate.delete",

  // ==========================================
  // Conversations
  // ==========================================

  CHAT_READ: "chat.read",

  // ==========================================
  // Aura Insights
  // ==========================================

  AI_INSIGHTS_READ: "aiInsights.read",
});

const DEFAULT_AURA_PERMISSIONS = Object.freeze([
  AURA_PERMISSIONS.PROFILE_READ,
  AURA_PERMISSIONS.RELATIONSHIP_READ,

  AURA_PERMISSIONS.AI_MEMORY_READ,
  AURA_PERMISSIONS.AI_MEMORY_CREATE,
  AURA_PERMISSIONS.AI_MEMORY_UPDATE,

  AURA_PERMISSIONS.WISHLIST_READ,
  AURA_PERMISSIONS.SPECIAL_DATE_READ,

  AURA_PERMISSIONS.CHAT_READ,
]);

module.exports = {
  AURA_PERMISSIONS,
  DEFAULT_AURA_PERMISSIONS,
};