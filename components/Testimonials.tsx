"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const baseTestimonials = [
  {
    name: "Jimmy Knowles",
    role: "Global Head of Experiential",
    image: "/testimonials/ceo.png",
    text: "A Tlin revolucionou como lidamos com leads qualificados. O agente de IA não apenas responde, ele vende com o tom de voz exato da nossa marca. Triplicamos o agendamento em 30 dias.",
    company: "Canva"
  },
  {
    name: "Refik Anadol",
    role: "Media Artist, AI Art Pioneer",
    image: "/testimonials/director.png",
    text: "A integração cognitiva da Tlin é o que existe de mais próximo de um atendimento humano impecável. A capacidade de contornar objeções complexas em tempo real é simplesmente brilhante.",
    company: "Studio Anadol"
  },
  {
    name: "Sofia Marques",
    role: "Co-Founder & CEO",
    image: "/testimonials/founder.png",
    text: "Finalmente uma solução que resolve o funil no WhatsApp sem parecer um robô travado. Escalamos nossa operação de vendas internacional sem precisar contratar mais 10 SDRs.",
    company: "Horizon Tech"
  },
  {
    name: "Lucas Rivera",
    role: "VP of Operations",
    image: "/testimonials/ceo.png",
    text: "Implementamos em 48 horas e o ROI foi instantâneo. A precisão técnica e a naturalidade da conversa superaram todas as nossas expectativas de automação.",
    company: "Zapier"
  },
  {
    name: "Amanda Chen",
    role: "Director of Customer Success",
    image: "/testimonials/founder.png",
    text: "O suporte 24/7 da Tlin permitiu que nossa equipe focasse em casos complexos enquanto a IA resolve 90% das dúvidas rotineiras de novos leads.",
    company: "Shopify"
  }
];

// Quadruple to ensure enough content for smooth scrolling on large monitors
const testimonials = [...baseTestimonials, ...baseTestimonials, ...baseTestimonials, ...baseTestimonials];

const TestimonialCard = ({ item }: { item: typeof baseTestimonials[0] }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className={`relative w-[350px] md:w-[400px] h-[500px] md:h-[550px] rounded-[2.5rem] overflow-hidden cursor-grab active:cursor-grabbing shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] shrink-0 border border-zinc-100 transition-colors duration-500 ${isHovered ? 'bg-[#B597FF]' : 'bg-[#0c0d0d]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ shadow: "0_50px_80px_-20px_rgba(181,151,255,0.3)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence>
        {!isHovered ? (
          <motion.div
            key="photo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <img 
              src={item.image} 
              alt={item.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0d] via-[#0c0d0d]/40 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <h3 className="text-3xl font-bold text-white tracking-tighter mb-1">{item.name}</h3>
              <p className="text-[#38E3FF] text-xs font-black uppercase tracking-[0.2em]">{item.role}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 p-8 md:p-12 flex flex-col items-center text-center justify-center"
          >
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-lg border-2 border-white/30">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
             </div>

             <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">{item.name}</h3>
             <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8">{item.role}</p>
             <p className="text-white/90 font-medium leading-relaxed text-base md:text-lg">
                "{item.text}"
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function Testimonials() {
  return (
    <section className="w-full py-32 overflow-hidden relative bg-white">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#B597FF]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
          <div className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-150%]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
            />
            <div className="relative px-3 py-1 rounded-full bg-white/80 backdrop-blur-xl text-[#B597FF] text-[10px] font-bold tracking-widest flex items-center gap-2">
              🏆 Resultados de Impacto
            </div>
          </div>
             <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0c0d0d] leading-tight">
                Metrificado por <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">operações reais</span>
             </h2>
          </div>
        </div>
      </div>

      <div className="relative flex overflow-hidden -mx-4 group">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 px-4 w-max hover:[animation-play-state:paused]"
        >
          {testimonials.map((item, idx) => (
            <TestimonialCard key={`${item.name}-${idx}`} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
