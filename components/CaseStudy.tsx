"use client";

import { motion } from "framer-motion";
import { Play, User } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// Case real (Daiane Sarmento / Embarpet) -- versao basica, sem video nem
// numero ainda (aguardando confirmacao dela). So aparece nas 5 LPs de
// campanha, no mesmo fundo preto onde a home mostra a calculadora de ROI
// (MarketingLandingPage decide qual dos dois renderizar ali dentro).
export function CaseStudy() {
  const { t } = useLanguage();
  const c = t.caseStudy;

  return (
    <section className="w-full bg-black py-16 md:py-24" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-black tracking-tight text-center text-white mb-10 md:mb-14"
        >
          {c.headline}
        </motion.h2>

        {/* Thumb 16:9 (1920x1080), centralizado -- sem video real ainda,
            selo "em breve" honesto em vez de simular um play funcional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="relative w-full aspect-video rounded-[2rem] overflow-hidden mx-auto mb-10 border border-white/10"
        >
          <div className="relative w-full h-full bg-[#111016] flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </motion.div>

        {/* Info do case, centralizada embaixo do video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <p className="text-lg text-white/70 font-medium leading-relaxed max-w-xl">
            {c.quote}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white/70" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white text-sm">{c.name}</p>
              <p className="text-white/60 text-sm">{c.role}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
