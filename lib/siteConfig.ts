export const siteConfig = {
  name: "tlin.ai",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tlin.cloud",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://app.tlin.cloud",
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
