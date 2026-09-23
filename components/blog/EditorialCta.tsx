"use client";

import { DemoHoverPill } from "@/components/DemoHoverPill";
import type {
  ClusterId,
  EditorialCta as EditorialCtaContract,
  SearchIntent,
} from "@/lib/editorial/types";
import {
  captureEditorialTouch,
  getEditorialEventPayload,
} from "@/lib/editorial/analytics";
import { trackFunnelEvent } from "@/lib/utm";

export type EditorialCtaLocation = "article-end" | "cluster-hub";

type EditorialCtaProps = {
  articleSlug: string;
  clusterId: ClusterId;
  intent: SearchIntent;
  cta: EditorialCtaContract;
  location: EditorialCtaLocation;
};

export function EditorialCta({
  articleSlug,
  clusterId,
  intent,
  cta,
  location,
}: EditorialCtaProps) {
  const openQualification = () => {
    const editorialTouch = captureEditorialTouch(`/blog/${articleSlug}`, cta.id);
    const editorialPayload = getEditorialEventPayload(editorialTouch);
    const detail = {
      plan: "TLIN",
      source: "editorial_article",
      articleSlug,
      clusterId,
      intent,
      ctaId: cta.id,
      location,
    };

    trackFunnelEvent("article_cta_click", {
      ...editorialPayload,
      content_group: "editorial",
      cta_source: detail.source,
      cta_location: location,
      plan_name: detail.plan,
    });
    window.dispatchEvent(new CustomEvent("open-qualification", { detail }));
  };

  return (
    <DemoHoverPill className="mt-6 inline-flex">
      <button
        type="button"
        onClick={openQualification}
        className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0c0d0d] outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-4 focus-visible:ring-[#B597FF]/40"
      >
        {cta.label}
      </button>
    </DemoHoverPill>
  );
}
