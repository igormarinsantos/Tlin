import { createSegmentMetadata, SegmentLandingStructuredData } from "@/lib/segmentLandingSeo";

export const metadata = createSegmentMetadata("assessorias");

export default function IaParaAssessoriasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SegmentLandingStructuredData segment="assessorias" />
      {children}
    </>
  );
}
