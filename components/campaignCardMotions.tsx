"use client";

import { motion } from "framer-motion";

// 8 motions pequenos e leves (so opacity/scale/x/y em loop, sem maquina de
// estado) pro quadro h-36 dos cards "Conheca a Tlin". Cada um e uma cena
// composta (avatares, cursor, etiquetas, mini-UI) no espirito da
// referencia que o Igor mandou -- nao so um icone isolado. Usa avatares
// reais (mesmo pool ja usado no SalesNotification.tsx) e o mascote da
// Tlin (/TlinIA.svg, mesmo do Hero) onde representa a IA. Toca em loop
// enquanto `isActive` (hover do card) estiver true; parado no repouso.

const GRADIENT = "linear-gradient(135deg, #B597FF, #38E3FF)";
const loop = (active: boolean) => (active ? Infinity : 0);

function Avatar({ src, size = 20, ring = false }: { src: string; size?: number; ring?: boolean }) {
  return (
    <div
      className="rounded-full overflow-hidden shrink-0"
      style={{ width: size, height: size, padding: ring ? 2 : 0, background: ring ? GRADIENT : undefined }}
    >
      <img src={src} alt="" className="w-full h-full object-cover rounded-full" />
    </div>
  );
}

function CursorArrow({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 1.5l10 8-4.3.6 2.2 4.6-1.8.9-2.2-4.6-3 3.1L2 1.5z" fill="#0c0d0d" stroke="white" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-white border border-zinc-100 shadow-sm rounded-full px-2 py-0.5 text-[8px] font-bold text-zinc-500 whitespace-nowrap">
      {label}
    </span>
  );
}

function BrowserBar() {
  return (
    <div className="absolute top-3 left-3 right-3 h-5 rounded-t-lg bg-white border border-zinc-100 shadow-sm flex items-center gap-1 px-2 z-0">
      <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
      <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
      <span className="ml-2 h-2 w-14 rounded-full bg-zinc-100" />
    </div>
  );
}

// Capturar/qualificar: cena composta -- 2 visitantes sendo "selecionados"
// por um cursor, bolha de qualificacao aparecendo, e o lead roteado pro
// WhatsApp (avatar com bolinha verde de online).
export function CaptureMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute left-5 top-4"
        animate={isActive ? { scale: [1, 0.85, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, repeat: loop(isActive), repeatDelay: 1.6 }}
      >
        <CursorArrow className="absolute -left-1.5 -top-1.5 z-10" />
        <Avatar src="/lotties/avatars/1_avatar.webp" size={34} />
      </motion.div>

      <motion.div
        className="absolute left-16 top-1"
        animate={isActive ? { scale: [1, 0.85, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5, repeat: loop(isActive), repeatDelay: 1.5 }}
      >
        <CursorArrow className="absolute -left-1.5 -top-1.5 z-10" />
        <Avatar src="/lotties/avatars/2_avatar.webp" size={30} />
      </motion.div>

      <motion.div
        className="absolute left-2 bottom-3 bg-white border border-zinc-100 shadow-sm rounded-xl rounded-bl-sm px-2.5 py-1.5 max-w-[118px]"
        initial={false}
        animate={isActive ? { opacity: [0, 1], y: [6, 0] } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1, repeat: loop(isActive), repeatDelay: 1.5 }}
      >
        <p className="text-[9px] leading-tight text-zinc-600 font-medium">Quer saber qual plano é ideal? 👋</p>
      </motion.div>

      <div className="absolute right-4 bottom-4">
        <Avatar src="/lotties/avatars/3_avatar.webp" size={30} />
        <motion.span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] border-2 border-white"
          animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.8, repeat: loop(isActive), repeatDelay: 0.4 }}
        />
      </div>
    </div>
  );
}

