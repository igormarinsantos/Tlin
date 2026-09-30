import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ANALYTICS_EVENTS,
  PRIMARY_ANALYTICS_CONVERSIONS,
  SECONDARY_ANALYTICS_CONVERSIONS,
} from "../lib/analytics-contract";

const rootLayout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

describe("GTM analytics governance", () => {
  it("keeps GTM as the only analytics loader in the root layout", () => {
    expect(rootLayout).toContain("NEXT_PUBLIC_ANALYTICS_OWNER === \"gtm\"");
    expect(rootLayout).toContain("googletagmanager.com/gtm.js");
    expect(rootLayout).toContain("googletagmanager.com/ns.html");
    expect(rootLayout).not.toContain("NEXT_PUBLIC_GA_MEASUREMENT_ID");
    expect(rootLayout).not.toContain("googletagmanager.com/gtag/js");
  });

  it("sets denied consent defaults before the GTM loader", () => {
    const consentPosition = rootLayout.indexOf('id="tlin-consent-defaults"');
    const loaderPosition = rootLayout.indexOf("googletagmanager.com/gtm.js");

    expect(consentPosition).toBeGreaterThan(-1);
    expect(loaderPosition).toBeGreaterThan(consentPosition);
    expect(rootLayout).toContain("analytics_storage:analytics");
    expect(rootLayout).toContain("ad_storage:marketing");
    expect(rootLayout).toContain("?'granted':'denied'");
    expect(rootLayout).toContain("ads_data_redaction");
  });

  it("keeps conversion classification inside the typed event catalog", () => {
    const catalog = new Set<string>(ANALYTICS_EVENTS);
    expect(new Set(ANALYTICS_EVENTS).size).toBe(ANALYTICS_EVENTS.length);
    expect(PRIMARY_ANALYTICS_CONVERSIONS).toEqual(["demo_booked"]);
    expect([...PRIMARY_ANALYTICS_CONVERSIONS, ...SECONDARY_ANALYTICS_CONVERSIONS]
      .every((event) => catalog.has(event))).toBe(true);
  });
});
