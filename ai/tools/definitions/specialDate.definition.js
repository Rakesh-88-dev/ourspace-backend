const { TOOL_TYPES } = require("../tool.types");

module.exports = [
  // ==========================================
  // CREATE SPECIAL DATE
  // ==========================================

  {
    name: TOOL_TYPES.CREATE_SPECIAL_DATE,

    description:
      "Create a special date for the user's active relationship.",

    when: [
      "The user wants to add a birthday.",
      "The user wants to add an anniversary.",
      "The user wants to add an interview.",
      "The user wants to add an exam.",
      "The user wants to add a meeting.",
      "The user wants to add a holiday.",
      "The user wants to add a travel date.",
      "The user wants to save an important event.",
    ],

    parameters: {
      title: {
        type: "string",
        required: true,
        description:
          "Title of the special date.",
      },

      date: {
        type: "string",
        required: true,
        description:
          "Date of the event in ISO 8601 format, such as 2026-09-15.",
      },

      type: {
        type: "string",
        required: false,
        description:
          "Event type: Birthday, Anniversary, Interview, Exam, Meeting, Holiday, Travel, or Custom.",
      },

      note: {
        type: "string",
        required: false,
        description:
          "Optional note for the special date.",
      },

      isRecurring: {
        type: "boolean",
        required: false,
        description:
          "Whether the event repeats every year.",
      },

      reminderEnabled: {
        type: "boolean",
        required: false,
        description:
          "Whether reminders are enabled for this special date.",
      },

      reminderDaysBefore: {
        type: "number",
        required: false,
        description:
          "Number of days before the event for the reminder, from 0 to 365.",
      },
    },
  },

  // ==========================================
  // GET SPECIAL DATES
  // ==========================================

  {
    name: TOOL_TYPES.GET_SPECIAL_DATES,

    description:
      "Retrieve the special dates belonging to the user's active relationship.",

    when: [
      "The user asks for their special dates.",
      "The user asks when a birthday is.",
      "The user asks when an anniversary is.",
      "The user asks about upcoming special dates.",
      "The user asks about an important date.",
    ],

    parameters: {},
  },

  // ==========================================
  // UPDATE SPECIAL DATE
  // ==========================================

  {
    name: TOOL_TYPES.UPDATE_SPECIAL_DATE,

    description:
      "Update a special date belonging to the user's active relationship.",

    when: [
      "The user wants to change a birthday.",
      "The user wants to change an anniversary.",
      "The user wants to update an event.",
      "The user wants to edit a saved date.",
    ],

    parameters: {
      specialDateId: {
        type: "string",
        required: true,
        description:
          "MongoDB ID of the special date to update.",
      },

      updates: {
        type: "object",
        required: true,
        description:
          "Fields to update. Supported fields include title, date, type, note, isRecurring, reminderEnabled, and reminderDaysBefore.",
      },
    },
  },

  // ==========================================
  // DELETE SPECIAL DATE
  // ==========================================

  {
    name: TOOL_TYPES.DELETE_SPECIAL_DATE,

    description:
      "Delete a special date belonging to the user's active relationship.",

    when: [
      "The user wants to remove a birthday.",
      "The user wants to remove an anniversary.",
      "The user wants to delete an event.",
      "The user wants to forget a special date.",
    ],

    parameters: {
      specialDateId: {
        type: "string",
        required: true,
        description:
          "MongoDB ID of the special date to delete.",
      },
    },
  },
];