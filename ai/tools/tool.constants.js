/**
 * AI response types.
 */
const RESPONSE_TYPES = Object.freeze({
  RESPONSE: "response",
  TOOL: "tool",
});

/**
 * Standard tool execution status.
 */
const TOOL_STATUS = Object.freeze({
  SUCCESS: "success",
  FAILURE: "failure",
});

module.exports = {
  RESPONSE_TYPES,
  TOOL_STATUS,
};