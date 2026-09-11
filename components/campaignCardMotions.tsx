"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// Atender no site ou WhatsApp: foco na tela de conversa -- o texto real
// aparece sendo escrito no input embaixo, depois "sobe" (FLIP animation
// via layoutId compartilhado) e vira a bolha enviada na conversa.
const WHATSAPP_REPLY = "Sim! Vou te ajudar 😊";

export function WhatsappMotion({ isActive }: { isActive: boolean }) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setSent(false);
      return;
    }
    const id = setInterval(() => setSent((s) => !s), 1300);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <div className="absolute inset-0">
      <div className="absolute top-5 left-3 right-3 flex flex-col gap-1.5">
        <div className="self-start bg-zinc-100 rounded-xl rounded-bl-sm px-2.5 py-1.5 max-w-[75%]">
          <p className="text-[9px] text-zinc-600 font-medium leading-tight">Oi, ainda tem vaga?</p>
        </div>

        <AnimatePresence>
          {sent && (
            <motion.div
              layoutId="wa-reply"
              className="self-end bg-[#25D366] rounded-xl rounded-br-sm px-2.5 py-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-[9px] text-white font-medium leading-tight whitespace-nowrap">{WHATSAPP_REPLY}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-3 left-3 right-3 h-7 rounded-full bg-white border border-zinc-100 flex items-center px-3 gap-2 overflow-hidden">
        <AnimatePresence>
          {!sent && (
            <motion.p
              layoutId="wa-reply"
              className="flex-1 text-[9px] text-zinc-500 font-medium whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {WHATSAPP_REPLY}
            </motion.p>
          )}
        </AnimatePresence>
        {sent && <span className="flex-1" />}
        <motion.div
          className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center shrink-0"
          animate={{ scale: sent ? 1.2 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h13M13 6l6 6-6 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

// Usar agentes de IA: o mascote da Tlin como "foto de perfil" ao lado da
// ultima mensagem -- conforme novas bolhas sao adicionadas de verdade
// (monta/desmonta, nao so opacidade), o grupo inteiro sobe e se
// recentraliza no meio do quadro via layout animation.
const AGENT_MESSAGES = ["Olá! 👋", "Como posso te ajudar?", "Vou te conectar com um especialista"];

export function AgentMotion({ isActive }: { isActive: boolean }) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!isActive) {
      setCount(1);
      return;
    }
    let i = 1;
    const id = setInterval(() => {
      i = i >= AGENT_MESSAGES.length ? 1 : i + 1;
      setCount(i);
    }, 900);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div layout className="flex items-start gap-2.5 px-3">
        <motion.img layout src="/TlinIA.svg" alt="Tlin" className="w-8 h-8 shrink-0" />

        <motion.div layout className="flex flex-col gap-1.5 max-w-[150px]">
          <AnimatePresence initial={false}>
            {AGENT_MESSAGES.slice(0, count).map((msg, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white border border-zinc-100 rounded-xl rounded-bl-sm px-2.5 py-1.5"
              >
                <p className="text-[10px] leading-tight text-zinc-600 font-medium">{msg}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Organizar no CRM: um unico funil onde os leads vao se empilhando, um a
// um, ate o funil ficar cheio e reiniciar. Header mini "Qualificando" com
// contador ao vivo de quantos leads ja entraram no funil.
const CRM_CYCLE = 3.6;
const CRM_LEADS = [
  { src: "9_avatar", name: "Lucas G." },
  { src: "5_avatar", name: "Roberto T." },
  { src: "3_avatar", name: "Bruno S." },
];

export function CrmMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-end justify-center">
      <div className="relative w-[176px] h-[150px] rounded-t-2xl bg-white border border-zinc-100 border-b-0 px-3 pt-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#0c0d0d]">Qualificando</span>
          <div className="relative w-6 h-6 rounded-full bg-[#8B6CFF]/10">
            {CRM_LEADS.map((_, i) => {
              const appearAt = (0.2 + i * 0.8) / CRM_CYCLE;
              return (
                <motion.span
                  key={i}
                  className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-[#8B6CFF]"
                  animate={isActive ? { opacity: [0, 0, 1, 1, 0] } : { opacity: i === 0 ? 1 : 0 }}
                  transition={{ duration: CRM_CYCLE, times: [0, appearAt - 0.01, appearAt, 0.95, 1], repeat: loop(isActive), repeatDelay: 0.4 }}
                >
                  {i + 1}
                </motion.span>
              );
            })}
          </div>
        </div>

        {CRM_LEADS.map((lead, i) => {
          const appearAt = (0.2 + i * 0.8) / CRM_CYCLE;
          return (
            <motion.div
              key={i}
              className="flex items-center gap-2 bg-zinc-50 rounded-full pl-1 pr-2.5 py-1.5"
              animate={isActive ? { opacity: [0, 0, 1, 1, 0] } : { opacity: i === 0 ? 1 : 0 }}
              transition={{ duration: CRM_CYCLE, times: [0, appearAt - 0.01, appearAt, 0.95, 1], repeat: loop(isActive), repeatDelay: 0.4, ease: "easeOut" }}
            >
              <Avatar src={`/lotties/avatars/${lead.src}.webp`} size={30} />
              <span className="text-[10px] font-bold text-zinc-600 flex-1 whitespace-nowrap">{lead.name}</span>
              <span className="text-[7px] font-bold text-[#8B6CFF] bg-[#8B6CFF]/10 rounded-full px-1.5 py-1 whitespace-nowrap shrink-0">IA qualificando</span>
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

// Acompanhar funil/metricas: funil de verdade com 3 estagios (containers
// de largura decrescente) enchendo em sequencia, com numeros reais do lado.
const FUNNEL_HEIGHT = 22;
const FUNNEL_STAGES = [
  { top: 78, bottom: 58 },
  { top: 58, bottom: 38 },
  { top: 38, bottom: 22 },
];

// Gera um path SVG de poligono com os cantos de verdade arredondados
// (nao so o traco -- o stroke-linejoin round sozinho nao arredonda o
// preenchimento, so a linha).
function roundedPolygonPath(points: [number, number][], radius: number): string {
  const n = points.length;
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const [cx, cy] = points[i];
    const [px, py] = points[(i - 1 + n) % n];
    const [nx, ny] = points[(i + 1) % n];
    const distPrev = Math.hypot(cx - px, cy - py);
    const distNext = Math.hypot(cx - nx, cy - ny);
    const r = Math.min(radius, distPrev / 2, distNext / 2);
    const p1x = cx + ((px - cx) / distPrev) * r;
    const p1y = cy + ((py - cy) / distPrev) * r;
    const p2x = cx + ((nx - cx) / distNext) * r;
    const p2y = cy + ((ny - cy) / distNext) * r;
    d.push(i === 0 ? `M ${p1x} ${p1y}` : `L ${p1x} ${p1y}`);
    d.push(`Q ${cx} ${cy} ${p2x} ${p2y}`);
  }
  d.push("Z");
  return d.join(" ");
}

function FunnelTrapezoid({ top, bottom }: { top: number; bottom: number }) {
  const inset = (top - bottom) / 2;
  const path = roundedPolygonPath(
    [
      [0, 0],
      [top, 0],
      [top - inset, FUNNEL_HEIGHT],
      [inset, FUNNEL_HEIGHT],
    ],
    4
  );
  return (
    <svg width={top} height={FUNNEL_HEIGHT} viewBox={`0 0 ${top} ${FUNNEL_HEIGHT}`}>
      <path d={path} fill="#B597FF" fillOpacity="0.2" stroke="#B597FF" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function FunnelMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-1">
        {FUNNEL_STAGES.map((stage, i) => (
          <motion.div
            key={i}
            animate={isActive ? { scaleX: [0, 1] } : { scaleX: 1 }}
            transition={{ duration: 0.5, delay: i * 0.3, repeat: loop(isActive), repeatType: "reverse", repeatDelay: 0.6, ease: "easeOut" }}
          >
            <FunnelTrapezoid top={stage.top} bottom={stage.bottom} />
          </motion.div>
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
