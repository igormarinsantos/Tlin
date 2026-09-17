"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, MessagesSquare, TrendingUp, Zap } from "lucide-react";
import { GlobalBackground } from "@/components/GlobalBackground";
import { ScrollBgWrapper } from "@/components/ScrollBgWrapper";
import { FooterBanner } from "@/components/FooterBanner";
import { Footer } from "@/components/Footer";
import { CampaignReviews } from "@/components/CampaignReviews";
import { OperationNumbers } from "@/components/OperationNumbers";
import { HowItWorksCard } from "@/components/CampaignHowItWorks";
import { HumanCalendarMotion } from "@/components/HumanCalendarMotion";
import { SystemPreview } from "@/components/SystemPreview";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="relative mb-5 inline-flex overflow-hidden rounded-full p-[1px]"><div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]" style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }} /><span className="relative rounded-full border border-[#B597FF]/20 bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#B597FF]">{children}</span></div>;
}

function HeroDemoCta({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });
  const updatePointer = (element: HTMLButtonElement, clientX: number, clientY: number) => {
    const rect = element.getBoundingClientRect();
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  };

  return <div className="relative"><button onClick={onClick} onMouseEnter={(event) => { updatePointer(event.currentTarget, event.clientX, event.clientY); setIsHovered(true); }} onMouseLeave={() => setIsHovered(false)} onMouseMove={(event) => updatePointer(event.currentTarget, event.clientX, event.clientY)} className={`group/btn relative block w-full cursor-pointer overflow-hidden rounded-full p-[1px] transition-all duration-300 ${isHovered ? "z-[100]" : "z-10"}`}><div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]" style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)" }} /><div className="relative block w-full rounded-full bg-[#0c0d0d] px-7 py-4 text-center text-sm font-bold text-white transition-colors duration-300 group-hover/btn:text-[#0c0d0d]"><span className="relative z-10">Ver isso na minha operação</span><div className="absolute inset-0 rounded-full bg-[#0c0d0d] transition-opacity duration-500 group-hover/btn:opacity-0" /><div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF] opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" /></div></button><AnimatePresence>{isHovered && <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} style={{ position: "absolute", left: springX, top: springY, x: "20px", y: "-50%", zIndex: 200, pointerEvents: "none" }}><div className="relative inline-flex overflow-hidden rounded-full p-[1px]"><div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]" style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }} /><div className="relative whitespace-nowrap rounded-full border border-white/10 bg-zinc-950 px-2 py-0.5 text-white"><span className="text-[10px] font-bold leading-none tracking-wide">Demo 100% grátis</span></div></div></motion.div>}</AnimatePresence></div>;
}

const iaDeliveries = [
  { icon: "whatsapp", title: "Atende na hora", text: "Responde o lead quando ele demonstra interesse, sem deixar a oportunidade esfriar" },
  { icon: "agent", title: "Qualifica com contexto", text: "Entende momento, necessidade e potencial antes de ocupar o tempo do seu comercial" },
  { icon: "followup", title: "Mantém o acompanhamento vivo", text: "Retoma conversas e conduz os próximos passos com consistência" },
  { icon: "schedule", title: "Prepara a agenda", text: "Quando há fit, ajuda a levar uma oportunidade mais pronta para a conversa comercial" },
] as const;

const benefitCards = [
  { kind: "speed", title: "Mais velocidade", text: "Seus leads recebem resposta enquanto ainda estão interessados" },
  { kind: "context", title: "Mais contexto", text: "O comercial chega em conversas mais preparadas e com próximos passos claros" },
  { kind: "growth", title: "Mais evolução", text: "A operação aprende com o que acontece e melhora sem depender de mais uma ferramenta solta" },
] as const;

