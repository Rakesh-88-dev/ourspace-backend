const systemPrompt = require("./systemPrompt");
const { buildToolPrompt } = require("../tools/tool.builder");

/**
 * Builds the complete system instruction
 * for the AI model.
 */
const buildSystemPrompt = ({
  memoryContext = "",
} = {}) => {
  const sections = [
    systemPrompt,
    buildToolPrompt(),
  ];

  if (memoryContext) {
    sections.push(memoryContext);
  }

  return sections
    .filter(Boolean)
    .join("\n\n");
};

module.exports = {
  buildSystemPrompt,
};