"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/LanguageContext";

// Lazy load heavy inner animations
const SalesNotification = dynamic(() => import("./SalesNotification").then(m => m.SalesNotification), { ssr: false });
const FunnelAnimation = dynamic(() => import("./FunnelAnimation").then(m => m.FunnelAnimation), { ssr: false });
const WhatsAppQualifyAnimation = dynamic(() => import("./WhatsAppQualifyAnimation").then(m => m.WhatsAppQualifyAnimation), { ssr: false });
const ObjectionAnimation = dynamic(() => import("./ObjectionAnimation").then(m => m.ObjectionAnimation), { ssr: false });

function FeatureMedia({ id }: { id: string }) {
  const gradients: Record<string, string> = {
    "f1": "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0c0d0d 100%)",
    "f2": "radial-gradient(circle at 50% 50%, #16102b 0%, #0c0d0d 100%)",
    "f3": "radial-gradient(circle at 50% 50%, #0d1a26 0%, #0c0d0d 100%)",
    "f4": "radial-gradient(circle at 50% 50%, #1a1528 0%, #0c0d0d 100%)",
  };

  return (
    <div className="w-full h-full relative group/media overflow-hidden" style={{ background: gradients[id] || gradients["f1"] }}>
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.6, 0.4] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-1/2 bg-gradient-to-tr from-[#B597FF]/10 to-[#38E3FF]/10 blur-[100px] rounded-full pointer-events-none"
      />
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  return (
    <div className="w-full h-[900px] md:h-[650px] relative py-8 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "600px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`w-full h-full overflow-hidden flex flex-col relative z-10 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
      >
        <div className="h-[300px] md:h-auto md:flex-1 p-8 md:p-12 flex flex-col justify-center shrink-0">
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-6 md:gap-8">
            <h3 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.2] md:leading-[1.1]">
              <div className="relative inline-block w-8 h-8 md:w-16 md:h-16 mr-2 md:mr-6 align-middle -mt-1">
                <Image 
                  src={feature.asset} 
                  alt="" 
                  fill
                  sizes="(max-width: 768px) 32px, 64px"
                  className="object-contain"
                />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">
                {feature.title}
              </span>
            </h3>
            <p className="text-lg md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-xl">
              {feature.desc}
            </p>
            
            {/* Desktop Button */}
            <div className="hidden md:block relative w-max mt-6">
              <button
                onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  mouseX.set(e.clientX - rect.left);
                  mouseY.set(e.clientY - rect.top);
                  setIsHovered(true);
                }}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  mouseX.set(e.clientX - rect.left);
                  mouseY.set(e.clientY - rect.top);
                }}
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    style={{ position: "absolute", left: springX, top: springY, x: "20px", y: "-50%", zIndex: 200, pointerEvents: "none" }}
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
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Mobile Button */}
        <div className="md:hidden px-8 pb-4 w-full mt-8">
           <button
             onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })}
             className="relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer block w-full"
           >
             <div className="absolute inset-[-150%] opacity-100 animate-[spin_3s_linear_infinite]"
               style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
             />
             <div className="relative px-8 py-4 rounded-full font-bold text-base z-10 block w-full text-white transition-colors duration-300 text-center">
               <span className="relative z-10">{(t.features as any)[`${feature.id}_cta`] || t.features.cta}</span>
               <div className="absolute inset-0 bg-zinc-950 rounded-full transition-opacity duration-500" />
             </div>
           </button>
        </div>

        <div className="h-[480px] md:h-auto md:flex-1 relative overflow-hidden p-2 md:p-6 flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden relative flex items-center justify-center p-[2px]">
            <div className="absolute inset-[-100%] opacity-100 animate-[spin_4s_linear_infinite]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
            />
            <div className="absolute inset-[2px] bg-[#F8F6FF] rounded-[1.9rem] md:rounded-[2.9rem] z-0" />
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
      asset: "/Fone.png",
      video: "https://v1.bg.bing.com/az/hprichbg/rb/WaterCycle_EN-US11175626217_1920x1080.mp4"
    },
    {
      id: "f2",
      title: t.features.f2_title,
      desc: t.features.f2_desc,
      asset: "/Funil.png",
      video: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-18155-large.mp4"
    },
    {
      id: "f3",
      title: t.features.f3_title,
      desc: t.features.f3_desc,
      asset: "/Foguete.png",
      video: "https://assets.mixkit.co/videos/preview/mixkit-tech-worker-examining-the-server-room-23654-large.mp4"
    },
    {
      id: "f4",
      title: t.features.f4_title,
      desc: t.features.f4_desc,
      asset: "/Star.png",
      video: "https://assets.mixkit.co/videos/preview/mixkit-business-charts-on-a-digital-screen-2268-large.mp4"
    }
  ];

  return (
    <section className="w-full bg-white py-24 md:py-32 relative px-4 md:px-8 section-to-blur">
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
            className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[1.05] text-center"
          >
            <span dangerouslySetInnerHTML={{ __html: t.features.title }} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">{t.features.titleHighlight}</span>
          </motion.h2>
        </div>

        {/* Standard Flow Layout */}
        <div className="relative w-full flex flex-col gap-y-24 md:gap-y-32">
          {featuresList.map((feature, idx) => (
            <FeatureCard
              key={idx}
              feature={feature}
              idx={idx}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
