import type { Metadata } from "next";
import { FunnelReport } from "@/components/FunnelReport";

export const metadata: Metadata = { title: "Funil comercial | tlin.ai", robots: { index: false, follow: false } };
export default function FunnelReportPage() { return <FunnelReport />; }
