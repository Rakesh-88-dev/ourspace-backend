const express = require("express");
const router = express.Router();

const ai = require("../config/gemini");


// ✨ AI Caption Generator
router.post("/caption", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log(req.body);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a short emotional memory caption for: ${prompt}`,
    });

    res.json({
      caption: response.text,
    });

  } catch (err) {
    console.log("FULL ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ❤️ AI Reflection Generator
router.post("/reflection", async (req, res) => {
  try {
    const { captions } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
Analyze these memories and generate
an emotional reflection:

${captions.join("\n")}
`,
    });

    res.json({
      reflection: response.text,
    });

  } catch (err) {
    console.log("FULL ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;