type Params = Record<string, string | number | boolean | undefined>;

export function safePageUrl(value: string) {
  try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? url.origin + url.pathname : ""; }
  catch { return ""; }
}

export function analyticsOwner() {
  const owner = process.env.NEXT_PUBLIC_ANALYTICS_OWNER;
  if (owner === "gtm" || owner === "ga4") return owner;
  return "off";
}

// Explicit parameters only: contact details, message text and click IDs never go to GA.
const allowed = /^(first_|last_)?utm_(source|medium|campaign|term|content)$|^(event_category|lead_step|field_name|plan_name|lead_score|lead_quality|lead_volume|team_size|form_mode|cta_source|cta_location|cta_text|source|destination|solution|page_location|page_referrer|page_path|event_id|experiment_id|experiment_variant)$/;
export function cleanAnalyticsParams(params: Params): Params {
  return Object.fromEntries(Object.entries(params).filter(([key, value]) => allowed.test(key) && value !== undefined).map(([key, value]) => {
    if (typeof value !== "string") return [key, value];
    const clean = key === "page_location" || key === "page_referrer" ? safePageUrl(value) : value;
    return [key, /@|\+?\d[\d ().-]{8,}\d/.test(clean) ? "[redacted]" : clean.slice(0, 200)];
  }));
}

/** dataLayer itself is the queue; initialization must not replace it. */
export function emitAnalytics(event: string, params: Params = {}) {
  if (typeof window === "undefined" || !/^[a-z][a-z0-9_]{0,39}$/.test(event)) return;
  const owner = analyticsOwner();
  if (owner === "off") return;
  const payload = cleanAnalyticsParams(params);
  window.dataLayer ||= [];
  if (window.dataLayer.length > 500 && !window.gtag) return;
  if (owner === "gtm") { window.dataLayer.push({ event, ...payload }); return; }
  // Google's dataLayer protocol uses an Arguments object for gtag commands.
  // eslint-disable-next-line prefer-rest-params
  window.gtag ||= function () { window.dataLayer.push(arguments); };
  window.gtag("event", event, payload);
}