// Atender no site ou WhatsApp: janela de navegador com cursor clicando no
// balao verde do WhatsApp, que abre a conversa (digitando -> check duplo)
export function WhatsappMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0">
      <BrowserBar />

      <motion.div
        className="absolute top-11 left-4 bg-white border border-zinc-100 shadow-sm rounded-xl rounded-bl-sm px-2 py-1.5"
        animate={isActive ? { opacity: [0, 0, 1, 1] } : { opacity: 0 }}
        transition={{ duration: 1.8, times: [0, 0.35, 0.5, 1], repeat: loop(isActive), repeatDelay: 0.3 }}
      >
        <div className="flex gap-1 items-center">
          <span className="w-1 h-1 rounded-full bg-zinc-400" />
          <span className="w-1 h-1 rounded-full bg-zinc-400" />
          <span className="w-1 h-1 rounded-full bg-zinc-400" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-4 bottom-3"
        animate={isActive ? { scale: [1, 0.85, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, repeat: loop(isActive), repeatDelay: 1.9 }}
      >
        <CursorArrow className="absolute -left-2 -top-2 z-10" />
        <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shadow-sm">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="" className="w-5 h-5" />
        </div>
        <motion.svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" className="absolute -top-1 -left-1 bg-white rounded-full p-0.5 shadow-sm"
          animate={isActive ? { opacity: [0, 0, 0, 1] } : { opacity: 0 }}
          transition={{ duration: 1.8, times: [0, 0.5, 0.6, 1], repeat: loop(isActive), repeatDelay: 0.3 }}
        >
          <path d="M2 12l5 5L14 8" stroke="#25D366" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12l5 5L21 8" stroke="#25D366" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </div>
  );
}

// Usar agentes de IA: o proprio mascote da Tlin (TlinIA.svg) pulsando,
// com particulas orbitando -- a IA de verdade, nao um icone generico.
export function AgentMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <motion.div
          className="absolute w-14 h-14 rounded-full blur-md"
          style={{ background: GRADIENT, opacity: 0.35 }}
          animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 1.2, repeat: loop(isActive), ease: "easeInOut" }}
        />
        <motion.img
          src="/TlinIA.svg"
          alt="Tlin"
          className="relative w-10 h-10"
          animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 1.2, repeat: loop(isActive), ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0"
          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 3, repeat: loop(isActive), ease: "linear" }}
        >
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#B597FF]" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#38E3FF]" />
        </motion.div>
      </div>
    </div>
  );
}

// Organizar no CRM: leads com etiqueta de status arrumados num mini-kanban,
// um deles desliza de "Novo" pra "Qualificado"
export function CrmMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-2">
        <Avatar src="/lotties/avatars/9_avatar.webp" size={18} />
        <Tag label="Lead novo" />
      </div>
      <motion.div
        className="flex items-center gap-2"
        animate={isActive ? { x: [-2, 26, 26] } : { x: 0 }}
        transition={{ duration: 1, times: [0, 0.6, 1], repeat: loop(isActive), repeatDelay: 0.6, ease: "easeInOut" }}
      >
        <Avatar src="/lotties/avatars/5_avatar.webp" size={18} ring />
        <motion.span
          animate={isActive ? { opacity: [0, 0, 1] } : { opacity: 0 }}
          transition={{ duration: 1, times: [0, 0.6, 1], repeat: loop(isActive), repeatDelay: 0.6 }}
        >
          <Tag label="Qualificado" />
        </motion.span>
      </motion.div>
    </div>
  );
}

