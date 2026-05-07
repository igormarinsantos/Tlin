const fs = require("fs");
const path = require("path");

const envFile = fs.readFileSync(path.join(__dirname, ".env.local"), "utf-8");
const apiKey = envFile.match(/GEMINI_API_KEY=(.*)/)[1].trim();

async function testFetch() {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: "Oi" }] }]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch Failed:", error);
  }
}

testFetch();
