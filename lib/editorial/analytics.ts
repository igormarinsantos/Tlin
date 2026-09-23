import { getPublishedArticleBySlug } from "@/lib/editorial/queries";
import type { CtaId, SearchIntent } from "@/lib/editorial/types";

export type EditorialTouch = {
  article_slug: string;
  content_cluster: string;
  content_intent: SearchIntent;
  cta_id?: CtaId;
  captured_at: string;
};

const FIRST_EDITORIAL_KEY = "tlin_first_editorial";
const LAST_EDITORIAL_KEY = "tlin_last_editorial";
const EDITORIAL_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function setCookie(name: string, value: string, maxAge = EDITORIAL_MAX_AGE_SECONDS) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  try {
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function clearStoredTouch(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage can be unavailable in hardened browser contexts.
  }
  setCookie(key, "", 0);
}

function validateTouch(value: unknown): EditorialTouch | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<EditorialTouch>;
  const capturedAt = Date.parse(typeof candidate.captured_at === "string" ? candidate.captured_at : "");
  if (
    !Number.isFinite(capturedAt)
    || capturedAt > Date.now()
    || Date.now() - capturedAt > EDITORIAL_MAX_AGE_SECONDS * 1000
    || typeof candidate.article_slug !== "string"
  ) {
    return null;
  }

  const article = getPublishedArticleBySlug(candidate.article_slug);
  if (
    !article
    || candidate.content_cluster !== article.clusterId
    || candidate.content_intent !== article.intent
    || (candidate.cta_id !== undefined && candidate.cta_id !== article.cta.id)
  ) {
    return null;
  }

  return {
    article_slug: article.slug,
    content_cluster: article.clusterId,
    content_intent: article.intent,
    ...(candidate.cta_id ? { cta_id: candidate.cta_id } : {}),
    captured_at: new Date(capturedAt).toISOString(),
  };
}

function loadStoredTouch(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const touch = validateTouch(JSON.parse(raw));
      if (touch) return touch;
      localStorage.removeItem(key);
    }
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage can be unavailable in hardened browser contexts.
    }
  }

  const cookie = getCookie(key);
  if (!cookie) return null;
  try {
    const touch = validateTouch(JSON.parse(cookie));
    if (touch) return touch;
  } catch {
    // Invalid browser state is discarded below.
  }
  clearStoredTouch(key);
  return null;
}

function saveStoredTouch(key: string, touch: EditorialTouch) {
  const json = JSON.stringify(touch);
  try {
    localStorage.setItem(key, json);
  } catch {
    // Cookie remains the redundant persistence layer.
  }
  setCookie(key, json);
}

function articleSlugFromPathname(pathname: string) {
  try {
    const url = new URL(pathname, "https://tlin.ia.br");
    const match = url.pathname.match(/^\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function captureEditorialTouch(pathname: string, ctaId?: string): EditorialTouch | null {
  if (typeof window === "undefined") return null;
  const slug = articleSlugFromPathname(pathname);
  const article = slug ? getPublishedArticleBySlug(slug) : undefined;
  if (!article || (ctaId !== undefined && ctaId !== article.cta.id)) return null;

  const touch: EditorialTouch = {
    article_slug: article.slug,
    content_cluster: article.clusterId,
    content_intent: article.intent,
    ...(ctaId ? { cta_id: article.cta.id } : {}),
    captured_at: new Date().toISOString(),
  };

  if (!loadStoredTouch(FIRST_EDITORIAL_KEY)) {
    saveStoredTouch(FIRST_EDITORIAL_KEY, touch);
  }
  saveStoredTouch(LAST_EDITORIAL_KEY, touch);
  return touch;
}

export function getEditorialEventPayload(value?: unknown) {
  const touch = value === undefined ? loadStoredTouch(LAST_EDITORIAL_KEY) : validateTouch(value);
  if (!touch) return {};
  return {
    article_slug: touch.article_slug,
    content_cluster: touch.content_cluster,
    content_intent: touch.content_intent,
    ...(touch.cta_id ? { cta_id: touch.cta_id } : {}),
  };
}

export function getEditorialLeadPayload() {
  const first = loadStoredTouch(FIRST_EDITORIAL_KEY);
  const last = loadStoredTouch(LAST_EDITORIAL_KEY);
  return {
    ...(first ? {
      first_article_slug: first.article_slug,
      first_content_cluster: first.content_cluster,
      first_content_intent: first.content_intent,
      ...(first.cta_id ? { first_cta_id: first.cta_id } : {}),
    } : {}),
    ...(last ? {
      last_article_slug: last.article_slug,
      last_content_cluster: last.content_cluster,
      last_content_intent: last.content_intent,
      ...(last.cta_id ? { last_cta_id: last.cta_id } : {}),
    } : {}),
  };
}
