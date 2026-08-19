const express = require("express");

const router = express.Router();

const protect = require(
  "../../middleware/authMiddleware"
);

const validate = require(
  "../../middleware/validate"
);

const demoGuard = require(
  "../../demo/middleware/demoGuard"
);

const datePlannerController = require(
  "../controllers/datePlanner.controller"
);

const {
  createDatePlanValidation,
  updateDatePlanValidation,
  updateDatePlanStatusValidation,
  datePlanIdValidation,
} = require(
  "../validators/datePlanner.validator"
);

// =====================================================
// CREATE DATE PLAN
// =====================================================

router.post(
  "/",
  protect,
  demoGuard,
  createDatePlanValidation,
  validate,
  datePlannerController.createDatePlan
);

// =====================================================
// GET ALL DATE PLANS
// =====================================================

router.get(
  "/",
  protect,
  datePlannerController.getDatePlans
);

// =====================================================
// GET UPCOMING DATE PLANS
// =====================================================

router.get(
  "/upcoming",
  protect,
  datePlannerController.getUpcomingDatePlans
);

// =====================================================
// GET PAST DATE PLANS
// =====================================================

router.get(
  "/past",
  protect,
  datePlannerController.getPastDatePlans
);

// =====================================================
// GET SINGLE DATE PLAN
// =====================================================

router.get(
  "/:id",
  protect,
  datePlanIdValidation,
  validate,
  datePlannerController.getDatePlan
);

// =====================================================
// UPDATE DATE PLAN
// =====================================================

router.put(
  "/:id",
  protect,
  demoGuard,
  datePlanIdValidation,
  updateDatePlanValidation,
  validate,
  datePlannerController.updateDatePlan
);

// =====================================================
// UPDATE DATE PLAN STATUS
// =====================================================

router.patch(
  "/:id/status",
  protect,
  demoGuard,
  updateDatePlanStatusValidation,
  validate,
  datePlannerController.updateDatePlanStatus
);

// =====================================================
// DELETE DATE PLAN
// =====================================================

router.delete(
  "/:id",
  protect,
  demoGuard,
  datePlanIdValidation,
  validate,
  datePlannerController.deleteDatePlan
);

// =====================================================
// LINK MEMORY TO DATE PLAN
// =====================================================

router.patch(
  "/:id/memory",
  protect,
  demoGuard,
  datePlanIdValidation,
  validate,
  datePlannerController.linkMemoryToDatePlan
);

module.exports = router;


