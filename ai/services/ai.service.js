
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
 * Generate conversational AI response.
 */
const generateResponse = async ({
  messages,
  provider = "gemini",
  model = process.env.GEMINI_MODEL,
  memoryContext = "",
  context = {},
}) => {
  const systemInstruction = buildSystemPrompt({
    memoryContext,
  });
  console.log("========== SYSTEM PROMPT ==========");
console.log(systemInstruction);
console.log("===================================");

  

const providerHandler = ProviderRegistry[provider];

if (!providerHandler) {
  throw new AppError(
    `Unsupported AI provider: ${provider}`,
    400
  );
}

const rawResponse = await providerHandler({
  messages,
  model,
  systemInstruction,
});

  

  const response = parseToolResponse(rawResponse);

  const executedActions = [];

  for (const action of response.actions) {
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
  }

  return {
    reply: response.reply,
    title: response.title,
    actions: executedActions,
    metadata: response.metadata || {
      provider,
      model,
    },
  };
};

/**
 * Generate structured AI output.
 * Used for memory extraction and future structured tasks.
 */

/**
 * Generate a conversation title.
 */


module.exports = {
  generateResponse,
  
 
};