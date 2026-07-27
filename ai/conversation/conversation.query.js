const Conversation = require("../../models/Conversation");
const AIMessage = require("../../models/AIMessage");

/**
 * Create a new conversation.
 */
const createConversation = async ({
  userId,
}) => {
  return Conversation.create({
    user: userId,
  });
};

/**
 * Find a conversation by ID and owner.
 */
const findConversation = async ({
  conversationId,
  userId,
}) => {
  return Conversation.findOne({
    _id: conversationId,
    user: userId,
    isArchived: false,
    isDeleted: false,
  });
};

/**
 * Save a user message.
 */
const saveUserMessage = async ({
  conversationId,
  prompt,
}) => {
  return AIMessage.create({
    conversation: conversationId,
    role: "user",
    content: prompt,
  });
};

/**
 * Save an assistant message.
 */
const saveAssistantMessage = async ({
  conversationId,
  reply,
}) => {
  return AIMessage.create({
    conversation: conversationId,
    role: "assistant",
    content: reply,
    provider: "gemini",
    model: process.env.GEMINI_MODEL,
  });
};

/**
 * Load conversation history for AI.
 */
const loadConversationHistory = async ({
  conversationId,
  limit = 20,
}) => {
  const messages = await AIMessage.find({
    conversation: conversationId,
    isDeleted: false,
  })
    .sort({
      createdAt: -1,
    })
    .limit(limit)
    .lean();

  return messages.reverse();
};

/**
 * Update cached conversation metadata.
 */
const updateConversationCache = async ({
  conversationId,
  lastMessage,
}) => {
  const now = new Date();

  return Conversation.findByIdAndUpdate(
    conversationId,
    {
      $set: {
        lastMessage,
        lastMessageAt: now,
        lastActivityAt: now,
      },
      $inc: {
        messageCount: 1,
      },
    },
    {
      new: true,
    }
  );
};

/**
 * Update conversation title.
 */
const updateConversationTitle = async ({
  conversationId,
  title,
}) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    {
      $set: {
        title,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

/**
 * Rename a conversation.
 */
const renameConversation = async ({
  conversationId,
  userId,
  title,
}) => {
  return Conversation.findOneAndUpdate(
    {
      _id: conversationId,
      user: userId,
      isDeleted: false,
    },
    {
      title,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

/**
 * Soft delete a conversation.
 */
const deleteConversation = async ({
  conversationId,
  userId,
}) => {
  return Conversation.findOneAndUpdate(
    {
      _id: conversationId,
      user: userId,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    },
    {
      new: true,
    }
  );
};

/**
 * List all active conversations.
 */
const listConversations = async ({
  userId,
}) => {
  return Conversation.find({
    user: userId,
    isDeleted: false,
  })
    .sort({
      lastActivityAt: -1,
    })
    .lean();
};

/**
 * Get conversation with all messages.
 */
const getConversation = async ({
  conversationId,
  userId,
}) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
    isDeleted: false,
  }).lean();

  if (!conversation) {
    return null;
  }

  const messages = await AIMessage.find({
    conversation: conversationId,
    isDeleted: false,
  })
    .sort({
      createdAt: 1,
    })
    .lean();

  return {
    conversation,
    messages,
  };
};

const ConversationRepository = {
  createConversation,
  findConversation,
  saveUserMessage,
  saveAssistantMessage,
  loadConversationHistory,
  updateConversationCache,
  updateConversationTitle,
  renameConversation,
  deleteConversation,
  listConversations,
  getConversation,
};

module.exports = ConversationRepository;