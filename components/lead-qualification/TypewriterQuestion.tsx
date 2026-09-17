"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HighlightText } from "./HighlightText";

// Typewriter component with Mascot Cursor
export const TypewriterQuestion = ({ text, light = false, bubble = false }: { text: string; light?: boolean; bubble?: boolean }) => {
  const [displayedText, setDisplayedText] = useState("");
  const rawText = text.replace(/\[|\]/g, "");

  useEffect(() => {
    let i = 0;
    const charsPerTick = window.innerWidth < 640 ? 3 : 2;
    const interval = setInterval(() => {
      i += charsPerTick;
      setDisplayedText(rawText.slice(0, i));
      if (i >= rawText.length) clearInterval(interval);
    }, 32);
    return () => clearInterval(interval);
  }, [rawText]);

  const isDone = displayedText === rawText;

  return (
    <div className={bubble
      ? `relative inline-block text-xl sm:text-2xl font-semibold leading-relaxed ${light ? "text-zinc-900" : "text-white"}`
      : `relative inline-block text-xl sm:text-4xl font-black tracking-tight leading-[1.2] [text-wrap:pretty] ${light ? "text-zinc-950" : "text-white"}`}>
      {isDone ? <HighlightText text={text} /> : displayedText}
      <span className={`inline-block ml-2 align-middle shrink-0 ${bubble ? "w-4 h-4" : "w-5 h-5 sm:w-7 sm:h-7"}`}>
        <Image src="/TlinIA.svg" alt="Mascot" width={32} height={32} className="w-full h-full object-contain" />
      </span>
    </div>
  );
};
