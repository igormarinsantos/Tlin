"use client";

import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion";
import { Play, Pause, ChevronLeft, ChevronRight, Link, Globe, Zap, ShieldCheck, Headphones, Cpu, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SalesNotification } from "./SalesNotification";
import { FunnelAnimation } from "./FunnelAnimation";
import { WhatsAppQualifyAnimation } from "./WhatsAppQualifyAnimation";

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
        className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? '' : 'blur-[2px] opacity-60'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-6 right-6 z-30">
        <button
          onClick={togglePlay}
          className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 group/btn"
        >
          <div className="absolute inset-0 bg-zinc-900 border border-white/20 rounded-full transition-all duration-300 group-hover/btn:bg-zinc-800 group-hover/btn:scale-110 group-hover/btn:border-white/30" />
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
  idx
}: {
  feature: any,
  idx: number
}) {
  return (
    <div className="w-full min-h-[500px] md:min-h-[600px] relative py-12 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full h-full bg-white rounded-[2.9rem] md:rounded-[4rem] overflow-hidden flex flex-col md:flex-row relative z-10 border border-zinc-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]"
      >
        <div className="flex-1 p-8 md:p-20 flex flex-col justify-center">
          <div className="flex flex-col gap-8">
            <div className="w-16 h-16 md:w-20 md:h-20 relative shrink-0 mb-2">
              <img src={feature.asset} alt="" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-[1.1]">
              {feature.title}
            </h3>
            <p className="text-lg md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-xl">
              {feature.desc}
            </p>
            <button
              onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 px-8 py-5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg transition-all w-max flex items-center gap-2 group shadow-2xl shadow-zinc-200"
            >
              Potencializar com IA
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-h-[400px] md:min-h-full relative overflow-hidden bg-white p-4 md:p-6 flex items-center justify-center">
          <div className={`w-full h-full min-h-[400px] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative shadow-inner flex items-center justify-center ${
              feature.title === "Escala Sem Aumentar Custos" || feature.title === "Controle Absoluto do Funil" || feature.title === "Qualificação Cirúrgica"
              ? "bg-[#B597FF]"
              : "bg-zinc-100"
            }`}>
            {feature.title === "Escala Sem Aumentar Custos" ? (
              <SalesNotification />
            ) : feature.title === "Controle Absoluto do Funil" ? (
              <FunnelAnimation />
            ) : feature.title === "Qualificação Cirúrgica" ? (
              <WhatsAppQualifyAnimation />
            ) : (
              <FeatureMedia src={feature.video} />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Features() {
  return (
    <section className="w-full bg-white py-24 md:py-32 relative px-4 md:px-8 section-to-blur">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-32 text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-150%]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
            />
            <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide flex items-center gap-2">
              ⚡ Capacidades
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[1.05] text-center"
          >
            A inteligência que seu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">comercial merece.</span>
          </motion.h2>
        </div>

        {/* Standard Flow Layout */}
        <div className="relative w-full flex flex-col gap-y-24 md:gap-y-32">
          {features.map((feature, idx) => (
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
