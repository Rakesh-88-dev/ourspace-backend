const mongoose = require("mongoose");

const specialDateSchema = new mongoose.Schema(
  {
    title: {
  type: String,
  required: true,
  trim: true,
  maxlength: 100,
},

    date: {
      type: Date,
      required: true,
    },

    // 🔥 ADD THIS (VERY IMPORTANT)
    type: {
  type: String,
  trim:true,
  enum: [
    "Birthday",
    "Anniversary",
    "Interview",
    "Exam",
    "Meeting",
    "Holiday",
    "Travel",
    "Custom",
  ],
  default: "Custom",
},
occasionCategory: {
  type: String,
  enum: [
    "relationship",
    "birthday",
    "travel",
    "holiday",
    "achievement",
    "meeting",
    "custom",
  ],
  default: "custom",
},

isRecurring: {
  type: Boolean,
  default: false,
},

note: {
  type: String,
  trim: true,
  maxlength: 500,
  default: "",
},

isPinned: {
  type: Boolean,
  default: false,
},

relationship: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Relationship",
  required: true,
},

createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

reminderEnabled: {
  type: Boolean,
  default: true,
},

reminderDaysBefore: {
  type: Number,
  default: 1,
  min: 0,
  max: 365,
},
   
  },
  { timestamps: true }
);

specialDateSchema.index({ relationship: 1 });

specialDateSchema.index({
  relationship: 1,
  date: 1,
});

specialDateSchema.index({
  relationship: 1,
  type: 1,
});

module.exports = mongoose.model("SpecialDate", specialDateSchema);