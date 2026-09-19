import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { funnelRpc } from "@/lib/funnel-store";
import { checkRateLimit, rateLimitedResponse } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  const limit = checkRateLimit(req, "funnel-report", 20, 60_000);
  if (!limit.allowed) return rateLimitedResponse(limit.retryAfter);
  const expected = process.env.FUNNEL_REPORT_TOKEN;
  const supplied = req.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!expected || expected.length < 32 || !timingSafeEqual(digest(supplied), digest(expected))) {
    return NextResponse.json({ error: "Acesso restrito." }, { status: 401, headers });
  }
  const from = req.nextUrl.searchParams.get("from") || "";
  const to = req.nextUrl.searchParams.get("to") || "";
  const valid = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
  if (!valid(from) || !valid(to) || from > to || Date.parse(to) - Date.parse(from) > 366 * 86400000) {
    return NextResponse.json({ error: "Escolha um período de até 366 dias." }, { status: 400, headers });
  }
  try { return NextResponse.json(await funnelRpc("read_funnel_report", { p_from: from, p_to: to }), { headers }); }
  catch { return NextResponse.json({ error: "Banco de tracking indisponível ou migração pendente." }, { status: 503, headers }); }
}
