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
  title: "tlin.ai | Agência de Inteligência Artificial e Automação de Vendas",
  description:
    "A tlin.ai cria agentes de IA autônomos treinados para converter leads, qualificar clientes e escalar seu comercial 24/7.",
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
