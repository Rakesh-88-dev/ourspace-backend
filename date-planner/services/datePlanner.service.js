const datePlannerRepository = require(
  "../repositories/datePlanner.repository"
);

const relationshipRepository = require(
  "../../relationship/repositories/relationship.repository"
);

const Memory = require(
  "../../models/Memory"
);

const ForbiddenError = require(
  "../../errors/ForbiddenError"
);

const NotFoundError = require(
  "../../errors/NotFoundError"
);

// =====================================================
// GET ACTIVE RELATIONSHIP
// =====================================================

const getActiveRelationship = async (
  userId
) => {
  const relationship =
    await relationshipRepository.findActiveRelationship(
      userId
    );

  if (!relationship) {
    throw new ForbiddenError(
      "You must connect with a partner before using Date Planner."
    );
  }

  return relationship;
};

// =====================================================
// CREATE DATE PLAN
// =====================================================

const createDatePlan = async (
  userId,
  data
) => {
  const relationship =
    await getActiveRelationship(userId);

  return datePlannerRepository.create({
    ...data,

    relationship:
      relationship._id,

    createdBy: userId,
  });
};

// =====================================================
// GET ALL DATE PLANS
// =====================================================

const getDatePlans = async (
  userId
) => {
  const relationship =
    await getActiveRelationship(userId);

  return datePlannerRepository.findByRelationship(
    relationship._id
  );
};

// =====================================================
// GET UPCOMING DATE PLANS
// =====================================================

const getUpcomingDatePlans =
  async (userId) => {
    const relationship =
      await getActiveRelationship(
        userId
      );

    return datePlannerRepository.findUpcomingByRelationship(
      relationship._id
    );
  };

// =====================================================
// GET PAST DATE PLANS
// =====================================================

const getPastDatePlans = async (
  userId
) => {
  const relationship =
    await getActiveRelationship(
      userId
    );

  return datePlannerRepository.findPastByRelationship(
    relationship._id
  );
};

// =====================================================
// GET SINGLE DATE PLAN
// =====================================================

const getDatePlan = async (
  userId,
  datePlanId
) => {
  const relationship =
    await getActiveRelationship(
      userId
    );

  const datePlan =
    await datePlannerRepository.findById(
      datePlanId
    );

  if (!datePlan) {
    throw new NotFoundError(
      "Date plan not found."
    );
  }

  if (
    !datePlan.relationship.equals(
      relationship._id
    )
  ) {
    throw new ForbiddenError(
      "You are not authorized to access this date plan."
    );
  }

  return datePlan;
};

// =====================================================
// UPDATE DATE PLAN
// =====================================================

const updateDatePlan = async (
  userId,
  datePlanId,
  data
) => {
  const relationship =
    await getActiveRelationship(
      userId
    );

  const datePlan =
    await datePlannerRepository.findById(
      datePlanId
    );

  if (!datePlan) {
    throw new NotFoundError(
      "Date plan not found."
    );
  }

  if (
    !datePlan.relationship.equals(
      relationship._id
    )
  ) {
    throw new ForbiddenError(
      "You are not authorized to update this date plan."
    );
  }

  return datePlannerRepository.update(
    datePlanId,
    data
  );
};

// =====================================================
// UPDATE DATE PLAN STATUS
// =====================================================

const updateDatePlanStatus =
  async (
    userId,
    datePlanId,
    status
  ) => {
    const relationship =
      await getActiveRelationship(
        userId
      );

    const datePlan =
      await datePlannerRepository.findById(
        datePlanId
      );

    if (!datePlan) {
      throw new NotFoundError(
        "Date plan not found."
      );
    }

    if (
      !datePlan.relationship.equals(
        relationship._id
      )
    ) {
      throw new ForbiddenError(
        "You are not authorized to update this date plan."
      );
    }

    return datePlannerRepository.updateStatus(
      datePlanId,
      status
    );
  };

// =====================================================
// DELETE DATE PLAN
// =====================================================

