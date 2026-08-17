const {
  buildSystemPrompt,
} = require("../prompts");

const {
  parseToolResponse,
} = require("../tools/tool.parser");

const {
  executeTool,
} = require("../tools/tool.executor");

const ProviderRegistry = require("../providers/provider.registry");

const AppError = require("../utils/AppError");

/**
 * =====================================================
 * TOOL FRIENDLY RESPONSES
 * =====================================================
 *
 * These messages are used when Aura successfully
 * understands the user's request, but the requested
 * tool cannot be executed because of permissions.
 */

const PERMISSION_MESSAGES = {
  get_wishlist:
    "I can help with your wishlist, but I don't currently have permission to access it. You can enable Wishlist access below.",

  create_wishlist_item:
    "I can help you add something to your wishlist, but I don't currently have permission to modify your wishlist. You can enable Wishlist access below.",

  update_wishlist_item:
    "I can help update your wishlist, but I don't currently have permission to modify it. You can enable Wishlist access below.",

  delete_wishlist_item:
    "I can help remove that wishlist item, but I don't currently have permission to modify your wishlist. You can enable Wishlist access below.",

  search_memory:
    "I can help you find that memory, but I don't currently have permission to access your shared memories. You can enable Memory access below.",

  create_memory:
    "I can help save that memory, but I don't currently have permission to create memories. You can enable Memory access below.",

  update_memory:
    "I can help update that memory, but I don't currently have permission to modify memories. You can enable Memory access below.",

  delete_memory:
    "I can help remove that memory, but I don't currently have permission to delete memories. You can enable Memory access below.",

  get_profile:
    "I can help with your profile, but I don't currently have permission to view your profile information. You can enable Profile access below.",

  update_profile:
    "I can help update your profile, but I don't currently have permission to modify it. You can enable Profile access below.",

  get_special_dates:
    "I can help with your special dates, but I don't currently have permission to view them. You can enable Special Dates access below.",

  create_special_date:
    "I can help add that special date, but I don't currently have permission to create special dates. You can enable Special Dates access below.",

  update_special_date:
    "I can help update that special date, but I don't currently have permission to modify special dates. You can enable Special Dates access below.",

  delete_special_date:
    "I can help remove that special date, but I don't currently have permission to delete special dates. You can enable Special Dates access below.",
};


/**
 * =====================================================
 * BUILD PERMISSION DENIED RESPONSE
 * =====================================================
 */

const buildPermissionDeniedReply = (actions = []) => {
  const deniedAction = actions.find(
    (action) =>
      action?.result?.code === "AURA_PERMISSION_DENIED"
  );

  if (!deniedAction) {
    return null;
  }

  const tool = deniedAction.tool;

  return (
    PERMISSION_MESSAGES[tool] ||
    "I understand what you'd like me to do, but I don't currently have permission to access that information. You can enable the required Aura access below."
  );
};


/**
 * =====================================================
 * BUILD GENERAL TOOL FAILURE RESPONSE
 * =====================================================
 */

const buildToolFailureReply = (actions = []) => {
  const failedAction = actions.find(
    (action) =>
      action?.result?.status === "failure"
  );

  if (!failedAction) {
    return null;
  }

  // Permission failures are handled separately.
  if (
    failedAction?.result?.code ===
    "AURA_PERMISSION_DENIED"
  ) {
    return null;
  }

  return "I understood your request, but I wasn't able to complete that action right now. Please try again.";
};


/**
 * =====================================================
 * GENERATE CONVERSATIONAL AI RESPONSE
 * =====================================================
 */

const generateResponse = async ({
  messages,
  provider = "gemini",
  model = process.env.GEMINI_MODEL,
  memoryContext = "",
  context = {},
}) => {

  // ===================================================
  // 1. Build system instruction
  // ===================================================

  const systemInstruction = buildSystemPrompt({
    memoryContext,
  });

  /*
   * Do not dump the complete system prompt into the
   * terminal. It can contain internal instructions,
   * memory context and other sensitive application
   * context.
   */

  console.log(
    `[AURA] Generating response with provider: ${provider}`
  );


  // ===================================================
  // 2. Resolve provider
  // ===================================================

  const providerHandler =
    ProviderRegistry[provider];

  if (!providerHandler) {
    throw new AppError(
      `Unsupported AI provider: ${provider}`,
      400
    );
  }


  // ===================================================
  // 3. Generate Gemini/provider response
  // ===================================================

  const rawResponse = await providerHandler({
    messages,
    model,
    systemInstruction,
  });


  // ===================================================
  // 4. Parse structured response
  // ===================================================

  const response =
    parseToolResponse(rawResponse);


  // ===================================================
  // 5. Execute requested tools
  // ===================================================

  const executedActions = [];

  for (const action of response.actions || []) {

    console.log(
      `[AURA] Executing tool: ${action.tool}`
    );

    const result = await executeTool({
      tool: action.tool,
      args: action.arguments,
      context,
    });

    executedActions.push({
      tool: action.tool,
      arguments: action.arguments,
      result,
    });


    // -----------------------------------------------
    // Useful development logging
    // -----------------------------------------------

    if (result.status === "success") {
      console.log(
        `[AURA] Tool success: ${action.tool}`
      );
    } else {
      console.log(
        `[AURA] Tool failed: ${action.tool} → ${result.code || "UNKNOWN_ERROR"}`
      );
    }
  }


  // ===================================================
  // 6. Determine final Aura reply
  // ===================================================

  let finalReply = response.reply;


  // -----------------------------------------------
  // Permission denied
  // -----------------------------------------------

  const permissionDeniedReply =
    buildPermissionDeniedReply(
      executedActions
    );

  if (permissionDeniedReply) {
    finalReply = permissionDeniedReply;

    console.log(
      "[AURA] Permission denied response generated."
    );
  }


  // -----------------------------------------------
  // Other tool failure
  // -----------------------------------------------

  const toolFailureReply =
    buildToolFailureReply(
      executedActions
    );

  if (
    !permissionDeniedReply &&
    toolFailureReply
  ) {
    finalReply = toolFailureReply;

    console.log(
      "[AURA] Tool failure response generated."
    );
  }


  // ===================================================
  // 7. Return final structured response
  // ===================================================

  return {
    reply: finalReply,

    title: response.title,

    actions: executedActions,

    metadata: {
      ...(response.metadata || {}),
      provider,
      model,
    },
  };
};


/**
 * =====================================================
 * EXPORT
 * =====================================================
 */

module.exports = {
  generateResponse,
};