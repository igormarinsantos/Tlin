"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight, MessageCircle, Play, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { SegmentHeroFlowKey } from "@/lib/dictionaries/segmentHeroFlows";

const STEP_DURATIONS = [1500, 1650, 1500, 1550, 1500, 1700, 2700] as const;
const FINAL_STEP = STEP_DURATIONS.length - 1;
const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const ease = [0.22, 1, 0.36, 1] as const;

type Flow = ReturnType<typeof useSegmentFlow>;

function Avatar({ flow, small = false }: { flow: Flow; small?: boolean }) {
  const pixels = small ? 24 : 34;
  return (
    <span className={`relative block shrink-0 ${small ? "size-6" : "size-[34px]"}`}>
      <Image src={flow.contact.avatar} alt="" width={pixels} height={pixels} className="h-full w-full rounded-full object-cover ring-2 ring-white" />
      <span className="absolute bottom-0 right-0 size-2 rounded-full border-2 border-white bg-[#25D366]" />
    </span>
  );
}

function TlinAvatar({ small = false }: { small?: boolean }) {
  const pixels = small ? 22 : 30;
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-white ring-1 ring-zinc-200 ${small ? "size-[22px]" : "size-[30px]"}`}>
      <Image src="/TlinIA.svg" alt="" width={pixels} height={pixels} className="h-full w-full" />
    </span>
  );
}

function TypingDots() {
  return (
    <span className="flex h-3 items-center gap-1">
      {[0, 0.16, 0.32].map((delay) => (
        <motion.span key={delay} animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }} transition={{ duration: 0.85, delay, repeat: Infinity }} className="size-1 rounded-full bg-zinc-400" />
      ))}
    </span>
  );
}

function ChatPane({ flow, step }: { flow: Flow; step: number }) {
  const visibleCount = step === 0 ? 1 : step === 1 ? 2 : step === 2 ? 3 : 4;
  const isTyping = step < 3 && visibleCount < flow.messages.length;

  return (
    <div className="flex min-h-0 flex-col border-b border-zinc-200/70 bg-white md:border-b-0 md:border-r">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-100 px-3 md:h-[58px] md:px-4">
        <div className="flex min-w-0 items-center gap-2.5"><Avatar flow={flow} /><div className="min-w-0"><p className="truncate text-[11px] font-bold text-[#0c0d0d]">{flow.contact.name}</p><p className="truncate text-[8px] font-semibold text-[#24a957]">{flow.contact.status}</p></div></div>
        <span className="flex items-center gap-1 rounded-full bg-[#25D366]/10 px-2 py-1 text-[7px] font-bold text-[#168a43]"><MessageCircle className="size-2.5" />WhatsApp</span>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden bg-[#f7f7f8] p-3.5 md:p-4">
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#0c0d0d_0.7px,transparent_0.7px)] [background-size:12px_12px]" />
        <AnimatePresence initial={false} mode="popLayout">
          {flow.messages.slice(0, visibleCount).map((message, index) => {
            const isAi = message.from === "ai";
            return (
              <motion.div layout key={`${message.from}-${message.text}`} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.38, ease }} className={`relative z-10 items-end gap-1.5 ${step >= 3 && index < 2 ? "hidden md:flex" : "flex"} ${isAi ? "justify-start" : "justify-end"}`}>
                {isAi && <TlinAvatar small />}
                <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-[9px] font-medium leading-[1.38] md:text-[10px] ${isAi ? "rounded-bl-[5px] border border-zinc-200 bg-white text-zinc-600" : "rounded-br-[5px] bg-[#0c0d0d] text-white"}`}>{message.text}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {isTyping && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-end gap-1.5"><TlinAvatar small /><span className="rounded-2xl rounded-bl-[5px] border border-zinc-200 bg-white px-3 py-2"><TypingDots /></span></motion.div>}
      </div>
    </div>
  );
}

