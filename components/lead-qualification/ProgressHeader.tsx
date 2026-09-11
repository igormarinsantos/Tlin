"use client";

import Image from "next/image";
import { SUCCESS_STEP } from "./constants";

type LeadQualifyDictionary = {
  headerName?: string;
  headerStatusOnline?: string;
  headerStatusTyping?: string;
};

// Header estilo WhatsApp (so no form embutido) + trilha de progresso, fixos no topo.
// No popup da index (nao embedded) fica so a trilha, sem foto/nome/status do Igor
// nem logo -- so o /demo tem o header estilo WhatsApp completo. A trilha do index
// e sempre larga/clara, mesmo com o resto do popup no tema escuro, e sem a linha
// divisoria embaixo do header (so o /demo, com o header completo, mantem ela).
export function ProgressHeader({
  currentStep,
  hasStarted,
  embedded,
  isLight,
  isTyping,
  welcomeTyping,
  t,
}: {
  currentStep: number;
  hasStarted: boolean;
  embedded: boolean;
  isLight: boolean;
  isTyping: boolean;
  welcomeTyping: boolean;
  t?: LeadQualifyDictionary;
}) {
  if (currentStep >= SUCCESS_STEP) return null;

  const totalDots = SUCCESS_STEP - 1;
  const filledDots = hasStarted ? currentStep : 0;
  const progressPercent = totalDots > 1 ? (Math.max(filledDots - 1, 0) / (totalDots - 1)) * 100 : 0;
  // Interpola a mesma cor do degrade da trilha (roxo -> ciano) pra cada
  // bolinha, na posicao dela, em vez de um azul solido igual pra todas.
  const dotColor = (i: number) => {
    const ratio = totalDots > 1 ? i / (totalDots - 1) : 0;
    const r = Math.round(181 + (56 - 181) * ratio);
    const g = Math.round(151 + (227 - 151) * ratio);
    return `rgb(${r}, ${g}, 255)`;
  };
  // whiteUnfilled e so pro popup modal (fundo escuro) -- o resto da
  // trilha fica branco solido ate a etapa ser concluida, so entao
  // vira o degrade. O /demo (embedded, fundo branco) continua com o
  // cinza claro de sempre, sem mudar.
  const renderProgressBar = (fullWidth: boolean, lightDots: boolean, whiteUnfilled = false) => (
    <div className="flex-1 flex justify-center min-w-0 px-1">
      <div className={`relative w-full h-1.5 sm:h-2 flex items-center ${fullWidth ? "" : "max-w-[130px] sm:max-w-[190px]"}`}>
        <div className="absolute inset-x-0 h-0.5 rounded-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF]" />
        <div
          className={`absolute right-0 h-0.5 rounded-r-full transition-[width] duration-500 ease-out ${whiteUnfilled ? "bg-white" : (lightDots ? "bg-zinc-100" : "bg-white/10")}`}
          style={{ width: `${100 - progressPercent}%` }}
        />
        <div className="relative w-full flex items-center justify-between">
          {Array.from({ length: totalDots }).map((_, i) => (
            <span
              key={i}
              className={`block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-500 ${lightDots ? "ring-2 ring-white" : "ring-2 ring-[#0c0d0d]"}`}
              style={{ backgroundColor: i < filledDots ? dotColor(i) : whiteUnfilled ? "#ffffff" : (lightDots ? "#e4e4e7" : "#3f3f46") }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`sticky top-0 z-20 shrink-0 transition-colors duration-300 ${embedded ? `border-b ${isLight ? "border-zinc-100" : "border-white/10"}` : ""} ${isLight ? "bg-white" : "bg-[#0c0d0d]"}`}>
      {embedded ? (
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-12 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 ${isLight ? "bg-zinc-100" : "bg-white/10"}`}>
              <Image src="/team/igor-avatar.png" alt={t?.headerName || "Igor"} width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className={`text-base sm:text-lg font-bold truncate ${isLight ? "text-zinc-950" : "text-white"}`}>{t?.headerName || "Igor"}</p>
              <span className={`grid text-sm font-medium ${(isTyping || welcomeTyping) ? (isLight ? "text-zinc-400" : "text-zinc-500") : "text-emerald-600"}`}>
                {/* Reserva a largura do texto mais longo pra "Online"/"digitando..." nao
                    empurrar o resto do header ao alternar (largura ficava variavel). */}
                <span className="invisible col-start-1 row-start-1">{t?.headerStatusOnline || "Online"}</span>
                <span className="invisible col-start-1 row-start-1">{t?.headerStatusTyping || "digitando..."}</span>
                <span className="col-start-1 row-start-1">
                  {(isTyping || welcomeTyping) ? (t?.headerStatusTyping || "digitando...") : (t?.headerStatusOnline || "Online")}
                </span>
              </span>
            </div>
          </div>

          {renderProgressBar(false, isLight)}

          <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={56} height={19} className="shrink-0 w-12 sm:w-16 h-auto" />
        </div>
      ) : (
        <div className="flex items-center pl-4 sm:pl-12 pr-16 sm:pr-20 py-3 sm:py-4">
          {renderProgressBar(true, true, true)}
        </div>
      )}
    </div>
  );
}
