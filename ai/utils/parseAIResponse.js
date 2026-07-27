/**
 * Normalize and parse raw AI output.
 */
const parseAIResponse = (text = "") => {
  if (typeof text !== "string") {
    throw new Error("AI returned invalid response.");
  }

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI JSON:");
    console.error(cleaned);
    throw new Error("AI returned invalid JSON.");
  }
};

module.exports = parseAIResponse;