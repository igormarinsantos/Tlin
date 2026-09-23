"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  captureEditorialTouch,
  getEditorialEventPayload,
} from "@/lib/editorial/analytics";
import type { SearchIntent } from "@/lib/editorial/types";
import { trackFunnelEvent } from "@/lib/utm";

const LeadQualificationPopup = dynamic(() => import("./LeadQualificationPopup").then(mod => mod.LeadQualificationPopup), { ssr: false });

type QualificationOpenDetail = {
  plan?: string;
  source?: string;
  articleSlug?: string;
  clusterId?: string;
  intent?: SearchIntent;
  ctaId?: string;
  location?: string;
};

/** One listener for every route with site navigation. SiteChrome keys it by route. */
export function QualificationController() {
  const [plan, setPlan] = useState<string | null>(null);
  const openRef = useRef(false);

  useEffect(() => {
    const open = (event: Event) => {
      if (openRef.current) return;
      const detail = (event as CustomEvent<QualificationOpenDetail>).detail;
      const nextPlan = typeof detail?.plan === "string" ? detail.plan || "TLIN" : "TLIN";
      const editorialTouch = typeof detail?.articleSlug === "string"
        ? captureEditorialTouch(`/blog/${detail.articleSlug}`, detail.ctaId)
        : null;
      openRef.current = true;
      setPlan(nextPlan);
      trackFunnelEvent("lead_form_opened", {
        plan_name: nextPlan,
        cta_source: typeof detail?.source === "string" ? detail.source : "unknown",
        ...getEditorialEventPayload(editorialTouch),
        ...(editorialTouch && typeof detail?.location === "string"
          ? { cta_location: detail.location }
          : {}),
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
