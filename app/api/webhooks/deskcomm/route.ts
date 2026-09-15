import { NextRequest, NextResponse } from "next/server";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { projectDeskcommStatusEvent } from "@/lib/supabase-leads";
import { checkRateLimit, rateLimitedResponse, requestIsTooLarge } from "@/lib/rate-limit";

function signatureIsValid(rawBody: string, suppliedSignature: string | null, secret: string | undefined) {
  if (!secret || !suppliedSignature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const supplied = Buffer.from(suppliedSignature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return supplied.length === expectedBuffer.length && timingSafeEqual(supplied, expectedBuffer);
}

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, "deskcomm-status", 60, 60_000);
  if (!limit.allowed) return rateLimitedResponse(limit.retryAfter);
  if (requestIsTooLarge(req, 16_000)) return NextResponse.json({ error: "Payload grande demais." }, { status: 413 });
  const secret = process.env.DESKCOMM_STATUS_WEBHOOK_SECRET;
  try {
    const rawBody = await req.text();
    if (!signatureIsValid(rawBody, req.headers.get("x-deskcomm-signature"), secret)) {
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }
    const body = JSON.parse(rawBody) as Record<string, unknown>;
    const data = body.data && typeof body.data === "object" ? body.data as Record<string, unknown> : {};
    const lead = data.lead && typeof data.lead === "object" ? data.lead as Record<string, unknown> : {};
    const contact = data.contact && typeof data.contact === "object" ? data.contact as Record<string, unknown> : {};
    const eventId = `deskcomm:${createHash("sha256").update(rawBody).digest("hex")}`;
    const status = typeof data.to_stage_id === "string"
      ? data.to_stage_id
      : typeof lead.stage_id === "string"
        ? lead.stage_id
        : "";
    const occurredAt = typeof body.occurred_at === "string" ? body.occurred_at : "";
    if (!eventId || !status || !occurredAt || Number.isNaN(Date.parse(occurredAt))) return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
    await projectDeskcommStatusEvent({
      eventId,
      status,
      occurredAt,
      leadCaptureId: typeof data.lead_capture_id === "string" ? data.lead_capture_id : undefined,
      leadId: typeof lead.id === "string" ? lead.id : undefined,
      contactId: typeof contact.id === "string" ? contact.id : undefined,
      payload: body,
    });
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: "JSON inválido." }, { status: 400 }); }
}
