import { afterEach, describe, expect, it, vi } from "vitest";
import { captureDeskcommLead } from "../lib/deskcomm-leads";

const originalWebhookUrl = process.env.DESKCOMM_WEBHOOK_URL;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalWebhookUrl) process.env.DESKCOMM_WEBHOOK_URL = originalWebhookUrl;
  else delete process.env.DESKCOMM_WEBHOOK_URL;
});

describe("captureDeskcommLead", () => {
  it("keeps the webhook server-side and forwards only commercial lead data", async () => {
    process.env.DESKCOMM_WEBHOOK_URL = "https://crm.example.test/webhook";
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"received":true}', { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await captureDeskcommLead({
      leadCaptureId: "capture-123",
      name: "Ana Silva",
      phone: "+5511999999999",
      email: "ana@example.com",
      leadScore: 8,
      leadQuality: "qualified",
      status: "novo",
      utm: { utm_source: "meta", utm_campaign: "demo" },
    });

    expect(result).toEqual({ ok: true, data: { received: true } });
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
      nome: "Ana Silva",
      telefone: "+5511999999999",
      email: "ana@example.com",
      lead_capture_id: "capture-123",
      lead_score: 8,
      lead_quality: "qualified",
      status_lp: "novo",
      utm: { utm_source: "meta", utm_campaign: "demo" },
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
});
