"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/LanguageContext";

function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: { code: Lang; flag: string; name: string }[] = [
    { code: 'PT', flag: '🇧🇷', name: 'Português' },
    { code: 'EN', flag: '🇺🇸', name: 'English' },
    { code: 'ES', flag: '🇪🇸', name: 'Español' },
  ];

  const current = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-zinc-100 transition-colors text-sm font-semibold text-zinc-600 focus:outline-none"
      >
        <span className="text-base leading-none drop-shadow-sm">{current.flag}</span>
        <span className="hidden sm:inline-block tracking-tight">{lang}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-36 bg-white border border-zinc-100 rounded-2xl shadow-xl overflow-hidden py-1 z-50"
          >
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setIsOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
              >
                <span className="text-base leading-none drop-shadow-sm">{l.flag}</span>
                <span className="text-sm font-semibold text-zinc-600">{l.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function NavLinks() {
  const { t } = useLanguage();
  return (
    <nav className="flex items-center gap-2 font-semibold text-sm text-zinc-600 relative">
      <a href="#" className="py-2 px-4 hover:text-[#0c0d0d] transition-colors">{t.nav.product}</a>
      <a href="#features" className="py-2 px-4 hover:text-[#0c0d0d] transition-colors">{t.nav.resources}</a>
      <a href="#pricing" className="py-2 px-4 hover:text-[#0c0d0d] transition-colors">{t.nav.pricing}</a>
    </nav>
  );
}

/**
 * Animated Button for Header (matches Hero design)
 */
function HeaderCTA({ padding = "px-5 py-2.5" }: { padding?: string }) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  return (
    <div className="relative">
      <a 
        href="#pricing"
        className={`relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer ${isHovered ? 'z-[100]' : 'z-10'} block`}
        onMouseEnter={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           mouseX.set(e.clientX - rect.left);
           mouseY.set(e.clientY - rect.top);
           setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
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
          style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 180deg, transparent 240deg 360deg)` }}
        />
        <div className={`relative ${padding} rounded-full bg-[#0c0d0d] text-white text-[12px] font-bold transition-all z-10 group-hover/btn:text-[#0c0d0d] flex items-center justify-center text-center`}>
          <span className="relative z-10">{t.nav.cta}</span>
          <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-300 group-hover/btn:opacity-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
        </div>
      </a>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{ position: "absolute", left: springX, top: springY, x: "15px", y: "-50%", zIndex: 200, pointerEvents: "none" }}
            className="px-2 py-0.5 bg-zinc-950 rounded-full border border-white/10 shadow-xl whitespace-nowrap"
          >
            <span className="text-[9px] font-bold text-white tracking-wide leading-none">{t.nav.demo}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const { scrollY } = useScroll();
  const { t } = useLanguage();
  const [showFloating, setShowFloating] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest < 150) {
      setShowFloating(false);
    } else if (latest < previous) {
      setShowFloating(true);
    } else {
      setShowFloating(false);
    }
  });

  return (
    <>
      {/* 1. Top Header */}
      <header 
        className="absolute top-[var(--fd-banner-height,0px)] left-0 right-0 z-[100] pt-6 px-4 md:px-6 w-full max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 cursor-pointer">
             <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={80} height={28} priority />
          </div>

          <div className="hidden md:block">
            <NavLinks />
          </div>

          <div className="flex items-center gap-2">
             <LanguageSelector />
             <a href="#" className="hidden md:block px-4 py-2 text-sm font-bold text-zinc-600 hover:text-[#0c0d0d] transition-colors">
                {t.nav.login}
             </a>
             <HeaderCTA padding="px-5 py-2.5" />
          </div>
        </div>
      </header>

      {/* 2. Floating Header */}
      <AnimatePresence>
        {showFloating && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4"
          >
            <div className="pointer-events-auto flex items-center justify-between overflow-hidden bg-white border border-zinc-200 shadow-lg rounded-full px-4 py-2 w-max gap-8 transition-all hover:bg-zinc-50">
              
              <div className="flex items-center gap-2 cursor-pointer">
                 <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={72} height={24} />
              </div>

              <div className="hidden lg:block">
                <NavLinks />
              </div>

              <div className="flex items-center gap-2">
                 <LanguageSelector />
                 <HeaderCTA padding="px-4 py-2" />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}

