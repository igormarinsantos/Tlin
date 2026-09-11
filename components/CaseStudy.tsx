"use client";

import { motion } from "framer-motion";
import { Play, User } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// Case real (Daiane Sarmento / Embarpet) -- versao basica, sem video nem
// numero ainda (aguardando confirmacao dela). O thumb 16:9 fica com um
// selo "video em breve" honesto em vez de simular um play funcional.
// Aparece igual em todas as paginas (home + 5 campanhas), pois o case
// (agente de IA como SDR comercial) bate com qualquer uma delas.
export function CaseStudy() {
  const { t } = useLanguage();
  const c = t.caseStudy;

  return (
    <section className="w-full bg-white py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex justify-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative p-[1px] rounded-full overflow-hidden inline-flex"
          >
            <div
              className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }}
            />
            <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide">
              {c.eyebrow}
            </div>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-black tracking-tight text-center text-[#0c0d0d] mb-10 md:mb-14 max-w-2xl mx-auto"
        >
          {c.headline}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 md:gap-10 items-center"
        >
          {/* Thumb 16:9 (1920x1080) -- sem video real ainda, selo honesto */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden p-[2px]">
            <div
              className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
              style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)" }}
            />
            <div className="relative w-full h-full rounded-[calc(1.5rem-2px)] bg-[#0c0d0d] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-bold tracking-wide">
                {c.comingSoonBadge}
              </span>
            </div>
          </div>

          {/* Info do case */}
          <div className="flex flex-col gap-5">
            <p className="text-lg text-zinc-500 font-medium leading-relaxed">
              {c.quote}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="font-bold text-[#0c0d0d] text-sm">{c.name}</p>
                <p className="text-zinc-500 text-sm">{c.role}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{c.disclaimer}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
