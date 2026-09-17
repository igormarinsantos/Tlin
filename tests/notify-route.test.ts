import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../app/api/notify/route";
import { POST as capturePost } from "../app/api/leads/capture/route";

const mocks = vi.hoisted(() => ({ capture: vi.fn(), search: vi.fn(), book: vi.fn(), save: vi.fn(), update: vi.fn(), verify: vi.fn(), mail: vi.fn() }));
vi.mock("@/lib/deskcomm-leads", () => ({ captureDeskcommLead: mocks.capture }));
vi.mock("@/lib/deskcomm-mcp", () => ({ bookAppointment: mocks.book, searchContactByPhone: mocks.search }));
vi.mock("@/lib/supabase-leads", () => ({ saveLeadSubmission: mocks.save, updateLeadSubmissionNotification: mocks.update }));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstileToken: mocks.verify }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: () => ({ allowed: true }), requestIsTooLarge: () => false }));
vi.mock("nodemailer", () => ({ default: { createTransport: () => ({ sendMail: mocks.mail }) } }));

function request(overrides: Record<string, unknown> = {}) {
  return new NextRequest("http://localhost/api/notify", { method: "POST", body: JSON.stringify({
    name: "Ana", phone: "11999999999", countryCode: "+55", email: "ana@example.test", leadCaptureId: "test-request",
    demoSlot: { starts_at: "2099-01-01T12:00:00Z" }, turnstileToken: "test-token", ...overrides,
  }) });
}

beforeEach(() => {
  mocks.capture.mockResolvedValue({ ok: true, data: {} });
  mocks.search.mockResolvedValue({ ok: true, data: { contacts: [{ id: "contact", phone: "+5511999999999" }] } });
  mocks.book.mockResolvedValue({ ok: true, data: { marcado: true } });
  mocks.save.mockResolvedValue({ saved: true, row: { id: "mirror" } });
  mocks.update.mockResolvedValue(undefined);
  mocks.verify.mockResolvedValue(true);
  mocks.mail.mockResolvedValue({ response: "test" });
});
afterEach(() => vi.unstubAllEnvs());

describe("demo endpoint with simulated services", () => {
  it("confirms only an explicitly booked appointment", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, leadCaptureId: "test-request", demoBooking: { booked: true } });
    expect(mocks.book).toHaveBeenCalledTimes(1);
    expect(mocks.capture).toHaveBeenCalledWith(expect.objectContaining({ leadCaptureId: "test-request", email: "ana@example.test" }));
  });

  it("does not book or announce success when capture fails", async () => {
    mocks.capture.mockResolvedValue({ ok: false, error: "Unavailable" });
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ success: false, demoBooking: { attempted: false, booked: false } });
    expect(mocks.book).not.toHaveBeenCalled();
  });

  it("distinguishes a refused slot from an uncertain transport result", async () => {
    mocks.book.mockResolvedValueOnce({ ok: true, data: { marcado: false, motivo: "occupied" } });
    expect(await (await POST(request())).json()).toMatchObject({ success: false, demoBooking: { slotUnavailable: true } });
    mocks.book.mockResolvedValueOnce({ ok: false, error: "Timeout" });
    expect(await (await POST(request())).json()).toMatchObject({ success: false, demoBooking: { pendingConfirmation: true } });
  });

  it("preserves a confirmed booking when a secondary update throws", async () => {
    mocks.update.mockRejectedValue(new Error("Mirror unavailable"));
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, demoBooking: { booked: true } });
  });

  it("preserves the booking even when SMTP fails", async () => {
    vi.stubEnv("SMTP_USER", "test-only");
    vi.stubEnv("SMTP_PASS", "test-only");
    mocks.mail.mockRejectedValue(new Error("Simulated SMTP failure"));
    const response = await POST(request());
    expect(await response.json()).toMatchObject({ success: true, emailSent: false, demoBooking: { booked: true } });
  });

  it("selects the exact phone instead of an unrelated first search result", async () => {
    mocks.search.mockResolvedValue({ ok: true, data: { contacts: [
      { id: "wrong-contact", phone: "+5511888888888" },
      { id: "exact-contact", phone: "+55 (11) 99999-9999" },
    ] } });
    await POST(request());
    expect(mocks.book).toHaveBeenCalledWith(expect.objectContaining({ contactId: "exact-contact" }));
  });

  it("does not treat malformed booking payloads as success or a safe retry", async () => {
    mocks.book.mockResolvedValue({ ok: true, data: {} });
    expect(await (await POST(request())).json()).toMatchObject({ success: false, demoBooking: { pendingConfirmation: true } });
  });

  it("rejects missing/past slots and failed security before external writes", async () => {
    expect((await POST(request({ demoSlot: undefined }))).status).toBe(400);
    expect((await POST(request({ demoSlot: { starts_at: "2020-01-01" } }))).status).toBe(400);
    mocks.verify.mockResolvedValue(false);
    expect((await POST(request())).status).toBe(403);
    expect(mocks.capture).not.toHaveBeenCalled();
    expect(mocks.book).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON at both form endpoints", async () => {
    const malformed = () => new NextRequest("http://localhost/api/notify", { method: "POST", body: "{" });
    expect((await POST(malformed())).status).toBe(400);
    expect((await capturePost(malformed())).status).toBe(400);
    expect(mocks.capture).not.toHaveBeenCalled();
  });
});
