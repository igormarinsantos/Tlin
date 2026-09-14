"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

// Mock de chat pra pagina de Recuperacao de Leads -- ao contrario do
// ObjectionAnimation (chat ao vivo), aqui o ponto e mostrar que o
// follow-up acontece dias depois do lead ter parado de responder. O selo
// de tempo (gapLabel) fica grudado embaixo do balao do follow-up, nao
// como um divisor separado no meio do chat.
export function FollowUpAnimation() {
  const { t } = useLanguage();
  const f = t.followUpAnimation;
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
    const timer = setTimeout(scroll, 300);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    // 0: Lead typing, 1: Lead msg (antes do silencio)
    // 2: IA typing, 3: IA follow-up (com selo "3 dias depois")
    // 4: Lead typing, 5: Lead reply
    // 6: IA typing, 7: IA fechamento
    const delays = [1200, 2500, 1500, 3000, 1200, 2000, 1200, 8000];

    const timer = setTimeout(() => {
      setStep((prev) => (prev < delays.length - 1 ? prev + 1 : 0));
    }, delays[step]);

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div
      ref={scrollRef}
      className="relative w-full h-full flex flex-col gap-1 p-4 md:p-12 overflow-y-auto scrollbar-hide scroll-smooth"
    >
      <AnimatePresence>
        {step >= 0 && (
          <ConversationMessage key="m1" side="left" isTyping={step === 0}>
            {f.msg1}
          </ConversationMessage>
        )}

        {step >= 2 && (
          <ConversationMessage key="m2" side="right" isBot showAvatar isTyping={step === 2} caption={step >= 3 ? f.gapLabel : undefined}>
            {f.msg2}
          </ConversationMessage>
        )}

        {step >= 4 && (
          <ConversationMessage key="m3" side="left" isTyping={step === 4}>
            {f.msg3}
          </ConversationMessage>
        )}

        {step >= 6 && (
          <ConversationMessage key="m4" side="right" isBot showAvatar isTyping={step === 6}>
            {f.msg4}
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
  isTyping = false,
  caption
}: {
  children: React.ReactNode;
  side: "left" | "right";
  isBot?: boolean;
  showAvatar?: boolean;
  isTyping?: boolean;
  caption?: string;
}) {
  const leadPhoto = "/lotties/avatars/5_avatar.webp";

  return (
    <div className={`flex flex-col ${side === "right" ? "items-end" : "items-start"} w-full mb-2 mt-1`}>
      <div className={`flex items-start gap-2 w-full ${side === "right" ? "flex-row-reverse" : "flex-row"}`}>
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
            layout: { type: "spring", damping: 35, stiffness: 200, mass: 1.2 }
          }}
          className={`p-3 rounded-2xl relative overflow-hidden ${
            side === "right"
              ? `bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 ${showAvatar ? "rounded-tr-none" : ""}`
              : `bg-white text-zinc-800 ${showAvatar ? "rounded-tl-none" : ""} border border-zinc-200`
          } ${isTyping ? "w-fit" : "max-w-[80%]"}`}
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
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1] }} className={`w-1.5 h-1.5 rounded-full ${side === "right" ? "bg-zinc-950" : "bg-[#B597FF]"}`} />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2, times: [0, 0.5, 1] }} className={`w-1.5 h-1.5 rounded-full ${side === "right" ? "bg-zinc-950" : "bg-[#B597FF]"}`} />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4, times: [0, 0.5, 1] }} className={`w-1.5 h-1.5 rounded-full ${side === "right" ? "bg-zinc-950" : "bg-[#B597FF]"}`} />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
              >
                <p className="text-[13px] leading-relaxed font-semibold whitespace-pre-wrap">{children}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {caption && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-[10px] font-bold text-zinc-400 mt-1.5 ${side === "right" ? "mr-8" : "ml-8"}`}
        >
          {caption}
        </motion.span>
      )}
    </div>
  );
}
