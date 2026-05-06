"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Minus, Plus, RotateCcw, TrendingUp } from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";

const TLIN_BOOST = 0.20;

// ── Brand purple palette ────────────────────────────────────────────────────
const PURPLE_TOP    = "#9D7BFF"; // topo — lilas vibrante
const PURPLE_BOTTOM = "#7B5AD2"; // baixo — lilas mais profundo

export function RoiCalculator() {
  const { t } = useLanguage();
  const [leads, setLeads]               = useState(1000);
  const [ticket, setTicket]             = useState(500);
  const [currentSales, setCurrentSales] = useState(10);
  const [step, setStep]                 = useState<"input" | "result">("input");

  const r = useMemo(() => {
    const convRate    = leads > 0 ? (currentSales / leads) * 100 : 0;
    const newConvRate = convRate * (1 + TLIN_BOOST);
    const newSales    = Math.floor(leads * (newConvRate / 100));
    const extraSales  = Math.max(0, newSales - currentSales);
    const extraRevenue    = extraSales * ticket;
    const currentRevenue  = currentSales * ticket;
    return { currentRevenue, extraSales, extraRevenue, newConvRate, convRate };
  }, [leads, ticket, currentSales]);

  return (
    <section
      id="roi"
      className="w-full relative bg-black py-16 md:py-24 overflow-hidden"
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-150%]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
            />
            <div className="relative px-4 py-1.5 rounded-full bg-[#0c0d0d] border border-white/10 text-white text-[11px] font-bold tracking-wide flex items-center gap-2">
              {t.roi.badge}
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            {t.roi.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#D1C2FF]">
              {t.roi.titleHighlight}
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            {t.roi.subtitle}
          </p>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-[2rem] overflow-hidden flex flex-col lg:flex-row">

          {/* ── LEFT: Inputs ────────────────────────────────────────── */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-between bg-white relative z-10">

            <div>
              <p className="text-[11px] font-bold text-zinc-400 tracking-wide mb-8">
                {t.roi.details}
              </p>

              <div className="space-y-9">

                {/* Leads slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-zinc-700">{t.roi.leads}</label>
                    <div className="px-3 py-1 rounded-full bg-[#B597FF]/10 text-[#8A63D2] text-sm font-black">
                      {leads.toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div className="relative h-6 flex items-center">
                    <div className="absolute left-0 right-0 h-[3px] bg-zinc-100 rounded-full overflow-hidden">
                      <div className="absolute left-0 h-full rounded-full bg-gradient-to-r from-[#B597FF] to-[#D1C2FF]"
                           style={{ width: `${(leads / 10000) * 100}%` }} />
                    </div>
                    <input
                      type="range" min={100} max={10000} step={100} value={leads}
                      onChange={e => { setLeads(+e.target.value); setStep("input"); }}
                      className="w-full h-6 appearance-none cursor-pointer bg-transparent relative z-10"
                      style={{ "--thumb-color": "#B597FF" } as any}
                    />
                  </div>
                </div>

                {/* Ticket slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-zinc-700">{t.roi.ticket}</label>
                    <div className="px-3 py-1 rounded-full bg-[#B597FF]/10 text-[#8A63D2] text-sm font-black">
                      R$ {ticket.toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div className="relative h-6 flex items-center">
                    <div className="absolute left-0 right-0 h-[3px] bg-zinc-100 rounded-full overflow-hidden">
                      <div className="absolute left-0 h-full rounded-full bg-gradient-to-r from-[#B597FF] to-[#D1C2FF]"
                           style={{ width: `${(ticket / 10000) * 100}%` }} />
                    </div>
                    <input
                      type="range" min={100} max={10000} step={50} value={ticket}
                      onChange={e => { setTicket(+e.target.value); setStep("input"); }}
                      className="w-full h-6 appearance-none cursor-pointer bg-transparent relative z-10"
                      style={{ "--thumb-color": "#B597FF" } as any}
                    />
                  </div>
                </div>

                {/* Vendas counter */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-700">{t.roi.sales}</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setCurrentSales(Math.max(1, currentSales - 1)); setStep("input"); }}
                      className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-lg font-black text-zinc-800">
                      {currentSales}
                    </div>
                    <button
                      onClick={() => { setCurrentSales(currentSales + 1); setStep("input"); }}
                      className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-[#B597FF] hover:text-[#8A63D2] transition-colors"
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
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#B597FF] to-[#D1C2FF] text-white font-black text-sm tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {t.roi.cta1} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full py-4 rounded-full bg-[#0c0d0d] text-white font-black text-sm tracking-wide hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" /> {t.roi.cta2}
                </button>
              )}

              {/* Live preview teaser below button */}
              <p className="text-center text-[11px] text-zinc-400 mt-4 font-medium">
                {t.roi.teaser}
              </p>
            </div>
          </div>

          {/* ── RIGHT: Results ───────────────────────────────────────── */}
          <div className="w-full lg:w-1/2 relative overflow-hidden flex flex-col">
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
                    <p className="text-[11px] font-bold tracking-wide text-white/50 mb-3">
                      {t.roi.currentRev}
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
                    <p className="text-white/40 text-xs font-medium mt-3">{t.roi.basedOn}</p>
                  </div>

                  {/* BOTTOM — Poder da IA Tlin */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-12 relative overflow-hidden"
                       style={{ background: PURPLE_BOTTOM }}>
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/30 rounded-full blur-[60px] pointer-events-none" />
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B597FF]" />
                      <p className="text-[11px] font-bold tracking-wide text-white/50">
                        {t.roi.powerTlin}
                      </p>
                    </div>
                    <p className="text-sm text-white/70 font-medium leading-relaxed">
                      {t.roi.powerDesc}
                    </p>
                    {/* Mini conversion preview */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex-1 h-[3px] rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#B597FF] to-[#D1C2FF]"
                             style={{ width: `${Math.min(r.convRate * 8, 100)}%` }} />
                      </div>
                      <span className="text-xs font-black text-white/40">{r.convRate.toFixed(1)}% {t.roi.convCurrent}</span>
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
                  {/* TOP — Faturamento Adicional */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-12 relative overflow-hidden"
                       style={{ background: PURPLE_TOP }}>
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-[60px] pointer-events-none" />
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-wide border border-white/20">
                        {t.roi.revealed}
                      </span>
                      <button
                        onClick={() => setStep("input")}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] font-bold tracking-wide text-white/50 mb-3">
                      {t.roi.hiddenRev}
                    </p>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className="text-5xl md:text-[3.5rem] font-black text-white tracking-tighter leading-none"
                    >
                      <span className="text-xl font-bold opacity-40 mr-2">R$</span>
                      {r.extraRevenue.toLocaleString("pt-BR")}
                      <span className="text-base font-bold opacity-30 ml-2">{t.roi.perMonth}</span>
                    </motion.div>
                  </div>

                  {/* BOTTOM — Breakdown */}
                  <div className="flex-1 flex flex-col justify-center px-10 py-12 relative overflow-hidden"
                       style={{ background: PURPLE_BOTTOM }}>
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/30 rounded-full blur-[60px] pointer-events-none" />

                    {/* Conversion comparison */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-4 rounded-2xl bg-white/8 border border-white/10">
                        <p className="text-[10px] font-bold text-white/40 tracking-wide mb-1.5">{t.roi.convLabel}</p>
                        <p className="text-2xl font-black text-white/70">{r.convRate.toFixed(1)}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/15 border border-white/20">
                        <p className="text-[10px] font-bold text-[#B597FF]/80 tracking-wide mb-1.5">{t.roi.withTlin}</p>
                        <p className="text-2xl font-black text-white">{r.newConvRate.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Annual projection */}
                    <div className="pt-5 border-t border-white/10">
                      <p className="text-[10px] font-bold text-white/40 tracking-wide mb-1.5">
                        {t.roi.annualProj}
                      </p>
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-black text-white"
                      >
                        R$ {(r.extraRevenue * 12).toLocaleString("pt-BR")}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-xs font-medium mt-10 px-4">
          {t.roi.footerNote}
        </p>
      </div>
    </section>
  );
}
