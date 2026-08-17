const {
  TOOL_TYPES,
} = require("./tool.types");

const {
  AURA_PERMISSIONS,
} = require("../authorization/permission.constants");

const {
  assertPermission,
} = require("../authorization/permission.policy");

/**
 * =====================================================
 * TOOL AUTHORIZATION POLICIES
 * =====================================================
 *
 * Every executable Aura tool must have a policy.
 *
 * Tool name
 *     ↓
 * Required Aura capability
 *
 * The policy layer does NOT execute tools.
 * It only decides whether execution is allowed.
 */

const TOOL_POLICIES = Object.freeze({

  // ===================================================
  // Aura Long-Term Memory
  // ===================================================

  [TOOL_TYPES.CREATE_MEMORY]: {
    permission:
      AURA_PERMISSIONS.AI_MEMORY_CREATE,
  },

  [TOOL_TYPES.UPDATE_MEMORY]: {
    permission:
      AURA_PERMISSIONS.AI_MEMORY_UPDATE,
  },

  [TOOL_TYPES.DELETE_MEMORY]: {
    permission:
      AURA_PERMISSIONS.AI_MEMORY_DELETE,
  },

  [TOOL_TYPES.SEARCH_MEMORY]: {
    permission:
      AURA_PERMISSIONS.AI_MEMORY_READ,
  },


  // ===================================================
  // Wishlist
  // ===================================================

  [TOOL_TYPES.CREATE_WISHLIST_ITEM]: {
    permission:
      AURA_PERMISSIONS.WISHLIST_CREATE,
  },

  [TOOL_TYPES.GET_WISHLIST]: {
    permission:
      AURA_PERMISSIONS.WISHLIST_READ,
  },

  [TOOL_TYPES.UPDATE_WISHLIST_ITEM]: {
    permission:
      AURA_PERMISSIONS.WISHLIST_UPDATE,
  },

  [TOOL_TYPES.DELETE_WISHLIST_ITEM]: {
    permission:
      AURA_PERMISSIONS.WISHLIST_DELETE,
  },


  // ===================================================
  // Special Dates
  // ===================================================

  [TOOL_TYPES.CREATE_SPECIAL_DATE]: {
    permission:
      AURA_PERMISSIONS.SPECIAL_DATE_CREATE,
  },

  [TOOL_TYPES.GET_SPECIAL_DATES]: {
    permission:
      AURA_PERMISSIONS.SPECIAL_DATE_READ,
  },

  [TOOL_TYPES.UPDATE_SPECIAL_DATE]: {
    permission:
      AURA_PERMISSIONS.SPECIAL_DATE_UPDATE,
  },

  [TOOL_TYPES.DELETE_SPECIAL_DATE]: {
    permission:
      AURA_PERMISSIONS.SPECIAL_DATE_DELETE,
  },


  // ===================================================
  // Profile
  // ===================================================

  [TOOL_TYPES.GET_PROFILE]: {
    permission:
      AURA_PERMISSIONS.PROFILE_READ,
  },

  [TOOL_TYPES.UPDATE_PROFILE]: {
    permission:
      AURA_PERMISSIONS.PROFILE_UPDATE,
  },

});


/**
 * Get the policy associated with a tool.
 */
const getToolPolicy = (tool) => {
  return TOOL_POLICIES[tool] || null;
};


/**
 * Authorize a tool execution.
 */
const authorizeTool = async ({
  tool,
  context,
}) => {

  const policy = getToolPolicy(tool);

  // ---------------------------------------------------
  // No policy = fail closed
  // ---------------------------------------------------

  if (!policy) {
    const error = new Error(
      `No authorization policy defined for tool: ${tool}`
    );

    error.statusCode = 403;
    error.code = "TOOL_POLICY_MISSING";

    throw error;
  }

  // ---------------------------------------------------
  // Resolve authenticated user
  // ---------------------------------------------------

  const userId =
    context?.actor?.userId ||
    context?.userId;

  if (!userId) {
    const error = new Error(
      "Authenticated user is required for tool authorization."
    );

    error.statusCode = 401;
    error.code = "TOOL_USER_REQUIRED";

    throw error;
  }

  // ---------------------------------------------------
  // Capability check
  // ---------------------------------------------------

  await assertPermission({
    userId,
    permission: policy.permission,
  });

  // ---------------------------------------------------
  // Authorization successful
  // ---------------------------------------------------

  return {
    allowed: true,
    permission: policy.permission,
  };
};


module.exports = {
  TOOL_POLICIES,
  getToolPolicy,
  authorizeTool,
};