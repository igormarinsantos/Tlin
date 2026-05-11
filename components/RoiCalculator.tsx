"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Minus, Plus, RotateCcw, TrendingUp } from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";

// ── Brand purple palette ────────────────────────────────────────────────────
const PURPLE_TOP    = "#9D7BFF"; // topo — lilas vibrante
const PURPLE_BOTTOM = "#7B5AD2"; // baixo — lilas mais profundo

const LEADS_SUGGESTIONS = [40, 150, 500, 1500, 5000];
const TICKET_SUGGESTIONS = [100, 500, 1000, 2500];

export function RoiCalculator() {
  const { t } = useLanguage();
  const [leads, setLeads]               = useState(1000);
  const [ticket, setTicket]             = useState(500);
  const [currentSales, setCurrentSales] = useState(10);
  const [step, setStep]                 = useState<"input" | "result">("input");

  const r = useMemo(() => {
    // 1. Conversão Atual (0.5% - 60%)
    const rawConv = leads > 0 ? (currentSales / leads) * 100 : 0;
    const convRate = Math.min(Math.max(rawConv, 0.5), 60);

    // 2. Ganho Relativo (Baseado no volume)
    let gain = 0.10;
    if (leads < 100) gain = 0.35;
    else if (leads < 500) gain = 0.25;
    else if (leads < 2000) gain = 0.18;

    // 3. Conversão Projetada (Max 75%)
    const newConvRate = Math.min(convRate * (1 + gain), 75);

    // 4. Receita Atual
    const currentRevenue = currentSales * ticket;

    // 5. Vendas Projetadas
    const newSales = Math.floor(leads * (newConvRate / 100));

    // 6. Receita Projetada & Ganho Mensal
    const revenueProjetada = newSales * ticket;
    const extraRevenue = Math.max(0, revenueProjetada - currentRevenue);

    // 7. ROI (Custo fixo 3000)
    const costIA = 3000;
    const rawRoi = ((extraRevenue - costIA) / costIA) * 100;
    const roi = Math.min(Math.max(rawRoi, 0), 1200);

    return { 
      currentRevenue, 
      extraRevenue, 
      newConvRate, 
      convRate, 
      gain: Math.round(gain * 100),
      roi 
    };
  }, [leads, ticket, currentSales]);

  return (
    <section
      id="roi"
      className="w-full relative bg-black py-16 md:py-24"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >

      {/* Range thumb styling */}
      <style jsx global>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          background: var(--thumb-color, #B597FF);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: none;
          transition: transform 0.15s;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">

        {/* Section heading */}
        <div className="text-center mb-16 space-y-4">
          <div className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-4 mx-auto">
            <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
            />
            <div className="relative px-4 py-1.5 rounded-full bg-[#0c0d0d] border border-white/10 text-white text-[11px] font-bold tracking-wide flex items-center gap-2">
              {t.roi.badge}
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Quanto sua operação{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#D1C2FF]">
              deixa na mesa?
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Simulação baseada em médias operacionais de conversão via WhatsApp.
          </p>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-[2rem] overflow-hidden flex flex-col lg:flex-row">

          {/* ── LEFT: Inputs ────────────────────────────────────────── */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-between bg-white relative z-10">

            <div>
              <div className="flex justify-between items-center mb-8">
                <p className="text-[11px] font-bold text-zinc-400 tracking-wide uppercase">
                  detalhes da operação
                </p>
                <div className="text-[10px] font-bold text-[#B597FF]">
                  simulação (dados não exatos)
                </div>
              </div>

              <div className="space-y-12">

                {/* Leads Input & Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-zinc-700">{t.roi.leads}</label>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        {LEADS_SUGGESTIONS.map(s => (
                          <button 
                            key={s} 
                            onClick={() => { setLeads(s); setStep("input"); }}
                            className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all ${leads === s ? 'bg-[#B597FF] border-[#B597FF] text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:border-zinc-300'}`}
                          >
                            {s >= 1000 ? `${s/1000}k` : s}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => { setLeads(Math.max(20, leads - 10)); setStep("input"); }}
                          className="w-7 h-7 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={leads.toLocaleString("pt-BR")}
                            onChange={(e) => {
                              const val = parseInt(e.target.value.replace(/\D/g, "") || "0");
                              setLeads(Math.min(val, 100000));
                              setStep("input");
                            }}
                            className="w-24 text-right px-3 py-1.5 rounded-xl bg-[#B597FF]/5 text-[#8A63D2] text-sm font-black border-2 border-transparent focus:border-[#B597FF]/30 outline-none transition-all"
                          />
                        </div>
                        <button 
                          onClick={() => { setLeads(leads + 10); setStep("input"); }}
                          className="w-7 h-7 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-6 flex items-center">
                    <div className="absolute left-0 right-0 h-[3px] bg-zinc-100 rounded-full overflow-hidden">
                      <div className="absolute left-0 h-full rounded-full bg-gradient-to-r from-[#B597FF] to-[#D1C2FF]"
                           style={{ width: `${Math.min((leads / 10000) * 100, 100)}%` }} />
                    </div>
                    <input
                      type="range" min={20} max={10000} step={10} value={Math.min(leads, 10000)}
                      aria-label="Número de Leads"
                      onChange={e => { setLeads(+e.target.value); setStep("input"); }}
                      className="w-full h-6 appearance-none cursor-pointer bg-transparent relative z-10"
                      style={{ "--thumb-color": "#B597FF" } as any}
                    />
                  </div>
                </div>

                {/* Ticket Input & Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-zinc-700">
                      Ticket Médio <span className="text-[10px] text-zinc-400 font-medium ml-1">(Preço médio por venda)</span>
                    </label>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        {TICKET_SUGGESTIONS.map(s => (
                          <button 
                            key={s} 
                            onClick={() => { setTicket(s); setStep("input"); }}
                            className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all ${ticket === s ? 'bg-[#B597FF] border-[#B597FF] text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:border-zinc-300'}`}
                          >
                            R$ {s}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => { setTicket(Math.max(1, ticket - 50)); setStep("input"); }}
                          className="w-7 h-7 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#8A63D2]/40">R$</span>
                          <input 
                            type="text" 
                            value={ticket.toLocaleString("pt-BR")}
                            onChange={(e) => {
                              const val = parseInt(e.target.value.replace(/\D/g, "") || "0");
                              setTicket(Math.max(1, Math.min(val, 1000000)));
                              setStep("input");
                            }}
                            className="w-28 text-right pl-8 pr-3 py-1.5 rounded-xl bg-[#B597FF]/5 text-[#8A63D2] text-sm font-black border-2 border-transparent focus:border-[#B597FF]/30 outline-none transition-all"
                          />
                        </div>
                        <button 
                          onClick={() => { setTicket(ticket + 50); setStep("input"); }}
                          className="w-7 h-7 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-6 flex items-center">
                    <div className="absolute left-0 right-0 h-[3px] bg-zinc-100 rounded-full overflow-hidden">
                      <div className="absolute left-0 h-full rounded-full bg-gradient-to-r from-[#B597FF] to-[#D1C2FF]"
                           style={{ width: `${Math.min((ticket / 10000) * 100, 100)}%` }} />
                    </div>
                    <input
                      type="range" min={1} max={10000} step={50} value={Math.min(ticket, 10000)}
                      aria-label="Ticket Médio"
                      onChange={e => { setTicket(+e.target.value); setStep("input"); }}
                      className="w-full h-6 appearance-none cursor-pointer bg-transparent relative z-10"
                      style={{ "--thumb-color": "#B597FF" } as any}
                    />
                  </div>
                </div>

                {/* Vendas counter */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-zinc-700">Vendas Atuais (Mês)</label>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="Diminuir Vendas"
                      onClick={() => { setCurrentSales(Math.max(1, currentSales - 1)); setStep("input"); }}
                      className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors shadow-sm active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 h-11 rounded-full border border-zinc-200 flex items-center justify-center">
                       <input 
                          type="text" 
                          value={currentSales}
                          onChange={(e) => {
                            const val = parseInt(e.target.value.replace(/\D/g, "") || "0");
                            setCurrentSales(Math.min(val, leads));
                            setStep("input");
                          }}
                          className="w-full bg-transparent text-center text-lg font-black text-zinc-800 outline-none"
                        />
                    </div>
                    <button
                      aria-label="Aumentar Vendas"
                      onClick={() => { setCurrentSales(currentSales + 1); setStep("input"); }}
                      className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors shadow-sm active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA button — pinned to bottom */}
            <div className="mt-10">
              {step === "input" ? (
                <button
                  onClick={() => setStep("result")}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#B597FF] to-[#D1C2FF] text-white font-black text-sm tracking-wide hover:opacity-90 transition-all shadow-lg shadow-[#B597FF]/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Identificar Oportunidade Mensal <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full py-4 rounded-full bg-[#0c0d0d] text-white font-black text-sm tracking-wide hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" /> Ver Planos e Escalar
                </button>
              )}

              {/* Live preview teaser below button */}
              <p className="text-center text-[10px] text-zinc-400 mt-4 font-medium leading-relaxed">
                Os resultados podem variar conforme processo comercial, velocidade de atendimento e qualidade dos leads.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Results ───────────────────────────────────────── */}
          <div className="w-full lg:w-1/2 relative overflow-hidden flex flex-col min-h-[500px]">
            <AnimatePresence mode="wait">

              {/* ── STATE: Input preview ── */}
              {step === "input" ? (
                <motion.div
                  key="input-state"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.28 }}
                  className="flex-1 flex flex-col"
                >
                  {/* TOP — Sua Receita Atual */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-12 relative overflow-hidden"
                       style={{ background: PURPLE_TOP }}>
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-[60px] pointer-events-none" />
                    <p className="text-[11px] font-bold tracking-wide text-white/50 mb-3 uppercase">
                      Receita Atual (Mês)
                    </p>
                    <motion.div
                      key={r.currentRevenue}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-5xl md:text-[3.5rem] font-black text-white tracking-tighter leading-none"
                    >
                      <span className="text-xl font-bold opacity-40 mr-2">R$</span>
                      {r.currentRevenue.toLocaleString("pt-BR")}
                    </motion.div>
                    <p className="text-white/40 text-xs font-medium mt-3">Taxa de conversão atual: {r.convRate.toFixed(1)}%</p>
                  </div>

                  {/* BOTTOM — Poder da IA Tlin */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-12 relative overflow-hidden"
                       style={{ background: PURPLE_BOTTOM }}>
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/30 rounded-full blur-[60px] pointer-events-none" />
                    
                    <p className="text-sm text-white/70 font-medium leading-relaxed">
                      Sua operação tem potencial para converter mais leads através de atendimento instantâneo e qualificação automática.
                    </p>
                    {/* Mini conversion preview */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex-1 h-[3px] rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#B597FF] to-[#D1C2FF]"
                             style={{ width: `${Math.min(r.convRate * 4, 100)}%` }} />
                      </div>
                      <span className="text-xs font-black text-white/40 uppercase">Eficiência operacional atual</span>
                    </div>
                  </div>
                </motion.div>

              ) : (
                /* ── STATE: Result ── */
                <motion.div
                  key="result-state"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.35, type: "spring", bounce: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  {/* TOP — Receita Recuperável */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-12 relative overflow-hidden"
                       style={{ background: PURPLE_TOP }}>
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-[60px] pointer-events-none" />
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-wide border border-white/20 uppercase">
                        Diagnóstico Comercial
                      </span>
                      <button
                        onClick={() => setStep("input")}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] font-bold tracking-wide text-white/50 mb-3 uppercase">
                      Receita Recuperável Mensal
                    </p>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className="text-5xl md:text-[3.5rem] font-black text-white tracking-tighter leading-none"
                    >
                      <span className="text-xl font-bold opacity-40 mr-2">R$</span>
                      {r.extraRevenue.toLocaleString("pt-BR")}
                    </motion.div>
                    <p className="text-white/40 text-xs font-medium mt-3">+{r.gain}% de eficiência comercial com IA</p>
                  </div>

                  {/* BOTTOM — Breakdown */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-12 relative overflow-hidden"
                       style={{ background: PURPLE_BOTTOM }}>
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/30 rounded-full blur-[60px] pointer-events-none" />

                    {/* Conversion comparison */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-4 rounded-2xl bg-white/8 border border-white/10">
                        <p className="text-[10px] font-bold text-white/40 tracking-wide mb-1.5 uppercase">Conversão Atual</p>
                        <p className="text-2xl font-black text-white/70">{r.convRate.toFixed(1)}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/15 border border-white/20">
                        <p className="text-[10px] font-bold text-[#B597FF]/80 tracking-wide mb-1.5 uppercase">Com IA Comercial</p>
                        <p className="text-2xl font-black text-white">{r.newConvRate.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* ROI & Annual */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="pt-5 border-t border-white/10">
                        <p className="text-[10px] font-bold text-white/40 tracking-wide mb-1.5 uppercase">
                          ROI Estimado
                        </p>
                        <p className="text-2xl font-black text-white">
                          {r.roi.toFixed(0)}%
                        </p>
                      </div>
                      <div className="pt-5 border-t border-white/10">
                        <p className="text-[10px] font-bold text-white/40 tracking-wide mb-1.5 uppercase">
                          Projeção Anual
                        </p>
                        <p className="text-2xl font-black text-white">
                          R$ {(r.extraRevenue * 12).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-[10px] font-medium mt-10 px-4">
          * simulação baseada em médias operacionais. Os resultados reais dependem da qualidade do lead e script de vendas.
        </p>
      </div>
    </section>
  );
}
