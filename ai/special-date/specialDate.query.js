const SpecialDate = require("../../models/SpecialDate");

/**
 * Create a special date.
 */
const createSpecialDate = async ({
  userId,
  title,
  date,
  type = "Custom",
  note = "",
  recurring = false,
  shared = false,
}) => {
  return SpecialDate.create({
    userId,
    title: title.trim(),
    date,
    type,
    note: note.trim(),
    recurring,
    shared,
  });
};

/**
 * Find a special date by title.
 */
const findSpecialDate = async ({
  userId,
  title,
}) => {
  return SpecialDate.findOne({
    userId,
    title: new RegExp(`^${title.trim()}$`, "i"),
  }).lean();
};

/**
 * Get all special dates.
 */
const getSpecialDates = async ({
  userId,
}) => {
  return SpecialDate.find({
    userId,
  })
    .sort({
      date: 1,
    })
    .lean();
};

/**
 * Update a special date.
 */
const updateSpecialDate = async ({
  userId,
  title,
  updates,
}) => {
  return SpecialDate.findOneAndUpdate(
    {
      userId,
      title: new RegExp(`^${title.trim()}$`, "i"),
    },
    {
      $set: updates,
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};

/**
 * Delete a special date.
 */
const deleteSpecialDate = async ({
  userId,
  title,
}) => {
  return SpecialDate.findOneAndDelete({
    userId,
    title: new RegExp(`^${title.trim()}$`, "i"),
  });
};

/**
 * Add a special date if it doesn't already exist.
 */
const addSpecialDate = async ({
  userId,
  specialDate,
}) => {
  const existingDate = await findSpecialDate({
    userId,
    title: specialDate.title,
  });

  if (existingDate) {
    return {
      success: false,
      reason: "already_exists",
      item: existingDate,
    };
  }

  const createdDate = await createSpecialDate({
    userId,
    title: specialDate.title,
    date: specialDate.date,
    type: specialDate.type,
    note: specialDate.note,
    recurring: specialDate.recurring,
    shared: specialDate.shared,
  });

  return {
    success: true,
    item: createdDate,
  };
};

const SpecialDateRepository = {
  createSpecialDate,
  findSpecialDate,
  getSpecialDates,
  updateSpecialDate,
  deleteSpecialDate,
  addSpecialDate,
};

module.exports = SpecialDateRepository;