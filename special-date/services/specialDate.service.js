const specialDateRepository = require("../repositories/specialDate.repository");

const relationshipRepository = require(
  "../../relationship/repositories/relationship.repository"
);

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

  return specialDateRepository.create({
    ...data,
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

  const today = new Date();

  return specialDates.map((item) => {
    const data = item.toObject();

    if (data.type.toLowerCase() === "anniversary") {
  data.daysTogether = Math.floor(
    (today - new Date(data.date)) /
      (1000 * 60 * 60 * 24)
  );
} else {
  data.daysLeft = Math.ceil(
    (new Date(data.date) - today) /
      (1000 * 60 * 60 * 24)
  );
}

    return data;
  });
};
const updateSpecialDate = async (userId, specialDateId, data) => {
  const relationship = await getActiveRelationship(userId);

  const specialDate = await specialDateRepository.findById(specialDateId);

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

  const specialDate = await specialDateRepository.findById(specialDateId);

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

  const today = new Date();

  const upcoming = dates
    .map((item) => {
      let nextDate = new Date(item.date);

      if (item.isRecurring) {
        nextDate.setFullYear(today.getFullYear());

        if (nextDate < today) {
          nextDate.setFullYear(today.getFullYear() + 1);
        }
      }

      const diff =
        Math.ceil(
          (nextDate - today) /
            (1000 * 60 * 60 * 24)
        );

      return {
        ...item.toObject(),
        daysRemaining: diff,
      };
    })
    .filter((item) => item.daysRemaining >= 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  return upcoming;
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

  const specialDate = await specialDateRepository.findById(specialDateId);

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = pinnedEvents.map((event) => {
    const data = event.toObject();

    let nextOccurrence = new Date(data.date);

    if (data.isRecurring || data.type === "Anniversary") {
      nextOccurrence.setFullYear(today.getFullYear());

      if (nextOccurrence < today) {
        nextOccurrence.setFullYear(today.getFullYear() + 1);
      }
    }

    const daysLeft = Math.ceil(
      (nextOccurrence - today) /
      (1000 * 60 * 60 * 24)
    );

    if (data.type === "Anniversary") {
      data.daysTogether = Math.floor(
        (today - new Date(data.date)) /
        (1000 * 60 * 60 * 24)
      );
    }

    data.daysLeft = daysLeft;
    data.nextOccurrence = nextOccurrence;

    return data;
  });

  events.sort((a, b) => a.daysLeft - b.daysLeft);

  return events;
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