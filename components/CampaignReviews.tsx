"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function ReviewCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="relative w-[300px] md:w-[360px] shrink-0 rounded-2xl bg-zinc-50 border border-zinc-100 p-6 md:p-7 flex flex-col gap-5">
      {/* Espaco reservado pro logo da plataforma de origem (ex.: Google) --
          fica vazio ate existir avaliacao real de la, pra nao sugerir que
          esse texto ilustrativo veio de uma fonte verificavel. */}
      <div className="absolute top-4 right-4 md:top-5 md:right-5 w-7 h-7 rounded-full bg-zinc-100" />

      <p className="text-base md:text-lg text-zinc-700 font-medium leading-relaxed pr-8">"{text}"</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B597FF] to-[#38E3FF] flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials(name)}
        </div>
        <div>
          <p className="text-sm font-bold text-[#0c0d0d]">{name}</p>
          <p className="text-xs text-zinc-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

// Duas fileiras de carrossel infinito com avaliacoes escritas por LP (nao
// sao reviews reais extraidas de nenhuma plataforma -- sem foto, sem logo
// de Google/X/Reclame Aqui, so nome+cargo+texto, no mesmo espirito honesto
// do Testimonials.tsx generico que ja existe no site). Fica logo depois do
// "Conheca a Tlin", so nas paginas de campanha.
export function CampaignReviews({ variant }: { variant: HeroVariant }) {
  const { t } = useLanguage();
  const reviews = t.campaigns[variant].reviews;
  const mid = Math.ceil(reviews.length / 2);
  const row1 = [...reviews.slice(0, mid), ...reviews.slice(0, mid)];
  const row2 = [...reviews.slice(mid), ...reviews.slice(mid)];

  return (
    <section className="w-full bg-white py-14 md:py-20 overflow-hidden">
      <div className="flex flex-col gap-5 md:gap-6">
        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-5 w-max"
          >
            {row1.map((r, i) => (
              <ReviewCard key={i} {...r} />
            ))}
          </motion.div>
        </div>

        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-5 w-max"
          >
            {row2.map((r, i) => (
              <ReviewCard key={i} {...r} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
