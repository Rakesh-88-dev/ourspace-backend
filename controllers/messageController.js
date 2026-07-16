const Message = require("../models/Message");

const searchMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherId = req.params.userId;
    const q = req.query.q;

    if (!q) {
      return res.json([]);
    }

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: otherId,
        },
        {
          senderId: otherId,
          receiverId: myId,
        },
      ],
      text: {
        $regex: q,
        $options: "i",
      },
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Search failed",
    });
  }
};

module.exports = {
  searchMessages,
};