const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const envFile = fs.readFileSync(path.join(__dirname, ".env.local"), "utf-8");
const apiKey = envFile.match(/GEMINI_API_KEY=(.*)/)[1].trim();

const genAI = new GoogleGenerativeAI(apiKey);

async function list() {
  try {
    // There is no listModels in the main SDK usually, but we can try common ones
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("test");
        console.log(`Model ${m} works!`);
      } catch (e) {
        console.log(`Model ${m} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("List Failed:", error);
  }
}

list();
