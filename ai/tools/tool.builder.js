const ToolManifest = require("./tool.manifest");

/**
 * Builds the tool prompt that is injected into
 * the AI system prompt.
 */
const buildToolPrompt = () => {
  if (!ToolManifest.length) {
    return "";
  }

  const lines = [];

  lines.push("AVAILABLE TOOLS");
  lines.push("");

  ToolManifest.forEach((tool) => {
    lines.push(`Tool: ${tool.name}`);
    lines.push(`Description: ${tool.description}`);
    lines.push("");

    if (tool.when?.length) {
    lines.push("When to use:");

    tool.when.forEach((example) => {
      lines.push(`- ${example}`);
    });

    lines.push("");
  }

    lines.push("Parameters:");

    const parameters = tool.parameters || {};
    const entries = Object.entries(parameters);

    if (!entries.length) {
      lines.push("- None");
    } else {
      entries.forEach(([name, config]) => {
        const required = config.required
          ? "required"
          : "optional";

        const description =
          config.description || "";

        lines.push(
          `- ${name} (${config.type}, ${required}) ${description}`
        );
      });
    }

    lines.push("");
  });

  lines.push("RESPONSE FORMAT");
  lines.push("");

  lines.push("Always return ONLY valid JSON.");
  lines.push("");

  lines.push(`{
  "reply": "Response shown to the user",
  "title": null,
  "actions": [],
  "metadata": {}
}`);

  lines.push("");

  lines.push("Each action must follow:");

  lines.push(`{
  "tool": "tool_name",
  "arguments": {}
}`);

  lines.push("");

  lines.push("Rules:");

  lines.push("- Never return any JSON other than this structure.");
  lines.push("- reply is required.");
  lines.push("- title must be a string or null.");
  lines.push("- actions must always be an array.");
  lines.push("- metadata must always be an object.");
  lines.push("- Use an empty actions array if no tool is required.");
  lines.push("- Tool must exactly match one of the available tool names.");
  lines.push("- Arguments must match the tool parameters.");

  return lines.join("\n");
};

module.exports = {
  buildToolPrompt,
};