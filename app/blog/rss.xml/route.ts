import { serializeRssFeed } from "@/lib/editorial/feed";
import { getPublishedArticles } from "@/lib/editorial/queries";

export function GET() {
  const xml = serializeRssFeed(getPublishedArticles());
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
