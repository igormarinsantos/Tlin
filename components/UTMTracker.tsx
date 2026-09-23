"use client";

import { useEffect, Suspense, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureUtms, sendUtmToGA, injectUtmsIntoForms } from "@/lib/utm";
import {
  captureEditorialTouch,
  getEditorialEventPayload,
} from "@/lib/editorial/analytics";

/** requestIdleCallback polyfill for Safari */
const scheduleIdle = (cb: () => void, timeout = 2000) => {
  if (typeof window === "undefined") return;
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  } else {
    const id = setTimeout(cb, 200);
    return () => clearTimeout(id);
  }
};

function UTMTrackerInner() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const lastPage = useRef("");
  const observerRef  = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/internal/")) return;
    // ── 1. Capture UTMs synchronously (fast, just reads URL + localStorage)
    captureUtms(window.location.search);
    const editorialTouch = captureEditorialTouch(pathname);
    if (lastPage.current !== pathname) {
      lastPage.current = pathname;
      sendUtmToGA("page_view", {
        page_location: window.location.origin + pathname,
        page_referrer: document.referrer,
        ...getEditorialEventPayload(editorialTouch),
      });
    }

    // ── 2. Send to GA and inject into forms during browser idle time
    //    This keeps the Main Thread free on initial load.
    const idleHandle = scheduleIdle(() => {
      sendUtmToGA("utm_capture");
      injectUtmsIntoForms();
    });

    // ── 3. MutationObserver: throttled + scoped to avoid long tasks
    //    Only watches for added <form> nodes, not all subtree mutations.
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    observerRef.current = new MutationObserver((mutations) => {
      const hasNewForm = mutations.some((m) =>
        Array.from(m.addedNodes).some(
          (n) =>
            n instanceof Element &&
            (n.tagName === "FORM" || n.querySelector?.("form"))
        )
      );
      if (!hasNewForm) return;

      // Debounce to avoid spamming on rapid DOM changes
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => injectUtmsIntoForms(), 300);
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: false, // ← was 'true', which caused massive observer overhead
    });

    return () => {
      idleHandle?.();
      if (debounceTimer) clearTimeout(debounceTimer);
      observerRef.current?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams.toString()]);

  return null;
}

export function UTMTracker() {
  return (
    <Suspense fallback={null}>
      <UTMTrackerInner />
    </Suspense>
  );
}
