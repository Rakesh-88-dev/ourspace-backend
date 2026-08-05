const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../../models/User");

async function createDemoUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({
      isDemo: true,
    });

    if (existingUser) {
      console.log("✅ Demo user already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Demo@123",
      10
    );

    const demoUser = await User.create({
      name: "OurSpace Demo",

      email: "demo@ourspace.com",

      password: hashedPassword,

      isDemo: true,

      onboardingCompleted: true,

      profession: "Software Engineer",

      bio: "Official demo account for OurSpace.",

      location: "Bengaluru, India",

      avatar:
        "https://ui-avatars.com/api/?name=OurSpace+Demo&background=7C3AED&color=fff&size=256",
    });

    console.log("✅ Demo user created.");
    console.log(demoUser.email);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createDemoUser();