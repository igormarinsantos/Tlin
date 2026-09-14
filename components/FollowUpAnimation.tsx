"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

// Mock de chat pra pagina de Recuperacao de Leads -- ao contrario do
// ObjectionAnimation (chat ao vivo), aqui o ponto e mostrar que a IA
// insiste em varios pontos de contato (1h, 3 dias, 5 dias) ate reativar o
// lead, batendo com a copy da pagina ("44% desistem no 1o follow-up").
// Cada selo de tempo fica grudado embaixo do balao daquele follow-up.
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
    // 0: Lead typing, 1: Lead msg1 (antes do silencio)
    // 2: IA typing, 3: IA msg2 -- selo "1 hora depois"
    // 4: IA typing, 5: IA msg3 -- selo "3 dias depois"
    // 6: IA typing, 7: IA msg4 -- selo "5 dias depois"
    // 8: Lead typing, 9: Lead msg5 (reativado)
    // 10: IA typing, 11: IA msg6 (fechamento)
    const delays = [1200, 2000, 1200, 2500, 1200, 2500, 1200, 2500, 1200, 2000, 1200, 8000];

    const timer = setTimeout(() => {
      setStep((prev) => (prev < delays.length - 1 ? prev + 1 : 0));
    }, delays[step]);

    return () => clearTimeout(timer);
  }, [step]);

  // So mantem as ultimas 3 mensagens montadas -- com selo de tempo cada
  // balao ocupa mais altura que num chat comum, e as 6 mensagens juntas
  // nao cabem na caixa (320-460px) sem precisar de scroll interno, o que
  // cortava a animacao. Janela deslizante em vez de acumular tudo.
  const current = Math.floor(step / 2);
  const visible = (i: number) => step >= i * 2 && current - i < 3;

  return (
    <div
      ref={scrollRef}
      className="relative w-full h-full flex flex-col gap-1 p-4 md:p-12 overflow-y-auto scrollbar-hide scroll-smooth"
    >
      <AnimatePresence>
        {visible(0) && (
          <ConversationMessage key="m1" side="left" isTyping={step === 0}>
            {f.msg1}
          </ConversationMessage>
        )}

        {visible(1) && (
          <ConversationMessage key="m2" side="right" isBot showAvatar isTyping={step === 2} caption={step >= 3 ? f.gap1 : undefined}>
            {f.msg2}
          </ConversationMessage>
        )}

        {visible(2) && (
          <ConversationMessage key="m3" side="right" isBot showAvatar={false} isTyping={step === 4} caption={step >= 5 ? f.gap2 : undefined}>
            {f.msg3}
          </ConversationMessage>
        )}

        {visible(3) && (
          <ConversationMessage key="m4" side="right" isBot showAvatar={false} isTyping={step === 6} caption={step >= 7 ? f.gap3 : undefined}>
            {f.msg4}
          </ConversationMessage>
        )}

        {visible(4) && (
          <ConversationMessage key="m5" side="left" isTyping={step === 8}>
            {f.msg5}
          </ConversationMessage>
        )}

        {visible(5) && (
          <ConversationMessage key="m6" side="right" isBot showAvatar isTyping={step === 10}>
            {f.msg6}
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
