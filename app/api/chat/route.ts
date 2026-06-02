import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LIA_AI_URL = process.env.LIA_AI_URL || "http://2.25.144.27:11434/api/chat";
const LIA_AI_MODEL = process.env.LIA_AI_MODEL || "gemma3:1b";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Read the system prompt from the file
    const promptPath = path.join(process.cwd(), "lia_system_prompt_v3_tlin.md");
    const systemInstruction = fs.readFileSync(promptPath, "utf-8");

    const ollamaMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text || msg.content || "",
      })),
    ];

    const response = await fetch(LIA_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: LIA_AI_MODEL,
        messages: ollamaMessages,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || `Lia local AI returned HTTP ${response.status}`);
    }

    const text = data?.message?.content || data?.response || "";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Lia local AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
