const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const spaceController = require("../controllers/space.controller");

router.get("/current", protect, spaceController.getCurrentSpace);

module.exports = router;