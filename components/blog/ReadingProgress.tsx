"use client";

import { useEffect, useState } from "react";

// Linha fina fixa no topo da viewport que enche conforme a pessoa rola a
// pagina do artigo -- feedback visual de quanto falta pra terminar de ler.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const current = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, current)));
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[110] h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
