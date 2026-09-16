"use client";

import { motion } from "framer-motion";

const OPERATION_NUMBERS = [
  {
    value: "24/7",
    title: "disponibilidade para responder",
    text: "O lead recebe atenção no momento em que demonstra interesse",
  },
  {
    value: "1",
    title: "contexto centralizado por lead",
    text: "Origem, conversa, interesse e próximo passo chegam juntos ao comercial",
  },
  {
    value: "4",
    title: "etapas conectadas da venda",
    text: "Atendimento, qualificação, acompanhamento e agenda no mesmo fluxo",
  },
];

export function OperationNumbers() {
  return (
    <section className="bg-white px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#0c0d0d] md:text-5xl">
            A sua operação, em <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">números que importam</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          className="mt-10 grid overflow-hidden rounded-3xl border border-zinc-200 bg-[#F7F7FB] md:mt-12 md:grid-cols-3"
        >
          {OPERATION_NUMBERS.map((item, index) => (
            <div key={item.title} className={`px-7 py-9 text-center md:px-8 md:py-12 ${index > 0 ? "border-t border-zinc-200 md:border-l md:border-t-0" : ""}`}>
              <p className="text-5xl font-bold tracking-tighter text-[#0c0d0d] md:text-6xl">{item.value}</p>
              <h3 className="mt-3 text-base font-bold text-[#0c0d0d]">{item.title}</h3>
              <p className="mx-auto mt-3 max-w-[240px] text-sm leading-relaxed text-zinc-500">{item.text}</p>
            </div>
          ))}
        </motion.div>

        <p className="mx-auto mt-7 max-w-2xl text-center text-xs leading-relaxed text-zinc-400">
          Da primeira mensagem à reunião preparada, cada oportunidade segue com contexto
        </p>
      </div>
    </section>
  );
}
