const mapHistoryForAI = (messages = []) => {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
};

module.exports = mapHistoryForAI;