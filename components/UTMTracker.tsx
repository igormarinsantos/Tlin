"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureUtms, sendUtmToGA, injectUtmsIntoForms } from "@/lib/utm";

/**
 * Inner component that uses useSearchParams (must be wrapped in Suspense).
 */
function UTMTrackerInner() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Capture & persist UTMs on every route change
    captureUtms(window.location.search);

    // Give gtag time to initialize before sending events
    const gaTimer = setTimeout(() => {
      sendUtmToGA("utm_capture");
      injectUtmsIntoForms();
    }, 800);

    // Also inject on DOM mutations (for dynamically rendered forms)
    const observer = new MutationObserver(() => {
      injectUtmsIntoForms();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(gaTimer);
      observer.disconnect();
    };
  // Re-run when pathname or query params change (SPA navigation)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams.toString()]);

  return null;
}

/**
 * UTMTracker — drop this once in layout.tsx inside <Suspense>.
 * Handles all UTM capture, persistence, and GA4 dispatch automatically.
 */
export function UTMTracker() {
  return (
    <Suspense fallback={null}>
      <UTMTrackerInner />
    </Suspense>
  );
}
