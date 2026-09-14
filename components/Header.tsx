"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CountryFlag } from "@/components/CountryFlag";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/LanguageContext";
import { trackFunnelEvent } from "@/lib/utm";
import { SOLUTIONS, PAGES_WITH_FEATURES_SECTION } from "./navData";
import { MobileNavDrawer } from "./MobileNavDrawer";

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


function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

// Painel do megamenu "Soluções" -- largura total do header (nao so a
// largura do botao), aberto/fechado por hover (ver onEnter/onLeave, geridos
// no Header com um pequeno delay pra nao fechar ao atravessar o espaco
// entre o botao e o painel). Sem position:absolute: como o <header> em si
// ja e absolute/fixed, o painel em fluxo normal nao empurra o resto da
// pagina, so cresce dentro do proprio header.
function SolutionsPanel({ onEnter, onLeave }: { onEnter: () => void; onLeave: () => void }) {
  const { t } = useLanguage();

  const openQualification = () => {
    trackFunnelEvent("click_pricing_cta", { cta_source: "nav_solutions_menu", plan_name: "TLIN" });
    window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source: "nav_solutions_menu" } }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      // Largura real da viewport (nao so o max-w-6xl do header), reto e sem
      // borda/sombra -- visualmente e uma continuacao do proprio header, nao
      // um card flutuando por cima da pagina. Formula classica de "full
      // bleed" (estica e recentraliza com margem negativa), funciona porque
      // o header (pai) ja e centralizado na tela via mx-auto -- usa a CSS var
      // --tlin-vw (window.innerWidth) em vez de 100vw, que inclui a
      // scrollbar e estouraria a pagina em alguns pixels.
      className="pointer-events-auto bg-white"
      style={{
        width: "var(--tlin-vw, 100vw)",
        marginLeft: "calc(-0.5 * var(--tlin-vw, 100vw) + 50%)",
        marginRight: "calc(-0.5 * var(--tlin-vw, 100vw) + 50%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-[1fr_260px] gap-6">
        <div>
          <p className="px-1 pb-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wide">{t.nav.solutionsEyebrow}</p>
          <div className="grid grid-cols-3 gap-1">
            {SOLUTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => trackFunnelEvent("nav_solution_click", { solution: s.href, cta_source: "nav_solutions_menu" })}
                className="group flex flex-col gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B597FF]/10 to-[#38E3FF]/10 flex items-center justify-center text-[#0c0d0d] group-hover:from-[#B597FF]/20 group-hover:to-[#38E3FF]/20 transition-colors">
                  <s.Icon />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0c0d0d] flex items-center gap-1">
                    {t.footer[s.nameKey]}
                    <svg className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{t.nav[s.descKey]}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#0c0d0d] p-5 flex flex-col justify-between">
          <div>
            <p className="text-white font-bold text-base leading-snug">{t.nav.solutionsCtaTitle}</p>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{t.nav.solutionsCtaDesc}</p>
          </div>
          <button
            onClick={openQualification}
            className="relative mt-4 p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer"
          >
            <div
              className="absolute inset-[-150%] opacity-100 transition-opacity animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 180deg, transparent 240deg 360deg)` }}
            />
            <div className="relative px-4 py-2.5 rounded-full bg-white text-[#0c0d0d] text-sm font-bold text-center">
              {t.nav.solutionsCtaButton}
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NavLinks({
  isSolutionsOpen,
  onSolutionsEnter,
  onSolutionsLeave,
}: {
  isSolutionsOpen: boolean;
  onSolutionsEnter: () => void;
  onSolutionsLeave: () => void;
}) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const linkClass = "relative py-2 px-4 rounded-full hover:bg-zinc-100 hover:text-[#0c0d0d] transition-colors duration-200";
  // Ancora pura quando a secao existe na pagina atual; senao volta pra home
  // com a ancora, em vez de um link morto (ver PAGES_WITH_FEATURES_SECTION).
  const sectionHref = (id: string) => (PAGES_WITH_FEATURES_SECTION.includes(pathname) ? `#${id}` : `/#${id}`);

  return (
    <nav aria-label="Navegação principal" className="flex items-center gap-2 font-semibold text-sm text-zinc-600 relative">
      <div onMouseEnter={onSolutionsEnter} onMouseLeave={onSolutionsLeave}>
        <button
          onFocus={onSolutionsEnter}
          onBlur={onSolutionsLeave}
          className="relative py-2 px-4 rounded-full hover:bg-zinc-100 hover:text-[#0c0d0d] transition-colors duration-200 flex items-center gap-1.5"
        >
          {t.nav.solutions}
          <svg className={`w-3 h-3 transition-transform ${isSolutionsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <a
        href={sectionHref("como-funciona")}
        onClick={() => trackFunnelEvent("nav_link_click", { destination: "como-funciona", cta_source: "nav" })}
        className={linkClass}
      >
        {t.nav.comoFunciona}
      </a>
      <a
        href={sectionHref("planos")}
        onClick={() => trackFunnelEvent("nav_link_click", { destination: "planos", cta_source: "nav" })}
        className={linkClass}
      >
        {t.nav.planos}
      </a>
      <button
        type="button"
        onClick={() => {
          trackFunnelEvent("nav_ai_click", { cta_source: "nav" });
          window.dispatchEvent(new CustomEvent("open-lia-chat"));
        }}
        className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-gradient-to-r from-[#B597FF]/10 to-[#38E3FF]/10 text-[#0c0d0d] hover:from-[#B597FF]/20 hover:to-[#38E3FF]/20 transition-colors duration-200"
      >
        {t.nav.ia}
      </button>
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
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const solutionsCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pequeno delay ao fechar (em vez de fechar na hora do mouseleave) pra
  // nao fechar o menu quando o cursor atravessa o espaco entre o botao
  // "Soluções" e o painel logo abaixo dele.
  const openSolutions = () => {
    if (solutionsCloseTimeout.current) {
      clearTimeout(solutionsCloseTimeout.current);
      solutionsCloseTimeout.current = null;
    }
    if (!isSolutionsOpen) trackFunnelEvent("nav_solutions_menu_open", {});
    setIsSolutionsOpen(true);
  };
  const closeSolutionsWithDelay = () => {
    solutionsCloseTimeout.current = setTimeout(() => setIsSolutionsOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (solutionsCloseTimeout.current) clearTimeout(solutionsCloseTimeout.current);
    };
  }, []);

  // "100vw" inclui a largura da scrollbar (window.innerWidth tambem inclui --
  // quem exclui e document.documentElement.clientWidth), entao o truque de
  // full-bleed do megamenu com vw puro estoura a pagina em uns 8px enquanto
  // o menu esta aberto. Guarda a largura real do conteudo numa CSS var e usa
  // ela em vez de vw (ver SolutionsPanel).
  useEffect(() => {
    const setViewportWidthVar = () => {
      document.documentElement.style.setProperty("--tlin-vw", `${document.documentElement.clientWidth}px`);
    };
    setViewportWidthVar();
    window.addEventListener("resize", setViewportWidthVar);
    return () => window.removeEventListener("resize", setViewportWidthVar);
  }, []);

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

  if (pathname.startsWith("/qualificar") || pathname.startsWith("/demo")) return null;

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
            <NavLinks isSolutionsOpen={isSolutionsOpen} onSolutionsEnter={openSolutions} onSolutionsLeave={closeSolutionsWithDelay} />
          </div>

          <div className="flex items-center gap-2">
             <div className="hidden md:block">
               <LanguageSelector />
             </div>
             <button
               type="button"
               aria-label="Abrir menu"
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#0c0d0d] hover:bg-zinc-100 transition-colors"
             >
               <MenuIcon />
             </button>
             <HeaderCTA padding="px-5 py-2.5" />
          </div>
        </div>

        <AnimatePresence>
          {isSolutionsOpen && <SolutionsPanel onEnter={openSolutions} onLeave={closeSolutionsWithDelay} />}
        </AnimatePresence>
      </header>

      {/* 2. Floating Header */}
      <AnimatePresence>
        {showFloating && (
          <motion.header data-mascot-header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none px-4"
          >
            <div className="pointer-events-auto flex items-center justify-between bg-white border border-zinc-200 rounded-full px-4 py-2 w-max gap-8 transition-all hover:bg-zinc-50">

              <div className="flex items-center gap-2 cursor-pointer" data-mascot-hide>
                 <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={72} height={24} />
              </div>

              <div className="hidden lg:block">
                <NavLinks isSolutionsOpen={isSolutionsOpen} onSolutionsEnter={openSolutions} onSolutionsLeave={closeSolutionsWithDelay} />
              </div>

              <div className="flex items-center gap-2">
                 <div className="hidden lg:block">
                   <LanguageSelector />
                 </div>
                 <button
                   type="button"
                   aria-label="Abrir menu"
                   onClick={() => setIsMobileMenuOpen(true)}
                   className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#0c0d0d] hover:bg-zinc-100 transition-colors"
                 >
                   <MenuIcon />
                 </button>
                 <HeaderCTA padding="px-4 py-2" />
              </div>
            </div>

            <AnimatePresence>
              {isSolutionsOpen && <SolutionsPanel onEnter={openSolutions} onLeave={closeSolutionsWithDelay} />}
            </AnimatePresence>
          </motion.header>
        )}
      </AnimatePresence>

      <MobileNavDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}

