export type DeskcommLeadCaptureInput = {
  leadCaptureId: string;
  name: string;
  phone: string;
  email?: string;
  leadScore?: number;
  leadQuality?: "qualified" | "nurture" | "unqualified";
  status?: string;
  utm?: Record<string, string | undefined>;
};

type DeskcommLeadCaptureResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string };

/**
 * Sends a captured WhatsApp lead to Deskcomm without exposing the webhook to
 * the browser. The capture identifier lets Deskcomm (or its automation) make
 * retries idempotent when that capability is configured on the webhook.
 */
export async function captureDeskcommLead(
  input: DeskcommLeadCaptureInput,
): Promise<DeskcommLeadCaptureResult> {
  const webhookUrl = process.env.DESKCOMM_WEBHOOK_URL;

  if (!webhookUrl) {
    return { ok: false, error: "Deskcomm webhook is not configured." };
  }

  const payload = {
    nome: input.name,
    telefone: input.phone,
    ...(input.email ? { email: input.email } : {}),
    lead_capture_id: input.leadCaptureId,
    ...(typeof input.leadScore === "number" ? { lead_score: input.leadScore } : {}),
    ...(input.leadQuality ? { lead_quality: input.leadQuality } : {}),
    ...(input.status ? { status_lp: input.status } : {}),
    ...(input.utm ? { utm: input.utm } : {}),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": input.leadCaptureId,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const responseBody = await response.text();
    let data: unknown = responseBody;
    try {
      data = responseBody ? JSON.parse(responseBody) : null;
    } catch {
      // Deskcomm webhooks may reply with text; retain it for server-side logs.
    }

    if (!response.ok) {
      return { ok: false, error: `Deskcomm capture failed (${response.status}).` };
    }

    return { ok: true, data };
  } catch (error) {
    console.error("[deskcomm-leads] capture failed", error);
    return { ok: false, error: "Deskcomm capture request failed." };
  }
}
