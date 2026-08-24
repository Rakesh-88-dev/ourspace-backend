const {
  buildSystemPrompt,
} = require("../prompts");

const memoryReflectionPrompt = require(
  "../prompts/memoryReflectionPrompt"
);

const {
  parseToolResponse,
} = require("../tools/tool.parser");

const {
  executeTool,
} = require("../tools/tool.executor");

const ProviderRegistry = require(
  "../providers/provider.registry"
);

const AppError = require("../utils/AppError");

/**
 * =====================================================
 * TOOL FRIENDLY RESPONSES
 * =====================================================
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
      action?.result?.code ===
      "AURA_PERMISSION_DENIED"
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
 * BUILD WISHLIST RESPONSE
 * =====================================================
 */

const buildWishlistReply = (actions = []) => {
  const wishlistAction = actions.find(
    (action) =>
      action?.tool === "get_wishlist"
  );

  if (!wishlistAction) {
    return null;
  }

  if (
    wishlistAction?.result?.status !==
    "success"
  ) {
    return null;
  }

  const wishlistData =
    wishlistAction?.result?.data;

  const items =
    wishlistData?.items || [];

  const count = items.length;

  if (count === 0) {
    return "Your personal wishlist is currently empty.";
  }

  if (count === 1) {
    return "You currently have 1 item in your personal wishlist. Here's what you've saved:";
  }

  return `You currently have ${count} items in your personal wishlist. Here's what you've saved:`;
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
  const systemInstruction =
    buildSystemPrompt({
      memoryContext,
    });

  console.log(
    `[AURA] Generating response with provider: ${provider}`
  );

  const providerHandler =
    ProviderRegistry[provider];

  if (!providerHandler) {
    throw new AppError(
      `Unsupported AI provider: ${provider}`,
      400
    );
  }

  const rawResponse =
    await providerHandler({
      messages,
      model,
      systemInstruction,
    });

  const response =
    parseToolResponse(rawResponse);

  const executedActions = [];

  for (
    const action of response.actions || []
  ) {
    console.log(
      `[AURA] Executing tool: ${action.tool}`
    );

    const result =
      await executeTool({
        tool: action.tool,
        args: action.arguments,
        context,
      });

    executedActions.push({
      tool: action.tool,
      arguments: action.arguments,
      result,
    });

    if (
      result.status === "success"
    ) {
      console.log(
        `[AURA] Tool success: ${action.tool}`
      );
    } else {
      console.log(
        `[AURA] Tool failed: ${action.tool} → ${
          result.code ||
          "UNKNOWN_ERROR"
        }`
      );
    }
  }

  let finalReply = response.reply;

  const permissionDeniedReply =
    buildPermissionDeniedReply(
      executedActions
    );

  if (permissionDeniedReply) {
    finalReply =
      permissionDeniedReply;

    console.log(
      "[AURA] Permission denied response generated."
    );
  }

  const toolFailureReply =
    buildToolFailureReply(
      executedActions
    );

  if (
    !permissionDeniedReply &&
    toolFailureReply
  ) {
    finalReply =
      toolFailureReply;

    console.log(
      "[AURA] Tool failure response generated."
    );
  }

  const wishlistReply =
    buildWishlistReply(
      executedActions
    );

  if (
    !permissionDeniedReply &&
    !toolFailureReply &&
    wishlistReply
  ) {
    finalReply =
      wishlistReply;

    console.log(
      "[AURA] Wishlist response generated."
    );
  }

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
 * GENERATE MEMORY REFLECTION
 * =====================================================
 *
 * Dedicated Aura capability for Memory Viewer.
 *
 * This does NOT create a conversation and does NOT
 * execute tools. It simply asks Aura to reflect on
 * the supplied memory.
 */

const generateMemoryReflection = async ({
  memory,
  provider = "gemini",
  model = process.env.GEMINI_MODEL,
}) => {
  const providerHandler =
    ProviderRegistry[provider];

  if (!providerHandler) {
    throw new AppError(
      `Unsupported AI provider: ${provider}`,
      400
    );
  }

  if (!memory) {
    throw new AppError(
      "Memory is required for reflection.",
      400
    );
  }

  const memoryDate = memory.memoryDate
    ? new Date(
        memory.memoryDate
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "";

  const memoryData = {
    title: memory.title || "",
    caption: memory.caption || "",
    date: memoryDate,
    location: memory.location || "",
    tags: memory.tags || [],
    mediaType:
      memory.media?.type || "image",
  };

  const messages = [
    {
      role: "user",
      content: JSON.stringify(
        memoryData,
        null,
        2
      ),
    },
  ];

  console.log(
    `[AURA] Generating memory reflection with provider: ${provider}`
  );

  const rawResponse =
    await providerHandler({
      messages,
      model,
      systemInstruction:
        memoryReflectionPrompt,
    });

  let parsedResponse;

  try {
    parsedResponse =
      typeof rawResponse === "string"
        ? JSON.parse(rawResponse)
        : rawResponse;
  } catch (error) {
    console.error(
      "[AURA] Failed to parse reflection response:",
      rawResponse
    );

    throw new AppError(
      "Aura returned an invalid reflection.",
      500
    );
  }

  if (
    !parsedResponse ||
    typeof parsedResponse.reflection !==
      "string" ||
    !parsedResponse.reflection.trim()
  ) {
    throw new AppError(
      "Aura returned an invalid reflection.",
      500
    );
  }

  return {
    reflection:
      parsedResponse.reflection.trim(),
    metadata: {
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
  generateMemoryReflection,
};