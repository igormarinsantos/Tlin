export const siteConfig = {
  name: "Tlin.ai",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tlin.cloud",
  locale: "pt_BR",
  title: "Tlin.ai | Agência de Inteligência Artificial e Automação de Vendas",
  description:
    "A Tlin.ai cria agentes de IA autônomos treinados para converter leads, qualificar clientes e escalar seu comercial 24/7.",
};

export function absoluteUrl(path = "/") {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}
