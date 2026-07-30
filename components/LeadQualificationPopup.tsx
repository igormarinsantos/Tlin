"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { getDictionary } from "@/lib/dictionaries";
import { calculateLeadScore, getUtmLeadPayload, trackConversion, trackFunnelEvent } from "@/lib/utm";
// confetti is dynamically imported

type Message = {
  role: 'bot' | 'user';
  text: string;
};

type LeadQualificationPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  planName: string | null;
  embedded?: boolean;
};

// Common Country Codes
const COUNTRIES = [
  { code: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: '+1', flag: '🇺🇸', name: 'EUA' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+34', flag: '🇪🇸', name: 'Espanha' },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', flag: '🇨🇴', name: 'Colômbia' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
];

const LANGUAGE_CODES = ["PT", "EN", "ES"] as const;
const FALLBACK_FORM_DATA = {
  name: '',
  phone: '',
  countryCode: '+55',
  volume: '',
  team: '',
  email: ''
};

const COUNTRY_CODE_BY_TIMEZONE: Record<string, string> = {
  "America/Argentina/Buenos_Aires": "+54",
  "America/Argentina/Catamarca": "+54",
  "America/Argentina/Cordoba": "+54",
  "America/Argentina/Jujuy": "+54",
  "America/Argentina/La_Rioja": "+54",
  "America/Argentina/Mendoza": "+54",
  "America/Argentina/Rio_Gallegos": "+54",
  "America/Argentina/Salta": "+54",
  "America/Argentina/San_Juan": "+54",
  "America/Argentina/San_Luis": "+54",
  "America/Argentina/Tucuman": "+54",
  "America/Argentina/Ushuaia": "+54",
  "America/Bogota": "+57",
  "America/Chicago": "+1",
  "America/Denver": "+1",
  "America/Los_Angeles": "+1",
  "America/Mazatlan": "+52",
  "America/Mexico_City": "+52",
  "America/New_York": "+1",
  "America/Santiago": "+56",
  "America/Sao_Paulo": "+55",
  "America/Recife": "+55",
  "America/Fortaleza": "+55",
  "America/Manaus": "+55",
  "America/Belem": "+55",
  "America/Campo_Grande": "+55",
  "America/Cuiaba": "+55",
  "America/Porto_Velho": "+55",
  "America/Rio_Branco": "+55",
  "Atlantic/Azores": "+351",
  "Atlantic/Madeira": "+351",
  "Europe/Lisbon": "+351",
  "Europe/London": "+44",
  "Europe/Madrid": "+34",
};

function getInitialCountryCode(language: string): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneCountryCode = COUNTRY_CODE_BY_TIMEZONE[timezone];
    if (timezoneCountryCode) return timezoneCountryCode;
  } catch {
    // Falls back to the selected site language when the browser does not expose a timezone.
  }

  if (language === "EN") return "+1";
  if (language === "ES") return "+34";
  return "+55";
}



// Helper to render text with gradient highlights
const HighlightText = ({ text }: { text: string }) => {
  const parts = text.split(/(\[.*?\])/);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          return (
            <span key={i} className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">
              {part.slice(1, -1)}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};

// Typewriter component with Mascot Cursor
const TypewriterQuestion = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const rawText = text.replace(/\[|\]/g, "");

  useEffect(() => {
    let i = 0;
    const charsPerTick = window.innerWidth < 640 ? 3 : 2;
    const interval = setInterval(() => {
      i += charsPerTick;
      setDisplayedText(rawText.slice(0, i));
      if (i >= rawText.length) clearInterval(interval);
    }, 32);
    return () => clearInterval(interval);
  }, [rawText]);

  const isDone = displayedText === rawText;

  return (
    <div className="relative inline-block text-xl sm:text-4xl font-black text-white tracking-tight leading-[1.2] [text-wrap:pretty]">
      {isDone ? <HighlightText text={text} /> : displayedText}
      <span className="inline-block ml-2 w-5 h-5 sm:w-7 sm:h-7 align-middle shrink-0">
        <Image src="/TlinIA.svg" alt="Mascot" width={32} height={32} className="w-full h-full object-contain" />
      </span>
    </div>
  );
};

