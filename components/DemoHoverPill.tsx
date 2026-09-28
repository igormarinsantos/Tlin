"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { getHoverPillPosition } from "@/lib/hover-pill-position";

type DemoHoverPillProps = {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
  label?: ReactNode;
  labelClassName?: string;
  onHoverChange?: (hovered: boolean) => void;
};

// Mantém a mesma assinatura visual do CTA principal da home em todos os
// pontos de conversão, sem interferir no clique do botão interno.
export function DemoHoverPill({
  children,
  className = "",
  enabled = true,
  label,
  labelClassName = "text-[10px]",
  onHoverChange,
}: DemoHoverPillProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const lastPointer = useRef({ clientX: 0, clientY: 0 });
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const springX = useSpring(targetX, { damping: 28, stiffness: 240, mass: 0.55 });
  const springY = useSpring(targetY, { damping: 28, stiffness: 240, mass: 0.55 });

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    lastPointer.current = { clientX, clientY };
    const rect = wrapper.getBoundingClientRect();
    const labelRect = labelRef.current?.getBoundingClientRect();
    const labelWidth = labelRect?.width || 96;
    const labelHeight = labelRect?.height || 24;
    const position = getHoverPillPosition({
      pointerX: clientX - rect.left,
      pointerY: clientY - rect.top,
      buttonWidth: rect.width,
      buttonHeight: rect.height,
      labelWidth,
      labelHeight,
    });

    targetX.set(position.x);
    targetY.set(position.y);
  }, [targetX, targetY]);

  useEffect(() => {
    if (!isHovered) return;
    const frame = window.requestAnimationFrame(() => {
      updatePosition(lastPointer.current.clientX, lastPointer.current.clientY);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isHovered, updatePosition]);

  if (!enabled) return <>{children}</>;

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      onMouseEnter={(event) => {
        updatePosition(event.clientX, event.clientY);
        setIsHovered(true);
        onHoverChange?.(true);
      }}
      onMouseMove={(event) => updatePosition(event.clientX, event.clientY)}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverChange?.(false);
      }}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            ref={labelRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ left: springX, top: springY, x: "-50%", y: "-50%" }}
            className="pointer-events-none absolute z-[200] hidden md:block"
          >
            <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
              <div
                className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
                style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }}
              />
              <div className="relative whitespace-nowrap rounded-full border border-white/10 bg-zinc-950 px-2 py-0.5 text-white">
                <span className={`${labelClassName} font-bold leading-none tracking-wide`}>{label ?? t.hero.demoHover}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
