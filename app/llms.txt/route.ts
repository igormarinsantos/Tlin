import { createLlmsIndex } from "@/lib/editorial/llms";
import { getPublishedArticles, getPublishedClusters } from "@/lib/editorial/queries";

export const dynamic = "force-static";

export function GET() {
  return new Response(createLlmsIndex(getPublishedArticles(), getPublishedClusters()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
