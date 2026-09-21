import { createSegmentMetadata, SegmentLandingStructuredData } from "@/lib/segmentLandingSeo";

export const metadata = createSegmentMetadata("escolas");

export default function IaParaEscolasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SegmentLandingStructuredData segment="escolas" />
      {children}
    </>
  );
}
