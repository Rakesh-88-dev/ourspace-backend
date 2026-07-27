const ToolRegistry = require("./tool.registry");
const {
  TOOL_STATUS,
} = require("./tool.constants");

/**
 * Execute a registered tool.
 */
const executeTool = async ({
  tool,
  args = {},
  context = {},
}) => {
  const handler = ToolRegistry[tool];

  if (!handler) {
    throw new Error(
      `Unknown tool: ${tool}`
    );
  }

  try {
    const data = await handler({
      args,
      context,
    });

    return {
      status: TOOL_STATUS.SUCCESS,
      tool,
      data,
    };
  } catch (error) {
    return {
      status: TOOL_STATUS.FAILURE,
      tool,
      error: error.message,
    };
  }
};

module.exports = {
  executeTool,
};