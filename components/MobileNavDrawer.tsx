"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/LanguageContext";
import { CountryFlag } from "@/components/CountryFlag";
import { trackFunnelEvent } from "@/lib/utm";
import { SOLUTIONS, PAGES_WITH_FEATURES_SECTION, SparkleIcon } from "./navData";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const LANGUAGES: { code: Lang; flag: string }[] = [
  { code: "PT", flag: "br" },
  { code: "EN", flag: "us" },
  { code: "ES", flag: "es" },
];

// Unico jeito de navegar pelas solucoes/paginas no mobile -- o nav de
// desktop (megamenu incluso) e "hidden md:block"/"hidden lg:block" nos dois
// headers, entao abaixo disso so sobrava logo + idioma + CTA. Reaproveita
// SOLUTIONS/PAGES_WITH_FEATURES_SECTION de navData.ts (mesmo dado do
// megamenu desktop, sem conteudo novo).
export function MobileNavDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, lang, setLang } = useLanguage();
  const pathname = usePathname();
  const sectionHref = (id: string) => (PAGES_WITH_FEATURES_SECTION.includes(pathname) ? `#${id}` : `/#${id}`);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-white overflow-y-auto"
        >
          <div className="flex items-center justify-between px-4 pt-6 pb-2">
            <span className="text-lg font-black tracking-tight text-[#0c0d0d]">tlin.ai</span>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#0c0d0d] hover:bg-zinc-100 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="px-4 pb-10">
            <p className="mt-6 mb-2 px-3 text-xs font-bold uppercase tracking-wide text-zinc-400">{t.nav.solutions}</p>
            <div className="flex flex-col gap-1 mb-6">
              {SOLUTIONS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={() => trackAndClose("nav_solution_click", { solution: s.href })}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B597FF]/10 to-[#38E3FF]/10 flex items-center justify-center text-[#0c0d0d] shrink-0">
                    <s.Icon />
                  </div>
                  <span className="text-sm font-bold text-[#0c0d0d]">{t.footer[s.nameKey]}</span>
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-1 border-t border-zinc-100 pt-4 mb-6">
              <a
                href={sectionHref("como-funciona")}
                onClick={() => trackAndClose("nav_link_click", { destination: "como-funciona" })}
                className="px-3 py-3 rounded-2xl text-sm font-bold text-[#0c0d0d] hover:bg-zinc-50 transition-colors"
              >
                {t.nav.comoFunciona}
              </a>
              <a
                href={sectionHref("planos")}
                onClick={() => trackAndClose("nav_link_click", { destination: "planos" })}
                className="px-3 py-3 rounded-2xl text-sm font-bold text-[#0c0d0d] hover:bg-zinc-50 transition-colors"
              >
                {t.nav.planos}
              </a>
              <button
                type="button"
                onClick={openLiaChat}
                className="flex items-center gap-2 px-3 py-3 rounded-2xl text-sm font-bold text-[#0c0d0d] bg-gradient-to-r from-[#B597FF]/10 to-[#38E3FF]/10"
              >
                <SparkleIcon className="w-4 h-4" />
                {t.nav.ia}
              </button>
            </div>

            <div className="flex items-center gap-2 border-t border-zinc-100 pt-6 mb-8">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
                    lang === l.code ? "border-[#0c0d0d] bg-zinc-50" : "border-zinc-200"
                  }`}
                >
                  <CountryFlag country={l.flag} />
                  <span className="text-sm font-semibold text-zinc-600">{l.code}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={openQualification}
              className="w-full rounded-full bg-[#0c0d0d] text-white text-sm font-bold py-4 text-center"
            >
              {t.nav.cta}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
