"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export function ObjectionAnimation() {
  const [step, setStep] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    };
    
    scroll();
    // Second scroll after a short delay to account for animation growth
    const timer = setTimeout(scroll, 300);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    // 0: Lead typing, 1: Lead msg
    // 2: Bot typing, 3: Bot msg 1
    // 4: Bot typing, 5: Bot msg 2
    // 6: Lead typing, 7: Lead reply
    // 8: Bot typing, 9: Bot final ask
    // 10: Lead typing, 11: Lead confirmation
    // 12: Bot typing, 13: Bot closing
    const delays = [1200, 2000, 1200, 2000, 1000, 2000, 1500, 2500, 1200, 3000, 1200, 2000, 1000, 8000];
    
    const timer = setTimeout(() => {
      setStep((prev) => {
        if (prev < delays.length - 1) return prev + 1;
        return 0;
      });
    }, delays[step]);

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div 
      ref={scrollRef}
      className="absolute inset-0 flex flex-col gap-1 p-6 md:p-12 overflow-y-auto scrollbar-hide scroll-smooth"
    >
      <AnimatePresence>
        {/* Step 0-1: Lead Objection */}
        {step >= 0 && (
          <ConversationMessage 
            key="m1" 
            side="left" 
            isTyping={step === 0}
          >
            Achei o valor um pouco alto para o meu momento agora...
          </ConversationMessage>
        )}

        {/* Step 2-3: Bot Response 1 */}
        {step >= 2 && (
          <ConversationMessage 
            key="m2" 
            side="right" 
            isBot 
            showAvatar={true}
            isTyping={step === 2}
          >
            Entendo perfeitamente, Ricardo. Muitos dos nossos clientes pensaram o mesmo antes de verem o ROI.
          </ConversationMessage>
        )}

        {/* Step 4-5: Bot Response 2 */}
        {step >= 4 && (
          <ConversationMessage 
            key="m3" 
            side="right" 
            isBot 
            showAvatar={false}
            isTyping={step === 4}
          >
            A Tlin se paga recuperando leads que seriam perdidos. Vamos fazer uma conta rápida da sua operação?
          </ConversationMessage>
        )}

        {/* Step 6-7: Lead Reply */}
        {step >= 6 && (
          <ConversationMessage 
            key="m4" 
            side="left"
            isTyping={step === 6}
          >
            Se recuperar 2 vendas já paga o software. Como funciona a implementação?
          </ConversationMessage>
        )}

        {/* Step 8-9: Bot Final Ask */}
        {step >= 8 && (
          <ConversationMessage 
            key="m6" 
            side="right" 
            isBot 
            showAvatar={true}
            isTyping={step === 8}
          >
            É instantâneo! Em 5 minutos configuramos seus scripts e a IA já começa a atender. Posso liberar seu acesso?
          </ConversationMessage>
        )}

        {/* Step 10-11: Lead Confirmation */}
        {step >= 10 && (
          <ConversationMessage 
            key="m7" 
            side="left"
            isTyping={step === 10}
          >
            Perfeito, vou querer testar sim! Como fazemos?
          </ConversationMessage>
        )}

        {/* Step 12-13: Bot Closing */}
        {step >= 12 && (
          <ConversationMessage 
            key="m8" 
            side="right" 
            isBot 
            showAvatar={true}
            isTyping={step === 12}
          >
            Show! Vou liberar seu acesso agora mesmo. Checa seu WhatsApp em 1 minuto, te enviei o link por lá. 🚀
          </ConversationMessage>
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
  const leadPhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop";

  return (
    <div className={`flex items-start gap-2 w-full ${side === "right" ? "flex-row-reverse" : "flex-row"} ${showAvatar ? 'mb-2 mt-1' : 'mb-0'}`}>
      {/* Avatar Container */}
      <div className="w-6 h-6 shrink-0 flex items-start justify-center mt-1">
        {showAvatar && (
          side === "left" ? (
            <div className="w-6 h-6 rounded-full bg-zinc-800 shrink-0 overflow-hidden border border-white/10">
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
                ease: [0.23, 1, 0.32, 1], // Custom cubic-bezier for extra smoothness
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
