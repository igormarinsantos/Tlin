import { funnelRpc } from "./funnel-store";
import { getPublishedArticleBySlug } from "./editorial/queries";

export type LeadAttribution = Record<string, string>;

const ACQUISITION_KEY = /^(first_|last_)?(utm_(source|medium|campaign|term|content)|landing_page|current_page|referrer|referrer_host|gclid|fbclid)$/;
const EDITORIAL_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EDITORIAL_ID = /^(cluster|cta):[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTENT_INTENTS = new Set(["informational", "commercial-investigation", "conversion-support"]);
const PII = /@|\+?\d[\d ().-]{8,}\d/;

function cleanAcquisitionValue(key: string, value: unknown) {
  if (typeof value !== "string" || value.length > 2_048 || PII.test(value)) return null;
  if (/(landing_page|current_page|referrer)$/.test(key)) {
    if (!value) return "";
    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch {
      return null;
    }
  }
  if (value.length > 200) return null;
  return value;
}

function cleanEditorialTouch(input: Record<string, unknown>, prefix: "first" | "last") {
  const slug = input[`${prefix}_article_slug`];
  const cluster = input[`${prefix}_content_cluster`];
  const intent = input[`${prefix}_content_intent`];
  const cta = input[`${prefix}_cta_id`];
  if (
    typeof slug !== "string" || slug.length > 128 || !EDITORIAL_SLUG.test(slug)
    || typeof cluster !== "string" || cluster.length > 64 || !EDITORIAL_ID.test(cluster)
    || typeof intent !== "string" || !CONTENT_INTENTS.has(intent)
    || (cta !== undefined && (typeof cta !== "string" || cta.length > 64 || !EDITORIAL_ID.test(cta)))
  ) {
    return {};
  }

  const article = getPublishedArticleBySlug(slug);
  if (!article || cluster !== article.clusterId || intent !== article.intent || (cta !== undefined && cta !== article.cta.id)) {
    return {};
  }

  return {
    [`${prefix}_article_slug`]: article.slug,
    [`${prefix}_content_cluster`]: article.clusterId,
    [`${prefix}_content_intent`]: article.intent,
    ...(cta ? { [`${prefix}_cta_id`]: article.cta.id } : {}),
  };
}

export function sanitizeLeadAttribution(value: unknown): LeadAttribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const acquisition = Object.fromEntries(Object.entries(input).flatMap(([key, rawValue]) => {
    if (!ACQUISITION_KEY.test(key)) return [];
    const cleanValue = cleanAcquisitionValue(key, rawValue);
    return cleanValue === null ? [] : [[key, cleanValue]];
  }));
  return {
    ...acquisition,
    ...cleanEditorialTouch(input, "first"),
    ...cleanEditorialTouch(input, "last"),
  };
}

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
      utm: sanitizeLeadAttribution(input.utm), payload: input.payload || {},
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
