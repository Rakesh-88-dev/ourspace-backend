const { body, param } = require(
  "express-validator"
);

// =====================================================
// CREATE DATE PLAN VALIDATION
// =====================================================

const createDatePlanValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 100 })
    .withMessage(
      "Title cannot exceed 100 characters."
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
      "Description cannot exceed 1000 characters."
    ),

  body("date")
    .notEmpty()
    .withMessage("Date is required.")
    .isISO8601()
    .withMessage("Invalid date."),

  body("category")
    .optional()
    .isIn([
      "Dinner",
      "Movie",
      "Cafe",
      "Trip",
      "Outing",
      "Surprise",
      "Home",
      "Other",
    ])
    .withMessage(
      "Invalid date category."
    ),

  body("location")
    .optional()
    .isObject()
    .withMessage(
      "Location must be an object."
    ),

  body("location.name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage(
      "Location name cannot exceed 150 characters."
    ),

  body("location.address")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage(
      "Location address cannot exceed 300 characters."
    ),

  body("budget")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage(
      "Budget must be a positive number."
    ),
];

// =====================================================
// UPDATE DATE PLAN VALIDATION
// =====================================================

const updateDatePlanValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "Title cannot exceed 100 characters."
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage(
      "Description cannot exceed 5000 characters."
    ),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date."),

  body("category")
    .optional()
    .isIn([
      "Dinner",
      "Movie",
      "Cafe",
      "Trip",
      "Outing",
      "Surprise",
      "Home",
      "Other",
    ])
    .withMessage(
      "Invalid date category."
    ),

  body("location")
    .optional()
    .isObject()
    .withMessage(
      "Location must be an object."
    ),

  body("location.name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage(
      "Location name cannot exceed 150 characters."
    ),

  body("location.address")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage(
      "Location address cannot exceed 300 characters."
    ),

  body("budget")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage(
      "Budget must be a positive number."
    ),
];

// =====================================================
// UPDATE DATE PLAN STATUS
// =====================================================

const updateDatePlanStatusValidation = [
  param("id")
    .isMongoId()
    .withMessage(
      "Invalid Date Plan ID."
    ),

  body("status")
    .notEmpty()
    .withMessage(
      "Status is required."
    )
    .isIn([
      "planned",
      "completed",
      "cancelled",
    ])
    .withMessage(
      "Status must be planned, completed, or cancelled."
    ),
];

// =====================================================
// DATE PLAN ID VALIDATION
// =====================================================

const datePlanIdValidation = [
  param("id")
    .isMongoId()
    .withMessage(
      "Invalid Date Plan ID."
    ),
];

// =====================================================
// LINK MEMORY TO DATE PLAN VALIDATION
// =====================================================

const linkMemoryValidation = [
  param("id")
    .isMongoId()
    .withMessage(
      "Invalid Date Plan ID."
    ),

  body("memoryId")
    .notEmpty()
    .withMessage(
      "Memory ID is required."
    )
    .isMongoId()
    .withMessage(
      "Invalid Memory ID."
    ),
];

// =====================================================
// UNLINK MEMORY FROM DATE PLAN VALIDATION
// =====================================================

const unlinkMemoryValidation = [
  param("id")
    .isMongoId()
    .withMessage(
      "Invalid Date Plan ID."
    ),

  param("memoryId")
    .isMongoId()
    .withMessage(
      "Invalid Memory ID."
    ),
];

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createDatePlanValidation,
  updateDatePlanValidation,
  updateDatePlanStatusValidation,
  datePlanIdValidation,
  linkMemoryValidation,
  unlinkMemoryValidation,
};