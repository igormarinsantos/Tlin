import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { editorialClusters } from "@/content/editorial/taxonomy";
import { getPublishedArticleBySlug } from "@/lib/editorial/queries";
import { ARTICLE_SOCIAL_IMAGE_SIZE } from "@/lib/editorial/structured-data";

export const alt = "Capa editorial da tlin.ai";
export const size = ARTICLE_SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

type OpenGraphImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const cluster = editorialClusters[article.clusterId];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0d0d",
          color: "#ffffff",
          padding: "72px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 620,
            height: 620,
            borderRadius: 620,
            right: -210,
            top: -280,
            background: "linear-gradient(135deg, #B597FF, #38E3FF)",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            fontWeight: 700,
            position: "relative",
          }}
        >
          <span>tlin.ai</span>
          <span style={{ color: "#38E3FF" }}>{cluster.label}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 980,
            position: "relative",
          }}
        >
          <div style={{ fontSize: 60, lineHeight: 1.08, fontWeight: 900 }}>
            {article.title}
          </div>
          <div style={{ fontSize: 27, lineHeight: 1.35, color: "#d4d4d8" }}>
            {article.summary}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 300,
            height: 8,
            borderRadius: 8,
            background: "linear-gradient(90deg, #B597FF, #38E3FF)",
            position: "relative",
          }}
        />
      </div>
    ),
    size,
  );
}
