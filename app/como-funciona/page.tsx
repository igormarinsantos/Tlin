"use client";

import { useState } from "react";
import { ArrowRight, Bot, CalendarCheck2, CheckCircle2, ChevronRight, HeartHandshake, LayoutDashboard, MessageCircleMore, UserRoundCheck } from "lucide-react";
import { trackFunnelEvent } from "@/lib/utm";

const steps = [
  { label: "Lead chega", title: "Toda conversa começa com contexto.", text: "A Tlin identifica a origem do lead e organiza a entrada para que mídia, campanha e interesse não se percam no caminho.", Icon: MessageCircleMore, tag: "CAPTURA" },
  { label: "IA atende", title: "Resposta rápida, com conversa que avança.", text: "A IA conduz o primeiro contato, entende intenção, responde dúvidas e qualifica sem deixar o lead esfriar no WhatsApp.", Icon: Bot, tag: "QUALIFICAÇÃO" },
  { label: "CRM orienta", title: "O comercial enxerga o que importa.", text: "Cada etapa fica registrada no CRM: lead captado, qualificado, demo e resultado. Sua equipe trabalha com prioridade, não com adivinhação.", Icon: LayoutDashboard, tag: "OPERAÇÃO" },
  { label: "Humano entra", title: "Automação onde acelera. Pessoas onde decidem.", text: "A equipe humana acompanha a operação, melhora as conversas e entra nos pontos que pedem estratégia, contexto e fechamento.", Icon: HeartHandshake, tag: "ACOMPANHAMENTO" },
  { label: "Demo acontece", title: "A reunião chega mais preparada.", text: "Quando existe fit, a Tlin agenda a demo e entrega para o time comercial um lead com contexto, necessidade e próximo passo claros.", Icon: CalendarCheck2, tag: "CONVERSÃO" },
] as const;

export default function ComoFuncionaPage() {
  const [active, setActive] = useState(0);
  const current = steps[active];
  const CurrentIcon = current.Icon;

  return (
    <main className="min-h-screen bg-[#0c0d0d] text-white">
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
        <div className="absolute inset-0 opacity-80" style={{ background: "radial-gradient(circle at 22% 18%, rgba(181,151,255,.28), transparent 30%), radial-gradient(circle at 85% 40%, rgba(56,227,255,.15), transparent 34%)" }} />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-black tracking-[.2em] text-[#b597ff]">COMO FUNCIONA</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[.94] tracking-tight sm:text-7xl">Não é só uma IA respondendo. É uma operação comercial que acompanha cada oportunidade.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-zinc-300">Veja como tráfego, conversa, CRM, follow-up e pessoas trabalham juntos para transformar mais leads em vendas.</p>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <nav aria-label="Etapas da operação" className="rounded-3xl border border-white/10 bg-white/[.04] p-3">
            {steps.map((step, index) => {
              const Icon = step.Icon;
              const selected = index === active;
              return <button key={step.label} onClick={() => { setActive(index); trackFunnelEvent("how_it_works_step_view", { step: index + 1, step_name: step.tag }); }} className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition ${selected ? "bg-white text-zinc-950" : "text-zinc-400 hover:bg-white/[.06] hover:text-white"}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-[#b597ff]" : "bg-white/10"}`}><Icon size={19} /></span>
                <span className="min-w-0"><span className="block text-[10px] font-black tracking-[.16em] opacity-60">0{index + 1}</span><span className="block font-bold">{step.label}</span></span>
                <ChevronRight className="ml-auto" size={17} />
              </button>;
            })}
          </nav>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#17151d] p-7 sm:p-12">
            <div className="absolute right-[-8%] top-[-10%] h-72 w-72 rounded-full bg-[#b597ff]/15 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between"><span className="rounded-full border border-[#38e3ff]/35 bg-[#38e3ff]/10 px-3 py-1 text-[10px] font-black tracking-[.16em] text-[#38e3ff]">{current.tag}</span><span className="text-sm text-zinc-500">Etapa {active + 1} de {steps.length}</span></div>
              <div className="mt-14 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#b597ff] to-[#38e3ff] text-zinc-950"><CurrentIcon size={31} /></div>
              <h2 className="mt-8 max-w-xl text-4xl font-black leading-tight sm:text-5xl">{current.title}</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">{current.text}</p>
              <div className="mt-12 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><Bot size={18} className="text-[#b597ff]"/><p className="mt-3 text-sm font-bold">IA em ação</p><p className="mt-1 text-xs text-zinc-500">Velocidade e consistência.</p></div><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><UserRoundCheck size={18} className="text-[#38e3ff]"/><p className="mt-3 text-sm font-bold">Equipe humana</p><p className="mt-1 text-xs text-zinc-500">Estratégia e evolução.</p></div><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><CheckCircle2 size={18} className="text-[#b597ff]"/><p className="mt-3 text-sm font-bold">Tudo rastreável</p><p className="mt-1 text-xs text-zinc-500">Do lead ao resultado.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white px-5 py-20 text-zinc-950 sm:px-8"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end"><div><p className="text-xs font-black tracking-[.18em] text-[#7254c8]">PRÓXIMO PASSO</p><h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">Vamos mostrar o que essa operação faria no seu comercial.</h2></div><button onClick={() => { trackFunnelEvent("how_it_works_demo_click", { cta_source: "how_it_works" }); window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source: "how_it_works" } })); }} className="inline-flex items-center gap-3 rounded-full bg-[#0c0d0d] px-6 py-4 font-black text-white transition hover:scale-[1.02]">Agendar uma demo <ArrowRight size={18}/></button></div></section>
    </main>
  );
}
