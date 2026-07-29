const ConversationRepository = require("./conversation.query");
const {
  generateResponse,
} = require("../services/ai.service");
const {
  markMemoriesUsed,
} = require("../memory/memory.service");

const mapHistoryForAI = require("../utils/mapHistoryForAI");

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
  console.log("1. Conversation ready");

await ConversationRepository.saveUserMessage({
  conversationId: conversation._id,
  prompt,
});

console.log("2. User message saved");

await ConversationRepository.updateConversationCache({
  conversationId: conversation._id,
  lastMessage: prompt,
});

console.log("3. Cache updated");

// Load conversation history
const history =
  await ConversationRepository.loadConversationHistory({
    conversationId: conversation._id,
  });

// Convert history into AI messages
const aiMessages = mapHistoryForAI(history);

// Load long-term memory context
const {
  context: memoryContext,
  keys: memoryKeys,
} = await buildMemoryContext({
  user: userId,
});

console.log("5. Memory context built");

const response = await generateResponse({
  messages: aiMessages,
  memoryContext,
  context: {
    userId,
    conversationId: conversation._id,
  },
});

console.log("6. AI response received", response);

await ConversationRepository.saveAssistantMessage({
  conversationId: conversation._id,
  reply: response.reply,
});

console.log("7. Assistant message saved");

await markMemoriesUsed({
  user: userId,
  keys: memoryKeys,
});

console.log("8. Memories marked");

// Update conversation cache
await ConversationRepository.updateConversationCache({
  conversationId: conversation._id,
  lastMessage: response.reply,
});

// Mark memories as used


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