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

module.exports = {
  create,
  findById,
  findByRelationship,
  update,
  remove,
  save,
  findUpcomingByRelationship,
  findTodayByRelationship,
};