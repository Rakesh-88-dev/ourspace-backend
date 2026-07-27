const MS_PER_DAY = 1000 * 60 * 60 * 24;

const calculateEventData = (event) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const originalDate = new Date(event.date);
  let nextOccurrence = new Date(originalDate);

  // Handle recurring events
  if (event.isRecurring) {
    nextOccurrence.setFullYear(today.getFullYear());

    if (nextOccurrence < today) {
      nextOccurrence.setFullYear(today.getFullYear() + 1);
    }
  }

  const daysLeft = Math.ceil(
    (nextOccurrence - today) / MS_PER_DAY
  );

  const result = {
    ...event,
    nextOccurrence,
    daysLeft,
  };

  // Only relationship events get daysTogether
  if (event.occasionCategory === "relationship") {
    result.daysTogether = Math.floor(
      (today - originalDate) / MS_PER_DAY
    );
  }

  return result;
};

module.exports = {
  calculateEventData,
};