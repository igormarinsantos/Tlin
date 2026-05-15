"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import confetti from 'canvas-confetti';

type Message = {
  role: 'bot' | 'user';
  text: string;
};

type LeadQualificationPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  planName: string | null;
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
    const interval = setInterval(() => {
      setDisplayedText(rawText.slice(0, i + 1));
      i++;
      if (i >= rawText.length) clearInterval(interval);
    }, 25);
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

export function LeadQualificationPopup({ isOpen, onClose, planName }: LeadQualificationPopupProps) {
  const { t } = useLanguage();
  const WHATSAPP_NUMBER = "5511916248604";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    countryCode: '+55',
    volume: '',
    team: '',
    email: ''
  });
  
  const AFFIRMATIONS = ["Ótimo", "Perfeito", "Entendido", "Legal", "Show", "Excelente"];
  
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const initialMsg = t?.leadQualify?.initialMsg || "";
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const isLiveSession = useRef(false);

  // Estados e Referências adicionadas para controle de Edição Direta e Fechamento Automático
  const [editingField, setEditingField] = useState<keyof typeof formData | null>(null);
  const hasAutoClosed = useRef(false);
  const [showResumeOverlay, setShowResumeOverlay] = useState(false);
  const [savedState, setSavedState] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    // Carrega o histórico salvo localmente se existir para continuar exatamente de onde parou
    try {
      const saved = localStorage.getItem("tlin_lead_qualify_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.currentStep && parsed?.currentStep > 1 && parsed?.currentStep < 8) {
          setSavedState(parsed);
          setShowResumeOverlay(true);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar estado do localStorage:", e);
    }

    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize chat history when translation is ready
  useEffect(() => {
    if (t?.leadQualify && chatHistory.length === 0) {
      setChatHistory([{ role: 'bot', text: t?.leadQualify?.initialMsg || "" }]);
    }
  }, [t, chatHistory.length]);

  // Salva automaticamente o progresso sempre que o usuário avança ou altera os dados
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("tlin_lead_qualify_state", JSON.stringify({
          currentStep,
          formData,
          chatHistory
        }));
      } catch (e) {
        console.error("Erro ao salvar estado no localStorage:", e);
      }
    }
  }, [currentStep, formData, chatHistory, mounted]);

  // Controle de Fechamento Automático em 10 segundos na primeira vez que atinge a tela de sucesso
  const confettiFired = useRef(false);
  useEffect(() => {
    if (currentStep === 8) {
      if (!confettiFired.current) {
        confettiFired.current = true;
        console.log("SUCCESS SCREEN REACHED - Triggering Confetti and Timer");
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B597FF', '#38E3FF', '#ffffff'],
          zIndex: 999
        });
      }

      if (!hasAutoClosed.current) {
        hasAutoClosed.current = true;
        const timer = setTimeout(() => {
          console.log("AUTO-CLOSING success screen after 10s");
          onClose();
        }, 10000);
        return () => clearTimeout(timer);
      }
    } else {
      hasAutoClosed.current = false;
      confettiFired.current = false;
    }
  }, [currentStep, onClose]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    const t = setInterval(scrollToBottom, 100);
    const timeout = setTimeout(() => clearInterval(t), 2000);
    return () => { clearInterval(t); clearTimeout(timeout); };
  }, [chatHistory, isTyping, currentStep]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]); // Removido currentStep da dependência para não disparar o overlay de boas-vindas no meio da conversa

  const resetForm = () => {
    isLiveSession.current = false;
    hasAutoClosed.current = false;
    setCurrentStep(1);
    setFormData({ name: '', phone: '', countryCode: '+55', volume: '', team: '', email: '' });
    setChatHistory([{ role: 'bot', text: initialMsg }]);
    try {
      localStorage.removeItem("tlin_lead_qualify_state");
    } catch (e) {}
  };

  const handleWhatsAppRedirect = (data: typeof formData) => {
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
      case 7: return [t?.leadQualify?.confirm || "Confirmar"];
      case 8: return [t?.leadQualify?.newRequest || "Nova solicitação"];
      default: return null;
    }
  };

  const advanceChat = (userValue: string, field?: keyof typeof formData) => {
    if (t?.leadQualify && currentStep === 3 && userValue === t?.leadQualify?.noCorrect) {
      setChatHistory(prev => [...prev, { role: 'user', text: userValue }]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentStep(2);
        setChatHistory(prev => [...prev, { role: 'bot', text: t?.leadQualify?.step2 || "" }]);
      }, 800);
      return;
    }

    if (currentStep === 8 && (userValue === "Reiniciar formulário" || userValue === "Fazer uma nova solicitação")) {
      resetForm();
      return;
    }

    isLiveSession.current = true;
    const updatedData = { ...formData };
    if (field) updatedData[field] = userValue;
    setFormData(updatedData);
    
    const displayText = field === 'phone' ? `${formData.countryCode} ${userValue}` : userValue;
    setChatHistory(prev => [...prev, { role: 'user', text: displayText }]);
    
    if (currentStep < 8) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const nextQ = getQuestion(currentStep + 1, updatedData);
        setChatHistory(prev => [...prev, { role: 'bot', text: nextQ }]);
        setCurrentStep(prev => prev + 1);
        
        if (currentStep === 7 && userValue === "Confirmar dados") {
          fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...updatedData, planName })
          })
          .then(res => res.json())
          .then(data => console.log("Status do envio:", data))
          .catch(err => console.error("Erro ao notificar API:", err));
        }
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isTyping && currentStep < 8) {
      // Bloqueia a ação de voltar se estiver no overlay de boas-vindas para evitar dessincronização
      const isAsking = chatHistory[chatHistory.length - 1]?.text.includes("Que bom que voltou");
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
        rebuiltHistory.push({ role: 'user', text: "Sim, está correto" });
        rebuiltHistory.push({ role: 'bot', text: getQuestion(4, formData) });
      }
      if (targetStep >= 5) {
        rebuiltHistory.push({ role: 'user', text: formData.volume || "Até 1.000" });
        rebuiltHistory.push({ role: 'bot', text: getQuestion(5, formData) });
      }
      if (targetStep >= 6) {
        rebuiltHistory.push({ role: 'user', text: formData.team || "1 a 3" });
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
        onClose();
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

  const isAskingToContinue = chatHistory[chatHistory.length - 1]?.text.includes("Que bom que voltou");
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
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-[10px] bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full h-full max-w-[calc(100vw-20px)] border rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col transition-all duration-700 ${
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
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-[410]">
                    <button
                      onClick={onClose}
                      className="relative py-2 px-2 transition-all active:scale-95 text-xs sm:text-sm font-bold group/close bg-transparent border-none text-zinc-400 hover:text-white"
                    >
                      <span className="relative inline-block pb-0.5">{t?.liaPopup?.close || "Fechar"}
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-current origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/close:scale-x-100" />
                      </span>
                    </button>
                  </div>

                  <div className="max-w-2xl w-full flex flex-col items-center gap-12">
                    <div className="w-full">
                      <TypewriterQuestion text="[Que bom que voltou]! Identificamos uma solicitação em andamento. Como deseja prosseguir?" />
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
                        Continuar
                      </button>
                      <button
                        onClick={() => {
                          resetForm();
                          setShowResumeOverlay(false);
                        }}
                        className="flex-1 py-4 sm:py-5 px-8 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-bold text-lg sm:text-xl transition-all hover:text-white hover:bg-white/10 active:scale-[0.98]"
                      >
                        Recomeçar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header / Botão Fechar */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-[100]">
              <button
                onClick={onClose}
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
            </div>

            {currentStep < 8 ? (
              <>
            {/* Scrollable Message Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-12 pt-12 sm:pt-16 pb-4 z-10 custom-scrollbar">
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
                                  <span className="text-zinc-500">Empresa:</span>
                                  <span className="font-bold text-white flex items-center gap-2">
                                    {formData.name} <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-xs">✏️</span>
                                  </span>
                                </button>
                                <button 
                                  onClick={() => setEditingField('phone')}
                                  className="w-full flex justify-between items-center text-xs sm:text-sm p-2 rounded-xl hover:bg-white/10 transition-colors group/edit"
                                >
                                  <span className="text-zinc-500">WhatsApp:</span>
                                  <span className="font-bold text-white flex items-center gap-2">
                                    {formData.countryCode} {formData.phone} <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-xs">✏️</span>
                                  </span>
                                </button>
                                <button 
                                  onClick={() => setEditingField('volume')}
                                  className="w-full flex justify-between items-center text-xs sm:text-sm p-2 rounded-xl hover:bg-white/10 transition-colors group/edit"
                                >
                                  <span className="text-zinc-500">Volume:</span>
                                  <span className="font-bold text-white flex items-center gap-2">
                                    {formData.volume} <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-xs">✏️</span>
                                  </span>
                                </button>
                                <button 
                                  onClick={() => setEditingField('team')}
                                  className="w-full flex justify-between items-center text-xs sm:text-sm p-2 rounded-xl hover:bg-white/10 transition-colors group/edit"
                                >
                                  <span className="text-zinc-500">Equipe:</span>
                                  <span className="font-bold text-white flex items-center gap-2">
                                    {formData.team} <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-xs">✏️</span>
                                  </span>
                                </button>
                                <button 
                                  onClick={() => setEditingField('email')}
                                  className="w-full flex justify-between items-center text-xs sm:text-sm p-2 rounded-xl hover:bg-white/10 transition-colors group/edit"
                                >
                                  <span className="text-zinc-500">E-mail:</span>
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
                                  opt === "Confirmar dados" || opt === "Sim, está correto" || opt === "Fazer uma nova solicitação"
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
            <div className="shrink-0 px-4 sm:px-12 pt-2 sm:pt-4 pb-4 sm:pb-10 z-20">
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
                                  pressione <span className="font-black">ENTER ou CTRL+ENTER ↵</span>
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
                                  pressione <span className="font-black">ENTER ou CTRL+ENTER ↵</span>
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
                                  pressione <span className="font-black">ENTER ou CTRL+ENTER ↵</span>
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

                <div className="mt-2 sm:mt-4 flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase pt-2 sm:pt-4">
                  <button onClick={handleBack} className="hover:text-zinc-400 flex items-center gap-2 transition-colors disabled:opacity-20" disabled={currentStep === 1 || currentStep >= 8}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m15 18-6-6 6-6"/></svg>
                    Voltar
                  </button>
                </div>
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
                        Editar {editingField === 'name' ? 'Empresa' : editingField === 'phone' ? 'WhatsApp' : editingField === 'volume' ? 'Volume Mensal' : editingField === 'team' ? 'Tamanho da Equipe' : 'E-mail'}
                      </span>
                      <button onClick={() => setEditingField(null)} className="text-zinc-500 hover:text-white text-xs font-bold transition-colors">
                        Cancelar
                      </button>
                    </div>

                    {editingField === 'name' && (
                      <form onSubmit={(e) => { e.preventDefault(); setEditingField(null); }} className="flex flex-col gap-4">
                        <input 
                          autoFocus 
                          type="text" 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="Nome da empresa..."
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-[#B597FF] transition-all"
                        />
                        <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-bold transition-opacity hover:opacity-90">
                          Salvar alteração
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
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: formatPhone(e.target.value)})}
                            placeholder="Número..."
                            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-[#B597FF] transition-all w-full"
                          />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-bold transition-opacity hover:opacity-90">
                          Salvar alteração
                        </button>
                      </form>
                    )}

                    {editingField === 'volume' && (
                      <div className="flex flex-col gap-2">
                        {["Até 1.000", "1.000 a 5.000", "5.000 a 10.000", "Mais de 10.000"].map(opt => (
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
                        {["1 a 3", "4 a 10", "11 a 50", "Mais de 50"].map(opt => (
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
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="E-mail corporativo..."
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-[#B597FF] transition-all"
                        />
                        <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-bold transition-opacity hover:opacity-90">
                          Salvar alteração
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
                  Solicitação enviada com sucesso!
                </h2>
                
                <p className="text-lg sm:text-2xl font-bold text-zinc-900/80 max-w-2xl mb-10 leading-relaxed">
                  Nossa equipe de especialistas já está analisando o perfil da <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent font-black">{formData.name || "sua empresa"}</span> e entrará em contato em breve via WhatsApp.
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
                        <span className="relative z-10 whitespace-nowrap">Falar com a equipe</span>
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
                      Nova solicitação
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

    </AnimatePresence>,
    document.body
  );
}
