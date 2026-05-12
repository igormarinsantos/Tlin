"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Minus, Plus, RotateCcw } from "lucide-react";

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
    // 1. Conversão Atual (vendasMensais / leadsMensais)
    const convAtualRaw = leads > 0 ? (currentSales / leads) : 0;
    const convAtual = Math.min(Math.max(convAtualRaw, 0.005), 0.6);

    // 2. Ganho Base (Por maturidade operacional)
    let ganhoBase = 0.08;
    if (convAtual < 0.05) ganhoBase = 0.35;
    else if (convAtual < 0.10) ganhoBase = 0.25;
    else if (convAtual < 0.20) ganhoBase = 0.15;

    // 3. Fator Ticket (Complexidade da venda)
    let ticketFactor = 0.5;
    if (ticket < 500) ticketFactor = 1.0;
    else if (ticket < 2000) ticketFactor = 0.85;
    else if (ticket < 5000) ticketFactor = 0.7;

    // 4. Fator Volume (Maturidade operacional)
    let volumeFactor = 1.0;
    if (leads > 2000) volumeFactor = 0.7;
    else if (leads > 1000) volumeFactor = 0.85;

    // 5. Ganho Final e Conversão Projetada (Max 75%)
    const ganhoFinal = ganhoBase * ticketFactor * volumeFactor;
    const newConvRate = Math.min(convAtual * (1 + ganhoFinal), 0.75);

    // 6. Receita e ROI
    const currentRevenue = currentSales * ticket;
    const newSales = Math.floor(leads * newConvRate);
    const revenueProjetada = newSales * ticket;
    const ganhoMensal = Math.max(0, revenueProjetada - currentRevenue);

    // 7. Projeção Anual Progressiva (Onboarding -> Adaptação -> Refinamento)
    const projecaoAnualBruta = (ganhoMensal * 0.7 * 3) + (ganhoMensal * 0.85 * 3) + (ganhoMensal * 1 * 6);

    // 8. Custos (Plano Scale)
    const setupFee = 2197;
    const monthlyFee = 1497; // Mensalidade base do plano scale
    const custoAnual = setupFee + (monthlyFee * 12);
    
    // 9. Ganho Líquido e ROI (Simplificado para visibilidade)
    const annualGrossGain = projecaoAnualBruta;
    const monthlyTotalCost = (setupFee / 12) + monthlyFee;
    const monthlyRoi = ganhoMensal > 0 ? ((ganhoMensal - monthlyFee) / monthlyFee) * 100 : 0;

    return { 
      currentRevenue, 
      ganhoMensal, 
      newConvRate: newConvRate * 100, 
      convRate: convAtual * 100, 
      gain: Math.round(ganhoFinal * 100),
      roi: monthlyRoi,
      projecaoAnual: annualGrossGain,
      payback: Math.ceil(setupFee / Math.max(ganhoMensal - monthlyFee, 1))
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
            Calcule quanto sua operação{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">
              deixa na mesa?
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Simulação baseada em médias operacionais de conversão via WhatsApp.
          </p>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-[2rem] overflow-hidden flex flex-col lg:flex-row lg:items-stretch min-h-[600px] lg:h-[680px]">

          {/* ── LEFT: Inputs ────────────────────────────────────────── */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-between bg-white relative z-10 border-r border-zinc-50">

            <div>
              <div className="flex justify-between items-center mb-8">
                <p className="text-[11px] font-bold text-zinc-400 tracking-wide uppercase">
                  insira os dados do seu negócio
                </p>
                <div className="text-[10px] font-bold text-[#B597FF]">
                  simulação com dados aproximados
                </div>
              </div>

              <div className="space-y-12">

                {/* Leads Input & Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-zinc-700">
                      Leads Mensais <span className="text-[10px] text-zinc-400 font-medium ml-1">(Quantidade de clientes no WhatsApp com intenção de compra)</span>
                    </label>
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

                </div>

                {/* Ticket Input & Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-zinc-700">
                      Ticket Médio <span className="text-[10px] text-zinc-400 font-medium ml-1">(Preço médio por venda)</span>
                    </label>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex flex-row items-center gap-2 justify-end">
                        {TICKET_SUGGESTIONS.map(s => (
                          <button 
                            key={s} 
                            onClick={() => { setTicket(s); setStep("input"); }}
                            className={`text-[10px] font-bold px-2.5 py-1.5 rounded-md border transition-all whitespace-nowrap ${ticket === s ? 'bg-[#B597FF] border-[#B597FF] text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:border-zinc-300'}`}
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

                </div>

                {/* Vendas counter */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-zinc-700">
                    Vendas Mensais <span className="text-[10px] text-zinc-400 font-medium ml-1">(Valor estimado de vendas realizadas no mês)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="Diminuir Vendas"
                      onClick={() => { setCurrentSales(Math.max(1, currentSales - 1)); setStep("input"); }}
                      className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors active:scale-95"
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
                      className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors active:scale-95"
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
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-black font-black text-sm tracking-wide hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Ver em quanto tempo a Tlin se paga? <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                null
              )}

              {/* Live preview teaser below button */}
              <p className="text-center text-[10px] text-zinc-400 mt-4 font-medium leading-relaxed max-w-[90%] mx-auto">
                os resultados podem variar conforme processo comercial, velocidade de atendimento e qualidade dos leads.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Results ───────────────────────────────────────── */}
          <div className="w-full lg:w-1/2 relative overflow-hidden flex flex-col bg-zinc-50/50 h-full">
            <AnimatePresence mode="wait">

              {/* ── STATE: Input preview ── */}
              {step === "input" ? (
                <motion.div
                  key="input-state"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  {/* TOP — Sua Receita Atual */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-10 relative overflow-hidden bg-[#9D7BFF]">
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-[60px] pointer-events-none" />
                    <p className="text-[11px] font-bold tracking-widest text-white/50 mb-3 uppercase">
                      situação atual
                    </p>
                    <motion.div
                      key={r.currentRevenue}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl md:text-6xl font-black text-white tracking-tighter"
                    >
                      <span className="text-xl font-bold opacity-30 mr-2">R$</span>
                      {r.currentRevenue.toLocaleString("pt-BR")}
                    </motion.div>
                    <p className="text-white/70 text-sm font-medium mt-4 leading-relaxed max-w-[300px]">
                      Faturamento médio mensal baseado nos dados atuais de vendas.
                    </p>
                  </div>

                  {/* BOTTOM — Poder da IA Tlin */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-10 relative overflow-hidden bg-[#7B5AD2]">
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/20 rounded-full blur-[60px] pointer-events-none" />
                    
                    <div className="space-y-4">
                      <p className="text-sm text-white font-medium leading-relaxed opacity-90">
                        Sua operação pode estar perdendo oportunidades por demora no atendimento e ausência de follow-up.
                      </p>
                      <p className="text-[12px] text-white/50 font-medium leading-relaxed">
                        A IA comercial Tlin atua aumentando velocidade e consistência na recuperação de leads.
                      </p>
                    </div>
                  </div>
                </motion.div>

              ) : (
                /* ── STATE: Result ── */
                <motion.div
                  key="result-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col bg-gradient-to-br from-[#B597FF] to-[#38E3FF]"
                >
                  {/* TOP — Retorno Hero */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-10 relative">
                    <button
                      onClick={() => setStep("input")}
                      className="absolute top-8 right-8 p-3 rounded-full hover:bg-black/5 transition-colors group z-20"
                    >
                      <RotateCcw className="w-4 h-4 text-black/40 group-hover:text-black/80 transition-transform duration-500 group-hover:-rotate-180" />
                    </button>
                    
                    <div className="space-y-4">
                      <h3 className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-[1.05] max-w-[400px]">
                        Retorno potencial já no início da operação
                      </h3>
                    </div>
                  </div>

                  {/* BOTTOM — Métrica Comparativa */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-10 pt-0">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-black/40 tracking-tight">Conversão atual</p>
                        <p className="text-xl font-black text-black/30">{r.convRate.toFixed(1)}%</p>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-black" />
                      </div>

                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-black/60 tracking-tight">Conversão possível</p>
                        <p className="text-xl font-black text-black">±{r.newConvRate.toFixed(1)}%</p>
                        <p className="text-[10px] font-bold text-black/60">~{r.gain}% ganho potencial</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-black/10 text-center">
                      <div className="space-y-1 mb-6">
                        <p className="text-[10px] font-bold text-black/40 tracking-tight uppercase">Projeção anual possível</p>
                        <p className="text-4xl font-black text-black tracking-tighter">±R$ {r.projecaoAnual.toLocaleString("pt-BR")}</p>
                        <p className="text-[10px] font-bold text-black/40 leading-relaxed max-w-[280px] mx-auto">
                          Faturamento incremental recuperado em 12 meses de operação.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const lenis = (window as any).lenis;
                          if (lenis) lenis.scrollTo('#pricing', { offset: -40 });
                          else document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-4 rounded-full bg-black text-white font-black text-sm tracking-wide hover:bg-zinc-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        Alavancar meu comercial agora <ArrowRight className="w-4 h-4" />
                      </button>
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
