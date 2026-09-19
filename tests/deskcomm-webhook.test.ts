import { createHmac } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../app/api/webhooks/deskcomm/route";
const project = vi.hoisted(() => vi.fn());
vi.mock("@/lib/supabase-leads", () => ({ projectDeskcommStatusEvent: project }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: () => ({ allowed: true }), requestIsTooLarge: () => false }));
afterEach(() => vi.unstubAllEnvs());
const event = { event: "lead.stage_changed", event_id: "event-1", occurred_at: "2026-09-17T12:00:00Z", data: { to_stage_id: "qualified", lead: { id: "crm-one", custom_fields: { lead_capture_id: "capture-one" } } } };
function request(body = event, signature?: string) {
  vi.stubEnv("DESKCOMM_STATUS_WEBHOOK_SECRET", "test-secret"); const raw = JSON.stringify(body);
  return new NextRequest("http://localhost/api/webhooks/deskcomm", { method: "POST", body: raw, headers: { "x-deskcomm-signature": signature ?? createHmac("sha256", "test-secret").update(raw).digest("hex") } });
}
it("rejects invalid signatures before persistence", async () => {
  expect((await POST(request(event, "wrong"))).status).toBe(401); expect(project).not.toHaveBeenCalled();
});
it("reads native correlation, reports duplicates and acknowledges only durable receipt", async () => {
  project.mockResolvedValue({ saved: true, duplicate: true, projected: true });
  expect(await (await POST(request())).json()).toMatchObject({ received: true, duplicate: true });
  expect(project).toHaveBeenCalledWith(expect.objectContaining({ eventId: "deskcomm:event-1", leadCaptureId: "capture-one", leadId: "crm-one" }));
  project.mockResolvedValue({ saved: false });
  expect((await POST(request())).status).toBe(503);
});
