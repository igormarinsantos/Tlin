"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white text-[#0c0d0d] py-20 px-10 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium tracking-tight">{t.footer.title}</h3>
            <p className="text-zinc-400 text-sm font-medium">{t.footer.subtitle}</p>
          </div>


        </div>

        {/* Huge Brand Text */}
        <div className="relative w-full overflow-hidden mb-10 md:mb-20 select-none">
          <h2 className="text-[25vw] md:text-[22vw] font-black tracking-tighter leading-[0.8] text-[#0c0d0d] -ml-[0.05em]">
            tlin.ai
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-10 gap-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
            <Link href="/legal?tab=termos" className="text-sm font-medium text-zinc-400 hover:text-[#0c0d0d] transition-colors">{t.footer.terms}</Link>
            <Link href="/legal?tab=privacidade" className="text-sm font-medium text-zinc-400 hover:text-[#0c0d0d] transition-colors">{t.footer.privacy}</Link>
            <Link href="/legal?tab=cookies" className="text-sm font-medium text-zinc-400 hover:text-[#0c0d0d] transition-colors">{t.footer.cookies}</Link>
            <span className="text-sm font-medium text-zinc-400">{t.footer.country}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

