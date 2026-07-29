const { TOOL_TYPES } = require("../tool.types");

module.exports = [
  {
    name: TOOL_TYPES.UPDATE_PROFILE,

    description:
      "Update the current user's personal profile information.",

    when: [
      "The user wants to change their name.",
      "The user wants to update their bio.",
      "The user wants to change their avatar.",
      "The user wants to edit their personal profile.",
    ],

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
    },
  },

  {
    name: TOOL_TYPES.GET_PROFILE,

    description:
      "Retrieve the current user's profile.",

    when: [
      "The user asks to see their profile.",
      "The user asks what their name is.",
      "The user asks what their bio is.",
      "The user wants their profile information.",
    ],

    parameters: {},
  },
];