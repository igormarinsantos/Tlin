import { NextRequest, NextResponse } from "next/server";
import { captureDeskcommLead } from "@/lib/deskcomm-leads";
import { checkRateLimit, rateLimitedResponse, requestIsTooLarge } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(req, "lead-capture", 10, 60 * 60_000);
  if (!rateLimit.allowed) return rateLimitedResponse(rateLimit.retryAfter);
  if (requestIsTooLarge(req, 8_000)) return NextResponse.json({ success: false }, { status: 413 });

  const data = await req.json().catch(() => null);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.replace(/\D/g, "") : "";
  const countryCode = typeof data.countryCode === "string" ? data.countryCode.replace(/\D/g, "") : "55";
  if (!name || name.length > 120 || phone.length < 8 || phone.length > 15) {
    return NextResponse.json({ success: false, error: "Dados de contato inválidos." }, { status: 400 });
  }
  if (!(await verifyTurnstileToken(data.turnstileToken, req))) {
    return NextResponse.json({ success: false, error: "Validação necessária." }, { status: 403 });
  }
  const result = await captureDeskcommLead({
    leadCaptureId: typeof data.leadCaptureId === "string" && data.leadCaptureId.length > 0 && data.leadCaptureId.length <= 128 ? data.leadCaptureId : crypto.randomUUID(),
    name,
    phone: `+${countryCode}${phone}`,
    status: "novo",
    utm: typeof data.utm === "object" && data.utm ? data.utm : undefined,
  });
  return NextResponse.json({ success: result.ok }, { status: result.ok ? 200 : 502 });
}
