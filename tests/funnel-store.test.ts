import { afterEach, expect, it, vi } from "vitest";
import { runOnce } from "../lib/funnel-store";
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
function configured(...responses: unknown[]) {
  vi.stubEnv("SUPABASE_URL", "https://database.example.test"); vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-key");
  const fetchMock = vi.fn(); responses.forEach(body => fetchMock.mockResolvedValueOnce(Response.json(body))); vi.stubGlobal("fetch", fetchMock); return fetchMock;
}
it("does not execute an external effect without the durable coordinator", async () => {
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", ""); const execute = vi.fn();
  expect(await runOnce("one", execute)).toEqual({ state: "unavailable" }); expect(execute).not.toHaveBeenCalled();
});
it("replays confirmed effects and blocks pending effects", async () => {
  configured({ state: "done", result: { booked: true } }, { state: "pending" }); const execute = vi.fn();
  expect(await runOnce("one", execute)).toMatchObject({ state: "done", replayed: true });
  expect(await runOnce("one", execute)).toEqual({ state: "pending" }); expect(execute).not.toHaveBeenCalled();
});
it("keeps uncertainty durable when the external request throws", async () => {
  const fetchMock = configured({ state: "claimed" });
  expect(await runOnce("one", async () => { throw new Error("timeout"); })).toEqual({ state: "pending" });
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
it("preserves a confirmed external result when saving its receipt fails", async () => {
  const fetchMock = configured({ state: "claimed" });
  fetchMock.mockRejectedValueOnce(new Error("database temporarily unavailable"));
  expect(await runOnce("one", async () => ({ result: { booked: true }, definitive: true }))).toMatchObject({ state: "done", result: { booked: true } });
});
