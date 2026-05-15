"use client";

import { useState, useEffect } from "react";

export function ScrollBgWrapper({ children }: { children: React.ReactNode }) {
  const [isFocusActive, setIsFocusActive] = useState(false);

  useEffect(() => {
    const handleFocus = (e: any) => setIsFocusActive(e.detail.active);
    window.addEventListener("pricing-focus", handleFocus);
    return () => window.removeEventListener("pricing-focus", handleFocus);
  }, []);

  return (
    <div className={`w-full min-h-[100svh] transition-all duration-700 ${isFocusActive ? 'pricing-focus-active' : ''}`}>
      {children}
    </div>
  );
}
