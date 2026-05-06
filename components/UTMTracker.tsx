"use client";

import { useEffect, Suspense, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureUtms, sendUtmToGA, injectUtmsIntoForms } from "@/lib/utm";

/** requestIdleCallback polyfill for Safari */
const scheduleIdle = (cb: () => void, timeout = 2000) => {
  if (typeof window === "undefined") return;
  if ("requestIdleCallback" in window) {
    (window as Window & typeof globalThis & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
      .requestIdleCallback(cb, { timeout });
  } else {
    setTimeout(cb, 200);
  }
};

function UTMTrackerInner() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const observerRef  = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // ── 1. Capture UTMs synchronously (fast, just reads URL + localStorage)
    captureUtms(window.location.search);

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
      if (typeof idleHandle === "number") {
        if ("cancelIdleCallback" in window) {
          (window as Window & { cancelIdleCallback: (id: number) => void })
            .cancelIdleCallback(idleHandle);
        }
      }
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
