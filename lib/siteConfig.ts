const LEGACY_SITE_URLS = new Set(["https://tlin.cloud", "https://www.tlin.cloud"]);
const LEGACY_APP_URLS = new Set(["https://app.tlin.cloud"]);

function configuredUrl(value: string | undefined, fallback: string, legacyUrls: Set<string>) {
  const normalized = value?.replace(/\/$/, "");
  return normalized && !legacyUrls.has(normalized) ? normalized : fallback;
}

export const siteConfig = {
  name: "tlin.ai",
  url: configuredUrl(process.env.NEXT_PUBLIC_SITE_URL, "https://tlin.ia.br", LEGACY_SITE_URLS),
  appUrl: configuredUrl(process.env.NEXT_PUBLIC_APP_URL, "https://app.tlin.ia.br", LEGACY_APP_URLS),
  locale: "pt_BR",
  title: "tlin.ai | IA Comercial com CRM, Follow-up e Agendamento",
  description:
    "IA comercial que atende, qualifica e vende no WhatsApp — com CRM, follow-up automático e agendamento nativos, prontos pra escalar seu comercial 24/7.",
};

export function absoluteUrl(path = "/") {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export function absoluteAppUrl(path = "/") {
  const baseUrl = siteConfig.appUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}
