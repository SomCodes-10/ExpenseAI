import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) throw new Error("Missing env var: GEMINI_API_KEY");
if (!process.env.GEMINI_MODEL)   throw new Error("Missing env var: GEMINI_MODEL");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Compatibility wrapper around the new @google/genai SDK.
 *
 * The controller calls:
 *   const result = await model.generateContent([systemPrompt, userPrompt]);
 *   const text   = result.response.text();
 *
 * The new SDK returns `response.text` as a plain string (not a function).
 * This wrapper adapts the new SDK's response to match the old interface so
 * no controller code needs to change.
 */
const model = {
  async generateContent(contents) {
    // Normalise: if an array of strings is passed, join them into one prompt
    const prompt = Array.isArray(contents)
      ? contents.join("\n\n")
      : contents;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: prompt,
    });

    // Wrap in the shape the controller expects: result.response.text()
    return {
      response: {
        text: () => response.text,
      },
    };
  },
};

export default model;