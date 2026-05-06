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
    ...(gclid  && { gclid }),
    ...(fbclid && { fbclid }),
  };
}

/** Default fallback for direct/untracked traffic */
export function getFallbackUtm(): UtmParams {
  return {
    utm_source:   'direct',
    utm_medium:   'none',
    utm_campaign: '(not set)',
    utm_term:     '',
    utm_content:  '',
  };
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

/**
 * Sends UTM data as a GA4 custom event.
 * @param eventName - GA4 event name (default: 'utm_capture')
 */
export function sendUtmToGA(eventName = 'utm_capture'): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    log('gtag not available yet, skipping GA send');
    return;
  }

  const first = getFirstTouch();
  const last  = getLastTouch();

  const payload = {
    first_utm_source:   first.utm_source,
    first_utm_medium:   first.utm_medium,
    first_utm_campaign: first.utm_campaign,
    first_utm_term:     first.utm_term,
    first_utm_content:  first.utm_content,
    last_utm_source:    last.utm_source,
    last_utm_medium:    last.utm_medium,
    last_utm_campaign:  last.utm_campaign,
    last_utm_term:      last.utm_term,
    last_utm_content:   last.utm_content,
  };

  window.gtag('event', eventName, payload);
  log('Sent to GA4:', eventName, payload);
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
    last_utm_source:    last.utm_source,
    last_utm_medium:    last.utm_medium,
    last_utm_campaign:  last.utm_campaign,
    last_utm_term:      last.utm_term,
    last_utm_content:   last.utm_content,
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
export function trackConversion(extraData?: Record<string, string>): void {
  sendUtmToGA('form_submit');
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
