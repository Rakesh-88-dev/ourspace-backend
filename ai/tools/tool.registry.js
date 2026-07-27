const memoryTool = require("./memory.tool");
const wishlistTool = require("./wishlist.tool");
const specialDateTool = require("./specialDate.tool");
const profileTool = require("./profile.tool");
const searchTool = require("./search.tool");

/**
 * Global Tool Registry
 *
 * Every tool operation in Aura is registered here.
 * The executor uses this registry to find and execute tools.
 */
const ToolRegistry = Object.freeze({
  ...memoryTool,
  ...wishlistTool,
  ...specialDateTool,
  ...profileTool,
  ...searchTool,
});

module.exports = ToolRegistry;