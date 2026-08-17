const PermissionService = require("./permission.service");

/**
 * Get current Aura permissions.
 */
const getPermissions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const permissions =
      await PermissionService.getPermissions(userId);

    return res.status(200).json({
      success: true,
      data: {
        permissions: permissions.permissions,
        version: permissions.version,
        lastRevokedAt: permissions.lastRevokedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Replace the complete Aura permission set.
 */
const updatePermissions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { permissions } = req.body;

    const result =
      await PermissionService.updatePermissions({
        userId,
        permissions,
      });

    return res.status(200).json({
      success: true,
      message: "Aura permissions updated successfully.",
      data: {
        permissions: result.permissions,
        version: result.version,
        lastRevokedAt: result.lastRevokedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Grant a single Aura permission.
 */
const grantPermission = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { permission } = req.body;

    const result =
      await PermissionService.grantPermission({
        userId,
        permission,
      });

    return res.status(200).json({
      success: true,
      message: "Aura permission granted successfully.",
      data: {
        permissions: result.permissions,
        version: result.version,
        lastRevokedAt: result.lastRevokedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke a single Aura permission.
 */
const revokePermission = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { permission } = req.body;

    const result =
      await PermissionService.revokePermission({
        userId,
        permission,
      });

    return res.status(200).json({
      success: true,
      message: "Aura permission revoked successfully.",
      data: {
        permissions: result.permissions,
        version: result.version,
        lastRevokedAt: result.lastRevokedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPermissions,
  updatePermissions,
  grantPermission,
  revokePermission,
};