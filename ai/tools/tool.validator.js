const HandlerRegistry = require("./handler.registry");

/**
 * Validate parsed AI response.
 */
const validateToolResponse = (response) => {
  if (!response || typeof response !== "object") {
    throw new Error("Invalid AI response.");
  }

  // Validate the complete response
  const validatedResponse =
    HandlerRegistry.response.handle(response);

  // Validate each action
  validatedResponse.actions = validatedResponse.actions.map(
    (action) => HandlerRegistry.tool.handle(action)
  );

  return validatedResponse;
};

module.exports = {
  validateToolResponse,
};