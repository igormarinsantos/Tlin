"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

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

const AFFIRMATIONS = ["Ótimo", "Perfeito", "Entendido", "Legal", "Show", "Excelente"];

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
  
  const initialMsg = `Vamos [escalar o faturamento] do seu negócio com IA agora! Para começar, qual é o nome da [sua empresa]?`;

  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'bot', text: initialMsg }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

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
        if (parsed?.currentStep && parsed?.formData && parsed?.chatHistory) {
          setCurrentStep(parsed.currentStep);
          setFormData(parsed.formData);
          setChatHistory(parsed.chatHistory);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar estado do localStorage:", e);
    }

    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Mantém os dados caso tenha saído no meio do formulário
      if (currentStep > 1 && currentStep < 8) {
        setChatHistory(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && !lastMsg.text.includes("Que bom que voltou")) {
            return [...prev, { role: 'bot', text: "Que bom que voltou! Vamos continuar de onde paramos?" }];
          }
          return prev;
        });
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, currentStep]);

  const resetForm = () => {
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
      case 2: return `[${aff}]! Qual o [WhatsApp] para contato?`;
      case 3: return `O número [${data.countryCode} ${data.phone}] está correto?`;
      case 4: return `[${aff}]! Qual o [Volume mensal] de atendimentos?`;
      case 5: return `[Entendido]. Qual o tamanho da [equipe atual]?`;
      case 6: return `[Show]. Qual o seu melhor [e-mail corporativo]?`;
      case 7: return `Então, deixa eu ver se [eu entendi tudo] certinho:`;
      case 8: return `Já recebemos a sua solicitação! Entraremos em contato o mais breve possível via [WhatsApp]. Deseja fazer uma [nova solicitação]?`;
      default: return "";
    }
  };

  const getOptions = (step: number) => {
    switch(step) {
      case 3: return ["Sim, está correto", "Não, quero corrigir"];
      case 4: return ["Até 1.000", "1.000 a 5.000", "5.000 a 10.000", "Mais de 10.000"];
      case 5: return ["1 a 3", "4 a 10", "11 a 50", "Mais de 50"];
      case 7: return ["Confirmar dados", "Corrigir algo"];
      case 8: return ["Fazer uma nova solicitação"];
      default: return null;
    }
  };

  const advanceChat = (userValue: string, field?: keyof typeof formData) => {
    if (currentStep === 3 && userValue === "Não, quero corrigir") {
      setChatHistory(prev => [...prev, { role: 'user', text: userValue }]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentStep(2);
        setChatHistory(prev => [...prev, { role: 'bot', text: "Sem problemas! Qual o [WhatsApp] correto?" }]);
      }, 800);
      return;
    }

    if (currentStep === 7 && userValue === "Corrigir algo") {
      setChatHistory(prev => [...prev, { role: 'user', text: userValue }]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentStep(1);
        setChatHistory(prev => [...prev, { role: 'bot', text: "Entendido! Vamos recomeçar para garantir que tudo esteja certo. " + initialMsg }]);
      }, 800);
      return;
    }

    if (currentStep === 8 && (userValue === "Reiniciar formulário" || userValue === "Fazer uma nova solicitação")) {
      resetForm();
      return;
    }

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
          .catch(err => console.error("Erro ao notificar API:", err))
          .finally(() => {
            handleWhatsAppRedirect(updatedData);
          });
        }
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isTyping && currentStep < 8) {
      setCurrentStep(prev => prev - 1);
      setChatHistory(prev => prev.slice(0, -2));
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

      // As setas só contam como atalho para voltar de etapa se não estiver editando ou com texto selecionado em um input
      if (!isInput && (e.key === "ArrowUp" || e.key === "ArrowLeft")) {
        e.preventDefault();
        handleBack();
      }

      if (e.key === " " && !isInput) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, isTyping, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-[10px] flex flex-col bg-[#0c0d0d] text-white overflow-hidden rounded-[40px] shadow-2xl border border-white/10"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B597FF]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#38E3FF]/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-50">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF]"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / 8) * 100}%` }}
              />
            </div>

            {/* Header */}
            <div className="shrink-0 flex justify-end p-6 z-50">
              <button 
                onClick={onClose} 
                className="group relative text-sm font-bold text-white/40 hover:text-white transition-all overflow-hidden py-1"
              >
                <span>Fechar</span>
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white transform -translate-x-[110%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </button>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-hidden relative flex flex-col px-6 sm:px-12">
               <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto pr-4 scrollbar-hide"
              >
                <div className="min-h-full flex flex-col justify-start py-10 gap-12">
                  {chatHistory.map((msg, idx) => {
                    const latestBotIdx = chatHistory.map(m => m.role).lastIndexOf('bot');
                    const isLastMessageBot = chatHistory[chatHistory.length - 1]?.role === 'bot';

                    return (
                      <motion.div
                        key={`${idx}-${msg.role}-${msg.text.slice(0, 5)}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-full ${msg.role === 'user' ? 'text-lg sm:text-2xl text-zinc-500 font-medium mb-4' : ''}`}>
                          {msg.role === 'bot' && idx === latestBotIdx ? (
                            <TypewriterQuestion text={msg.text} />
                          ) : (
                            <div className="text-xl sm:text-4xl font-black text-white tracking-tight leading-[1.2] [text-wrap:pretty]">
                              {msg.role === 'bot' ? <HighlightText text={msg.text} /> : msg.text}
                              {msg.role === 'bot' && <span className="text-white/20">.</span>}
                            </div>
                          )}
                        </div>

                        {msg.role === 'bot' && idx === latestBotIdx && !isTyping && isLastMessageBot && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 flex flex-col gap-3 w-full max-w-md"
                          >
                            {currentStep === 7 && (
                              <div className="mb-6 p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-zinc-500">Empresa:</span>
                                  <span className="font-bold text-white">{formData.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-zinc-500">WhatsApp:</span>
                                  <span className="font-bold text-white">{formData.countryCode} {formData.phone}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-zinc-500">Volume:</span>
                                  <span className="font-bold text-white">{formData.volume}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-zinc-500">Equipe:</span>
                                  <span className="font-bold text-white">{formData.team}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-zinc-500">E-mail:</span>
                                  <span className="font-bold text-[#38E3FF]">{formData.email}</span>
                                </div>
                              </div>
                            )}

                            {getOptions(currentStep)?.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => advanceChat(opt, currentStep === 4 ? 'volume' : currentStep === 5 ? 'team' : undefined)}
                                className={`w-full text-left px-6 py-4 rounded-2xl border border-white/10 text-base sm:text-xl font-bold transition-all active:scale-[0.98] ${
                                  opt === "Confirmar dados" || opt === "Sim, está correto" || opt === "Fazer uma nova solicitação"
                                  ? "bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 border-transparent hover:opacity-90"
                                  : "text-zinc-400 hover:border-[#B597FF] hover:text-white hover:bg-white/5"
                                }`}
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
            <div className="shrink-0 px-6 sm:px-12 pt-4 pb-10 z-20">
                <AnimatePresence mode="wait">
                  {!isTyping && chatHistory[chatHistory.length - 1]?.role === 'bot' && (
                    <>
                      {currentStep === 1 && (
                        <motion.div
                          key="name-input"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <form onSubmit={(e) => { e.preventDefault(); if(formData.name.trim()) advanceChat(formData.name, 'name'); }} className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 border-b-2 border-white/10 focus-within:border-[#B597FF] transition-all pb-4">
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
                                placeholder="Nome da empresa..." 
                                className="flex-1 bg-transparent text-xl sm:text-2xl font-bold outline-none placeholder:text-zinc-800" 
                              />
                              <button type="submit" disabled={!formData.name.trim()} className="flex items-center gap-3 group/submit">
                                <span className={`text-[11px] font-medium transition-all duration-300 ${formData.name.trim() ? 'text-[#B597FF] opacity-60' : 'text-zinc-700 opacity-0'}`}>
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
                            <div className="flex items-center gap-4 border-b-2 border-white/10 focus-within:border-[#B597FF] transition-all pb-4">
                              <div className="relative shrink-0" ref={countryRef}>
                                <button 
                                  type="button"
                                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                                >
                                  <span className="text-xl leading-none">
                                    {COUNTRIES.find(c => c.code === formData.countryCode)?.flag || '🇧🇷'}
                                  </span>
                                  <span className="text-lg font-bold text-zinc-400">{formData.countryCode}</span>
                                  <svg className={`w-4 h-4 text-zinc-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="m6 9 6 6 6-6" strokeWidth="3" /></svg>
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
                                placeholder="Seu número aqui..." 
                                className="flex-1 bg-transparent text-xl sm:text-2xl font-bold outline-none placeholder:text-zinc-800" 
                              />
                              <button type="submit" disabled={!isPhoneValid()} className="flex items-center gap-3 group/submit">
                                <span className={`text-[11px] font-medium transition-all duration-300 ${isPhoneValid() ? 'text-[#B597FF] opacity-60' : 'text-zinc-700 opacity-0'}`}>
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
                            <div className="flex items-center gap-4 border-b-2 border-white/10 focus-within:border-[#B597FF] transition-all pb-4">
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
                                placeholder="nome@empresa.com.br..." 
                                className="flex-1 bg-transparent text-xl sm:text-2xl font-bold outline-none placeholder:text-zinc-800" 
                              />
                              <button type="submit" disabled={!formData.email.trim().includes('@')} className="flex items-center gap-3 group/submit">
                                <span className={`text-[11px] font-medium transition-all duration-300 ${formData.email.trim().includes('@') ? 'text-[#B597FF] opacity-60' : 'text-zinc-700 opacity-0'}`}>
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

                <div className="mt-4 flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase pt-4">
                  <button onClick={handleBack} className="hover:text-zinc-400 flex items-center gap-2 transition-colors disabled:opacity-20" disabled={currentStep === 1 || currentStep >= 8}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m15 18-6-6 6-6"/></svg>
                    Voltar
                  </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
