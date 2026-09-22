"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";

// Google fica menor (o "G" colorido pesa mais visualmente), X um pouco maior.
const SOURCE_LOGOS = [
  { src: "/logos/google.svg", className: "w-4 h-4" },
  { src: "/logos/x.svg", className: "w-6 h-6" },
];

// Nomes masculinos dos depoimentos (o resto cai em feminino) -- so pra
// escolher a pasta certa (men/women) do banco de fotos.
const REVIEW_MALE_FIRST_NAMES = new Set([
  "Thiago", "Bruno", "Diego", "Rodrigo", "Felipe", "Marcelo", "Gustavo", "André",
  "Rafael", "Vinícius", "Leonardo", "Eduardo", "Henrique", "Otávio", "Caio",
]);

// Distribuicao deterministica (hash do nome) em vez de Math.random() no
// render -- evita mismatch de hidratacao entre server e client.
function hashSeed(seed: string) {
  return seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}
function pickLogo(seed: string) {
  return SOURCE_LOGOS[hashSeed(seed) % SOURCE_LOGOS.length];
}
// Fotos reais (banco publico randomuser.me, pensado exatamente pra avatar
// de placeholder) escolhidas de forma deterministica pelo nome.
function pickAvatar(name: string) {
  const gender = REVIEW_MALE_FIRST_NAMES.has(name.split(" ")[0]) ? "men" : "women";
  const index = hashSeed(name) % 100;
  return `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
}

const ILLUSTRATIVE_RESULTS = [
  [{ value: "+42%", label: "respostas no mesmo dia" }, { value: "2,3x", label: "mais leads qualificados" }],
  [{ value: "31%", label: "menos tempo até responder" }, { value: "+27%", label: "avanço para reunião" }],
  [{ value: "4,8x", label: "mais contexto para vendas" }, { value: "18h", label: "economizadas por semana" }],
  [{ value: "+36%", label: "conversas retomadas" }, { value: "64%", label: "leads com próximo passo" }],
] as const;

function ReviewCard({ name, role, text, showResults = true }: { name: string; role: string; text: string; showResults?: boolean }) {
  const logo = pickLogo(name);
  const results = ILLUSTRATIVE_RESULTS[hashSeed(name) % ILLUSTRATIVE_RESULTS.length];
  return (
    <div className={`relative flex w-[300px] shrink-0 flex-col rounded-2xl border border-[#B597FF]/20 bg-[#F7FAFF] p-6 md:w-[360px] md:p-7 ${showResults ? "min-h-[320px]" : "min-h-[230px]"}`}>
      <img src={logo.src} alt="" className={`absolute top-5 right-5 md:top-6 md:right-6 ${logo.className}`} />
      <div className="flex items-center gap-3 pr-10 md:pr-12">
        <img src={pickAvatar(name)} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#0c0d0d]">{name}</p>
          <p className="text-xs text-zinc-500">{role}</p>
        </div>
      </div>
      <p className="mt-6 text-base font-medium leading-relaxed text-zinc-700 md:text-lg">“{text}”</p>
      {showResults && (
        <div className="mt-auto border-t border-[#B597FF]/20 pt-4"><div className="grid grid-cols-2 gap-4">{results.map((result) => <div key={result.label}><p className="text-2xl font-bold tracking-tight text-[#7254c8]">{result.value}</p><p className="mt-1 text-xs font-medium leading-snug text-zinc-500">{result.label}</p></div>)}</div></div>
      )}
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
  const showResults = !["clinicas", "escolas", "assessorias", "advocacia"].includes(variant);

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
              <ReviewCard key={i} {...r} showResults={showResults} />
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
              <ReviewCard key={i} {...r} showResults={showResults} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
