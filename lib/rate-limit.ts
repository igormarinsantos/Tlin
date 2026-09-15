import { NextRequest, NextResponse } from "next/server";

type RateLimitEntry = { count: number; resetAt: number };

const entries = new Map<string, RateLimitEntry>();
const MAX_TRACKED_CLIENTS = 10_000;

function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

/**
 * Limite local para impedir abuso imediato dos handlers públicos.
 * A Vercel pode executar mais de uma instância, portanto este não substitui
 * uma regra distribuída na borda para proteção global.
 */
export function checkRateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();

  if (entries.size > MAX_TRACKED_CLIENTS) {
    for (const [key, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(key);
    }
  }

  const key = `${scope}:${clientIp(request)}`;
  const existing = entries.get(key);
  const entry = !existing || existing.resetAt <= now
    ? { count: 1, resetAt: now + windowMs }
    : { ...existing, count: existing.count + 1 };

  entries.set(key, entry);

  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export function rateLimitedResponse(retryAfter: number) {
  return NextResponse.json(
    { error: "Muitas tentativas. Aguarde um momento e tente novamente." },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfter),
      },
    },
  );
}

export function requestIsTooLarge(request: NextRequest, maxBytes: number) {
  const contentLength = Number(request.headers.get("content-length") || "0");
  return Number.isFinite(contentLength) && contentLength > maxBytes;
}
