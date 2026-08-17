const ToolRegistry = require("./tool.registry");

const {
  TOOL_STATUS,
} = require("./tool.constants");

const {
  authorizeTool,
} = require("./tool.policy");

/**
 * Execute a registered and authorized tool.
 */
const executeTool = async ({
  tool,
  args = {},
  context = {},
}) => {
  // ==========================================
  // 1. Resolve tool handler
  // ==========================================

  const handler = ToolRegistry[tool];

  if (!handler) {
    return {
      status: TOOL_STATUS.FAILURE,
      tool,
      error: `Unknown tool: ${tool}`,
    };
  }

  try {
    // ==========================================
    // 2. Authorization
    // ==========================================

    const authorization =
      await authorizeTool({
        tool,
        context,
      });

    // ==========================================
    // 3. Execute authorized tool
    // ==========================================

    const data = await handler({
      args,
      context,
    });

    // ==========================================
    // 4. Return successful result
    // ==========================================

    return {
      status: TOOL_STATUS.SUCCESS,
      tool,
      data,

      authorization: {
        permission:
          authorization.permission,
      },
    };
  } catch (error) {
    // ==========================================
    // Authorization / execution failure
    // ==========================================

    return {
      status: TOOL_STATUS.FAILURE,
      tool,
      error: error.message,

      ...(error.code
        ? {
            code: error.code,
          }
        : {}),
    };
  }
};

module.exports = {
  executeTool,
};