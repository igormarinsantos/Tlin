"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export function LazyShow({ children }: { children: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });

  useEffect(() => {
    if (isInView) {
      setShouldRender(true);
      return;
    }

    const handleUserInteraction = () => {
      setShouldRender(true);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("mousemove", handleUserInteraction);
    };

    window.addEventListener("scroll", handleUserInteraction, { passive: true });
    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("mousemove", handleUserInteraction, { passive: true });

    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("mousemove", handleUserInteraction);
      clearTimeout(timer);
    };
  }, [isInView]);

  return (
    <div ref={ref}>
      {shouldRender ? children : <div style={{ height: "1px" }} />}
    </div>
  );
}
