const Memory = require("../../models/Memory");

class MemoryRepository {
  // ==========================================
  // Create
  // ==========================================

  async create(data) {
    return Memory.create(data);
  }

  // ==========================================
  // Find by ID
  // ==========================================

  async findById(id) {
    return Memory.findOne({
      _id: id,
      isDeleted: false,
    }).populate("uploadedBy", "name email avatar");
  }

  // ==========================================
  // Personal / Shared Memories
  // ==========================================

  async findByRelationshipAndSpace(relationshipId, space) {
    return Memory.find({
      relationship: relationshipId,
      space,
      isDeleted: false,
    })
      .populate("uploadedBy", "name email avatar")
      .sort({ memoryDate: -1 });
  }


  // ==========================================
// Personal Memories
// ==========================================

async findPersonalMemories(userId) {
  return Memory.find({
    uploadedBy: userId,
    space: "personal",
    isDeleted: false,
  })
    .populate("uploadedBy", "name email avatar")
    .sort({
      memoryDate: -1,
    });
}


// ==========================================
// Dashboard Memories
// Personal + Shared
// ==========================================

async findDashboardMemories(
  userId,
  relationshipId
) {
  const accessConditions = [
    {
      space: "personal",
      uploadedBy: userId,
    },
  ];

  if (relationshipId) {
    accessConditions.push({
      space: "shared",
      relationship: relationshipId,
    });
  }

  return Memory.find({
    isDeleted: false,

    $or: accessConditions,
  })
    .populate(
      "uploadedBy",
      "name email avatar"
    )
    .sort({
      createdAt: -1,
    });
}

  // ==========================================
  // Recent Memories
  // ==========================================

  async findRecent(relationshipId, limit = 10) {
    return Memory.find({
      relationship: relationshipId,
      isDeleted: false,
    })
      .populate("uploadedBy", "name email avatar")
      .sort({ memoryDate: -1 })
      .limit(limit);
  }

 // ==========================================
// On This Day (Personal + Shared)
// ==========================================

async findOnThisDay(userId, relationshipId, month, day) {
  return Memory.find({
    isDeleted: false,
    $expr: {
      $and: [
        {
          $eq: [
            {
              $month: "$memoryDate",
            },
            month,
          ],
        },
        {
          $eq: [
            {
              $dayOfMonth: "$memoryDate",
            },
            day,
          ],
        },
      ],
    },
    $or: [
      {
        space: "personal",
        uploadedBy: userId,
      },
      ...(relationshipId
        ? [
            {
              space: "shared",
              relationship: relationshipId,
            },
          ]
        : []),
    ],
  })
    .populate("uploadedBy", "name avatar")
    .sort({ memoryDate: -1 });
}

  // ==========================================
  // Favourite Memories
  // ==========================================

  async findFavourites(relationshipId) {
    return Memory.find({
      relationship: relationshipId,
      isFavourite: true,
      isDeleted: false,
    })
      .populate("uploadedBy", "name email avatar")
      .sort({ memoryDate: -1 });
  }

  // ==========================================
  // Search Memories
  // ==========================================

  async search(relationshipId, keyword) {
    return Memory.find({
      relationship: relationshipId,
      isDeleted: false,
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          caption: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          tags: {
            $in: [new RegExp(keyword, "i")],
          },
        },
      ],
    })
      .populate("uploadedBy", "name email avatar")
      .sort({ memoryDate: -1 });
  }

  // ==========================================
  // Update
  // ==========================================

  async update(id, data) {
  return Memory.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("uploadedBy", "name email avatar");
}

  // ==========================================
// Move Memory
// ==========================================

async moveMemory(id, data) {
  return Memory.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("uploadedBy", "name email avatar")
    .populate(
  "relationship",
  "_id members status anniversaryDate"
);
}



  // ==========================================
  // Soft Delete
  // ==========================================

  async softDelete(id) {
    return Memory.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      {
        new: true,
      }
    );
  }

  // ==========================================
  // Restore
  // ==========================================

  async restore(id) {
    return Memory.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
      },
      {
        new: true,
      }
    );
  }

  // ==========================================
// Count Shared Memories
// ==========================================

async countSharedMemories(relationshipId) {
  return Memory.countDocuments({
    relationship: relationshipId,
    space: "shared",
    isDeleted: false,
  });
}

  // ==========================================
// Return Shared Memories To Owners
// ==========================================

async returnSharedMemoriesToOwners(
  relationshipId,
  session
) {
  return Memory.updateMany(
    {
      relationship: relationshipId,
      space: "shared",
      isDeleted: false,
    },
    {
      $set: {
        space: "personal",
        relationship: null,
      },
    },
    {
      session,
    }
  );
}

  // ==========================================
  // Save
  // ==========================================

  async save(memory) {
    return memory.save();
  }
}

module.exports = new MemoryRepository();