const deleteDatePlan = async (
  userId,
  datePlanId
) => {
  const relationship =
    await getActiveRelationship(
      userId
    );

  const datePlan =
    await datePlannerRepository.findById(
      datePlanId
    );

  if (!datePlan) {
    throw new NotFoundError(
      "Date plan not found."
    );
  }

  if (
    !datePlan.relationship.equals(
      relationship._id
    )
  ) {
    throw new ForbiddenError(
      "You are not authorized to delete this date plan."
    );
  }

  await datePlannerRepository.remove(
    datePlanId
  );
};

// =====================================================
// LINK MEMORY TO DATE PLAN
// =====================================================

const linkMemoryToDatePlan =
  async (
    userId,
    datePlanId,
    memoryId
  ) => {
    const relationship =
      await getActiveRelationship(
        userId
      );

    // =================================================
    // VALIDATE MEMORY ID
    // =================================================

    if (!memoryId) {
      throw new NotFoundError(
        "Memory ID is required."
      );
    }

    // =================================================
    // FIND DATE PLAN
    // =================================================

    const datePlan =
      await datePlannerRepository.findById(
        datePlanId
      );

    if (!datePlan) {
      throw new NotFoundError(
        "Date plan not found."
      );
    }

    // =================================================
    // CHECK DATE PLAN RELATIONSHIP
    // =================================================

    if (
      !datePlan.relationship.equals(
        relationship._id
      )
    ) {
      throw new ForbiddenError(
        "You are not authorized to update this date plan."
      );
    }

    // =================================================
    // FIND MEMORY
    // =================================================

    const memory =
      await Memory.findOne({
        _id: memoryId,
        isDeleted: false,
      });

    if (!memory) {
      throw new NotFoundError(
        "Memory not found."
      );
    }

    // =================================================
    // CHECK MEMORY RELATIONSHIP
    // =================================================

    if (
      !memory.relationship ||
      !memory.relationship.equals(
        relationship._id
      )
    ) {
      throw new ForbiddenError(
        "You are not authorized to link this memory."
      );
    }

    // =================================================
    // LINK MEMORY
    // =================================================

    return datePlannerRepository.linkMemory(
      datePlanId,
      memoryId
    );
  };

// =====================================================
// UNLINK MEMORY FROM DATE PLAN
// =====================================================

const unlinkMemoryFromDatePlan =
  async (
    userId,
    datePlanId,
    memoryId
  ) => {
    const relationship =
      await getActiveRelationship(
        userId
      );

    // =================================================
    // VALIDATE MEMORY ID
    // =================================================

    if (!memoryId) {
      throw new NotFoundError(
        "Memory ID is required."
      );
    }

    // =================================================
    // FIND DATE PLAN
    // =================================================

    const datePlan =
      await datePlannerRepository.findById(
        datePlanId
      );

    if (!datePlan) {
      throw new NotFoundError(
        "Date plan not found."
      );
    }

    // =================================================
    // CHECK DATE PLAN RELATIONSHIP
    // =================================================

    if (
      !datePlan.relationship.equals(
        relationship._id
      )
    ) {
      throw new ForbiddenError(
        "You are not authorized to update this date plan."
      );
    }

    // =================================================
    // FIND MEMORY
    // =================================================

    const memory =
      await Memory.findOne({
        _id: memoryId,
        isDeleted: false,
      });

    if (!memory) {
      throw new NotFoundError(
        "Memory not found."
      );
    }

    // =================================================
    // CHECK MEMORY RELATIONSHIP
    // =================================================

    if (
      !memory.relationship ||
      !memory.relationship.equals(
        relationship._id
      )
    ) {
      throw new ForbiddenError(
        "You are not authorized to unlink this memory."
      );
    }

    // =================================================
    // UNLINK MEMORY
    // =================================================

    return datePlannerRepository.unlinkMemory(
      datePlanId,
      memoryId
    );
  };

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createDatePlan,
  getDatePlans,
  getUpcomingDatePlans,
  getPastDatePlans,
  getDatePlan,
  updateDatePlan,
  updateDatePlanStatus,
  deleteDatePlan,
  linkMemoryToDatePlan,
  unlinkMemoryFromDatePlan,
};