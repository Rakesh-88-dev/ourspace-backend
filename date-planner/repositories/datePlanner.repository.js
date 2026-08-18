const DatePlanner = require("../models/DatePlanner");

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
  return DatePlanner.findById(id);
};

// =====================================================
// FIND ALL BY RELATIONSHIP
// =====================================================

const findByRelationship = (relationshipId) => {
  return DatePlanner.find({
    relationship: relationshipId,
  }).sort({ date: 1 });
};

// =====================================================
// FIND UPCOMING DATES
// =====================================================

const findUpcomingByRelationship = (relationshipId) => {
  return DatePlanner.find({
    relationship: relationshipId,
    date: {
      $gte: new Date(),
    },
    status: "planned",
  }).sort({ date: 1 });
};

// =====================================================
// FIND PAST DATES
// =====================================================

const findPastByRelationship = (relationshipId) => {
  return DatePlanner.find({
    relationship: relationshipId,
    date: {
      $lt: new Date(),
    },
  }).sort({ date: -1 });
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
  }).sort({ date: 1 });
};

// =====================================================
// UPDATE
// =====================================================

const update = (id, data) => {
  return DatePlanner.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

// =====================================================
// UPDATE STATUS
// =====================================================

const updateStatus = (id, status) => {
  return DatePlanner.findByIdAndUpdate(
    id,
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    }
  );
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

const save = (datePlanner) => {
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
      linkedMemory: memoryId,
    },
    {
      new: true,
      runValidators: true,
    }
  );
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
};