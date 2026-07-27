const { TOOL_TYPES } = require("../tool.types");

module.exports = [
  {
    name: TOOL_TYPES.CREATE_SPECIAL_DATE,

    description: "Create a special date for the current user.",

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
        description: "Title of the special date.",
      },

      date: {
        type: "string",
        required: true,
        description: "Date in ISO format.",
      },

      type: {
        type: "string",
        required: false,
        description:
          "Birthday, Anniversary, Interview, Exam, Meeting, Holiday, Travel or Custom.",
      },

      note: {
        type: "string",
        required: false,
        description: "Additional note for the event.",
      },

      recurring: {
        type: "boolean",
        required: false,
        description: "Whether this event repeats every year.",
      },

      shared: {
        type: "boolean",
        required: false,
        description: "Whether this event is shared with the partner.",
      },
    },
  },

  {
    name: TOOL_TYPES.GET_SPECIAL_DATES,

    description: "Retrieve one or more special dates of the current user.",

    when: [
      "The user asks for all special dates.",
      "The user asks when a birthday is.",
      "The user asks when an anniversary is.",
      "The user asks for upcoming events.",
      "The user asks about an important date.",
    ],

    parameters: {
      title: {
        type: "string",
        required: false,
        description:
          "Optional title of the special date. Leave empty to fetch all.",
      },
    },
  },

  {
    name: TOOL_TYPES.UPDATE_SPECIAL_DATE,

    description: "Update an existing special date.",

    when: [
      "The user wants to change a birthday.",
      "The user wants to change an anniversary.",
      "The user wants to update an event.",
      "The user wants to edit a saved date.",
    ],

    parameters: {
      title: {
        type: "string",
        required: true,
        description: "Existing title of the special date.",
      },

      updates: {
        type: "object",
        required: true,
        description: "Fields to update.",
      },
    },
  },

  {
    name: TOOL_TYPES.DELETE_SPECIAL_DATE,

    description: "Delete a special date.",

    when: [
      "The user wants to remove a birthday.",
      "The user wants to remove an anniversary.",
      "The user wants to delete an event.",
      "The user wants to forget a special date.",
    ],

    parameters: {
      title: {
        type: "string",
        required: true,
        description: "Title of the special date to delete.",
      },
    },
  },
];