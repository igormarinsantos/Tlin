"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
    <footer className="w-full bg-white px-5 py-14 text-[#0c0d0d] md:px-12 md:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:gap-20">
          <div className="flex max-w-sm flex-col items-start">
            <Image src="/Logo%20Horizontal.svg" alt="Tlin.ai" width={88} height={30} className="h-auto w-[88px]" />
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-16 md:gap-x-20">
            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] font-bold tracking-wide text-zinc-400">{t.footer.solutionsTitle}</h4>
              <Link href="/ia-whatsapp" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.solutionsLink1}</Link>
              <Link href="/recuperacao-de-leads" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.solutionsLink2}</Link>
              <Link href="/crm-com-ia" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.solutionsLink3}</Link>
              <Link href="/infoprodutores" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.solutionsLink4}</Link>
              <Link href="/agentes-de-ia" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.solutionsLink5}</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] font-bold tracking-wide text-zinc-400">{t.footer.segmentsTitle}</h4>
              <Link href="/ia-para-clinicas" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.segmentsLink1}</Link>
              <Link href="/ia-para-escolas" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.segmentsLink2}</Link>
              <Link href="/ia-para-assessorias" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.segmentsLink3}</Link>
              <Link href="/ia-para-advocacia" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.segmentsLink4}</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] font-bold tracking-wide text-zinc-400">{t.footer.companyTitle}</h4>
              <Link href="/blog" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.nav.content}</Link>
              <Link href="/legal?tab=termos" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.terms}</Link>
              <Link href="/legal?tab=privacidade" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.privacy}</Link>
              <Link href="/legal?tab=cookies" className="text-sm font-semibold text-[#0c0d0d] transition-colors hover:text-[#B597FF]">{t.footer.cookies}</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 md:mt-16 md:flex-row md:items-center">
          <span className="text-sm font-medium text-zinc-400">
            CNPJ 66.798.512/0001-53 · {t.footer.country}
          </span>

          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}

