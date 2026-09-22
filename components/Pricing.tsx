"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { animate } from "framer-motion";
import { useOfferTimer } from "@/lib/useOfferTimer";
import Image from "next/image";
// canvas-confetti is dynamically imported only when the user toggles to annual billing

import { useLanguage } from "@/lib/LanguageContext";
import { LeadQualificationPopup } from "./LeadQualificationPopup";
import { trackFunnelEvent } from "@/lib/utm";
import { withoutClosingPeriod } from "@/lib/marketingCopy";
import { Bot, Headset, Kanban } from "lucide-react";
import { DemoHoverPill } from "@/components/DemoHoverPill";
import { TlinButton } from "@/components/ui/tlin";

function RollingNumber({ value, highlight }: { value: string; highlight: boolean }) {
  const characters = value.split("");
  
  return (
    <div className="flex overflow-hidden">
      {characters.map((char, i) => {
        const isDigit = !isNaN(parseInt(char));
        if (!isDigit) return <span key={i} className={`inline-block mx-0.5 font-extrabold ${highlight ? 'text-[#38E3FF]' : 'text-[#0c0d0d]'}`}>{char}</span>;

        return (
          <div key={i} className="relative h-[1em] w-[0.65em] overflow-hidden">
            <motion.div
              animate={{ y: -parseInt(char) * 10 + "%" }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              className="flex flex-col"
              style={{ height: "1000%" }}
            >
              {[0,1,2,3,4,5,6,7,8,9].map((num) => (
                <span 
                  key={num} 
                  className={`flex items-center justify-center h-[10%] font-extrabold ${highlight ? 'text-white' : 'text-[#0c0d0d]'}`}
                >
                  {num}
                </span>
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function PriceDisplay({ value, highlight = false }: { value: number; highlight?: boolean }) {
  const numericString = Math.floor(value).toString();
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(numericString);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: [0.32, 1, 0.23, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest).toString().padStart(numericString.length, '0'));
      }
    });
    return () => controls.stop();
  }, [value, numericString.length]);

  return <PriceDisplayInner value={displayValue} highlight={highlight} />;
}

function PriceDisplayInner({ value, highlight }: { value: string; highlight: boolean }) {
    return <RollingNumber value={value} highlight={highlight} />;
}

const COMPARISON_ROWS = [
  { label: "Responde no WhatsApp enquanto o lead está quente", tlin: true, agent: true, crm: false, human: false },
  { label: "Qualifica com as regras do seu comercial", tlin: true, agent: true, crm: false, human: true },
  { label: "Atualiza o CRM a cada conversa", tlin: true, agent: false, crm: false, human: false },
  { label: "Mantém origem, conversa e interesse no mesmo lugar", tlin: true, agent: false, crm: true, human: false },
  { label: "Retoma leads que pararam de responder", tlin: true, agent: false, crm: false, human: false },
  { label: "Mostra a próxima ação para cada oportunidade", tlin: true, agent: false, crm: true, human: false },
  { label: "Agenda reunião com o contexto da venda", tlin: true, agent: false, crm: false, human: true },
  { label: "Chama uma pessoa quando a conversa pede", tlin: true, agent: false, crm: false, human: false },
  { label: "Mostra o funil sem depender de planilha", tlin: true, agent: false, crm: true, human: false },
  { label: "Tem time que evolui o playbook com você", tlin: true, agent: false, crm: false, human: false },
] as const;

function StatusMark({ enabled, inverse = false }: { enabled: boolean; inverse?: boolean }) {
  return <span aria-label={enabled ? "Incluído" : "Não incluído"} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${enabled ? inverse ? "bg-[#38E3FF] text-[#0c0d0d]" : "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-500"}`}>
    {enabled ? <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true"><path d="m3.5 8.25 2.7 2.7 6.3-6.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true"><path d="m5 5 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
  </span>;
}

function MarketComparison() {
  const columns = [
    { key: "tlin", label: "Tlin" },
    { key: "agent", label: "Agente de IA" },
    { key: "crm", label: "CRM comum" },
    { key: "human", label: "Vendedor" },
  ] as const;
  const HeaderIcon = ({ column }: { column: "agent" | "crm" | "human" }) => {
    const Icon = column === "agent" ? Bot : column === "crm" ? Kanban : Headset;
    return <Icon className="h-4 w-4 shrink-0 text-[#0c0d0d]" strokeWidth={1.9} aria-hidden="true" />;
  };

  return <section className="mt-24 pt-24 md:mt-32 md:pt-32">
    <div className="mx-auto max-w-3xl text-center"><div className="inline-flex rounded-full border border-[#B597FF]/20 bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#B597FF]">✨ Compare as operações</div><h2 className="mt-5 text-[26px] font-bold leading-[1.1] tracking-tight text-[#0c0d0d] md:text-5xl md:leading-tight"><span className="md:hidden">Não é só uma IA<br />É a <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">operação inteira</span><br />trabalhando para vender</span><span className="hidden md:inline">Não é só uma IA. É a <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">operação inteira</span> trabalhando para vender</span></h2><p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-500">Quando chega volume de leads, responder é só o começo. Compare o que cada opção sustenta na operação</p></div>
    <div className="mt-10 md:hidden">
      <div className="space-y-3">{columns.map((column) => <article key={column.key} className={`overflow-hidden rounded-3xl border bg-white ${column.key === "tlin" ? "border-[#38E3FF]/60" : "border-zinc-200"}`}><div className={`flex h-14 items-center px-5 ${column.key === "tlin" ? "bg-[#F3FDFF]" : ""}`}>{column.key === "tlin" ? <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={66} height={24} className="h-6 w-auto" /> : <div className="flex w-full items-center justify-center gap-2.5"><HeaderIcon column={column.key} /><p className="text-[17px] font-bold text-[#0c0d0d]">{column.label}</p></div>}</div><div className="grid grid-cols-2 border-t border-zinc-100">{COMPARISON_ROWS.map((row) => <div key={row.label} className="flex min-h-14 items-center gap-2 border-b border-r border-zinc-100 px-3 py-2 text-[11px] font-semibold leading-snug text-zinc-600"><StatusMark enabled={row[column.key]} /><span>{row.label}</span></div>)}</div></article>)}</div>
    </div>
    <div className="mt-12 hidden md:block">
      <div className="ml-[32.203%] grid grid-cols-4 overflow-hidden rounded-t-[2rem] border border-b-0 border-zinc-200">
        {columns.map((column) => (
          <div key={column.key} className={`flex min-h-[76px] items-center justify-center px-2 py-4 text-center ${column.key === "tlin" ? "bg-[#F3FDFF]" : "bg-[#FCFCFD]"}`}>
            {column.key === "tlin" ? <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={70} height={26} className="h-6 w-auto" /> : <div className="flex items-center justify-center gap-2 text-center"><HeaderIcon column={column.key} /><p className="whitespace-nowrap text-[14px] font-bold leading-tight tracking-tight text-[#0c0d0d]">{column.label}</p></div>}
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-bl-[2rem] rounded-tl-[2rem] rounded-br-[2rem] border border-zinc-200 bg-white">
        {COMPARISON_ROWS.map((row, index) => <div key={row.label} className={`grid grid-cols-[1.9fr_repeat(4,1fr)] ${index < COMPARISON_ROWS.length - 1 ? "border-b border-zinc-100" : ""}`}><div className="flex items-center px-7 py-4 text-sm font-semibold leading-snug text-[#0c0d0d]">{row.label}</div>{columns.map((column) => <div key={column.key} className={`flex items-center justify-center ${column.key === "tlin" ? "bg-[#38E3FF]/[0.06]" : ""}`}><StatusMark enabled={row[column.key]} /></div>)}</div>)}
      </div>
    </div>
  </section>;
}

type PlanTierRow = { label: string; starter: boolean; scale: boolean; enterprise: boolean };

function PlanTierComparison({
  rows,
  plans,
  onSelectPlan,
}: {
  rows: PlanTierRow[];
  plans: {
    starter: { name: string; target: string };
    scale: { name: string; target: string };
    enterprise: { name: string; target: string };
  };
  onSelectPlan: (planName: string) => void;
}) {
  const [query, setQuery] = useState("");
  const columns = [
    { key: "starter", ...plans.starter },
    { key: "scale", ...plans.scale },
    { key: "enterprise", ...plans.enterprise },
  ] as const;
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filteredRows = rows.filter((row) => row.label.toLocaleLowerCase("pt-BR").includes(normalizedQuery));

  return (
    <section data-suppress-floating-header className="mt-24 pt-24 md:mt-32 md:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex rounded-full border border-[#B597FF]/20 bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#B597FF]">✨ Compare os planos</div>
        <h2 className="mt-5 text-[26px] font-bold leading-[1.1] tracking-tight text-[#0c0d0d] md:text-5xl md:leading-tight">A estrutura certa para o <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">seu volume de leads</span></h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-500">Veja o que entra em cada nível para escolher o plano que acompanha sua operação</p>
      </div>

      <div className="mx-auto mt-8 max-w-md">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 transition-colors focus-within:border-[#B597FF] focus-within:ring-4 focus-within:ring-[#B597FF]/10">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" strokeLinecap="round" /></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar uma funcionalidade" className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#0c0d0d] outline-none placeholder:text-zinc-400" aria-label="Buscar funcionalidade" />
          {query && <button type="button" onClick={() => setQuery("")} className="text-xs font-bold text-[#B597FF]">Limpar</button>}
        </label>
      </div>

      <div className="mt-10 md:hidden">
        <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white">
          <div className="grid grid-cols-3 border-b border-zinc-100">
            {columns.map((column) => (
              <div key={column.key} className={`min-h-[88px] px-2 py-3 text-center ${column.key === "scale" ? "bg-[#F5F1FF] text-[#0c0d0d]" : "bg-[#FCFCFD] text-[#0c0d0d]"}`}>
                <p className="mt-1 whitespace-nowrap text-[14px] font-bold">{column.name}</p>
                <DemoHoverPill enabled={column.key === "scale"} className="mt-2 inline-block">
                  <button type="button" onClick={(event) => { event.stopPropagation(); onSelectPlan(column.name); }} className={`relative z-10 cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold transition-transform active:scale-95 ${column.key === "scale" ? "bg-[#0c0d0d] text-white" : "border border-zinc-200 bg-white text-[#0c0d0d]"}`}>Contratar</button>
                </DemoHoverPill>
              </div>
            ))}
          </div>
          <div className="space-y-px bg-zinc-100">
            {filteredRows.map((row) => (
              <motion.article key={row.label} whileTap={{ scale: 0.985 }} className="bg-white px-4 py-4 transition-colors hover:bg-[#FCFCFD]">
                <p className="text-sm font-semibold leading-snug text-[#0c0d0d]">{row.label}</p>
                <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-xl border border-zinc-100">
                  {columns.map((column) => (
                    <div key={column.key} className={`flex h-11 items-center justify-center border-r border-zinc-100 last:border-r-0 ${column.key === "scale" ? "bg-[#F7F3FF]" : "bg-white"}`}>
                      <StatusMark enabled={row[column.key]} />
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
            {filteredRows.length === 0 && <p className="bg-white px-5 py-10 text-center text-sm font-medium text-zinc-500">Nenhuma funcionalidade encontrada</p>}
          </div>
        </div>
      </div>

      <div className="mt-12 hidden rounded-[2.25rem] border border-zinc-200 bg-white md:block">
        <div className="sticky top-0 z-[110] grid grid-cols-[2.15fr_repeat(3,1fr)] overflow-hidden rounded-t-[2.2rem] border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-[88px] items-center justify-center px-8 py-3 text-center text-[13px] font-bold tracking-[0.06em] text-zinc-400">funcionalidades incluídas</div>
          {columns.map((column) => (
            <div key={column.key} className={`min-h-[88px] px-3 py-3 text-center ${column.key === "scale" ? "bg-[#F5F1FF] text-[#0c0d0d]" : "bg-[#FCFCFD] text-[#0c0d0d]"}`}>
              <p className="whitespace-nowrap text-base font-bold">{column.name}</p>
              <DemoHoverPill enabled={column.key === "scale"} className="mt-2 inline-block">
                <button type="button" onClick={(event) => { event.stopPropagation(); onSelectPlan(column.name); }} className={`relative z-10 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-bold transition-all hover:-translate-y-0.5 active:scale-95 ${column.key === "scale" ? "bg-[#0c0d0d] text-white" : "border border-zinc-200 bg-white text-[#0c0d0d] hover:border-[#B597FF]"}`}>Contratar {column.name}</button>
              </DemoHoverPill>
            </div>
          ))}
        </div>
        <div className="bg-zinc-100">
          {filteredRows.map((row) => (
            <motion.div key={row.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="group grid grid-cols-[2.15fr_repeat(3,1fr)] border-b border-zinc-100 bg-white last:border-b-0 transition-colors hover:bg-[#FCFCFD]">
              <div className="flex min-h-[68px] items-center px-8 py-4 text-sm font-semibold leading-snug text-[#27272a]">{row.label}</div>
              {columns.map((column) => (
                <div key={column.key} className={`flex min-h-[68px] items-center justify-center border-l border-zinc-100 transition-colors ${column.key === "scale" ? "bg-[#FAF8FF] group-hover:bg-[#F5F1FF]" : "bg-white"}`}>
                  <StatusMark enabled={row[column.key]} />
                </div>
              ))}
            </motion.div>
          ))}
          {filteredRows.length === 0 && <p className="bg-white px-8 py-14 text-center text-sm font-medium text-zinc-500">Nenhuma funcionalidade encontrada</p>}
        </div>
      </div>
    </section>
  );
}

export function Pricing({ hideEyebrow = false, comparisonMode = "market" }: { hideEyebrow?: boolean; comparisonMode?: "market" | "plans" }) {
  const { t } = useLanguage();
  const [pricingTitleLead, ...pricingTitleHighlight] = t.pricing.title.split(" ");
  const [isAnnual, setIsAnnual] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const plans = [
    {
      name: t.pricing.starterName,
      target: t.pricing.starterTarget,
      priceStandard: 797,
      priceMonthly: 497,
      priceAnnual: 397,
      period: "/mês",
      desc: withoutClosingPeriod(t.pricing.starterDesc),
      cta: t.pricing.starterCta,
      highlight: false,
      features: [
        t.pricing.starterF1,
        t.pricing.starterF2,
        t.pricing.starterF3,
        t.pricing.starterF4,
        t.pricing.starterF5
      ].filter(Boolean)
    },
    {
      name: t.pricing.scaleName,
      target: t.pricing.scaleTarget,
      priceStandard: 1497,
      priceMonthly: 997,
      priceAnnual: 797,
      period: "/mês",
      desc: withoutClosingPeriod(t.pricing.scaleDesc),
      cta: t.pricing.scaleCta,
      highlight: true,
      badge: t.pricing.scaleBadge,
      badgeColor: "bg-gradient-to-r from-[#B597FF] to-[#38E3FF]",
      features: [
        t.pricing.scaleF1,
        t.pricing.scaleF2,
        t.pricing.scaleF3,
        t.pricing.scaleF4,
        t.pricing.scaleF5,
        t.pricing.scaleF6,
        t.pricing.scaleF7,
        t.pricing.scaleF8
      ].filter(Boolean)
    },
    {
      name: t.pricing.enterpriseName,
      target: t.pricing.enterpriseTarget,
      isCustom: true,
      desc: withoutClosingPeriod(t.pricing.enterpriseDesc),
      cta: t.pricing.enterpriseCta,
      highlight: false,
      features: [
        t.pricing.enterpriseF1,
        t.pricing.enterpriseF2,
        t.pricing.enterpriseF3,
        t.pricing.enterpriseF4,
        t.pricing.enterpriseF5,
        t.pricing.enterpriseF6,
        "SLA de 99.9% Garantido",
        "Infraestrutura Dedicada"
      ].filter(Boolean)
    }
  ];

  const planComparisonRows: PlanTierRow[] = [
    { label: t.pricing.starterF1, starter: true, scale: true, enterprise: true },
    { label: t.pricing.scaleF2, starter: false, scale: true, enterprise: true },
    { label: t.pricing.scaleF3, starter: false, scale: true, enterprise: true },
    { label: t.pricing.scaleF7, starter: false, scale: true, enterprise: true },
    { label: t.pricing.scaleF6, starter: false, scale: true, enterprise: true },
    { label: t.pricing.scaleF4, starter: false, scale: true, enterprise: true },
    { label: t.pricing.scaleF5, starter: false, scale: true, enterprise: true },
    { label: t.pricing.enterpriseF3, starter: false, scale: false, enterprise: true },
    { label: t.pricing.enterpriseF4, starter: false, scale: false, enterprise: true },
    { label: t.pricing.enterpriseF5, starter: false, scale: false, enterprise: true },
    { label: t.pricing.enterpriseF6, starter: false, scale: false, enterprise: true },
  ].filter((row) => Boolean(row.label));

  useEffect(() => {
    if (isAnnual) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      // Dynamically import confetti only when needed — keeps it out of the initial bundle
      import('canvas-confetti').then(({ default: confetti }) => {
        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);

          const particleCount = 50 * (timeLeft / duration);
          const defaults = { 
            startVelocity: 30, 
            spread: 360, 
            ticks: 60, 
            zIndex: 100, 
            colors: ["#B597FF", "#38E3FF"] 
          };

          confetti({ 
            ...defaults, 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: 0.5 } 
          });
          confetti({ 
            ...defaults, 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: 0.5 } 
          });
        }, 250);
      });
    }
  }, [isAnnual]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("pricing-focus", { detail: { active: hoveredIndex !== null } }));
  }, [hoveredIndex]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const { timeLeft, formattedTime } = useOfferTimer();
  const openPlanQualification = (planName: string, source: string) => {
    trackFunnelEvent("select_plan", {
      plan_name: planName,
      cta_source: source,
      billing_period: isAnnual ? "annual" : "monthly",
    });
    trackFunnelEvent("click_pricing_cta", {
      plan_name: planName,
      cta_source: source,
      billing_period: isAnnual ? "annual" : "monthly",
    });
    window.dispatchEvent(new CustomEvent("open-qualification", {
      detail: { plan: planName, source },
    }));
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className={`relative w-full [overflow-anchor:none] [overflow-x:clip] bg-white pb-24 ${hideEyebrow ? "pt-36 md:pt-40" : "py-24"}`}
    >


       <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
             <div className={`transition-all duration-300 ${hoveredIndex !== null ? 'blur-[2px] opacity-60' : 'opacity-100'}`}>
                {!hideEyebrow && <div className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-6">
                   <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
                    style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
                   />
                   <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[11px] font-bold tracking-wide text-[#B597FF] flex items-center gap-2">
                    💰 {t.pricing.badge}
                   </div>
                </div>}
                <h2 className={`text-3xl font-bold tracking-tight text-[#0c0d0d] md:text-5xl ${hideEyebrow ? "mb-7 leading-[1.12] md:mb-8" : "mb-4"}`}>
                   {pricingTitleLead} <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">{pricingTitleHighlight.join(" ")}</span>
                </h2>
             </div>
             
             <div className={`flex flex-col items-center justify-center gap-4 mt-6 transition-all duration-300 ${hoveredIndex !== null ? 'blur-[2px] opacity-60' : 'opacity-100'}`}>
                <div className="relative flex h-12 w-[280px] items-center rounded-full border border-zinc-200 bg-zinc-100/50 p-1">
                   {/* Sliding Background */}
                   <motion.div 
                      className="absolute bottom-1 left-1 top-1 z-0 rounded-full bg-white"
                      initial={false}
                      animate={{ 
                        x: isAnnual ? "100%" : "0%",
                      }}
                      style={{ width: "calc(50% - 4px)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                   />
                   
                   <button 
                     onClick={() => setIsAnnual(false)}
                     className={`relative z-10 h-10 flex-1 rounded-full text-xs font-bold transition-colors duration-300 ${!isAnnual ? 'text-[#0c0d0d]' : 'text-zinc-500 hover:text-zinc-700'}`}
                   >
                     {t.pricing.monthly}
                   </button>
                   
                   <button 
                     onClick={() => setIsAnnual(true)}
                     className={`relative z-10 flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-xs font-bold transition-colors duration-300 ${isAnnual ? 'text-[#0c0d0d]' : 'text-zinc-500 hover:text-zinc-700'}`}
                   >
                     {t.pricing.annual}
                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all duration-500 ${isAnnual ? 'bg-[#B597FF] text-white' : 'bg-white text-[#B597FF] border border-[#B597FF]/20'}`}>
                       {t.pricing.annualDiscount}
                     </span>
                   </button>
                </div>
             </div>
          </div>

          {/* Offer Bar moved to LiaPopup globally */}

          <div id="planos" className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4 scroll-mt-[40px]">
             {plans.map((plan, idx) => {
               const priceToShow = isAnnual ? plan.priceAnnual : plan.priceMonthly;
               const isHovered = hoveredIndex === idx;
               const isOtherHovered = hoveredIndex !== null && !isHovered;
               const showHoverBorder = (plan.name === t.pricing.starterName || plan.name === t.pricing.enterpriseName) && isHovered;

               return (
                 <motion.div 
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => openPlanQualification(plan.name, "pricing_card")}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`group relative flex flex-col rounded-[2.5rem] transition-all duration-300 ease-out p-[2px] cursor-pointer
                       ${isOtherHovered ? 'blur-[2px] opacity-60' : 'opacity-100'} 
                       ${isHovered ? '-translate-y-4' : 'translate-y-0'}
                      ${plan.badge ? plan.badgeColor : (showHoverBorder ? 'bg-gradient-to-r from-[#B597FF] to-[#38E3FF]' : 'bg-zinc-100')} 
                      ${plan.highlight && !isOtherHovered ? 'z-20' : 'z-10'}
                    `}
                  >
                    {plan.badge && (
                        <div className="relative z-20 w-full whitespace-nowrap py-3 text-center text-[11px] font-bold tracking-wide text-[#0c0d0d] uppercase">
                           {plan.badge}
                        </div>
                    )}

                    <div className={`flex flex-col flex-1 p-9 rounded-[2.4rem] transition-colors duration-500 overflow-hidden relative z-10 ${plan.highlight ? 'bg-[#0c0d0d] text-white' : 'bg-white text-[#0c0d0d]'}`}>

                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h3 className="text-2xl font-bold tracking-tight mb-1">{plan.name}</h3>
                             <p className={`text-[11px] font-bold tracking-wide ${plan.highlight ? 'text-[#38E3FF]' : 'text-zinc-400'}`}>{plan.target}</p>
                          </div>
                       </div>

                       <div className="mb-8 min-h-[80px] flex flex-col justify-center">
                          {plan.isCustom ? (
                            <div className="flex items-end gap-1">
                               <span className="text-4xl lg:text-5xl font-extrabold tracking-tighter leading-none flex items-center h-[50px]">
                                  Sob consulta
                               </span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-4">
                                 <span className={`text-xs font-black line-through text-zinc-400/80`}>R$ {plan.priceStandard}</span>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#38E3FF]/15 text-[#38E3FF] tracking-wide flex items-center gap-1.5 border border-[#38E3FF]/20">
                                     {t.pricing.specialCondition}
                                     <span className="opacity-40 select-none">|</span>
                                     <span className="font-mono">{formattedTime}</span>
                                  </span>
                              </div>
                              <div className="flex items-end gap-1">
                                 <span className="text-4xl lg:text-6xl font-extrabold tracking-tighter leading-none flex items-center h-[50px]">
                                    R${" "}<PriceDisplay value={priceToShow!} highlight={plan.highlight} />
                                 </span>
                                 <span className={`text-sm font-bold pb-1 ${plan.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>{plan.period}</span>
                              </div>
                            </>
                          )}
                       </div>

                       <p className={`text-sm font-medium mb-10 leading-relaxed min-h-[48px] ${plan.highlight ? 'text-zinc-400' : 'text-zinc-600'}`}>{plan.desc}</p>

                        <DemoHoverPill className="mb-10 w-full" enabled={!plan.highlight}>
                          <TlinButton
                            onClick={(event) => {
                             event.stopPropagation();
                             openPlanQualification(plan.name, "pricing_button");
                           }}
                            variant={plan.highlight ? "gradient" : "primary"}
                            size="lg"
                            shape="soft"
                            fullWidth
                            className="text-sm hover:scale-[1.02]"
                          >
                            {plan.cta}
                          </TlinButton>
                        </DemoHoverPill>

                       <div className="mt-auto">
                           <p className={`text-[11px] font-bold tracking-wide mb-6 ${plan.highlight ? 'text-zinc-600' : 'text-zinc-300'}`}>{t.pricing.deliveryLevel}</p>
                          <ul className="space-y-4">
                             {plan.features.map((feat) => (
                                <li key={feat} className="flex items-start gap-3">
                                   <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                      <Image src="/icons/Check.webp" alt="check" width={20} height={20} className="w-full h-full object-contain" />
                                   </div>
                                   <span className="text-sm font-bold opacity-80">{feat}</span>
                                </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                 </motion.div>
               );
             })}
          </div>

          {comparisonMode === "plans" ? <PlanTierComparison rows={planComparisonRows} plans={{ starter: { name: t.pricing.starterName, target: t.pricing.starterTarget }, scale: { name: t.pricing.scaleName, target: t.pricing.scaleTarget }, enterprise: { name: t.pricing.enterpriseName, target: t.pricing.enterpriseTarget } }} onSelectPlan={(planName) => openPlanQualification(planName, "comparison_table")} /> : <MarketComparison />}
       </div>
    </section>
  );
}
