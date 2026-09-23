import { createHmac } from "node:crypto";
import { callDeskcommTool } from "./deskcomm-mcp";
import { sanitizeLeadAttribution } from "./supabase-leads";

export type DeskcommLeadCaptureInput = {
  leadCaptureId: string;
  name: string;
  phone: string;
  email?: string;
  leadScore?: number;
  leadQuality?: "high" | "medium" | "low";
  status?: string;
  utm?: Record<string, unknown>;
};

type DeskcommLeadCaptureResult =
  | { ok: true; data: unknown; leadId?: string; contactId?: string; metadataSynced?: boolean }
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

  const attribution = sanitizeLeadAttribution(input.utm);
  const payload = {
    external_id: input.leadCaptureId,
    nome: input.name,
    telefone: input.phone,
    ...(input.email ? { email: input.email } : {}),
    lead_capture_id: input.leadCaptureId,
    ...(typeof input.leadScore === "number" ? { lead_score: input.leadScore } : {}),
    ...(input.leadQuality ? { lead_quality: input.leadQuality } : {}),
    ...(input.status ? { status_lp: input.status } : {}),
    // The CRM inbound mapper discards nested objects. Keep attribution scalar.
    ...attribution,
  };

  const body = JSON.stringify(payload);
  const secret = process.env.DESKCOMM_WEBHOOK_SECRET;
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": input.leadCaptureId,
        ...(secret ? { "x-deskcomm-signature": createHmac("sha256", secret).update(body).digest("hex") } : {}),
      },
      body,
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

    const receipt = data as { data?: { lead_id?: unknown } } | null;
    const leadId = typeof receipt?.data?.lead_id === "string" ? receipt.data.lead_id : undefined;
    // Native inbound dedup returns the original row without updating final form fields.
    if (!leadId) return { ok: false, error: "Deskcomm capture did not return a lead receipt." };
    if (input.email) {
      const existing = await callDeskcommTool<{ lead: { custom_fields?: Record<string, unknown>; contact_id?: string } }>("crm_get_lead", { lead_id: leadId });
      if (existing.ok && existing.data.lead) {
        const updated = await callDeskcommTool("crm_update_lead", { lead_id: leadId, custom_fields: {
          ...existing.data.lead.custom_fields, ...payload,
          // Deliberately no qualified flag or stage move: the team owns that decision.
        } });
        return { ok: true, data, leadId, contactId: existing.data.lead.contact_id, metadataSynced: updated.ok };
      }
    }
    return { ok: true, data, leadId, metadataSynced: !input.email };
  } catch (error) {
    console.error("[deskcomm-leads] capture failed", error);
    return { ok: false, error: "Deskcomm capture request failed." };
  }
}
