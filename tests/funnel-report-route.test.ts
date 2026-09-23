import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../app/api/internal/funnel/route";
const rpc = vi.hoisted(() => vi.fn());
vi.mock("@/lib/funnel-store", () => ({ funnelRpc: rpc }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: () => ({ allowed: true }) }));
afterEach(() => vi.unstubAllEnvs());
const token = "test-only-report-key-32-characters-long";
function request(auth = token, from = "2026-09-01", to = "2026-09-18") {
  vi.stubEnv("FUNNEL_REPORT_TOKEN", token);
  return new NextRequest(`http://localhost/api/internal/funnel?from=${from}&to=${to}`, { headers: { Authorization: `Bearer ${auth}` } });
}
it("requires authentication before querying data", async () => {
  expect((await GET(request("wrong"))).status).toBe(401);
  expect(rpc).not.toHaveBeenCalled();
});
it("rejects invalid dates and excessive ranges", async () => {
  expect((await GET(request(token, "2026-02-30"))).status).toBe(400);
  expect((await GET(request(token, "2020-01-01"))).status).toBe(400);
  expect(rpc).not.toHaveBeenCalled();
});
it("returns aggregates without caching and makes outages explicit", async () => {
  rpc.mockResolvedValue({ campaigns: [], pending_operations: 0, unmatched_events: 0, mapped_stages: 4 });
  const response = await GET(request());
  expect(response.status).toBe(200); expect(response.headers.get("cache-control")).toBe("no-store");
  expect(rpc).toHaveBeenCalledWith("read_funnel_report", { p_from: "2026-09-01", p_to: "2026-09-18" });
  rpc.mockRejectedValue(new Error("offline")); expect((await GET(request())).status).toBe(503);
});

it("returns only allowlisted campaign and editorial aggregates", async () => {
  rpc.mockResolvedValue({
    campaigns: [{
      source: "google",
      campaign: "ia-comercial",
      leads: 4,
      demos: 3,
      qualified_demos: 2,
      attended_demos: 1,
      won: 1,
      awaiting_qualification: 1,
      email: "private@example.com",
    }],
    content: [{
      touch: "first",
      article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      content_cluster: "cluster:ia-comercial",
      cta_id: "cta:demo",
      leads: 4,
      demos: 3,
      qualified_demos: 2,
      won: 1,
      phone: "+5511999999999",
      payload: { raw: true },
    }],
    pending_operations: 0,
    unmatched_events: 0,
    mapped_stages: 4,
    individual_lead: { name: "Private person" },
  });

  const response = await GET(request());
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    campaigns: [{
      source: "google",
      campaign: "ia-comercial",
      leads: 4,
      demos: 3,
      qualified_demos: 2,
      attended_demos: 1,
      won: 1,
      awaiting_qualification: 1,
    }],
    content: [{
      touch: "first",
      article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
      content_cluster: "cluster:ia-comercial",
      cta_id: "cta:demo",
      leads: 4,
      demos: 3,
      qualified_demos: 2,
      won: 1,
    }],
    pending_operations: 0,
    unmatched_events: 0,
    mapped_stages: 4,
  });
});
