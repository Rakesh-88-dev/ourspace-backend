const handleTool = (action) => {
  if (!action || typeof action !== "object") {
    throw new Error("Invalid tool action.");
  }

  if (!action.tool || typeof action.tool !== "string") {
    throw new Error("Tool name is missing.");
  }

  return {
    tool: action.tool,
    arguments: action.arguments || {},
  };
};

module.exports = {
  handle: handleTool,
};