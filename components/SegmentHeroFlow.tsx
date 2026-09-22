"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  Database,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { SegmentHeroFlowKey } from "@/lib/dictionaries/segmentHeroFlows";

const STEP_DURATIONS = [1500, 1650, 1550, 1750, 1500, 1550, 2600] as const;
const FINAL_STEP = STEP_DURATIONS.length - 1;

const fadeTransition = { duration: 0.35, ease: "easeOut" as const };
const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function ConversationPanel({
  flow,
  step,
  compact,
}: {
  flow: ReturnType<typeof useSegmentFlow>;
  step: number;
  compact: boolean;
}) {
  const visibleCount = step === 0 ? 2 : step === 1 ? 3 : 4;
  const visibleMessages = compact ? flow.messages.slice(-2) : flow.messages.slice(0, visibleCount);

  return (
    <motion.div
      layout
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-zinc-200/80 bg-white shadow-[0_18px_50px_rgba(12,13,13,0.07)]"
      transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-3.5 py-2.5 md:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
            <MessageCircle className="size-3.5" strokeWidth={2.4} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold text-[#0c0d0d] md:text-[11px]">{flow.contactLabel}</p>
            <p className="truncate text-[8px] font-semibold text-zinc-400 md:text-[9px]">{flow.conversationLabel}</p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-[#B597FF]/15 to-[#38E3FF]/15 px-2 py-1 text-[8px] font-bold text-[#7357b8] md:text-[9px]">
          <Sparkles className="size-2.5" />
          {flow.aiLabel}
        </span>
      </div>

      <div className={`flex min-h-0 flex-1 flex-col justify-end bg-[#f7f7fb] ${compact ? "gap-1 p-2" : "gap-2 p-3 md:p-4"}`}>
        <AnimatePresence initial={false} mode="popLayout">
          {visibleMessages.map((message, index) => (
            <motion.div
              layout
              key={`${message.from}-${message.text}`}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={fadeTransition}
              className={`max-w-[88%] rounded-2xl px-3 py-2 text-[9px] font-semibold leading-[1.35] md:text-[10px] ${
                message.from === "ai"
                  ? "self-start rounded-bl-md bg-white text-zinc-700 ring-1 ring-zinc-200/70"
                  : "self-end rounded-br-md bg-[#dcf8e7] text-zinc-700"
              } ${compact && index === 0 ? "hidden md:block" : ""}`}
            >
              {message.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {!compact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 2 ? 1 : 0 }}
            className="ml-1 flex items-center gap-1 text-[8px] font-bold text-zinc-400"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-[#B597FF]" />
            {flow.identifyingLabel}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ContextExtraction({ flow }: { flow: ReturnType<typeof useSegmentFlow> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.08, delayChildren: 0.08 }}
      className="absolute inset-x-3 bottom-3 z-20 grid grid-cols-2 gap-1.5 rounded-2xl border border-[#B597FF]/25 bg-white/95 p-2.5 shadow-[0_16px_40px_rgba(104,79,165,0.16)] backdrop-blur md:inset-x-4 md:bottom-4"
    >
      {flow.fields.map((field) => (
        <motion.div
          key={field.label}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-w-0 rounded-xl bg-[#f7f7fb] px-2.5 py-1.5"
        >
          <p className="truncate text-[7px] font-bold uppercase tracking-wide text-zinc-400">{field.label}</p>
          <p className="truncate text-[9px] font-bold text-[#0c0d0d]">{field.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function CrmLeadCard({
  flow,
  stageIndex,
}: {
  flow: ReturnType<typeof useSegmentFlow>;
  stageIndex: number;
}) {
  return (
    <motion.div
      layoutId="segment-crm-lead"
      className="rounded-xl border border-[#B597FF]/25 bg-white p-2 shadow-[0_8px_24px_rgba(12,13,13,0.08)] md:p-2.5"
      transition={{ layout: { type: "spring", stiffness: 170, damping: 23 } }}
    >
      <div className="mb-1.5 flex items-center justify-between gap-1">
        <span className="truncate text-[8px] font-black text-[#0c0d0d] md:text-[9px]">{flow.contactLabel}</span>
        <span className="size-1.5 shrink-0 rounded-full bg-[#25D366]" />
      </div>
      <p className="line-clamp-2 text-[7px] font-semibold leading-snug text-zinc-500 md:text-[8px]">
        {flow.fields[Math.min(stageIndex, flow.fields.length - 1)].value}
      </p>
    </motion.div>
  );
}

function MiniCrmBoard({
  flow,
  step,
}: {
  flow: ReturnType<typeof useSegmentFlow>;
  step: number;
}) {
  const stageIndex = step >= FINAL_STEP ? 2 : step >= 5 ? 1 : 0;
  const activityIndex = Math.min(Math.max(step - 3, 0), flow.activities.length - 1);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-zinc-200/80 bg-white shadow-[0_18px_50px_rgba(12,13,13,0.07)]"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-3 py-2 md:px-3.5 md:py-2.5">
        <span className="flex items-center gap-1.5 text-[9px] font-black text-[#0c0d0d] md:text-[10px]">
          <Database className="size-3.5 text-[#8d6de0]" />
          {flow.crmLabel}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={stageIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-[7px] font-bold text-[#7357b8] md:text-[8px]"
          >
            {stageIndex === 2 ? <CheckCircle2 className="size-3" /> : <Zap className="size-3" />}
            {stageIndex === 2 ? flow.updatedLabel : flow.updatingLabel}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5 bg-[#f7f7fb] p-2 md:gap-2 md:p-3">
        {flow.stages.map((stage, index) => (
          <div key={stage} className="min-w-0 rounded-xl border border-zinc-200/80 bg-white/70 p-1.5 md:p-2">
            <div className="mb-1.5 flex items-center gap-1">
              <span className={`size-1.5 shrink-0 rounded-full ${index <= stageIndex ? "bg-[#B597FF]" : "bg-zinc-300"}`} />
              <p className={`line-clamp-2 text-[6px] font-black leading-tight md:text-[7px] ${index === stageIndex ? "text-[#0c0d0d]" : "text-zinc-400"}`}>
                {stage}
              </p>
            </div>
            {index === stageIndex && <CrmLeadCard flow={flow} stageIndex={stageIndex} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={flow.activities[activityIndex]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="absolute inset-x-3 bottom-2.5 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur md:inset-x-4 md:bottom-3"
        >
          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#B597FF] to-[#38E3FF] text-white">
            <Check className="size-2.5" strokeWidth={3} />
          </span>
          <span className="truncate text-[7px] font-bold text-zinc-600 md:text-[8px]">{flow.activities[activityIndex]}</span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function OutcomeCard({ flow }: { flow: ReturnType<typeof useSegmentFlow> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-3 bottom-3 z-30 rounded-2xl bg-[#0c0d0d] p-3 text-white shadow-[0_18px_44px_rgba(12,13,13,0.24)] md:inset-x-4 md:bottom-4 md:p-3.5"
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#B597FF] to-[#38E3FF] text-[#0c0d0d]">
          <CalendarCheck2 className="size-4.5" strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[10px] font-black md:text-[11px]">{flow.outcome.title}</p>
            <p className="shrink-0 text-[8px] font-bold text-[#38E3FF] md:text-[9px]">{flow.outcome.detail}</p>
          </div>
          <p className="truncate text-[7px] font-bold text-zinc-400 md:text-[8px]">{flow.outcome.crmStatus}</p>
        </div>
      </div>
      <p className="mt-2 border-t border-white/10 pt-2 text-center text-[7px] font-semibold leading-snug text-zinc-300 md:text-[8px]">
        {flow.outcome.supportingText}
      </p>
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
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!hasMounted || shouldReduceMotion) return;

    const timeout = window.setTimeout(() => {
      setStep((current) => (current >= FINAL_STEP ? 0 : current + 1));
    }, STEP_DURATIONS[step]);

    return () => window.clearTimeout(timeout);
  }, [hasMounted, shouldReduceMotion, step]);

  const effectiveStep = hasMounted && shouldReduceMotion ? FINAL_STEP : step;
  const showCrm = effectiveStep >= 3;

  return (
    <div
      data-testid="segment-hero-flow"
      className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/80 bg-white/45 p-2.5 shadow-[0_28px_80px_rgba(83,66,123,0.12)] backdrop-blur-sm md:p-3.5"
    >
      <p className="sr-only">{flow.summary}</p>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(181,151,255,0.18),transparent_38%),radial-gradient(circle_at_90%_80%,rgba(56,227,255,0.16),transparent_42%)]" />

      <LayoutGroup>
        <div aria-hidden="true" className={`relative z-10 grid h-full min-h-0 gap-2.5 ${showCrm ? "grid-rows-[104px_minmax(0,1fr)] md:grid-cols-[0.39fr_0.61fr] md:grid-rows-1" : "grid-cols-1"}`}>
          <div className="relative min-h-0">
            <ConversationPanel flow={flow} step={effectiveStep} compact={showCrm} />
            {effectiveStep === 3 && <ContextExtraction flow={flow} />}
          </div>

          {showCrm && <MiniCrmBoard flow={flow} step={effectiveStep} />}
        </div>

        <AnimatePresence>{effectiveStep === FINAL_STEP && <OutcomeCard flow={flow} />}</AnimatePresence>
      </LayoutGroup>

      <div aria-hidden="true" className="absolute inset-x-5 bottom-1 z-40 flex items-center justify-center gap-1">
        {STEP_DURATIONS.map((_, index) => (
          <span
            key={index}
            className={`h-0.5 rounded-full transition-all duration-300 ${index === effectiveStep ? "w-5 bg-[#8d6de0]" : "w-1.5 bg-zinc-300/80"}`}
          />
        ))}
      </div>

      <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white px-2 py-1 text-[7px] font-black text-[#7357b8] shadow-sm md:flex">
        <MessageCircle className="size-2.5" />
        <ArrowRight className="size-2.5" />
        <Database className="size-2.5" />
      </div>
    </div>
  );
}
