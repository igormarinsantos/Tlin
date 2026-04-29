"use client";

import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion";
import { Play, Pause, ChevronLeft, ChevronRight, Link, Globe, Zap, ShieldCheck, Headphones, Cpu, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const features = [
  {
    title: "Agente Focado em Conversão",
    desc: "Esqueça chatbots de menu. Nossa IA é treinada com seus melhores scripts para contornar objeções, negociar e converter leads 24/7.",
    asset: "/Fone.png",
    video: "https://v1.bg.bing.com/az/hprichbg/rb/WaterCycle_EN-US11175626217_1920x1080.mp4"
  },
  {
    title: "Qualificação Cirúrgica",
    desc: "A Tlin faz as perguntas certas no WhatsApp, identifica a temperatura do lead e envia pro seu CRM apenas quem já está pronto para comprar.",
    asset: "/Funil.png",
    video: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-18155-large.mp4"
  },
  {
    title: "Escala Sem Aumentar Custos",
    desc: "Atenda 1.000 leads simultâneos com a mesma agressividade e persuasão do seu melhor closer, sem inchar sua folha de pagamento.",
    asset: "/Foguete.png",
    video: "https://assets.mixkit.co/videos/preview/mixkit-tech-worker-examining-the-server-room-23654-large.mp4"
  },
  {
    title: "Controle Absoluto do Funil",
    desc: "Chega de achismos. Acompanhe em tempo real as métricas que importam: leads qualificados, taxa de conversão e faturamento recuperado.",
    asset: "/Star.png",
    video: "https://assets.mixkit.co/videos/preview/mixkit-business-charts-on-a-digital-screen-2268-large.mp4"
  }
];

const gridFeatures = [
  {
    title: "Integrações",
    desc: "Conecte sua IA com CRM, WhatsApp e ferramentas que você já usa.",
    icon: <Link className="w-5 h-5" />,
    image: "/abstract_3d_shape_2_1776947904190.png",
    chip: "Conectividade Total"
  },
  {
    title: "Multilíngue (+50)",
    desc: "Sua IA atende em mais de 50 idiomas com fluência nativa.",
    icon: <Globe className="w-5 h-5" />,
    image: "/abstract_3d_shape_3_1776947924614.png",
    chip: "Escala Global"
  },
  {
    title: "Onboarding Express",
    desc: "Processo de implementação guiado para rodar em menos de 48h.",
    icon: <Zap className="w-5 h-5" />,
    image: "/abstract_3d_shape_1_1776947879938.png",
    chip: "Foco no ROI"
  },
  {
    title: "Segurança Total",
    desc: "Dados criptografados e conformidade rigorosa com a LGPD.",
    icon: <ShieldCheck className="w-5 h-5" />,
    image: "/abstract_3d_shape_2_1776947904190.png",
    chip: "Privacy First"
  },
  {
    title: "Time de Sucesso",
    desc: "Especialistas focados em maximizar seu ROI 24h por dia.",
    icon: <Headphones className="w-5 h-5" />,
    image: "/abstract_3d_shape_3_1776947924614.png",
    chip: "Suporte 24/7"
  },
  {
    title: "Modelos Topo",
    desc: "Usamos os LLMs mais potentes do mercado (GPT-4 / Claude).",
    icon: <Cpu className="w-5 h-5" />,
    image: "/abstract_3d_shape_1_1776947879938.png",
    chip: "Ultra Inteligência"
  }
];

function FeatureMedia({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full h-full relative group/media overflow-hidden bg-zinc-900">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'grayscale hover:grayscale-0' : 'grayscale-0 blur-[2px] opacity-60'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-6 right-6 z-30">
        <button
          onClick={togglePlay}
          className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 group/btn"
        >
          <div className="absolute inset-0 bg-[#0c0d0d]/40 backdrop-blur-xl border border-white/20 rounded-full transition-all duration-300 group-hover/btn:bg-[#0c0d0d]/60 group-hover/btn:scale-110 group-hover/btn:border-white/30" />
          <div className="relative z-10 text-white">
            {isPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
          </div>
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ 
  feature, 
  idx, 
  total,
  scrollYProgress
}: { 
  feature: any, 
  idx: number, 
  total: number,
  scrollYProgress: MotionValue<number>
}) {
  const topOffset = 100 + (idx * 24);
  
  // Scale down older cards as new ones cover them
  const targetScale = 1 - ((total - 1 - idx) * 0.04);
  const startRange = idx / total;
  const range = [startRange, 1];
  const scale = useTransform(scrollYProgress, range, [1, targetScale]);

  return (
    <div 
      className="sticky w-full h-[450px] md:h-[500px]"
      style={{ 
        top: `${topOffset}px`, 
        zIndex: 10 + idx 
      }}
    >
      <motion.div
        style={{ scale }}
        className="absolute inset-0 shadow-2xl p-[1.5px] rounded-[3rem] md:rounded-[4.5rem] bg-white origin-top"
      >
        {/* Animated Border per card */}
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-[3rem] md:rounded-[4.5rem]"
          style={{
            background: "linear-gradient(135deg, #B597FF, #38E3FF, #B597FF, #38E3FF)",
            backgroundSize: "400% 400%",
          }}
        />

        <div className="w-full h-full bg-white rounded-[2.9rem] md:rounded-[4.4rem] overflow-hidden flex flex-col md:flex-row relative z-10 shadow-inner">
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 md:w-16 h-16 relative shrink-0">
                  <img src={feature.asset} alt="" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">
                  {feature.title}
                </h3>
              </div>
              <p className="text-lg md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-xl">
                {feature.desc}
              </p>
              <button 
                onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth'})}
                className="mt-8 px-8 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-base transition-all w-max flex items-center gap-2 group shadow-2xl shadow-zinc-200"
              >
                Potencializar com IA
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="flex-1 h-[320px] md:h-full relative overflow-hidden bg-white p-3 md:p-5">
            <div className="w-full h-full rounded-[2.2rem] md:rounded-[3.2rem] overflow-hidden border border-zinc-50 bg-zinc-100">
              <FeatureMedia src={feature.video} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Features() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section className="w-full bg-white py-24 relative px-4 md:px-8 section-to-blur">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-24 text-center mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-150%]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
            />
            <div className="relative px-3 py-1 rounded-full bg-white/80 backdrop-blur-xl text-[#B597FF] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              ⚡ Capacidades
            </div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] text-center"
          >
            A inteligência que seu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">comercial merece.</span>
          </motion.h2>
        </div>

        {/* Native CSS Sticky Stacking Deck */}
        <div ref={containerRef} className="relative w-full max-w-6xl mx-auto flex flex-col gap-y-[40vh] pb-[10vh]">
          {features.map((feature, idx) => (
             <FeatureCard 
               key={idx} 
               feature={feature} 
               idx={idx} 
               total={features.length} 
               scrollYProgress={scrollYProgress} 
             />
          ))}
        </div>

      </div>
    </section>
  );
}
