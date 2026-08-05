const express = require("express");

const relationshipController = require("../controllers/relationship.controller");
const authMiddleware = require("../../middleware/authMiddleware");

// ✅ Demo Guard
const demoGuard = require("../../demo/middleware/demoGuard");

const {
  inviteValidation,
  invitationIdValidation,
} = require("../validators/relationship.validator");

const validateRequest = require("../../middleware/validateRequest");

const router = express.Router();

// ==========================================
// Send Invitation
// ==========================================

router.post(
  "/invite",
  authMiddleware,
  demoGuard,
  inviteValidation,
  validateRequest,
  relationshipController.sendInvitation
);

// ==========================================
// Pending Invitations
// ==========================================

router.get(
  "/pending",
  authMiddleware,
  relationshipController.getPendingInvitations
);

// ==========================================
// Accept Invitation
// ==========================================

router.post(
  "/accept/:invitationId",
  authMiddleware,
  demoGuard,
  invitationIdValidation,
  validateRequest,
  relationshipController.acceptInvitation
);

// ==========================================
// Reject Invitation
// ==========================================

router.post(
  "/reject/:invitationId",
  authMiddleware,
  demoGuard,
  invitationIdValidation,
  validateRequest,
  relationshipController.rejectInvitation
);

// ==========================================
// Cancel Invitation
// ==========================================

router.post(
  "/cancel/:invitationId",
  authMiddleware,
  demoGuard,
  invitationIdValidation,
  validateRequest,
  relationshipController.cancelInvitation
);

// ==========================================
// Relationship Status
// ==========================================

router.get(
  "/status",
  authMiddleware,
  relationshipController.getRelationshipStatus
);

// ==========================================
// Relationship Profile
// ==========================================

router.get(
  "/profile",
  authMiddleware,
  relationshipController.getRelationshipProfile
);

// ==========================================
// Disconnect Relationship
// ==========================================

router.delete(
  "/disconnect",
  authMiddleware,
  demoGuard,
  relationshipController.disconnectRelationship
);

module.exports = router;