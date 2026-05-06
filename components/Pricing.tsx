"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { animate } from "framer-motion";
import { useOfferTimer } from "@/lib/useOfferTimer";
// canvas-confetti is dynamically imported only when the user toggles to annual billing

import { useLanguage } from "@/lib/LanguageContext";

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

export function Pricing() {
  const { t } = useLanguage();
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
      desc: t.pricing.starterDesc,
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
      desc: t.pricing.scaleDesc,
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
        t.pricing.scaleF6
      ].filter(Boolean)
    },
    {
      name: t.pricing.enterpriseName,
      target: t.pricing.enterpriseTarget,
      priceStandard: 2997,
      priceMonthly: 1997,
      priceAnnual: 1597,
      period: "/mês",
      desc: t.pricing.enterpriseDesc,
      cta: t.pricing.enterpriseCta,
      highlight: false,
      features: [
        t.pricing.enterpriseF1,
        t.pricing.enterpriseF2,
        t.pricing.enterpriseF3,
        t.pricing.enterpriseF4,
        t.pricing.enterpriseF5,
        t.pricing.enterpriseF6
      ].filter(Boolean)
    }
  ];

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

  return (
    <section 
      id="pricing"
      onMouseMove={handleMouseMove}
      className="w-full py-24 relative overflow-hidden bg-white"
    >


       <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
             <div className={`transition-all duration-300 ${hoveredIndex !== null ? 'blur-[2px] opacity-60' : 'opacity-100'}`}>
                <div className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-150%]"
                    style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
                  />
                  <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[11px] font-bold tracking-wide text-[#B597FF] flex items-center gap-2">
                    💰 {t.pricing.badge}
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0c0d0d] mb-4">
                   {t.pricing.title}
                </h2>
             </div>
             
             <div className={`flex flex-col items-center justify-center gap-4 mt-6 transition-all duration-300 ${hoveredIndex !== null ? 'blur-[2px] opacity-60' : 'opacity-100'}`}>
                <div className="relative bg-zinc-100/50 p-1 rounded-full flex items-center border border-zinc-200 w-[280px]">
                   {/* Sliding Background */}
                   <motion.div 
                      className="absolute top-1 bottom-1 left-1 rounded-full bg-white border border-zinc-200/50 z-0"
                      initial={false}
                      animate={{ 
                        x: isAnnual ? "100%" : "0%",
                      }}
                      style={{ width: "calc(50% - 4px)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                   />
                   
                   <button 
                     onClick={() => setIsAnnual(false)}
                     className={`relative z-10 flex-1 py-2.5 rounded-full text-xs font-bold transition-colors duration-300 ${!isAnnual ? 'text-[#0c0d0d]' : 'text-zinc-500 hover:text-zinc-700'}`}
                   >
                     {t.pricing.monthly}
                   </button>
                   
                   <button 
                     onClick={() => setIsAnnual(true)}
                     className={`relative z-10 flex-1 py-2.5 rounded-full text-xs font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${isAnnual ? 'text-[#0c0d0d]' : 'text-zinc-500 hover:text-zinc-700'}`}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
             {plans.map((plan, idx) => {
               const priceToShow = isAnnual ? plan.priceAnnual : plan.priceMonthly;
               const isHovered = hoveredIndex === idx;
               const isOtherHovered = hoveredIndex !== null && !isHovered;
               const showAnimatedBorder = (plan.name === t.pricing.starterName || plan.name === t.pricing.enterpriseName) && isHovered;

               return (
                 <motion.div 
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`group relative flex flex-col rounded-[2.5rem] transition-all duration-300 ease-out p-[2px] overflow-hidden
                       ${isOtherHovered ? 'blur-[2px] opacity-60' : 'opacity-100'} 
                       ${isHovered ? '-translate-y-4' : 'translate-y-0'}
                      ${plan.badge ? plan.badgeColor : 'bg-transparent'} 
                      ${plan.highlight && !isOtherHovered ? 'z-20 shadow-[0_40px_100px_-20px_rgba(181,151,255,0.2)]' : 'z-10 shadow-sm'}
                    `}
                  >
                    {/* Rotating Border Background */}
                    {showAnimatedBorder && (
                      <div className="absolute inset-[-150%] animate-border-flow z-0" style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }} />
                    )}

                    {plan.badge && (
                        <div className="w-full py-3 text-center text-[11px] font-bold tracking-wide text-white relative z-20">
                           {plan.badge}
                        </div>
                    )}

                    <div className={`flex flex-col flex-1 p-9 rounded-[2.4rem] transition-colors duration-500 overflow-hidden relative z-10 ${plan.highlight ? 'bg-[#0c0d0d] text-white' : 'bg-white text-[#0c0d0d]'}`}>
                       {!plan.badge && !showAnimatedBorder && (
                          <div className="absolute inset-0 border border-zinc-100 rounded-[2.4rem] pointer-events-none" />
                       )}
                       
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h3 className="text-2xl font-bold tracking-tight mb-1">{plan.name}</h3>
                             <p className={`text-[11px] font-bold tracking-wide ${plan.highlight ? 'text-[#38E3FF]' : 'text-zinc-400'}`}>{plan.target}</p>
                          </div>
                       </div>

                       <div className="mb-8 min-h-[80px] flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-4">
                             <span className={`text-xs font-black line-through text-red-500/90`}>R$ {plan.priceStandard}</span>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#38E3FF]/15 text-[#38E3FF] tracking-wide flex items-center gap-1.5 border border-[#38E3FF]/20">
                                 {t.pricing.specialCondition}
                                 <span className="opacity-40 select-none">|</span>
                                 <span className="font-mono">{formattedTime}</span>
                              </span>
                          </div>
                          <div className="flex items-end gap-1">
                             <span className="text-4xl lg:text-6xl font-extrabold tracking-tighter leading-none flex items-center h-[50px]">
                                R${" "}<PriceDisplay value={priceToShow} highlight={plan.highlight} />
                             </span>
                             <span className={`text-sm font-bold pb-1 ${plan.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>{plan.period}</span>
                          </div>
                       </div>

                       <p className={`text-sm font-medium mb-10 leading-relaxed min-h-[48px] ${plan.highlight ? 'text-zinc-400' : 'text-zinc-600'}`}>{plan.desc}</p>

                       <div className="mt-auto">
                          <button className={`w-full py-4 rounded-2xl text-sm font-bold transition-all mb-10 ${plan.highlight ? 'bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-white hover:opacity-90 active:scale-95' : 'bg-[#0c0d0d] text-white hover:bg-zinc-800'}`}>
                             {plan.cta}
                          </button>

                           <p className={`text-[11px] font-bold tracking-wide mb-6 ${plan.highlight ? 'text-zinc-600' : 'text-zinc-300'}`}>{t.pricing.deliveryLevel}</p>
                          <ul className="space-y-4">
                             {plan.features.map((feat) => (
                                <li key={feat} className="flex items-start gap-3">
                                   <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-[#38E3FF]/20 text-[#38E3FF]' : 'bg-[#B597FF]/10 text-[#B597FF]'}`}>
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
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
       </div>
    </section>
  );
}
