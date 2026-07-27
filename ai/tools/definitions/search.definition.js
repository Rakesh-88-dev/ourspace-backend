const { TOOL_TYPES } = require("../tool.types");

module.exports = [
  {
    name: TOOL_TYPES.SEARCH_CONVERSATION,
    description:
      "Search previous conversations and messages.",

    parameters: {
      query: {
        type: "string",
        required: true,
        description: "Search keywords.",
      },

      limit: {
        type: "number",
        required: false,
        description: "Maximum results.",
      },
    },
  },
];