const crypto = require("crypto");
const mongoose = require("mongoose");

const invitationRepository = require("../repositories/invitation.repository");
const relationshipRepository = require("../repositories/relationship.repository");
const userRepository = require("../repositories/user.repository");
const memoryRepository = require("../../memory/repositories/memory.repository");
const wishlistRepository = require("../../wishlist/repositories/wishlist.repository");
const Message = require("../../models/Message");
const SpecialDate = require("../../models/SpecialDate");

const ForbiddenError = require("../../errors/ForbiddenError");
const ConflictError = require("../../errors/ConflictError");
const NotFoundError = require("../../errors/NotFoundError");

class RelationshipService {
  generateInvitationToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  getExpirationDate(days = 7) {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + days);
    return expiration;
  }

  generateRelationshipKey(userOne, userTwo) {
    return [userOne.toString(), userTwo.toString()]
      .sort()
      .join(":");
  }

async sendInvitation(senderId, data) {
  const { receiverEmail, message } = data;

  // Find sender
  const sender = await userRepository.findById(senderId);

  if (!sender) {
    throw new NotFoundError("Sender not found.");
  }

  // Prevent self invitation
  if (
    sender.email.toLowerCase() ===
    receiverEmail.toLowerCase()
  ) {
    throw new ConflictError(
      "You cannot invite yourself."
    );
  }

  // Find receiver
  const receiver =
    await userRepository.findByEmail(
      receiverEmail.toLowerCase()
    );

  if (!receiver) {
    throw new NotFoundError(
      "No user found with this email."
    );
  }

  // Check sender relationship
  const senderRelationship =
    await relationshipRepository.findByMember(
      senderId
    );

  if (senderRelationship) {
    throw new ConflictError(
      "You are already connected with a partner."
    );
  }

  // Check receiver relationship
  const receiverRelationship =
    await relationshipRepository.findByMember(
      receiver._id
    );

  if (receiverRelationship) {
    throw new ConflictError(
      "This user is already connected with a partner."
    );
  }

  // Check duplicate invitation
  const existingInvitation =
    await invitationRepository.findPendingBetweenUsers(
      senderId,
      receiver.email.toLowerCase()
    );

  if (existingInvitation) {
    throw new ConflictError(
      "A pending invitation already exists."
    );
  }

  // Create invitation
  const invitation =
    await invitationRepository.create({
      sender: senderId,
      receiver: receiver._id,
      receiverEmail: receiver.email.toLowerCase(),
      message: message || "",
      invitationToken: this.generateInvitationToken(),
      expiresAt: this.getExpirationDate(),
    });

  return invitation;
}
async getPendingInvitations(userId) {
  const incoming =
    await invitationRepository.findIncomingPendingInvitations(userId);

  const outgoing =
    await invitationRepository.findOutgoingPendingInvitations(userId);

  return {
    incoming,
    outgoing,
  };
}



async acceptInvitation(
  invitationId,
  userId,
  anniversaryDate
) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

  const invitation =
    await invitationRepository.findById(invitationId);

  if (!invitation) {
    throw new NotFoundError("Invitation not found.");
  }

  if (invitation.status !== "pending") {
    throw new ConflictError(
      "Invitation has already been processed."
    );
  }

  if (invitation.receiver?.toString() !== userId.toString()) {
    throw new ForbiddenError(
      "You cannot accept this invitation."
    );
  }

  if (new Date() > invitation.expiresAt) {
    throw new ConflictError(
      "Invitation has expired."
    );
  }

  if (!anniversaryDate) {
  throw new ConflictError(
    "Anniversary date is required."
  );
}

const anniversary = new Date(anniversaryDate);

if (isNaN(anniversary.getTime())) {
  throw new ConflictError(
    "Invalid anniversary date."
  );
}

if (anniversary > new Date()) {
  throw new ConflictError(
    "Anniversary cannot be in the future."
  );
}

  const senderRelationship =
    await relationshipRepository.findByMember(
      invitation.sender
    );

  if (senderRelationship) {
    throw new ConflictError(
      "Sender is already in a relationship."
    );
  }

  const receiverRelationship =
    await relationshipRepository.findByMember(
      invitation.receiver
    );

  if (receiverRelationship) {
    throw new ConflictError(
      "Receiver is already in a relationship."
    );
  }

  
  const relationship =
  await relationshipRepository.createRelationship(
    {
      members: [
        invitation.sender,
        invitation.receiver,
      ],
      relationshipKey:
        this.generateRelationshipKey(
          invitation.sender.toString(),
          invitation.receiver.toString()
        ),
      invitedBy: invitation.sender,

      anniversaryDate: anniversary,

      connectedAt: new Date(),
    },
    session
  );

  await invitationRepository.markAccepted(
  invitationId,
  session
);

await session.commitTransaction();

return relationship;
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
}

async rejectInvitation(invitationId, userId) {
  // Find invitation
  const invitation =
    await invitationRepository.findById(invitationId);

  if (!invitation) {
    throw new NotFoundError("Invitation not found.");
  }

  // Check status
  if (invitation.status !== "pending") {
    throw new ConflictError(
      "Invitation has already been processed."
    );
  }

  // Verify receiver
  if (invitation.receiver.toString() !== userId.toString()) {
    throw new ForbiddenError(
      "You cannot reject this invitation."
    );
  }

  // Check expiry
  if (new Date() > invitation.expiresAt) {
    throw new ConflictError(
      "Invitation has expired."
    );
  }

  // Mark rejected
  const rejectedInvitation =
    await invitationRepository.markRejected(
      invitationId
    );

  return rejectedInvitation;
}

