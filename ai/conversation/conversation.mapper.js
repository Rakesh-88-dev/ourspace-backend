const PREVIEW_LENGTH = 60;

const createPreview = (text) => {
  if (!text) return null;

  const clean = text.replace(/\s+/g, " ").trim();

  return clean.length <= PREVIEW_LENGTH
    ? clean
    : `${clean.slice(0, PREVIEW_LENGTH)}...`;
};

const mapConversation = (conversation) => {
  if (!conversation) return null;

  return {
    id: conversation._id.toString(),
    title: conversation.title,
    lastMessage: conversation.lastMessage,
    lastMessagePreview: createPreview(conversation.lastMessage),
    messageCount: conversation.messageCount,
    lastActivityAt: conversation.lastActivityAt,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
};

const mapConversations = (conversations = []) =>
  conversations.map(mapConversation);

const mapConversationDetails = (conversation) => ({
  ...mapConversation(conversation),
  provider: conversation.provider,
  model: conversation.model,
});

module.exports = {
  mapConversation,
  mapConversations,
  mapConversationDetails,
};