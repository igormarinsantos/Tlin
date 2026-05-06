"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useLanguage } from "@/lib/LanguageContext";

const TestimonialCard = ({ item }: { item: { name: string, role: string, image: string, text: string, company: string } }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className={`relative w-[350px] md:w-[400px] h-[500px] md:h-[550px] rounded-[2.5rem] overflow-hidden cursor-grab active:cursor-grabbing shrink-0 transition-all duration-500 ${isHovered ? 'bg-[#B597FF] shadow-[0_50px_80px_-20px_rgba(181,151,255,0.3)]' : 'bg-[#0c0d0d] shadow-none'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
              <p className="text-[#38E3FF] text-[11px] font-bold tracking-wide">{item.role}</p>
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
             <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-2">{item.name}</h3>
             <p className="text-white/40 text-[10px] font-bold tracking-wide mb-8 md:mb-12 uppercase">{item.role}</p>
             <p className="text-white font-medium leading-relaxed text-lg md:text-2xl tracking-tight">
                "{item.text.split(/(\[.*?\])/).map((part, i) => {
                  if (part.startsWith('[') && part.endsWith(']')) {
                    return <span key={i} className="text-[#4C1D95] font-black">{part.slice(1, -1)}</span>;
                  }
                  return part;
                })}"
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function Testimonials() {
  const { t } = useLanguage();

  const baseTestimonials = [
    {
      name: "Eduardo Silva",
      role: t.testimonials.t1_role,
      image: "/EDUARDO.png",
      text: t.testimonials.t1_text,
      company: "Scale Digital"
    },
    {
      name: "Luana Santos",
      role: t.testimonials.t2_role,
      image: "/LUANA.png",
      text: t.testimonials.t2_text,
      company: "Glow Media"
    },
    {
      name: "Miriam Souza",
      role: t.testimonials.t3_role,
      image: "/MIRIAM.png",
      text: t.testimonials.t3_text,
      company: "Horizon Tech"
    },
    {
      name: "Luiz Ferreira",
      role: t.testimonials.t4_role,
      image: "/LUIZ.png",
      text: t.testimonials.t4_text,
      company: "Zapier"
    }
  ];

  // Quadruple to ensure enough content for smooth scrolling on large monitors
  const testimonials = [...baseTestimonials, ...baseTestimonials, ...baseTestimonials, ...baseTestimonials];

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
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-150%]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
            />
            <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide flex items-center gap-2">
              {t.testimonials.badge}
            </div>
          </div>
             <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0c0d0d] leading-tight">
                {t.testimonials.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">{t.testimonials.titleHighlight}</span>
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
