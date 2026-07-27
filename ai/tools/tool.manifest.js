const memoryDefinitions = require("./definitions/memory.definition");
const wishlistDefinitions = require("./definitions/wishlist.definition");
const specialDateDefinitions = require("./definitions/specialDate.definition");
const profileDefinitions = require("./definitions/profile.definition");
const searchDefinitions = require("./definitions/search.definition");

/**
 * Global Tool Manifest
 *
 * Every tool definition that Aura exposes to an AI model
 * is collected here.
 */
const ToolManifest = Object.freeze([
  ...memoryDefinitions,
  ...wishlistDefinitions,
  ...specialDateDefinitions,
  ...profileDefinitions,
  ...searchDefinitions,
]);

module.exports = ToolManifest;