"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { BarChart3, Check, CheckCircle2, ChevronDown, Funnel, Inbox, MessageCircle, Play, Sparkles, Users, Zap } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { SegmentHeroFlowKey } from "@/lib/dictionaries/segmentHeroFlows";

const STEP_DURATIONS = [1450, 1650, 1750, 1800, 1550, 1650, 2800] as const;
const FINAL_STEP = STEP_DURATIONS.length - 1;
const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

type Flow = ReturnType<typeof useSegmentFlow>;

function ContactAvatar({ flow, size = "md" }: { flow: Flow; size?: "sm" | "md" | "lg" }) {
  const sizes = size === "sm" ? "size-5" : size === "lg" ? "size-10" : "size-7";
  const pixels = size === "sm" ? 20 : size === "lg" ? 40 : 28;
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-full border-2 border-white bg-zinc-100 shadow-sm ${sizes}`}>
      <Image src={flow.contact.avatar} alt="" width={pixels} height={pixels} className="h-full w-full object-cover" />
      <span className="absolute bottom-0 right-0 size-2 rounded-full border border-white bg-[#25D366]" />
    </span>
  );
}

function TlinAiAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const className = size === "sm" ? "size-5" : "size-7";
  const pixels = size === "sm" ? 20 : 28;
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-[#B597FF]/20 ${className}`}>
      <Image src="/TlinIA.svg" alt="" width={pixels} height={pixels} className="h-full w-full object-contain" />
    </span>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 px-1 py-0.5">
      {[0, 0.18, 0.36].map((delay) => (
        <motion.span key={delay} animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay }} className="size-1.5 rounded-full bg-[#0c0d0d]" />
      ))}
    </span>
  );
}

function BrandedMessage({ flow, message, compact }: { flow: Flow; message: Flow["messages"][number]; compact: boolean }) {
  const isAi = message.from === "ai";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isAi ? 12 : -12, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -7, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 190, damping: 27 }}
      className={`flex w-full items-start gap-2 ${isAi ? "flex-row-reverse" : "flex-row"}`}
    >
      {isAi ? <TlinAiAvatar size={compact ? "sm" : "md"} /> : <ContactAvatar flow={flow} size={compact ? "sm" : "md"} />}
      <div className={`max-w-[82%] px-3 py-2 font-semibold leading-[1.35] shadow-sm ${compact ? "text-[8px] md:text-[9px]" : "text-[9px] md:text-[11px]"} ${isAi ? "rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-[#0c0d0d]" : "rounded-2xl rounded-tl-sm border border-zinc-200 bg-white text-zinc-700"}`}>
        {message.text}
      </div>
    </motion.div>
  );
}

