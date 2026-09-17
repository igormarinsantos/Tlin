"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { trackConversion, trackFunnelEvent } from "@/lib/utm";

export function LiaPopup() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [canShow, setCanShow] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, type: 'text' | 'handoff'}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [qualificationStep, setQualificationStep] = useState(0);
  const [leadName, setLeadName] = useState("");
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
    const minHeight = isCompact ? 32 : 60;
    const maxHeight = isCompact ? 88 : 120;

    textarea.style.height = "auto";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useLayoutEffect(() => {
    resizeTextarea();
  }, [inputValue, messages.length, isOpen]);

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

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 400) {
      setCanShow(true);
    } else {
      setCanShow(false);
      setIsOpen(false); // Auto-close popup when scrolling back to Hero
    }
  });

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
    }, getHumanTypingDelay(t.leadQualify.initialMsg));
    trackFunnelEvent("start_lead_form", { cta_source: "igor_chat" });
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

  const formatBrazilianPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
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

  const isInputValid = () => {
    if (qualificationStep === 1) return inputValue.trim().length >= 2;
    if (qualificationStep === 2) {
      const digits = inputValue.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
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

  const handleSendMessage = async (answer?: string) => {
    const userMsg = (answer ?? inputValue).trim();
    if (!userMsg) return;
    trackFunnelEvent("lia_message_sent", {
      message_length: userMsg.length,
      previous_messages: messages.length,
    });
    setMessages(prev => [...prev, { role: 'user', text: userMsg, type: 'text' }]);
    setInputValue("");
    clearReasoningCycle();
    const thoughts = [
      t.leadQualify.thinking2,
      t.leadQualify.thinking3,
      t.leadQualify.thinking4,
      t.leadQualify.thinking5,
      t.leadQualify.thinking6,
      t.leadQualify.thinking7,
    ];
    setReasoningLabel(thoughts[Math.max(0, qualificationStep - 1)] || t.leadQualify.thinkingGeneric);
    setIsTyping(false);
    setStatus(t.liaPopup.online);

    const name = qualificationStep === 1 ? userMsg : leadName;
    if (qualificationStep === 1) setLeadName(userMsg);
    const isCorrectingPhone = qualificationStep === 3 && userMsg === t.leadQualify.noCorrect;
    const nextMessage = isCorrectingPhone ? t.leadQualify.step2.replace("{name}", name) : [
      "",
      t.leadQualify.step2.replace("{name}", name),
      t.leadQualify.step3.replace("{name}", name).replace("{phone}", userMsg),
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
    }, 850);
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
        <div className="flex flex-col items-center gap-1 text-green-400 font-bold text-sm">
          {t.liaPopup.handoffForwarding}
          {!isCancelled && !isRedirected && (
            <span className="text-[10px] font-medium opacity-70">{t.liaPopup.handoffRedirect} {countdown}s</span>
          )}
        </div>

        {!isCancelled ? (
          <div className="w-full flex flex-col items-center gap-2">
            <button
              onClick={handleRedirect}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group"
            >
              {isRedirected ? t.liaPopup.handoffOpening : t.liaPopup.handoffOpenNow}
            </button>
            <button
              onClick={handleCancel}
              className="text-[11px] text-green-400/60 hover:text-green-400 font-bold underline transition-colors"
            >
              {t.liaPopup.handoffCancel}
            </button>
          </div>
        ) : (
          <div className="text-green-400 font-bold text-sm py-2">
            {t.liaPopup.handoffCancelled}
          </div>
        )}

        <p className="text-[10px] text-green-400/70 font-medium text-center">
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
                      src="/team/igor-avatar.png"
                      alt="Igor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-lg tracking-tight leading-none mb-0.5">Igor</span>
                    <span className="text-[11px] font-bold bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent transition-all duration-300">
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
                        <img src="/team/igor-avatar.png" alt="Igor" className="h-full w-full object-cover" />
                      </div>
                      <div className="rounded-2xl rounded-tl-none border border-white/10 bg-white/[0.06] px-4 py-3 text-[13px] font-semibold text-zinc-100">
                        Olá, tudo bem?
                      </div>
                    </div>

                    <div className="ml-10 max-w-[82%] rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.06] p-4">
                      <p className="text-[14px] font-semibold leading-relaxed text-zinc-100">Vamos entender como a Tlin pode organizar seu comercial e preparar uma demonstração para a sua operação?</p>
                      <button
                        type="button"
                        onClick={beginQualification}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF] px-4 py-2.5 text-[12px] font-bold text-[#0c0d0d] transition-transform hover:scale-[1.02] active:scale-95"
                      >
                        Sim, começar agora
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></svg>
                      </button>
                      <p className="mt-3 text-[10px] font-medium leading-relaxed text-zinc-500">Ao continuar, você aceita nossa <a href="/legal?tab=privacidade" className="text-[#64E5FA] hover:underline">Política de Privacidade</a></p>
                    </div>
                  </div>

                ) : (
                  <div className="flex flex-col gap-3 pb-8 pt-4">
                    {messages.map((msg, i) => {
                      const isFirstInBlock = i === 0 || messages[i-1].role !== msg.role;
                      return (
                        <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} ${!isFirstInBlock ? '-mt-1.5' : ''}`}>
                          {msg.role === 'bot' && msg.type !== 'handoff' && (
                            <div className="w-8 h-8 shrink-0">
                              {isFirstInBlock && (
                                <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden mt-1">
                                  <img
                                    src="/team/igor-avatar.png"
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
                            <div className={`max-w-[82%] p-3.5 rounded-2xl text-[13px] font-semibold leading-relaxed transition-all ${
                              msg.role === 'user'
                                ? `bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 ${isFirstInBlock ? 'rounded-tr-none' : ''}`
                                : `bg-white/[0.06] text-zinc-100 border border-white/10 ${isFirstInBlock ? 'rounded-tl-none' : ''}`
                            }`}>
                              <FormattedMessage text={msg.text} />
                            </div>
                          )}
                        </div>
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
                            className="text-[11px] font-medium text-zinc-500"
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
                             src="/team/igor-avatar.png"
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
                            className={`rounded-2xl px-4 py-3 text-left text-[12px] font-bold transition-all active:scale-[0.98] ${option === t.leadQualify.yesCorrect || option === t.leadQualify.confirm ? "bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-[#0c0d0d] hover:brightness-105" : "border border-white/10 bg-white/[0.05] text-zinc-200 hover:border-[#B597FF]/50 hover:bg-white/[0.09]"}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    {qualificationStep === 7 && !isTyping && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          trackFunnelEvent("igor_chat_schedule", { cta_source: "igor_chat" });
                          window.location.assign("/comece");
                        }}
                        className="ml-10 mt-1 rounded-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF] px-4 py-2.5 text-[12px] font-bold text-[#0c0d0d]"
                      >
                        Escolher horário para a demo
                      </motion.button>
                    )}
                  </div>
                )}
              </div>

              {qualificationStep > 0 && qualificationStep < 7 && !isTyping && !reasoningLabel && !currentOptions && <div className="px-4 sm:px-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-5 bg-transparent shrink-0 z-10 mt-auto">
                 <div className={`border border-white/10 bg-white/5 flex focus-within:border-[#B597FF]/50 focus-within:ring-4 ring-[#B597FF]/5 transition-all duration-300 ${
                   messages.length > 0 ? 'flex-row items-end gap-1.5 rounded-[1.25rem] p-2.5' : 'flex-col rounded-[1.5rem] p-3 py-4'
                 }`}>
                   <textarea
                     ref={textareaRef}
                     aria-label="Mensagem para Igor"
                     value={inputValue}
                     onChange={(e) => handleInputChange(e.target.value)}
                     onFocus={keepInputVisible}
                     onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && isInputValid() && (e.preventDefault(), handleSendMessage())}
                     inputMode={qualificationStep === 2 ? "tel" : qualificationStep === 6 ? "email" : "text"}
                     maxLength={qualificationStep === 2 ? 15 : qualificationStep === 6 ? 160 : 80}
                     placeholder={inputPlaceholder}
                     className={`bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 resize-none w-full px-2 font-semibold leading-relaxed transition-all duration-300 ${
                       messages.length > 0 ? 'min-h-8 py-1.5 text-[13px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : 'min-h-[60px] text-sm'
                     }`}
                   />
                   <div className={`flex justify-end ${messages.length > 0 ? 'shrink-0' : 'mt-1'}`}>
                     <button
                       aria-label="Enviar mensagem"
                       onClick={() => handleSendMessage()}
                       disabled={!isInputValid()}
                       className={`${messages.length > 0 ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center transition-all ${
                          isInputValid() ? 'bg-white text-zinc-950' : 'bg-white/10 text-zinc-500'
                       }`}
                     >
                        <svg width={messages.length > 0 ? 17 : 20} height={messages.length > 0 ? 17 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                     </button>
                   </div>
                 </div>
              </div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons: Only visible after Hero animation is done or chat is open */}
      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-[200] flex flex-col items-center">
        <AnimatePresence>
          {(canShow || isOpen) && (
            <>
              {/* Igor Button */}
              <motion.div
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                exit={{ y: 200 }}
                transition={{ duration: 0.875, ease: [0.23, 1, 0.32, 1] }}
                className="relative group"
              >
                {/* External Lilac Glow */}
                <div className={`absolute -inset-1 bg-[#B597FF] rounded-full blur-md transition duration-1000 group-hover:duration-200 animate-pulse opacity-70 group-hover:opacity-100 pointer-events-none ${isOpen ? 'opacity-40' : ''}`}></div>
                <div className={`absolute -inset-2 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full blur-xl transition duration-1000 opacity-30 group-hover:opacity-60 pointer-events-none ${isOpen ? 'opacity-20' : ''}`}></div>
                
                <button
                  onClick={() => {
                    const nextOpen = !isOpen;
                    setIsOpen(nextOpen);
                    if (nextOpen) trackFunnelEvent("lia_chat_opened", { cta_source: "floating_lia" });
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`relative flex items-center h-12 bg-zinc-950 text-white rounded-full transition-all active:scale-95 z-10 cursor-pointer ${isOpen ? 'px-8 justify-center min-w-[120px]' : 'px-2 pr-6'}`}
                >
                  {!isOpen && (
                    <div className="relative shrink-0 pl-2">
                      <span className="text-lg">✨</span>
                    </div>
                  )}
                  <motion.div initial={false} animate={{ opacity: 1 }} className="overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <span className={`font-bold text-[13px] whitespace-nowrap tracking-wide ${isOpen ? 'pl-0' : 'pl-2'}`}>
                      {isOpen ? t.liaPopup.close : t.liaPopup.talkToLia}
                    </span>
                  </motion.div>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
