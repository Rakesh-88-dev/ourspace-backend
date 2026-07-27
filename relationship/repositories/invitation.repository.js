const Invitation = require("../models/Invitation");

class InvitationRepository {
  async create(data) {
    return Invitation.create(data);
  }

  async findById(id) {
    return Invitation.findById(id);
  }

  async findByToken(token) {
    return Invitation.findOne({
      invitationToken: token,
    });
  }

  async findPendingByEmail(receiverEmail) {
    return Invitation.findOne({
      receiverEmail,
      status: "pending",
    });
  }

  async findPendingBetweenUsers(sender, receiverEmail) {
    return Invitation.findOne({
      sender,
      receiverEmail,
      status: "pending",
    });
  }

  async update(id, data) {
    return Invitation.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
  }

  async delete(id) {
    return Invitation.findByIdAndDelete(id);
  
}

async findIncomingPendingInvitations(userId) {
  return Invitation.find({
    receiver: userId,
    status: "pending",
  })
    .populate("sender", "name email avatar")
    .sort({ createdAt: -1 });
}

async findOutgoingPendingInvitations(userId) {
  return Invitation.find({
    sender: userId,
    status: "pending",
  })
    .populate("receiver", "name email avatar")
    .sort({ createdAt: -1 });
}


async markAccepted(invitationId, session) {
  return Invitation.findByIdAndUpdate(
    invitationId,
    {
      status: "accepted",
      acceptedAt: new Date(),
      respondedAt: new Date(),
    },
    {
      new: true,
      session,
    }
  );
}

async markRejected(invitationId) {
  return Invitation.findByIdAndUpdate(
    invitationId,
    {
      status: "rejected",
      rejectedAt: new Date(),
      respondedAt: new Date(),
    },
    {
      new: true,
    }
  );
}

async markCancelled(invitationId) {
  return Invitation.findByIdAndUpdate(
    invitationId,
    {
      status: "cancelled",
      cancelledAt: new Date(),
      respondedAt: new Date(),
    },
    {
      new: true,
    }
  );
}

async findPendingSentInvitation(userId) {
  return Invitation.findOne({
    sender: userId,
    status: "pending",
  }).populate(
    "receiver",
    "name email avatar"
  );
}

async findPendingReceivedInvitation(userId) {
  return Invitation.findOne({
    receiver: userId,
    status: "pending",
  }).populate(
    "sender",
    "name email avatar"
  );
}

}



module.exports = new InvitationRepository();