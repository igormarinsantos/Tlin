/**
 * UTM Tracking System — Tlin.ai
 * Handles capture, persistence (first/last touch), GA4 integration and form injection.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type UtmParams = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  landing_page?: string;
  current_page?: string;
  referrer?: string;
  referrer_host?: string;
  captured_at?: string;
  gclid?: string;
  fbclid?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const KEY_FIRST = 'tlin_first_utm';
const KEY_LAST  = 'tlin_last_utm';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// Debug: set NEXT_PUBLIC_UTM_DEBUG=true OR localStorage.setItem('utm_debug','true')
function isDebug(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    process.env.NEXT_PUBLIC_UTM_DEBUG === 'true' ||
    localStorage.getItem('utm_debug') === 'true'
  );
}

function log(...args: unknown[]) {
  if (isDebug()) console.log('[UTM]', ...args);
}

// ─── URL Parser ───────────────────────────────────────────────────────────────

/**
 * Parses UTM parameters + gclid/fbclid from a URL query string.
 * Returns null if no tracking parameters are found.
 */
export function parseUtmFromUrl(search: string = ''): UtmParams | null {
  const params = new URLSearchParams(search);
  const locationHref = typeof window !== 'undefined' ? window.location.href : '';
  const referrer = typeof document !== 'undefined' ? document.referrer : '';
  const referrerHost = getReferrerHost(referrer);

  const source   = params.get('utm_source');
  const medium   = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  const term     = params.get('utm_term')    || '';
  const content  = params.get('utm_content') || '';
  const gclid    = params.get('gclid')   || undefined;
  const fbclid   = params.get('fbclid')  || undefined;

  // No tracking params found
  if (!source && !gclid && !fbclid) return null;

  return {
    utm_source:   gclid  ? 'google'   : fbclid ? 'facebook' : (source   || 'direct'),
    utm_medium:   gclid  ? 'cpc'      : fbclid ? 'social'   : (medium   || 'none'),
    utm_campaign: campaign || '(not set)',
    utm_term:     term,
    utm_content:  content,
    landing_page: locationHref,
    current_page: locationHref,
    referrer,
    referrer_host: referrerHost,
    captured_at: new Date().toISOString(),
    ...(gclid  && { gclid }),
    ...(fbclid && { fbclid }),
  };
}

/** Default fallback for direct/untracked traffic */
export function getFallbackUtm(): UtmParams {
  const locationHref = typeof window !== 'undefined' ? window.location.href : '';
  const referrer = typeof document !== 'undefined' ? document.referrer : '';
  const referrerHost = getReferrerHost(referrer);

  return {
    utm_source:   referrerHost || 'direct',
    utm_medium:   referrerHost ? 'referral' : 'none',
    utm_campaign: '(not set)',
    utm_term:     '',
    utm_content:  '',
    landing_page: locationHref,
    current_page: locationHref,
    referrer,
    referrer_host: referrerHost,
    captured_at: new Date().toISOString(),
  };
}

function getReferrerHost(referrer: string): string {
  if (!referrer) return '';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    const currentHost = typeof window !== 'undefined'
      ? window.location.hostname.replace(/^www\./, '')
      : '';

    return host && host !== currentHost ? host : '';
  } catch {
    return '';
  }
}

// ─── Cookie Manager ───────────────────────────────────────────────────────────

function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── Storage Manager ──────────────────────────────────────────────────────────

function saveUtm(key: string, utm: UtmParams): void {
  const json = JSON.stringify(utm);
  try { localStorage.setItem(key, json); } catch { /* quota exceeded */ }
  setCookie(key, json);
}

function loadUtm(key: string): UtmParams | null {
  // Prefer localStorage, fall back to cookie
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* parse error */ }

  const cookie = getCookie(key);
  if (cookie) {
    try { return JSON.parse(cookie); } catch { /* parse error */ }
  }
  return null;
}

// ─── First / Last Touch Capture ───────────────────────────────────────────────

/**
 * Main capture function. Call this on every page load / route change.
 * - First touch is NEVER overwritten once set.
 * - Last touch is updated whenever new UTM params are present in the URL.
 */
export function captureUtms(search: string = ''): void {
  if (typeof window === 'undefined') return;

  const parsed = parseUtmFromUrl(search || window.location.search);
  log('Parsed from URL:', parsed);

  // ── First touch ──────────────────────────────────────────────────────────
  const existingFirst = loadUtm(KEY_FIRST);
  if (!existingFirst) {
    const firstUtm = parsed || getFallbackUtm();
    saveUtm(KEY_FIRST, firstUtm);
    log('First touch SET:', firstUtm);
  } else {
    log('First touch already exists (not overwriting):', existingFirst);
  }

  // ── Last touch ───────────────────────────────────────────────────────────
  if (parsed) {
    // Real UTMs in URL → always update last touch
    saveUtm(KEY_LAST, parsed);
    log('Last touch UPDATED:', parsed);
  } else {
    const existingLast = loadUtm(KEY_LAST);
    if (!existingLast) {
      // No previous last touch → set fallback
      saveUtm(KEY_LAST, getFallbackUtm());
      log('Last touch FALLBACK set');
    } else {
      log('Last touch kept (no new UTMs):', existingLast);
    }
  }
}

