import { funnelRpc } from "./funnel-store";

type LeadSubmissionInput = {
  leadCaptureId: string;
  deskcommLeadId?: string;
  deskcommContactId?: string;
  contactKey?: string;
  capturedAt?: string;
  bookedAt?: string;
  bookingKey?: string;
  bookingStartsAt?: string;
  name?: string;
  phone?: string;
  countryCode?: string;
  volume?: string;
  team?: string;
  email?: string;
  planName?: string;
  lead_score?: number;
  lead_quality?: string;
  utm?: Record<string, unknown>;
  payload: Record<string, unknown>;
};

type LeadSubmissionResult = {
  saved: boolean;
  error: string | null;
  row: unknown;
};

export async function saveLeadSubmission(input: LeadSubmissionInput): Promise<LeadSubmissionResult> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!serviceRoleKey) {
    return {
      saved: false,
      error: "Variavel SUPABASE_SERVICE_ROLE_KEY ausente",
      row: null,
    };
  }

  try {
    const row = await funnelRpc("record_funnel_lead", { p_lead: {
      lead_capture_id: input.leadCaptureId, contact_key: input.contactKey || null,
      deskcomm_lead_id: input.deskcommLeadId || null, deskcomm_contact_id: input.deskcommContactId || null,
      captured_at: input.capturedAt || null, booked_at: input.bookedAt || null,
      booking_key: input.bookingKey || null, booking_starts_at: input.bookingStartsAt || null,
      company_name: input.name || null, phone: input.phone || null, country_code: input.countryCode || null,
      email: input.email || null, lead_volume: input.volume || null, team_size: input.team || null,
      plan_name: input.planName || null, lead_score: input.lead_score ?? null, lead_quality: input.lead_quality || null,
      utm: input.utm || {}, payload: input.payload || {},
    } });

    return {
      saved: true,
      error: null,
      row,
    };
  } catch (error: any) {
    return {
      saved: false,
      error: error?.message || "Falha ao salvar lead no Supabase",
      row: null,
    };
  }
}

export async function updateLeadSubmissionNotification(id: string | null, notificationResult: Record<string, unknown>) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!id || !serviceRoleKey || !supabaseUrl) return;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/lead_form_submissions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      signal: AbortSignal.timeout(8_000),
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notification_result: notificationResult,
      }),
    });
    if (!response.ok) console.warn("[funnel] Notification projection failed", response.status);
  } catch (error) {
    console.error("Erro ao atualizar notificacao do lead no Supabase:", error);
  }
}

export async function projectDeskcommStatusEvent(event: {
  eventId: string; leadCaptureId?: string; leadId?: string; contactId?: string; status: string; occurredAt: string; payload: Record<string, unknown>;
}) {
  try {
    return await funnelRpc<{ saved: boolean; duplicate: boolean; projected: boolean }>("apply_funnel_crm_event", { p_event: event });
  } catch { return { saved: false, duplicate: false, projected: false }; }
}
