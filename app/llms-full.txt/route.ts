import { editorialAuthors } from "@/content/editorial/authors";
import { createLlmsFull } from "@/lib/editorial/llms";
import { getPublishedArticles, getPublishedClusters } from "@/lib/editorial/queries";

export const dynamic = "force-static";

export function GET() {
  return new Response(
    createLlmsFull(getPublishedArticles(), getPublishedClusters(), editorialAuthors),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