// Agendar reunioes: 3 avatares em fila, cada um "reservando" um horario --
// so a fileira do meio confirma com check
export function ScheduleMotion({ isActive }: { isActive: boolean }) {
  const rows = [
    { src: "/lotties/avatars/6_avatar.webp", check: false },
    { src: "/lotties/avatars/7_avatar.webp", check: true },
    { src: "/lotties/avatars/8_avatar.webp", check: false },
  ];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-1.5 bg-white border border-zinc-100 shadow-sm rounded-full pl-1 pr-2.5 py-1 w-[92px]">
          <Avatar src={row.src} size={16} />
          <span className="h-1.5 flex-1 rounded-full bg-zinc-100" />
          {row.check && (
            <motion.div
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: GRADIENT }}
              animate={isActive ? { scale: [0, 1.2, 1] } : { scale: 0 }}
              transition={{ duration: 0.4, delay: 0.4, repeat: loop(isActive), repeatDelay: 1.1 }}
            >
              <svg width="7" height="7" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l5 5L20 6" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// Acompanhar funil/metricas: mini painel com numeros reais ao lado de
// barras de grafico crescendo
export function FunnelMotion({ isActive }: { isActive: boolean }) {
  const heights = [40, 70, 100, 55];
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4">
      <div className="flex items-end gap-1.5 h-14">
        {heights.map((h, i) => (
          <motion.div
            key={i}
            className="w-2.5 rounded-full"
            style={{ background: GRADIENT }}
            animate={isActive ? { height: [`20%`, `${h}%`] } : { height: "20%" }}
            transition={{ duration: 0.7, delay: i * 0.1, repeat: loop(isActive), repeatType: "reverse", ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="bg-white border border-zinc-100 shadow-sm rounded-lg px-2 py-1">
          <p className="text-[11px] font-black text-[#0c0d0d] leading-none">45,3%</p>
          <p className="text-[6px] text-zinc-400 font-bold uppercase tracking-wide">conversão</p>
        </div>
        <div className="bg-white border border-zinc-100 shadow-sm rounded-lg px-2 py-1">
          <p className="text-[11px] font-black text-[#0c0d0d] leading-none">710</p>
          <p className="text-[6px] text-zinc-400 font-bold uppercase tracking-wide">leads/mês</p>
        </div>
      </div>
    </div>
  );
}

// Retomar quem parou de responder: avatar apagado (grayscale) reativa
// com cor, etiqueta "Reativado" e setinha de retry aparecem
export function FollowupMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <div className="relative">
        <motion.div
          animate={isActive ? { filter: ["grayscale(1) opacity(0.5)", "grayscale(0) opacity(1)"] } as any : { filter: "grayscale(1) opacity(0.5)" }}
          transition={{ duration: 0.8, repeat: loop(isActive), repeatType: "reverse", repeatDelay: 0.6 }}
        >
          <Avatar src="/lotties/avatars/7_avatar.webp" size={40} />
        </motion.div>
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-zinc-200 flex items-center justify-center"
          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.8, repeat: loop(isActive), repeatDelay: 0.9 }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M4 4v6h6" stroke="#8B6CFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.5 15a8 8 0 1 0 2-8.5L4 10" stroke="#8B6CFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
      <motion.div
        animate={isActive ? { opacity: [0, 0, 1] } : { opacity: 0 }}
        transition={{ duration: 0.8, times: [0, 0.5, 1], repeat: loop(isActive), repeatType: "reverse", repeatDelay: 0.6 }}
      >
        <Tag label="Reativado" />
      </motion.div>
    </div>
  );
}

// Recuperar carrinho abandonado: avatar do cliente + etiqueta de produto
// voltando sozinho pro carrinho
export function CartMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <motion.div
        className="flex items-center gap-1.5 bg-white border border-zinc-100 shadow-sm rounded-full pl-1 pr-2.5 py-1"
        animate={isActive ? { opacity: [1, 1, 0.5] } : { opacity: 1 }}
        transition={{ duration: 1.3, repeat: loop(isActive), repeatDelay: 0.6 }}
      >
        <Avatar src="/lotties/avatars/8_avatar.webp" size={16} />
        <span className="text-[8px] font-bold text-zinc-500 whitespace-nowrap">Carrinho abandonado</span>
      </motion.div>
      <div className="relative flex items-end justify-center pb-1 pt-2">
        <svg width="30" height="24" viewBox="0 0 24 20" fill="none">
          <path d="M1 1h2l2.2 12.2a2 2 0 0 0 2 1.6h9a2 2 0 0 0 2-1.6L21 5H6" stroke="#a1a1aa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="19" r="1.3" fill="#a1a1aa" />
          <circle cx="17" cy="19" r="1.3" fill="#a1a1aa" />
        </svg>
        <motion.div
          className="absolute w-3 h-3 rounded-sm top-0"
          style={{ background: GRADIENT }}
          animate={isActive ? { y: [0, 20], opacity: [1, 1, 0] } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8, repeat: loop(isActive), repeatDelay: 1.2, ease: "easeIn" }}
        />
      </div>
    </div>
  );
}