function FlowRail({ flow, step }: { flow: Flow; step: number }) {
  const activeStage = step >= FINAL_STEP ? 2 : step >= 5 ? 1 : 0;
  const activity = flow.activities[Math.min(Math.max(step - 3, 0), flow.activities.length - 1)];
  const isComplete = step >= FINAL_STEP;

  return (
    <div className="flex min-h-0 flex-col bg-[#fbfbfc]">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-100 px-3 md:h-[58px] md:px-4">
        <div className="flex items-center gap-2"><Image src="/favicon.svg" alt="" width={20} height={20} className="size-5" /><div><p className="text-[10px] font-black tracking-tight text-[#0c0d0d]">tlin.ai</p><p className="text-[7px] font-semibold text-zinc-400">{flow.crmLabel}</p></div></div>
        <AnimatePresence mode="wait"><motion.span key={step >= 3 ? "active" : "waiting"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className={`flex items-center gap-1 rounded-full px-2 py-1 text-[7px] font-bold ${step >= 3 ? "bg-[#eee8ff] text-[#7254c8]" : "bg-zinc-100 text-zinc-400"}`}><Sparkles className="size-2.5" />{step >= 3 ? flow.identifyingLabel : flow.conversationLabel}</motion.span></AnimatePresence>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-3.5 md:p-4">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {flow.stages.map((stage, index) => (
            <div key={stage} className="flex min-w-0 flex-1 items-center gap-1.5">
              <motion.span animate={{ backgroundColor: index <= activeStage && step >= 3 ? "#0c0d0d" : "#e4e4e7", color: index <= activeStage && step >= 3 ? "#ffffff" : "#a1a1aa" }} className="grid size-5 shrink-0 place-items-center rounded-full text-[7px] font-black">{index < activeStage ? <Check className="size-2.5" strokeWidth={3} /> : index + 1}</motion.span>
              <p className={`hidden truncate text-[7px] font-bold lg:block ${index === activeStage && step >= 3 ? "text-[#0c0d0d]" : "text-zinc-400"}`}>{stage}</p>
              {index < flow.stages.length - 1 && <ChevronRight className="ml-auto size-2.5 shrink-0 text-zinc-300" />}
            </div>
          ))}
        </div>

        <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_10px_30px_rgba(12,13,13,0.04)]">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
            <Avatar flow={flow} small />
            <div className="min-w-0 flex-1"><p className="truncate text-[9px] font-black text-[#0c0d0d]">{flow.contact.name}</p><p className="truncate text-[7px] font-semibold text-zinc-400">{flow.contactLabel} · WhatsApp</p></div>
            <span className="h-1.5 w-10 overflow-hidden rounded-full bg-zinc-100"><motion.span animate={{ width: step >= FINAL_STEP ? "100%" : step >= 5 ? "66%" : step >= 3 ? "33%" : "0%" }} transition={{ duration: 0.65, ease }} className="block h-full rounded-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF]" /></span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
            {flow.fields.map((field, index) => {
              const visible = step >= 3 + Math.floor(index / 2);
              return <motion.div key={field.label} animate={{ opacity: visible ? 1 : 0.28, y: visible ? 0 : 4 }} transition={{ duration: 0.4, ease }} className="min-w-0 border-b border-zinc-100 pb-1.5"><p className="truncate text-[6px] font-bold uppercase tracking-[0.08em] text-zinc-400">{field.label}</p><p className={`mt-0.5 truncate text-[8px] font-bold ${visible ? "text-zinc-700" : "text-zinc-300"}`}>{visible ? field.value : "—"}</p></motion.div>;
            })}
          </div>

          <AnimatePresence mode="wait">{step >= 3 && <motion.div key={isComplete ? "complete" : activity} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease }} className={`absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl px-2.5 py-2 ${isComplete ? "bg-[#0c0d0d] text-white" : "bg-[#f6f3ff] text-[#7254c8]"}`}><span className={`grid size-5 shrink-0 place-items-center rounded-full ${isComplete ? "bg-gradient-to-br from-[#B597FF] to-[#38E3FF] text-[#0c0d0d]" : "bg-white text-[#7254c8] shadow-sm"}`}>{isComplete ? <Check className="size-2.5" strokeWidth={3} /> : <Sparkles className="size-2.5" />}</span><div className="min-w-0 flex-1"><p className="truncate text-[7px] font-bold">{isComplete ? flow.outcome.title : activity}</p>{isComplete && <p className="truncate text-[6px] font-semibold text-zinc-400">{flow.outcome.crmStatus}</p>}</div>{isComplete && <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-1 text-[6px] font-bold text-[#38E3FF]">{flow.outcome.detail}</span>}</motion.div>}</AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function useSegmentFlow(variant: SegmentHeroFlowKey) {
  const { t } = useLanguage();
  return t.campaigns[variant].heroFlow;
}

export function SegmentHeroFlow({ variant }: { variant: SegmentHeroFlowKey }) {
  const flow = useSegmentFlow(variant);
  const shouldReduceMotion = useReducedMotion();
  const hasMounted = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);
  const [motionOverride, setMotionOverride] = useState(false);
  const [step, setStep] = useState(0);
  const motionEnabled = !shouldReduceMotion || motionOverride;

  useEffect(() => {
    if (!hasMounted || !motionEnabled) return;
    const timeout = window.setTimeout(() => setStep((current) => (current >= FINAL_STEP ? 0 : current + 1)), STEP_DURATIONS[step]);
    return () => window.clearTimeout(timeout);
  }, [hasMounted, motionEnabled, step]);

  const effectiveStep = hasMounted && !motionEnabled ? FINAL_STEP : step;

  return (
    <div data-testid="segment-hero-flow" className="relative h-full w-full overflow-hidden rounded-[26px] border border-white/90 bg-white/60 p-2 shadow-[0_24px_70px_rgba(82,66,120,0.12)] backdrop-blur md:p-2.5">
      <p className="sr-only">{flow.summary}</p>
      <div aria-hidden="true" className="grid h-full min-h-0 grid-rows-[46%_54%] overflow-hidden rounded-[20px] border border-zinc-200/80 bg-white md:grid-cols-[45%_55%] md:grid-rows-1"><ChatPane flow={flow} step={effectiveStep} /><FlowRail flow={flow} step={effectiveStep} /></div>
      {hasMounted && shouldReduceMotion && !motionOverride && <button type="button" onClick={() => { setStep(0); setMotionOverride(true); }} className="absolute right-4 top-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0c0d0d] px-3 py-2 text-[9px] font-bold text-white shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B597FF] focus-visible:ring-offset-2"><Play className="size-3 fill-current" />{flow.playLabel}</button>}
    </div>
  );
}
