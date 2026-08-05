const User = require("../../models/User");
const jwt = require("jsonwebtoken");

class DemoService {
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );
  }

  async createDemoSession() {
    const demoUser = await User.findOne({
      isDemo: true,
    }).select("-password");

    if (!demoUser) {
      throw new Error("Demo account not found.");
    }

    demoUser.lastSeen = new Date();
    await demoUser.save();

    return {
      success: true,
      token: this.generateToken(demoUser._id),
      user: demoUser,
    };
  }
}

module.exports = new DemoService();