"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Star, Zap } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export function WhatsAppQualifyAnimation() {
  const { t } = useLanguage();
  const f = t.whatsappAnimation;
  const [step, setStep] = useState(4);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 0-1: Greeting, 2-3: Question, 4-5: Answer, 6-7: Success Msg, 8: Popup
    const delays = [1200, 2000, 1200, 2500, 1200, 2000, 1500, 1500, 6000];
    
    const timer = setTimeout(() => {
      setStep((prev) => (prev < delays.length - 1 ? prev + 1 : 4));
    }, delays[step]);

    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [step]);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Background Animated Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#B597FF]/10 to-[#38E3FF]/10 blur-[100px] rounded-full pointer-events-none"
      />

      <motion.div 
        ref={scrollRef}
        animate={{ 
          filter: step >= 8 ? "blur(8px)" : "blur(0px)",
          opacity: step >= 8 ? 0.6 : 1,
          scale: step >= 8 ? 0.98 : 1
        }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full flex flex-col gap-1 p-4 md:p-12 overflow-y-auto scrollbar-hide scroll-smooth z-10"
      >
        <AnimatePresence>
          {/* Step 0-1: Lead Greeting */}
          {step >= 0 && (
            <ConversationMessage 
              key="q1" 
              side="left" 
              isTyping={step === 0}
            >
              {f.msg1}
            </ConversationMessage>
          )}

          {/* Step 2-3: Bot Qualifying Question */}
          {step >= 2 && (
            <ConversationMessage 
              key="q2" 
              side="right" 
              isBot 
              showAvatar={true}
              isTyping={step === 2}
            >
              {f.msg2}
            </ConversationMessage>
          )}

          {/* Step 4-5: Lead Answer */}
          {step >= 4 && (
            <ConversationMessage 
              key="q3" 
              side="left"
              isTyping={step === 4}
            >
              {f.msg3}
            </ConversationMessage>
          )}

          {/* Step 6-7: Bot Final Response */}
          {step >= 6 && (
            <ConversationMessage 
              key="q4" 
              side="right" 
              isBot 
              showAvatar={true}
              isTyping={step === 6}
            >
              {f.msg4}
            </ConversationMessage>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Success Card - Rises up after the final message */}
      <AnimatePresence>
        {step >= 8 && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="absolute z-50 bottom-12 md:bottom-24 left-1/2"
          >
            <div className="bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(181,151,255,0.3)] border border-[#B597FF]/20 flex flex-col items-center gap-4 min-w-[280px]">
              <div className="w-20 h-20 -mb-2">
                <img src="/Check.webp" alt="Check" className="w-full h-full object-contain" />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-black text-zinc-800">{f.qualified}</h4>
                <p className="text-sm text-zinc-500 font-medium mt-1">{f.forwarded}</p>
              </div>
              <div className="flex gap-2 mt-2 w-full">
                <div className="flex-1 bg-zinc-50 rounded-xl p-3 border border-zinc-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 overflow-hidden">
                    <img src="/lotties/avatars/8_avatar.webp" alt="Marcos" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-800">Marcos Oliveira</div>
                    <div className="text-[8px] text-zinc-400 font-medium">{f.revenue}</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF] p-[1px] rounded-full mt-2 shadow-sm">
                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-center gap-2">
                  <span className="text-sm">✨</span>
                  <span className="text-[11px] font-bold text-zinc-800 tracking-tight">{f.transferred}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConversationMessage({ 
  children, 
  side, 
  isBot, 
  showAvatar = true, 
  isTyping = false 
}: { 
  children: React.ReactNode; 
  side: "left" | "right"; 
  isBot?: boolean; 
  showAvatar?: boolean;
  isTyping?: boolean;
}) {
  const leadPhoto = "/lotties/avatars/8_avatar.webp";

  return (
    <div className={`flex items-start gap-2 w-full ${side === "right" ? "flex-row-reverse" : "flex-row"} ${showAvatar ? 'mb-2 mt-1' : 'mb-0'}`}>
      {/* Avatar Container */}
      <div className="w-6 h-6 shrink-0 flex items-start justify-center mt-1">
        {showAvatar && (
          side === "left" ? (
            <div className="w-6 h-6 rounded-full bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200/80">
              <img src={leadPhoto} alt="Lead" className="w-full h-full object-cover" />
            </div>
          ) : (
              <img src="/TlinIA.svg" alt="Tlin IA" className="w-6 h-6 shrink-0 object-contain" />
          )
        )}
      </div>

      <motion.div
        layout
        initial={{ opacity: 0, x: side === "left" ? -10 : 10, y: 5, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ 
          type: "spring", 
          damping: 32, 
          stiffness: 180,
          layout: { 
            type: "spring", 
            damping: 35, 
            stiffness: 200,
            mass: 1.2
          }
        }}
        className={`p-3 rounded-2xl relative overflow-hidden ${
          side === "right" 
            ? `bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 ${showAvatar ? 'rounded-tr-none' : ''}` 
            : `bg-white text-zinc-800 ${showAvatar ? 'rounded-tl-none' : ''} border border-zinc-200`
        } ${isTyping ? 'w-fit' : 'max-w-[80%]'}`}
      >
        <AnimatePresence mode="wait">
          {isTyping ? (
            <motion.div 
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-1 items-center px-1"
            >
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1] }} className={`w-1.5 h-1.5 rounded-full ${side === 'right' ? 'bg-zinc-950' : 'bg-[#B597FF]'}`} />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2, times: [0, 0.5, 1] }} className={`w-1.5 h-1.5 rounded-full ${side === 'right' ? 'bg-zinc-950' : 'bg-[#B597FF]'}`} />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4, times: [0, 0.5, 1] }} className={`w-1.5 h-1.5 rounded-full ${side === 'right' ? 'bg-zinc-950' : 'bg-[#B597FF]'}`} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.23, 1, 0.32, 1],
                delay: 0.1 
              }}
            >
              <p className="text-[13px] leading-relaxed font-semibold whitespace-pre-wrap">{children}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
