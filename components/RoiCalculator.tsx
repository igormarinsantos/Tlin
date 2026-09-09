"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const LEADS_MIN = 40;
const LEADS_MAX = 10000;

export function RoiCalculator() {
  const { t } = useLanguage();
  const [opportunities, setOpportunities] = useState(500);
  const currentRate = 0.05;
  const projectedRate = 0.0625;
  const ticket = 500;
  const currentSales = Math.round(opportunities * currentRate);
  const projectedSales = Math.round(opportunities * projectedRate);
  const additionalRevenue = Math.max(0, (projectedSales - currentSales) * ticket);

  return (
    <section id="roi" className="w-full bg-black py-16 md:py-24" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex justify-center mb-8">
          <div className="relative inline-flex rounded-full overflow-hidden p-[1px]">
            <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]" style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }} />
            <div className="relative rounded-full bg-[#111016]/95 border border-white/10 px-4 py-2 text-[11px] font-bold tracking-wide text-white/80">{t.roi.badge}</div>
          </div>
        </div>
        <div className="relative rounded-[2rem] overflow-hidden p-[1px]">
          <div className="absolute inset-[-150%] animate-[spin_6s_linear_infinite]" style={{ backgroundImage: "conic-gradient(from 0deg, #B597FF 0 18%, #38E3FF 28%, #ffffff 40%, #B597FF 58%, #38E3FF 76%, #ffffff 90%, #B597FF 100%)" }} />
          <div className="relative rounded-[calc(2rem-1px)] bg-white p-6 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900">Veja o potencial da sua operação</h2>
            <p className="text-zinc-500 mt-3">Arraste para simular suas oportunidades comerciais mensais.</p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#b597ff] via-[#d9d4ff] to-[#38e3ff] border border-white/80 p-6 md:p-8 text-zinc-900 shadow-lg shadow-[#8a63d2]/20">
            <div className="flex items-end justify-between gap-4 mb-5">
              <span className="text-sm md:text-base font-bold text-zinc-600">Oportunidades por mês</span>
              <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8A63D2] to-[#159bb5]">{opportunities.toLocaleString("pt-BR")}</span>
            </div>
            <input type="range" min={LEADS_MIN} max={LEADS_MAX} step="10" value={opportunities} onChange={(e) => setOpportunities(Number(e.target.value))} className="w-full accent-[#0c0d0d]" />
            <div className="flex justify-between text-xs text-zinc-400 mt-2"><span>40</span><span>10.000+</span></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              <div className="rounded-2xl bg-white border border-white p-4 shadow-sm"><p className="text-xs text-zinc-500">Conversão atual</p><p className="text-2xl font-black mt-1 text-zinc-900">5%</p><p className="text-xs text-zinc-500">{currentSales} vendas</p></div>
              <div className="rounded-2xl bg-white border border-white p-4 shadow-sm"><p className="text-xs text-zinc-500">Com a Tlin</p><p className="text-2xl font-black mt-1 text-[#8A63D2]">6,25%</p><p className="text-xs text-zinc-500">{projectedSales} vendas</p></div>
              <div className="rounded-2xl bg-[#0c0d0d] p-4 text-white shadow-xl"><p className="text-xs font-bold text-[#38E3FF]">Receita adicional</p><p className="text-2xl font-black mt-1">R$ {additionalRevenue.toLocaleString("pt-BR")}</p><p className="text-xs text-white/60">por mês</p></div>
            </div>
          </div>
          <p className="text-center text-xs text-zinc-400 mt-6">Simulação baseada em ticket médio de R$ 500 e melhoria estimada de 25% na conversão. Os resultados reais variam conforme sua operação.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
