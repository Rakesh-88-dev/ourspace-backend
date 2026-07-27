const asyncHandler = require("../../middleware/asyncHandler");
const specialDateService = require("../services/specialDate.service");

const createSpecialDate = asyncHandler(async (req, res) => {
  const specialDate = await specialDateService.createSpecialDate(
    req.user._id,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Special date created successfully.",
    data: specialDate,
  });
});

const getSpecialDates = asyncHandler(async (req, res) => {
  const specialDates = await specialDateService.getSpecialDates(req.user._id);

  res.status(200).json({
    success: true,
    data: specialDates,
  });
});

const updateSpecialDate = asyncHandler(async (req, res) => {
  const specialDate = await specialDateService.updateSpecialDate(
    req.user._id,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Special date updated successfully.",
    data: specialDate,
  });
});

const deleteSpecialDate = asyncHandler(async (req, res) => {
  await specialDateService.deleteSpecialDate(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Special date deleted successfully.",
  });
});

const getUpcomingSpecialDates = asyncHandler(async (req, res) => {
  const data = await specialDateService.getUpcomingSpecialDates(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
});

const getTodaySpecialDates = asyncHandler(async (req, res) => {
  const data = await specialDateService.getTodaySpecialDates(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  createSpecialDate,
  getSpecialDates,
  updateSpecialDate,
  deleteSpecialDate,
  getUpcomingSpecialDates,
  getTodaySpecialDates,
};