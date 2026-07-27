const {
  processConversation,
  renameConversation,
  deleteConversation,
} = require("../ai/conversation/conversation.service");

const {
  listConversations,
  getConversation,
} = require("../ai/conversation/conversation.query");

const {
  mapConversations,
  mapConversationDetails,
} = require("../ai/conversation/conversation.mapper");


const {
  mapMessages,
} = require("../ai/conversation/message.mapper");

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await listConversations(userId);

const response = mapConversations(conversations);

res.status(200).json({
  success: true,
  count: response.length,
  conversations: response,
});
  } catch (error) {
    console.error("Get Conversations Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations.",
    });
  }
};


const chat = async (req, res) => {
  try {
    const {
      prompt,
      conversationId,
    } = req.body;

   if (
  typeof prompt !== "string" ||
  !prompt.trim()
) {
  return res.status(400).json({
    success: false,
    message: "Prompt is required.",
  });
}

    const userId = req.user._id;

    const result = await processConversation({
      conversationId,
      userId,
      prompt: prompt.trim(),
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }



};

const getConversationById = async (req, res, next) => {
     
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const result = await getConversation({
      conversationId,
      userId,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

   return res.status(200).json({
  success: true,
  conversation: mapConversationDetails(result.conversation),
  messages: mapMessages(result.messages),
});

  } catch (error) {
    next(error);
  }
};

const renameConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.user._id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const conversation = await renameConversation({
      conversationId,
      userId,
      title,
    });

    return res.status(200).json({
      success: true,
      conversation: mapConversationDetails(conversation),
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    await deleteConversation({
      conversationId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  chat,
  getConversations,
  getConversationById,
  renameConversationById,
  deleteConversationById,
};