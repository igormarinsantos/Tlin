"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import { useLanguage } from "@/lib/LanguageContext";

export function TextReveal() {
  const { t } = useLanguage();
  
  // Parse text into individual words while preserving highlight state
  const parts: { text: string; isHighlighted: boolean }[] = [];
  let inHighlight = false;
  const rawWords = t.textReveal.text.split(/(\s+|\[|\])/);
  for (const w of rawWords) {
    if (w === '[') { inHighlight = true; continue; }
    if (w === ']') { inHighlight = false; continue; }
    if (w.trim().length === 0) continue; 
    parts.push({ text: w, isHighlighted: inHighlight });
  }
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWord, setActiveWord] = useState<number>(-1);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setRevealed(Array(parts.length).fill(false));
    setIsFinished(false);
    setActiveWord(-1);
  }, [t.textReveal.text]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isFinished) return;
    const animationProgress = Math.min(latest / 0.9, 1);
    const idx = Math.min(Math.floor(animationProgress * parts.length), parts.length - 1);
    
    if (idx >= 0 && idx !== activeWord) {
      setActiveWord(idx);
      setRevealed((prev) => {
        const next = [...prev];
        for (let i = 0; i <= idx; i++) next[i] = true;
        return next;
      });
    }

    if (animationProgress >= 1 && !isFinished) {
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
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
          <div 
            className="flex flex-wrap justify-center font-bold tracking-tight text-center gap-x-[0.3em] gap-y-[0.1em]"
            style={{ 
              fontSize: "clamp(2rem, 8vw, 3.5rem)", 
              lineHeight: 1.05,
              textWrap: "balance" as any 
            }}
          >
            {parts.map((part, i) => {
              return (
                <Word
                  key={i}
                  isRevealed={isFinished || revealed[i]}
                  isActive={!isFinished && activeWord === i}
                  isHighlighted={part.isHighlighted}
                >
                  {part.text}
                </Word>
              );
            })}
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
  isHighlighted,
}: {
  children: string;
  isRevealed: boolean;
  isActive: boolean;
  isHighlighted: boolean;
}) {
  // Regex to detect emojis
  const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
  const parts = children.split(emojiRegex).filter(Boolean);

  return (
    <span className="relative inline-flex items-baseline whitespace-nowrap">
      <span className="opacity-0 select-none" aria-hidden>
        {children}
      </span>

      <motion.span
        initial={{ opacity: 0.15, color: "#d4d4d8" }}
        animate={{ 
          opacity: isRevealed ? 1 : 0.15, 
          color: isRevealed ? (isHighlighted ? "transparent" : "#0c0d0d") : "#d4d4d8",
          scale: isActive ? 1.05 : 1
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex items-center">
          {parts.map((part, idx) => {
            const isEmoji = emojiRegex.test(part);
            emojiRegex.lastIndex = 0; // Reset regex state
            
            if (isEmoji) {
              return (
                <span key={idx} className="text-[#0c0d0d] mx-[0.05em]" style={{ WebkitTextFillColor: "initial" }}>
                  {part}
                </span>
              );
            }
            
            return (
              <span 
                key={idx} 
                className={isRevealed && isHighlighted ? 'bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]' : ''}
              >
                {part}
              </span>
            );
          })}
        </span>
      </motion.span>
    </span>
  );
}