export function LeadQualificationPopup({ isOpen, onClose, planName, embedded = false }: LeadQualificationPopupProps) {
  const { lang, t } = useLanguage();
  const WHATSAPP_NUMBER = "5511916248604";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(FALLBACK_FORM_DATA);
  
  const AFFIRMATIONS = ["Ótimo", "Perfeito", "Entendido", "Legal", "Show", "Excelente"];
  
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const initialMsg = t?.leadQualify?.initialMsg || "";
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const isLiveSession = useRef(false);
  const previousLangRef = useRef(lang);
  const pendingAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollFrameRef = useRef<number | null>(null);
  const hasTrackedQualifiedLeadRef = useRef(false);
  const hasInitializedCountryCodeRef = useRef(false);

  // Estados e Referências adicionadas para controle de Edição Direta e Fechamento Automático
  const [editingField, setEditingField] = useState<keyof typeof formData | null>(null);
  const hasAutoClosed = useRef(false);
  const [showResumeOverlay, setShowResumeOverlay] = useState(false);
  const [savedState, setSavedState] = useState<any>(null);

  const clearPendingAdvance = () => {
    if (pendingAdvanceTimeoutRef.current) {
      clearTimeout(pendingAdvanceTimeoutRef.current);
      pendingAdvanceTimeoutRef.current = null;
    }
  };

  const translateOptionValue = (value: string, group: 'volumeOptions' | 'teamOptions', fromLang = previousLangRef.current) => {
    const targetOptions = t?.leadQualify?.[group] || [];
    if (!value || targetOptions.includes(value)) return value;

    for (const code of LANGUAGE_CODES) {
      const sourceOptions = getDictionary(code)?.leadQualify?.[group] || [];
      const index = sourceOptions.indexOf(value);
      if (index >= 0) return targetOptions[index] || value;
    }

    const sourceOptions = getDictionary(fromLang)?.leadQualify?.[group] || [];
    const index = sourceOptions.indexOf(value);
    return index >= 0 ? targetOptions[index] || value : value;
  };

  const localizeFormData = (data: typeof FALLBACK_FORM_DATA, fromLang = previousLangRef.current) => ({
    ...FALLBACK_FORM_DATA,
    ...data,
    volume: translateOptionValue(data?.volume || '', 'volumeOptions', fromLang),
    team: translateOptionValue(data?.team || '', 'teamOptions', fromLang),
  });

  const buildLocalizedHistory = (step: number, data: typeof FALLBACK_FORM_DATA) => {
    const history: Message[] = [{ role: 'bot', text: getQuestion(1, data) }];

    if (step >= 2 && data.name) {
      history.push({ role: 'user', text: data.name });
      history.push({ role: 'bot', text: getQuestion(2, data) });
    }
    if (step >= 3 && data.phone) {
      const phoneDisplay = data.countryCode === '+55' ? formatPhone(data.phone) : data.phone;
      history.push({ role: 'user', text: `${data.countryCode} ${phoneDisplay}` });
      history.push({ role: 'bot', text: getQuestion(3, data) });
    }
    if (step >= 4) {
      history.push({ role: 'user', text: t?.leadQualify?.yesCorrect || "" });
      history.push({ role: 'bot', text: getQuestion(4, data) });
    }
    if (step >= 5 && data.volume) {
      history.push({ role: 'user', text: data.volume });
      history.push({ role: 'bot', text: getQuestion(5, data) });
    }
    if (step >= 6 && data.team) {
      history.push({ role: 'user', text: data.team });
      history.push({ role: 'bot', text: getQuestion(6, data) });
    }
    if (step >= 7 && data.email) {
      history.push({ role: 'user', text: data.email });
      history.push({ role: 'bot', text: getQuestion(7, data) });
    }

    return history;
  };

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    // Carrega o histórico salvo localmente se existir para continuar exatamente de onde parou
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mounted || hasInitializedCountryCodeRef.current) return;
    hasInitializedCountryCodeRef.current = true;

    try {
      const saved = localStorage.getItem("tlin_lead_qualify_state");
      if (saved && JSON.parse(saved)?.formData?.countryCode) return;
    } catch {
      // A fresh form can still safely receive an inferred default.
    }

    setFormData((previous) => ({
      ...previous,
      countryCode: getInitialCountryCode(lang),
    }));
  }, [mounted, lang]);

  useEffect(() => {
    return () => {
      clearPendingAdvance();
      clearScrollTimers();
    };
  }, []);

  useEffect(() => {
    if (t?.leadQualify && chatHistory.length === 0) {
      setChatHistory([{ role: 'bot', text: initialMsg }]);
    }
  }, [t, chatHistory.length, initialMsg]);

  useEffect(() => {
    if (!mounted || !t?.leadQualify || currentStep !== 1 || isLiveSession.current) return;

    try {
      const saved = localStorage.getItem("tlin_lead_qualify_state");
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (parsed?.currentStep && parsed?.currentStep > 1 && parsed?.currentStep < 8) {
        const localizedData = localizeFormData(parsed.formData || FALLBACK_FORM_DATA, parsed.lang || lang);
        setSavedState({
          ...parsed,
          formData: localizedData,
          chatHistory: buildLocalizedHistory(parsed.currentStep, localizedData),
          lang,
        });
        setShowResumeOverlay(true);
      }
    } catch (e) {
      console.error("Erro ao carregar estado do localStorage:", e);
    }
  }, [mounted, lang, currentStep]);

  useEffect(() => {
    if (!t?.leadQualify) return;

    if (previousLangRef.current !== lang) {
      clearPendingAdvance();
      setIsTyping(false);
      const localizedData = localizeFormData(formData, previousLangRef.current);
      setFormData(localizedData);
      setChatHistory(buildLocalizedHistory(currentStep, localizedData));
      setSavedState((prev: any) => {
        if (!prev) return prev;
        const resumeData = localizeFormData(prev.formData || FALLBACK_FORM_DATA, prev.lang || previousLangRef.current);
        return {
          ...prev,
          formData: resumeData,
          chatHistory: buildLocalizedHistory(prev.currentStep || currentStep, resumeData),
          lang,
        };
      });
      previousLangRef.current = lang;
    }
  }, [lang, t]);

  // Salva automaticamente o progresso sempre que o usuário avança ou altera os dados
  useEffect(() => {
    if (!mounted) return;
    if (currentStep <= 1 && !isLiveSession.current) return;

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem("tlin_lead_qualify_state", JSON.stringify({
          lang,
          currentStep,
          formData,
          chatHistory
        }));
      } catch (e) {
        console.error("Erro ao salvar estado no localStorage:", e);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [lang, currentStep, formData, chatHistory, mounted]);

  // Controle de Fechamento Automático em 10 segundos na primeira vez que atinge a tela de sucesso
  const confettiFired = useRef(false);
  useEffect(() => {
    if (currentStep === 8) {
      if (!confettiFired.current) {
        confettiFired.current = true;
        console.log("SUCCESS SCREEN REACHED - Triggering Confetti and Timer");
        import('canvas-confetti').then((confettiModule) => {
          const confetti = confettiModule.default;
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#B597FF', '#38E3FF', '#ffffff'],
            zIndex: 999
          });
        });
      }

      if (!embedded && !hasAutoClosed.current) {
        hasAutoClosed.current = true;
        const timer = setTimeout(() => {
          console.log("AUTO-CLOSING success screen after 10s");
          closePopup();
        }, 10000);
        return () => clearTimeout(timer);
      }
    } else {
      hasAutoClosed.current = false;
      confettiFired.current = false;
    }
  }, [currentStep, onClose, embedded]);

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

  const keepInputVisible = () => {
    clearScrollTimers();
    scrollTimeoutsRef.current = [
      setTimeout(scheduleScrollToBottom, 80),
      setTimeout(scheduleScrollToBottom, 240),
    ];
  };

  useEffect(() => {
    scheduleScrollToBottom();
    return clearScrollTimers;
  }, [chatHistory, isTyping, currentStep]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const lenis = (window as any).lenis;

    const syncViewportHeight = () => {
      const viewport = window.visualViewport;
      const height = viewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--lead-popup-height", `${height}px`);
      document.documentElement.style.setProperty("--lead-popup-offset-top", `${viewport?.offsetTop || 0}px`);
    };

    if (isOpen && !embedded) {
      syncViewportHeight();
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'contain';
      document.documentElement.style.overscrollBehavior = 'contain';
      lenis?.stop?.();
      window.visualViewport?.addEventListener("resize", syncViewportHeight);
      window.visualViewport?.addEventListener("scroll", syncViewportHeight);
      window.addEventListener("resize", syncViewportHeight);
    } else {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      document.documentElement.style.removeProperty("--lead-popup-height");
      document.documentElement.style.removeProperty("--lead-popup-offset-top");
      lenis?.start?.();
    }

    return () => {
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("scroll", syncViewportHeight);
      window.removeEventListener("resize", syncViewportHeight);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      document.documentElement.style.removeProperty("--lead-popup-height");
      document.documentElement.style.removeProperty("--lead-popup-offset-top");
      lenis?.start?.();
    };
  }, [isOpen]); // Removido currentStep da dependência para não disparar o overlay de boas-vindas no meio da conversa

  const resetForm = () => {
    clearPendingAdvance();
    isLiveSession.current = false;
    hasTrackedQualifiedLeadRef.current = false;
    hasAutoClosed.current = false;
    setCurrentStep(1);
    setFormData(FALLBACK_FORM_DATA);
    setChatHistory([{ role: 'bot', text: initialMsg }]);
    try {
      localStorage.removeItem("tlin_lead_qualify_state");
    } catch (e) {}
  };

  const closePopup = () => {
    clearPendingAdvance();
    clearScrollTimers();
    if (currentStep > 1 && currentStep < 8) {
      trackFunnelEvent('lead_form_abandoned', {
        lead_step: currentStep,
        plan_name: planName || 'not_selected',
        lead_volume: formData.volume || 'not_set',
        team_size: formData.team || 'not_set',
      });
    }

    onClose();
  };

  const handleWhatsAppRedirect = (data: typeof formData) => {
    const score = calculateLeadScore({
      planName,
      volume: data.volume,
      team: data.team,
      wentToWhatsApp: true,
    });

    trackConversion('close_convert_lead', {
      plan_name: planName || 'not_selected',
      lead_volume: data.volume || 'not_set',
      team_size: data.team || 'not_set',
      lead_country_code: data.countryCode || '+55',
      ...score,
    });

    const text = `Olá! Fiz uma solicitação no site da Tlin e gostaria de mais informações. 🚀`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getQuestion = (step: number, data: typeof formData) => {
    const aff = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    
    switch(step) {
      case 1: return initialMsg;
      case 2: return t?.leadQualify?.step2 || "";
      case 3: return t?.leadQualify?.step3?.replace("{phone}", `${data.countryCode} ${data.phone}`) || "";
      case 4: return t?.leadQualify?.step4 || "";
      case 5: return t?.leadQualify?.step5 || "";
      case 6: return t?.leadQualify?.step6 || "";
      case 7: return t?.leadQualify?.step7 || "";
      case 8: return t?.leadQualify?.step8?.replace("{name}", data.name) || "";
      default: return "";
    }
  };

  const getOptions = (step: number) => {
    if (!t?.leadQualify) return null;
    switch(step) {
      case 3: return [t?.leadQualify?.yesCorrect || "", t?.leadQualify?.noCorrect || ""];
      case 4: return t?.leadQualify?.volumeOptions || [];
      case 5: return t?.leadQualify?.teamOptions || [];
      case 7: return [t?.leadQualify?.confirm || ""];
      case 8: return [t?.leadQualify?.newRequest || ""];
      default: return null;
    }
  };

  const advanceChat = (userValue: string, field?: keyof typeof formData) => {
    clearPendingAdvance();

    if (t?.leadQualify && currentStep === 3 && userValue === t?.leadQualify?.noCorrect) {
      setChatHistory(prev => [...prev, { role: 'user', text: userValue }]);
      setIsTyping(true);
      pendingAdvanceTimeoutRef.current = setTimeout(() => {
        pendingAdvanceTimeoutRef.current = null;
        setIsTyping(false);
        setCurrentStep(2);
        setChatHistory(prev => [...prev, { role: 'bot', text: t?.leadQualify?.step2 || "" }]);
      }, 800);
      return;
    }

    if (currentStep === 8 && userValue === t?.leadQualify?.newRequest) {
      resetForm();
      return;
    }

    isLiveSession.current = true;
    const updatedData = { ...formData };
    if (field) updatedData[field] = userValue;
    setFormData(updatedData);
    trackFunnelEvent('lead_step_completed', {
      lead_step: currentStep,
      field_name: field || `step_${currentStep}`,
      plan_name: planName || 'not_selected',
      lead_volume: updatedData.volume || 'not_set',
      team_size: updatedData.team || 'not_set',
    });
    
    const displayText = field === 'phone' ? `${formData.countryCode} ${userValue}` : userValue;
    setChatHistory(prev => [...prev, { role: 'user', text: displayText }]);
    
    if (currentStep < 8) {
      setIsTyping(true);
      pendingAdvanceTimeoutRef.current = setTimeout(async () => {
        pendingAdvanceTimeoutRef.current = null;
        setIsTyping(false);
        const nextQ = getQuestion(currentStep + 1, updatedData);
        const isConfirming = currentStep === 7 && userValue === t?.leadQualify?.confirm;

        if (isConfirming) {
          const score = calculateLeadScore({
            planName,
            volume: updatedData.volume,
            team: updatedData.team,
          });

          if (!hasTrackedQualifiedLeadRef.current) {
            hasTrackedQualifiedLeadRef.current = true;
            trackConversion('qualify_lead', {
              plan_name: planName || 'not_selected',
              lead_volume: updatedData.volume || 'not_set',
              team_size: updatedData.team || 'not_set',
              lead_country_code: updatedData.countryCode || '+55',
              ...score,
            });
          }

          try {
            const response = await fetch('/api/notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...updatedData,
                planName,
                ...score,
                utm: getUtmLeadPayload(),
              })
            });
            const notifyResult = await response.json();

            if (!response.ok || !notifyResult?.success) {
              throw new Error(notifyResult?.whatsappError || notifyResult?.emailError || "Falha ao notificar API");
            }

            console.log("Status do envio:", notifyResult);
          } catch (err) {
            console.error("Erro ao notificar API:", err);
            setChatHistory(prev => [...prev, { role: 'bot', text: t?.leadQualify?.sendError || "" }]);
            return;
          }
        }

        setChatHistory(prev => [...prev, { role: 'bot', text: nextQ }]);
        setCurrentStep(prev => prev + 1);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isTyping && currentStep < 8) {
      clearPendingAdvance();
      // Bloqueia a ação de voltar se estiver no overlay de boas-vindas para evitar dessincronização
      const isAsking = chatHistory[chatHistory.length - 1]?.text === t?.leadQualify?.resumeTitle;
      if (isAsking) return;

      const targetStep = currentStep - 1;
      setCurrentStep(targetStep);
      
      const rebuiltHistory: Message[] = [{ role: 'bot', text: initialMsg }];
      
      if (targetStep >= 2) {
        rebuiltHistory.push({ role: 'user', text: formData.name });
        rebuiltHistory.push({ role: 'bot', text: getQuestion(2, formData) });
      }
      if (targetStep >= 3) {
        const phoneDisplay = formData.countryCode === '+55' ? formatPhone(formData.phone) : formData.phone;
        rebuiltHistory.push({ role: 'user', text: `${formData.countryCode} ${phoneDisplay}` });
        rebuiltHistory.push({ role: 'bot', text: getQuestion(3, formData) });
      }
      if (targetStep >= 4) {
        rebuiltHistory.push({ role: 'user', text: t?.leadQualify?.yesCorrect || "" });
        rebuiltHistory.push({ role: 'bot', text: getQuestion(4, formData) });
      }
      if (targetStep >= 5) {
        rebuiltHistory.push({ role: 'user', text: formData.volume || t?.leadQualify?.volumeOptions?.[0] || "" });
        rebuiltHistory.push({ role: 'bot', text: getQuestion(5, formData) });
      }
      if (targetStep >= 6) {
        rebuiltHistory.push({ role: 'user', text: formData.team || t?.leadQualify?.teamOptions?.[0] || "" });
        rebuiltHistory.push({ role: 'bot', text: getQuestion(6, formData) });
      }
      if (targetStep >= 7) {
        rebuiltHistory.push({ role: 'user', text: formData.email });
        rebuiltHistory.push({ role: 'bot', text: getQuestion(7, formData) });
      }

      setChatHistory(rebuiltHistory);
    }
  };

  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, "");
    if (formData.countryCode !== '+55') return value;
    const limited = nums.slice(0, 11);
    if (limited.length > 10) return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    if (limited.length > 6) return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    if (limited.length > 2) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    if (limited.length > 0) return `(${limited}`;
    return limited;
  };

  const isPhoneValid = () => {
    const nums = formData.phone.replace(/\D/g, "");
    if (formData.countryCode === '+55') return nums.length >= 10 && nums.length <= 11;
    return nums.length >= 8;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (e.key === "Escape") {
        closePopup();
        return;
      }

      if (!isInput && !editingField && (e.key === "ArrowUp" || e.key === "ArrowLeft")) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, isTyping, chatHistory, formData, editingField, onClose]);

  if (!mounted) return null;

  const isAskingToContinue = chatHistory[chatHistory.length - 1]?.text === t?.leadQualify?.resumeTitle;
  const isLastMessageBot = chatHistory[chatHistory.length - 1]?.role === 'bot';
  
  let latestBotIdx = -1;
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    if (chatHistory[i].role === 'bot') {
      latestBotIdx = i;
      break;
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.18 }}
          onWheelCapture={(event) => event.stopPropagation()}
          onTouchMoveCapture={(event) => event.stopPropagation()}
          className={embedded
            ? "fixed inset-0 w-full min-h-screen z-[300] flex flex-col items-center justify-center overflow-hidden bg-[#0c0d0d]"
            : "fixed inset-x-0 top-[var(--lead-popup-offset-top,0px)] h-[var(--lead-popup-height,100dvh)] w-full z-[300] flex flex-col items-center justify-center overflow-hidden p-2 sm:p-[10px] bg-black/70 sm:bg-black/60 sm:backdrop-blur-md overscroll-none"}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${embedded ? "h-screen max-w-none" : "h-full min-h-0 max-h-[calc(var(--lead-popup-height,100dvh)-16px)] sm:max-h-[calc(var(--lead-popup-height,100dvh)-20px)] max-w-5xl rounded-2xl sm:rounded-[2.5rem] sm:shadow-2xl"} border overflow-hidden flex flex-col transition-colors duration-300 ${
              currentStep === 8 
                ? 'border-zinc-200' 
                : 'border-white/10'
            }`}
            style={{ backgroundColor: currentStep === 8 ? '#ffffff' : '#0c0d0d' }}
          >
            {/* Elementos Visuais Animados (Estilo Lia) para o Sucesso */}
            <AnimatePresence>
              {currentStep === 8 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                >
                  <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#B597FF]/20 rounded-full blur-[80px] animate-pulse" />
                  <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#38E3FF]/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Overlay de Retomada de Sessão */}
            <AnimatePresence>
              {showResumeOverlay && savedState && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[400] flex items-center justify-center bg-[#0c0d0d]/95 backdrop-blur-[60px] text-center p-6 sm:p-12"
                >
                  {/* Botão Fechar no Overlay */}
                  {!embedded && <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-[410]">
                    <button
                      onClick={closePopup}
                      className="relative py-2 px-2 transition-all active:scale-95 text-xs sm:text-sm font-bold group/close bg-transparent border-none text-zinc-400 hover:text-white"
                    >
                      <span className="relative inline-block pb-0.5">{t?.liaPopup?.close || "Fechar"}
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-current origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/close:scale-x-100" />
                      </span>
                    </button>
                  </div>}

                  <div className="max-w-2xl w-full flex flex-col items-center gap-12">
                    <div className="w-full">
                      <TypewriterQuestion text={t?.leadQualify?.resumeTitle || ""} />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                      <button
                        onClick={() => {
                          if (savedState) {
                            setCurrentStep(savedState.currentStep);
                            setFormData(savedState.formData);
                            setChatHistory(savedState.chatHistory);
                          }
                          setShowResumeOverlay(false);
                          isLiveSession.current = true;
                        }}
                        className="flex-1 py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-black text-lg sm:text-xl shadow-2xl shadow-purple-500/20 transition-all active:scale-[0.98] hover:opacity-90"
                      >
                        {t?.leadQualify?.resumeContinue || "Continuar"}
                      </button>
                      <button
                        onClick={() => {
                          resetForm();
                          setShowResumeOverlay(false);
                        }}
                        className="flex-1 py-4 sm:py-5 px-8 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-bold text-lg sm:text-xl transition-all hover:text-white hover:bg-white/10 active:scale-[0.98]"
                      >
                        {t?.leadQualify?.resumeRestart || "Recomeçar"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header / Botão Fechar */}
            {!embedded && <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-[100] rounded-full bg-[#0c0d0d]/75 shadow-[0_0_22px_20px_rgba(12,13,13,0.9)]">
              <button
                onClick={closePopup}
                className={`relative py-2 px-2 transition-all active:scale-95 text-xs sm:text-sm font-bold group/close bg-transparent border-none ${
                  currentStep === 8 
                  ? "text-zinc-900 hover:text-black" 
                  : "text-zinc-400 hover:text-white"
                }`}
              >
                <span className="relative inline-block pb-0.5">{t?.liaPopup?.close || "Fechar"}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-current origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/close:scale-x-100" />
                </span>
              </button>
            </div>}

            {currentStep < 8 ? (
              <>
            {/* Scrollable Message Area */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y ml-0 mr-1 sm:mr-2 px-4 sm:px-12 pt-12 sm:pt-16 pb-4 z-10 lead-popup-scrollbar">
              <div className="w-full flex flex-col justify-start min-h-full">
                <div className="space-y-6 sm:space-y-8">
                  {chatHistory.map((msg, idx) => {
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-full ${msg.role === 'user' ? 'text-lg sm:text-2xl text-zinc-500 font-medium mb-4' : ''}`}>
                          {msg.role === 'bot' && idx === latestBotIdx ? (
                            <TypewriterQuestion text={msg.text} />
                          ) : (
                            <div className="text-xl sm:text-4xl font-black text-white tracking-tight leading-[1.2] [text-wrap:pretty]">
                              {msg.role === 'bot' ? <HighlightText text={msg.text} /> : msg.text}
                            </div>
                          )}
                        </div>

                        {msg.role === 'bot' && idx === latestBotIdx && !isTyping && isLastMessageBot && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 sm:mt-8 flex flex-col gap-2 sm:gap-3 w-full max-w-md"
                          >
                            {currentStep === 7 && (
                              <div className="mb-4 sm:mb-6 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 space-y-2 sm:space-y-3 text-left">
                                <button 
                                  onClick={() => setEditingField('name')}
                                  className="w-full flex justify-between items-center text-xs sm:text-sm p-2 rounded-xl hover:bg-white/10 transition-colors group/edit"
                                >
                                  <span className="text-zinc-500">{t?.leadQualify?.fields?.company || "Empresa"}:</span>
                                  <span className="font-bold text-white flex items-center gap-2">
                                    {formData.name} <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-xs">✏️</span>
                                  </span>
                                </button>
                                <button 
                                  onClick={() => setEditingField('phone')}
                                  className="w-full flex justify-between items-center text-xs sm:text-sm p-2 rounded-xl hover:bg-white/10 transition-colors group/edit"
                                >
                                  <span className="text-zinc-500">{t?.leadQualify?.fields?.whatsapp || "WhatsApp"}:</span>
                                  <span className="font-bold text-white flex items-center gap-2">
                                    {formData.countryCode} {formData.phone} <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-xs">✏️</span>
                                  </span>
                                </button>
                                <button 
                                  onClick={() => setEditingField('volume')}
                                  className="w-full flex justify-between items-center text-xs sm:text-sm p-2 rounded-xl hover:bg-white/10 transition-colors group/edit"
                                >
                                  <span className="text-zinc-500">{t?.leadQualify?.fields?.volume || "Volume"}:</span>
                                  <span className="font-bold text-white flex items-center gap-2">
                                    {formData.volume} <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-xs">✏️</span>
                                  </span>
                                </button>
                                <button 
                                  onClick={() => setEditingField('team')}
                                  className="w-full flex justify-between items-center text-xs sm:text-sm p-2 rounded-xl hover:bg-white/10 transition-colors group/edit"
                                >
                                  <span className="text-zinc-500">{t?.leadQualify?.fields?.team || "Equipe"}:</span>
                                  <span className="font-bold text-white flex items-center gap-2">
                                    {formData.team} <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-xs">✏️</span>
                                  </span>
                                </button>
                                <button 
                                  onClick={() => setEditingField('email')}
                                  className="w-full flex justify-between items-center text-xs sm:text-sm p-2 rounded-xl hover:bg-white/10 transition-colors group/edit"
                                >
                                  <span className="text-zinc-500">{t?.leadQualify?.fields?.email || "E-mail"}:</span>
                                  <span className="font-bold text-[#38E3FF] flex items-center gap-2">
                                    {formData.email} <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-xs">✏️</span>
                                  </span>
                                </button>
                                <div className="text-[10px] text-zinc-500 text-center font-medium pt-2 border-t border-white/5">
                                  {t?.leadQualify?.clickToEdit || "Clique para editar"}
                                </div>
                              </div>
                            )}

                            {getOptions(currentStep)?.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => advanceChat(opt, currentStep === 4 ? 'volume' : currentStep === 5 ? 'team' : undefined)}
                                className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-white/10 text-base sm:text-xl font-bold transition-all active:scale-[0.98] ${
                                  opt === t?.leadQualify?.confirm || opt === t?.leadQualify?.yesCorrect || opt === t?.leadQualify?.newRequest
                                  ? "bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 border-transparent hover:opacity-90"
                                  : "text-zinc-400 hover:border-[#B597FF] hover:text-white hover:bg-white/5"
                                }}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}

                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-5 h-5 sm:w-7 sm:h-7"
                      >
                        <Image src="/TlinIA.svg" alt="Thinking" width={32} height={32} className="w-full h-full object-contain" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Input & Footer Area - Fixed at the bottom */}
            <div className="shrink-0 px-4 sm:px-12 pt-2 sm:pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-10 z-20">
                <AnimatePresence mode="wait">
                  {!isTyping && chatHistory[chatHistory.length - 1]?.role === 'bot' && !isAskingToContinue && (
                    <>
                      {currentStep === 1 && (
                        <motion.div
                          key="name-input"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <form onSubmit={(e) => { e.preventDefault(); if(formData.name.trim()) advanceChat(formData.name, 'name'); }} className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 sm:gap-4 border-b-2 border-white/10 focus-within:border-[#B597FF] transition-all pb-3 sm:pb-4">
                              <input 
                                autoFocus 
                                type="text" 
                                onFocus={keepInputVisible}
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                onKeyDown={e => {
                                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                                    e.preventDefault();
                                    if(formData.name.trim()) advanceChat(formData.name, 'name');
                                  }
                                }}
                                placeholder={t?.leadQualify?.placeholders?.name || "Empresa..."} 
                                className="flex-1 bg-transparent text-xl sm:text-2xl font-bold outline-none placeholder:text-zinc-800 w-full min-w-0 text-white" 
                              />
                              <button type="submit" disabled={!formData.name.trim()} className="flex items-center gap-3 group/submit shrink-0">
                                <span className={`hidden sm:inline text-[11px] font-medium transition-all duration-300 ${formData.name.trim() ? 'text-[#B597FF] opacity-60' : 'text-zinc-700 opacity-0'}`}>
                                  {t?.leadQualify?.pressEnter || "ENTER"}
                                </span>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.name.trim() ? 'bg-[#B597FF] text-white' : 'bg-white/5 text-zinc-700'}`}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                </div>
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="phone-input"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <form onSubmit={(e) => { e.preventDefault(); if(isPhoneValid()) advanceChat(formData.phone, 'phone'); }} className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 sm:gap-4 border-b-2 border-white/10 focus-within:border-[#B597FF] transition-all pb-3 sm:pb-4">
                              <div className="relative shrink-0" ref={countryRef}>
                                <button 
                                  type="button"
                                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                                >
                                  <span className="text-lg sm:text-xl leading-none">
                                    {COUNTRIES.find(c => c.code === formData.countryCode)?.flag || '🇧🇷'}
                                  </span>
                                  <span className="text-base sm:text-lg font-bold text-zinc-400">{formData.countryCode}</span>
                                  <svg className={`w-3 sm:w-4 h-3 sm:h-4 text-zinc-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="m6 9 6 6 6-6" strokeWidth="3" /></svg>
                                </button>
                                
                                <AnimatePresence>
                                  {isCountryDropdownOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="absolute bottom-full left-0 mb-4 w-48 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden py-1.5 shadow-2xl z-50 max-h-[250px] overflow-y-auto custom-scrollbar"
                                    >
                                      {COUNTRIES.map((c) => (
                                        <button
                                          key={c.code}
                                          type="button"
                                          onClick={() => {
                                            setFormData(prev => ({ ...prev, countryCode: c.code, phone: '' }));
                                            setIsCountryDropdownOpen(false);
                                          }}
                                          className="w-full text-left px-4 py-2.5 hover:bg-white/5 flex items-center gap-3 transition-colors"
                                        >
                                          <span className="text-xl leading-none">{c.flag}</span>
                                          <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{c.name}</span>
                                            <span className="text-sm font-bold text-white">{c.code}</span>
                                          </div>
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <input 
                                autoFocus 
                                type="text" 
                                onFocus={keepInputVisible}
                                value={formData.phone} 
                                onChange={e => setFormData({...formData, phone: formatPhone(e.target.value)})} 
                                onKeyDown={e => {
                                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                                    e.preventDefault();
                                    if(isPhoneValid()) advanceChat(formData.phone, 'phone');
                                  }
                                }}
                                placeholder={t?.leadQualify?.placeholders?.phone || "WhatsApp..."} 
                                className="flex-1 bg-transparent text-xl sm:text-2xl font-bold outline-none placeholder:text-zinc-800 w-full min-w-0 text-white" 
                              />
                              <button type="submit" disabled={!isPhoneValid()} className="flex items-center gap-3 group/submit shrink-0">
                                <span className={`hidden sm:inline text-[11px] font-medium transition-all duration-300 ${isPhoneValid() ? 'text-[#B597FF] opacity-60' : 'text-zinc-700 opacity-0'}`}>
                                  {t?.leadQualify?.pressEnter || "ENTER"}
                                </span>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isPhoneValid() ? 'bg-[#B597FF] text-white' : 'bg-white/5 text-zinc-700'}`}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                </div>
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}

                      {currentStep === 6 && (
                        <motion.div
                          key="email-input"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <form onSubmit={(e) => { e.preventDefault(); if(formData.email.trim().includes('@')) advanceChat(formData.email, 'email'); }} className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 sm:gap-4 border-b-2 border-white/10 focus-within:border-[#B597FF] transition-all pb-3 sm:pb-4">
                              <input 
                                autoFocus 
                                type="email" 
                                onFocus={keepInputVisible}
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                onKeyDown={e => {
                                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                                    e.preventDefault();
                                    if(formData.email.trim().includes('@')) advanceChat(formData.email, 'email');
                                  }
                                }}
                                placeholder={t?.leadQualify?.placeholders?.email || "E-mail..."} 
                                className="flex-1 bg-transparent text-xl sm:text-2xl font-bold outline-none placeholder:text-zinc-800 w-full min-w-0 text-white" 
                              />
                              <button type="submit" disabled={!formData.email.trim().includes('@')} className="flex items-center gap-3 group/submit shrink-0">
                                <span className={`hidden sm:inline text-[11px] font-medium transition-all duration-300 ${formData.email.trim().includes('@') ? 'text-[#B597FF] opacity-60' : 'text-zinc-700 opacity-0'}`}>
                                  {t?.leadQualify?.pressEnter || "ENTER"}
                                </span>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.email.trim().includes('@') ? 'bg-[#B597FF] text-white' : 'bg-white/5 text-zinc-700'}`}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                </div>
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </>
                  )}
                </AnimatePresence>

                {currentStep > 1 && currentStep < 8 && (
                  <div className="mt-2 sm:mt-4 flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase pt-2 sm:pt-4">
                    <button onClick={handleBack} className="hover:text-zinc-400 flex items-center gap-2 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m15 18-6-6 6-6"/></svg>
                      {t?.leadQualify?.back || "Voltar"}
                    </button>
                  </div>
                )}
            </div>

            {/* Overlay de Edição Direta de Campo */}
            <AnimatePresence>
              {editingField && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[200] flex flex-col items-center justify-center p-4 sm:p-6 bg-[#0c0d0d]/95 backdrop-blur-md text-center"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 10 }}
                    className="max-w-md w-full bg-zinc-900 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-4 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-xs font-black text-[#B597FF] uppercase tracking-wider">
                        {(t?.leadQualify?.editTitles as Record<string, string> | undefined)?.[editingField] || editingField}
                      </span>
                      <button onClick={() => setEditingField(null)} className="text-zinc-500 hover:text-white text-xs font-bold transition-colors">
                        {t?.leadQualify?.cancel || "Cancelar"}
                      </button>
                    </div>

                    {editingField === 'name' && (
                      <form onSubmit={(e) => { e.preventDefault(); setEditingField(null); }} className="flex flex-col gap-4">
                        <input 
                          autoFocus 
                          type="text" 
                          onFocus={keepInputVisible}
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder={t?.leadQualify?.placeholders?.name || "Empresa..."}
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-[#B597FF] transition-all"
                        />
                        <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-bold transition-opacity hover:opacity-90">
                          {t?.leadQualify?.saveChange || "Salvar"}
                        </button>
                      </form>
                    )}

                    {editingField === 'phone' && (
                      <form onSubmit={(e) => { e.preventDefault(); setEditingField(null); }} className="flex flex-col gap-4">
                        <div className="flex gap-2">
                          <select 
                            value={formData.countryCode} 
                            onChange={e => setFormData({...formData, countryCode: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded-xl px-3 py-3 text-white font-bold outline-none"
                          >
                            {COUNTRIES.map(c => (
                              <option key={c.code} value={c.code} className="bg-zinc-900 text-white">{c.code} ({c.name})</option>
                            ))}
                          </select>
                          <input 
                            autoFocus 
                            type="text" 
                            onFocus={keepInputVisible}
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: formatPhone(e.target.value)})}
                            placeholder={t?.leadQualify?.placeholders?.phone || "WhatsApp..."}
                            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-[#B597FF] transition-all w-full"
                          />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-bold transition-opacity hover:opacity-90">
                          {t?.leadQualify?.saveChange || "Salvar"}
                        </button>
                      </form>
                    )}

                    {editingField === 'volume' && (
                      <div className="flex flex-col gap-2">
                        {(t?.leadQualify?.volumeOptions || []).map(opt => (
                          <button
                            key={opt}
                            onClick={() => { setFormData({...formData, volume: opt}); setEditingField(null); }}
                            className={`p-3 rounded-xl border text-left font-bold transition-all ${formData.volume === opt ? 'border-[#B597FF] bg-[#B597FF]/10 text-white' : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {editingField === 'team' && (
                      <div className="flex flex-col gap-2">
                        {(t?.leadQualify?.teamOptions || []).map(opt => (
                          <button
                            key={opt}
                            onClick={() => { setFormData({...formData, team: opt}); setEditingField(null); }}
                            className={`p-3 rounded-xl border text-left font-bold transition-all ${formData.team === opt ? 'border-[#B597FF] bg-[#B597FF]/10 text-white' : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {editingField === 'email' && (
                      <form onSubmit={(e) => { e.preventDefault(); setEditingField(null); }} className="flex flex-col gap-4">
                        <input 
                          autoFocus 
                          type="email" 
                          onFocus={keepInputVisible}
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder={t?.leadQualify?.placeholders?.email || "E-mail..."}
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-[#B597FF] transition-all"
                        />
                        <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-bold transition-opacity hover:opacity-90">
                          {t?.leadQualify?.saveChange || "Salvar"}
                        </button>
                      </form>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center z-50 my-auto"
              >
                <div className="mb-8 opacity-90">
                  <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={120} height={42} priority />
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight mb-4 max-w-4xl w-full whitespace-nowrap overflow-visible">
                  {t?.leadQualify?.successTitle || ""}
                </h2>
                
                <p className="text-lg sm:text-2xl font-bold text-zinc-900/80 max-w-2xl mb-10 leading-relaxed">
                  {(t?.leadQualify?.successMessage || "{name}").split("{name}")[0]}
                  <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent font-black">{formData.name || t?.leadQualify?.fields?.company || "company"}</span>
                  {(t?.leadQualify?.successMessage || "{name}").split("{name}")[1]}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center items-stretch sm:items-center">
                  {/* Botão Preto com Borda Animada estilo Hero */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => handleWhatsAppRedirect(formData)}
                      className="relative p-[1.5px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer block w-full"
                    >
                      <div className="absolute inset-[-150%] opacity-100 transition-opacity animate-[spin_3s_linear_infinite]"
                        style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 180deg, transparent 240deg 360deg)` }}
                      />
                      <div className="relative px-6 py-4 rounded-full bg-[#0c0d0d] text-white font-extrabold text-base sm:text-lg transition-all z-10 group-hover/btn:text-[#0c0d0d] flex items-center justify-center text-center shadow-xl">
                        <span className="relative z-10 whitespace-nowrap">{t?.leadQualify?.talkToTeam || ""}</span>
                        <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-300 group-hover/btn:opacity-0" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                      </div>
                    </button>
                  </div>

                  {/* Botão Branco */}
                  <div className="relative flex-1">
                    <button
                      onClick={resetForm}
                      className="flex items-center justify-center px-6 py-4 rounded-full bg-white text-zinc-950 font-bold text-base sm:text-lg hover:bg-zinc-50 transition-all active:scale-95 cursor-pointer w-full border border-zinc-200 whitespace-nowrap"
                    >
                      {t?.leadQualify?.newRequest || ""}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

    </AnimatePresence>,
    document.body
  );
}
