import { describe, expect, it } from "vitest";
import {
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  createConsentPreferences,
  parseConsentPreferences,
  toConsentModeState,
} from "../lib/consent";

describe("consent preferences", () => {
  it("defaults non-essential storage to denied", () => {
    expect(toConsentModeState(null)).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
  });

  it("maps analytics and marketing independently", () => {
    expect(toConsentModeState(createConsentPreferences(true, false))).toMatchObject({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    expect(toConsentModeState(createConsentPreferences(false, true))).toMatchObject({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("rejects stale or malformed stored choices", () => {
    expect(parseConsentPreferences(null)).toBeNull();
    expect(parseConsentPreferences("not-json")).toBeNull();
    expect(parseConsentPreferences(JSON.stringify({ version: 0, analytics: true, marketing: true }))).toBeNull();
    expect(parseConsentPreferences(JSON.stringify({ version: 1, analytics: "yes", marketing: false }))).toBeNull();
  });

  it("round-trips a valid versioned preference", () => {
    const preference = createConsentPreferences(true, false, "2026-09-30T12:00:00.000Z");
    expect(parseConsentPreferences(JSON.stringify(preference), Date.parse("2026-09-30T12:00:01.000Z"))).toEqual(preference);
    expect(CONSENT_STORAGE_KEY).toBe("tlin_consent_v1");
  });

  it("expires a stored preference after 180 days", () => {
    const updatedAt = "2026-01-01T00:00:00.000Z";
    const preference = createConsentPreferences(true, true, updatedAt);

    expect(
      parseConsentPreferences(
        JSON.stringify(preference),
        Date.parse(updatedAt) + CONSENT_MAX_AGE_MS - 1,
      ),
    ).toEqual(preference);
    expect(
      parseConsentPreferences(
        JSON.stringify(preference),
        Date.parse(updatedAt) + CONSENT_MAX_AGE_MS + 1,
      ),
    ).toBeNull();
  });

  it("rejects a preference dated materially in the future", () => {
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    const preference = createConsentPreferences(false, false, "2026-01-01T00:06:00.000Z");

    expect(parseConsentPreferences(JSON.stringify(preference), now)).toBeNull();
  });
});
