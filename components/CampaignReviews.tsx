"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// Google fica menor (o "G" colorido pesa mais visualmente), X um pouco maior.
const SOURCE_LOGOS = [
  { src: "/logos/google.svg", className: "w-4 h-4" },
  { src: "/logos/x.svg", className: "w-6 h-6" },
];

// Distribuicao deterministica (hash do nome) em vez de Math.random() no
// render -- evita mismatch de hidratacao entre server e client.
function pickLogo(seed: string) {
  const sum = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return SOURCE_LOGOS[sum % SOURCE_LOGOS.length];
}

function ReviewCard({ name, role, text }: { name: string; role: string; text: string }) {
  const logo = pickLogo(name);
  return (
    <div className="relative w-[300px] md:w-[360px] shrink-0 rounded-2xl bg-zinc-50 border border-zinc-100 p-6 md:p-7 flex flex-col gap-5">
      <img src={logo.src} alt="" className={`absolute top-5 right-5 md:top-6 md:right-6 ${logo.className}`} />

      <p className="text-base md:text-lg text-zinc-700 font-medium leading-relaxed pr-10 md:pr-12">"{text}"</p>
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

// Duas fileiras de carrossel infinito com avaliacoes escritas por LP.
// Fica logo depois do "Conheca a Tlin", so nas paginas de campanha.
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
