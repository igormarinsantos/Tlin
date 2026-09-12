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

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-white border border-zinc-100 rounded-full px-3 py-1.5 text-[11px] font-bold text-zinc-500 whitespace-nowrap">
      {label}
    </span>
  );
}

// Capturar/qualificar: varios leads espalhados feito graos flutuando
// organicamente (drift continuo, cada um com seu proprio ritmo), sendo
// "clicados" (bounce) e sumindo em sequencia mais pausada -- simbolico,
// sem cursor nem texto de chat, so a ideia de captura acontecendo uma a uma.
const CAPTURE_LEADS = [
  { src: "/lotties/avatars/1_avatar.webp", size: 40, className: "left-4 top-4", driftX: [0, 6, -3, 2, 0], driftY: [0, -5, 4, -2, 0], duration: 3.2 },
  { src: "/lotties/avatars/2_avatar.webp", size: 36, className: "left-24 top-2", driftX: [0, -5, 4, -3, 0], driftY: [0, 4, -5, 3, 0], duration: 4.1 },
  { src: "/lotties/avatars/9_avatar.webp", size: 34, className: "left-2 bottom-10", driftX: [0, 3, -6, 4, 0], driftY: [0, -3, -5, 2, 0], duration: 3.7 },
  { src: "/lotties/avatars/6_avatar.webp", size: 38, className: "left-24 bottom-6", driftX: [0, -4, 2, -5, 0], driftY: [0, 5, 3, -3, 0], duration: 4.6 },
  { src: "/lotties/avatars/3_avatar.webp", size: 42, className: "right-5 top-8", driftX: [0, 5, 3, -4, 0], driftY: [0, -2, 5, -4, 0], duration: 3.9 },
];

// A cada ciclo de clique/sumico (0.7s visivel + 2.6s de gap = 3.3s), cada
// lead reaparece num lugar novo e aleatorio dentro do quadro em vez de
// sempre no mesmo lugar -- a troca acontece durante a janela em que ele
// esta invisivel, entao nunca "pula" na tela.
const CAPTURE_CYCLE_MS = 3300;
const CAPTURE_MARGIN_PCT = 14;

function randomCapturePos() {
  const span = 100 - CAPTURE_MARGIN_PCT * 2;
  return {
    top: `${CAPTURE_MARGIN_PCT + Math.random() * span}%`,
    left: `${CAPTURE_MARGIN_PCT + Math.random() * span}%`,
  };
}

