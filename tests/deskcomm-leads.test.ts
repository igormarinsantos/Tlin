import { afterEach, describe, expect, it, vi } from "vitest";
import { captureDeskcommLead } from "../lib/deskcomm-leads";
const mcp = vi.hoisted(() => vi.fn());
vi.mock("@/lib/deskcomm-mcp", () => ({ callDeskcommTool: mcp }));

const originalWebhookUrl = process.env.DESKCOMM_WEBHOOK_URL;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalWebhookUrl) process.env.DESKCOMM_WEBHOOK_URL = originalWebhookUrl;
  else delete process.env.DESKCOMM_WEBHOOK_URL;
});

describe("captureDeskcommLead", () => {
  it("keeps the webhook server-side and forwards only commercial lead data", async () => {
    process.env.DESKCOMM_WEBHOOK_URL = "https://crm.example.test/webhook";
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"data":{"lead_id":"crm-lead"}}', { status: 201 }));
    mcp.mockResolvedValueOnce({ ok: true, data: { lead: { contact_id: "crm-contact", custom_fields: { human_note: "Keep" } } } }).mockResolvedValueOnce({ ok: true, data: {} });
    vi.stubGlobal("fetch", fetchMock);

    const result = await captureDeskcommLead({
      leadCaptureId: "capture-123",
      name: "Ana Silva",
      phone: "+5511999999999",
      email: "ana@example.com",
      leadScore: 8,
      leadQuality: "high",
      status: "novo",
      utm: { utm_source: "meta", utm_campaign: "demo" },
    });

    expect(result).toMatchObject({ ok: true, leadId: "crm-lead", contactId: "crm-contact", metadataSynced: true });
    expect(mcp).toHaveBeenLastCalledWith("crm_update_lead", expect.objectContaining({ custom_fields: expect.objectContaining({ human_note: "Keep", email: "ana@example.com" }) }));
    expect(fetchMock).toHaveBeenCalledWith(
      "https://crm.example.test/webhook",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "Idempotency-Key": "capture-123",
        }),
      }),
    );

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(request.body))).toEqual({
      external_id: "capture-123",
      nome: "Ana Silva",
      telefone: "+5511999999999",
      email: "ana@example.com",
      lead_capture_id: "capture-123",
      lead_score: 8,
      lead_quality: "high",
      status_lp: "novo",
      utm_source: "meta", utm_campaign: "demo",
    });
  });

  it("does not attempt a request without a configured webhook", async () => {
    delete process.env.DESKCOMM_WEBHOOK_URL;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      captureDeskcommLead({ leadCaptureId: "capture-123", name: "Ana", phone: "+5511999999999" }),
    ).resolves.toEqual({ ok: false, error: "Deskcomm webhook is not configured." });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not count a malformed success response as a captured lead", async () => {
    process.env.DESKCOMM_WEBHOOK_URL = "https://crm.example.test/webhook";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ received: true })));
    expect(await captureDeskcommLead({ leadCaptureId: "one", name: "Ana", phone: "+5511999999999" })).toMatchObject({ ok: false });
  });

  it("forwards only allowlisted scalar editorial attribution", async () => {
    process.env.DESKCOMM_WEBHOOK_URL = "https://crm.example.test/webhook";
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"data":{"lead_id":"crm-lead"}}', { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await captureDeskcommLead({
      leadCaptureId: "capture-editorial",
      name: "Ana Silva",
      phone: "+5511999999999",
      utm: {
        first_utm_source: "google",
        first_article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
        first_content_cluster: "cluster:ia-comercial",
        first_content_intent: "informational",
        last_article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
        last_content_cluster: "cluster:ia-comercial",
        last_content_intent: "informational",
        last_cta_id: "cta:demo",
        first_utm_term: "ana@example.test",
        turnstileToken: "must-not-leave-server",
        nested: { injected: true },
      },
    });

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(request.body))).toMatchObject({
      external_id: "capture-editorial",
      first_utm_source: "google",
      first_article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      first_content_cluster: "cluster:ia-comercial",
      first_content_intent: "informational",
      last_article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      last_content_cluster: "cluster:ia-comercial",
      last_content_intent: "informational",
      last_cta_id: "cta:demo",
    });
    expect(JSON.stringify(JSON.parse(String(request.body))))
      .not.toMatch(/ana@example\.test|turnstile|must-not-leave-server|nested|injected/);
  });
});
