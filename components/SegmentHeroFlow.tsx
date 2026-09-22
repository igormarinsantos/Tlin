"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, MessageCircle, Play, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { SegmentHeroFlowKey } from "@/lib/dictionaries/segmentHeroFlows";
import { TlinCard } from "@/components/ui/tlin";

const STEP_DURATIONS = [1450, 1550, 1450, 1650, 1450, 1550, 2600] as const;
const FINAL_STEP = STEP_DURATIONS.length - 1;
const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const ease = [0.22, 1, 0.36, 1] as const;

type Flow = ReturnType<typeof useSegmentFlow>;

function ContactAvatar({ flow, size = "md" }: { flow: Flow; size?: "sm" | "md" }) {
  const pixels = size === "sm" ? 28 : 38;
  return (
    <span className={`relative block shrink-0 ${size === "sm" ? "size-7" : "size-[38px]"}`}>
      <Image src={flow.contact.avatar} alt="" width={pixels} height={pixels} className="h-full w-full rounded-full object-cover ring-2 ring-white" />
      <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#25D366]" />
    </span>
  );
}

function TlinAvatar() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white shadow-sm">
      <Image src="/TlinIA.svg" alt="" width={28} height={28} className="h-full w-full" />
    </span>
  );
}

function TypingDots() {
  return (
    <span className="flex h-4 items-center gap-1">
      {[0, 0.16, 0.32].map((delay) => (
        <motion.span key={delay} animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }} transition={{ duration: 0.85, delay, repeat: Infinity }} className="size-1 rounded-full bg-zinc-400" />
      ))}
    </span>
  );
}

