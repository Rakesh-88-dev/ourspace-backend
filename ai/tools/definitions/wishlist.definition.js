const { TOOL_TYPES } = require("../tool.types");

const wishlistDefinitions = [
  {
    name: TOOL_TYPES.CREATE_WISHLIST_ITEM,

    description: "Creates a new item in the user's wishlist.",

    when: [
      "The user wants to buy something in the future.",
      "The user asks to add something to their wishlist.",
      "The user asks Aura to save an item they want to purchase.",
      "The user mentions they wish to own a product.",
      "The user wants to remember something they plan to buy."
    ],

    parameters: {
      title: {
        type: "string",
        required: true,
        description: "Name of the wishlist item."
      },

      category: {
        type: "string",
        required: false,
        description: "Category of the wishlist item."
      },

      link: {
        type: "string",
        required: false,
        description: "Product link if provided by the user."
      },

      image: {
        type: "string",
        required: false,
        description: "Image URL of the wishlist item."
      }
    }
  },

  {
    name: TOOL_TYPES.GET_WISHLIST,

    description: "Retrieves wishlist items for the user.",

    when: [
      "The user asks to see their wishlist.",
      "The user asks what items they wanted to buy.",
      "The user asks to list saved wishlist items.",
      "The user asks to view their wishlist."
    ],

    parameters: {}
  },

  {
    name: TOOL_TYPES.UPDATE_WISHLIST_ITEM,

    description: "Updates an existing wishlist item.",

    when: [
      "The user wants to rename a wishlist item.",
      "The user changes information about a wishlist item.",
      "The user marks an item as bought.",
      "The user edits a wishlist item.",
      "The user updates the category, link or image."
    ],

    parameters: {
      title: {
        type: "string",
        required: true,
        description: "Title of the wishlist item to update."
      },

      updates: {
        type: "object",
        required: true,
        description: "Fields that should be updated."
      }
    }
  },

  {
    name: TOOL_TYPES.DELETE_WISHLIST_ITEM,

    description: "Deletes a wishlist item.",

    when: [
      "The user removes an item from their wishlist.",
      "The user no longer wants an item.",
      "The user deletes a wishlist item.",
      "The user asks Aura to remove a saved item."
    ],

    parameters: {
      title: {
        type: "string",
        required: true,
        description: "Title of the wishlist item to delete."
      }
    }
  }
];

module.exports = wishlistDefinitions;