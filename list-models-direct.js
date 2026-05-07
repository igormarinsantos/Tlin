const fs = require("fs");
const path = require("path");

const envFile = fs.readFileSync(path.join(__dirname, ".env.local"), "utf-8");
const apiKey = envFile.match(/GEMINI_API_KEY=(.*)/)[1].trim();

async function list() {
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Models:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("List Failed:", error);
  }
}

list();
