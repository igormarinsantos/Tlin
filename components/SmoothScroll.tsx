"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Intercept all anchor links that start with #
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          
          // Handle scroll to top if href is just "#"
          if (href === "#") {
            lenis.scrollTo(0);
          } else {
            // Scroll to the element with the matching ID
            lenis.scrollTo(href);
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      (window as any).lenis = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