async cancelInvitation(invitationId, userId) {
  // Find invitation
  const invitation =
    await invitationRepository.findById(invitationId);

  if (!invitation) {
    throw new NotFoundError("Invitation not found.");
  }

  // Check status
  if (invitation.status !== "pending") {
    throw new ConflictError(
      "Invitation has already been processed."
    );
  }

  // Verify sender
  if (invitation.sender.toString() !== userId.toString()) {
    throw new ForbiddenError(
      "You cannot cancel this invitation."
    );
  }

  // Check expiry
  if (new Date() > invitation.expiresAt) {
    throw new ConflictError(
      "Invitation has expired."
    );
  }

  // Mark cancelled
  const cancelledInvitation =
    await invitationRepository.markCancelled(
      invitationId
    );

  return cancelledInvitation;
}

async getRelationshipStatus(userId) {
  // Check active relationship
  const relationship =
    await relationshipRepository.findByMember(userId);

  if (relationship) {
    const partner = relationship.members.find(
      (member) => member._id.toString() !== userId.toString()
    );

    return {
  status: "connected",
  relationship: {
    _id: relationship._id,
    relationshipKey: relationship.relationshipKey,
    anniversaryDate: relationship.anniversaryDate,
    connectedAt: relationship.connectedAt,
    partner,
  },
};
  }

  // Check pending invitation sent
  const sentInvitation =
    await invitationRepository.findPendingSentInvitation(userId);

  if (sentInvitation) {
    return {
      status: "pending_sent",
      invitation: sentInvitation,
    };
  }

  // Check pending invitation received
  const receivedInvitation =
    await invitationRepository.findPendingReceivedInvitation(userId);

  if (receivedInvitation) {
    return {
      status: "pending_received",
      invitation: receivedInvitation,
    };
  }

  // No relationship
  return {
    status: "not_connected",
  };
}

async getRelationshipProfile(userId) {
  // Find active relationship
  const relationship =
    await relationshipRepository.findByMember(userId);

  if (!relationship) {
    throw new NotFoundError(
      "No active relationship found."
    );
  }

  // Find partner
  const partner = relationship.members.find(
    (member) => member._id.toString() !== userId.toString()
  );

  return {
  relationship: {
    _id: relationship._id,
    relationshipKey: relationship.relationshipKey,
    anniversaryDate: relationship.anniversaryDate,
    connectedAt: relationship.connectedAt,
    partner,
  },
};
}

async getAchievements(userId) {
  const relationship =
    await relationshipRepository.findByMember(
      userId
    );

  if (!relationship) {
    throw new NotFoundError(
      "No active relationship found."
    );
  }

  const memories =
    await memoryRepository.countSharedMemories(
      relationship._id
    );

  const wishlist =
    await wishlistRepository.countSharedWishlist(
      relationship._id
    );

  const completedWishlist =
    await wishlistRepository.countCompletedSharedWishlist(
      relationship._id
    );

  // Messages
  const [userOne, userTwo] = relationship.members;

  const messages = await Message.countDocuments({
    $or: [
      {
        senderId: userOne,
        receiverId: userTwo,
      },
      {
        senderId: userTwo,
        receiverId: userOne,
      },
    ],
    deleted: false,
  });

  // Special Dates
  const dates = await SpecialDate.countDocuments({
    relationship: relationship._id,
  });

  const daysTogether = Math.floor(
    (Date.now() -
      new Date(
        relationship.anniversaryDate
      )) /
      (1000 * 60 * 60 * 24)
  );

  const achievements = [
    {
      id: 1,
      title: "Connected ❤️",
      unlocked: true,
    },
    {
      id: 2,
      title: "First Memory",
      unlocked: memories >= 1,
    },
    {
      id: 3,
      title: "Memory Collector",
      unlocked: memories >= 10,
    },
    {
      id: 4,
      title: "100 Days Together",
      unlocked: daysTogether >= 100,
    },
    {
      id: 5,
      title: "One Year Together",
      unlocked: daysTogether >= 365,
    },
    {
      id: 6,
      title: "First Conversation",
      unlocked: messages >= 1,
    },
    {
      id: 7,
      title: "Talkative Couple",
      unlocked: messages >= 1000,
    },
    {
      id: 8,
      title: "First Dream",
      unlocked: wishlist >= 1,
    },
    {
      id: 9,
      title: "Dream Chaser",
      unlocked: completedWishlist >= 5,
    },
    {
      id: 10,
      title: "Celebration Master",
      unlocked: dates >= 5,
    },
  ];

  return {
    stats: {
      daysTogether,
      memories,
      messages,
      wishlist,
      completedWishlist,
      dates,
    },
    achievements,
  };
}

async disconnectRelationship(userId) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find active relationship
    const relationship =
      await relationshipRepository.findByMember(userId);

    if (!relationship) {
      throw new NotFoundError(
        "No active relationship found."
      );
    }

    // Mark relationship as disconnected
    await relationshipRepository.disconnectRelationship(
      relationship._id,
      userId,
      session
    );

    // Return shared memories to their owners
    await memoryRepository.returnSharedMemoriesToOwners(
      relationship._id,
      session
    );

    // Return shared wishlist items (future)
    await wishlistRepository.returnSharedWishlistToOwners(
      relationship._id,
      session
    );

    await session.commitTransaction();

    return {
      message: "Relationship disconnected successfully."
    };

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
}

module.exports = new RelationshipService();