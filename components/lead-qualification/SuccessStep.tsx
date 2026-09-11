"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { DemoDay, DemoSlot } from "./constants";

type LeadQualifyDictionary = {
  successTitle?: string;
  successMessage?: string;
  fields?: { company?: string };
  demoScheduledFor?: string;
  demoPendingConfirmation?: string;
  talkToTeam?: string;
  newRequest?: string;
};

// Tela final de sucesso, depois de confirmar os dados no step 9.
export function SuccessStep({
  name,
  t,
  selectedDay,
  selectedSlot,
  demoPendingConfirmation,
  onWhatsAppRedirect,
  onNewRequest,
}: {
  name: string;
  t?: LeadQualifyDictionary;
  selectedDay: DemoDay | null;
  selectedSlot: DemoSlot | null;
  demoPendingConfirmation: boolean;
  onWhatsAppRedirect: () => void;
  onNewRequest: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center z-50 my-auto"
    >
      <div className="mb-8 opacity-90">
        <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={120} height={42} priority />
      </div>

      <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight mb-4 max-w-4xl w-full whitespace-nowrap overflow-visible">
        {t?.successTitle || ""}
      </h2>

      <p className="text-lg sm:text-2xl font-bold text-zinc-900/80 max-w-2xl mb-6 leading-relaxed">
        {(t?.successMessage || "{name}").split("{name}")[0]}
        <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent font-black">{name || t?.fields?.company || ""}</span>
        {(t?.successMessage || "{name}").split("{name}")[1]}
      </p>

      {selectedSlot && (
        <p className="text-base sm:text-lg font-semibold text-zinc-600 max-w-2xl mb-10">
          {t?.demoScheduledFor || "Demo"}: <span className="text-zinc-950">{selectedDay?.label} · {selectedSlot.when}</span>
          {demoPendingConfirmation && <span className="block text-sm text-zinc-400 mt-1">{t?.demoPendingConfirmation || ""}</span>}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center items-stretch sm:items-center">
        {/* Botão Preto com Borda Animada estilo Hero */}
        <div className="relative flex-1">
          <button
            onClick={onWhatsAppRedirect}
            className="relative p-[1.5px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer block w-full"
          >
            <div className="absolute inset-[-150%] opacity-100 transition-opacity animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 180deg, transparent 240deg 360deg)` }}
            />
            <div className="relative px-6 py-4 rounded-full bg-[#0c0d0d] text-white font-extrabold text-base sm:text-lg transition-all z-10 group-hover/btn:text-[#0c0d0d] flex items-center justify-center text-center shadow-xl">
              <span className="relative z-10 whitespace-nowrap">{t?.talkToTeam || ""}</span>
              <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-300 group-hover/btn:opacity-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
            </div>
          </button>
        </div>

        {/* Botão Branco */}
        <div className="relative flex-1">
          <button
            onClick={onNewRequest}
            className="flex items-center justify-center px-6 py-4 rounded-full bg-white text-zinc-950 font-bold text-base sm:text-lg hover:bg-zinc-50 transition-all active:scale-95 cursor-pointer w-full border border-zinc-200 whitespace-nowrap"
          >
            {t?.newRequest || ""}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
