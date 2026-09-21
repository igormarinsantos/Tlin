import { createSegmentMetadata, SegmentLandingStructuredData } from "@/lib/segmentLandingSeo";

export const metadata = createSegmentMetadata("advocacia");

export default function IaParaAdvocaciaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SegmentLandingStructuredData segment="advocacia" />
      {children}
    </>
  );
}
