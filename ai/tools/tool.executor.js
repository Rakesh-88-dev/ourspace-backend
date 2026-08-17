const ToolRegistry = require("./tool.registry");

const {
  TOOL_STATUS,
} = require("./tool.constants");

const {
  authorizeTool,
} = require("./tool.policy");

/**
 * =====================================================
 * EXECUTE REGISTERED AND AUTHORIZED TOOL
 * =====================================================
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
    console.error(
      `[AURA] Unknown tool requested: ${tool}`
    );

    return {
      status: TOOL_STATUS.FAILURE,
      tool,
      error: `Unknown tool: ${tool}`,
      code: "TOOL_NOT_FOUND",
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

    console.log(
      `[AURA] Authorization granted: ${tool} → ${authorization.permission}`
    );


    // ==========================================
    // 3. Execute authorized tool
    // ==========================================

    console.log(
      `[AURA] Executing tool: ${tool}`
    );

    console.log(
      `[AURA] Tool arguments:`,
      JSON.stringify(args, null, 2)
    );

    console.log(
      `[AURA] Tool userId:`,
      context?.userId
    );

    const data = await handler({
      args,
      context,
    });


    // ==========================================
    // 4. Successful execution
    // ==========================================

    console.log(
      `[AURA] Tool execution successful: ${tool}`
    );

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
    // 5. Detailed error logging
    // ==========================================

    console.error(
      "=========================================="
    );

    console.error(
      "========== AURA TOOL ERROR ==============="
    );

    console.error(
      "=========================================="
    );

    console.error(
      "Tool:",
      tool
    );

    console.error(
      "User ID:",
      context?.userId
    );

    console.error(
      "Arguments:",
      JSON.stringify(
        args,
        null,
        2
      )
    );

    console.error(
      "Error message:",
      error?.message
    );

    console.error(
      "Error code:",
      error?.code
    );

    console.error(
      "Error name:",
      error?.name
    );

    console.error(
      "Stack:",
      error?.stack
    );

    console.error(
      "=========================================="
    );


    // ==========================================
    // 6. Return structured failure
    // ==========================================

    return {
      status: TOOL_STATUS.FAILURE,

      tool,

      error:
        error?.message ||
        "Tool execution failed.",

      ...(error?.code
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