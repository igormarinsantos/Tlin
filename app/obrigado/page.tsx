"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck2, CheckCircle2, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { trackFunnelEvent } from "@/lib/utm";

import { readDemoConfirmation, type DemoConfirmation } from "@/lib/qualification-request";

const content = {
  PT: {
    eyebrow: "DEMO CONFIRMADA",
    title: "Sua próxima conversa sobre crescimento já está marcada.",
    intro: "Reserve este horário para entendermos como a Tlin pode transformar o volume de conversas da sua operação em mais oportunidades comerciais.",
    meeting: "Sua demonstração",
    prepareTitle: "Como aproveitar melhor a conversa",
    prepare: ["Tenha uma noção do volume mensal de leads no WhatsApp.", "Traga os principais gargalos de atendimento e follow-up.", "Se puder, inclua quem participa da decisão comercial."],
    proofTitle: "Cada minuto de resposta conta.",
    proof: "Negócios que reduzem o tempo de resposta e mantêm follow-ups consistentes tendem a aproveitar mais oportunidades já existentes — sem precisar aumentar o investimento em mídia na mesma proporção.",
    support: "Ficou alguma dúvida antes da reunião?",
    whatsapp: "Falar com a equipe no WhatsApp",
    back: "Voltar para a Tlin",
  },
  EN: {
    eyebrow: "DEMO CONFIRMED", title: "Your next growth conversation is booked.", intro: "Use this time to explore how Tlin can turn your WhatsApp conversations into more sales opportunities.", meeting: "Your demo", prepareTitle: "How to get the most from the call", prepare: ["Bring an estimate of your monthly WhatsApp lead volume.", "List the main bottlenecks in response and follow-up.", "Invite anyone involved in the commercial decision."], proofTitle: "Every response minute matters.", proof: "Businesses that reduce response time and keep follow-ups consistent tend to capture more of their existing opportunities — without increasing media investment at the same rate.", support: "Any question before the meeting?", whatsapp: "Talk to the team on WhatsApp", back: "Back to Tlin",
  },
  ES: {
    eyebrow: "DEMO CONFIRMADA", title: "Tu próxima conversación de crecimiento ya está agendada.", intro: "Usa este espacio para entender cómo Tlin puede transformar las conversaciones de WhatsApp en más oportunidades comerciales.", meeting: "Tu demostración", prepareTitle: "Cómo aprovechar mejor la reunión", prepare: ["Ten una idea del volumen mensual de leads en WhatsApp.", "Trae los principales cuellos de botella de atención y seguimiento.", "Invita a quien participe en la decisión comercial."], proofTitle: "Cada minuto de respuesta cuenta.", proof: "Los negocios que reducen el tiempo de respuesta y mantienen seguimientos consistentes tienden a aprovechar más oportunidades existentes — sin aumentar la inversión en medios en la misma proporción.", support: "¿Alguna duda antes de la reunión?", whatsapp: "Hablar con el equipo por WhatsApp", back: "Volver a Tlin",
  },
} as const;

export default function ObrigadoPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [confirmation, setConfirmation] = useState<DemoConfirmation | null>(null);
  const copy = content[lang];

  useEffect(() => {
    const parsed = readDemoConfirmation();
    if (!parsed) return router.replace("/demo");
    const timer = window.setTimeout(() => {
      setConfirmation(parsed);
      trackFunnelEvent("demo_thank_you_viewed");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  if (!confirmation) return <main className="min-h-screen bg-[#0c0d0d]" aria-busy="true" />;

  const whatsappUrl = `https://wa.me/5511916248604?text=${encodeURIComponent("Olá! Minha demo está marcada e eu tenho uma dúvida antes da reunião.")}`;

  return (
    <main className="min-h-screen overflow-hidden bg-white px-5 py-24 text-[#0c0d0d] sm:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px]" style={{ background: "linear-gradient(180deg, rgba(234,251,255,.75) 0%, rgba(255,255,255,0) 100%), radial-gradient(circle at 25% 0%, rgba(181,151,255,.16), transparent 35%)" }} />
      <div className="relative mx-auto max-w-5xl">
        <div className="relative mb-8 inline-flex overflow-hidden rounded-full p-[1px]"><div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]" style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }} /><div className="relative inline-flex items-center gap-2 rounded-full border border-[#B597FF]/20 bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#B597FF]"><CheckCircle2 size={15} /> {copy.eyebrow}</div></div>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            <h1 className="max-w-3xl text-4xl font-black leading-[.98] tracking-tight sm:text-6xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">{copy.intro}</p>
            <div className="mt-10 rounded-3xl border border-zinc-100 bg-[#F7F7FB] p-6 text-zinc-950 sm:p-8">
              <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-zinc-500"><CalendarCheck2 size={18} className="text-[#7254c8]" /> {copy.meeting}</div>
              <p className="mt-4 text-2xl font-black sm:text-3xl">{confirmation.day}</p>
              <p className="mt-1 text-lg font-bold text-zinc-600">{confirmation.time}</p>
            </div>
          </section>
          <aside className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b597ff] text-[#0c0d0d]"><Sparkles size={21} /></div>
            <h2 className="mt-6 text-2xl font-black">{copy.prepareTitle}</h2>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-500">{copy.prepare.map((item) => <li className="flex gap-3" key={item}><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#38aebb]" />{item}</li>)}</ul>
          </aside>
        </div>
        <section className="mt-8 grid gap-6 rounded-3xl border border-[#B597FF]/20 bg-[#F5FDFF] p-7 sm:p-10 md:grid-cols-[auto_1fr]">
          <ShieldCheck size={34} className="text-[#7254c8]" />
          <div><h2 className="text-2xl font-black">{copy.proofTitle}</h2><p className="mt-3 max-w-3xl leading-relaxed text-zinc-500">{copy.proof}</p></div>
        </section>
        <section className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-zinc-100 pt-8 sm:flex-row sm:items-center">
          <div><p className="font-bold">{copy.support}</p><p className="mt-1 text-sm text-zinc-400">{copy.meeting} continua sendo o próximo passo principal.</p></div>
          <div className="flex flex-wrap gap-3"><a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackFunnelEvent("click_whatsapp", { cta_source: "demo_thank_you" })} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-bold hover:bg-zinc-50"><MessageCircle size={17} />{copy.whatsapp}</a><Link href="/" className="rounded-full bg-[#0c0d0d] px-5 py-3 text-sm font-black text-white">{copy.back}</Link></div>
        </section>
      </div>
    </main>
  );
}
