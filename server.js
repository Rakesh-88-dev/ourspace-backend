require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const memoryRoutes = require("./routes/memoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const specialDateRoutes = require("./routes/specialDateRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const statsRoutes = require("./routes/statsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const User = require("./models/User");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* ✅ FIXED CORS (ONLY ONE TIME) */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

/* Middleware */
app.use(express.json());

/* Routes */
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/special-dates", specialDateRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ai", aiRoutes);


/* Static */
app.use("/uploads", express.static("uploads"));

/* DB */
connectDB();

/* Test route */
app.get("/", (req, res) => {
  res.send("API running...");
});

/* Socket Setup */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const Message = require("./models/Message");
// Store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

 socket.on("join", (userId) => {
  socket.join(userId);

  // Store socket against user
  onlineUsers.set(userId, socket.id);

  // Send updated online users to everyone
  io.emit("online_users", Array.from(onlineUsers.keys()));
});
  /* ===========================
     TYPING INDICATOR
  =========================== */

  socket.on("typing", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("typing", {
      senderId,
    });
  });

  socket.on("stop_typing", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("stop_typing", {
      senderId,
    });
  });

  /* ===========================
     SEND MESSAGE
  =========================== */

  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, text } = data;

      const msg = await Message.create({
        senderId,
        receiverId,
        text,
        status: "sent",
      });

      msg.status = "delivered";
      await msg.save();

      io.to(receiverId).emit("receive_message", msg);
      io.to(senderId).emit("receive_message", msg);

    } catch (err) {
      console.error("Socket Message Error:", err);
    }
  });

  /* ===========================
   DELETE MESSAGE
=========================== */

socket.on("delete_message", async ({ messageId }) => {
  console.log("DELETE EVENT RECEIVED:", messageId);

  try {
    const message = await Message.findById(messageId);

    console.log("MESSAGE FOUND:", message);

    if (!message) return;

    message.deleted = true;
    await message.save();

    console.log("MESSAGE UPDATED");

    io.to(message.senderId.toString()).emit("message_deleted", {
      messageId,
    });

    io.to(message.receiverId.toString()).emit("message_deleted", {
      messageId,
    });

    console.log("EVENT EMITTED");

  } catch (err) {
    console.error("Delete Message Error:", err);
  }
});

/* ===========================
   EDIT MESSAGE
=========================== */

socket.on("edit_message", async ({ messageId, text }) => {
  try {
    const message = await Message.findById(messageId);

    if (!message) return;

    message.text = text;
    message.edited = true;

    await message.save();

    io.to(message.senderId.toString()).emit(
      "message_edited",
      message
    );

    io.to(message.receiverId.toString()).emit(
      "message_edited",
      message
    );

  } catch (err) {
    console.error("Edit Message Error:", err);
  }
});

  /* ===========================
     MARK AS SEEN
  =========================== */

  socket.on("mark_seen", async ({ senderId, receiverId }) => {
    try {
      await Message.updateMany(
        {
          senderId,
          receiverId,
          status: { $ne: "seen" },
        },
        {
          status: "seen",
        }
      );

      io.to(senderId).emit("messages_seen");

    } catch (err) {
      console.error(err);
    }
  });

 socket.on("disconnect", async () => {
  console.log("User disconnected:", socket.id);

  for (const [userId, socketId] of onlineUsers.entries()) {
    if (socketId === socket.id) {

      // Save last seen time
      await User.findByIdAndUpdate(userId, {
        lastSeen: new Date(),
      });

      onlineUsers.delete(userId);
      break;
    }
  }

  io.emit("online_users", Array.from(onlineUsers.keys()));
});
});

/* Server */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});