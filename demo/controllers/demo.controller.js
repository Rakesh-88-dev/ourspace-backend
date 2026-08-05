const demoService = require("../services/demo.service");

class DemoController {
  async createSession(req, res) {
    try {
      const session = await demoService.createDemoSession();

      return res.status(200).json(session);
    } catch (error) {
      console.error("Demo Session Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getInfo(req, res) {
    try {
      return res.status(200).json({
        success: true,
        app: "OurSpace",
        version: "1.0.0",
        demo: true,
        features: [
          "Dashboard",
          "Memories",
          "Wishlist",
          "Special Dates",
          "Timeline",
          "Chat",
          "Aura AI",
          "Relationship Space",
        ],
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new DemoController();