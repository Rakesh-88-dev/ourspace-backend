const { TOOL_TYPES } = require("../tool.types");

module.exports = [
  {
    name: TOOL_TYPES.UPDATE_PROFILE,
    description: "Update the current user's profile.",

    parameters: {
      name: {
        type: "string",
        required: false,
      },

      bio: {
        type: "string",
        required: false,
      },

      avatar: {
        type: "string",
        required: false,
      },

      relationshipStatus: {
        type: "string",
        required: false,
      },
    },
  },
];