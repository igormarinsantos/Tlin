// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { captureUtms, getUtmLeadPayload } from "@/lib/utm";

const FIRST_EDITORIAL_KEY = "tlin_first_editorial";
const LAST_EDITORIAL_KEY = "tlin_last_editorial";

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  for (const key of [
    "tlin_first_utm",
    "tlin_last_utm",
    FIRST_EDITORIAL_KEY,
    LAST_EDITORIAL_KEY,
  ]) {
    document.cookie = `${key}=; max-age=0; path=/`;
  }
});

describe("editorial analytics attribution", () => {
  it("projects valid editorial first and last touch alongside acquisition fields", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-23T15:00:00-03:00"));
    const first = {
      article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      content_cluster: "cluster:ia-comercial",
      content_intent: "informational",
      captured_at: "2026-09-22T15:00:00-03:00",
    };
    const last = {
      ...first,
      cta_id: "cta:demo",
      captured_at: "2026-09-23T14:00:00-03:00",
    };

    localStorage.setItem(FIRST_EDITORIAL_KEY, JSON.stringify(first));
    localStorage.setItem(LAST_EDITORIAL_KEY, JSON.stringify(last));
    captureUtms("?utm_source=google&utm_medium=organic&utm_campaign=ia-comercial");

    expect(getUtmLeadPayload()).toMatchObject({
      first_utm_source: "google",
      first_utm_campaign: "ia-comercial",
      first_article_slug: first.article_slug,
      first_content_cluster: first.content_cluster,
      first_content_intent: first.content_intent,
      last_article_slug: last.article_slug,
      last_content_cluster: last.content_cluster,
      last_content_intent: last.content_intent,
      last_cta_id: last.cta_id,
    });
  });
});
