const relationshipRepository = require(
  "../../relationship/repositories/relationship.repository"
);

const memoryRepository = require(
  "../../memory/repositories/memory.repository"
);

const wishlistRepository = require(
  "../../wishlist/repositories/wishlist.repository"
);

const specialDateRepository = require(
  "../../special-date/repositories/specialDate.repository"
);

const NotFoundError = require("../../errors/NotFoundError");

const getDashboard = async (userId) => {
  const relationship =
    await relationshipRepository.findActiveRelationship(userId);

  if (!relationship) {
    throw new NotFoundError("Relationship not found.");
  }

  const partner =
    await relationshipRepository.getPartner(userId);

  const [memories, wishlist, specialDates] =
    await Promise.all([
      memoryRepository.findByRelationship(relationship._id),
      wishlistRepository.findByRelationship(relationship._id),
      specialDateRepository.findByRelationship(relationship._id),
    ]);

 let daysTogether = null;

  if (relationship.anniversaryDate) {
    daysTogether = Math.floor(
      (Date.now() - new Date(relationship.anniversaryDate)) /
      (1000 * 60 * 60 * 24)
    );
  }

  const today = new Date();

  const todayEvents = specialDates.filter((item) => {
    const date = new Date(item.date);

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth()
    );
  });

  const completedWishlist =
    wishlist.filter((item) => item.bought).length;

  const pendingWishlist =
    wishlist.length - completedWishlist;

    const upcomingEvents = specialDates
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .slice(0, 5);

const recentMemories = memories
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);
  
return {
  partner,

  relationship: {
    id: relationship._id,
    anniversaryDate: relationship.anniversaryDate,
    daysTogether,
  },

  stats: {
    memories: memories.length,
    wishlist: wishlist.length,
    specialDates: specialDates.length,
  },

  wishlistProgress: {
    completed: completedWishlist,
    pending: pendingWishlist,
  },

  todayEvents,

  upcomingEvents,

  recentMemories,
};
};

module.exports = {
  getDashboard,
};