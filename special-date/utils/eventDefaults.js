const EVENT_DEFAULTS = {
  Anniversary: {
    occasionCategory: "relationship",
    isRecurring: true,
  },

  Birthday: {
    occasionCategory: "birthday",
    isRecurring: true,
  },

  Holiday: {
    occasionCategory: "holiday",
    isRecurring: true,
  },

  Travel: {
    occasionCategory: "travel",
    isRecurring: false,
  },

  Meeting: {
    occasionCategory: "meeting",
    isRecurring: false,
  },

  Interview: {
    occasionCategory: "achievement",
    isRecurring: false,
  },

  Exam: {
    occasionCategory: "achievement",
    isRecurring: false,
  },

  Custom: {
    occasionCategory: "custom",
    isRecurring: false,
  },
};

module.exports = EVENT_DEFAULTS;