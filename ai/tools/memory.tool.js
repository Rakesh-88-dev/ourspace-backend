const MemoryRepository = require("../memory/memory.query");

const {
  TOOL_TYPES,
} = require("./tool.types");

module.exports = {
  [TOOL_TYPES.CREATE_MEMORY]: async ({
    args,
    context,
  }) => {
    return MemoryRepository.saveMemory({
      user: context.userId,
      memory: args,
    });
  },

  [TOOL_TYPES.UPDATE_MEMORY]: async ({
    args,
    context,
  }) => {
    return MemoryRepository.updateMemory({
      user: context.userId,
      type: args.type,
      key: args.key,
      updates: args.updates,
    });
  },

  [TOOL_TYPES.DELETE_MEMORY]: async ({
    args,
    context,
  }) => {
    return MemoryRepository.softDeleteMemory({
      user: context.userId,
      type: args.type,
      key: args.key,
    });
  },

  [TOOL_TYPES.SEARCH_MEMORY]: async ({
    args,
    context,
  }) => {
    return MemoryRepository.findMemoryByKey({
      user: context.userId,
      type: args.type,
      key: args.key,
    });
  },
};