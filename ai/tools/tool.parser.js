const {
  validateToolResponse,
} = require("./tool.validator");

/**
 * Parse AI tool response.
 * Supports both JSON strings and already-parsed objects.
 */
const parseToolResponse = (rawResponse) => {
  if (!rawResponse) {
    throw new Error("Invalid AI response.");
  }

  // Already parsed object
  if (typeof rawResponse === "object") {
    return validateToolResponse(rawResponse);
  }

  // JSON string
  if (typeof rawResponse === "string") {
    let parsed;

    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      throw new Error("AI returned invalid JSON.");
    }

    return validateToolResponse(parsed);
  }

  throw new Error("Invalid AI response.");
};

module.exports = {
  parseToolResponse,
};