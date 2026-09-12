"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from "framer-motion";

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

// Ciclo unico e sincronizado (feito reels): todos aparecem juntos, vao
// sendo "clicados" um a um em sequencia, todos ficam invisiveis por um
// instante (o "corte" pro proximo frame) e entao o ciclo inteiro reinicia
// do zero -- e nesse corte que cada lead sorteia um lugar novo dentro do
// quadro, entao nunca reaparecem sempre nos mesmos lugares.
const CAPTURE_SETTLE_MS = 500;
const CAPTURE_STAGGER_MS = 400;
const CAPTURE_CLICK_MS = 700;
const CAPTURE_GAP_MS = 900;
const CAPTURE_STEP_MS = 100;
const CAPTURE_LAST_CLICK_END_MS = CAPTURE_SETTLE_MS + (CAPTURE_LEADS.length - 1) * CAPTURE_STAGGER_MS + CAPTURE_CLICK_MS;
const CAPTURE_CYCLE_MS = CAPTURE_LAST_CLICK_END_MS + CAPTURE_GAP_MS;

// 5 lugares fixos e ja bem espacados (mesma composicao original) -- a
// cada ciclo so a ORDEM sorteia qual lead cai em qual lugar (mais um
// jitter pequeno), entao a posicao muda sem nunca dois avatares caírem
// perto o suficiente pra se sobrepor.
const CAPTURE_SLOTS = [
  { top: 9, left: 5 },
  { top: 5, left: 32 },
  { top: 58, left: 3 },
  { top: 65, left: 32 },
  { top: 18, left: 79 },
];
const CAPTURE_JITTER_PCT = 3;

