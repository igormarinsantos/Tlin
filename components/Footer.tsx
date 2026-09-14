"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CountryFlag } from "@/components/CountryFlag";
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
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-zinc-100 transition-colors text-sm font-semibold text-zinc-500 focus:outline-none"
      >
        <CountryFlag country={current.flag} />
        <span className="tracking-tight">{lang}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-36 bg-white border border-zinc-200 rounded-2xl overflow-hidden py-1 px-1 z-50 shadow-lg"
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

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white text-[#0c0d0d] py-20 px-10 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Section -- 3 colunas: marca / Solucoes / Institucional, mesmo
            padrao de eyebrow (uppercase, text-zinc-400) ja usado no megamenu
            do Header pra rotular grupos de link. */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-x-8 gap-y-12 mb-20">
          <div className="flex flex-col gap-2 max-w-sm">
            <h3 className="text-2xl font-medium tracking-tight">{t.footer.title}</h3>
            <p className="text-zinc-400 text-sm font-medium">{t.footer.subtitle}</p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wide">{t.footer.solutionsTitle}</h4>
            <Link href="/ia-whatsapp" className="text-sm font-medium text-zinc-500 hover:text-[#0c0d0d] transition-colors">{t.footer.solutionsLink1}</Link>
            <Link href="/recuperacao-de-leads" className="text-sm font-medium text-zinc-500 hover:text-[#0c0d0d] transition-colors">{t.footer.solutionsLink2}</Link>
            <Link href="/crm-com-ia" className="text-sm font-medium text-zinc-500 hover:text-[#0c0d0d] transition-colors">{t.footer.solutionsLink3}</Link>
            <Link href="/infoprodutores" className="text-sm font-medium text-zinc-500 hover:text-[#0c0d0d] transition-colors">{t.footer.solutionsLink4}</Link>
            <Link href="/agentes-de-ia" className="text-sm font-medium text-zinc-500 hover:text-[#0c0d0d] transition-colors">{t.footer.solutionsLink5}</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wide">{t.footer.companyTitle}</h4>
            <Link href="/blog" className="text-sm font-medium text-zinc-500 hover:text-[#0c0d0d] transition-colors">{t.nav.content}</Link>
            <Link href="/legal?tab=termos" className="text-sm font-medium text-zinc-500 hover:text-[#0c0d0d] transition-colors">{t.footer.terms}</Link>
            <Link href="/legal?tab=privacidade" className="text-sm font-medium text-zinc-500 hover:text-[#0c0d0d] transition-colors">{t.footer.privacy}</Link>
            <Link href="/legal?tab=cookies" className="text-sm font-medium text-zinc-500 hover:text-[#0c0d0d] transition-colors">{t.footer.cookies}</Link>
          </div>
        </div>

        {/* Huge Brand Text */}
        <div className="relative w-full overflow-hidden mb-10 md:mb-20 select-none">
          <h2 className="text-[25vw] md:text-[22vw] font-black tracking-tighter leading-[0.8] text-[#0c0d0d] -ml-[0.05em]">
            tlin.ai
          </h2>
        </div>

        {/* Linha de baixo -- so metadado (CNPJ/pais) + idioma, os links ja
            moraram pras colunas Solucoes/Institucional acima. Divisor fino
            (border-zinc-100, mesmo tom usado em cards/dropdowns no resto do
            site) separa do wordmark em vez de mais uma fileira de links. */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-8 border-t border-zinc-100">
          <span className="text-sm font-medium text-zinc-400">
            CNPJ 66.798.512/0001-53 · {t.footer.country}
          </span>

          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}

