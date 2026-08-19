const DatePlanner = require(
  "../models/DatePlanner"
);

// =====================================================
// CREATE
// =====================================================

const create = (data) => {
  return DatePlanner.create(data);
};

// =====================================================
// FIND BY ID
// =====================================================

const findById = (id) => {
  return DatePlanner.findById(id)
    .populate("linkedMemories");
};

// =====================================================
// FIND ALL BY RELATIONSHIP
// =====================================================

const findByRelationship = (
  relationshipId
) => {
  return DatePlanner.find({
    relationship: relationshipId,
  })
    .populate("linkedMemories")
    .sort({ date: 1 });
};

// =====================================================
// FIND UPCOMING DATES
// =====================================================

const findUpcomingByRelationship = (
  relationshipId
) => {
  return DatePlanner.find({
    relationship: relationshipId,

    date: {
      $gte: new Date(),
    },

    status: "planned",
  })
    .populate("linkedMemories")
    .sort({ date: 1 });
};

// =====================================================
// FIND PAST DATES
// =====================================================

const findPastByRelationship = (
  relationshipId
) => {
  return DatePlanner.find({
    relationship: relationshipId,

    date: {
      $lt: new Date(),
    },
  })
    .populate("linkedMemories")
    .sort({ date: -1 });
};

// =====================================================
// FIND BY STATUS
// =====================================================

const findByStatus = (
  relationshipId,
  status
) => {
  return DatePlanner.find({
    relationship: relationshipId,
    status,
  })
    .populate("linkedMemories")
    .sort({ date: 1 });
};

// =====================================================
// UPDATE
// =====================================================

const update = (
  id,
  data
) => {
  return DatePlanner.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate("linkedMemories");
};

// =====================================================
// UPDATE STATUS
// =====================================================

const updateStatus = (
  id,
  status
) => {
  return DatePlanner.findByIdAndUpdate(
    id,
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("linkedMemories");
};

// =====================================================
// DELETE
// =====================================================

const remove = (id) => {
  return DatePlanner.findByIdAndDelete(id);
};

// =====================================================
// SAVE DOCUMENT
// =====================================================

const save = (
  datePlanner
) => {
  return datePlanner.save();
};

// =====================================================
// LINK MEMORY
// =====================================================

const linkMemory = (
  id,
  memoryId
) => {
  return DatePlanner.findByIdAndUpdate(
    id,
    {
      $addToSet: {
        linkedMemories: memoryId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("linkedMemories");
};

// =====================================================
// UNLINK MEMORY
// =====================================================

const unlinkMemory = (
  id,
  memoryId
) => {
  return DatePlanner.findByIdAndUpdate(
    id,
    {
      $pull: {
        linkedMemories: memoryId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("linkedMemories");
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  create,
  findById,
  findByRelationship,
  findUpcomingByRelationship,
  findPastByRelationship,
  findByStatus,
  update,
  updateStatus,
  remove,
  save,
  linkMemory,
  unlinkMemory,
};