"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CountryFlag } from "@/components/CountryFlag";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/LanguageContext";
import { trackFunnelEvent } from "@/lib/utm";

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
    { code: 'PT', flag: 'br', name: 'Português' },
    { code: 'EN', flag: 'us', name: 'English' },
    { code: 'ES', flag: 'es', name: 'Español' },
  ];

  const current = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button 
        aria-label="Toggle language"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-zinc-100 transition-colors text-sm font-semibold text-zinc-600 focus:outline-none"
      >
        <span className="tracking-tight">{lang}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-36 bg-white border border-zinc-200 rounded-2xl overflow-hidden py-1 px-1 z-50"
          >
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setIsOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 flex items-center gap-3 transition-all duration-200 ease-out"
              >
                <CountryFlag country={l.flag} />
                <span className="text-sm font-semibold text-zinc-600">{l.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// As 5 paginas de campanha, agrupadas por como a pessoa provavelmente
// pensa sobre o que precisa: 4 por funcionalidade (o que a IA faz) + 1 por
// segmento (pra quem) -- a segunda coluna deixa espaco pronto pra crescer
// se surgir uma nova LP de segmento, sem precisar redesenhar o menu.
const SOLUTIONS = [
  { href: "/ia-whatsapp", nameKey: "solutionsLink1", descKey: "solutionsDesc1", group: "feature" },
  { href: "/recuperacao-de-leads", nameKey: "solutionsLink2", descKey: "solutionsDesc2", group: "feature" },
  { href: "/crm-com-ia", nameKey: "solutionsLink3", descKey: "solutionsDesc3", group: "feature" },
  { href: "/agentes-de-ia", nameKey: "solutionsLink5", descKey: "solutionsDesc5", group: "feature" },
  { href: "/infoprodutores", nameKey: "solutionsLink4", descKey: "solutionsDesc4", group: "segment" },
] as const;

// Paginas que renderizam a mesma Features/Pricing da home (mesmos ids
// #como-funciona/#planos) -- nelas o link e uma ancora pura. Em qualquer
// outra pagina (ex.: /comece, /legal) a secao nao existe ali, entao o link
// aponta pra home com a ancora, em vez de "clicar e nao acontecer nada".
const PAGES_WITH_FEATURES_SECTION = ["/", "/ia-whatsapp", "/recuperacao-de-leads", "/crm-com-ia", "/infoprodutores", "/agentes-de-ia"];

function SolutionsMenu() {
  const { t } = useLanguage();
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

  const featureSolutions = SOLUTIONS.filter((s) => s.group === "feature");
  const segmentSolutions = SOLUTIONS.filter((s) => s.group === "segment");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative py-2 px-4 rounded-full hover:bg-zinc-100 hover:text-[#0c0d0d] transition-colors duration-200 flex items-center gap-1.5"
      >
        {t.nav.solutions}
        <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-4 w-[520px] bg-white border border-zinc-200 rounded-3xl overflow-hidden p-4 z-50 grid grid-cols-2 gap-2"
          >
            <div className="flex flex-col gap-0.5">
              <span className="px-3 pt-1 pb-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                {t.nav.solutionsByFeature}
              </span>
              {featureSolutions.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  <p className="text-sm font-bold text-[#0c0d0d]">{t.footer[s.nameKey]}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.nav[s.descKey]}</p>
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="px-3 pt-1 pb-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                {t.nav.solutionsBySegment}
              </span>
              {segmentSolutions.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  <p className="text-sm font-bold text-[#0c0d0d]">{t.footer[s.nameKey]}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.nav[s.descKey]}</p>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLinks() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const linkClass = "relative py-2 px-4 rounded-full hover:bg-zinc-100 hover:text-[#0c0d0d] transition-colors duration-200";
  // Ancora pura quando a secao existe na pagina atual; senao volta pra home
  // com a ancora, em vez de um link morto (ver PAGES_WITH_FEATURES_SECTION).
  const sectionHref = (id: string) => (PAGES_WITH_FEATURES_SECTION.includes(pathname) ? `#${id}` : `/#${id}`);

  return (
    <nav aria-label="Navegação principal" className="flex items-center gap-2 font-semibold text-sm text-zinc-600 relative">
      <SolutionsMenu />
      <a href={sectionHref("como-funciona")} className={linkClass}>
        {t.nav.comoFunciona}
      </a>
      <a href="/blog" className={linkClass}>
        {t.nav.content}
      </a>
      <a href={sectionHref("planos")} className={linkClass}>
        {t.nav.planos}
      </a>
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
      <button 
        onClick={() => {
          trackFunnelEvent("click_pricing_cta", {
            cta_source: "header",
            plan_name: "TLIN",
          });
          window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source: "header" } }));
        }}
        className={`relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer ${isHovered ? 'z-[100]' : 'z-10'} block w-full`}
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
        <div className="absolute inset-[-150%] opacity-100 transition-opacity animate-[spin_3s_linear_infinite]"
          style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 180deg, transparent 240deg 360deg)` }}
        />
        <div className={`relative ${padding} rounded-full bg-[#0c0d0d] text-white text-[14px] font-bold transition-all z-10 group-hover/btn:text-[#0c0d0d] flex items-center justify-center text-center`}>
          <span className="relative z-10">{t.nav.cta}</span>
          <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-300 group-hover/btn:opacity-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
        </div>
      </button>
      
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
  const pathname = usePathname();
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

  if (pathname.startsWith("/blog") || pathname.startsWith("/qualificar") || pathname.startsWith("/demo")) return null;

  return (
    <>
      {/* 1. Top Header */}
      <header data-mascot-header
        className="absolute top-[var(--fd-banner-height,0px)] left-0 right-0 z-[100] pt-6 px-4 md:px-6 w-full max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 cursor-pointer" data-mascot-hide>
             <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={80} height={28} priority />
          </div>

          <div className="hidden md:block">
            <NavLinks />
          </div>

          <div className="flex items-center gap-2">
             <LanguageSelector />
             <HeaderCTA padding="px-5 py-2.5" />
          </div>
        </div>
      </header>

      {/* 2. Floating Header */}
      <AnimatePresence>
        {showFloating && (
          <motion.header data-mascot-header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4"
          >
            <div className="pointer-events-auto flex items-center justify-between bg-white border border-zinc-200 rounded-full px-4 py-2 w-max gap-8 transition-all hover:bg-zinc-50">
              
              <div className="flex items-center gap-2 cursor-pointer" data-mascot-hide>
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

