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

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M8 7h9v9" />
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
          className="pointer-events-auto absolute left-0 right-0 top-full z-[110] mt-3 max-h-[calc(100svh-7rem)] overflow-y-auto overflow-x-hidden rounded-[1.75rem] border border-zinc-200/90 bg-white shadow-[0_22px_70px_rgba(17,24,39,0.16)]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(56,227,255,0.22),transparent_66%),linear-gradient(100deg,rgba(181,151,255,0.18),transparent_42%)]" />
          <div className="relative px-4 pb-4 pt-4">
            <div className="mb-5 flex items-end justify-between px-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400">{t.nav.solutionsEyebrow}</p>
                <p className="mt-1 text-base font-bold tracking-tight text-[#0c0d0d]">{t.nav.solutions}</p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/80 text-[#0c0d0d] shadow-sm">
                <SparkleIcon className="h-4 w-4" />
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {SOLUTIONS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={() => trackAndClose("nav_solution_click", { solution: s.href })}
                  className="group relative flex min-h-[118px] flex-col items-start overflow-hidden rounded-[1.25rem] border border-zinc-200/70 bg-white p-3.5 shadow-[0_1px_0_rgba(255,255,255,0.9)] transition-all duration-200 active:scale-[0.98] hover:-translate-y-0.5 hover:border-[#B597FF]/45 hover:shadow-[0_12px_24px_rgba(82,75,115,0.10)]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B597FF]/18 via-[#D9CFFF]/25 to-[#38E3FF]/25 text-[#0c0d0d]">
                    <s.Icon />
                  </div>
                  <span className="mt-3 pr-4 text-[13px] font-bold leading-tight text-[#0c0d0d]">{t.footer[s.nameKey]}</span>
                  <span className="mt-1 text-[10px] leading-snug text-zinc-500">{t.nav[s.descKey]}</span>
                  <span className="absolute right-3 top-3 text-zinc-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0c0d0d]">
                    <ArrowUpRightIcon />
                  </span>
                </a>
              ))}
            </div>

            <div className="my-4 grid grid-cols-2 gap-2.5 border-t border-zinc-100 pt-4">
              <a
                href={sectionHref("como-funciona")}
                onClick={() => trackAndClose("nav_link_click", { destination: "como-funciona" })}
                className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-3 text-[13px] font-bold text-[#0c0d0d] transition-colors active:bg-zinc-100"
              >
                {t.nav.comoFunciona}
                <ArrowUpRightIcon />
              </a>
              <a
                href="/precos"
                onClick={() => trackAndClose("nav_link_click", { destination: "precos" })}
                className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-3 text-[13px] font-bold text-[#0c0d0d] transition-colors active:bg-zinc-100"
              >
                {t.nav.pricing}
                <ArrowUpRightIcon />
              </a>
              <button
                type="button"
                onClick={openLiaChat}
                className="col-span-2 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#B597FF]/20 via-[#D9CCFF]/20 to-[#38E3FF]/25 px-3.5 py-3 text-[13px] font-bold text-[#0c0d0d] transition-transform active:scale-[0.99]"
              >
                <span className="flex items-center gap-2"><SparkleIcon className="h-4 w-4" />{t.nav.ia}</span>
                <ArrowUpRightIcon />
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between border-t border-zinc-100 pt-4">
              <span className="pl-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">Idioma</span>
              <div className="flex items-center gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 transition-all ${
                    lang === l.code ? "border-[#0c0d0d] bg-[#0c0d0d] text-white shadow-sm" : "border-zinc-200 bg-white text-zinc-500"
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
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#0c0d0d] py-3.5 text-center text-[13px] font-bold text-white transition-transform active:scale-[0.98]"
            >
              {t.nav.cta}
              <span className="transition-transform duration-200 group-hover:translate-x-0.5"><ArrowUpRightIcon /></span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
