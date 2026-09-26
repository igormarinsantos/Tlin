"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/LanguageContext";
import { withoutClosingPeriod } from "@/lib/marketingCopy";

import { SalesNotification } from "./SalesNotification";
import { FunnelAnimation } from "./FunnelAnimation";
import { WhatsAppQualifyAnimation } from "./WhatsAppQualifyAnimation";
import { ObjectionAnimation } from "./ObjectionAnimation";

function FeatureMedia({ id, animated = true }: { id: string; animated?: boolean }) {
  const gradients: Record<string, string> = {
    "f1": "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0c0d0d 100%)",
    "f2": "radial-gradient(circle at 50% 50%, #16102b 0%, #0c0d0d 100%)",
    "f3": "radial-gradient(circle at 50% 50%, #0d1a26 0%, #0c0d0d 100%)",
    "f4": "radial-gradient(circle at 50% 50%, #1a1528 0%, #0c0d0d 100%)",
  };

  return (
    <div className="w-full h-full relative group/media overflow-hidden" style={{ background: gradients[id] || gradients["f1"] }}>
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      {animated ? (
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.6, 0.4] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-1/2 bg-gradient-to-tr from-[#B597FF]/10 to-[#38E3FF]/10 blur-[100px] rounded-full pointer-events-none"
        />
      ) : (
        <div className="absolute -inset-1/2 bg-gradient-to-tr from-[#B597FF]/15 to-[#38E3FF]/15 blur-[80px] rounded-full pointer-events-none" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0d] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

function FeatureCard({
  feature,
  idx
}: {
  feature: { title: string, desc: string, asset: string, video: string, id: string },
  idx: number
}) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isMotionPaused, setIsMotionPaused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const updateAnimations = () => {
      card.getAnimations({ subtree: true }).forEach((animation) => {
        if (isMotionPaused) animation.pause();
        else if (animation.playState === "paused") animation.play();
      });
    };

    updateAnimations();
    const observer = new MutationObserver(updateAnimations);
    observer.observe(card, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isMotionPaused]);

  return (
    <div ref={cardRef} data-feature-paused={isMotionPaused} className="relative w-full py-8 md:h-[650px] md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "600px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`relative z-10 flex w-full flex-col md:h-full md:overflow-hidden ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
      >
        <div className="h-[300px] md:h-auto md:flex-1 p-8 md:p-12 flex flex-col justify-center shrink-0">
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-6 md:gap-8">
            <h3 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.2] md:leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">
                {feature.title}
              </span>
            </h3>
            <p 
              className="text-lg md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-xl"
              dangerouslySetInnerHTML={{ __html: withoutClosingPeriod(feature.desc) }}
            />
            
            {/* Desktop Button */}
            <div className="hidden md:block relative w-max mt-6">
              <button
                onClick={() => {
                  const lenis = (window as any).lenis;
                  if (lenis) lenis.scrollTo('#planos', { offset: -40 });
                  else document.querySelector('#planos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer block w-full md:w-max"
              >
                <div className="absolute inset-[-150%] opacity-100 animate-[spin_3s_linear_infinite]"
                  style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
                />
                <div className="relative px-8 py-4 md:py-5 rounded-full font-bold text-base md:text-lg z-10 block w-full text-white transition-colors duration-300 group-hover/btn:text-[#0c0d0d] text-center">
                  <span className="relative z-10">{(t.features as any)[`${feature.id}_cta`] || t.features.cta}</span>
                  <div className="absolute inset-0 bg-zinc-950 rounded-full transition-opacity duration-500 group-hover/btn:opacity-0" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
                </div>
              </button>

              <AnimatePresence>
                {isHovered && (
                  <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[200] -translate-x-1/2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 8 }}
                    >
                      <div className="relative p-[1px] rounded-full overflow-hidden inline-flex">
                        <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
                          style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
                        />
                        <div className="relative px-2 py-0.5 bg-zinc-950 rounded-full text-white border border-white/10 whitespace-nowrap">
                          <span className="text-[10px] font-bold tracking-wide leading-none">{t.nav.demo}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Mobile Button */}
        <div className="md:hidden px-8 pb-4 w-full mt-8">
           <button
             onClick={() => {
               const lenis = (window as any).lenis;
               if (lenis) lenis.scrollTo('#planos', { offset: -40 });
               else document.querySelector('#planos')?.scrollIntoView({ behavior: 'smooth' });
             }}
             className="relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer block w-full"
           >
             <div className="absolute inset-[-150%] opacity-100 md:animate-[spin_3s_linear_infinite]"
               style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
             />
             <div className="relative px-8 py-4 rounded-full font-bold text-base z-10 block w-full text-white transition-colors duration-300 text-center">
               <span className="relative z-10">{(t.features as any)[`${feature.id}_cta`] || t.features.cta}</span>
               <div className="absolute inset-0 bg-zinc-950 rounded-full transition-opacity duration-500" />
             </div>
           </button>
        </div>

        <div className="relative flex h-[560px] shrink-0 items-center justify-center p-2 sm:h-[520px] md:h-auto md:flex-1 md:p-6">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] p-[2px] md:rounded-[3rem]">
            <div className="absolute inset-[-100%] opacity-100 md:animate-[spin_4s_linear_infinite]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
            />
            <div className="absolute inset-[2px] z-0 rounded-[1.9rem] bg-[#F8F6FF] md:rounded-[2.9rem]" />
            <div className="relative z-10 w-full h-full">
              {feature.id === "f1" ? (
                <ObjectionAnimation />
              ) : feature.id === "f3" ? (
                <SalesNotification />
              ) : feature.id === "f4" ? (
                <FunnelAnimation />
              ) : feature.id === "f2" ? (
                <WhatsAppQualifyAnimation />
              ) : (
                <FeatureMedia id={feature.id} />
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsMotionPaused((paused) => !paused)}
              aria-pressed={isMotionPaused}
              aria-label={`${isMotionPaused ? "Reproduzir" : "Pausar"} animação: ${feature.title}`}
              className="absolute bottom-5 right-5 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-800 transition-colors duration-200 hover:bg-zinc-100 active:bg-zinc-200 md:bottom-8 md:right-8"
              title={isMotionPaused ? "Reproduzir animação" : "Pausar animação"}
            >
              {isMotionPaused ? <Play size={14} fill="currentColor" aria-hidden="true" /> : <Pause size={14} fill="currentColor" aria-hidden="true" />}
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export function Features() {
  const { t } = useLanguage();

  const featuresList = [
    {
      id: "f1",
      title: t.features.f1_title,
      desc: t.features.f1_desc,
      asset: "/_unused/RAIO.avif",
      video: "https://v1.bg.bing.com/az/hprichbg/rb/WaterCycle_EN-US11175626217_1920x1080.mp4"
    },
    {
      id: "f2",
      title: t.features.f2_title,
      desc: t.features.f2_desc,
      asset: "/_unused/Ima.avif",
      video: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-18155-large.mp4"
    },
    {
      id: "f3",
      title: t.features.f3_title,
      desc: t.features.f3_desc,
      asset: "/_unused/Foguete.avif",
      video: "https://assets.mixkit.co/videos/preview/mixkit-tech-worker-examining-the-server-room-23654-large.mp4"
    },
    {
      id: "f4",
      title: t.features.f4_title,
      desc: t.features.f4_desc,
      asset: "/_unused/Funil.avif",
      video: "https://assets.mixkit.co/videos/preview/mixkit-business-charts-on-a-digital-screen-2268-large.mp4"
    }
  ];

  return (
    <section id="como-funciona" className="w-full bg-white py-24 md:py-32 relative px-4 md:px-8 section-to-blur">
      <style jsx global>{`[data-feature-paused="true"] *, [data-feature-paused="true"] *::before, [data-feature-paused="true"] *::after { animation-play-state: paused !important; }`}</style>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-32 text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "200px" }}
            className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-8"
          >
            <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
            />
            <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide flex items-center gap-2">
              {t.features.badge}
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "200px" }}
            className="text-4xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[1.08] text-center"
          >
            <span dangerouslySetInnerHTML={{ __html: t.features.title.replace("<br />", '<br class="hidden md:block" />') }} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">{t.features.titleHighlight}</span>
          </motion.h2>
        </div>

        {/* Standard Flow Layout */}
        <div className="relative w-full flex flex-col gap-y-24 md:gap-y-32">
          {featuresList.map((feature, idx) => (
            <div key={idx}>
              {idx === 0 && (
                <h2 id="agentes" className="sr-only">
                  {t.features.agentesTitle}
                </h2>
              )}
              {idx === 1 && (
                <h2 id="crm" className="sr-only">
                  {t.features.crmTitle}
                </h2>
              )}
              <FeatureCard feature={feature} idx={idx} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
