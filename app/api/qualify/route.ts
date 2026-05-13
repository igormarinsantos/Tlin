import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "REDACTED_GEMINI_API_KEY");

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Read the system prompt from the file
    const promptPath = path.join(process.cwd(), "lead_qualification_prompt.md");
    const systemInstruction = fs.readFileSync(promptPath, "utf-8");

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
    });

    const lastMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error (Qualify):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
