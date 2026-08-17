const express = require("express");

const protect = require("../../middleware/authMiddleware");

const {
  getPermissions,
  updatePermissions,
  grantPermission,
  revokePermission,
} = require("./permission.controller");

const router = express.Router();

// Get current Aura permissions
router.get(
  "/",
  protect,
  getPermissions
);

// Replace complete permission set
router.put(
  "/",
  protect,
  updatePermissions
);

// Grant one permission
router.post(
  "/grant",
  protect,
  grantPermission
);

// Revoke one permission
router.post(
  "/revoke",
  protect,
  revokePermission
);

module.exports = router;