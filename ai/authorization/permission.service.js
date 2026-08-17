const PermissionRepository = require("./permission.repository");

const {
  AURA_PERMISSIONS,
  DEFAULT_AURA_PERMISSIONS,
} = require("./permission.constants");

// All permissions officially supported by Aura.
const VALID_PERMISSIONS = new Set(
  Object.values(AURA_PERMISSIONS)
);

/**
 * Get the user's Aura permissions.
 *
 * If the user does not have a permission document yet,
 * create one using the system defaults.
 */
const getPermissions = async (userId) => {
  return PermissionRepository.ensureForUser(
    userId,
    DEFAULT_AURA_PERMISSIONS
  );
};

/**
 * Check whether Aura has a specific permission.
 */
const hasPermission = async ({
  userId,
  permission,
}) => {
  const permissionDocument =
    await getPermissions(userId);

  return permissionDocument.permissions.includes(
    permission
  );
};

/**
 * Validate that every requested permission
 * belongs to the official Aura permission registry.
 */
const validatePermissions = (permissions) => {
  const invalidPermissions =
    permissions.filter(
      (permission) =>
        !VALID_PERMISSIONS.has(permission)
    );

  if (invalidPermissions.length > 0) {
    const error = new Error(
      `Invalid Aura permission(s): ${invalidPermissions.join(
        ", "
      )}`
    );

    error.statusCode = 400;
    error.code = "INVALID_AURA_PERMISSION";

    throw error;
  }
};

/**
 * Replace the user's complete Aura permission set.
 */
const updatePermissions = async ({
  userId,
  permissions,
}) => {
  if (!Array.isArray(permissions)) {
    const error = new Error(
      "Permissions must be provided as an array."
    );

    error.statusCode = 400;
    error.code = "INVALID_AURA_PERMISSIONS";

    throw error;
  }

  // IMPORTANT:
  // Validation happens INSIDE this function,
  // where `permissions` actually exists.
  validatePermissions(permissions);

  const current =
    await getPermissions(userId);

  const currentPermissions =
    new Set(current.permissions);

  const requestedPermissions =
    new Set(permissions);

  const permissionsChanged =
    currentPermissions.size !==
      requestedPermissions.size ||
    [...currentPermissions].some(
      (permission) =>
        !requestedPermissions.has(permission)
    );

  if (!permissionsChanged) {
    return current;
  }

  const revoked =
    [...currentPermissions].some(
      (permission) =>
        !requestedPermissions.has(permission)
    );

  return PermissionRepository.updateByUserId(
    userId,
    {
      permissions: [
        ...requestedPermissions,
      ],

      version: current.version + 1,

      ...(revoked
        ? {
            lastRevokedAt: new Date(),
          }
        : {}),
    }
  );
};

/**
 * Revoke one Aura permission.
 */
const revokePermission = async ({
  userId,
  permission,
}) => {
  // Make sure the permission itself is valid.
  validatePermissions([permission]);

  const current =
    await getPermissions(userId);

  if (!current.permissions.includes(permission)) {
    return current;
  }

  const nextPermissions =
    current.permissions.filter(
      (item) => item !== permission
    );

  return PermissionRepository.updateByUserId(
    userId,
    {
      permissions: nextPermissions,
      version: current.version + 1,
      lastRevokedAt: new Date(),
    }
  );
};

/**
 * Grant one Aura permission.
 */
const grantPermission = async ({
  userId,
  permission,
}) => {
  // Make sure the permission itself is valid.
  validatePermissions([permission]);

  const current =
    await getPermissions(userId);

  if (current.permissions.includes(permission)) {
    return current;
  }

  return PermissionRepository.updateByUserId(
    userId,
    {
      permissions: [
        ...current.permissions,
        permission,
      ],
      version: current.version + 1,
    }
  );
};

module.exports = {
  getPermissions,
  hasPermission,
  updatePermissions,
  grantPermission,
  revokePermission,
};