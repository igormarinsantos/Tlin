"use client";

import { m, LazyMotion, domAnimation, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { trackFunnelEvent } from "@/lib/utm";

const Character = ({ char, isVisible, isLatest, isHighlighted, positionPercent, totalCharsInGroup, isDone, isStars }: { 
  char: string; 
  isVisible: boolean; 
  isLatest: boolean; 
  isHighlighted: boolean; 
  positionPercent: number; 
  totalCharsInGroup: number;
  isDone: boolean;
  isStars?: boolean;
}) => {
  if (isStars) {
    return (
      <span 
        style={{ opacity: isVisible ? 1 : 0 }} 
        className="inline-flex items-center mx-1 align-middle h-[1.2em]"
      >
        <Image src="/3STARS.webp" alt="Stars" width={120} height={40} className="h-[1em] w-auto object-contain" />
      </span>
    );
  }

  return (
    <span 
      style={{ 
        opacity: isVisible ? 1 : 0,
        color: isHighlighted ? "transparent" : "inherit",
        WebkitTextFillColor: isHighlighted ? "transparent" : "inherit",
        background: isHighlighted ? "linear-gradient(90deg, #B597FF, #38E3FF)" : "none",
        WebkitBackgroundClip: isHighlighted ? "text" : "none",
        backgroundClip: isHighlighted ? "text" : "none",
        backgroundSize: isHighlighted ? `${totalCharsInGroup * 100}% 100%` : "auto",
        backgroundPosition: isHighlighted ? `${positionPercent}% 0` : "0 0",
      }} 
      className="transition-opacity duration-75"
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
};

export function Hero() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.1, once: true });
  
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "thinking" | "typing" | "done">("idle");
  const [isFinished, setIsFinished] = useState(false);
  const [lastInlinePos, setLastInlinePos] = useState({ x: 0, y: 0 });
  const [showDemoNotice, setShowDemoNotice] = useState(false);
  const lastCharRef = useRef<HTMLSpanElement>(null);
  const demoNoticeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { t } = useLanguage();
  const title = t.hero.title;
  const highlightWords = ['Copiloto', 'IA', 'Copilot', 'AI'];
  
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (demoNoticeTimeout.current) clearTimeout(demoNoticeTimeout.current);
    };
  }, []);
  
  const allChars = useMemo(() => {
    const chars: { char: string; isHighlighted: boolean; line: number; isStars?: boolean }[] = [];
    const lines = title.split("\n");
    
    lines.forEach((line, lIdx) => {
      const parts = line.split(/({stars})/g);
      parts.forEach(part => {
        if (part === "{stars}") {
          chars.push({ char: "", isHighlighted: false, line: lIdx, isStars: true });
        } else {
          const words = part.split(" ");
          const wordHighlightedStatus = words.map(w => 
            highlightWords.some(h => w.replace(/[^a-zA-ZÀ-ú]/g, "").toLowerCase() === h.toLowerCase())
          );
          words.forEach((word, wIdx) => {
            const isH = wordHighlightedStatus[wIdx];
            word.split("").forEach(c => chars.push({ char: c, isHighlighted: isH, line: lIdx }));
            if (wIdx < words.length - 1) {
              const spaceIsH = isH && wordHighlightedStatus[wIdx + 1];
              chars.push({ char: " ", isHighlighted: spaceIsH, line: lIdx });
            }
          });
        }
      });
    });
    return chars;
  }, [title]);

  const globalMouseX = useMotionValue(0);
  const globalMouseY = useMotionValue(0);
  const isIdle = useRef(false);
  const baseIdlePos = useRef({ x: 0, y: 0 });
  const hasEnteredOnce = useRef(false);

  useEffect(() => {
    let frameId: number;
    let startTime = 0;

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
  }, [globalMouseX, globalMouseY]);

  useEffect(() => {
    if (isInView && phase === "idle") {
      setPhase("thinking");
      setTimeout(() => setPhase("typing"), 600);
    }
  }, [isInView, phase]);

  // Reset typing animation when title changes (language switch)
  useEffect(() => {
    setVisibleCount(0);
    setPhase("idle");
    setIsFinished(false);
  }, [title]);

  useEffect(() => {
    if (phase !== "typing") return;

    let frameId: number;
    let frameCount = 0;
    const revealEveryFrames = isDesktop ? 3 : 2;

    const tick = () => {
      frameCount++;
      if (frameCount % revealEveryFrames === 0) {
        setVisibleCount((v) => {
          const next = v + 1;
          if (next >= allChars.length) {
            requestAnimationFrame(() => {
              if (lastCharRef.current) {
                const rect = lastCharRef.current.getBoundingClientRect();
                const x = rect.left + rect.width;
                const y = rect.top + rect.height / 2;
                setLastInlinePos({ x, y });
              }
              setPhase("done");
              setIsFinished(true);
            });
            return allChars.length;
          }
          return next;
        });
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [phase, allChars.length, isDesktop]);

  const Cursor = () => (
    <span className="relative inline-flex w-0 h-[1em] items-center shrink-0" style={{ visibility: phase === "done" ? "hidden" : "visible" }}>
      <m.span 
        animate={phase === "thinking" ? { opacity: [1, 0.4, 1], scale: [1, 1.05, 1] } : { opacity: 1, scale: 1 }}
        transition={phase === "thinking" ? { duration: 0.8, repeat: Infinity } : { duration: 0 }}
        className="absolute left-1 md:left-2 flex items-center"
        style={{ width: "0.8em", height: "0.8em" }}
      >
        <Image src="/TlinIA.svg" className="w-full h-full object-contain" alt="Tlin IA Cursor" width={32} height={32} priority />
      </m.span>
    </span>
  );

  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [isDemoHovered, setIsDemoHovered] = useState(false);
  
  const uiMouseX = useMotionValue(0);
  const uiMouseY = useMotionValue(0);
  const uiSpringX = useSpring(uiMouseX, { damping: 25, stiffness: 150 });
  const uiSpringY = useSpring(uiMouseY, { damping: 25, stiffness: 150 });

  return (
    <LazyMotion features={domAnimation}>
      <section ref={containerRef} className="relative w-full min-h-[100svh] pt-40 pb-12 px-4 flex flex-col items-center justify-center bg-white overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#B597FF]/5 to-[#38E3FF]/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl w-full flex flex-col items-center relative z-10">
          <h1 className="text-[36px] xs:text-[42px] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight md:tracking-tighter text-[#0c0d0d] leading-[1.1] text-center w-full mb-6 min-h-[4em] md:min-h-[2.5em] [text-wrap:balance]">
            {Array.from(new Set(allChars.map(c => c.line))).sort((a,b) => a-b).map(lineIdx => {
              const lineChars = allChars.filter(c => c.line === lineIdx);
              const globalLineStart = allChars.findIndex(c => c.line === lineIdx);

              const groups: { chars: any[], isHighlighted: boolean }[] = [];
              lineChars.forEach((c, i) => {
                const globalIdx = globalLineStart + i;
                const charWithIdx = { ...c, globalIdx };
                if (groups.length > 0 && groups[groups.length - 1].isHighlighted === c.isHighlighted) {
                  groups[groups.length - 1].chars.push(charWithIdx);
                } else {
                  groups.push({ chars: [charWithIdx], isHighlighted: c.isHighlighted });
                }
              });

              return (
                <div key={lineIdx} className="block w-full">
                  {visibleCount === 0 && lineIdx === 0 && <Cursor />}
                  {groups.map((group, gIdx) => (
                    <span key={gIdx} className="inline">
                      {group.chars.map((c, charInGroupIdx) => {
                        const isVisible = c.globalIdx < visibleCount;
                        const isLatest = c.globalIdx === visibleCount - 1;
                        
                        const totalCharsInGroup = group.chars.length;
                        const positionPercent = (charInGroupIdx / (totalCharsInGroup > 1 ? totalCharsInGroup - 1 : 1)) * 100;
                        
                        return (
                          <span key={c.globalIdx} className="relative inline" ref={isLatest ? lastCharRef : null}>
                            <Character 
                              char={c.char}
                              isVisible={isVisible}
                              isLatest={isLatest}
                              isHighlighted={group.isHighlighted}
                              positionPercent={positionPercent}
                              totalCharsInGroup={totalCharsInGroup}
                              isDone={isFinished}
                              isStars={c.isStars}
                            />
                            {isLatest && <Cursor />}
                          </span>
                        );
                      })}
                    </span>
                  ))}
                </div>
              );
            })}
          </h1>

          <m.p
            initial={{ opacity: 0, y: 15 }}
            animate={isFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.8 }}
            className="text-zinc-500 font-medium text-base md:text-lg max-w-2xl mx-auto text-center mb-10"
          >
            {t.hero.subtitle}
          </m.p>
        </div>

        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-row items-center justify-center gap-3 md:gap-4 relative z-10"
        >
          <div className="relative">
            <button 
              onClick={() => {
                trackFunnelEvent("click_pricing_cta", {
                  cta_source: "hero_primary",
                  plan_name: "TLIN",
                });
                window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source: "hero_primary" } }));
              }}
              className={`relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer ${isCtaHovered ? 'z-[100]' : 'z-10'} block w-full`}
              onMouseEnter={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 uiMouseX.set(e.clientX - rect.left);
                 uiMouseY.set(e.clientY - rect.top);
                 setIsCtaHovered(true);
              }}
              onMouseLeave={() => setIsCtaHovered(false)}
              onMouseMove={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 uiMouseX.set(e.clientX - rect.left);
                 uiMouseY.set(e.clientY - rect.top);
              }}
            >
              <div className="absolute inset-[-150%] opacity-100 transition-opacity animate-[spin_3s_linear_infinite]"
                style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
              />
              <div className="relative px-6 md:px-10 py-3.5 rounded-full font-bold text-[14px] md:text-[15px] z-10 block w-full text-white transition-colors duration-300 group-hover/btn:text-[#0c0d0d] text-center">
                <span className="relative z-10">{t.hero.cta}</span>
                <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-500 group-hover/btn:opacity-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
              </div>
            </button>
            <AnimatePresence>
              {isCtaHovered && (
                <m.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  style={{ position: "absolute", left: uiSpringX, top: uiSpringY, x: "20px", y: "-50%", zIndex: 200, pointerEvents: "none" }}
                >
                  <div className="relative p-[1px] rounded-full overflow-hidden inline-flex">
                    <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
                      style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
                    />
                    <div className="relative px-2 py-0.5 bg-zinc-950 rounded-full text-white border border-white/10 whitespace-nowrap">
                      <span className="text-[10px] font-bold tracking-wide leading-none">{t.hero.demoHover}</span>
                    </div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => {
              trackFunnelEvent("click_demo_anchor", { cta_source: "hero_secondary" });
              setShowDemoNotice(true);
              if (demoNoticeTimeout.current) clearTimeout(demoNoticeTimeout.current);
              demoNoticeTimeout.current = setTimeout(() => setShowDemoNotice(false), 2200);
            }}
            className="relative cursor-pointer"
            onMouseEnter={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               uiMouseX.set(e.clientX - rect.left);
               uiMouseY.set(e.clientY - rect.top);
               setIsDemoHovered(true);
            }}
            onMouseLeave={() => setIsDemoHovered(false)}
            onMouseMove={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               uiMouseX.set(e.clientX - rect.left);
               uiMouseY.set(e.clientY - rect.top);
            }}
          >
            <div className="px-6 md:px-10 py-3.5 rounded-full bg-white border border-zinc-200 text-[#0c0d0d] font-bold text-[14px] md:text-[15px] hover:bg-zinc-50 transition-all flex items-center gap-2 whitespace-nowrap">
              <Play className="w-3 h-3 fill-current" />
              {t.hero.watchDemo}
            </div>
            <AnimatePresence>
              {showDemoNotice && (
                <m.div
                  initial={{ opacity: 0, x: "-50%", y: "calc(-50% + 18px)", scale: 0.94 }}
                  animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
                  exit={{ opacity: 0, x: "-50%", y: "calc(-50% + 18px)", scale: 0.94 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed left-1/2 top-1/2 z-[250] whitespace-nowrap rounded-full border border-[#B597FF]/40 bg-[#B597FF] px-6 py-3 text-sm font-black text-white shadow-2xl shadow-[#B597FF]/35"
                >
                  {t.hero.demoSoon}
                </m.div>
              )}
              {isDemoHovered && (
                <m.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  style={{ position: "absolute", left: uiSpringX, top: uiSpringY, x: "-50%", y: "-120%", pointerEvents: "none", zIndex: 110 }}
                  className="w-[140px] md:w-[160px] aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-white/20 flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover opacity-90"
                  >
                    <source src="/RoboCamera.mp4" type="video/mp4" />
                  </video>
                </m.div>
              )}
            </AnimatePresence>
          </button>
        </m.div>

        {/* Mascot Follower (PC Only) - Desmontado no Mobile para poupar CPU/GPU */}
        <AnimatePresence>
          {isDesktop && phase === "done" && lastInlinePos.x !== 0 && (
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
        <MobileMascot isFinished={isFinished} />
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
      const target = e.target as HTMLElement;
      const isOverInteractive = !!target.closest('button') || !!target.closest('a') || !!target.closest('[role="button"]') || !!target.closest('[data-mascot-hide]');
      setIsAbductedGlobal(isOverInteractive);
    };

    const handleScroll = () => {
      // Dispara o efeito de abdução mais cedo (a partir de 350px de rolagem) para o usuário acompanhar visualmente
      setIsScrolledPast(window.scrollY > 350);
    };

    window.addEventListener("mouseover", handleGlobalHover);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check initial scroll
    handleScroll();

    return () => {
      window.removeEventListener("mouseover", handleGlobalHover);
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
