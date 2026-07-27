const ai = require("../providers/gemini.provider");
const formatConversation = require("../utils/formatConversation");
const parseAIResponse = require("../utils/parseAIResponse");

const generateWithGemini = async ({
  messages,
  model,
  systemInstruction,
}) => {
  const conversation = formatConversation(messages, {
    assistantPrefix: !systemInstruction,
  });

  const prompt = systemInstruction
    ? `${systemInstruction}\n\n${conversation}`
    : conversation;

  // Debug Logs
  console.log("\n========== SYSTEM PROMPT ==========");
  console.log(systemInstruction);
  console.log("===================================\n");

  console.log("\n========== FINAL PROMPT ==========");
  console.log(prompt);
  console.log("==================================\n");

  try {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  console.log("========== GEMINI RAW RESPONSE ==========");
  console.dir(response, { depth: null });
  console.log("=========================================");

  console.log("========== GEMINI TEXT ==========");
  console.log(response.text);
  console.log("=================================");

  return parseAIResponse(response.text);
} catch (error) {
  console.error("========== GEMINI ERROR ==========");
  console.error(error);
  console.error("==================================");

  throw error;
}
};

module.exports = {
  generateWithGemini,
};