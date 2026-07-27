const formatConversation = (
  messages = [],
  options = {}
) => {
  const { assistantPrefix = true } = options;

  let conversation = "";

  for (const message of messages) {
    const speaker =
      message.role === "assistant"
        ? "Aura"
        : message.role === "system"
        ? "System"
        : "User";

    conversation += `${speaker}: ${message.content}\n`;
  }

  if (assistantPrefix) {
    conversation += "Aura:";
  }

  return conversation;
};

module.exports = formatConversation;