const asyncHandler = require(
  "../../middleware/asyncHandler"
);

const datePlannerService = require(
  "../services/datePlanner.service"
);

// =====================================================
// CREATE
// =====================================================

const createDatePlan = asyncHandler(
  async (req, res) => {
    const datePlan =
      await datePlannerService.createDatePlan(
        req.user._id,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Date plan created successfully.",
      data: datePlan,
    });
  }
);

// =====================================================
// GET ALL
// =====================================================

const getDatePlans = asyncHandler(
  async (req, res) => {
    const datePlans =
      await datePlannerService.getDatePlans(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: datePlans,
    });
  }
);

// =====================================================
// GET SINGLE
// =====================================================

const getDatePlan = asyncHandler(
  async (req, res) => {
    const datePlan =
      await datePlannerService.getDatePlan(
        req.user._id,
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: datePlan,
    });
  }
);

// =====================================================
// UPCOMING
// =====================================================

const getUpcomingDatePlans =
  asyncHandler(async (req, res) => {
    const data =
      await datePlannerService.getUpcomingDatePlans(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data,
    });
  });

// =====================================================
// PAST
// =====================================================

const getPastDatePlans =
  asyncHandler(async (req, res) => {
    const data =
      await datePlannerService.getPastDatePlans(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data,
    });
  });

// =====================================================
// UPDATE
// =====================================================

const updateDatePlan =
  asyncHandler(async (req, res) => {
    const datePlan =
      await datePlannerService.updateDatePlan(
        req.user._id,
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Date plan updated successfully.",
      data: datePlan,
    });
  });

// =====================================================
// UPDATE STATUS
// =====================================================

const updateDatePlanStatus =
  asyncHandler(async (req, res) => {
    const datePlan =
      await datePlannerService.updateDatePlanStatus(
        req.user._id,
        req.params.id,
        req.body.status
      );

    res.status(200).json({
      success: true,
      message:
        "Date plan status updated successfully.",
      data: datePlan,
    });
  });

// =====================================================
// DELETE
// =====================================================

const deleteDatePlan =
  asyncHandler(async (req, res) => {
    await datePlannerService.deleteDatePlan(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Date plan deleted successfully.",
    });
  });

// =====================================================
// LINK MEMORY
// =====================================================

const linkMemoryToDatePlan =
  asyncHandler(async (req, res) => {
    const datePlan =
      await datePlannerService.linkMemoryToDatePlan(
        req.user._id,
        req.params.id,
        req.body.memoryId
      );

    res.status(200).json({
      success: true,
      message:
        "Memory linked to date plan successfully.",
      data: datePlan,
    });
  });

// =====================================================
// UNLINK MEMORY
// =====================================================

const unlinkMemoryFromDatePlan =
  asyncHandler(async (req, res) => {
    const datePlan =
      await datePlannerService.unlinkMemoryFromDatePlan(
        req.user._id,
        req.params.id,
        req.params.memoryId
      );

    res.status(200).json({
      success: true,
      message:
        "Memory unlinked from date plan successfully.",
      data: datePlan,
    });
  });

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createDatePlan,
  getDatePlans,
  getDatePlan,
  getUpcomingDatePlans,
  getPastDatePlans,
  updateDatePlan,
  updateDatePlanStatus,
  deleteDatePlan,
  linkMemoryToDatePlan,
  unlinkMemoryFromDatePlan,
};