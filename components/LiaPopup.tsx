"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { trackConversion, trackFunnelEvent } from "@/lib/utm";
import { CountryFlag } from "@/components/CountryFlag";
import { AvailabilityCalendar } from "@/components/lead-qualification/AvailabilityCalendar";
import { COUNTRIES, type DemoDay, type DemoSlot } from "@/components/lead-qualification/constants";
import { FloatingPersonaTrigger } from "@/components/FloatingPersonaTrigger";
import {
  getPendingReplyCount,
  useEngagementFollowUp,
  type EngagementFollowUp,
} from "@/components/lia-popup/useEngagementFollowUp";

const QUALIFICATION_START_TYPING_MS = 520;
const REASONING_MIN_DURATION_MS = 1700;
const REASONING_MAX_DURATION_MS = 2300;

export function LiaPopup() {
  const { t, lang } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, type: 'text' | 'handoff'}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [qualificationStep, setQualificationStep] = useState(0);
  const [leadName, setLeadName] = useState("");
  const [countryCode, setCountryCode] = useState("+55");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [availabilityDays, setAvailabilityDays] = useState<DemoDay[] | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DemoDay | null>(null);
  const [scheduleStage, setScheduleStage] = useState<"day" | "slot" | "complete">("day");
  // Mostrado enquanto espera a resposta real da API, antes do "digitando"
  // bloco a bloco que ja existia -- em vez de pular direto pros pontinhos.
  const [reasoningLabel, setReasoningLabel] = useState<string | null>(null);
  const [status, setStatus] = useState("online");
  const [placeholder, setPlaceholder] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatSessionRef = useRef(0);
  const reasoningIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const scrollTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleEngagementTyping = useCallback((typing: boolean) => {
    setIsTyping(typing);
  }, []);

  const handleEngagementMessage = useCallback((message: string, source: EngagementFollowUp["source"]) => {
    if (source === "page_complete") {
      setQualificationStep((step) => step === 0 ? 1 : step);
    }
    setMessages((previous) => [...previous, { role: "bot", text: message, type: "text" }]);
  }, []);

  const pendingReplyCount = getPendingReplyCount(messages);
  const {
    externalFollowUp,
    clearExternalFollowUp,
  } = useEngagementFollowUp({
    pathname,
    isOpen,
    isBusy: isTyping || Boolean(reasoningLabel) || availabilityLoading,
    inputValue,
    formActive: qualificationStep > 0 && scheduleStage !== "complete",
    qualificationStep,
    messages,
    copy: {
      formIdleMessage: t.liaPopup.formIdleFollowUp,
      formIdleHighlights: t.liaPopup.formIdleHighlights,
      pageCompleteMessage: t.liaPopup.pageCompleteFollowUp,
      pageCompleteHighlights: t.liaPopup.pageCompleteHighlights,
      notificationTitle: t.liaPopup.notificationTitle,
    },
    onTypingChange: handleEngagementTyping,
    onDeliverMessage: handleEngagementMessage,
  });

  const clearReasoningCycle = () => {
    if (reasoningIntervalRef.current) {
      clearInterval(reasoningIntervalRef.current);
      reasoningIntervalRef.current = null;
    }
  };

  const fullPlaceholder = t.liaPopup.fullPlaceholder;
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const clearScrollTimers = () => {
    scrollTimeoutsRef.current.forEach(clearTimeout);
    scrollTimeoutsRef.current = [];
    if (scrollFrameRef.current !== null) {
      cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = null;
    }
  };

  const scheduleScrollToBottom = () => {
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      scrollToBottom();
    });
  };

  // iOS dispara "resize" do visualViewport varias vezes enquanto o teclado
  // abre/fecha/anima -- cancela timers/rAF pendentes antes de agendar novos
  // pra nao empilhar scrolls concorrentes competindo durante a animacao.
  const keepInputVisible = () => {
    clearScrollTimers();
    scrollTimeoutsRef.current = [
      setTimeout(scheduleScrollToBottom, 80),
      setTimeout(scheduleScrollToBottom, 280),
    ];
  };

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const isCompact = messages.length > 0;
    const minHeight = qualificationStep === 2 ? 40 : isCompact ? 32 : 60;
    const maxHeight = isCompact ? 88 : 120;

    textarea.style.height = "auto";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useLayoutEffect(() => {
    resizeTextarea();
  }, [inputValue, messages.length, isOpen, qualificationStep]);

  useEffect(() => {
    if (isOpen) {
      setPlaceholder("");
      let i = 0;
      const interval = setInterval(() => {
        setPlaceholder(fullPlaceholder.slice(0, i));
        i++;
        if (i > fullPlaceholder.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }
  }, [isOpen, fullPlaceholder]);

  useEffect(() => {
    setStatus(isTyping ? t.liaPopup.typing : t.liaPopup.online);
  }, [t, isTyping]);

  useEffect(() => {
    // Listen for custom open event
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-lia-chat", handleOpen);
    
    return () => {
      window.removeEventListener("open-lia-chat", handleOpen);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updateViewportVars = () => {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const offsetTop = viewport?.offsetTop ?? 0;

      document.documentElement.style.setProperty("--lia-popup-height", `${height}px`);
      document.documentElement.style.setProperty("--lia-popup-offset-top", `${offsetTop}px`);
      keepInputVisible();
    };

    updateViewportVars();

    window.visualViewport?.addEventListener("resize", updateViewportVars);
    window.visualViewport?.addEventListener("scroll", updateViewportVars);
    window.addEventListener("resize", updateViewportVars);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateViewportVars);
      window.visualViewport?.removeEventListener("scroll", updateViewportVars);
      window.removeEventListener("resize", updateViewportVars);
      document.documentElement.style.removeProperty("--lia-popup-height");
      document.documentElement.style.removeProperty("--lia-popup-offset-top");
      clearScrollTimers();
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const openWhatsApp = () => {
    trackConversion("click_whatsapp", { cta_source: "lia_popup" });
    window.open("https://wa.me/5511916248604?text=Olá! Vim pelo site da Tlin e gostaria de falar com a equipe.", "_blank");
  };

  const resetChat = () => {
    chatSessionRef.current += 1;
    clearReasoningCycle();
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
    setQualificationStep(0);
    setLeadName("");
    setCountryCode("+55");
    setIsCountryDropdownOpen(false);
    setAvailabilityDays(null);
    setAvailabilityLoading(false);
    setAvailabilityError(null);
    setSelectedDay(null);
    setScheduleStage("day");
    setReasoningLabel(null);
    setStatus(t.liaPopup.online);
    trackFunnelEvent("lia_chat_reset", { cta_source: "lia_popup" });
  };

  const beginQualification = () => {
    setQualificationStep(1);
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages([{ role: "bot", text: t.leadQualify.initialMsg, type: "text" }]);
      setIsTyping(false);
      setStatus(t.liaPopup.online);
    }, QUALIFICATION_START_TYPING_MS);
    trackFunnelEvent("lia_chat_started", { cta_source: "igor_chat" });
  };

  const inputPlaceholder = [
    "",
    "Digite seu nome aqui",
    "Digite seu WhatsApp com DDD",
    "Digite sim ou não",
    "Conte seu volume mensal de leads",
    "Digite o tamanho da sua equipe",
    "Digite seu melhor e-mail",
  ][qualificationStep] || "Digite sua resposta";

  const getHumanTypingDelay = (text: string) => {
    const characters = text.replace(/[\[\]]/g, "").length;
    return Math.min(Math.max(characters * 22, 720), 2400);
  };

  const getReasoningDelay = (answer: string) => Math.min(
    REASONING_MIN_DURATION_MS + answer.trim().length * 12,
    REASONING_MAX_DURATION_MS,
  );

  const formatBrazilianPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (countryCode !== "+55") return value.replace(/\D/g, "").slice(0, 15);
    if (digits.length > 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    if (digits.length > 6) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    if (digits.length > 2) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return digits.length ? `(${digits}` : "";
  };

  const currentOptions = qualificationStep === 3
    ? [t.leadQualify.yesCorrect, t.leadQualify.noCorrect]
    : qualificationStep === 4
      ? t.leadQualify.volumeOptions
      : qualificationStep === 5
        ? t.leadQualify.teamOptions
        : null;
  const latestBotMessageIndex = messages.reduce(
    (latestIndex, message, index) => message.role === "bot" ? index : latestIndex,
    -1,
  );

  const isInputValid = () => {
    if (qualificationStep === 1) return inputValue.trim().length >= 2;
    if (qualificationStep === 2) {
      const digits = inputValue.replace(/\D/g, "");
      return countryCode === "+55" ? digits.length >= 10 && digits.length <= 11 : digits.length >= 8;
    }
    if (qualificationStep === 6) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.trim());
    return inputValue.trim().length > 0;
  };

  const handleInputChange = (value: string) => {
    if (qualificationStep === 2) return setInputValue(formatBrazilianPhone(value));
    if (qualificationStep === 1) return setInputValue(value.slice(0, 80));
    if (qualificationStep === 6) return setInputValue(value.slice(0, 160));
    setInputValue(value);
  };

  const handleBackInChat = () => {
    if (qualificationStep <= 1 || isTyping || reasoningLabel) return;
    const previousStep = qualificationStep - 1;
    setMessages((previous) => previous.slice(0, -2));
    setQualificationStep(previousStep);
    setInputValue("");
    if (previousStep === 1) setLeadName("");
  };

  const handleSendMessage = async (answer?: string) => {
    const userMsg = (answer ?? inputValue).trim();
    if (!userMsg) return;
    trackFunnelEvent("lia_message_sent", {
      message_length: userMsg.length,
      previous_messages: messages.length,
    });
    const displayUserMessage = qualificationStep === 2 ? `${countryCode} ${userMsg}` : userMsg;
    setMessages(prev => [...prev, { role: 'user', text: displayUserMessage, type: 'text' }]);
    setInputValue("");
    clearReasoningCycle();
    const name = qualificationStep === 1 ? userMsg : leadName;
    const thoughts = [
      t.leadQualify.thinking2,
      t.leadQualify.thinking3,
      t.leadQualify.thinking4,
      t.leadQualify.thinking5,
      t.leadQualify.thinking6,
      t.leadQualify.thinking7,
    ];
    const reasoningMessage = thoughts[Math.max(0, qualificationStep - 1)] || t.leadQualify.thinkingGeneric;
    setReasoningLabel(
      reasoningMessage
        .replace("{name}", name)
        .replace("{answer}", userMsg),
    );
    setIsTyping(false);
    setStatus(t.liaPopup.online);

    if (qualificationStep === 1) setLeadName(userMsg);
    const isCorrectingPhone = qualificationStep === 3 && userMsg === t.leadQualify.noCorrect;
    const nextMessage = isCorrectingPhone ? t.leadQualify.step2.replace("{name}", name) : [
      "",
      t.leadQualify.step2.replace("{name}", name),
      t.leadQualify.step3.replace("{name}", name).replace("{phone}", `${countryCode} ${userMsg}`),
      t.leadQualify.step4.replace("{name}", name),
      t.leadQualify.step5.replace("{name}", name),
      t.leadQualify.step6.replace("{name}", name),
      t.leadQualify.step7.replace("{name}", name),
    ][qualificationStep] || "Perfeito. Vou preparar os próximos passos para sua demonstração";

    window.setTimeout(() => {
      setReasoningLabel(null);
      setIsTyping(true);
      window.setTimeout(() => {
        setMessages((previous) => [...previous, { role: "bot", text: nextMessage, type: "text" }]);
        setIsTyping(false);
        setStatus(t.liaPopup.online);
        setQualificationStep((step) => isCorrectingPhone ? 2 : Math.min(step + 1, 7));
      }, getHumanTypingDelay(nextMessage));
    }, getReasoningDelay(userMsg));
  };

  useEffect(() => {
    if (qualificationStep !== 7 || availabilityDays || availabilityLoading) return;

    setAvailabilityLoading(true);
    setAvailabilityError(null);
    fetch(`/api/public/demo/availability?diasAFrente=21&lang=${lang}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data?.success) throw new Error(data?.error || "Falha ao consultar horários");
        setAvailabilityDays(data.days || []);
      })
      .catch(() => setAvailabilityError(t.leadQualify.noSlotsAvailable))
      .finally(() => setAvailabilityLoading(false));
  }, [availabilityDays, availabilityLoading, lang, qualificationStep, t.leadQualify.noSlotsAvailable]);

  const handleSelectDay = (day: DemoDay) => {
    if (isTyping || reasoningLabel) return;
    setSelectedDay(day);
    setMessages((previous) => [...previous, { role: "user", text: day.label, type: "text" }]);
    setReasoningLabel(t.leadQualify.thinking8.replace("{answer}", day.label));
    window.setTimeout(() => {
      setReasoningLabel(null);
      setIsTyping(true);
      const message = t.leadQualify.step8.replace("{name}", leadName).replace("{day}", day.label);
      window.setTimeout(() => {
        setMessages((previous) => [...previous, { role: "bot", text: message, type: "text" }]);
        setScheduleStage("slot");
        setIsTyping(false);
      }, getHumanTypingDelay(message));
    }, getReasoningDelay(day.label));
  };

  const handleSelectSlot = (slot: DemoSlot) => {
    if (isTyping || reasoningLabel) return;
    setMessages((previous) => [...previous, { role: "user", text: slot.when, type: "text" }]);
    setReasoningLabel(t.leadQualify.thinking9.replace("{answer}", slot.when));
    window.setTimeout(() => {
      setReasoningLabel(null);
      setIsTyping(true);
      const message = `Perfeito, ${leadName}. Recebi sua preferência para ${slot.when}. Vou confirmar sua demonstração com a equipe`;
      window.setTimeout(() => {
        setMessages((previous) => [...previous, { role: "bot", text: message, type: "text" }]);
        setScheduleStage("complete");
        setIsTyping(false);
      }, getHumanTypingDelay(message));
    }, getReasoningDelay(slot.when));
  };

  function WhatsAppHandoff() {
    const [countdown, setCountdown] = useState(10);
    const [isRedirected, setIsRedirected] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (countdown > 0 && !isRedirected && !isCancelled) {
        timerRef.current = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      } else if (countdown === 0 && !isRedirected && !isCancelled) {
        handleRedirect();
      }
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [countdown, isRedirected, isCancelled]);

    const handleRedirect = () => {
      if (isRedirected || isCancelled) return;
      setIsRedirected(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      openWhatsApp();
    };

    const handleCancel = () => {
      setIsCancelled(true);
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex flex-col items-center gap-3 w-full"
      >
        <div className="flex flex-col items-center gap-1 text-base font-bold text-green-400">
          {t.liaPopup.handoffForwarding}
          {!isCancelled && !isRedirected && (
            <span className="text-[12px] font-medium opacity-70">{t.liaPopup.handoffRedirect} {countdown}s</span>
          )}
        </div>

        {!isCancelled ? (
          <div className="w-full flex flex-col items-center gap-2">
            <button
              onClick={handleRedirect}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-base font-bold text-white transition-all hover:bg-green-600"
            >
              {isRedirected ? t.liaPopup.handoffOpening : t.liaPopup.handoffOpenNow}
            </button>
            <button
              onClick={handleCancel}
              className="text-[12px] font-bold text-green-400/60 underline transition-colors hover:text-green-400"
            >
              {t.liaPopup.handoffCancel}
            </button>
          </div>
        ) : (
          <div className="py-2 text-base font-bold text-green-400">
            {t.liaPopup.handoffCancelled}
          </div>
        )}

        <p className="text-center text-[12px] font-medium text-green-400/70">
          {!isCancelled ? t.liaPopup.handoffAutoRedirect : t.liaPopup.handoffChangeMind}
        </p>
      </motion.div>
    );
  }

  const FormattedMessage = ({ text }: { text: string }) => {
    if (!text) return null;
    
    // Split by strategic tags [strategic:...] and bold **...**
    const parts = text.split(/(\[strategic:.*?\]|\[.*?\]|\*\*.*?\*\*)/g);
    
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('[strategic:') && part.endsWith(']')) {
            const content = part.slice(11, -1);
            return (
              <span key={i} className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent font-black">
                {content}
              </span>
            );
          }
          if (part.startsWith('[') && part.endsWith(']')) {
            return <span key={i} className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text font-black text-transparent">{part.slice(1, -1)}</span>;
          }
          if (part.startsWith('**') && part.endsWith('**')) {
            const content = part.slice(2, -2);
            return <strong key={i} className="font-bold text-inherit">{content}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed inset-0 z-[150] h-[var(--lia-popup-height,100dvh)] overflow-hidden p-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[420px] sm:max-h-[calc(var(--lia-popup-height,100dvh)-2rem)] sm:rounded-[2.5rem] sm:p-[2px] sm:transition-[height] sm:duration-500 sm:ease-out ${qualificationStep === 0 ? "sm:h-[min(370px,calc(var(--lia-popup-height,100dvh)-2rem))]" : "sm:h-[min(560px,calc(var(--lia-popup-height,100dvh)-2rem))]"}`}
          >
            {/* Animated Gradient Border Layer */}
            <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite] pointer-events-none"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 165deg, #B597FF 180deg, #38E3FF 195deg, transparent 210deg 360deg)` }}
            />
            
            <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0c0d0d] sm:rounded-[2.4rem]">
              {/* Top Bar */}
              <div className="flex items-center justify-between p-3.5 bg-transparent shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                    <img
                      src="/team/igor-avatar.avif"
                      alt="Igor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-0.5 text-[19px] font-bold leading-none tracking-tight text-white">Igor</span>
                    <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-[12px] font-bold text-transparent transition-all duration-300">
                      {status.toLowerCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-all"
                    aria-label={t.liaPopup.close}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div ref={scrollRef} data-lenis-prevent onWheelCapture={(event) => event.stopPropagation()} className="flex-1 overflow-y-auto px-4 sm:px-6 flex flex-col custom-scrollbar bg-transparent min-h-0 overscroll-contain z-10">
                
                {messages.length === 0 && !isTyping ? (
                  <div className="flex flex-1 flex-col gap-3 pt-2 pb-6">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                        <img src="/team/igor-avatar.avif" alt="Igor" className="h-full w-full object-cover" />
                      </div>
                      <div className="rounded-2xl rounded-tl-none border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] font-semibold text-zinc-100">
                        Olá, tudo bem?
                      </div>
                    </div>

                    <div className="ml-10 max-w-[82%] rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.06] p-4">
                      <p className="text-[15px] font-semibold leading-relaxed text-zinc-100">Vamos entender como a Tlin pode organizar seu comercial e preparar uma demonstração para a sua operação?</p>
                      <button
                        type="button"
                        onClick={beginQualification}
                        className="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] px-4 py-2.5 text-[13px] font-bold text-[#0c0d0d] transition-transform hover:scale-[1.02] active:scale-95"
                      >
                        Sim, começar agora
                      </button>
                      <p className="mt-3 text-[11px] font-medium leading-relaxed text-zinc-500">Ao continuar, você aceita nossa <Link href="/legal?tab=privacidade" onNavigate={() => setIsOpen(false)} className="text-[#64E5FA] hover:underline">Política de Privacidade</Link></p>
                    </div>
                  </div>

                ) : (
                  <div className="flex flex-col gap-3 pb-8 pt-4">
                    {messages.map((msg, i) => {
                      const isFirstInBlock = i === 0 || messages[i-1].role !== msg.role;
                      return (
                        <Fragment key={i}>
                          {i === latestBotMessageIndex && qualificationStep > 1 && !isTyping && !reasoningLabel && (
                            <button
                              type="button"
                              onClick={handleBackInChat}
                              className="ml-10 inline-flex w-fit items-center gap-1.5 text-[12px] font-semibold text-zinc-500 transition-colors hover:text-[#B597FF]"
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
                              Voltar
                            </button>
                          )}
                          <div className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} ${!isFirstInBlock ? '-mt-1.5' : ''}`}>
                          {msg.role === 'bot' && msg.type !== 'handoff' && (
                            <div className="w-8 h-8 shrink-0">
                              {isFirstInBlock && (
                                <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden mt-1">
                                  <img
                                    src="/team/igor-avatar.avif"
                                    alt="Igor"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {msg.type === 'handoff' ? (
                            <WhatsAppHandoff />
                          ) : (
                            <div className={`max-w-[82%] p-3.5 rounded-2xl text-[15px] sm:text-[16px] font-semibold leading-relaxed transition-all ${
                              msg.role === 'user'
                                ? `bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 ${isFirstInBlock ? 'rounded-tr-none' : ''}`
                                : `bg-white/[0.06] text-zinc-100 border border-white/10 ${isFirstInBlock ? 'rounded-tl-none' : ''}`
                            }`}>
                              <FormattedMessage text={msg.text} />
                            </div>
                          )}
                          </div>
                        </Fragment>
                      );
                    })}
                    {reasoningLabel && (
                      <div className="ml-10 pt-1">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={reasoningLabel}
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            transition={{ duration: 0.2 }}
                            className="text-[12px] font-medium text-zinc-500"
                          >
                            {reasoningLabel}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    )}

                    {isTyping && (
                      <div className="flex items-start gap-2">
                         <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden shrink-0 mt-1">
                           <img
                             src="/team/igor-avatar.avif"
                             alt="Igor"
                             className="w-full h-full object-cover"
                           />
                         </div>
                        <div className="bg-white/[0.06] px-3 py-2.5 rounded-xl rounded-tl-none border border-white/10 flex gap-1 items-center">
                          <span className="w-1 h-1 bg-[#B597FF] rounded-full animate-bounce" />
                          <span className="w-1 h-1 bg-[#B597FF] rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-1 bg-[#B597FF] rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                    {currentOptions && !reasoningLabel && !isTyping && (
                      <div className="ml-10 flex max-w-[82%] flex-col gap-2 pt-1">
                        {currentOptions.filter(Boolean).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleSendMessage(option)}
                            className={`rounded-2xl px-4 py-3 text-left text-[14px] font-bold transition-all active:scale-[0.98] ${option === t.leadQualify.yesCorrect || option === t.leadQualify.confirm ? "bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-[#0c0d0d] hover:brightness-105" : "border border-white/10 bg-white/[0.05] text-zinc-200 hover:border-[#B597FF]/50 hover:bg-white/[0.09]"}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    {qualificationStep === 7 && scheduleStage === "day" && !isTyping && !reasoningLabel && (
                      <div className="ml-10 mt-1 max-w-[82%] rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                        {availabilityLoading && <p className="py-3 text-center text-[13px] font-medium text-zinc-500">Carregando horários</p>}
                        {availabilityError && <p className="py-3 text-center text-[13px] font-medium text-zinc-500">{availabilityError}</p>}
                        {!availabilityLoading && !availabilityError && availabilityDays && <AvailabilityCalendar days={availabilityDays} onSelectDay={handleSelectDay} lang={lang} isLight={false} />}
                      </div>
                    )}
                    {qualificationStep === 7 && scheduleStage === "slot" && selectedDay && !isTyping && !reasoningLabel && (
                      <div className="ml-10 mt-1 grid max-w-[82%] grid-cols-2 gap-2">
                        {selectedDay.slots.map((slot) => <button key={slot.startsAt} type="button" onClick={() => handleSelectSlot(slot)} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-[14px] font-bold text-zinc-200 transition-colors hover:border-[#B597FF]/50 hover:bg-white/[0.09]">{slot.when.split(" às ")[1] || slot.when}</button>)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {qualificationStep > 0 && qualificationStep < 7 && !isTyping && !reasoningLabel && !currentOptions && <div className="px-4 sm:px-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-5 bg-transparent shrink-0 z-10 mt-auto">
                 <div className={`border border-white/10 bg-white/5 flex focus-within:border-[#B597FF]/60 focus-within:ring-4 focus-within:ring-[#B597FF]/10 transition-all duration-300 ${
                   messages.length > 0 ? `flex-row ${qualificationStep === 2 ? 'items-center gap-2 rounded-[1.25rem] p-2' : 'items-end gap-1.5 rounded-[1.25rem] p-2.5'}` : 'flex-col rounded-[1.5rem] p-3 py-4'
                 }`}>
                   {qualificationStep === 2 && <div className="relative shrink-0 self-stretch">
                     <button
                       type="button"
                       onClick={() => setIsCountryDropdownOpen((open) => !open)}
                       className="flex h-full min-h-10 items-center gap-1.5 rounded-xl bg-white/[0.04] px-2.5 text-[14px] font-bold text-zinc-200 transition-colors hover:bg-white/[0.08]"
                       aria-label="Selecionar DDI"
                       aria-expanded={isCountryDropdownOpen}
                     >
                       <CountryFlag country={COUNTRIES.find((country) => country.code === countryCode)?.flag || "br"} size={20} />
                       {countryCode}
                       <svg viewBox="0 0 24 24" className={`h-3 w-3 text-zinc-500 transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                     </button>
                     <AnimatePresence>
                       {isCountryDropdownOpen && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute bottom-full left-0 z-30 mb-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#171717] py-1 shadow-2xl">
                         {COUNTRIES.map((country) => <button key={country.code} type="button" onClick={() => { setCountryCode(country.code); setInputValue(""); setIsCountryDropdownOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                           <CountryFlag country={country.flag} size={18} />
                           <span className="flex-1">{country.name}</span>
                           <span className="text-zinc-500">{country.code}</span>
                         </button>)}
                       </motion.div>}
                     </AnimatePresence>
                   </div>}
                   {qualificationStep === 2 && <span aria-hidden="true" className="w-px shrink-0 self-stretch bg-white/10" />}
                   <textarea
                     ref={textareaRef}
                      rows={1}
                     aria-label="Mensagem para Igor"
                     value={inputValue}
                     onChange={(e) => handleInputChange(e.target.value)}
                     onFocus={keepInputVisible}
                     onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && isInputValid() && (e.preventDefault(), handleSendMessage())}
                     inputMode={qualificationStep === 2 ? "tel" : qualificationStep === 6 ? "email" : "text"}
                     maxLength={qualificationStep === 2 ? 15 : qualificationStep === 6 ? 160 : 80}
                     placeholder={inputPlaceholder}
                     className={`min-w-0 w-full resize-none border-none bg-transparent px-2 font-semibold text-zinc-100 outline-none placeholder-zinc-500 ${
                       qualificationStep === 2 ? 'h-10 min-h-10 py-2 leading-6 text-[16px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : messages.length > 0 ? 'min-h-9 py-1.5 text-[16px] leading-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : 'min-h-[60px] text-[16px] leading-6'
                     }`}
                   />
                   <div className={`flex justify-end ${messages.length > 0 ? 'shrink-0' : 'mt-1'}`}>
                     <button
                       aria-label="Enviar mensagem"
                       onClick={() => handleSendMessage()}
                       disabled={!isInputValid()}
                       className={`${qualificationStep === 2 ? 'h-10 w-10' : messages.length > 0 ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center transition-all ${
                          isInputValid() ? 'bg-white text-zinc-950' : 'bg-white/10 text-zinc-500'
                       }`}
                     >
                        <svg width={qualificationStep === 2 ? 20 : messages.length > 0 ? 17 : 20} height={qualificationStep === 2 ? 20 : messages.length > 0 ? 17 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                     </button>
                   </div>
                 </div>
              </div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Igor trigger: visible from the first fold, reveals the persona after one viewport. */}
      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-[200] flex flex-col items-center">
        <FloatingPersonaTrigger
          config={{
            attendant: { name: "Igor", avatarUrl: "/team/igor-avatar.avif" },
            followUpMessage: t.liaPopup.followUpPrompt,
            followUpHighlights: t.liaPopup.followUpHighlights,
            revealAfterViewports: 1,
            typingDurationMs: 700,
            bubbleAutoDismissMs: 11000,
          }}
          label={t.liaPopup.talkToLia}
          closeLabel={t.liaPopup.close}
          isOpen={isOpen}
          pendingReplyCount={pendingReplyCount}
          externalFollowUp={externalFollowUp}
          onExternalFollowUpOpen={() => {
            clearExternalFollowUp();
            setIsOpen(true);
            trackFunnelEvent("lia_followup_opened", {
              trigger: externalFollowUp?.source,
              pathname,
            });
          }}
          onToggle={() => {
            const nextOpen = !isOpen;
            setIsOpen(nextOpen);
            if (nextOpen) {
              clearExternalFollowUp();
              trackFunnelEvent("lia_chat_opened", { cta_source: "floating_lia" });
            }
          }}
        />
      </div>
    </>
  );
}
