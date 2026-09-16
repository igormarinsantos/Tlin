"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { withoutClosingPeriod } from "@/lib/marketingCopy";

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
          <div className="absolute inset-[-150%] animate-[spin_6s_linear_infinite]" style={{ backgroundImage: "conic-gradient(from 0deg, #B597FF 0 18%, #38E3FF 28%, #26242f 40%, #B597FF 58%, #38E3FF 76%, #26242f 90%, #B597FF 100%)" }} />
          <div className="relative rounded-[calc(2rem-1px)] bg-[#111016] p-8 shadow-2xl md:p-16">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">{withoutClosingPeriod(t.roi.heading)}</h2>
            <p className="mt-3 text-zinc-400">{withoutClosingPeriod(t.roi.sliderSubtitle)}</p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#B597FF] to-[#38E3FF] p-6 md:p-10 text-zinc-900 -mx-6 md:-mx-14 -mb-6 md:-mb-14">
            <div className="flex items-end justify-between gap-4 mb-6">
              <span className="text-sm md:text-base font-bold text-zinc-800">{t.roi.opportunitiesLabel}</span>
              <span className="text-3xl md:text-5xl font-black text-zinc-950">{opportunities.toLocaleString("pt-BR")}</span>
            </div>
            <input type="range" min={LEADS_MIN} max={LEADS_MAX} step="10" value={opportunities} onChange={(e) => setOpportunities(Number(e.target.value))} className="w-full accent-[#0c0d0d]" />
            <div className="flex justify-between text-xs text-zinc-700 mt-2"><span>40</span><span>10.000+</span></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-10">
              <div className="rounded-2xl border border-white/10 bg-[#111016]/90 p-5 md:p-6"><p className="text-xs text-white/60">{t.roi.currentRateLabel}</p><p className="mt-1 text-2xl font-black text-white">5%</p><p className="text-xs text-white/60">{currentSales} {t.roi.salesSuffix}</p></div>
              <div className="rounded-2xl border border-white/10 bg-[#111016]/90 p-5 md:p-6"><p className="text-xs text-white/60">{t.roi.withTlinLabel}</p><p className="mt-1 text-2xl font-black text-[#B597FF]">6,25%</p><p className="text-xs text-white/60">{projectedSales} {t.roi.salesSuffix}</p></div>
              <div className="rounded-2xl border border-white/10 bg-[#0c0d0d] p-5 text-white md:p-6"><p className="text-xs font-bold text-[#38E3FF]">{t.roi.additionalRevenueLabel}</p><p className="mt-1 text-2xl font-black">R$ {additionalRevenue.toLocaleString("pt-BR")}</p><p className="text-xs text-white/60">{t.roi.perMonthLabel}</p></div>
            </div>
          </div>
          </div>
        </div>
        <p className="text-center text-xs text-white/40 mt-6">{t.roi.disclaimer}</p>
      </div>
    </section>
  );
}