export function CaptureMotion({ isActive }: { isActive: boolean }) {
  const [positions, setPositions] = useState<({ top: string; left: string } | null)[]>(() =>
    CAPTURE_LEADS.map(() => null)
  );

  useEffect(() => {
    if (!isActive) {
      setPositions(CAPTURE_LEADS.map(() => null));
      return;
    }
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    CAPTURE_LEADS.forEach((_, i) => {
      const reposition = () =>
        setPositions((prev) => {
          const next = [...prev];
          next[i] = randomCapturePos();
          return next;
        });
      const startDelay = i * 400 + 750;
      timeouts.push(
        setTimeout(() => {
          reposition();
          intervals.push(setInterval(reposition, CAPTURE_CYCLE_MS));
        }, startDelay)
      );
    });
    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [isActive]);

  return (
    <div className="absolute inset-0">
      {CAPTURE_LEADS.map((lead, i) => {
        const pos = positions[i];
        return (
          <motion.div
            key={i}
            className={`absolute ${lead.className}`}
            style={pos ? { top: pos.top, left: pos.left, right: "auto", bottom: "auto" } : undefined}
            animate={isActive ? { x: lead.driftX, y: lead.driftY } : { x: 0, y: 0 }}
            transition={{ duration: lead.duration, repeat: loop(isActive), ease: "easeInOut" }}
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.2, 1, 0.4], opacity: [1, 1, 1, 0] } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: i * 0.4, repeat: loop(isActive), repeatDelay: 2.6, ease: "easeIn" }}
            >
              <Avatar src={lead.src} size={lead.size} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Atender no site ou WhatsApp: o usuario "digita" a resposta letra por
// letra no campo de input (texto real, nao um placeholder), a mensagem
// digitada some ao enviar, e a bolha enviada aparece de forma independente
// -- sao dois textos/elementos diferentes, nao um unico texto viajando.
const WHATSAPP_REPLY = "Sim! Vou te ajudar 😊";
const WHATSAPP_MS_PER_CHAR = 55;
const WHATSAPP_HOLD_TYPED_MS = 550;
const WHATSAPP_BUBBLE_MS = 1600;
const WHATSAPP_GAP_MS = 550;
const WHATSAPP_STEP_MS = 40;
const WHATSAPP_TYPING_MS = WHATSAPP_REPLY.length * WHATSAPP_MS_PER_CHAR;
const WHATSAPP_SENT_AT = WHATSAPP_TYPING_MS + WHATSAPP_HOLD_TYPED_MS;
const WHATSAPP_BUBBLE_GONE_AT = WHATSAPP_SENT_AT + WHATSAPP_BUBBLE_MS;
const WHATSAPP_CYCLE_MS = WHATSAPP_BUBBLE_GONE_AT + WHATSAPP_GAP_MS;

export function WhatsappMotion({ isActive }: { isActive: boolean }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setTick(0);
      return;
    }
    const id = setInterval(() => {
      setTick((t) => (t + WHATSAPP_STEP_MS) % WHATSAPP_CYCLE_MS);
    }, WHATSAPP_STEP_MS);
    return () => clearInterval(id);
  }, [isActive]);

  const isTyping = tick < WHATSAPP_TYPING_MS;
  const charCount = isTyping
    ? Math.floor(tick / WHATSAPP_MS_PER_CHAR)
    : tick < WHATSAPP_SENT_AT
      ? WHATSAPP_REPLY.length
      : 0;
  const showBubble = tick >= WHATSAPP_SENT_AT && tick < WHATSAPP_BUBBLE_GONE_AT;
  const sending = tick >= WHATSAPP_SENT_AT - 140 && tick < WHATSAPP_SENT_AT + 140;

  return (
    <div className="absolute inset-0">
      <div className="absolute top-5 left-3 right-3">
        <div className="bg-zinc-100 rounded-xl rounded-bl-sm px-3.5 py-2.5 max-w-[75%] inline-block">
          <p className="text-[13px] text-zinc-600 font-medium leading-tight">Oi, ainda tem vaga?</p>
        </div>
      </div>

      <AnimatePresence>
        {showBubble && (
          <motion.div
            key="sent-bubble"
            className="absolute right-3 rounded-xl rounded-br-sm px-3.5 py-2.5 bg-[#25D366]"
            style={{ top: "37%" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p className="text-[13px] font-medium text-white whitespace-nowrap">{WHATSAPP_REPLY}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-3 left-3 right-3 h-11 rounded-full bg-white border border-zinc-100 flex items-center pl-4 pr-1.5 gap-1.5">
        <p className="flex-1 text-[13px] font-medium text-zinc-600 truncate">
          {WHATSAPP_REPLY.slice(0, charCount)}
          {isActive && isTyping && <span className="inline-block w-[2px] h-3.5 bg-zinc-400 ml-0.5 align-middle animate-pulse" />}
        </p>
        <motion.div
          className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0"
          animate={{ scale: sending ? 1.08 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
const AGENT_MSG_MS = 900;
const AGENT_HOLD_MS = 700;
const AGENT_UNSTACK_MS = 200;
const AGENT_GAP_MS = 400;
const AGENT_STEP_MS = 100;
const AGENT_BUILD_END_MS = (AGENT_MESSAGES.length - 1) * AGENT_MSG_MS;
const AGENT_HOLD_END_MS = AGENT_BUILD_END_MS + AGENT_HOLD_MS;
const AGENT_UNSTACK_END_MS = AGENT_HOLD_END_MS + (AGENT_MESSAGES.length - 1) * AGENT_UNSTACK_MS;
const AGENT_CYCLE_MS = AGENT_UNSTACK_END_MS + AGENT_GAP_MS;

export function AgentMotion({ isActive }: { isActive: boolean }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setTick(0);
      return;
    }
    const id = setInterval(() => {
      setTick((t) => (t + AGENT_STEP_MS) % AGENT_CYCLE_MS);
    }, AGENT_STEP_MS);
    return () => clearInterval(id);
  }, [isActive]);

  // sobe ate 3 mensagens uma a uma, segura tudo visivel, depois desempilha
  // rapido (uma a uma tambem, so que bem mais veloz) ate sobrar so o
  // "Ola!" antes de reiniciar o ciclo -- efeito de loop continuo.
  let count: number;
  if (tick < AGENT_BUILD_END_MS) {
    count = Math.floor(tick / AGENT_MSG_MS) + 1;
  } else if (tick < AGENT_HOLD_END_MS) {
    count = AGENT_MESSAGES.length;
  } else if (tick < AGENT_UNSTACK_END_MS) {
    const steps = Math.floor((tick - AGENT_HOLD_END_MS) / AGENT_UNSTACK_MS) + 1;
    count = Math.max(1, AGENT_MESSAGES.length - steps);
  } else {
    count = 1;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div layout="position" className="flex items-start gap-2.5 px-3">
        <img src="/TlinIA.svg" alt="Tlin" className="w-7 h-7 shrink-0" />

        <motion.div layout="position" className="flex flex-col items-start gap-1.5 w-[160px]">
          <AnimatePresence initial={false}>
            {AGENT_MESSAGES.slice(0, count).map((msg, i) => (
              <motion.div
                key={i}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white border border-zinc-100 rounded-xl rounded-bl-sm px-3 py-2 max-w-full"
              >
                <p className="text-[12px] leading-tight text-zinc-600 font-medium">{msg}</p>
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
// Origem do lead (Meta ou Google Ads) no lugar de uma etiqueta generica de
// "IA" -- fixa por lead (variada de proposito) em vez de hash, ja que sao
// so 3 nomes fixos.
const CRM_LEADS = [
  { src: "9_avatar", name: "Lucas G.", source: "/logos/google-ads.svg" },
  { src: "5_avatar", name: "Roberto T.", source: "/logos/meta.svg" },
  { src: "3_avatar", name: "Bruno S.", source: "/logos/meta.svg" },
];

export function CrmMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-end justify-center">
      <div className="relative w-[176px] h-[150px] rounded-t-2xl bg-white border border-zinc-100 border-b-0 px-3 pt-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#0c0d0d]">Qualificando</span>
          <div className="relative w-7 h-7 rounded-full bg-[#8B6CFF]/10">
            {CRM_LEADS.map((_, i) => {
              const appearAt = (0.2 + i * 0.8) / CRM_CYCLE;
              return (
                <motion.span
                  key={i}
                  className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#8B6CFF]"
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
              <Avatar src={`/lotties/avatars/${lead.src}.webp`} size={32} />
              <span className="text-[11px] font-bold text-zinc-600 flex-1 whitespace-nowrap">{lead.name}</span>
              <span className="w-6 h-6 rounded-full bg-white border border-zinc-100 flex items-center justify-center shrink-0">
                <img src={lead.source} alt="" className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Agendar reunioes: 3 avatares em fila (com nome real, mesmo pool de
// nomes do SalesNotification.tsx). Empilham uma a uma de verdade (monta/
// desmonta, analogo ao AgentMotion), com o check azul sendo desenhado
// (pathLength) ao montar em vez de so aparecer. Cada linha ainda flutua
// organicamente (drift continuo, como no CaptureMotion) sem mudar o
// zigue-zague fixo de alinhamento.
const SCHEDULE_ROWS = [
  { src: "/lotties/avatars/6_avatar.webp", name: "Carla F.", align: "self-start ml-6", driftX: [0, 4, -3, 0], driftY: [0, -3, 2, 0], duration: 3.4 },
  { src: "/lotties/avatars/7_avatar.webp", name: "Mariana L.", align: "self-end mr-2", driftX: [0, -4, 3, -2, 0], driftY: [0, 3, -3, 2, 0], duration: 4.0 },
  { src: "/lotties/avatars/8_avatar.webp", name: "Fernando H.", align: "self-start ml-1", driftX: [0, 3, -4, 2, 0], driftY: [0, -2, 3, -2, 0], duration: 3.7 },
];
const SCHEDULE_MSG_MS = 900;
const SCHEDULE_HOLD_MS = 700;
const SCHEDULE_UNSTACK_MS = 200;
const SCHEDULE_GAP_MS = 500;
const SCHEDULE_STEP_MS = 100;
const SCHEDULE_BUILD_END_MS = (SCHEDULE_ROWS.length - 1) * SCHEDULE_MSG_MS;
const SCHEDULE_HOLD_END_MS = SCHEDULE_BUILD_END_MS + SCHEDULE_HOLD_MS;
const SCHEDULE_UNSTACK_END_MS = SCHEDULE_HOLD_END_MS + (SCHEDULE_ROWS.length - 1) * SCHEDULE_UNSTACK_MS;
const SCHEDULE_CYCLE_MS = SCHEDULE_UNSTACK_END_MS + SCHEDULE_GAP_MS;

export function ScheduleMotion({ isActive }: { isActive: boolean }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setTick(0);
      return;
    }
    const id = setInterval(() => {
      setTick((t) => (t + SCHEDULE_STEP_MS) % SCHEDULE_CYCLE_MS);
    }, SCHEDULE_STEP_MS);
    return () => clearInterval(id);
  }, [isActive]);

  let count: number;
  if (tick < SCHEDULE_BUILD_END_MS) {
    count = Math.floor(tick / SCHEDULE_MSG_MS) + 1;
  } else if (tick < SCHEDULE_HOLD_END_MS) {
    count = SCHEDULE_ROWS.length;
  } else if (tick < SCHEDULE_UNSTACK_END_MS) {
    const steps = Math.floor((tick - SCHEDULE_HOLD_END_MS) / SCHEDULE_UNSTACK_MS) + 1;
    count = Math.max(1, SCHEDULE_ROWS.length - steps);
  } else {
    count = 1;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="flex flex-col gap-4 w-full">
        <AnimatePresence initial={false}>
          {SCHEDULE_ROWS.slice(0, count).map((row, i) => (
            <motion.div
              key={i}
              layout="position"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, x: isActive ? row.driftX : 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
              transition={{ opacity: { duration: 0.4, ease: "easeOut" }, y: { duration: 0.4, ease: "easeOut" }, x: { duration: row.duration, repeat: loop(isActive), ease: "easeInOut" } }}
              className={`flex items-center gap-2.5 bg-white border border-zinc-100 rounded-full pl-1.5 pr-4 py-2 w-[152px] ${row.align}`}
            >
              <Avatar src={row.src} size={34} />
              <span className="text-[12px] font-bold text-zinc-600 flex-1 whitespace-nowrap">{row.name}</span>
              <div className="w-7 h-7 rounded-full bg-[#38E3FF]/25 border border-[#38E3FF]/40 flex items-center justify-center shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M4 12l5 5L20 6"
                    stroke="#0C4A6E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
  // raio do canto e espessura do traco escalam com a largura do estagio --
  // um valor fixo (4 / 1.5) fica desproporcional (grosso demais) nos
  // estagios mais estreitos do funil.
  const scale = top / FUNNEL_STAGES[0].top;
  const radius = Math.max(2.5, 5 * scale);
  const strokeWidth = Math.max(1, 1.6 * scale);
  const path = roundedPolygonPath(
    [
      [0, 0],
      [top, 0],
      [top - inset, FUNNEL_HEIGHT],
      [inset, FUNNEL_HEIGHT],
    ],
    radius
  );
  return (
    <svg width={top} height={FUNNEL_HEIGHT} viewBox={`0 0 ${top} ${FUNNEL_HEIGHT}`}>
      <path d={path} fill="#B597FF" fillOpacity="0.2" stroke="#B597FF" strokeWidth={strokeWidth} strokeLinejoin="round" />
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
          <p className="text-lg font-black text-[#0c0d0d] leading-none">45,3%</p>
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wide">conversão</p>
        </div>
        <div className="bg-white border border-zinc-100 rounded-lg px-3 py-1.5">
          <p className="text-lg font-black text-[#0c0d0d] leading-none">710</p>
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wide">leads/mês</p>
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
          className="absolute -top-1.5 -right-1.5 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center"
          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.8, repeat: loop(isActive), repeatDelay: 0.9 }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
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
        <Avatar src="/lotties/avatars/8_avatar.webp" size={26} />
        <span className="text-[11px] font-bold text-zinc-500 whitespace-nowrap">Carrinho abandonado</span>
      </motion.div>
      <div className="relative flex items-end justify-center pb-1 pt-3">
        <svg width="46" height="37" viewBox="0 0 24 20" fill="none">
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
