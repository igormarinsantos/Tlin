import { BLOG_ARTICLES } from "@/lib/blog";
import { absoluteUrl } from "@/lib/siteConfig";

export function GET() {
  const items = BLOG_ARTICLES.map((article) => `<item><title><![CDATA[${article.title}]]></title><link>${absoluteUrl(`/blog/${article.slug}`)}</link><guid>${absoluteUrl(`/blog/${article.slug}`)}</guid><description><![CDATA[${article.description}]]></description><pubDate>${new Date(`${article.publishedAt}T12:00:00`).toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>tlin.ai | IA, vendas e WhatsApp</title><link>${absoluteUrl("/blog")}</link><description>Inteligência artificial aplicada ao crescimento de negócios.</description><language>pt-BR</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
