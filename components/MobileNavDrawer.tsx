"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/LanguageContext";
import { CountryFlag } from "@/components/CountryFlag";
import { trackFunnelEvent } from "@/lib/utm";
import { SOLUTIONS, PAGES_WITH_FEATURES_SECTION, SparkleIcon } from "./navData";

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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto absolute left-0 right-0 top-full z-[110] mt-3 max-h-[calc(100svh-7rem)] overflow-y-auto rounded-[2rem] border border-zinc-200 bg-white shadow-xl"
        >
          <div className="px-5 pb-6 pt-1">
            <p className="mb-3 mt-6 px-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400">{t.nav.solutions}</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {SOLUTIONS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={() => trackAndClose("nav_solution_click", { solution: s.href })}
                  className="flex min-h-[104px] flex-col items-start rounded-2xl border border-zinc-100 bg-[#FCFCFD] p-3 transition-colors hover:border-[#B597FF]/30 hover:bg-[#F7F7FB]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B597FF]/15 to-[#38E3FF]/20 text-[#0c0d0d]">
                    <s.Icon />
                  </div>
                  <span className="mt-2 text-sm font-bold leading-tight text-[#0c0d0d]">{t.footer[s.nameKey]}</span>
                  <span className="mt-1 text-[11px] leading-snug text-zinc-500">{t.nav[s.descKey]}</span>
                </a>
              ))}
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 border-t border-zinc-100 pt-5">
              <a
                href={sectionHref("como-funciona")}
                onClick={() => trackAndClose("nav_link_click", { destination: "como-funciona" })}
                className="rounded-xl border border-zinc-100 px-3 py-3 text-sm font-bold text-[#0c0d0d] transition-colors hover:bg-zinc-50"
              >
                {t.nav.comoFunciona}
              </a>
              <a
                href="/precos"
                onClick={() => trackAndClose("nav_link_click", { destination: "precos" })}
                className="rounded-xl border border-zinc-100 px-3 py-3 text-sm font-bold text-[#0c0d0d] transition-colors hover:bg-zinc-50"
              >
                {t.nav.pricing}
              </a>
              <button
                type="button"
                onClick={openLiaChat}
                className="col-span-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B597FF]/15 to-[#38E3FF]/20 px-3 py-3 text-sm font-bold text-[#0c0d0d]"
              >
                <SparkleIcon className="w-4 h-4" />
                {t.nav.ia}
              </button>
            </div>

            <div className="mb-6 flex items-center gap-2 border-t border-zinc-100 pt-5">
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
              className="w-full rounded-full bg-[#0c0d0d] py-4 text-center text-sm font-bold text-white"
            >
              {t.nav.cta}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
