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
    }
  }, [isInView]);

  return (
    <div ref={ref}>
      {shouldRender ? children : <div style={{ height: "1px" }} />}
    </div>
  );
}
