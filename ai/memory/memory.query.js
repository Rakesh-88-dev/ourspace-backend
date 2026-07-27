const AIMemory = require("../../models/AIMemory");

const upsertMemory = async ({
  user,
  type,
  key,
  value,
  source = "ai",
  confidence = 1,
  metadata = {},
}) => {
  return AIMemory.findOneAndUpdate(
    {
      user,
      type,
      key,
      isDeleted: false,
    },
    {
      $set: {
        value,
        source,
        confidence,
        metadata,
      },
    },
   {
  returnDocument: "after",
  upsert: true,
  runValidators: true,
  setDefaultsOnInsert: true,
}
  );
};

const findMemoryByKey = async ({
  user,
  type,
  key,
}) => {
  return AIMemory.findOne({
    user,
    type,
    key,
    isDeleted: false,
  }).lean();
};

const getUserMemories = async ({
  user,
}) => {
  return AIMemory.find({
    user,
    isDeleted: false,
  })
    .sort({
      updatedAt: -1,
    })
    .lean();
};

const updateMemory = async ({
  user,
  type,
  key,
  updates,
}) => {
  return AIMemory.findOneAndUpdate(
    {
      user,
      type,
      key,
      isDeleted: false,
    },
    {
      $set: updates,
    },
    {
  returnDocument: "after",
  runValidators: true,
}
  );
};

const softDeleteMemory = async ({
  user,
  type,
  key,
}) => {
  return AIMemory.findOneAndUpdate(
    {
      user,
      type,
      key,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    },
   {
  returnDocument: "after",
  runValidators: true,
}
  );
};
/**
 * Save or update a memory.
 */
const saveMemory = async ({
  user,
  memory,
}) => {
  const existingMemory = await findMemoryByKey({
    user,
    type: memory.type,
    key: memory.key,
  });

  if (!existingMemory) {
    return upsertMemory({
      user,
      type: memory.type,
      key: memory.key,
      value: memory.value,
      confidence: memory.confidence,
      source: memory.source ?? "ai",
      metadata: memory.metadata ?? {},
    });
  }

  return updateMemory({
    user,
    type: memory.type,
    key: memory.key,
    updates: {
      value: memory.value,
      confidence: Math.max(
  existingMemory.confidence ?? 1,
  memory.confidence ?? 1
),
      source: memory.source ?? existingMemory.source,
      metadata: memory.metadata ?? existingMemory.metadata,
    },
  });
};

/**
 * Mark memories as used.
 */
const touchMemories = async ({
  user,
  keys,
}) => {
  if (!Array.isArray(keys) || keys.length === 0) {
  return;
}

  await AIMemory.updateMany(
    {
      user,
      key: { $in: keys },
      isDeleted: false,
    },
    {
      $inc: {
        usageCount: 1,
      },
      $set: {
        lastAccessedAt: new Date(),
      },
    }
  );
};

const MemoryRepository = {
  upsertMemory,
  findMemoryByKey,
  getUserMemories,
  updateMemory,
  saveMemory,
  softDeleteMemory,
  touchMemories,
};
module.exports = MemoryRepository;