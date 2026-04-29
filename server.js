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

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  /* SEND MESSAGE */
  socket.on("send_message", async (data) => {
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
  });

  /* MARK SEEN */
  socket.on("mark_seen", async ({ senderId, receiverId }) => {
    await Message.updateMany(
      { senderId, receiverId, status: { $ne: "seen" } },
      { status: "seen" }
    );

    io.to(senderId).emit("messages_seen");
  });
});

/* Server */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});