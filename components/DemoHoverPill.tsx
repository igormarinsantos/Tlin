"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  if (!enabled) return <>{children}</>;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[200] hidden -translate-x-1/2 md:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }}
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
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
