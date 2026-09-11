"use client";

import { motion } from "framer-motion";

// 8 motions pequenos e leves (so opacity/scale/x/y em loop, sem maquina de
// estado) pro quadro h-36 dos cards "Conheca a Tlin". Cada um usa o
// degrade da marca (#B597FF -> #38E3FF) pra simbolizar o conceito do card,
// com avatares reais (mesmo pool ja usado no SalesNotification.tsx) nos
// motions que representam uma pessoa/lead -- Agente e Funil ficam
// abstratos porque sao sobre a IA e metricas, nao uma pessoa.
// Tocam em loop enquanto `isActive` (hover do card) estiver true; parado
// e no repouso quando false.

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

// Capturar/qualificar: cena composta -- 2 visitantes sendo "selecionados"
// por um cursor, bolha de qualificacao aparecendo, e o lead roteado pro
// WhatsApp (avatar com bolinha verde de online), como uma pagina de
// verdade capturando e qualificando quem chega.
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

// Atender no WhatsApp: bolha com "..." digitando que vira check duplo,
// com o avatar de quem esta conversando espiando no canto
export function WhatsappMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-16 h-12">
      <div className="absolute -bottom-1.5 -left-1.5">
        <Avatar src="/lotties/avatars/4_avatar.webp" size={20} />
      </div>
      <div className="relative w-full h-full rounded-2xl rounded-bl-md flex items-center justify-center" style={{ background: GRADIENT }}>
        <motion.div
          className="flex gap-1 absolute"
          animate={isActive ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
          transition={{ duration: 1.6, times: [0, 0.45, 0.55, 1], repeat: loop(isActive), repeatDelay: 0.3 }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </motion.div>
        <motion.svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" className="absolute"
          animate={isActive ? { opacity: [0, 0, 1, 1] } : { opacity: 0 }}
          transition={{ duration: 1.6, times: [0, 0.55, 0.7, 1], repeat: loop(isActive), repeatDelay: 0.3 }}
        >
          <path d="M2 12l5 5L14 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12l5 5L21 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </div>
    </div>
    </div>
  );
}

// Usar agentes de IA: nucleo pulsando com particulas orbitando (abstrato
// de proposito -- e sobre a IA, nao uma pessoa)
export function AgentMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <motion.div
          className="w-8 h-8 rounded-full"
          style={{ background: GRADIENT }}
          animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
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

// Organizar no CRM: card com avatar do lead desliza de uma coluna pra outra
export function CrmMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-24 h-14 flex gap-2">
        <div className="w-1/2 h-full rounded-lg bg-zinc-100" />
        <div className="w-1/2 h-full rounded-lg bg-zinc-100" />
        <motion.div
          className="absolute top-2 left-1.5 h-4 rounded-full bg-white shadow-sm flex items-center gap-1 pr-2"
          animate={isActive ? { x: [0, 46] } : { x: 0 }}
          transition={{ duration: 1, repeat: loop(isActive), repeatDelay: 0.5, ease: "easeInOut" }}
        >
          <Avatar src="/lotties/avatars/5_avatar.webp" size={16} />
          <span className="w-4 h-1.5 rounded-full" style={{ background: GRADIENT }} />
        </motion.div>
      </div>
    </div>
  );
}

// Agendar reunioes: calendario com o dia sendo confirmado, avatar de quem agendou ao lado
export function ScheduleMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-14 h-16 rounded-xl bg-white border-2 border-zinc-200 overflow-hidden">
        <div className="h-3.5 w-full bg-zinc-200" />
        <motion.div
          className="absolute bottom-1.5 right-1.5"
          animate={isActive ? { scale: [0, 1.1, 1] } : { scale: 0 }}
          transition={{ duration: 0.5, repeat: loop(isActive), repeatDelay: 0.9 }}
        >
          <Avatar src="/lotties/avatars/6_avatar.webp" size={22} ring />
        </motion.div>
        <motion.div
          className="absolute bottom-1 left-2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: GRADIENT }}
          animate={isActive ? { scale: [0, 1, 1] } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.15, repeat: loop(isActive), repeatDelay: 0.9 }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
            <path d="M4 12l5 5L20 6" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

// Acompanhar funil/metricas: barras de grafico crescendo (abstrato de
// proposito -- e sobre numeros, nao uma pessoa)
export function FunnelMotion({ isActive }: { isActive: boolean }) {
  const heights = [40, 70, 100, 55];
  return (
    <div className="absolute inset-0 flex items-center justify-center">
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
    </div>
  );
}

// Retomar quem parou de responder: avatar apagado (grayscale) reativa
// com cor, setinha de retry do lado
export function FollowupMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <motion.div
        animate={isActive ? { filter: ["grayscale(1) opacity(0.5)", "grayscale(0) opacity(1)"] } as any : { filter: "grayscale(1) opacity(0.5)" }}
        transition={{ duration: 0.8, repeat: loop(isActive), repeatType: "reverse", repeatDelay: 0.4 }}
      >
        <Avatar src="/lotties/avatars/7_avatar.webp" size={40} />
      </motion.div>
      <motion.div
        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-zinc-200 flex items-center justify-center"
        animate={isActive ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.8, repeat: loop(isActive), repeatDelay: 0.7 }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M4 4v6h6" stroke="#8B6CFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 15a8 8 0 1 0 2-8.5L4 10" stroke="#8B6CFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
    </div>
  );
}

// Recuperar carrinho abandonado: avatar do cliente some e o item volta
// sozinho pro carrinho
export function CartMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-16 h-16 flex items-end justify-center pb-2">
      <motion.div
        className="absolute -top-1 -left-1"
        animate={isActive ? { opacity: [1, 1, 0.4] } : { opacity: 1 }}
        transition={{ duration: 1.3, repeat: loop(isActive), repeatDelay: 0.4 }}
      >
        <Avatar src="/lotties/avatars/8_avatar.webp" size={18} />
      </motion.div>
      <svg width="34" height="28" viewBox="0 0 24 20" fill="none">
        <path d="M1 1h2l2.2 12.2a2 2 0 0 0 2 1.6h9a2 2 0 0 0 2-1.6L21 5H6" stroke="#a1a1aa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="19" r="1.3" fill="#a1a1aa" />
        <circle cx="17" cy="19" r="1.3" fill="#a1a1aa" />
      </svg>
      <motion.div
        className="absolute w-3 h-3 rounded-sm top-0"
        style={{ background: GRADIENT }}
        animate={isActive ? { y: [0, 24], opacity: [1, 1, 0] } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.7, repeat: loop(isActive), repeatDelay: 0.6, ease: "easeIn" }}
      />
    </div>
    </div>
  );
}
