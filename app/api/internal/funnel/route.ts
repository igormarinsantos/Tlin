import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { funnelRpc } from "@/lib/funnel-store";
import { checkRateLimit, rateLimitedResponse } from "@/lib/rate-limit";

type UnknownRow = Record<string, unknown>;

function isRow(value: unknown): value is UnknownRow {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function count(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.trunc(value) : 0;
}

function safeDimension(value: unknown, fallback: string) {
  if (typeof value !== "string" || value.length > 200 || /@|[+]?[0-9][0-9 ().-]{8,}[0-9]/.test(value)) return fallback;
  return value || fallback;
}

function editorialDimension(value: unknown, pattern: RegExp) {
  return value === "unattributed" || (typeof value === "string" && pattern.test(value)) ? value : "unattributed";
}

function sanitizeFunnelReport(value: unknown) {
  const report = isRow(value) ? value : {};
  const campaigns = Array.isArray(report.campaigns) ? report.campaigns.filter(isRow).map(row => ({
    source: safeDimension(row.source, "direct"),
    campaign: safeDimension(row.campaign, "(not set)"),
    leads: count(row.leads),
    demos: count(row.demos),
    qualified_demos: count(row.qualified_demos),
    attended_demos: count(row.attended_demos),
    won: count(row.won),
    awaiting_qualification: count(row.awaiting_qualification),
  })) : [];
  const content = Array.isArray(report.content) ? report.content.filter(isRow).flatMap(row => {
    if (row.touch !== "first" && row.touch !== "last") return [];
    return [{
      touch: row.touch,
      article_slug: editorialDimension(row.article_slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      content_cluster: editorialDimension(row.content_cluster, /^cluster:[a-z0-9]+(?:-[a-z0-9]+)*$/),
      cta_id: editorialDimension(row.cta_id, /^cta:[a-z0-9]+(?:-[a-z0-9]+)*$/),
      leads: count(row.leads),
      demos: count(row.demos),
      qualified_demos: count(row.qualified_demos),
      won: count(row.won),
    }];
  }) : [];
  return {
    campaigns,
    content,
    pending_operations: count(report.pending_operations),
    unmatched_events: count(report.unmatched_events),
    mapped_stages: count(report.mapped_stages),
  };
}

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
  try {
    const report = await funnelRpc<unknown>("read_funnel_report", { p_from: from, p_to: to });
    return NextResponse.json(sanitizeFunnelReport(report), { headers });
  }
  catch { return NextResponse.json({ error: "Banco de tracking indisponível ou migração pendente." }, { status: 503, headers }); }
}
