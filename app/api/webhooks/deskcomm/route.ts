import { NextRequest, NextResponse } from "next/server";
import { projectDeskcommStatusEvent } from "@/lib/supabase-leads";
import { checkRateLimit, rateLimitedResponse, requestIsTooLarge } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, "deskcomm-status", 60, 60_000);
  if (!limit.allowed) return rateLimitedResponse(limit.retryAfter);
  if (requestIsTooLarge(req, 16_000)) return NextResponse.json({ error: "Payload grande demais." }, { status: 413 });
  const secret = process.env.DESKCOMM_STATUS_WEBHOOK_SECRET;
  const supplied = req.headers.get("x-deskcomm-secret") || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !supplied || supplied !== secret) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  try {
    const body = await req.json() as Record<string, unknown>;
    const eventId = typeof body.event_id === "string" ? body.event_id : "";
    const status = typeof body.status === "string" ? body.status : "";
    const occurredAt = typeof body.occurred_at === "string" ? body.occurred_at : "";
    if (!eventId || !status || !occurredAt || Number.isNaN(Date.parse(occurredAt))) return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
    await projectDeskcommStatusEvent({ eventId, status, occurredAt, leadCaptureId: typeof body.lead_capture_id === "string" ? body.lead_capture_id : undefined, leadId: typeof body.lead_id === "string" ? body.lead_id : undefined, contactId: typeof body.contact_id === "string" ? body.contact_id : undefined, payload: body });
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: "JSON inválido." }, { status: 400 }); }
}
