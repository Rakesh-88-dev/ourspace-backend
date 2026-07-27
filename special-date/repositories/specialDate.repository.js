const SpecialDate = require("..//../models/SpecialDate");

const create = (data) => {
  return SpecialDate.create(data);
};

const findById = (id) => {
  return SpecialDate.findById(id);
};

const findByRelationship = (relationshipId) => {
  return SpecialDate.find({
    relationship: relationshipId,
  }).sort({ date: 1 });
};

const update = (id, data) => {
  return SpecialDate.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const remove = (id) => {
  return SpecialDate.findByIdAndDelete(id);
};

const save = (specialDate) => {
  return specialDate.save();
};

const findUpcomingByRelationship = (relationshipId) => {
  return SpecialDate.find({
    relationship: relationshipId,
  }).sort({ date: 1 });
};

const findTodayByRelationship = (relationshipId) => {
  return SpecialDate.find({
    relationship: relationshipId,
  });
};

const togglePin = async (id) => {
  const specialDate = await SpecialDate.findById(id);

  if (!specialDate) return null;

  specialDate.isPinned = !specialDate.isPinned;

  return specialDate.save();
};

const findPinnedByRelationship = (relationshipId) => {
  return SpecialDate.find({
    relationship: relationshipId,
    isPinned: true,
  }).sort({ date: 1 });
};

module.exports = {
  create,
  findById,
  findByRelationship,
  update,
  remove,
  save,
  findUpcomingByRelationship,
  findTodayByRelationship,

  togglePin,
  findPinnedByRelationship,
};