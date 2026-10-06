"use client";

import { m, LazyMotion, domAnimation, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useRef, useSyncExternalStore, type RefObject } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { withoutClosingPeriod } from "@/lib/marketingCopy";
import { trackFunnelEvent } from "@/lib/utm";
import { TlinButton } from "@/components/ui/tlin";

const HIGHLIGHT_WORDS = new Set(["copiloto", "ia", "copilot", "ai"]);
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToDesktopViewport(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getDesktopViewportSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function useDesktopViewport() {
  return useSyncExternalStore(subscribeToDesktopViewport, getDesktopViewportSnapshot, () => false);
}

function HeroTitleLine({
  line,
  anchorRef,
}: {
  line: string;
  anchorRef?: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <span ref={anchorRef} className="relative block w-full">
      {line.split(/(\s+)/).map((part, index) => {
        const normalized = part.replace(/[^a-zA-ZÀ-ú]/g, "").toLowerCase();
        const highlighted = HIGHLIGHT_WORDS.has(normalized);

        return (
          <span
            key={`${part}-${index}`}
            className={highlighted
              ? "bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent"
              : undefined}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}

export type HeroVariant = "iaWhatsapp" | "recuperacaoDeLeads" | "crmComIa" | "infoprodutores" | "agentesDeIa" | "clinicas" | "escolas" | "assessorias" | "advocacia";

export function Hero() {
  const containerRef = useRef(null);
  const titleEndRef = useRef<HTMLSpanElement>(null);
  const [motionReady, setMotionReady] = useState(false);
  const [lastInlinePos, setLastInlinePos] = useState({ x: 0, y: 0 });

  const { t } = useLanguage();
  const isDesktop = useDesktopViewport();
  const desktopTitle = withoutClosingPeriod(t.hero.title.replace(/\s*\{stars\}/g, ""));
  const mobileTitle = withoutClosingPeriod(t.hero.mobileTitle.replace(/\s*\{stars\}/g, ""));
  const desktopSubtitle = withoutClosingPeriod(t.hero.subtitle);
  const mobileSubtitle = withoutClosingPeriod(t.hero.mobileSubtitle);

  const globalMouseX = useMotionValue(0);
  const globalMouseY = useMotionValue(0);
  const isIdle = useRef(false);
  const baseIdlePos = useRef({ x: 0, y: 0 });
  const hasEnteredOnce = useRef(false);

  useEffect(() => {
    let frameId: number;
    let startTime = 0;

    if (!motionReady) return;

    if (typeof window !== 'undefined') {
      baseIdlePos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    const wander = () => {
      if (!isIdle.current || !isDesktop) return;
      const elapsed = (performance.now() - startTime) / 1000;
      
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2.2;
      
      const rx = Math.min(window.innerWidth * 0.42, 600); 
      const ry = Math.min(window.innerHeight * 0.35, 400);

      // Organic slithering pattern (Infinity loop with high-fidelity snake micro-wiggles like slither.io)
      const targetX = cx + Math.sin(elapsed * 0.5) * rx + Math.cos(elapsed * 1.5) * 40;
      const targetY = cy + Math.sin(elapsed * 1.0) * ry * 0.7 + Math.sin(elapsed * 2.0) * 25;
      
      // Easing suave a partir do ponto de repouso atual do mouse para transição sem solavancos
      const progress = Math.min(elapsed / 1.5, 1);
      const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const currentX = baseIdlePos.current.x + (targetX - baseIdlePos.current.x) * easeProgress;
      const currentY = baseIdlePos.current.y + (targetY - baseIdlePos.current.y) * easeProgress;
      
      globalMouseX.set(currentX);
      globalMouseY.set(currentY);
      
      frameId = requestAnimationFrame(wander);
    };

    const trackMouse = (e: MouseEvent) => {
      hasEnteredOnce.current = true;
      globalMouseX.set(e.clientX);
      globalMouseY.set(e.clientY);
      isIdle.current = false;
      baseIdlePos.current = { x: e.clientX, y: e.clientY };
      cancelAnimationFrame(frameId);
    };

    const handleMouseLeave = () => {
      // Conforme solicitado, se o mouse já entrou na página uma vez, o mascote fica onde está e não volta a se mexer sozinho
      if (hasEnteredOnce.current) return;
      
      isIdle.current = true;
      startTime = performance.now();
      wander();
    };

    // Inicia movimentação autônoma caso a página carregue em segundo plano ou antes do primeiro movimento do mouse
    if (!hasEnteredOnce.current) {
      isIdle.current = true;
      startTime = performance.now();
      wander();
    }

    window.addEventListener("mousemove", trackMouse);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", trackMouse);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(frameId);
    };
  }, [globalMouseX, globalMouseY, isDesktop, motionReady]);

  useEffect(() => {
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let frameId: number | null = null;

    const activateMotion = () => {
      frameId = window.requestAnimationFrame(() => {
        const rect = titleEndRef.current?.getBoundingClientRect();
        if (rect) setLastInlinePos({ x: rect.right, y: rect.top + rect.height / 2 });
        setMotionReady(true);
      });
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(activateMotion, { timeout: 1400 });
    } else {
      timeoutId = setTimeout(activateMotion, 700);
    }

    return () => {
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [desktopTitle]);

  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [isDemoHovered, setIsDemoHovered] = useState(false);
  

  return (
    <LazyMotion features={domAnimation}>
      <section id="inicio" ref={containerRef} className="relative w-full min-h-[100svh] pt-28 md:pt-32 pb-8 px-4 flex flex-col items-center justify-center bg-white overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#B597FF]/5 to-[#38E3FF]/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl w-full flex flex-col items-center relative z-10">
          <h1 className="relative mb-8 w-full overflow-hidden text-center text-[30px] font-bold leading-[1.15] tracking-tight text-[#0c0d0d] xs:text-[34px] sm:text-5xl md:mb-6 md:min-h-[2.5em] md:text-6xl md:tracking-tighter lg:text-7xl">
            <span className="block lg:hidden">
              {mobileTitle.split("\n").map((line, index) => (
                <HeroTitleLine key={`${line}-${index}`} line={line} />
              ))}
            </span>
            <span className="hidden lg:block">
              {desktopTitle.split("\n").map((line, index, lines) => (
                <HeroTitleLine
                  key={`${line}-${index}`}
                  line={line}
                  anchorRef={index === lines.length - 1 ? titleEndRef : undefined}
                />
              ))}
            </span>
            <span aria-hidden="true" className="hero-title-scan pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-xl motion-reduce:hidden sm:block" />
          </h1>

          <p
            className="mx-auto mb-10 max-w-[310px] whitespace-pre-line text-center text-[13px] font-medium leading-relaxed text-zinc-600 md:max-w-2xl md:whitespace-normal md:text-lg md:text-zinc-500"
          >
            <span className="lg:hidden">{mobileSubtitle}</span>
            <span className="hidden lg:inline">{desktopSubtitle}</span>
          </p>
        </div>

        <div
          className="flex flex-row items-center justify-center gap-3 md:gap-4 relative z-10"
        >
          <div
            className="relative"
            onMouseEnter={() => setIsCtaHovered(true)}
            onMouseLeave={() => setIsCtaHovered(false)}
          >
            <TlinButton
              onClick={() => {
                trackFunnelEvent("click_pricing_cta", {
                  cta_source: "hero_primary",
                  plan_name: "TLIN",
                });
                window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source: "hero_primary" } }));
              }}
              className={isCtaHovered ? "z-[100]" : "z-10"}
              contentClassName="px-6 py-3.5 text-[14px] md:px-10 md:text-[15px]"
            >{t.hero.cta}</TlinButton>
          </div>

          <TlinButton
            onClick={() => {
              trackFunnelEvent("click_pricing_cta", {
                cta_source: "hero_secondary",
                plan_name: "TLIN",
              });
              window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source: "hero_secondary" } }));
            }}
            variant="secondary"
            className="whitespace-nowrap"
            onMouseEnter={() => setIsDemoHovered(true)}
            onMouseLeave={() => setIsDemoHovered(false)}
          >{t.hero.watchDemo}</TlinButton>
        </div>

        {/* Mascot Follower (PC Only) - Desmontado no Mobile para poupar CPU/GPU */}
        <AnimatePresence>
          {isDesktop && motionReady && lastInlinePos.x !== 0 && (
            <MascotFollower 
              initialX={lastInlinePos.x} 
              initialY={lastInlinePos.y} 
              isNearCta={isCtaHovered || isDemoHovered}
              globalMouseX={globalMouseX}
              globalMouseY={globalMouseY}
            />
          )}
        </AnimatePresence>

        {/* Mascot Patrol (Mobile Only) */}
        <MobileMascot isFinished={motionReady} />
      </section>
    </LazyMotion>
  );
}

