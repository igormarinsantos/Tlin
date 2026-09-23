"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { trackFunnelEvent } from "@/lib/utm";
import { SOLUTIONS, PAGES_WITH_FEATURES_SECTION } from "./navData";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { TlinButton } from "@/components/ui/tlin";

function MenuIcon({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-[18px] w-[18px]">
      <span className={`absolute left-0 top-[5px] h-[1.8px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-out ${isOpen ? "translate-y-[3px] rotate-45" : ""}`} />
      <span className={`absolute bottom-[5px] left-0 h-[1.8px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-out ${isOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
    </span>
  );
}

// Painel do megamenu "Soluções", aberto/fechado por hover (ver
// onEnter/onLeave, geridos no Header com um pequeno delay pra nao fechar ao
// atravessar o espaco entre o botao e o painel). Dois formatos:
// - "full" (header do topo, em fluxo normal): largura total da viewport,
//   reto e sem borda/sombra -- visualmente e uma continuacao do proprio
//   header. Formula classica de "full bleed" (estica e recentraliza com
//   margem negativa); usa a CSS var --tlin-vw (window.innerWidth) em vez de
//   100vw, que inclui a scrollbar e estouraria a pagina em alguns pixels.
// - "contained" (header flutuante, que ja e uma pilula centralizada): um
//   card com largura propria, alinhado embaixo da pilula, em vez de
//   quebrar o layout compacto dela com um painel largura-total.
function SolutionsPanel({ onEnter, onLeave, variant = "full", containedWidth }: { onEnter: () => void; onLeave: () => void; variant?: "full" | "contained"; containedWidth?: number }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isContained = variant === "contained";
  // Nas LPs de campanha a hero tem um wash azul clarinho por baixo (ver
  // MarketingLandingPage.tsx), nao branco puro -- o painel "full" abre
  // bem no topo, sobre esse wash, entao usa a mesma cor em vez de
  // bg-white pra nao criar um retangulo branco destacado.
  const isCampaignPage = SOLUTIONS.some((s) => s.href === pathname);
  const isSegmentPage = ["/ia-para-clinicas", "/ia-para-escolas", "/ia-para-assessorias", "/ia-para-advocacia"].includes(pathname);
  const pageSurface = isSegmentPage
    ? "bg-[#F5F0FF]/95"
    : isCampaignPage
      ? "bg-[#F5FDFF]/95"
      : "bg-white/95";

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
      className={
        isContained
          ? `pointer-events-auto relative z-0 -mt-3 w-[min(720px,calc(100vw-2rem))] overflow-hidden pt-3 backdrop-blur-2xl ${pageSurface}`
          : `pointer-events-auto backdrop-blur-xl ${pageSurface}`
      }
      style={
        isContained
          ? (containedWidth ? { width: `${containedWidth}px` } : undefined)
          : {
              width: "var(--tlin-vw, 100vw)",
              marginLeft: "calc(-0.5 * var(--tlin-vw, 100vw) + 50%)",
              marginRight: "calc(-0.5 * var(--tlin-vw, 100vw) + 50%)",
            }
      }
    >
      <div className={isContained ? "p-6 grid grid-cols-[1fr_240px] gap-5" : "max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-[1fr_260px] gap-6"}>
        <div>
          <p className="px-1 pb-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wide">{t.nav.solutionsEyebrow}</p>
          <div className="grid grid-cols-3 gap-1">
            {SOLUTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => trackFunnelEvent("nav_solution_click", { solution: s.href, cta_source: "nav_solutions_menu" })}
                className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors"
              >
                <div className="w-10 h-10 shrink-0 flex items-center justify-center text-[#0c0d0d]">
                  <s.Icon />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0c0d0d]">
                    {t.footer[s.nameKey]}
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
          <TlinButton
            onClick={openQualification}
            variant="secondary"
            size="sm"
            className="mt-4 self-start"
          >
            {t.nav.solutionsCtaButton}
          </TlinButton>
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
  const sectionHref = (id: string) => id === "como-funciona" ? "/como-funciona" : (PAGES_WITH_FEATURES_SECTION.includes(pathname) ? `#${id}` : `/#${id}`);

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
        href="/precos"
        onClick={() => trackFunnelEvent("nav_link_click", { destination: "precos", cta_source: "nav" })}
        className={linkClass}
      >
        {t.nav.pricing}
      </a>
      <button
        type="button"
        onClick={() => {
          trackFunnelEvent("nav_ai_click", { cta_source: "nav" });
          window.dispatchEvent(new CustomEvent("open-lia-chat"));
        }}
        className={linkClass}
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
      <TlinButton
        onClick={() => {
          trackFunnelEvent("click_pricing_cta", {
            cta_source: "header",
            plan_name: "TLIN",
          });
          window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source: "header" } }));
        }}
        fullWidth
        className={isHovered ? "z-[100]" : "z-10"}
        contentClassName={`${padding} text-[13px]`}
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
      >{t.nav.cta}</TlinButton>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{ position: "absolute", left: springX, top: springY, x: "15px", y: "-50%", zIndex: 200, pointerEvents: "none" }}
            className="hidden overflow-hidden rounded-full p-[1px] shadow-xl md:block"
          >
            <span className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]" style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }} />
            <span className="relative block whitespace-nowrap rounded-full border border-white/10 bg-zinc-950 px-2 py-0.5 text-[9px] font-bold leading-none tracking-wide text-white">{t.hero.demoHover}</span>
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
  const floatingHeaderRef = useRef<HTMLDivElement | null>(null);
  const [floatingHeaderWidth, setFloatingHeaderWidth] = useState(0);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const isSegmentPage = ["/ia-para-clinicas", "/ia-para-escolas", "/ia-para-assessorias", "/ia-para-advocacia"].includes(pathname);
  const isCampaignPage = SOLUTIONS.some((solution) => solution.href === pathname);
  const mobileMenuSurface = isSegmentPage
    ? "bg-[#F5F0FF]/95"
    : isCampaignPage
      ? "bg-[#F5FDFF]/95"
      : "bg-white/95";

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
  }, []);

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

  useEffect(() => {
    const element = floatingHeaderRef.current;
    if (!showFloating || !element) return;
    const updateWidth = () => setFloatingHeaderWidth(Math.round(element.getBoundingClientRect().width));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [showFloating]);

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
    const suppressedSection = document.querySelector("[data-suppress-floating-header]");
    const isInsideSuppressedSection = suppressedSection
      ? (() => {
          const rect = suppressedSection.getBoundingClientRect();
          return rect.top < 120 && rect.bottom > 120;
        })()
      : false;

    if (isInsideSuppressedSection) {
      setShowFloating(false);
      return;
    }

    if (latest < 150) {
      setShowFloating(false);
    } else if (latest < previous) {
      setShowFloating(true);
    } else {
      setShowFloating(false);
    }
  });

  if (pathname.startsWith("/qualificar") || pathname.startsWith("/demo") || pathname.startsWith("/obrigado")) return null;

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && !showFloating && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`fixed inset-0 z-[90] backdrop-blur-xl md:hidden ${mobileMenuSurface}`}
          />
        )}
      </AnimatePresence>

      {/* 1. Top Header */}
      <header data-mascot-header
        className="absolute top-[var(--fd-banner-height,0px)] left-0 right-0 z-[100] mx-auto w-full max-w-6xl px-4 pt-6 md:px-6"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              ref={mobileMenuButtonRef}
              type="button"
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#0c0d0d] transition-colors hover:bg-zinc-100 md:hidden"
            >
              <MenuIcon isOpen={isMobileMenuOpen} />
            </button>
            <Link href="/" className="flex items-center gap-2" data-mascot-hide>
               <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={80} height={28} priority />
            </Link>
          </div>

          <div className="hidden md:block">
            <NavLinks isSolutionsOpen={isSolutionsOpen} onSolutionsEnter={openSolutions} onSolutionsLeave={closeSolutionsWithDelay} />
          </div>

          <div className="flex items-center gap-2">
             <a
               href="https://app.tlin.ia.br"
               onClick={() => trackFunnelEvent("nav_link_click", { destination: "login", cta_source: "header" })}
               className="hidden md:block text-sm font-semibold text-zinc-600 hover:text-[#0c0d0d] transition-colors px-2"
             >
               {t.nav.login}
             </a>
             <HeaderCTA padding="px-4 py-2.5 md:px-5" />
          </div>
        </div>

        <AnimatePresence>
          {isSolutionsOpen && <SolutionsPanel onEnter={openSolutions} onLeave={closeSolutionsWithDelay} />}
        </AnimatePresence>
        {!showFloating && <MobileNavDrawer isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />}
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
            <div ref={floatingHeaderRef} className="pointer-events-auto relative z-10 flex w-max items-center justify-between gap-8 rounded-full border border-zinc-200 bg-white px-4 py-2">

              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2" data-mascot-hide>
                   <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={72} height={24} />
                </Link>
              </div>

              <div className="hidden lg:block">
                <NavLinks isSolutionsOpen={isSolutionsOpen} onSolutionsEnter={openSolutions} onSolutionsLeave={closeSolutionsWithDelay} />
              </div>

              <div className="flex items-center gap-2">
                 <a
                   href="https://app.tlin.ia.br"
                   onClick={() => trackFunnelEvent("nav_link_click", { destination: "login", cta_source: "header" })}
                   className="hidden lg:block text-sm font-semibold text-zinc-600 hover:text-[#0c0d0d] transition-colors px-2"
                 >
                   {t.nav.login}
                 </a>
                 <HeaderCTA padding="px-3 py-2 md:px-4" />
              </div>
            </div>

            <AnimatePresence>
              {isSolutionsOpen && <SolutionsPanel onEnter={openSolutions} onLeave={closeSolutionsWithDelay} variant="contained" containedWidth={floatingHeaderWidth} />}
            </AnimatePresence>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}