export function getFirstTouch(): UtmParams {
  return loadUtm(KEY_FIRST) || getFallbackUtm();
}

export function getLastTouch(): UtmParams {
  return loadUtm(KEY_LAST) || getFallbackUtm();
}

// ─── GA4 Integration ──────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

type EventParam = string | number | boolean | undefined;

function getUtmEventPayload(extraData: Record<string, EventParam> = {}) {
  const first = getFirstTouch();
  const last  = getLastTouch();

  const payload: Record<string, string | number | boolean> = {
    first_utm_source:   first.utm_source,
    first_utm_medium:   first.utm_medium,
    first_utm_campaign: first.utm_campaign,
    first_utm_term:     first.utm_term,
    first_utm_content:  first.utm_content,
    first_landing_page: first.landing_page || '',
    first_referrer:     first.referrer || '',
    first_referrer_host: first.referrer_host || '',
    last_utm_source:    last.utm_source,
    last_utm_medium:    last.utm_medium,
    last_utm_campaign:  last.utm_campaign,
    last_utm_term:      last.utm_term,
    last_utm_content:   last.utm_content,
    last_landing_page:  last.landing_page || '',
    last_current_page:  last.current_page || '',
    last_referrer:      last.referrer || '',
    last_referrer_host: last.referrer_host || '',
  };

  Object.entries(extraData).forEach(([key, value]) => {
    if (value !== undefined) payload[key] = value;
  });

  return payload;
}

/**
 * Sends UTM data as a GA4 custom event.
 * @param eventName - GA4 event name (default: 'utm_capture')
 */
export function sendUtmToGA(eventName = 'utm_capture', extraData: Record<string, EventParam> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    log('gtag not available yet, skipping GA send');
    return;
  }

  const payload = getUtmEventPayload(extraData);

  window.gtag('event', eventName, payload);
  log('Sent to GA4:', eventName, payload);
}

export function getUtmLeadPayload() {
  return getUtmEventPayload();
}

// ─── Form Injection ───────────────────────────────────────────────────────────

/**
 * Injects hidden inputs with UTM data into ALL forms on the page.
 * Safe to call multiple times — will not duplicate inputs.
 */
export function injectUtmsIntoForms(): void {
  if (typeof document === 'undefined') return;

  const first = getFirstTouch();
  const last  = getLastTouch();

  const fields: Record<string, string> = {
    first_utm_source:   first.utm_source,
    first_utm_medium:   first.utm_medium,
    first_utm_campaign: first.utm_campaign,
    first_utm_term:     first.utm_term,
    first_utm_content:  first.utm_content,
    first_landing_page: first.landing_page || '',
    first_referrer:     first.referrer || '',
    first_referrer_host: first.referrer_host || '',
    last_utm_source:    last.utm_source,
    last_utm_medium:    last.utm_medium,
    last_utm_campaign:  last.utm_campaign,
    last_utm_term:      last.utm_term,
    last_utm_content:   last.utm_content,
    last_landing_page:  last.landing_page || '',
    last_current_page:  last.current_page || '',
    last_referrer:      last.referrer || '',
    last_referrer_host: last.referrer_host || '',
  };

  document.querySelectorAll('form').forEach((form) => {
    Object.entries(fields).forEach(([name, value]) => {
      let input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.appendChild(input);
      }
      input.value = value;
    });
  });

  log('Injected UTMs into forms:', fields);
}

// ─── Conversion Tracking ─────────────────────────────────────────────────────

/**
 * Call this when a lead converts (form submit, CTA click, etc).
 * Sends a 'form_submit' event to GA4 with full UTM context.
 */
export function trackConversion(eventName = 'qualify_lead', extraData: Record<string, EventParam> = {}): void {
  sendUtmToGA(eventName, extraData);
  if (extraData) {
    log('Conversion extra data:', extraData);
  }
}

// ─── Debug Report ─────────────────────────────────────────────────────────────

/**
 * Prints a full UTM debug report to the console.
 * Enable by running: localStorage.setItem('utm_debug', 'true')
 */
export function utmDebugReport(): void {
  if (typeof window === 'undefined') return;
  console.group('[UTM] Debug Report');
  console.log('URL search:  ', window.location.search);
  console.log('First touch: ', getFirstTouch());
  console.log('Last touch:  ', getLastTouch());
  console.log('Hint: set localStorage.utm_debug = "true" to enable auto-logging');
  console.groupEnd();
}
