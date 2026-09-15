import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkRateLimit, rateLimitedResponse, requestIsTooLarge } from "@/lib/rate-limit";

const LIA_AI_URL = process.env.LIA_AI_URL || "http://2.25.144.27:11434/api/chat";
const LIA_AI_MODEL = process.env.LIA_AI_MODEL || "gemma3:1b";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(req, "chat", 15, 60_000);
  if (!rateLimit.allowed) return rateLimitedResponse(rateLimit.retryAfter);
  if (requestIsTooLarge(req, 24_000)) {
    return NextResponse.json({ error: "Mensagem grande demais." }, { status: 413 });
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return NextResponse.json({ error: "Histórico de conversa inválido." }, { status: 400 });
    }

    const safeMessages = messages.map((message: unknown) => {
      const item = message as { role?: unknown; text?: unknown; content?: unknown };
      const content = typeof item.text === "string" ? item.text : item.content;
      if ((item.role !== "user" && item.role !== "assistant") || typeof content !== "string") return null;
      const trimmed = content.trim();
      return trimmed.length > 0 && trimmed.length <= 4_000
        ? { role: item.role, content: trimmed }
        : null;
    });

    if (safeMessages.some((message) => message === null)) {
      return NextResponse.json({ error: "Uma mensagem da conversa é inválida." }, { status: 400 });
    }
    
    // Read the system prompt from the file
    const promptPath = path.join(process.cwd(), "lia_system_prompt_v3_tlin.md");
    const systemInstruction = fs.readFileSync(promptPath, "utf-8");

    const ollamaMessages = [
      { role: "system", content: systemInstruction },
      ...safeMessages,
    ];

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 20_000);

    let response: Response;
    try {
      response = await fetch(LIA_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: LIA_AI_MODEL,
          messages: ollamaMessages,
          stream: false,
        }),
        signal: abortController.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || `Igor local AI returned HTTP ${response.status}`);
    }

    const text = data?.message?.content || data?.response || "";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Igor local AI Error:", error);
    return NextResponse.json({ error: "Não foi possível responder agora. Tente novamente." }, { status: 502 });
  }
}
