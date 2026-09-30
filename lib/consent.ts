export const CONSENT_STORAGE_KEY = "tlin_consent_v1";
export const CONSENT_VERSION = 1 as const;
export const CONSENT_MAX_AGE_DAYS = 180;
export const CONSENT_MAX_AGE_MS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
export const OPEN_CONSENT_EVENT = "tlin:open-consent";

export type ConsentPreferences = {
  version: typeof CONSENT_VERSION;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export type ConsentModeValue = "granted" | "denied";

export type ConsentModeState = {
  analytics_storage: ConsentModeValue;
  ad_storage: ConsentModeValue;
  ad_user_data: ConsentModeValue;
  ad_personalization: ConsentModeValue;
  functionality_storage: "granted";
  security_storage: "granted";
};

export function parseConsentPreferences(
  raw: string | null,
  now = Date.now(),
): ConsentPreferences | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (
      value.version !== CONSENT_VERSION ||
      typeof value.analytics !== "boolean" ||
      typeof value.marketing !== "boolean" ||
      typeof value.updatedAt !== "string" ||
      Number.isNaN(Date.parse(value.updatedAt)) ||
      now - Date.parse(value.updatedAt) > CONSENT_MAX_AGE_MS ||
      Date.parse(value.updatedAt) > now + 5 * 60 * 1000
    ) {
      return null;
    }

    return {
      version: CONSENT_VERSION,
      analytics: value.analytics,
      marketing: value.marketing,
      updatedAt: value.updatedAt,
    };
  } catch {
    return null;
  }
}

export function createConsentPreferences(
  analytics: boolean,
  marketing: boolean,
  updatedAt = new Date().toISOString(),
): ConsentPreferences {
  return {
    version: CONSENT_VERSION,
    analytics,
    marketing,
    updatedAt,
  };
}

export function toConsentModeState(
  preferences: Pick<ConsentPreferences, "analytics" | "marketing"> | null,
): ConsentModeState {
  const analytics = preferences?.analytics === true ? "granted" : "denied";
  const marketing = preferences?.marketing === true ? "granted" : "denied";

  return {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    functionality_storage: "granted",
    security_storage: "granted",
  };
}

export function updateConsentMode(preferences: ConsentPreferences) {
  if (typeof window === "undefined") return;

  window.dataLayer ||= [];
  window.gtag ||= function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag("consent", "update", toConsentModeState(preferences));
  window.dataLayer.push({
    event: "consent_updated",
    consent_analytics: preferences.analytics,
    consent_marketing: preferences.marketing,
  });
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
