"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TypewriterQuestion } from "./TypewriterQuestion";

type LeadQualifyDictionary = {
  welcomeTitle?: string;
  startChat?: string;
  start?: string;
};

// Boas-vindas dentro do proprio chat (Igor "digitando" antes da mensagem),
// seguida do CTA "Vamos comecar" que efetivamente inicia o questionario.
export function WelcomeScreen({
  welcomeTyping,
  isLight,
  embedded,
  t,
  onStart,
}: {
  welcomeTyping: boolean;
  isLight: boolean;
  embedded: boolean;
  t?: LeadQualifyDictionary;
  onStart: () => void;
}) {
  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y ml-0 mr-1 sm:mr-2 px-4 sm:px-12 pt-12 sm:pt-16 pb-4 z-10 lead-popup-scrollbar">
        <div className="w-full flex flex-col justify-start min-h-full">
          {welcomeTyping ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-5 h-5 sm:w-7 sm:h-7"
              >
                <Image src="/TlinIA.svg" alt="Thinking" width={32} height={32} className="w-full h-full object-contain" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-[85%] sm:max-w-[75%] mb-1"
            >
              <TypewriterQuestion text={t?.welcomeTitle || ""} light={isLight} bubble={embedded} />
            </motion.div>
          )}
        </div>
      </div>
      <div className="shrink-0 px-4 sm:px-12 pt-2 sm:pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-10 z-20">
        {!welcomeTyping && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onStart}
            className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-bold text-xl sm:text-2xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 border border-transparent transition-all active:scale-[0.98] hover:opacity-90"
          >
            {t?.startChat || t?.start || "Vamos começar"}
          </motion.button>
        )}
      </div>
    </>
  );
}
