const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const Memory = require("../models/Memory"); ❌ not needed here

const protect = async (req, res, next) => {
  let token;

  try {
    // 🔐 Check Authorization header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔥 Handle both id / _id cases
      const userId = decoded.id || decoded._id;

      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user
      req.user = user;

      next();
    } else {
      return res.status(401).json({ message: "No token" });
    }
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({ message: "Token failed" });
  }
};

module.exports = protect;