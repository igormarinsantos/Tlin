"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/LanguageContext";
import { CountryFlag } from "@/components/CountryFlag";
import { trackFunnelEvent } from "@/lib/utm";
import { SOLUTIONS } from "./navData";

const LANGUAGES: { code: Lang; flag: string }[] = [
  { code: "PT", flag: "br" },
  { code: "EN", flag: "us" },
  { code: "ES", flag: "es" },
];

function ChevronIcon({ open = false }: { open?: boolean }) {
  return (
    <svg aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Unico jeito de navegar pelas solucoes/paginas no mobile -- o nav de
// desktop (megamenu incluso) e "hidden md:block"/"hidden lg:block" nos dois
// headers, entao abaixo disso so sobrava logo + idioma + CTA. Reaproveita
// SOLUTIONS/PAGES_WITH_FEATURES_SECTION de navData.ts (mesmo dado do
// megamenu desktop, sem conteudo novo).
export function MobileNavDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, lang, setLang } = useLanguage();
  const [isSolutionsExpanded, setIsSolutionsExpanded] = useState(false);

  const trackAndClose = (eventName: string, data: Record<string, string>) => {
    trackFunnelEvent(eventName, { ...data, cta_source: "mobile_nav_drawer" });
    onClose();
  };

  const openQualification = () => {
    trackFunnelEvent("click_pricing_cta", { cta_source: "mobile_nav_drawer", plan_name: "TLIN" });
    window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source: "mobile_nav_drawer" } }));
    onClose();
  };

  const openLiaChat = () => {
    trackFunnelEvent("nav_ai_click", { cta_source: "mobile_nav_drawer" });
    window.dispatchEvent(new CustomEvent("open-lia-chat"));
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-navigation"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="pointer-events-auto fixed inset-x-0 bottom-0 top-[calc(var(--fd-banner-height,0px)+4rem)] z-[510] overflow-y-auto overscroll-contain bg-transparent md:hidden"
        >
          <div className="flex min-h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
            <nav aria-label="Navegação mobile" className="divide-y divide-zinc-100">
              <button
                type="button"
                onClick={() => setIsSolutionsExpanded((open) => !open)}
                aria-expanded={isSolutionsExpanded}
                className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold text-[#0c0d0d]"
              >
                {t.nav.solutions}
                <ChevronIcon open={isSolutionsExpanded} />
              </button>

              <AnimatePresence initial={false}>
                {isSolutionsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-x-5 gap-y-1 border-t border-zinc-100 py-3">
                      {SOLUTIONS.map((s) => (
                        <a
                          key={s.href}
                          href={s.href}
                          onClick={() => trackAndClose("nav_solution_click", { solution: s.href })}
                          className="group flex items-start gap-2.5 rounded-xl py-2.5 text-left transition-colors active:bg-zinc-50"
                        >
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#B597FF]/20 to-[#38E3FF]/20 text-[#0c0d0d]">
                            <s.Icon />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12px] font-bold leading-tight text-[#0c0d0d]">{t.footer[s.nameKey]}</span>
                            <span className="mt-1 block text-[10px] leading-snug text-zinc-500">{t.nav[s.descKey]}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <a
                href="/como-funciona"
                onClick={() => trackAndClose("nav_link_click", { destination: "como-funciona" })}
                className="flex items-center justify-between py-4 text-[15px] font-semibold text-[#0c0d0d] transition-colors"
              >
                {t.nav.comoFunciona}
              </a>
              <a
                href="/precos"
                onClick={() => trackAndClose("nav_link_click", { destination: "precos" })}
                className="flex items-center justify-between py-4 text-[15px] font-semibold text-[#0c0d0d] transition-colors"
              >
                {t.nav.pricing}
              </a>
              <button
                type="button"
                onClick={openLiaChat}
                className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold text-[#0c0d0d] transition-colors"
              >
                <span>{t.nav.ia}</span>
              </button>
            </nav>

            <div className="mt-auto pt-6">
              <div className="border-t border-zinc-200/70 pt-4">
                <div className="flex items-center justify-center gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLang(l.code)}
                      className={`flex items-center gap-1.5 rounded-full border px-2 py-1.5 transition-all ${
                        lang === l.code ? "border-[#0c0d0d] bg-[#0c0d0d] text-white" : "border-zinc-200 bg-white/70 text-zinc-500"
                      }`}
                    >
                      <CountryFlag country={l.flag} />
                      <span className="text-[11px] font-bold">{l.code}</span>
                    </button>
                  ))}
                </div>

                <a
                  href="https://app.tlin.ia.br"
                  onClick={() => trackAndClose("nav_link_click", { destination: "login" })}
                  className="mt-4 flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white/75 py-3.5 text-[13px] font-bold text-[#0c0d0d] transition-colors active:bg-zinc-100"
                >
                  {t.nav.login}
                </a>
              </div>

              <button
                type="button"
                onClick={openQualification}
                className="group relative mt-3 block w-full overflow-hidden rounded-full p-[1px] transition-transform active:scale-[0.98]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
                  style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)" }}
                />
                <span className="relative flex items-center justify-center rounded-full bg-[#0c0d0d] py-3.5 text-center text-[13px] font-bold text-white transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-[#B597FF] group-hover:to-[#38E3FF] group-hover:text-[#0c0d0d]">
                  {t.nav.cta}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
