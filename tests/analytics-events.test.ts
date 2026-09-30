// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanAnalyticsParams, emitAnalytics } from "../lib/analytics-events";
import { captureUtms, getFirstTouch, getLastTouch, parseUtmFromUrl } from "../lib/utm";

afterEach(() => { vi.unstubAllEnvs(); localStorage.clear(); document.cookie = "tlin_first_utm=; max-age=0; path=/"; document.cookie = "tlin_last_utm=; max-age=0; path=/"; });
describe("analytics and attribution", () => {
  it("captures campaign-only links and preserves explicit paid social medium", () => {
    expect(parseUtmFromUrl("?utm_campaign=demo")).toMatchObject({ utm_campaign: "demo" });
    expect(parseUtmFromUrl("?utm_source=instagram&utm_medium=paid_social&fbclid=x")).toMatchObject({ utm_source: "instagram", utm_medium: "paid_social" });
  });
  it("keeps first touch, updates last touch, and expires both after 30 days", () => {
    captureUtms("?utm_source=google"); captureUtms("?utm_source=meta");
    expect(getFirstTouch().utm_source).toBe("google"); expect(getLastTouch().utm_source).toBe("meta");
    const stale = { ...getFirstTouch(), captured_at: "2020-01-01T00:00:00Z" };
    localStorage.setItem("tlin_first_utm", JSON.stringify(stale));
    captureUtms("?utm_source=new"); expect(getFirstTouch().utm_source).toBe("new");
  });
  it("strips contact fields and query strings from analytics", () => {
    expect(cleanAnalyticsParams({ email: "ana@example.test", phone: "11999999999", page_location: "https://tlin.ia.br/demo?email=ana@example.test#secret", last_utm_campaign: "ana@example.test", lead_step: 4 })).toEqual({ page_location: "https://tlin.ia.br/demo", last_utm_campaign: "[redacted]", lead_step: 4 });
  });
  it("allows only controlled editorial analytics dimensions", () => {
    expect(cleanAnalyticsParams({
      article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      content_cluster: "cluster:ia-comercial",
      content_intent: "informational",
      content_group: "editorial",
      cta_id: "cta:demo",
      cta_location: "article-end",
      method: "whatsapp",
      content_type: "article",
      item_id: "agentes-de-ia-no-whatsapp-para-vendas",
      title: "Título livre com ana@example.test",
      query: "telefone 11999999999",
    })).toEqual({
      article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      content_cluster: "cluster:ia-comercial",
      content_intent: "informational",
      content_group: "editorial",
      cta_id: "cta:demo",
      cta_location: "article-end",
      method: "whatsapp",
      content_type: "article",
      item_id: "agentes-de-ia-no-whatsapp-para-vendas",
    });
  });
  it("keeps bounded Igor engagement context without conversation content", () => {
    expect(cleanAnalyticsParams({
      trigger: "form_idle",
      chat_state: "closed",
      pathname: "/ia-para-clinicas",
      qualification_step: 4,
      pending_reply_count: 2,
      dismiss_reason: "user_resumed",
      message_length: 42,
      previous_messages: 6,
      message: "Meu telefone é 11999999999",
      trigger_invalid: "anything",
    })).toEqual({
      trigger: "form_idle",
      chat_state: "closed",
      pathname: "/ia-para-clinicas",
      qualification_step: 4,
      pending_reply_count: 2,
      dismiss_reason: "user_resumed",
      message_length: 42,
      previous_messages: 6,
    });
  });
  it("rejects malformed IDs and out-of-contract engagement values", () => {
    expect(cleanAnalyticsParams({
      event_id: "lead@example.test",
      trigger: "free-form-trigger",
      chat_state: "background",
      pathname: "https://example.test/private",
      qualification_step: 99,
      pending_reply_count: 4,
      message_length: -1,
      previous_messages: 1.5,
    })).toEqual({});
    expect(cleanAnalyticsParams({ event_id: "123e4567-e89b-12d3-a456-426614174000" }))
      .toEqual({ event_id: "123e4567-e89b-12d3-a456-426614174000" });
  });
  it("drops malformed or high-cardinality editorial dimensions", () => {
    expect(cleanAnalyticsParams({
      article_slug: "../../ana@example.test",
      content_cluster: "cluster:ia comercial",
      content_intent: "whatever-the-browser-sent",
      content_group: "article-title",
      cta_id: `cta:${"x".repeat(200)}`,
      cta_location: "free-form-position",
      method: "email",
      content_type: "message",
      item_id: "11999999999",
    })).toEqual({});
  });
  it("queues early events for exactly one configured owner", () => {
    window.dataLayer = [];
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_OWNER", "ga4");
    emitAnalytics("demo_booked", { lead_step: 10 });
    expect(window.dataLayer).toEqual([]);
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_OWNER", "gtm");
    emitAnalytics("demo_booked", { lead_step: 10 });
    expect(window.dataLayer).toEqual([{ event: "demo_booked", lead_step: 10 }]);
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_OWNER", "off");
    emitAnalytics("demo_booked");
    expect(window.dataLayer).toHaveLength(1);
  });
});
