const mongoose = require("mongoose");

const datePlannerSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC INFORMATION
    // =====================================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    // Planned date and time
    date: {
      type: Date,
      required: true,
    },

    // =====================================================
    // CATEGORY
    // =====================================================

    category: {
      type: String,
      enum: [
        "Dinner",
        "Movie",
        "Cafe",
        "Trip",
        "Outing",
        "Surprise",
        "Home",
        "Other",
      ],
      default: "Other",
    },

    // =====================================================
    // LOCATION
    // =====================================================

    location: {
      name: {
        type: String,
        trim: true,
        maxlength: 150,
        default: "",
      },

      address: {
        type: String,
        trim: true,
        maxlength: 300,
        default: "",
      },
    },

    // =====================================================
    // BUDGET
    // =====================================================

    budget: {
      type: Number,
      min: 0,
      default: null,
    },

    // =====================================================
    // STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        "planned",
        "completed",
        "cancelled",
      ],
      default: "planned",
      index: true,
    },

    // =====================================================
    // RELATIONSHIP
    // =====================================================

    relationship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Relationship",
      required: true,
      index: true,
    },

    // =====================================================
    // CREATED BY
    // =====================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =====================================================
    // LINKED MEMORIES
    // =====================================================

    linkedMemories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Memory",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =========================================================
// INDEXES
// =========================================================

datePlannerSchema.index({
  relationship: 1,
  date: 1,
});

datePlannerSchema.index({
  relationship: 1,
  status: 1,
});

datePlannerSchema.index({
  createdBy: 1,
  relationship: 1,
});

module.exports = mongoose.model(
  "DatePlanner",
  datePlannerSchema
);