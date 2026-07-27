const handleResponse = (response) => {
  return {
    reply: response.reply,
    title: response.title || null,
    actions: Array.isArray(response.actions)
      ? response.actions
      : [],
    metadata: response.metadata || {},
  };
};

module.exports = {
  handle: handleResponse,
};