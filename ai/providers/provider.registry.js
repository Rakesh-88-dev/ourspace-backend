const { generateWithGemini } = require("../adapters/gemini.adapter");

module.exports = Object.freeze({
  gemini: generateWithGemini,
});