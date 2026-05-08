"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";

type Message = {
  role: 'bot' | 'user';
  text: string;
};

type LeadQualificationPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  planName: string | null;
};

export function LeadQualificationPopup({ isOpen, onClose, planName }: LeadQualificationPopupProps) {
  const WHATSAPP_NUMBER = "5511999999999"; // Replace with actual number
  
  const [route, setRoute] = useState<'form' | 'call'>('form');
  
  // Form States (Step-by-step)
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    volume: '',
    team: '',
    tool: '',
    pain: ''
  });
  
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'bot', text: `Olá! Qual o nome da sua empresa?` }
  ]);

  // Call States
  const [callMessages, setCallMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<string>("Conectando...");
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [isTyping, setIsTyping] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset state on close
      setRoute('form');
      setCurrentStep(1);
      setFormData({ name: '', volume: '', team: '', tool: '', pain: '' });
      setChatHistory([{ role: 'bot', text: `Olá! Qual o nome da sua empresa?` }]);
      setCallMessages([]);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Handle WhatsApp Redirect
  const handleWhatsAppRedirect = (data: { name: string, volume: string, team: string, tool: string, pain: string }) => {
    const text = `Olá, vim pelo site e tenho interesse no plano *${planName || 'TLIN'}*.\n\n` +
      `*Nome/Empresa:* ${data.name}\n` +
      `*Volume de Atendimentos:* ${data.volume}\n` +
      `*Tamanho da Equipe:* ${data.team}\n` +
      `*Ferramenta Atual:* ${data.tool}\n` +
      `*Principal Necessidade:* ${data.pain}`;
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onClose();
  };

  // Form Handlers
  const getNextBotMessage = (step: number) => {
    switch(step) {
      case 2: return "Volume mensal de atendimentos?";
      case 3: return "Tamanho da equipe atual?";
      case 4: return "Qual ferramenta vocês usam?";
      case 5: return "Principal dor ou gargalo?";
      default: return "Redirecionando...";
    }
  };

  const advanceChat = (userValue: string) => {
    setChatHistory(prev => [...prev, { role: 'user', text: userValue }]);
    
    if (currentStep < 5) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatHistory(prev => [...prev, { role: 'bot', text: getNextBotMessage(currentStep + 1) }]);
        setCurrentStep(prev => prev + 1);
      }, 1500);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        handleWhatsAppRedirect(formData);
      }, 1000);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    advanceChat(formData.name);
  };
  
  const handleOptionSelect = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    advanceChat(value);
  };

  // --- Voice Call Logic ---

  useEffect(() => {
    if (route === 'call' && typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'pt-BR';
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setCallStatus("Ouvindo...");
        };

        recognitionRef.current.onresult = async (event: any) => {
          let interimText = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimText += event.results[i][0].transcript;
            }
          }
          
          setInterimTranscript(interimText);
          
          if (finalTranscript) {
            setInterimTranscript('');
            setCallMessages(prev => [...prev, { role: 'user', text: finalTranscript }]);
            processUserAudio(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setCallStatus("Erro no microfone. Toque para tentar novamente.");
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Initial Greeting
      const initialMsg = `Olá! Vi que você tem interesse no plano ${planName || 'da TLIN'}. Para te indicar a melhor estrutura e agilizar nosso atendimento, preciso entender um pouquinho da sua operação. Qual o nome da sua empresa?`;
      setCallMessages([{ role: 'bot', text: initialMsg }]);
      speakText(initialMsg);
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, [route, planName]);

  const speakText = (text: string) => {
    if (!synthesisRef.current) return;
    synthesisRef.current.cancel(); // Stop any current speech
    
    // Clean text for speech (remove markdown asterisks)
    const cleanText = text.replace(/\*/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    
    // Try to find a good Portuguese voice
    const voices = synthesisRef.current.getVoices();
    const ptVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCallStatus("Reproduzindo resposta...");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      // Start listening after speaking
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // ignore already started errors
        }
      } else {
        setCallStatus("Microfone não suportado.");
      }
    };

    synthesisRef.current.speak(utterance);
  };

  const processUserAudio = async (text: string) => {
    setCallStatus("Processando...");
    try {
      const response = await fetch('/api/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...callMessages, { role: 'user', text }]
        })
      });

      if (!response.ok) throw new Error('Falha na API');
      const data = await response.json();
      let botText: string = data.text;

      const qualificationMatch = botText.match(/\[QUALIFIED:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/i);
      
      if (qualificationMatch) {
        const [, name, volume, team, tool, pain] = qualificationMatch;
        botText = botText.replace(/\[QUALIFIED:.*?\]/i, '').trim();
        
        if (botText) {
           setCallMessages(prev => [...prev, { role: 'bot', text: botText }]);
           speakText(botText);
        }
        
        // Wait for speech to finish roughly, then redirect
        setTimeout(() => {
          handleWhatsAppRedirect({ name, volume, team, tool, pain });
        }, 3000);
      } else {
        setCallMessages(prev => [...prev, { role: 'bot', text: botText }]);
        speakText(botText);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = "Poxa, deu um erro de conexão. Podemos tentar de novo?";
      setCallMessages(prev => [...prev, { role: 'bot', text: errorMsg }]);
      speakText(errorMsg);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (isSpeaking) synthesisRef.current?.cancel();
      try {
        recognitionRef.current?.start();
      } catch (e) {}
    }
  };


  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
          />

          {/* True Fullscreen Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full flex flex-col bg-[#0c0d0d] text-white overflow-hidden"
          >
            {/* Animated Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B597FF]/10 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#38E3FF]/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

            {/* Simple Close Button Header */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
              <button 
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors shadow-sm"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto z-10 flex flex-col relative">
                {/* SCREEN 2: CHAT INTERFACE */}
                {route === 'form' && (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col max-w-5xl mx-auto w-full h-full px-6 sm:px-12 py-12"
                  >
                    {/* Minimalist Top Nav */}
                    <div className="flex items-center justify-between pb-8 shrink-0">
                      <Image src="/TlinIA.svg" alt="Tlin" width={32} height={32} className="opacity-80" />
                      <button onClick={() => setRoute('call')} className="text-zinc-400 hover:text-white transition-colors font-bold flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                        Responder por voz
                      </button>
                    </div>

                    {/* Chat History (Lottie Style) */}
                    <div className="flex-1 overflow-y-auto space-y-8 sm:space-y-12 flex flex-col scroll-smooth scrollbar-hide pb-20">
                      {chatHistory.map((msg, i) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={i} 
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'text-xl sm:text-3xl text-zinc-400 font-medium' : 'text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] [text-wrap:balance]'}`}>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}

                      {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="text-2xl sm:text-4xl font-black text-zinc-600 animate-pulse tracking-tight">
                            Lia digitando...
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="h-10 shrink-0" />
                    </div>

                    {/* Input Area */}
                    <div className="shrink-0 mt-auto pt-6">
                      <AnimatePresence mode="wait">
                        {!isTyping && currentStep === 1 && (
                          <motion.form 
                            key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                            onSubmit={handleNameSubmit} 
                            className="flex items-center gap-4 border-b-2 border-white/20 focus-within:border-[#B597FF] transition-colors pb-4"
                          >
                            <input autoFocus type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Escreva sua resposta..." className="flex-1 bg-transparent text-2xl sm:text-4xl font-bold text-white outline-none placeholder:text-zinc-600" />
                            <button type="submit" disabled={!formData.name.trim()} className="text-[#B597FF] disabled:opacity-30 hover:text-white transition-colors">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </button>
                          </motion.form>
                        )}

                        {!isTyping && currentStep === 2 && (
                          <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-wrap gap-3 sm:gap-4">
                            {["Até 1.000", "De 1.000 a 5.000", "De 5.000 a 10.000", "Mais de 10.000"].map(opt => (
                              <button key={opt} onClick={() => handleOptionSelect('volume', opt)} className="px-6 py-4 rounded-full border-2 border-white/10 text-lg sm:text-2xl font-bold text-zinc-400 hover:border-[#B597FF] hover:text-white transition-all active:scale-95">{opt}</button>
                            ))}
                          </motion.div>
                        )}

                        {!isTyping && currentStep === 3 && (
                          <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-wrap gap-3 sm:gap-4">
                            {["1 a 3 pessoas", "4 a 10 pessoas", "11 a 50 pessoas", "Mais de 50 pessoas"].map(opt => (
                              <button key={opt} onClick={() => handleOptionSelect('team', opt)} className="px-6 py-4 rounded-full border-2 border-white/10 text-lg sm:text-2xl font-bold text-zinc-400 hover:border-[#B597FF] hover:text-white transition-all active:scale-95">{opt}</button>
                            ))}
                          </motion.div>
                        )}

                        {!isTyping && currentStep === 4 && (
                          <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-wrap gap-3 sm:gap-4">
                            {["WhatsApp", "Zendesk/Intercom", "Chatwoot/RD", "Outra"].map(opt => (
                              <button key={opt} onClick={() => handleOptionSelect('tool', opt)} className="px-6 py-4 rounded-full border-2 border-white/10 text-lg sm:text-2xl font-bold text-zinc-400 hover:border-[#B597FF] hover:text-white transition-all active:scale-95">{opt}</button>
                            ))}
                          </motion.div>
                        )}

                        {!isTyping && currentStep === 5 && (
                          <motion.div key="s5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-wrap gap-3 sm:gap-4">
                            {["Demora p/ responder", "Sem Métricas", "Desorganização", "Custos altos"].map(opt => (
                              <button key={opt} onClick={() => handleOptionSelect('pain', opt)} className="px-6 py-4 rounded-full border-2 border-white/10 text-lg sm:text-2xl font-bold text-zinc-400 hover:border-[#B597FF] hover:text-white transition-all active:scale-95">{opt}</button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* SCREEN 3: CALL INTERFACE */}
                {route === 'call' && (
                  <motion.div 
                    key="call"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full relative"
                  >
                    
                    {/* Call Avatar / Animation */}
                    <div className="relative mb-12">
                      <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden relative z-10 shadow-2xl border-4 border-[#0c0d0d] flex items-center justify-center bg-[#0c0d0d]">
                        <VoicePoweredOrb 
                          enableVoiceControl={isListening || isSpeaking}
                          hue={0}
                          className="w-full h-full scale-110"
                        />
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{callStatus}</h2>
                    <div className="text-zinc-400 font-medium max-w-lg mx-auto mb-12 h-16 sm:h-20 flex items-start justify-center overflow-hidden">
                      {isListening && interimTranscript ? (
                        <span className="text-white italic text-lg">"{interimTranscript}"</span>
                      ) : isSpeaking && callMessages.length > 0 ? (
                        <span className="text-[#B597FF] text-lg">"{callMessages[callMessages.length - 1].text}"</span>
                      ) : isListening ? (
                        "Pode falar, estamos ouvindo..."
                      ) : (
                        "Aguardando..."
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        if (recognitionRef.current) recognitionRef.current.stop();
                        if (synthesisRef.current) synthesisRef.current.cancel();
                        setRoute('form');
                      }}
                      className="text-sm font-bold text-zinc-400 hover:text-white transition-colors underline underline-offset-4 mt-auto mb-4"
                    >
                      Preencher manualmente
                    </button>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
