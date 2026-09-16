"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

type DictKey = "objectionAnimation" | "agentObjectionAnimation";
type Role = { side: "left" | "right"; isBot?: boolean; showAvatar?: boolean };

// Papel (lado/avatar) de cada mensagem, na ordem msg1, msg2, msg3... Um
// array por dictKey porque as duas variantes tem numero de mensagens
// diferente (a de "Agentes de IA" e mais curta, so pra conceituar).
const ROLES: Record<DictKey, Role[]> = {
  objectionAnimation: [
    { side: "left" },
    { side: "right", isBot: true, showAvatar: true },
    { side: "right", isBot: true, showAvatar: false },
    { side: "left" },
    { side: "right", isBot: true, showAvatar: true },
    { side: "left" },
    { side: "right", isBot: true, showAvatar: true },
  ],
  agentObjectionAnimation: [
    { side: "left" },
    { side: "right", isBot: true, showAvatar: true },
    { side: "left" },
    { side: "right", isBot: true, showAvatar: true },
  ],
};

// 2 delays por mensagem: [tempo digitando, tempo com o balao visivel antes
// da proxima]. O ultimo delay de cada variante e bem maior (pausa antes do
// loop reiniciar).
const DELAYS: Record<DictKey, number[]> = {
  objectionAnimation: [1200, 2000, 1200, 2000, 1000, 2000, 1500, 2500, 1200, 3000, 1200, 2000, 1000, 8000],
  agentObjectionAnimation: [1200, 2500, 1200, 2500, 1200, 2000, 1200, 8000],
};

export function ObjectionAnimation({ dictKey = "objectionAnimation" }: { dictKey?: DictKey }) {
  const { t } = useLanguage();
  const f = t[dictKey];
  const messages = Object.values(f);
  const roles = ROLES[dictKey];
  const delays = DELAYS[dictKey];
  const [step, setStep] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "auto"
        });
      }
    };

    // A mensagem entra com motion layout. Esperar dois frames e fazer uma
    // segunda leitura depois da transição evita que o ultimo balão fique
    // parcialmente escondido no container do mobile.
    const firstFrame = requestAnimationFrame(() => requestAnimationFrame(scroll));
    const timer = setTimeout(scroll, 650);
    return () => {
      cancelAnimationFrame(firstFrame);
      clearTimeout(timer);
    };
  }, [step]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((prev) => (prev < delays.length - 1 ? prev + 1 : 0));
    }, delays[step]);

    return () => clearTimeout(timer);
  }, [step, delays]);

  return (
    <div
      ref={scrollRef}
      className="relative flex h-full min-h-0 w-full flex-col gap-1 overflow-y-auto overscroll-contain p-4 pb-8 scrollbar-hide md:p-12"
    >
      {/* Blocos discretos (nao .map()) de proposito, igual o componente
          original -- cada mensagem e uma expressao JSX irma separada. */}
      <AnimatePresence>
        {roles[0] && step >= 0 && (
          <ConversationMessage key="m1" side={roles[0].side} isBot={roles[0].isBot} showAvatar={roles[0].showAvatar ?? true} isTyping={step === 0}>
            {messages[0]}
          </ConversationMessage>
        )}
        {roles[1] && step >= 2 && (
          <ConversationMessage key="m2" side={roles[1].side} isBot={roles[1].isBot} showAvatar={roles[1].showAvatar ?? true} isTyping={step === 2}>
            {messages[1]}
          </ConversationMessage>
        )}
        {roles[2] && step >= 4 && (
          <ConversationMessage key="m3" side={roles[2].side} isBot={roles[2].isBot} showAvatar={roles[2].showAvatar ?? true} isTyping={step === 4}>
            {messages[2]}
          </ConversationMessage>
        )}
        {roles[3] && step >= 6 && (
          <ConversationMessage key="m4" side={roles[3].side} isBot={roles[3].isBot} showAvatar={roles[3].showAvatar ?? true} isTyping={step === 6}>
            {messages[3]}
          </ConversationMessage>
        )}
        {roles[4] && step >= 8 && (
          <ConversationMessage key="m5" side={roles[4].side} isBot={roles[4].isBot} showAvatar={roles[4].showAvatar ?? true} isTyping={step === 8}>
            {messages[4]}
          </ConversationMessage>
        )}
        {roles[5] && step >= 10 && (
          <ConversationMessage key="m6" side={roles[5].side} isBot={roles[5].isBot} showAvatar={roles[5].showAvatar ?? true} isTyping={step === 10}>
            {messages[5]}
          </ConversationMessage>
        )}
        {roles[6] && step >= 12 && (
          <ConversationMessage key="m7" side={roles[6].side} isBot={roles[6].isBot} showAvatar={roles[6].showAvatar ?? true} isTyping={step === 12}>
            {messages[6]}
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
  const leadPhoto = "/lotties/avatars/5_avatar.webp";

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
