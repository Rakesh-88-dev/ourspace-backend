const express = require("express");

const router = express.Router();

const {
  chat,
  getConversations,
  getConversationById,
  renameConversationById,
  deleteConversationById,
} = require("../controllers/ai.controller");


const protect = require("../middleware/authMiddleware");

// AI Chat
router.post("/chat", protect, chat);

router.get("/conversations", protect, getConversations);

router.get(
  "/conversations/:conversationId",
  protect,
  getConversationById
);

router.patch(
  "/conversations/:conversationId",
  protect,
  renameConversationById
);

router.delete(
  "/conversations/:conversationId",
  protect,
  deleteConversationById
);

module.exports = router;