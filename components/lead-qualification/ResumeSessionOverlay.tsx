"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TypewriterQuestion } from "./TypewriterQuestion";

type LeadQualifyDictionary = {
  resumeTitle?: string;
  resumeContinue?: string;
  resumeRestart?: string;
};

// Overlay perguntando se a pessoa quer continuar uma sessao salva no
// localStorage ou recomecar do zero.
export function ResumeSessionOverlay({
  show,
  isLight,
  embedded,
  t,
  closeLabel,
  onClose,
  onContinue,
  onRestart,
}: {
  show: boolean;
  isLight: boolean;
  embedded: boolean;
  t?: LeadQualifyDictionary;
  closeLabel: string;
  onClose: () => void;
  onContinue: () => void;
  onRestart: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 z-[400] flex items-center justify-center backdrop-blur-[60px] text-center p-6 sm:p-12 ${isLight ? "bg-white/95" : "bg-[#0c0d0d]/95"}`}
        >
          {!embedded && (
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-[410]">
              <button
                onClick={onClose}
                aria-label={closeLabel}
                className="flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-95 text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
          )}

          <div className="max-w-2xl w-full flex flex-col items-center gap-12">
            <div className="w-full">
              <TypewriterQuestion text={t?.resumeTitle || ""} light={isLight} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={onContinue}
                className="flex-1 py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-black text-lg sm:text-xl shadow-2xl shadow-purple-500/20 transition-all active:scale-[0.98] hover:opacity-90"
              >
                {t?.resumeContinue || "Continuar"}
              </button>
              <button
                onClick={onRestart}
                className={`flex-1 py-4 sm:py-5 px-8 rounded-2xl border font-bold text-lg sm:text-xl transition-all active:scale-[0.98] ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"}`}
              >
                {t?.resumeRestart || "Recomeçar"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
