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
    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 1.5l10 8-4.3.6 2.2 4.6-1.8.9-2.2-4.6-3 3.1L2 1.5z" fill="#0c0d0d" stroke="white" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-white border border-zinc-100 rounded-full px-3 py-1 text-[10px] font-bold text-zinc-500 whitespace-nowrap">
      {label}
    </span>
  );
}

function BrowserBar() {
  return (
    <div className="absolute top-4 left-4 right-4 h-7 rounded-t-lg bg-white border border-zinc-100 flex items-center gap-1.5 px-3 z-0">
      <span className="w-2 h-2 rounded-full bg-red-300" />
      <span className="w-2 h-2 rounded-full bg-yellow-300" />
      <span className="w-2 h-2 rounded-full bg-green-300" />
      <span className="ml-2 h-2.5 w-20 rounded-full bg-zinc-100" />
    </div>
  );
}

// Capturar/qualificar: varios leads espalhados, cada um sendo "clicado"
// (cursor + bounce) e sumindo em sequencia -- simbolico, sem texto de
// chat, so a ideia de captura acontecendo uma a uma.
const CAPTURE_LEADS = [
  { src: "/lotties/avatars/1_avatar.webp", size: 40, className: "left-4 top-4" },
  { src: "/lotties/avatars/2_avatar.webp", size: 36, className: "left-24 top-2" },
  { src: "/lotties/avatars/9_avatar.webp", size: 34, className: "left-2 bottom-10" },
  { src: "/lotties/avatars/6_avatar.webp", size: 38, className: "left-24 bottom-6" },
  { src: "/lotties/avatars/3_avatar.webp", size: 42, className: "right-5 top-8" },
];

export function CaptureMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0">
      {CAPTURE_LEADS.map((lead, i) => (
        <motion.div
          key={i}
          className={`absolute ${lead.className}`}
          animate={isActive ? { scale: [1, 1.2, 1, 0.4], opacity: [1, 1, 1, 0] } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: i * 0.4, repeat: loop(isActive), repeatDelay: 2, ease: "easeIn" }}
        >
          <motion.div
            animate={isActive ? { opacity: [0, 0, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: i * 0.4, repeat: loop(isActive), repeatDelay: 2 }}
          >
            <CursorArrow className="absolute -left-2 -top-2 z-10" />
          </motion.div>
          <Avatar src={lead.src} size={lead.size} />
        </motion.div>
      ))}
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
        className="absolute top-14 left-5 bg-white border border-zinc-100 rounded-xl rounded-bl-sm px-3 py-2.5"
        animate={isActive ? { opacity: [0, 0, 1, 1] } : { opacity: 0 }}
        transition={{ duration: 1.8, times: [0, 0.35, 0.5, 1], repeat: loop(isActive), repeatDelay: 0.3 }}
      >
        <div className="flex gap-1.5 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-5 bottom-4"
        animate={isActive ? { scale: [1, 0.85, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, repeat: loop(isActive), repeatDelay: 1.9 }}
      >
        <CursorArrow className="absolute -left-2.5 -top-2.5 z-10" />
        <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="" className="w-7 h-7" />
        </div>
        <motion.svg
          width="20" height="20" viewBox="0 0 24 24" fill="none" className="absolute -top-1.5 -left-1.5 bg-white rounded-full p-0.5"
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

// Usar agentes de IA: o proprio mascote da Tlin (TlinIA.svg) pulsando, com
// particulas orbitando, falando com o lead numa bolha de chat ao lado.
export function AgentMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 px-3">
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
        <motion.img
          src="/TlinIA.svg"
          alt="Tlin"
          className="relative w-11 h-11"
          animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 1.2, repeat: loop(isActive), ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="bg-white border border-zinc-100 rounded-xl rounded-bl-sm px-3 py-2.5 max-w-[140px]"
        initial={false}
        animate={isActive ? { opacity: [0, 1], y: [6, 0] } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, repeat: loop(isActive), repeatDelay: 1.8 }}
      >
        <p className="text-[11px] leading-tight text-zinc-600 font-medium">Olá! Como posso te ajudar? 👋</p>
      </motion.div>
    </div>
  );
}

// Organizar no CRM: um unico funil onde os leads vao se empilhando, um a
// um, ate o funil ficar cheio e reiniciar.
const CRM_CYCLE = 3.6;
const CRM_LEADS = ["9_avatar", "5_avatar", "3_avatar"];

