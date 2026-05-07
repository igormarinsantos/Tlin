const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// Load .env.local manually for the script
const envFile = fs.readFileSync(path.join(__dirname, ".env.local"), "utf-8");
const apiKey = envFile.match(/GEMINI_API_KEY=(.*)/)[1].trim();

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Oi, quem é você?");
    const response = await result.response;
    console.log("Gemini Response:", response.text());
  } catch (error) {
    console.error("Gemini Test Failed:", error);
  }
}

test();
