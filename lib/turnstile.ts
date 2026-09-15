import { NextRequest } from "next/server";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_ACTION = "lead-qualification";

type TurnstileVerification = { success?: boolean; action?: string };

/** Validates a Turnstile token when the server secret is configured. */
export async function verifyTurnstileToken(token: unknown, request: NextRequest): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Allows the same deploy to work before the production keys are provisioned.
  if (!secret) return true;
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const formData = new URLSearchParams({ secret, response: token });
    const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (remoteIp) formData.set("remoteip", remoteIp);

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    if (!response.ok) return false;

    const result = (await response.json()) as TurnstileVerification;
    return result.success === true && result.action === TURNSTILE_ACTION;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
