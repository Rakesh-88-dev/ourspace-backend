const express = require("express");

const relationshipController = require("../controllers/relationship.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const {
  inviteValidation,
  invitationIdValidation,
} = require("../validators/relationship.validator");

const validateRequest = require("../../middleware/validateRequest");

const router = express.Router();

router.post(
  "/invite",
  authMiddleware,
  inviteValidation,
  validateRequest,
  relationshipController.sendInvitation
);

router.get(
  "/pending",
  authMiddleware,
  relationshipController.getPendingInvitations
);

router.post(
  "/accept/:invitationId",
  authMiddleware,
  invitationIdValidation,
  validateRequest,
  relationshipController.acceptInvitation
);

router.post(
  "/reject/:invitationId",
  authMiddleware,
  invitationIdValidation,
  validateRequest,
  relationshipController.rejectInvitation
);

router.post(
  "/cancel/:invitationId",
  authMiddleware,
  invitationIdValidation,
  validateRequest,
  relationshipController.cancelInvitation
);

router.get(
  "/status",
  authMiddleware,
  relationshipController.getRelationshipStatus
);

router.get(
  "/profile",
  authMiddleware,
  relationshipController.getRelationshipProfile
);

router.delete(
  "/disconnect",
  authMiddleware,
  relationshipController.disconnectRelationship
);

module.exports = router;