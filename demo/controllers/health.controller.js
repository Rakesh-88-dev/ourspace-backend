class HealthController {
  async getHealth(req, res) {
    return res.status(200).json({
      success: true,

      app: "OurSpace",

      environment:
        process.env.NODE_ENV || "development",

      version: "1.0.0",

      status: "online",

      demoAvailable: true,

      timestamp: new Date(),
    });
  }
}

module.exports = new HealthController();