function shuffledCapturePositions() {
  const shuffled = [...CAPTURE_SLOTS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((slot) => ({
    top: `${slot.top + (Math.random() * 2 - 1) * CAPTURE_JITTER_PCT}%`,
    left: `${slot.left + (Math.random() * 2 - 1) * CAPTURE_JITTER_PCT}%`,
  }));
}

export function CaptureMotion({ isActive }: { isActive: boolean }) {
  const [tick, setTick] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [positions, setPositions] = useState<({ top: string; left: string } | null)[]>(() =>
    CAPTURE_LEADS.map(() => null)
  );

  useEffect(() => {
    if (!isActive) {
      setTick(0);
      return;
    }
    const id = setInterval(() => {
      setTick((t) => {
        const next = (t + CAPTURE_STEP_MS) % CAPTURE_CYCLE_MS;
        if (next < t) setCycle((c) => c + 1);
        return next;
      });
    }, CAPTURE_STEP_MS);
    return () => clearInterval(id);
  }, [isActive]);

  useEffect(() => {
    setPositions(isActive ? shuffledCapturePositions() : CAPTURE_LEADS.map(() => null));
  }, [isActive, cycle]);

  return (
    <div className="absolute inset-0">
      {CAPTURE_LEADS.map((lead, i) => {
        const clicked = isActive && tick >= CAPTURE_SETTLE_MS + i * CAPTURE_STAGGER_MS;
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
              animate={clicked ? { scale: [1, 1.2, 1, 0.4], opacity: [1, 1, 1, 0] } : { scale: 1, opacity: 1 }}
              transition={clicked ? { duration: CAPTURE_CLICK_MS / 1000, ease: "easeIn" } : { duration: 0.2, ease: "easeOut" }}
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

        <div className="flex flex-col items-start gap-1.5 w-[160px]">
          <AnimatePresence initial={false}>
            {AGENT_MESSAGES.slice(0, count).map((msg, i) => (
              <motion.div
                key={i}
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
        </div>
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
              className={`flex items-center gap-2 bg-white border border-zinc-100 rounded-full pl-1.5 pr-3 py-2 w-[172px] overflow-hidden ${row.align}`}
            >
              <Avatar src={row.src} size={34} />
              <span className="text-[12px] font-bold text-zinc-600 flex-1 min-w-0 truncate">{row.name}</span>
              <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: 5 }).map((_, star) => (
                  <motion.svg
                    key={star}
                    width="8"
                    height="8"
                    viewBox="0 0 20 20"
                    fill="#38E3FF"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.1 + star * 0.06, ease: "backOut" }}
                  >
                    <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 14.9 4.4 18l1.4-6.3L1 7.4l6.4-.6L10 1z" />
                  </motion.svg>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Acompanhar funil/metricas: funil de verdade com "boca" em elipse (efeito
// 3D classico de icone de funil) + corpo afunilando, em vez de um bloco
// trapezoidal chapado. Continua um unico silhueta so (nao 3 pilulas soltas),
// com opacidade crescente por estagio simulando profundidade, gradiente de
// marca no traco, e cada estagio ainda enche em sequencia (scaleX).
const FUNNEL_TOP_WIDTH = 84;
const FUNNEL_BOTTOM_WIDTH = 16;
const FUNNEL_BODY_HEIGHT = 62;
const FUNNEL_ELLIPSE_RY = 7;
const FUNNEL_TOTAL_HEIGHT = FUNNEL_ELLIPSE_RY + FUNNEL_BODY_HEIGHT;
const FUNNEL_STAGE_COUNT = 3;
const FUNNEL_BAND_HEIGHT = FUNNEL_BODY_HEIGHT / FUNNEL_STAGE_COUNT;
const FUNNEL_CENTER_X = FUNNEL_TOP_WIDTH / 2;
const FUNNEL_BOTTOM_RADIUS = 3;
const FUNNEL_BAND_OPACITY = [0.22, 0.42, 0.65];

// Gera um path SVG de poligono com os cantos de verdade arredondados (nao
// so o traco -- stroke-linejoin round sozinho nao arredonda o preenchimento).
// Aceita um raio por vertice pra permitir cantos retos onde a fatia encosta
// na divisoria interna e arredondados so na borda externa do funil.
function roundedPolygonPath(points: [number, number][], radius: number | number[]): string {
  const n = points.length;
  const radii = Array.isArray(radius) ? radius : points.map(() => radius);
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const [cx, cy] = points[i];
    const [px, py] = points[(i - 1 + n) % n];
    const [nx, ny] = points[(i + 1) % n];
    const distPrev = Math.hypot(cx - px, cy - py);
    const distNext = Math.hypot(cx - nx, cy - ny);
    const r = Math.min(radii[i], distPrev / 2, distNext / 2);
    const p1x = cx + ((px - cx) / distPrev) * r;
    const p1y = cy + ((py - cy) / distPrev) * r;
    const p2x = cx + ((nx - cx) / distNext) * r;
    const p2y = cy + ((ny - cy) / distNext) * r;
    d.push(i === 0 ? `M ${p1x} ${p1y}` : `L ${p1x} ${p1y}`);
    d.push(r > 0 ? `Q ${cx} ${cy} ${p2x} ${p2y}` : `L ${p2x} ${p2y}`);
  }
  d.push("Z");
  return d.join(" ");
}

// y aqui e sempre relativo ao topo do CORPO (logo abaixo da elipse), nao
// do svg inteiro -- widthAt(0) = boca do funil (mesma largura da elipse).
function funnelEdgesAtBodyY(bodyY: number): [number, number] {
  const width = FUNNEL_TOP_WIDTH - (FUNNEL_TOP_WIDTH - FUNNEL_BOTTOM_WIDTH) * (bodyY / FUNNEL_BODY_HEIGHT);
  return [FUNNEL_CENTER_X - width / 2, FUNNEL_CENTER_X + width / 2];
}

const FUNNEL_OUTER_PATH = (() => {
  const [topLeft, topRight] = funnelEdgesAtBodyY(0);
  const [bottomLeft, bottomRight] = funnelEdgesAtBodyY(FUNNEL_BODY_HEIGHT);
  return roundedPolygonPath(
    [
      [topLeft, FUNNEL_ELLIPSE_RY],
      [topRight, FUNNEL_ELLIPSE_RY],
      [bottomRight, FUNNEL_TOTAL_HEIGHT],
      [bottomLeft, FUNNEL_TOTAL_HEIGHT],
    ],
    [0, 0, FUNNEL_BOTTOM_RADIUS, FUNNEL_BOTTOM_RADIUS]
  );
})();

const FUNNEL_BAND_PATHS = Array.from({ length: FUNNEL_STAGE_COUNT }, (_, i) => {
  const y0 = i * FUNNEL_BAND_HEIGHT;
  const y1 = (i + 1) * FUNNEL_BAND_HEIGHT;
  const [l0, r0] = funnelEdgesAtBodyY(y0);
  const [l1, r1] = funnelEdgesAtBodyY(y1);
  const isBottom = i === FUNNEL_STAGE_COUNT - 1;
  return roundedPolygonPath(
    [
      [l0, y0 + FUNNEL_ELLIPSE_RY],
      [r0, y0 + FUNNEL_ELLIPSE_RY],
      [r1, y1 + FUNNEL_ELLIPSE_RY],
      [l1, y1 + FUNNEL_ELLIPSE_RY],
    ],
    [0, 0, isBottom ? FUNNEL_BOTTOM_RADIUS : 0, isBottom ? FUNNEL_BOTTOM_RADIUS : 0]
  );
});

// Numero "de impacto": conta subindo de um valor proximo (nao do zero)
// ate o valor final quando o card fica ativo, em vez de so aparecer estatico.
function CountUpStat({ isActive, from, to, decimals = 0, suffix = "" }: { isActive: boolean; from: number; to: number; decimals?: number; suffix?: string }) {
  const count = useMotionValue(from);
  const display = useTransform(count, (v) => `${v.toFixed(decimals).replace(".", ",")}${suffix}`);

  useEffect(() => {
    if (!isActive) {
      count.set(from);
      return;
    }
    const controls = animate(count, to, { duration: 1.3, ease: "easeOut", delay: 0.2 });
    return () => controls.stop();
  }, [isActive]);

  return <motion.p className="text-lg font-black text-[#0c0d0d] leading-none">{display}</motion.p>;
}

export function FunnelMotion({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6">
      <svg width={FUNNEL_TOP_WIDTH} height={FUNNEL_TOTAL_HEIGHT} viewBox={`0 0 ${FUNNEL_TOP_WIDTH} ${FUNNEL_TOTAL_HEIGHT}`}>
        <defs>
          <linearGradient id="funnelStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B597FF" />
            <stop offset="1" stopColor="#38E3FF" />
          </linearGradient>
        </defs>
        {/* boca do funil em elipse -- da a leitura 3D de funil de verdade em vez de bloco chapado */}
        <ellipse
          cx={FUNNEL_CENTER_X}
          cy={FUNNEL_ELLIPSE_RY}
          rx={FUNNEL_TOP_WIDTH / 2}
          ry={FUNNEL_ELLIPSE_RY}
          fill="#B597FF"
          fillOpacity={FUNNEL_BAND_OPACITY[0]}
          stroke="url(#funnelStroke)"
          strokeWidth="1.3"
        />
        <path d={FUNNEL_OUTER_PATH} fill="none" stroke="url(#funnelStroke)" strokeWidth="1.3" strokeLinejoin="round" />
        {FUNNEL_BAND_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="#B597FF"
            fillOpacity={FUNNEL_BAND_OPACITY[i]}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            animate={isActive ? { scaleX: [0, 1] } : { scaleX: 1 }}
            transition={{ duration: 0.5, delay: i * 0.3, repeat: loop(isActive), repeatType: "reverse", repeatDelay: 0.6, ease: "easeOut" }}
          />
        ))}
      </svg>
      <div className="flex flex-col gap-2">
        <div className="bg-white border border-zinc-100 rounded-lg px-3 py-1.5">
          <CountUpStat isActive={isActive} from={37.8} to={45.3} decimals={1} suffix="%" />
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wide">conversão</p>
        </div>
        <div className="bg-white border border-zinc-100 rounded-lg px-3 py-1.5">
          <CountUpStat isActive={isActive} from={604} to={710} />
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
