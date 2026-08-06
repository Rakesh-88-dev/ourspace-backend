const relationshipService = require("../services/relationship.service");

class RelationshipController {
  async sendInvitation(req, res, next) {
    try {
      const senderId = req.user._id;

      const invitation =
        await relationshipService.sendInvitation(
          senderId,
          req.body
        );

      return res.status(201).json({
        success: true,
        message: "Invitation sent successfully.",
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  }
  async getPendingInvitations(req, res, next) {
  try {
    const invitations =
      await relationshipService.getPendingInvitations(
        req.user._id
      );

    return res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    next(error);
  }
}

async acceptInvitation(req, res, next) {
  try {
    const { anniversaryDate } = req.body;

    const relationship =
      await relationshipService.acceptInvitation(
        req.params.invitationId,
        req.user._id,
        anniversaryDate
      );

    return res.status(200).json({
      success: true,
      message: "Invitation accepted successfully.",
      data: relationship,
    });
  } catch (error) {
    next(error);
  }
}

rejectInvitation = async (req, res, next) => {
  try {
    const relationship =
      await relationshipService.rejectInvitation(
        req.params.invitationId,
        req.user._id
      );

    res.status(200).json({
      success: true,
      message: "Invitation rejected successfully.",
      data: relationship,
    });
  } catch (error) {
    next(error);
  }
};

cancelInvitation = async (req, res, next) => {
  try {
    const invitation =
      await relationshipService.cancelInvitation(
        req.params.invitationId,
        req.user._id
      );

    res.status(200).json({
      success: true,
      message: "Invitation cancelled successfully.",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

getRelationshipStatus = async (req, res, next) => {
  try {
    const status =
      await relationshipService.getRelationshipStatus(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

getRelationshipProfile = async (req, res, next) => {
  try {
    const profile =
      await relationshipService.getRelationshipProfile(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }

};

getAchievements = async (req, res, next) => {
  try {
    const achievements =
      await relationshipService.getAchievements(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

disconnectRelationship = async (req, res, next) => {
  try {
    const result =
      await relationshipService.disconnectRelationship(
        req.user._id
      );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

}

module.exports = new RelationshipController();