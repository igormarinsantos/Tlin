"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LiaPopup = dynamic(
  () => import("@/components/LiaPopup").then((mod) => mod.LiaPopup),
  { ssr: false }
);

/**
 * Mantém o contato do Igor disponível antes da primeira dobra, mas tira toda
 * a máquina de conversa do caminho crítico da primeira pintura.
 */
export function DeferredLiaPopup() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let activated = false;

    const activate = () => {
      if (activated) return;
      activated = true;
      setReady(true);
    };

    window.addEventListener("pointerdown", activate, { once: true, passive: true });
    window.addEventListener("scroll", activate, { once: true, passive: true });

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(activate, { timeout: 1200 });
    } else {
      timeoutId = setTimeout(activate, 700);
    }

    return () => {
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("scroll", activate);
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  return ready ? <LiaPopup /> : null;
}
