import { describe, expect, it } from "vitest";
import {
  createSegmentMetadata,
  createSegmentStructuredData,
  segmentLandingSeo,
  type SegmentLandingKey,
} from "@/lib/segmentLandingSeo";

const segments = Object.keys(segmentLandingSeo) as SegmentLandingKey[];

describe("segment landing SEO", () => {
  it("keeps every title concise and every canonical unique", () => {
    const canonicals = segments.map((segment) => {
      const metadata = createSegmentMetadata(segment);
      expect(String(metadata.title).length).toBeLessThanOrEqual(60);
      expect(String(metadata.description).length).toBeGreaterThanOrEqual(120);
      expect(metadata.openGraph?.images).toBeTruthy();
      expect(metadata.twitter?.images).toBeTruthy();
      return String(metadata.alternates?.canonical);
    });

    expect(new Set(canonicals).size).toBe(segments.length);
  });

  it("describes each page as a WebPage, Service and BreadcrumbList", () => {
    for (const segment of segments) {
      const schema = createSegmentStructuredData(segment);
      expect(schema["@graph"].map((entity) => entity["@type"])).toEqual([
        "WebPage",
        "Service",
        "BreadcrumbList",
      ]);
      expect(JSON.stringify(schema)).toContain(segmentLandingSeo[segment].path);
    }
  });
});
