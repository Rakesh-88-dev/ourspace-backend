const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {

    likes: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "User",
  default: [],
},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Memory", memorySchema);