type LeadSubmissionInput = {
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

const DEFAULT_SUPABASE_URL = "https://nhclqbnygvkyjcxscrgt.supabase.co";

export async function saveLeadSubmission(input: LeadSubmissionInput): Promise<LeadSubmissionResult> {
  const supabaseUrl = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!serviceRoleKey) {
    return {
      saved: false,
      error: "Variavel SUPABASE_SERVICE_ROLE_KEY ausente",
      row: null,
    };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/lead_form_submissions`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        company_name: input.name || null,
        phone: input.phone || null,
        country_code: input.countryCode || null,
        email: input.email || null,
        lead_volume: input.volume || null,
        team_size: input.team || null,
        plan_name: input.planName || null,
        lead_score: input.lead_score ?? null,
        lead_quality: input.lead_quality || null,
        utm: input.utm || {},
        payload: input.payload || {},
      }),
    });

    const responseText = await response.text();
    const row = responseText ? JSON.parse(responseText) : null;

    if (!response.ok) {
      return {
        saved: false,
        error: `Supabase retornou HTTP ${response.status}: ${responseText}`,
        row,
      };
    }

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
  const supabaseUrl = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!id || !serviceRoleKey) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/lead_form_submissions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notification_result: notificationResult,
      }),
    });
  } catch (error) {
    console.error("Erro ao atualizar notificacao do lead no Supabase:", error);
  }
}

export async function projectDeskcommStatusEvent(event: {
  eventId: string; leadCaptureId?: string; leadId?: string; contactId?: string; status: string; occurredAt: string; payload: Record<string, unknown>;
}) {
  const supabaseUrl = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!key) return { saved: false, duplicate: false };
  const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates" };
  try {
    const inserted = await fetch(`${supabaseUrl}/rest/v1/deskcomm_status_events`, { method: "POST", headers, body: JSON.stringify({ external_event_id: event.eventId, lead_capture_id: event.leadCaptureId || null, deskcomm_lead_id: event.leadId || null, deskcomm_contact_id: event.contactId || null, status: event.status, occurred_at: event.occurredAt, payload: event.payload }) });
    if (!inserted.ok) return { saved: false, duplicate: false };
    if (event.leadCaptureId) await fetch(`${supabaseUrl}/rest/v1/lead_form_submissions?lead_capture_id=eq.${encodeURIComponent(event.leadCaptureId)}`, { method: "PATCH", headers, body: JSON.stringify({ deskcomm_lead_id: event.leadId || null, deskcomm_contact_id: event.contactId || null, crm_status: event.status, crm_status_at: event.occurredAt }) });
    return { saved: true, duplicate: false };
  } catch { return { saved: false, duplicate: false }; }
}
