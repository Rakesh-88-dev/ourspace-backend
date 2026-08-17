const PermissionService = require("./permission.service");

const {
  AURA_PERMISSIONS,
} = require("./permission.constants");

const assertPermission = async ({
  userId,
  permission,
}) => {
  const allowed =
    await PermissionService.hasPermission({
      userId,
      permission,
    });

  if (!allowed) {
    const error = new Error(
      "Aura does not have permission to perform this action."
    );

    error.statusCode = 403;
    error.code = "AURA_PERMISSION_DENIED";

    throw error;
  }

  return true;
};

const assertAnyPermission = async ({
  userId,
  permissions,
}) => {
  for (const permission of permissions) {
    const allowed =
      await PermissionService.hasPermission({
        userId,
        permission,
      });

    if (allowed) {
      return true;
    }
  }

  const error = new Error(
    "Aura does not have the required permission."
  );

  error.statusCode = 403;
  error.code = "AURA_PERMISSION_DENIED";

  throw error;
};

module.exports = {
  assertPermission,
  assertAnyPermission,
  AURA_PERMISSIONS,
};