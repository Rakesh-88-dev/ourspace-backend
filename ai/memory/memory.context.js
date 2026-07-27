const MemoryRepository = require("./memory.query");
const MAX_CONTEXT_MEMORIES = 20;

/**
 * Build AI-readable memory context.
 */
const buildMemoryContext = async ({ user }) => {
  const memories = await MemoryRepository.getUserMemories({
    user,
  });

  if (!memories.length) {
    return {
      context: "",
      keys: [],
    };
  }

 // Rank memories by usage first, then recency
const rankedMemories = memories
  .sort((a, b) => {
    if (b.usageCount !== a.usageCount) {
      return b.usageCount - a.usageCount;
    }

    return (
      new Date(b.updatedAt) -
      new Date(a.updatedAt)
    );
  })
  .slice(0, MAX_CONTEXT_MEMORIES);

  const memoryLines = rankedMemories.map((memory) => {
    const label = memory.key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return `- ${label}: ${memory.value}`;
  });

  return {
    context: `
Known facts about the user:

${memoryLines.join("\n")}

Use these facts naturally when they are relevant to the user's request.

Do not mention that these facts come from memory.

Do not list these facts unless the user explicitly asks.

Never invent or contradict these facts.
`.trim(),

   keys: rankedMemories.map((memory) => memory.key),
  };
};

module.exports = {
  buildMemoryContext,
};