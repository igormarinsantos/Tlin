"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/LanguageContext";
import { CountryFlag } from "@/components/CountryFlag";
import { trackFunnelEvent } from "@/lib/utm";
import { SOLUTIONS, PAGES_WITH_FEATURES_SECTION } from "./navData";

const LANGUAGES: { code: Lang; flag: string }[] = [
  { code: "PT", flag: "br" },
  { code: "EN", flag: "us" },
  { code: "ES", flag: "es" },
];

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

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
  const pathname = usePathname();
  const [isSolutionsExpanded, setIsSolutionsExpanded] = useState(false);
  const sectionHref = (id: string) => (PAGES_WITH_FEATURES_SECTION.includes(pathname) ? `#${id}` : `/#${id}`);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.985 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="pointer-events-auto absolute left-0 right-0 top-full z-[110] mt-3 max-h-[calc(100svh-7rem)] overflow-y-auto overscroll-contain rounded-[1.5rem] border border-zinc-200 bg-white shadow-[0_22px_70px_rgba(17,24,39,0.15)]"
        >
          <div className="px-5 pb-5 pt-3">
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
                href={sectionHref("como-funciona")}
                onClick={() => trackAndClose("nav_link_click", { destination: "como-funciona" })}
                className="flex items-center justify-between py-4 text-[15px] font-semibold text-[#0c0d0d] transition-colors"
              >
                {t.nav.comoFunciona}
                <ArrowUpRightIcon />
              </a>
              <a
                href="/precos"
                onClick={() => trackAndClose("nav_link_click", { destination: "precos" })}
                className="flex items-center justify-between py-4 text-[15px] font-semibold text-[#0c0d0d] transition-colors"
              >
                {t.nav.pricing}
                <ArrowUpRightIcon />
              </a>
              <button
                type="button"
                onClick={openLiaChat}
                className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold text-[#0c0d0d] transition-colors"
              >
                <span>{t.nav.ia}</span>
                <ArrowUpRightIcon />
              </button>
            </nav>

            <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-4">
              <a
                href="https://app.tlin.ia.br"
                onClick={() => trackAndClose("nav_link_click", { destination: "login" })}
                className="text-[13px] font-semibold text-zinc-600"
              >
                {t.nav.login}
              </a>
              <div className="flex items-center gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`flex items-center gap-1.5 rounded-full border px-2 py-1.5 transition-all ${
                    lang === l.code ? "border-[#0c0d0d] bg-[#0c0d0d] text-white" : "border-zinc-200 bg-white text-zinc-500"
                  }`}
                >
                  <CountryFlag country={l.flag} />
                  <span className="text-[11px] font-bold">{l.code}</span>
                </button>
              ))}
              </div>
            </div>

            <button
              type="button"
              onClick={openQualification}
              className="group relative mt-5 block w-full overflow-hidden rounded-full p-[1px] transition-transform active:scale-[0.98]"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
