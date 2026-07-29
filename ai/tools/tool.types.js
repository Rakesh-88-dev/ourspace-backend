const TOOL_TYPES = Object.freeze({
  // Memory
  CREATE_MEMORY: "create_memory",
  UPDATE_MEMORY: "update_memory",
  DELETE_MEMORY: "delete_memory",
  SEARCH_MEMORY: "search_memory",

  // Wishlist
  CREATE_WISHLIST_ITEM: "create_wishlist_item",
  GET_WISHLIST: "get_wishlist",
  UPDATE_WISHLIST_ITEM: "update_wishlist_item",
  DELETE_WISHLIST_ITEM: "delete_wishlist_item",

  // Special Dates
  CREATE_SPECIAL_DATE: "create_special_date",
  GET_SPECIAL_DATES: "get_special_dates",
  UPDATE_SPECIAL_DATE: "update_special_date",
  DELETE_SPECIAL_DATE: "delete_special_date",

  // Profile
  UPDATE_PROFILE: "update_profile",
  GET_PROFILE: "get_profile",

  // Future
  CREATE_EVENT: "create_event",
  SEARCH_CONVERSATION: "search_conversation",
});

module.exports = {
  TOOL_TYPES,
};