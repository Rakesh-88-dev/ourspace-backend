const mapMessage = (message) => ({
  id: message._id.toString(),
  role: message.role,
  content: message.content,
  createdAt: message.createdAt,
});

const mapMessages = (messages = []) =>
  messages.map(mapMessage);

module.exports = {
  mapMessage,
  mapMessages,
};