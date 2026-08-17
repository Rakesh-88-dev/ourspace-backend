const ConversationRepository = require("./conversation.query");
const {
  generateResponse,
} = require("../services/ai.service");
const {
  markMemoriesUsed,
} = require("../memory/memory.service");

const mapHistoryForAI = require("../utils/mapHistoryForAI");
const {
  buildContext,
} = require("../context/context.service");


const { buildMemoryContext } = require("../memory/memory.context");
const AppError = require("../utils/AppError");

/**
 * Handles the complete AI conversation flow.
 */
const processConversation = async ({
  conversationId,
  userId,
  prompt,
}) => {
  let conversation;

  // Find existing conversation or create a new one
  if (conversationId) {
    conversation =
      await ConversationRepository.findConversation({
        conversationId,
        userId,
      });

    if (!conversation) {
      throw new AppError("Conversation not found.", 404);
    }
  } else {
    conversation =
      await ConversationRepository.createConversation({
        userId,
      });
  }

  // Save user message
  await ConversationRepository.saveUserMessage({
    conversationId: conversation._id,
    prompt,
  });

  // Update conversation cache
  await ConversationRepository.updateConversationCache({
    conversationId: conversation._id,
    lastMessage: prompt,
  });

  // Load conversation history
  const history =
    await ConversationRepository.loadConversationHistory({
      conversationId: conversation._id,
    });

  // Convert history into AI messages
  const aiHistory = mapHistoryForAI(history);

  // Load long-term memory context
  const {
  context: memoryContext,
  keys: memoryKeys,
} = await buildMemoryContext({
  user: userId,
});

const aiMessages = [...aiHistory];



 // Generate AI response
const context = await buildContext({
  userId,
  conversationId: conversation._id,
});

const response = await generateResponse({
  messages: aiMessages,
  memoryContext,
  context,
});

// Generate title for new conversations
if (
  conversation.title === "New Chat" &&
  response.title?.trim()
) {
  await ConversationRepository.updateConversationTitle({
    conversationId: conversation._id,
    title: response.title.trim(),
  });
}

// Save assistant reply
await ConversationRepository.saveAssistantMessage({
  conversationId: conversation._id,
  reply: response.reply,
});

// Update conversation cache
await ConversationRepository.updateConversationCache({
  conversationId: conversation._id,
  lastMessage: response.reply,
});

// Mark memories as used
await markMemoriesUsed({
  user: userId,
  keys: memoryKeys,
});

// Return response
return {
  conversationId: conversation._id,
  ...response,
};
};

/**
 * Rename a conversation.
 */
const renameConversation = async ({
  conversationId,
  userId,
  title,
}) => {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    throw new AppError(
      "Conversation title cannot be empty.",
      400
    );
  }

  const conversation =
    await ConversationRepository.renameConversation({
      conversationId,
      userId,
      title: trimmedTitle,
    });

  if (!conversation) {
    throw new AppError(
      "Conversation not found.",
      404
    );
  }

  return conversation;
};

/**
 * Soft delete a conversation.
 */
const deleteConversation = async ({
  conversationId,
  userId,
}) => {
  const conversation =
    await ConversationRepository.deleteConversation({
      conversationId,
      userId,
    });

  if (!conversation) {
    throw new AppError(
      "Conversation not found.",
      404
    );
  }

  return conversation;
};

module.exports = {
  processConversation,
  renameConversation,
  deleteConversation,
};