function ConversationPanel({ flow, step, compact }: { flow: Flow; step: number; compact: boolean }) {
  const visibleCount = step === 0 ? 1 : step === 1 ? 2 : 4;
  const visibleMessages = compact ? flow.messages.slice(-2) : flow.messages.slice(0, visibleCount);
  return (
    <motion.div layout className="flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-zinc-200/80 bg-white shadow-[0_18px_50px_rgba(12,13,13,0.07)]" transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}>
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 bg-white px-3 py-2.5 md:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <ContactAvatar flow={flow} />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-black text-[#0c0d0d] md:text-[11px]">{flow.contact.name}</p>
            <p className="flex items-center gap-1 text-[7px] font-bold text-[#25a957] md:text-[8px]"><span className="size-1.5 rounded-full bg-[#25D366]" />{flow.contact.status}</p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-[#25D366]/20 bg-[#25D366]/10 px-2 py-1 text-[7px] font-black text-[#178c44] md:text-[8px]"><MessageCircle className="size-2.5 fill-current" />WhatsApp</span>
      </div>

      <div className={`relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden bg-[#f7f7fb] ${compact ? "gap-1.5 p-2" : "gap-2.5 p-3 md:p-4"}`}>
        <div className="pointer-events-none absolute -right-8 top-3 size-24 rounded-full bg-[#38E3FF]/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 bottom-3 size-24 rounded-full bg-[#B597FF]/10 blur-2xl" />
        <AnimatePresence initial={false} mode="popLayout">
          {visibleMessages.map((message) => <BrandedMessage key={`${message.from}-${message.text}`} flow={flow} message={message} compact={compact} />)}
        </AnimatePresence>
        {!compact && step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-row-reverse items-center gap-2">
            <TlinAiAvatar /><span className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#B597FF] to-[#38E3FF] px-3 py-2 shadow-sm"><TypingDots /></span>
          </motion.div>
        )}
        {!compact && step >= 2 && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-1.5 pt-1 text-[8px] font-bold text-[#7254c8]"><Sparkles className="size-3" />{flow.identifyingLabel}</motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ContextExtraction({ flow }: { flow: Flow }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="absolute inset-x-3 bottom-3 z-20 overflow-hidden rounded-2xl border border-[#B597FF]/25 bg-white/95 p-[1px] shadow-[0_18px_45px_rgba(104,79,165,0.2)] backdrop-blur md:inset-x-4 md:bottom-4">
      <div className="absolute inset-[-80%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_35%,#B597FF_45%,#38E3FF_55%,transparent_65%_100%)] opacity-40" />
      <div className="relative grid grid-cols-2 gap-1.5 rounded-[15px] bg-white p-2.5">
        <div className="col-span-2 mb-0.5 flex items-center gap-1.5 text-[7px] font-black uppercase tracking-wide text-[#7254c8]"><TlinAiAvatar size="sm" />{flow.identifyingLabel}</div>
        {flow.fields.map((field, index) => (
          <motion.div key={field.label} initial={{ opacity: 0, scale: 0.9, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.08 * index }} className={`min-w-0 rounded-xl px-2.5 py-1.5 ${index % 2 === 0 ? "bg-[#F0EBFF]" : "bg-[#E8FAFC]"}`}>
            <p className="truncate text-[6px] font-black uppercase tracking-wide text-zinc-400">{field.label}</p><p className="truncate text-[8px] font-black text-[#0c0d0d] md:text-[9px]">{field.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const stageStyles = ["border-[#38E3FF]/35 bg-[#E8FAFC] text-[#15808d]", "border-[#B597FF]/35 bg-[#F0EBFF] text-[#7254c8]", "border-[#25D366]/30 bg-[#eafaf0] text-[#178c44]"] as const;

function CrmLeadCard({ flow, stageIndex }: { flow: Flow; stageIndex: number }) {
  const field = flow.fields[Math.min(stageIndex + 1, 3)];
  return (
    <motion.div layoutId="segment-crm-lead" className="rounded-xl border border-white/90 bg-white p-2 shadow-[0_8px_24px_rgba(12,13,13,0.09)] md:p-2.5" transition={{ layout: { type: "spring", stiffness: 175, damping: 22, mass: 0.9 } }}>
      <div className="flex items-center gap-1.5"><ContactAvatar flow={flow} size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-[7px] font-black text-[#0c0d0d] md:text-[8px]">{flow.contact.name}</p><p className="truncate text-[5.5px] font-bold text-zinc-400 md:text-[6.5px]">{flow.contactLabel}</p></div><span className="size-1.5 shrink-0 rounded-full bg-[#25D366]" /></div>
      <div className="mt-2 rounded-lg bg-[#f7f7fb] px-2 py-1.5"><p className="truncate text-[5.5px] font-black uppercase tracking-wide text-zinc-400">{field.label}</p><p className="mt-0.5 line-clamp-2 text-[6.5px] font-bold leading-snug text-zinc-600 md:text-[7.5px]">{field.value}</p></div>
    </motion.div>
  );
}

function TlinSidebar() {
  return (
    <div className="hidden w-9 shrink-0 flex-col items-center border-r border-zinc-100 bg-white py-3 md:flex">
      <Image src="/favicon.svg" alt="" width={20} height={20} className="mb-5 size-5 object-contain" />
      <div className="flex flex-col items-center gap-3.5 text-zinc-300"><Inbox className="size-3" /><Users className="size-3" /><span className="grid size-6 place-items-center rounded-lg bg-gradient-to-br from-[#B597FF]/25 to-[#38E3FF]/25 text-[#7254c8] ring-1 ring-[#B597FF]/20"><Funnel className="size-3" /></span><BarChart3 className="size-3" /></div>
    </div>
  );
}

function MiniCrmBoard({ flow, step }: { flow: Flow; step: number }) {
  const stageIndex = step >= FINAL_STEP ? 2 : step >= 5 ? 1 : 0;
  const activityIndex = Math.min(Math.max(step - 3, 0), flow.activities.length - 1);
  return (
    <motion.div layout initial={{ opacity: 0, x: 26, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="relative flex h-full min-h-0 overflow-hidden rounded-[22px] border border-zinc-200/80 bg-white shadow-[0_18px_50px_rgba(12,13,13,0.08)]">
      <TlinSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 bg-white px-3 py-2 md:px-3.5 md:py-2.5">
          <div className="flex items-center gap-2"><span className="md:hidden"><Image src="/favicon.svg" alt="" width={16} height={16} className="size-4" /></span><div><p className="text-[8px] font-black text-[#0c0d0d] md:text-[10px]">{flow.crmLabel}</p><p className="text-[5.5px] font-bold text-zinc-400 md:text-[6.5px]">Funis · WhatsApp</p></div></div>
          <div className="flex items-center gap-1.5"><span className="hidden items-center gap-1 rounded-lg border border-zinc-100 bg-[#f7f7fb] px-2 py-1 text-[6px] font-bold text-zinc-500 sm:flex">{flow.contactLabel}<ChevronDown className="size-2.5" /></span><AnimatePresence mode="wait"><motion.span key={stageIndex} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F0EBFF] to-[#E8FAFC] px-2 py-1 text-[6px] font-black text-[#7254c8] md:text-[7px]">{stageIndex === 2 ? <CheckCircle2 className="size-2.5" /> : <Zap className="size-2.5" />}{stageIndex === 2 ? flow.updatedLabel : flow.updatingLabel}</motion.span></AnimatePresence></div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5 bg-[#fafafa] p-2 pb-10 md:gap-2 md:p-3 md:pb-11">
          {flow.stages.map((stage, index) => (
            <div key={stage} className={`min-w-0 rounded-xl border p-1.5 transition-colors md:p-2 ${stageStyles[index]}`}><div className="mb-1.5 flex items-start justify-between gap-1"><p className="line-clamp-2 text-[5.5px] font-black leading-tight md:text-[7px]">{stage}</p><span className="rounded-full bg-white/75 px-1 py-0.5 text-[5.5px] font-black">{index === stageIndex ? 1 : 0}</span></div>{index === stageIndex && <CrmLeadCard flow={flow} stageIndex={stageIndex} />}</div>
          ))}
        </div>

        <AnimatePresence mode="wait"><motion.div key={flow.activities[activityIndex]} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5 }} className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2 rounded-full border border-[#B597FF]/20 bg-white/95 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(104,79,165,0.12)] backdrop-blur md:bottom-3 md:left-14 md:right-4"><span className="grid size-4 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#B597FF] to-[#38E3FF] text-[#0c0d0d]"><Check className="size-2.5" strokeWidth={3} /></span><span className="min-w-0 flex-1 truncate text-[6.5px] font-black text-zinc-600 md:text-[7.5px]">{flow.activities[activityIndex]}</span><TlinAiAvatar size="sm" /></motion.div></AnimatePresence>
      </div>
    </motion.div>
  );
}

function OutcomeCard({ flow }: { flow: Flow }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ type: "spring", stiffness: 150, damping: 21 }} className="absolute inset-x-3 bottom-3 z-30 overflow-hidden rounded-[20px] bg-[#0c0d0d] p-[1px] shadow-[0_22px_50px_rgba(12,13,13,0.28)] md:inset-x-4 md:bottom-4">
      <div className="absolute inset-[-80%] animate-[spin_7s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_35%,#B597FF_45%,#38E3FF_55%,transparent_65%_100%)]" />
      <div className="relative rounded-[19px] bg-[#0c0d0d] px-3 py-2.5 text-white md:px-4 md:py-3">
        <div className="flex items-center gap-2.5"><Image src="/icons/Check.webp" alt="" width={38} height={38} className="size-9 shrink-0 object-contain md:size-10" /><ContactAvatar flow={flow} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><div className="min-w-0"><p className="truncate text-[7px] font-bold text-zinc-400">{flow.contact.name}</p><p className="truncate text-[10px] font-black md:text-[11px]">{flow.outcome.title}</p></div><p className="shrink-0 rounded-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF] px-2 py-1 text-[7px] font-black text-[#0c0d0d] md:text-[8px]">{flow.outcome.detail}</p></div><p className="mt-0.5 truncate text-[6.5px] font-bold text-[#38E3FF] md:text-[7.5px]">{flow.outcome.crmStatus}</p></div></div>
        <div className="mt-2 flex items-center justify-center gap-1.5 border-t border-white/10 pt-2"><Sparkles className="size-2.5 text-[#B597FF]" /><p className="text-center text-[6.5px] font-semibold leading-snug text-zinc-300 md:text-[7.5px]">{flow.outcome.supportingText}</p></div>
      </div>
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
  const showCrm = effectiveStep >= 3;
  const playAnimation = () => { setStep(0); setMotionOverride(true); };

  return (
    <div data-testid="segment-hero-flow" className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/80 bg-white/50 p-2.5 shadow-[0_28px_80px_rgba(83,66,123,0.14)] backdrop-blur-sm md:p-3.5">
      <p className="sr-only">{flow.summary}</p>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(181,151,255,0.22),transparent_38%),radial-gradient(circle_at_90%_85%,rgba(56,227,255,0.2),transparent_42%)]" />
      {hasMounted && shouldReduceMotion && !motionOverride && <button type="button" onClick={playAnimation} className="absolute right-4 top-4 z-50 flex items-center gap-1.5 rounded-full bg-[#0c0d0d] px-3 py-2 text-[9px] font-bold text-white shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B597FF] focus-visible:ring-offset-2"><Play className="size-3 fill-current" />{flow.playLabel}</button>}

      <LayoutGroup>
        <div aria-hidden="true" className={`relative z-10 grid h-full min-h-0 gap-2.5 ${showCrm ? "grid-rows-[108px_minmax(0,1fr)] md:grid-cols-[0.3fr_0.7fr] md:grid-rows-1" : "grid-cols-1"}`}><div className="relative min-h-0"><ConversationPanel flow={flow} step={effectiveStep} compact={showCrm} />{effectiveStep === 3 && <ContextExtraction flow={flow} />}</div>{showCrm && <MiniCrmBoard flow={flow} step={effectiveStep} />}</div>
        <AnimatePresence>{effectiveStep === FINAL_STEP && <OutcomeCard flow={flow} />}</AnimatePresence>
      </LayoutGroup>

      <div aria-hidden="true" className="absolute inset-x-5 bottom-1 z-40 flex items-center justify-center gap-1">{STEP_DURATIONS.map((_, index) => <span key={index} className={`h-0.5 rounded-full transition-all duration-300 ${index === effectiveStep ? "w-5 bg-gradient-to-r from-[#B597FF] to-[#38E3FF]" : "w-1.5 bg-zinc-300/80"}`} />)}</div>
    </div>
  );
}