function BenefitIcon({ kind }: { kind: (typeof benefitCards)[number]["kind"] }) {
  const iconByKind = { speed: Zap, context: MessagesSquare, growth: TrendingUp } as const;
  const Icon = iconByKind[kind];
  const animation = kind === "speed"
    ? { y: [0, -3, 0], rotate: [0, -4, 0] }
    : kind === "context"
      ? { scale: [1, 1.08, 1] }
      : { y: [0, -3, 0], x: [0, 2, 0] };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, scale: 1.05 }}
      viewport={{ once: false, amount: 0.65 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="flex h-8 w-8 items-center justify-center text-[#7254c8]"
    >
      <motion.div
        whileInView={animation}
        viewport={{ once: false, amount: 0.65 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon size={22} strokeWidth={2} />
      </motion.div>
    </motion.div>
  );
}

export default function ComoFuncionaPage() {

  const openQualification = () => window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source: "how_it_works_page" } }));

  return (
    <main className="flex min-h-[100svh] flex-col bg-white text-[#0c0d0d]">
      <GlobalBackground />
      <ScrollBgWrapper>
        <section className="relative isolate flex min-h-[78svh] items-center overflow-visible px-4 pb-16 pt-28 md:px-8 md:pt-32">
          <div className="absolute left-1/2 top-1/3 -z-10 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#B597FF]/10 to-[#38E3FF]/10 blur-[120px]" />
          <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 lg:grid-cols-[.82fr_1.18fr]">
            <div className="text-center lg:text-left">
              <Eyebrow>✨ Sistema comercial operado por IA</Eyebrow>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:tracking-tighter">Um sistema comercial <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">operado por IA</span></h1>
              <p className="mx-auto mt-7 max-w-xl text-base font-medium leading-relaxed text-zinc-500 md:text-lg lg:mx-0">Atendimento, qualificação, acompanhamento e agenda em uma operação só</p>
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"><HeroDemoCta onClick={openQualification} /><a href="#sistema-comercial" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-7 py-4 text-sm font-bold text-[#0c0d0d] transition-colors hover:bg-zinc-50">Entender o sistema <ArrowDown size={17} /></a></div>
            </div>
            <SystemPreview />
          </div>
        </section>

        <section id="sistema-comercial" className="bg-white px-4 py-20 md:px-8 md:py-28"><div className="mx-auto max-w-[1100px]"><div className="mx-auto max-w-2xl text-center"><Eyebrow>🤖 O que a IA faz por você</Eyebrow><h2 className="text-3xl font-bold tracking-tight md:text-5xl">Ela cuida da conversa que o seu comercial <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">não pode perder</span></h2><p className="mt-5 leading-relaxed text-zinc-500">A Tlin entra na rotina onde o volume pesa: atendimento, qualificação, acompanhamento e preparo para o próximo passo</p></div><div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">{iaDeliveries.map((card, index) => <HowItWorksCard key={card.title} icon={card.icon} title={card.title} desc={card.text} index={index} MotionOverride={card.icon === "schedule" ? HumanCalendarMotion : undefined} />)}</div></div></section>

        <section className="bg-white px-4 py-20 md:px-8 md:py-28"><div className="mx-auto max-w-[1100px]"><div className="max-w-2xl"><Eyebrow>📈 O que você recebe</Eyebrow><h2 className="text-3xl font-bold tracking-tight md:text-5xl">Uma operação comercial mais presente, organizada e <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">preparada para crescer</span></h2></div><div className="mt-12 grid gap-5 md:grid-cols-3">{benefitCards.map(({ kind, title, text }) => <div key={title} className="rounded-3xl border border-zinc-100 bg-white p-7"><BenefitIcon kind={kind} /><h3 className="mt-7 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-500">{text}</p></div>)}</div></div></section>

        <section className="relative isolate overflow-hidden bg-white px-4 py-20 md:px-8 md:py-28"><div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(circle at 68% 48%, rgba(56, 227, 255, 0.1), transparent 34%), radial-gradient(circle at 32% 72%, rgba(181, 151, 255, 0.08), transparent 38%)" }} /><div className="mx-auto flex max-w-[1100px] flex-col items-center gap-10 md:flex-row md:items-stretch"><div className="order-2 w-full md:order-1 md:basis-[calc(52%_-_20px)] md:shrink-0"><Eyebrow>👋 Por trás da Tlin</Eyebrow><h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">Por trás de uma IA que vende melhor, existe uma <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">operação bem pensada</span></h2><p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">Antes de colocar a IA para conversar com seus leads, a gente entende como sua venda funciona, onde as oportunidades se perdem e o que o seu comercial precisa saber para agir melhor</p><div className="mt-8 rounded-3xl bg-[#0c0d0d] p-6 shadow-xl"><p className="text-xl font-bold leading-relaxed text-white">“A IA executa todos os dias. A gente cuida para que ela continue útil para o seu negócio”</p><p className="mt-5 text-sm leading-relaxed text-white/55">É contexto, critério e evolução contínua para cada conversa contribuir com a venda</p></div></div><div className="order-1 mx-auto h-[500px] w-full max-w-[400px] md:order-2 md:ml-auto md:h-auto md:max-w-none md:basis-[calc(48%_-_20px)] md:self-stretch md:shrink-0"><div className="group relative h-full w-full overflow-hidden rounded-[2.5rem] bg-[#0c0d0d]"><Image src="/team/igor-avatar.png" alt="Igor Marin, fundador da Tlin" fill sizes="(max-width: 768px) 90vw, 560px" className="object-cover transition-transform duration-700 ease-out motion-reduce:transition-none md:group-hover:scale-105" priority /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c0d0d] via-[#0c0d0d]/35 to-transparent px-8 pb-8 pt-24"><p className="text-2xl font-bold text-white">Igor Marin</p><p className="mt-1 text-[11px] font-bold tracking-wide text-[#38E3FF]">Fundador da Tlin</p></div></div></div></div></section>

        <OperationNumbers />

        <CampaignReviews variant="iaWhatsapp" />

        <FooterBanner /><Footer />
      </ScrollBgWrapper>
    </main>
  );
}
