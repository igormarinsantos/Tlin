import { createHash, randomUUID } from "node:crypto";

export function operationKey(kind: string, identity: string) {
  return `${kind}:${createHash("sha256").update(identity).digest("hex")}`;
}

/** Service-role only. An unavailable coordinator must never permit an unguarded write. */
export async function funnelRpc<T>(name: string, params: Record<string, unknown>): Promise<T> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Funnel database is not configured");
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(8_000),
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error(`Funnel database returned ${response.status}`);
  return response.json() as Promise<T>;
}

export type OnceResult<T> = { state: "done"; result: T; replayed: boolean } | { state: "pending" | "unavailable" };

/** No TTL takeover: a timed-out external write might already have succeeded. */
export async function runOnce<T>(key: string, execute: () => Promise<{ result: T; definitive: boolean; retryable?: boolean }>): Promise<OnceResult<T>> {
  const owner = randomUUID();
  let claim: { state: "claimed" | "pending" | "done"; result?: T };
  try { claim = await funnelRpc("claim_funnel_operation", { p_key: key, p_owner: owner }); }
  catch { return { state: "unavailable" }; }
  if (claim.state === "done") return { state: "done", result: claim.result!, replayed: true };
  if (claim.state !== "claimed") return { state: "pending" };
  try {
    const outcome = await execute();
    if (outcome.definitive) {
      try { await funnelRpc("finish_funnel_operation", { p_key: key, p_owner: owner, p_result: outcome.result, p_retryable: outcome.retryable === true }); }
      catch { /* Keep the lock, but do not turn an explicit external confirmation into uncertainty. */ }
    }
    return { state: "done", result: outcome.result, replayed: false };
  } catch {
    // Keep the durable pending row. Never repeat an uncertain external effect.
    return { state: "pending" };
  }
}
