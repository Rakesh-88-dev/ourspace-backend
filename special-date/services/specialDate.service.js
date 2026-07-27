const specialDateRepository = require("../repositories/specialDate.repository");

const relationshipRepository = require(
  "../../relationship/repositories/relationship.repository"
);

const {
  calculateEventData,
} = require("../utils/dateCalculator");

const EVENT_DEFAULTS = require("../utils/eventDefaults");

const ForbiddenError = require("../../errors/ForbiddenError");
const NotFoundError = require("../../errors/NotFoundError");

const getActiveRelationship = async (userId) => {
  const relationship = await relationshipRepository.findActiveRelationship(
    userId
  );

  if (!relationship) {
    throw new ForbiddenError(
      "You must connect with a partner before using Special Dates."
    );
  }

  return relationship;
};

const createSpecialDate = async (userId, data) => {
  const relationship = await getActiveRelationship(userId);

  const defaults =
    EVENT_DEFAULTS[data.type] ||
    EVENT_DEFAULTS.Custom;

  return specialDateRepository.create({
    ...data,

    occasionCategory:
      data.occasionCategory ??
      defaults.occasionCategory,

    isRecurring:
      data.isRecurring ??
      defaults.isRecurring,

    relationship: relationship._id,
    createdBy: userId,
  });
};

const getSpecialDates = async (userId) => {
  const relationship = await getActiveRelationship(userId);

  const specialDates =
    await specialDateRepository.findByRelationship(
      relationship._id
    );

  return specialDates.map((item) =>
    calculateEventData(item.toObject())
  );
};

const updateSpecialDate = async (userId, specialDateId, data) => {
  const relationship = await getActiveRelationship(userId);

  const specialDate =
    await specialDateRepository.findById(specialDateId);

  if (!specialDate) {
    throw new NotFoundError("Special date not found.");
  }

  if (!specialDate.relationship.equals(relationship._id)) {
    throw new ForbiddenError(
      "You are not authorized to update this special date."
    );
  }

  return specialDateRepository.update(specialDateId, data);
};

const deleteSpecialDate = async (userId, specialDateId) => {
  const relationship = await getActiveRelationship(userId);

  const specialDate =
    await specialDateRepository.findById(specialDateId);

  if (!specialDate) {
    throw new NotFoundError("Special date not found.");
  }

  if (!specialDate.relationship.equals(relationship._id)) {
    throw new ForbiddenError(
      "You are not authorized to delete this special date."
    );
  }

  await specialDateRepository.remove(specialDateId);
};

const getUpcomingSpecialDates = async (userId) => {
  const relationship =
    await relationshipRepository.findActiveRelationship(userId);

  if (!relationship) {
    throw new NotFoundError("Relationship not found.");
  }

  const dates =
    await specialDateRepository.findUpcomingByRelationship(
      relationship._id
    );

  return dates
    .map((item) => calculateEventData(item.toObject()))
    .filter((item) => item.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
};

const getTodaySpecialDates = async (userId) => {
  const relationship =
    await relationshipRepository.findActiveRelationship(userId);

  if (!relationship) {
    throw new NotFoundError("Relationship not found.");
  }

  const dates =
    await specialDateRepository.findTodayByRelationship(
      relationship._id
    );

  const today = new Date();

  return dates.filter((item) => {
    const date = new Date(item.date);

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth()
    );
  });
};

const togglePinSpecialDate = async (userId, specialDateId) => {
  const relationship = await getActiveRelationship(userId);

  const specialDate =
    await specialDateRepository.findById(specialDateId);

  if (!specialDate) {
    throw new NotFoundError("Special date not found.");
  }

  if (!specialDate.relationship.equals(relationship._id)) {
    throw new ForbiddenError(
      "You are not authorized to update this special date."
    );
  }

  return specialDateRepository.togglePin(specialDateId);
};

const getPinnedEvents = async (userId) => {
  const relationship = await getActiveRelationship(userId);

  const pinnedEvents =
    await specialDateRepository.findPinnedByRelationship(
      relationship._id
    );

  return pinnedEvents
    .map((event) => calculateEventData(event.toObject()))
    .sort((a, b) => a.daysLeft - b.daysLeft);
};

module.exports = {
  createSpecialDate,
  getSpecialDates,
  updateSpecialDate,
  deleteSpecialDate,
  getUpcomingSpecialDates,
  getTodaySpecialDates,
  togglePinSpecialDate,
  getPinnedEvents,
};