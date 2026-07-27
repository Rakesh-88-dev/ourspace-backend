const { TOOL_TYPES } = require("../tool.types");

module.exports = [
  {
    name: TOOL_TYPES.CREATE_MEMORY,
    description:
      "Store a new long-term memory about the user.",

    parameters: {
      type: {
        type: "string",
        required: true,
        description:
          "Memory category such as PERSONAL, PREFERENCE, GOAL, WORK, EDUCATION, RELATIONSHIP, HEALTH or TRAVEL.",
      },

      key: {
        type: "string",
        required: true,
        description:
          "Unique identifier for this memory. Example: favorite_color",
      },

      value: {
        type: "string",
        required: true,
        description:
          "The information to remember.",
      },

      confidence: {
        type: "number",
        required: false,
        description:
          "Confidence score between 0 and 1.",
      },
    },
  },

  {
    name: TOOL_TYPES.UPDATE_MEMORY,

    description:
      "Update an existing stored memory.",

    parameters: {
      type: {
        type: "string",
        required: true,
      },

      key: {
        type: "string",
        required: true,
      },

      updates: {
        type: "object",
        required: true,
        description:
          "Fields to update.",
      },
    },
  },

  {
    name: TOOL_TYPES.DELETE_MEMORY,

    description:
      "Delete a stored memory.",

    parameters: {
      type: {
        type: "string",
        required: true,
      },

      key: {
        type: "string",
        required: true,
      },
    },
  },

  {
    name: TOOL_TYPES.SEARCH_MEMORY,

    description:
      "Retrieve a stored memory.",

    parameters: {
      type: {
        type: "string",
        required: true,
      },

      key: {
        type: "string",
        required: true,
      },
    },
  },
];