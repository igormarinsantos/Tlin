import { createSegmentMetadata, SegmentLandingStructuredData } from "@/lib/segmentLandingSeo";

export const metadata = createSegmentMetadata("clinicas");

export default function IaParaClinicasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SegmentLandingStructuredData segment="clinicas" />
      {children}
    </>
  );
}
