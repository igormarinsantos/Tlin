"use client";

import { motion } from "framer-motion";
import { Play, User } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// Case real (Daiane Sarmento / Embarpet) -- versao basica, sem video nem
// numero ainda (aguardando confirmacao dela). O thumb 16:9 fica com um
// selo "video em breve" honesto em vez de simular um play funcional.
// So aparece nas 5 LPs de campanha, no mesmo fundo preto onde a home
// mostra a calculadora de ROI (MarketingLandingPage decide qual dos dois
// renderizar ali dentro).
export function CaseStudy() {
  const { t } = useLanguage();
  const c = t.caseStudy;

  return (
    <section className="w-full bg-black py-16 md:py-24" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative inline-flex rounded-full overflow-hidden p-[1px]"
          >
            <div
              className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }}
            />
            <div className="relative rounded-full bg-[#111016]/95 border border-white/10 px-4 py-2 text-[11px] font-bold tracking-wide text-white/80">
              {c.eyebrow}
            </div>
          </motion.div>
        </div>

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
          <div className="relative w-full h-full bg-[#111016] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-bold tracking-wide">
              {c.comingSoonBadge}
            </span>
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
          <p className="text-xs text-white/40 leading-relaxed max-w-md">{c.disclaimer}</p>
        </motion.div>
      </div>
    </section>
  );
}
