import type { AnalyticsEventName } from "./analytics-contract";

type Params = Record<string, string | number | boolean | undefined>;

export function safePageUrl(value: string) {
  try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? url.origin + url.pathname : ""; }
  catch { return ""; }
}

export function analyticsOwner() {
  const owner = process.env.NEXT_PUBLIC_ANALYTICS_OWNER;
  if (owner === "gtm") return owner;
  return "off";
}

// Explicit parameters only: contact details, message text and click IDs never go to GA.
const allowed = /^(first_|last_)?utm_(source|medium|campaign|term|content)$|^(event_category|lead_step|field_name|plan_name|lead_score|lead_quality|lead_volume|team_size|form_mode|cta_source|source|destination|solution|page_location|page_referrer|page_path|event_id|trigger|chat_state|pathname|qualification_step|pending_reply_count|dismiss_reason|message_length|previous_messages)$/;
const editorialValueRules: Record<string, RegExp> = {
  article_slug: /^[a-z][a-z0-9]*(?:-[a-z0-9]+){0,15}$/,
  content_cluster: /^cluster:[a-z0-9]+(?:-[a-z0-9]+){0,11}$/,
  content_intent: /^(informational|commercial-investigation|conversion-support)$/,
  content_group: /^editorial$/,
  cta_id: /^cta:[a-z0-9]+(?:-[a-z0-9]+){0,7}$/,
  cta_location: /^(article-end|cluster-hub)$/,
  method: /^(whatsapp|linkedin|x|copy_link)$/,
  content_type: /^article$/,
  item_id: /^[a-z][a-z0-9]*(?:-[a-z0-9]+){0,15}$/,
  trigger: /^(form_idle|page_complete|initial_followup)$/,
  chat_state: /^(open|closed)$/,
  pathname: /^\/[a-z0-9/_-]*$/,
  dismiss_reason: /^(user_resumed)$/,
  event_id: /^[a-f0-9-]{36}$/i,
};
const numericValueRules: Record<string, { min: number; max: number; integer: boolean }> = {
  lead_step: { min: 0, max: 10, integer: true },
  qualification_step: { min: 0, max: 10, integer: true },
  pending_reply_count: { min: 0, max: 3, integer: true },
  message_length: { min: 0, max: 4_000, integer: true },
  previous_messages: { min: 0, max: 200, integer: true },
  lead_score: { min: 0, max: 100, integer: false },
};
export function cleanAnalyticsParams(params: Params): Params {
  return Object.fromEntries(Object.entries(params).filter(([key, value]) => {
    if (value === undefined) return false;
    const editorialRule = editorialValueRules[key];
    if (editorialRule) return typeof value === "string" && value.length <= 120 && editorialRule.test(value);
    const numericRule = numericValueRules[key];
    if (numericRule) {
      return typeof value === "number" && Number.isFinite(value)
        && value >= numericRule.min && value <= numericRule.max
        && (!numericRule.integer || Number.isInteger(value));
    }
    return allowed.test(key);
  }).map(([key, value]) => {
    if (typeof value !== "string") return [key, value];
    const clean = key === "page_location" || key === "page_referrer" ? safePageUrl(value) : value;
    if (key === "event_id") return [key, clean];
    return [key, /@|\+?\d[\d ().-]{8,}\d/.test(clean) ? "[redacted]" : clean.slice(0, 200)];
  }));
}

/** dataLayer itself is the queue; initialization must not replace it. */
export function emitAnalytics(event: AnalyticsEventName, params: Params = {}) {
  if (typeof window === "undefined") return;
  const owner = analyticsOwner();
  if (owner === "off") return;
  const payload = cleanAnalyticsParams(params);
  window.dataLayer ||= [];
  if (window.dataLayer.length > 500) return;
  window.dataLayer.push({ event, ...payload });
}