export function CrmMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[150px] rounded-xl bg-white border border-zinc-100 p-2.5 flex flex-col gap-1.5">
        <span className="text-[7px] font-bold text-zinc-400 uppercase tracking-wide">Funil de vendas</span>
        {CRM_LEADS.map((avatar, i) => {
          const appearAt = (0.2 + i * 0.8) / CRM_CYCLE;
          return (
            <motion.div
              key={i}
              className="flex items-center gap-1.5 bg-zinc-50 rounded-full pl-1 pr-2 py-1"
              animate={isActive ? { opacity: [0, 0, 1, 1, 0] } : { opacity: i === 0 ? 1 : 0 }}
              transition={{ duration: CRM_CYCLE, times: [0, appearAt - 0.01, appearAt, 0.95, 1], repeat: loop(isActive), repeatDelay: 0.4, ease: "easeOut" }}
            >
              <Avatar src={`/lotties/avatars/${avatar}.webp`} size={18} />
              <span className="w-8 h-1.5 rounded-full" style={{ background: GRADIENT }} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Agendar reunioes: 3 avatares em fila (com nome real, mesmo pool de
// nomes do SalesNotification.tsx). Uma a uma, cada reuniao e "confirmada"
// (check azul da marca) e some -- ciclo se repete com as 3.
const SCHEDULE_CYCLE = 4.4;

export function ScheduleMotion({ isActive }: { isActive: boolean }) {
  const rows = [
    { src: "/lotties/avatars/6_avatar.webp", name: "Carla F." },
    { src: "/lotties/avatars/7_avatar.webp", name: "Mariana L." },
    { src: "/lotties/avatars/8_avatar.webp", name: "Fernando H." },
  ];
  const alignClass = ["self-start ml-6", "self-end mr-2", "self-start ml-1"];

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="flex flex-col gap-4 w-full">
      {rows.map((row, i) => {
        const slot = i * 1.2;
        return (
          <motion.div
            key={i}
            className={`flex items-center gap-2.5 bg-white border border-zinc-100 rounded-full pl-1.5 pr-4 py-2 w-[152px] ${alignClass[i]}`}
            animate={isActive ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
            transition={{ duration: 0.5, delay: slot + 0.35, repeat: loop(isActive), repeatDelay: SCHEDULE_CYCLE - 0.5 - slot - 0.35, ease: "easeIn" }}
          >
            <Avatar src={row.src} size={32} />
            <span className="text-[11px] font-bold text-zinc-600 flex-1 whitespace-nowrap">{row.name}</span>
            <motion.div
              className="w-6 h-6 rounded-full bg-[#38E3FF] flex items-center justify-center shrink-0"
              animate={isActive ? { scale: [0, 1.3, 1] } : { scale: 0 }}
              transition={{ duration: 0.35, delay: slot, repeat: loop(isActive), repeatDelay: SCHEDULE_CYCLE - 0.35 - slot }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l5 5L20 6" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        );
      })}
      </div>
    </div>
  );
}

// Acompanhar funil/metricas: mini painel com numeros reais ao lado de
// barras de grafico crescendo
export function FunnelMotion({ isActive }: { isActive: boolean }) {
  const heights = [40, 70, 100, 55];
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6">
      <div className="flex items-end gap-2 h-20">
        {heights.map((h, i) => (
          <motion.div
            key={i}
            className="w-3.5 rounded-full"
            style={{ background: GRADIENT }}
            animate={isActive ? { height: [`20%`, `${h}%`] } : { height: "20%" }}
            transition={{ duration: 0.7, delay: i * 0.1, repeat: loop(isActive), repeatType: "reverse", ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-white border border-zinc-100 rounded-lg px-3 py-1.5">
          <p className="text-base font-black text-[#0c0d0d] leading-none">45,3%</p>
          <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wide">conversão</p>
        </div>
        <div className="bg-white border border-zinc-100 rounded-lg px-3 py-1.5">
          <p className="text-base font-black text-[#0c0d0d] leading-none">710</p>
          <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wide">leads/mês</p>
        </div>
      </div>
    </div>
  );
}

// Retomar quem parou de responder: avatar apagado (grayscale) reativa
// com cor, etiqueta "Reativado" e setinha de retry aparecem
export function FollowupMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <motion.div
          animate={isActive ? { filter: ["grayscale(1) opacity(0.5)", "grayscale(0) opacity(1)"] } as any : { filter: "grayscale(1) opacity(0.5)" }}
          transition={{ duration: 0.8, repeat: loop(isActive), repeatType: "reverse", repeatDelay: 0.6 }}
        >
          <Avatar src="/lotties/avatars/7_avatar.webp" size={56} />
        </motion.div>
        <motion.div
          className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center"
          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.8, repeat: loop(isActive), repeatDelay: 0.9 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <motion.div
        className="flex items-center gap-2 bg-white border border-zinc-100 rounded-full pl-1.5 pr-3.5 py-1.5"
        animate={isActive ? { opacity: [1, 1, 0.5] } : { opacity: 1 }}
        transition={{ duration: 1.3, repeat: loop(isActive), repeatDelay: 0.6 }}
      >
        <Avatar src="/lotties/avatars/8_avatar.webp" size={24} />
        <span className="text-[10px] font-bold text-zinc-500 whitespace-nowrap">Carrinho abandonado</span>
      </motion.div>
      <div className="relative flex items-end justify-center pb-1 pt-3">
        <svg width="42" height="34" viewBox="0 0 24 20" fill="none">
          <path d="M1 1h2l2.2 12.2a2 2 0 0 0 2 1.6h9a2 2 0 0 0 2-1.6L21 5H6" stroke="#a1a1aa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="19" r="1.3" fill="#a1a1aa" />
          <circle cx="17" cy="19" r="1.3" fill="#a1a1aa" />
        </svg>
        <motion.div
          className="absolute w-4 h-4 rounded-sm top-0"
          style={{ background: GRADIENT }}
          animate={isActive ? { y: [0, 26], opacity: [1, 1, 0] } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8, repeat: loop(isActive), repeatDelay: 1.2, ease: "easeIn" }}
        />
      </div>
    </div>
  );
}
