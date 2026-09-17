"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

type DemoHoverPillProps = {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
};

// Mantém a mesma assinatura visual do CTA principal da home em todos os
// pontos de conversão, sem interferir no clique do botão interno.
export function DemoHoverPill({ children, className = "", enabled = true }: DemoHoverPillProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  const updatePointer = (target: HTMLDivElement, clientX: number, clientY: number) => {
    const rect = target.getBoundingClientRect();
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  };

  if (!enabled) return <>{children}</>;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={(event) => {
        updatePointer(event.currentTarget, event.clientX, event.clientY);
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(event) => updatePointer(event.currentTarget, event.clientX, event.clientY)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{ position: "absolute", left: springX, top: springY, x: "20px", y: "-50%", zIndex: 200, pointerEvents: "none" }}
            className="hidden md:block"
          >
            <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
              <div
                className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
                style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }}
              />
              <div className="relative whitespace-nowrap rounded-full border border-white/10 bg-zinc-950 px-2 py-0.5 text-white">
                <span className="text-[10px] font-bold leading-none tracking-wide">{t.hero.demoHover}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
