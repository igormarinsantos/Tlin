"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, CheckCheck, User, MessageCircle } from "lucide-react";

export function WhatsAppQualifyAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 6);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full bg-[#efeae2] relative overflow-hidden flex flex-col font-sans">
      {/* WhatsApp Header Mockup */}
      <div className="bg-[#00a884] p-4 flex items-center gap-4 shadow-sm z-10 shrink-0">
        <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden ring-2 ring-white/20">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="text-white font-bold text-sm leading-tight">Ricardo M.</div>
          <div className="text-white/80 text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Online
          </div>
        </div>
        <div className="flex gap-4 text-white/90">
            <div className="w-4 h-4 rounded-sm border-2 border-current opacity-40" />
            <div className="w-4 h-4 rounded-full border-2 border-current opacity-40" />
        </div>
      </div>

      {/* Chat Conversation Area */}
      <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

        <AnimatePresence mode="popLayout">
          {/* Incoming Message 1 */}
          {step >= 0 && (
            <motion.div
              key="msg1"
              initial={{ opacity: 0, x: -20, scale: 0.9, originX: 0 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-[13px] self-start relative"
            >
              Olá! Gostaria de saber mais sobre a Tlin. Tenho interesse no produto.
              <div className="text-[9px] text-zinc-400 text-right mt-1.5 font-medium">09:41</div>
              <div className="absolute top-0 -left-1.5 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent" />
            </motion.div>
          )}

          {/* AI Response 1 */}
          {step >= 1 && (
            <motion.div
              key="msg2"
              initial={{ opacity: 0, x: 20, scale: 0.9, originX: 1 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="bg-[#d9fdd3] p-3.5 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] text-[13px] self-end relative"
            >
              Com certeza, Ricardo! Para te dar a melhor solução, qual o volume médio mensal de leads da sua empresa?
              <div className="text-[9px] text-zinc-400 text-right mt-1.5 font-medium flex items-center justify-end gap-1">
                09:41 <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="absolute top-0 -right-1.5 w-0 h-0 border-t-[8px] border-t-[#d9fdd3] border-r-[8px] border-r-transparent" />
            </motion.div>
          )}

          {/* Incoming Message 2 */}
          {step >= 2 && (
            <motion.div
              key="msg3"
              initial={{ opacity: 0, x: -20, scale: 0.9, originX: 0 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-[13px] self-start relative"
            >
              Hoje atendemos cerca de 1.500 leads por mês no comercial.
              <div className="text-[9px] text-zinc-400 text-right mt-1.5 font-medium">09:42</div>
              <div className="absolute top-0 -left-1.5 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent" />
            </motion.div>
          )}

          {/* AI Qualification Logic */}
          {step >= 3 && step < 5 && (
            <motion.div
              key="qualifying"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="self-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-200 shadow-lg mt-4 flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Analisando Perfil...</span>
            </motion.div>
          )}

          {/* Qualification Success Splash */}
          {step >= 4 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-white/40 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-zinc-100 p-8 w-full max-w-[280px] flex flex-col items-center gap-6 overflow-hidden relative"
              >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-100 blur-[60px] rounded-full opacity-60" />
                
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200"
                  >
                    <Check className="text-white w-10 h-10" strokeWidth={3} />
                  </motion.div>
                  {/* Floating Particles */}
                  <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-4 -right-4 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-emerald-400 rounded-full" /></motion.div>
                </div>

                <div className="text-center relative">
                  <h4 className="text-emerald-600 font-black text-xl uppercase tracking-tighter">Lead Qualificado!</h4>
                  <p className="text-zinc-500 text-xs font-medium mt-1">Perfil ideal identificado</p>
                </div>

                <div className="w-full bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400 font-bold uppercase tracking-widest">Estágio Atual</span>
                        <span className="text-emerald-600 font-black">QUALIFICAÇÃO</span>
                    </div>
                    {/* Mini Funnel Representation */}
                    <div className="flex flex-col gap-1 items-center">
                        <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: "30%" }}
                              animate={{ width: "65%" }}
                              className="h-full bg-emerald-500"
                            />
                        </div>
                        <div className="flex justify-between w-full px-0.5">
                            <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                        </div>
                    </div>
                </div>

                <motion.div 
                   animate={{ x: [0, 5, 0] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="text-[10px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-2"
                >
                    Enviado para CRM <ArrowRightIcon />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* WhatsApp Input Footer Mockup */}
      <div className="bg-[#f0f2f5] p-3 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-400 shadow-sm border border-zinc-200">
            <span className="text-xl">+</span>
        </div>
        <div className="flex-1 bg-white h-10 rounded-full border border-zinc-200 px-4 flex items-center text-zinc-300 text-sm italic">
          Mensagem...
        </div>
        <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center shadow-md">
           <MessageCircle className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    )
}
