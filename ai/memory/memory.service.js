const MemoryRepository = require("./memory.query");

/**
 * Mark memories as used.
 */
const markMemoriesUsed = async ({
  user,
  keys,
}) => {
  return MemoryRepository.touchMemories({
    user,
    keys,
  });
};

module.exports = {
  markMemoriesUsed,
};