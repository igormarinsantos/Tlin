"use client";

import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import { Play } from "lucide-react";

const Character = ({ char, isVisible, isLatest, isHighlighted, positionPercent, totalCharsInGroup, isDone }: { 
  char: string; 
  isVisible: boolean; 
  isLatest: boolean; 
  isHighlighted: boolean; 
  positionPercent: number; 
  totalCharsInGroup: number;
  isDone: boolean;
}) => {
  const [displayChar, setDisplayChar] = useState(char);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

  useEffect(() => {
    setDisplayChar(char);
  }, [char]);

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
      {displayChar === " " ? "\u00A0" : displayChar}
    </span>
  );
};

export function Hero() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.1, once: true });
  
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "thinking" | "typing" | "done">("idle");
  const [isFinished, setIsFinished] = useState(false);

  const title = "Seu Copiloto IA Comercial\nno WhatsApp 24/7";
  const highlightWords = ["Copiloto", "IA"];
  
  const allChars = useMemo(() => {
    const chars: { char: string; isHighlighted: boolean; line: number }[] = [];
    const lines = title.split("\n");
    lines.forEach((line, lIdx) => {
      const words = line.split(" ");
      const wordHighlightedStatus = words.map(w => 
        highlightWords.some(h => w.replace(/[^a-zA-Z]/g, "").toLowerCase() === h.toLowerCase())
      );
      words.forEach((word, wIdx) => {
        const isH = wordHighlightedStatus[wIdx];
        word.split("").forEach(c => chars.push({ char: c, isHighlighted: isH, line: lIdx }));
        if (wIdx < words.length - 1) {
          const spaceIsH = isH && wordHighlightedStatus[wIdx + 1];
          chars.push({ char: " ", isHighlighted: spaceIsH, line: lIdx });
        }
      });
    });
    return chars;
  }, []);

  useEffect(() => {
    if (isInView && phase === "idle") {
      setPhase("thinking");
      setTimeout(() => setPhase("typing"), 600);
    }
  }, [isInView, phase]);

  useEffect(() => {
    if (phase === "typing" && visibleCount < allChars.length) {
      const timeout = setTimeout(() => setVisibleCount(v => v + 1), 10);
      return () => clearTimeout(timeout);
    } else if (phase === "typing" && visibleCount >= allChars.length) {
      setPhase("done");
      setIsFinished(true);
    }
  }, [phase, visibleCount, allChars.length]);

  useEffect(() => {
    if (isFinished) {
      window.dispatchEvent(new CustomEvent("hero-animation-done"));
    }
  }, [isFinished]);

  const Cursor = () => (
    <motion.span 
      animate={phase === "thinking" ? { opacity: [1, 0.4, 1], scale: [1, 1.05, 1] } : { opacity: 1, scale: 1 }}
      transition={phase === "thinking" ? { duration: 0.8, repeat: Infinity } : { duration: 0 }}
      className="inline-flex items-center ml-3 md:ml-4"
      style={{ 
        width: "0.8em", 
        height: "0.8em", 
        verticalAlign: "middle",
        WebkitTextFillColor: "#0c0d0d",
        color: "#0c0d0d",
      }}
    >
      <img src="/TlinIA.svg" className="w-full h-full object-contain" alt="" width={32} height={32} fetchPriority="high" />
    </motion.span>
  );

  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [isDemoHovered, setIsDemoHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  return (
    <section ref={containerRef} className="relative w-full min-h-screen pt-40 pb-12 px-4 flex flex-col items-center justify-center bg-white overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#B597FF]/5 to-[#38E3FF]/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl w-full flex flex-col items-center relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-[#0c0d0d] leading-[1.1] text-center w-full mb-4 min-h-[2.5em] md:min-h-[2.2em]">
            {[0, 1].map(lineIdx => {
              const lineChars = allChars.filter(c => c.line === lineIdx);
              const globalLineStart = lineIdx === 0 ? 0 : allChars.filter(x => x.line === 0).length;

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
                          <span key={c.globalIdx} className="relative inline">
                            <Character 
                              char={c.char}
                              isVisible={isVisible}
                              isLatest={isLatest}
                              isHighlighted={group.isHighlighted}
                              positionPercent={positionPercent}
                              totalCharsInGroup={totalCharsInGroup}
                              isDone={isFinished}
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

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.8 }}
            className="text-zinc-500 font-medium text-base md:text-lg max-w-2xl mx-auto text-center mb-10"
          >
            Escale sua operação comercial com agentes de IA que atendem, 
            qualificam e vendem de forma autônoma, direto no WhatsApp.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-4 relative z-10"
        >
          <div className="relative">
            <a 
              href="#pricing"
              className={`relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer ${isCtaHovered ? 'z-[100]' : 'z-10'} block`}
              onMouseEnter={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 mouseX.set(e.clientX - rect.left);
                 mouseY.set(e.clientY - rect.top);
                 setIsCtaHovered(true);
              }}
              onMouseLeave={() => setIsCtaHovered(false)}
              onMouseMove={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 mouseX.set(e.clientX - rect.left);
                 mouseY.set(e.clientY - rect.top);
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-150%] opacity-100 transition-opacity"
                style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
              />
              <div className="relative px-8 py-4 rounded-full font-bold text-[13px] z-10 block w-full text-white transition-colors duration-300 group-hover/btn:text-[#0c0d0d] text-center">
                <span className="relative z-10">Começar Agora</span>
                <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-500 group-hover/btn:opacity-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
              </div>
            </a>
            <AnimatePresence>
              {isCtaHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  style={{ position: "absolute", left: springX, top: springY, x: "20px", y: "-50%", zIndex: 200, pointerEvents: "none" }}
                >
                  <div className="relative p-[1px] rounded-full overflow-hidden inline-flex">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-150%]"
                      style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
                    />
                    <div className="relative px-2 py-0.5 bg-zinc-950 rounded-full text-white border border-white/10 whitespace-nowrap">
                      <span className="text-[10px] font-bold tracking-wide leading-none">Demo 100% grátis</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#demo"
            className="relative cursor-pointer"
            onMouseEnter={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               mouseX.set(e.clientX - rect.left);
               mouseY.set(e.clientY - rect.top);
               setIsDemoHovered(true);
            }}
            onMouseLeave={() => setIsDemoHovered(false)}
            onMouseMove={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               mouseX.set(e.clientX - rect.left);
               mouseY.set(e.clientY - rect.top);
            }}
          >
            <div className="px-8 py-4 rounded-full bg-white border border-zinc-200 text-[#0c0d0d] font-bold text-[13px] hover:bg-zinc-50 transition-all flex items-center gap-2">
              <Play className="w-3 h-3 fill-current" />
              Ver Demo
            </div>
            <AnimatePresence>
              {isDemoHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  style={{ position: "absolute", left: springX, top: springY, x: "-50%", y: "-120%", pointerEvents: "none", zIndex: 110 }}
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
                    <source src="/robocamera.mp4" type="video/mp4" />
                  </video>
                </motion.div>
              )}
            </AnimatePresence>
          </a>
        </motion.div>

        {/* Removed RevenueGravityHero per user request */}
    </section>
  );
}
