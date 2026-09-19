"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { trackFunnelEvent } from "@/lib/utm";

const LeadQualificationPopup = dynamic(() => import("./LeadQualificationPopup").then(mod => mod.LeadQualificationPopup), { ssr: false });

/** One listener for every route with site navigation. SiteChrome keys it by route. */
export function QualificationController() {
  const [plan, setPlan] = useState<string | null>(null);
  const openRef = useRef(false);

  useEffect(() => {
    const open = (event: Event) => {
      if (openRef.current) return;
      const detail = (event as CustomEvent<{ plan?: string; source?: string }>).detail;
      const nextPlan = typeof detail?.plan === "string" ? detail.plan || "TLIN" : "TLIN";
      openRef.current = true;
      setPlan(nextPlan);
      trackFunnelEvent("lead_form_opened", {
        plan_name: nextPlan,
        cta_source: typeof detail?.source === "string" ? detail.source : "unknown",
      });
    };
    window.addEventListener("open-qualification", open);
    return () => window.removeEventListener("open-qualification", open);
  }, []);

  return <div className="no-blur">{plan && <LeadQualificationPopup isOpen planName={plan} onClose={() => {
    openRef.current = false;
    setPlan(null);
  }} />}</div>;
}
