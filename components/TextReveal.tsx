"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const text =
  "Imagine você ter um assistente 🧠 com os mínimos detalhes do que você vende 📦, autônomo digitalmente ⚡ e um parceiro 24 horas ⏳, com a expertise especificamente ensinada por você 🎯.";

const words = text.split(" ");

export function TextReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWord, setActiveWord] = useState<number>(-1);
  const [revealed, setRevealed] = useState<boolean[]>(() => words.map(() => false));
  const [isFinished, setIsFinished] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isFinished) return;

    // The reveal happens across the first 90% of the scroll
    const animationProgress = Math.min(latest / 0.9, 1);
    const idx = Math.min(Math.floor(animationProgress * words.length), words.length - 1);
    
    if (idx >= 0) {
      setActiveWord(idx);
      setRevealed((prev) => {
        const next = [...prev];
        for (let i = 0; i <= idx; i++) next[i] = true;
        return next;
      });
    }

    if (animationProgress >= 1) {
      setIsFinished(true);
      setActiveWord(-1);
    }
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-white"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-6 md:px-12">
          <div 
            className="flex flex-wrap justify-center font-bold tracking-tight text-center"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)", lineHeight: 1.3 }}
          >
            {words.map((word, i) => (
              <Word
                key={i}
                isRevealed={isFinished || revealed[i]}
                isActive={!isFinished && activeWord === i}
              >
                {word}
              </Word>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  isRevealed,
  isActive,
}: {
  children: string;
  isRevealed: boolean;
  isActive: boolean;
}) {
  return (
    <span className="relative inline-flex items-baseline mx-[0.18em] my-[0.08em]">
      <span className="opacity-0 select-none whitespace-nowrap" aria-hidden>
        {children}
      </span>

      <motion.span
        initial={{ opacity: 0.1 }}
        animate={{ 
          opacity: isRevealed ? 1 : 0.1, 
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute inset-0 flex items-center text-[#0c0d0d] whitespace-nowrap"
      >
        {children}
        
        <AnimatePresence>
          {isActive && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="inline-flex items-center ml-[0.15em] align-middle"
            >
              <img
                src="/TlinIA.svg"
                alt=""
                style={{
                  height: "0.75em",
                  width:  "0.75em",
                  objectFit: "contain",
                  filter: "drop-shadow(0 1px 4px rgba(181,151,255,0.5))",
                }}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </span>
  );
}
