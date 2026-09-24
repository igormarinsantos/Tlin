// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EditorialCta } from "@/components/blog/EditorialCta";
import { ShareBar } from "@/components/blog/ShareBar";
import { QualificationController } from "@/components/QualificationController";
import {
  captureEditorialTouch,
  getEditorialEventPayload,
  getEditorialLeadPayload,
} from "@/lib/editorial/analytics";
import { captureUtms, getUtmLeadPayload } from "@/lib/utm";

vi.mock("next/dynamic", () => ({
  default: () => function QualificationPopupStub() {
    return null;
  },
}));

const FIRST_EDITORIAL_KEY = "tlin_first_editorial";
const LAST_EDITORIAL_KEY = "tlin_last_editorial";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.useRealTimers();
  window.dataLayer = [];
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

  it("keeps first editorial touch immutable and refreshes only the valid last touch", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-23T15:00:00-03:00"));
    const pathname = "/blog/agentes-de-ia-no-whatsapp-para-vendas";

    const firstVisit = captureEditorialTouch(`${pathname}?email=ana@example.test#private`);
    vi.advanceTimersByTime(60_000);
    const ctaVisit = captureEditorialTouch(pathname, "cta:demo");

    expect(firstVisit).toMatchObject({
      article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      content_cluster: "cluster:ia-comercial",
      content_intent: "informational",
    });
    expect(getEditorialLeadPayload()).toMatchObject({
      first_article_slug: firstVisit?.article_slug,
      first_content_cluster: firstVisit?.content_cluster,
      first_content_intent: firstVisit?.content_intent,
      last_article_slug: ctaVisit?.article_slug,
      last_content_cluster: ctaVisit?.content_cluster,
      last_content_intent: ctaVisit?.content_intent,
      last_cta_id: "cta:demo",
    });
    expect(getEditorialLeadPayload()).not.toHaveProperty("first_cta_id");
    expect(localStorage.getItem(FIRST_EDITORIAL_KEY)).toContain(firstVisit?.captured_at);
    expect(localStorage.getItem(FIRST_EDITORIAL_KEY)).not.toContain("ana@example.test");
  });

  it("rejects unknown, expired, future and malformed editorial state", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-23T15:00:00-03:00"));
    const validPathname = "/blog/agentes-de-ia-no-whatsapp-para-vendas";
    const valid = captureEditorialTouch(validPathname);
    expect(valid).not.toBeNull();

    expect(captureEditorialTouch("/blog/not-in-the-editorial-registry")).toBeNull();
    expect(captureEditorialTouch(validPathname, "cta:not-registered")).toBeNull();
    expect(getEditorialEventPayload()).toMatchObject({ article_slug: valid?.article_slug });

    localStorage.setItem(FIRST_EDITORIAL_KEY, "not-json");
    document.cookie = `${FIRST_EDITORIAL_KEY}=not-json; path=/`;
    localStorage.setItem(LAST_EDITORIAL_KEY, JSON.stringify({
      ...valid,
      captured_at: "2026-08-01T12:00:00-03:00",
    }));
    document.cookie = `${LAST_EDITORIAL_KEY}=${encodeURIComponent(JSON.stringify({
      ...valid,
      captured_at: "2026-08-01T12:00:00-03:00",
    }))}; path=/`;
    expect(getEditorialLeadPayload()).toEqual({});
    expect(localStorage.getItem(FIRST_EDITORIAL_KEY)).toBeNull();
    expect(localStorage.getItem(LAST_EDITORIAL_KEY)).toBeNull();

    localStorage.setItem(LAST_EDITORIAL_KEY, JSON.stringify({
      ...valid,
      captured_at: "2026-09-24T12:00:00-03:00",
    }));
    document.cookie = `${LAST_EDITORIAL_KEY}=${encodeURIComponent(JSON.stringify({
      ...valid,
      captured_at: "2026-09-24T12:00:00-03:00",
    }))}; path=/`;
    expect(getEditorialEventPayload()).toEqual({});
    expect(localStorage.getItem(LAST_EDITORIAL_KEY)).toBeNull();
  });

  it("never fabricates an editorial touch on non-editorial navigation", () => {
    expect(captureEditorialTouch("/precos")).toBeNull();
    expect(captureEditorialTouch("/blog")).toBeNull();
    expect(getEditorialLeadPayload()).toEqual({});
  });

  it("emits a controlled CTA event and carries editorial context into the global funnel", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_OWNER", "gtm");
    const qualificationEvents: CustomEvent[] = [];
    const receiveQualification = (event: Event) => qualificationEvents.push(event as CustomEvent);
    window.addEventListener("open-qualification", receiveQualification);

    render(createElement(QualificationController));
    render(createElement(EditorialCta, {
      articleSlug: "agentes-de-ia-no-whatsapp-para-vendas",
      clusterId: "cluster:ia-comercial",
      intent: "informational",
      cta: { id: "cta:demo", label: "Agendar demonstração", href: "/demo" },
      location: "article-end",
    }));
    fireEvent.click(screen.getByRole("button", { name: "Agendar demonstração" }));

    expect(window.dataLayer).toContainEqual(expect.objectContaining({
      event: "article_cta_click",
      event_category: "lead_funnel",
      article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      content_cluster: "cluster:ia-comercial",
      content_intent: "informational",
      content_group: "editorial",
      cta_id: "cta:demo",
      cta_location: "article-end",
    }));
    expect(window.dataLayer).toContainEqual(expect.objectContaining({
      event: "lead_form_opened",
      article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      content_cluster: "cluster:ia-comercial",
      content_intent: "informational",
      cta_id: "cta:demo",
      cta_location: "article-end",
    }));
    expect(qualificationEvents).toHaveLength(1);
    expect(qualificationEvents[0].detail).toMatchObject({
      articleSlug: "agentes-de-ia-no-whatsapp-para-vendas",
      clusterId: "cluster:ia-comercial",
      intent: "informational",
      ctaId: "cta:demo",
      location: "article-end",
    });
    expect(getEditorialLeadPayload()).toMatchObject({ last_cta_id: "cta:demo" });

    window.removeEventListener("open-qualification", receiveQualification);
  });

  it("emits recommended share fields without title, URL, query or contact data", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_OWNER", "gtm");
    render(createElement(ShareBar, {
      url: "https://tlin.ia.br/blog/agentes-de-ia-no-whatsapp-para-vendas?email=ana@example.test#private",
      title: "Artigo de ana@example.test",
    }));

    fireEvent.click(screen.getByRole("link", { name: "Compartilhar no WhatsApp" }));
    const shareEvent = window.dataLayer.find((entry) =>
      typeof entry === "object" && entry !== null && "event" in entry && entry.event === "share",
    );

    expect(shareEvent).toMatchObject({
      event: "share",
      event_category: "lead_funnel",
      method: "whatsapp",
      content_type: "article",
      item_id: "agentes-de-ia-no-whatsapp-para-vendas",
    });
    expect(JSON.stringify(shareEvent)).not.toMatch(/ana@example\.test|private|title|url|query/i);
    expect(screen.getByRole("link", { name: "Compartilhar no WhatsApp" }).getAttribute("href"))
      .not.toMatch(/email=|#private/);
    expect(screen.getByRole("link", { name: "Compartilhar no LinkedIn" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Compartilhar no X" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copiar link" })).toBeTruthy();
  });
});
