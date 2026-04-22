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

const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/special-dates", specialDateRoutes);
app.use("/uploads", express.static("uploads"));

// DB
connectDB();

// Test
app.get("/", (req, res) => {
  res.send("API running...");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ SOCKET SETUP
const Message = require("./models/Message");

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  // 🔥 SEND MESSAGE
  socket.on("send_message", async (data) => {
    const { senderId, receiverId, text } = data;

    const msg = await Message.create({
      senderId,
      receiverId,
      text,
      status: "sent", // ✅ ADD THIS (important)
    });

    // 👉 when message reaches receiver → mark delivered
    msg.status = "delivered";
    await msg.save();

    io.to(receiverId).emit("receive_message", msg);
    io.to(senderId).emit("receive_message", msg);
  });

  // 🔥 ADD THIS BLOCK HERE (👇 BELOW send_message)
  socket.on("mark_seen", async ({ senderId, receiverId }) => {
    await Message.updateMany(
      { senderId, receiverId, status: { $ne: "seen" } },
      { status: "seen" }
    );

    // notify sender that messages are seen
    io.to(senderId).emit("messages_seen");
  });

});
// ✅ IMPORTANT: use server.listen NOT app.listen
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});