function MobileMascot({ isFinished }: { isFinished: boolean }) {
  if (!isFinished) return null;

  return (
    <m.div
      initial={{ x: "-15vw", y: "0px", opacity: 1 }}
      animate={{ 
        x: ["-15vw", "115vw"],
        y: ["0px", "25px", "-15px", "30px", "0px"], 
        rotate: [15, -10, 20, -15, 15],
      }}
      transition={{ 
        x: { duration: 12, repeat: Infinity, ease: "linear" },
        y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute left-0 top-[18%] w-8 h-8 z-20 lg:hidden pointer-events-none flex items-center justify-center"
    >
      <Image src="/TlinIA.svg" className="w-full h-full object-contain" alt="Tlin Mascot" width={32} height={32} priority />
    </m.div>
  );
}

function MascotFollower({ initialX, initialY, isNearCta, globalMouseX, globalMouseY }: { initialX: number, initialY: number, isNearCta: boolean, globalMouseX: any, globalMouseY: any }) {
  const mascotX = useMotionValue(initialX);
  const mascotY = useMotionValue(initialY);
  const mascotRotate = useMotionValue(0);
  const abductionRotate = useMotionValue(0);
  const mascotOpacity = useMotionValue(1);
  const mascotScale = useMotionValue(1);

  const springX = useSpring(mascotX, { damping: 50, stiffness: 80 });
  const springY = useSpring(mascotY, { damping: 50, stiffness: 80 });
  const springRotate = useSpring(mascotRotate, { damping: 30, stiffness: 150 });
  const springOpacity = useSpring(mascotOpacity, { damping: 30, stiffness: 120 });
  const springScale = useSpring(mascotScale, { damping: 20, stiffness: 150 });
  
  // Combine base rotation (smooth spring) with abduction spin (direct)
  const finalRotate = useMotionValue(0);

  useEffect(() => {
    const syncRotation = () => {
      finalRotate.set(springRotate.get() + abductionRotate.get());
    };
    const unsubBase = springRotate.on("change", syncRotation);
    const unsubExtra = abductionRotate.on("change", syncRotation);
    return () => {
      unsubBase();
      unsubExtra();
    };
  }, [springRotate, abductionRotate, finalRotate]);

  const lastAngle = useRef(0);
  const cumulativeRotation = useRef(0);
  const [isAbductedGlobal, setIsAbductedGlobal] = useState(false);
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    const handleGlobalHover = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const isOverInteractive = !!target?.closest('button, a, [role="button"], [data-mascot-hide]');
      // Cover the full horizontal header band, including pointer-events-none gaps.
      const isOverHeader = Array.from(document.querySelectorAll('[data-mascot-header]')).some(header => {
        const rect = header.getBoundingClientRect();
        return rect.height > 0 && rect.bottom > 0 && e.clientY >= Math.max(0, rect.top) && e.clientY <= rect.bottom;
      });
      setIsAbductedGlobal(isOverInteractive || isOverHeader);
    };

    const handleScroll = () => {
      // Dispara o efeito de abdução mais cedo (a partir de 350px de rolagem) para o usuário acompanhar visualmente
      setIsScrolledPast(window.scrollY > 350);
    };

    window.addEventListener("mousemove", handleGlobalHover, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check initial scroll
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleGlobalHover);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Loop autônomo de rotação para garantir a animação do Vortex de Abdução mesmo quando o mouse estiver parado na rolagem
  useEffect(() => {
    let spinFrame: number;
    const isAbducted = isNearCta || isAbductedGlobal || isScrolledPast;
    
    const triggerSpin = () => {
      if (isAbducted) {
        // Reduz a velocidade da rotação e normaliza para evitar infinity bugs no Framer Motion
        const nextRotate = (abductionRotate.get() + 15) % 360000;
        abductionRotate.set(nextRotate);
        spinFrame = requestAnimationFrame(triggerSpin);
      }
    };

    if (isAbducted) {
      spinFrame = requestAnimationFrame(triggerSpin);
    } else {
      abductionRotate.set(0);
    }

    return () => cancelAnimationFrame(spinFrame);
  }, [isNearCta, isAbductedGlobal, isScrolledPast, abductionRotate]);

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      const isAbducted = isNearCta || isAbductedGlobal || isScrolledPast;
      
      if (isAbducted) {
        mascotOpacity.set(0);
        mascotScale.set(0);
      } else {
        mascotOpacity.set(1);
        mascotScale.set(1);
      }

      const currentRenderedX = springX.get();
      const currentRenderedY = springY.get();
      const dx = x - currentRenderedX;
      const dy = y - currentRenderedY;
      const dist = Math.hypot(dx, dy);

      if (dist > 1.0) {
        // Alinhamento cinemático perfeito: olha exatamente na direção do vetor de velocidade real como slither.io
        let targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        let delta = targetAngle - lastAngle.current;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        
        cumulativeRotation.current += delta;
        lastAngle.current = targetAngle;
        
        if (!isAbducted) {
          mascotRotate.set(cumulativeRotation.current);
        }
      }

      mascotX.set(x);
      mascotY.set(y);
    };

    // Initial sync to current mouse position to prevent sticking at start
    const curX = globalMouseX.get();
    const curY = globalMouseY.get();
    if (curX !== 0 || curY !== 0) {
      updatePosition(curX, curY);
    }

    const unsubX = globalMouseX.on("change", (v: number) => updatePosition(v, globalMouseY.get()));
    const unsubY = globalMouseY.on("change", (v: number) => updatePosition(globalMouseX.get(), v));
    
    return () => { unsubX(); unsubY(); };
  }, [isNearCta, isAbductedGlobal, isScrolledPast, globalMouseX, globalMouseY, initialX, initialY]);

  return (
    <m.div
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        opacity: springOpacity,
        scale: springScale,
        x: springX,
        y: springY,
        rotate: finalRotate,
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 40,
        pointerEvents: "none",
        width: "clamp(2rem, 4vw, 3.2rem)",
        height: "clamp(2rem, 4vw, 3.2rem)",
      }}
      className="hidden lg:block"
    >
      <Image src="/TlinIA.svg" className="w-full h-full object-contain" alt="Tlin Mascot" width={32} height={32} priority />
    </m.div>
  );
}
