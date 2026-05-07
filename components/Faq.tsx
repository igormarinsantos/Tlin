"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export function Faq() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 }
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-white">
       <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
          <div className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-8">
            <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
            />
            <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide flex items-center gap-2">
              {t.faq.badge}
            </div>
          </div>
             <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0c0d0d] mb-6">
                {t.faq.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">{t.faq.titleHighlight}</span>
             </h2>
             <p className="text-zinc-500 font-medium text-lg max-w-xl mx-auto">{t.faq.subtitle}</p>
          </div>

          <div className="flex flex-col gap-4 mb-24">
             {faqs.map((faq, idx) => {
               const isOpen = openIndex === idx;
               return (
                 <motion.div 
                   key={idx}
                   initial={false}
                   animate={{ 
                     backgroundColor: isOpen ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.5)",
                     borderColor: isOpen ? "#B597FF" : "#E4E4E7"
                   }}
                   className={`group rounded-3xl border-2 transition-all duration-300 overflow-hidden ${isOpen ? '' : 'hover:border-zinc-300'}`}
                 >
                    <button 
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6 group/btn"
                    >
                       <span className={`text-lg md:text-xl font-bold tracking-tight leading-tight transition-colors ${isOpen ? 'text-[#0c0d0d]' : 'text-zinc-600 group-hover/btn:text-[#0c0d0d]'}`}>
                          {faq.q}
                       </span>
                       <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#B597FF] text-white' : 'text-zinc-400 group-hover/btn:text-zinc-600 bg-zinc-100'}`}>
                          <motion.div 
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="relative w-3 h-3"
                          >
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-current -translate-y-1/2 rounded-full" />
                            <div className="absolute top-0 left-1/2 w-[2px] h-full bg-current -translate-x-1/2 rounded-full" />
                          </motion.div>
                       </div>
                    </button>

                    <AnimatePresence initial={false}>
                       {isOpen && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                         >
                            <div className="px-6 md:px-8 pb-8">
                               <div className="w-full h-px bg-zinc-100 mb-6" />
                               <p className="text-zinc-500 text-base md:text-lg font-medium leading-relaxed">
                                  {faq.a}
                               </p>
                               <div className="mt-6 pt-6 border-t border-zinc-100">
                                  <p className="text-sm font-medium text-zinc-400">
                                     {t.faq.notAnswered} <a href="https://wa.me/5511916248604" target="_blank" rel="noopener noreferrer" className="text-[#B597FF] hover:underline font-bold transition-all">{t.faq.talkToExperts}</a>
                                  </p>
                               </div>
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </motion.div>
               );
             })}
           </div>


       </div>
    </section>
  );
}