function ConversationCard({ flow, step }: { flow: Flow; step: number }) {
  const visibleCount = Math.min(step + 1, flow.messages.length);
  const isTyping = step < 3;

  return (
    <TlinCard className="absolute left-3 top-4 z-10 flex h-[76%] w-[74%] flex-col overflow-hidden shadow-[0_22px_55px_rgba(62,49,94,0.10)] sm:left-5 sm:top-6 sm:h-[75%] sm:w-[70%] md:left-6 md:top-7 md:w-[68%]">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-100 px-3.5 md:h-16 md:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <ContactAvatar flow={flow} />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-tlin-ink md:text-xs">{flow.contact.name}</p>
            <p className="truncate text-[8px] font-semibold text-[#24a957] md:text-[9px]">{flow.contact.status}</p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#25D366]/10 px-2 py-1 text-[7px] font-bold text-[#168a43] md:px-2.5 md:text-[8px]">
          <MessageCircle className="size-2.5" />
          WhatsApp
        </span>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden bg-[#fbfbfc] p-3 md:gap-2.5 md:p-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:radial-gradient(#0c0d0d_0.75px,transparent_0.75px)] [background-size:14px_14px]" />
        <AnimatePresence initial={false} mode="popLayout">
          {flow.messages.slice(0, visibleCount).map((message, index) => {
            const isAi = message.from === "ai";
            if (step >= 4 && index === 0) return null;

            return (
              <motion.div
                layout
                key={`${message.from}-${message.text}`}
                initial={{ opacity: 0, y: 9, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.38, ease }}
                className={`relative z-10 flex items-end gap-1.5 ${isAi ? "justify-end" : "justify-start"}`}
              >
                {!isAi && <ContactAvatar flow={flow} size="sm" />}
                <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-[9px] font-medium leading-[1.38] md:px-3.5 md:text-[10px] ${isAi ? "rounded-br-[6px] bg-tlin-ink text-white" : "rounded-bl-[6px] bg-zinc-100 text-zinc-600"}`}>
                  {message.text}
                </div>
                {isAi && <TlinAvatar />}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-end justify-end gap-1.5">
            <span className="rounded-2xl rounded-br-[6px] bg-tlin-ink px-3 py-2 text-white"><TypingDots /></span>
            <TlinAvatar />
          </motion.div>
        )}
      </div>
    </TlinCard>
  );
}

function CrmResultCard({ flow, step }: { flow: Flow; step: number }) {
  const hasContext = step >= 3;
  const isComplete = step >= FINAL_STEP;
  const currentActivity = flow.activities[Math.min(Math.max(step - 3, 0), flow.activities.length - 1)];
  const visibleFields = [flow.fields[0], flow.fields[1], flow.fields[3]].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, x: 18, y: 14, scale: 0.96 }}
      animate={{ opacity: hasContext ? 1 : 0, x: hasContext ? 0 : 18, y: hasContext ? 0 : 14, scale: hasContext ? 1 : 0.97 }}
      transition={{ duration: 0.55, ease }}
      className="absolute bottom-4 right-3 z-20 w-[58%] sm:bottom-6 sm:right-5 sm:w-[54%] md:bottom-7 md:right-6 md:w-[52%]"
    >
      <TlinCard className="overflow-hidden border-white/90 shadow-[0_24px_60px_rgba(62,49,94,0.16)]">
        <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2.5 md:px-4 md:py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-[#f2edff]">
              <Image src="/favicon.svg" alt="" width={18} height={18} className="size-[18px]" />
            </span>
            <div>
              <p className="text-[9px] font-black tracking-tight text-tlin-ink md:text-[10px]">tlin.ai</p>
              <p className="text-[6px] font-semibold text-zinc-400 md:text-[7px]">{flow.crmLabel}</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.span key={isComplete ? "complete" : "active"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className={`flex items-center gap-1 rounded-full px-2 py-1 text-[6px] font-bold md:text-[7px] ${isComplete ? "bg-[#e8fafc] text-[#15808d]" : "bg-[#f2edff] text-[#7254c8]"}`}>
              {isComplete ? <Check className="size-2.5" strokeWidth={3} /> : <Sparkles className="size-2.5" />}
              <span className="hidden sm:inline">{isComplete ? flow.updatedLabel : flow.identifyingLabel}</span>
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="p-3 md:p-4">
          <div className="flex items-center gap-2.5">
            <ContactAvatar flow={flow} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-bold text-tlin-ink md:text-[10px]">{flow.contact.name}</p>
              <p className="truncate text-[7px] font-medium text-zinc-400 md:text-[8px]">{flow.contactLabel} · WhatsApp</p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-[6px] font-bold text-zinc-500 sm:inline-flex md:text-[7px]">{flow.stages[isComplete ? 2 : hasContext ? 1 : 0]}</span>
          </div>

          <div className="mt-3 hidden grid-cols-3 gap-1.5 sm:grid md:gap-2">
            {visibleFields.map((field, index) => {
              const isVisible = hasContext && step >= 3 + index;
              return (
                <motion.div key={field.label} animate={{ opacity: isVisible ? 1 : 0.3, y: isVisible ? 0 : 3 }} transition={{ duration: 0.35, ease }} className="min-w-0 rounded-xl bg-[#f8f7fb] px-2 py-2">
                  <p className="truncate text-[5px] font-bold uppercase tracking-[0.07em] text-zinc-400 md:text-[6px]">{field.label}</p>
                  <p className="mt-0.5 truncate text-[7px] font-bold text-zinc-700 md:text-[8px]">{isVisible ? field.value : "—"}</p>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={isComplete ? "outcome" : currentActivity} initial={{ opacity: 0, y: 7 }} animate={{ opacity: hasContext ? 1 : 0, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.35, ease }} className={`mt-3 flex items-center gap-2 rounded-xl px-2.5 py-2.5 ${isComplete ? "bg-tlin-ink text-white" : "bg-[#f2edff] text-[#7254c8]"}`}>
              <span className={`grid size-6 shrink-0 place-items-center rounded-full ${isComplete ? "bg-gradient-to-br from-tlin-purple to-tlin-blue text-tlin-ink" : "bg-white shadow-sm"}`}>
                {isComplete ? <Check className="size-3" strokeWidth={3} /> : <Sparkles className="size-3" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[7px] font-bold md:text-[8px]">{isComplete ? flow.outcome.title : currentActivity}</p>
                {isComplete && <p className="mt-0.5 truncate text-[6px] font-medium text-white/50 md:text-[7px]">{flow.outcome.crmStatus}</p>}
              </div>
              {isComplete && <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-1 text-[6px] font-bold text-tlin-blue md:text-[7px]">{flow.outcome.detail}</span>}
            </motion.div>
          </AnimatePresence>
        </div>
      </TlinCard>
    </motion.div>
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
    <div data-testid="segment-hero-flow" className="relative h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-tlin-purple/45 via-white to-tlin-blue/45 p-px shadow-[0_24px_70px_rgba(82,66,120,0.10)]">
      <p className="sr-only">{flow.summary}</p>
      <div aria-hidden="true" className="relative h-full overflow-hidden rounded-[calc(2rem-1px)] bg-[#f8f6ff]">
        <div className="pointer-events-none absolute -left-16 -top-20 size-64 rounded-full bg-tlin-purple/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-tlin-blue/15 blur-3xl" />
        <motion.div animate={{ opacity: effectiveStep >= 3 ? 1 : 0.25, scaleX: effectiveStep >= 3 ? 1 : 0.4 }} transition={{ duration: 0.55, ease }} className="absolute bottom-[27%] left-[54%] right-[34%] z-0 h-px origin-left bg-gradient-to-r from-tlin-purple to-tlin-blue" />
        <ConversationCard flow={flow} step={effectiveStep} />
        <CrmResultCard flow={flow} step={effectiveStep} />
      </div>
      {hasMounted && shouldReduceMotion && !motionOverride && (
        <button type="button" onClick={() => { setStep(0); setMotionOverride(true); }} className="absolute right-4 top-4 z-40 flex items-center gap-1.5 rounded-full bg-tlin-ink px-3 py-2 text-[9px] font-bold text-white shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tlin-purple focus-visible:ring-offset-2">
          <Play className="size-3 fill-current" />
          {flow.playLabel}
        </button>
      )}
    </div>
  );
}
