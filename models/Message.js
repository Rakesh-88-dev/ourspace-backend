const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String,

status: {
  type: String,
  enum: ["sent", "delivered", "seen"],
  default: "sent",
},

edited: {
  type: Boolean,
  default: false,
},

deleted: {
  type: Boolean,
  default: false,
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);