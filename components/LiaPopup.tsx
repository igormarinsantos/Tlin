"use client";

import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export function LiaPopup() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [canShow, setCanShow] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, type: 'text' | 'handoff'}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState("online");
  const [placeholder, setPlaceholder] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fullPlaceholder = "Pergunte qualquer coisa para Lia...";

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
  }, [isOpen]);

  const { scrollY } = useScroll();

  useEffect(() => {
    // Listen for custom open event
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-lia-chat", handleOpen);
    
    // Use scrollY to determine when to show the popup (after passing Hero section)
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest > 400) {
        setCanShow(true);
      } else {
        setCanShow(false);
      }
    });

    return () => {
      window.removeEventListener("open-lia-chat", handleOpen);
      unsubscribe();
    };
  }, [scrollY]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const openWhatsApp = () => {
    window.open("https://wa.me/5511916248604?text=Olá! Vim pelo site da Tlin e gostaria de falar com a equipe.", "_blank");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg, type: 'text' }]);
    setInputValue("");
    setIsTyping(true);
    setStatus("digitando...");

    // Call Gemini API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: 'user', text: userMsg }] }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI response");
      
      const data = await response.json();
      const botResponse = data.text;
      
      setIsTyping(false);
      setStatus("online");

      // Process tools (scroll)
      const scrollMatch = botResponse.match(/\[scrollToSection:(\w+)\]/);
      if (scrollMatch) {
        const sectionId = scrollMatch[1];
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const lenis = (window as any).lenis;
            const customOffset = sectionId === 'pricing' ? -20 : -80;
            if (lenis) {
              lenis.scrollTo(element, { offset: customOffset });
            } else {
              const elementPosition = element.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: elementPosition - customOffset,
                behavior: "smooth"
              });
            }
          }
        }, 500);
      }

      // Clean tool tags and split into blocks
      const cleanText = botResponse.replace(/\[scrollToSection:\w+\]/g, "").replace(/\[openWhatsApp\]/g, "").trim();
      const blocks = cleanText.split('\n').filter(b => b.trim() !== "");

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        setStatus("digitando...");
        setIsTyping(true);
        
        // Human-like typing delay formula: 25ms per char, cap at 2.5s
        const typingDelay = Math.min(block.length * 25, 2500);
        await new Promise(r => setTimeout(r, typingDelay));
        
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'bot', text: block, type: 'text' }]);
        setStatus("online");
        
        if (i < blocks.length - 1) {
          await new Promise(r => setTimeout(r, 600)); // Pause between blocks
        }
      }

      if (botResponse.includes("[openWhatsApp]")) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: "",
          type: 'handoff'
        }]);
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setStatus("online");
      setMessages(prev => [...prev, 
        { 
          role: 'bot', 
          text: "Ops, tive um probleminha técnico. Pode tentar de novo ou clicar no botão aqui embaixo?",
          type: 'text'
        },
        {
          role: 'bot',
          text: "",
          type: 'handoff'
        }
      ]);
    }
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
        className="bg-green-50 border border-green-200 rounded-2xl p-4 flex flex-col items-center gap-3 w-full"
      >
        <div className="flex flex-col items-center gap-1 text-green-700 font-bold text-sm">
          Encaminhando para nossa equipe...
          {!isCancelled && !isRedirected && (
            <span className="text-[10px] font-medium opacity-60">Redirecionando em {countdown}s</span>
          )}
        </div>

        {!isCancelled ? (
          <div className="w-full flex flex-col items-center gap-2">
            <button 
              onClick={handleRedirect}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group"
            >
              {isRedirected ? "Abrindo WhatsApp..." : "Abrir WhatsApp Agora"}
            </button>
            <button 
              onClick={handleCancel}
              className="text-[11px] text-green-700/50 hover:text-green-700 font-bold underline transition-colors"
            >
              Cancelar redirecionamento
            </button>
          </div>
        ) : (
          <div className="text-green-800 font-bold text-sm py-2">
            Encaminhamento cancelado.
          </div>
        )}

        <p className="text-[10px] text-green-600/70 font-medium text-center">
          {!isCancelled ? "Você será redirecionado automaticamente" : "Clique no botão de WhatsApp se mudar de ideia."}
        </p>
      </motion.div>
    );
  }

  const FormattedMessage = ({ text }: { text: string }) => {
    if (!text) return null;
    
    // Split by strategic tags [strategic:...] and bold **...**
    const parts = text.split(/(\[strategic:.*?\]|\*\*.*?\*\*)/g);
    
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
            className="fixed bottom-24 right-6 w-[320px] sm:w-[400px] bg-white rounded-3xl border border-zinc-200 z-50 flex flex-col overflow-hidden h-[500px] max-h-[80vh]"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-zinc-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                  <img 
                    src="/LIA PERFIL.png" 
                    alt="Lia" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-[#0c0d0d] text-base leading-none">Lia</span>
                    <span className="text-[11px] font-bold bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent transition-all duration-300">
                      {status}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
                aria-label={t.liaPopup.close}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 flex flex-col custom-scrollbar bg-[#FAFAFA]/50 min-h-0 overscroll-contain">
              
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center pb-4">
                  <div className="flex flex-col items-center mb-2">
                    <h2 className="text-base font-black text-[#0c0d0d] mb-0.5 tracking-tight text-center px-4">Olá 👋 Eu sou a Lia</h2>
                    <p className="text-[11px] text-zinc-500 font-medium text-center px-10 leading-snug opacity-80">Sua copiloto comercial. Como posso ajudar?</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button onClick={() => setInputValue(t.liaPopup.suggestion1)} className="flex items-center justify-between gap-4 py-2 px-4 bg-white border border-zinc-100 rounded-xl hover:border-[#B597FF]/30 hover:shadow-sm transition-all text-left group">
                      <span className="text-[12px] text-zinc-700 font-bold leading-tight">{t.liaPopup.suggestion1}</span>
                      <svg className="w-3 h-3 text-zinc-300 group-hover:text-[#B597FF] transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                    </button>
                    <button onClick={() => setInputValue(t.liaPopup.suggestion2)} className="flex items-center justify-between gap-4 py-2 px-4 bg-white border border-zinc-100 rounded-xl hover:border-[#B597FF]/30 hover:shadow-sm transition-all text-left group">
                      <span className="text-[12px] text-zinc-700 font-bold leading-tight">{t.liaPopup.suggestion2}</span>
                      <svg className="w-3 h-3 text-zinc-300 group-hover:text-[#B597FF] transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                    </button>
                    <button onClick={openWhatsApp} className="flex items-center justify-center gap-3 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl mt-1 transition-all group">
                      <div className="w-4 h-4 shrink-0">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <span className="text-[12px] font-bold tracking-tight">{t.liaPopup.whatsappBtn}</span>
                    </button>
                  </div>
                </div>

              ) : (
                <div className="flex flex-col gap-4 py-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.role === 'bot' && msg.type !== 'handoff' && (
                         <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 mt-1">
                           <img 
                             src="/LIA PERFIL.png" 
                             alt="Lia" 
                             className="w-full h-full object-cover"
                           />
                         </div>
                      )}
                      
                      {msg.type === 'handoff' ? (
                        <WhatsAppHandoff />
                      ) : (
                        <div className={`max-w-[82%] p-3.5 rounded-2xl text-[13px] font-semibold leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 rounded-tr-none shadow-sm' 
                            : 'bg-white text-zinc-800 rounded-tl-none border border-zinc-200'
                        }`}>
                          <FormattedMessage text={msg.text} />
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-start gap-2">
                       <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 mt-1 shadow-sm">
                         <img 
                           src="/LIA PERFIL.png" 
                           alt="Lia" 
                           className="w-full h-full object-cover"
                         />
                       </div>
                      <div className="bg-white px-3 py-2.5 rounded-xl rounded-tl-none border border-zinc-200 flex gap-1 items-center">
                        <span className="w-1 h-1 bg-[#B597FF] rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-[#B597FF] rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-1 bg-[#B597FF] rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-5 pb-5 bg-white border-t border-zinc-100">
               <div className="mt-4 border border-zinc-200 rounded-2xl bg-white p-3 py-4 flex flex-col focus-within:border-[#B597FF]/50 focus-within:ring-4 ring-[#B597FF]/5 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                 <textarea 
                   aria-label="Mensagem para Lia"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                   placeholder={placeholder}
                   className="bg-transparent border-none outline-none text-sm text-zinc-800 placeholder-zinc-400 resize-none w-full min-h-[60px] font-semibold leading-relaxed"
                 />
                 <div className="flex justify-end mt-1">
                   <button 
                     aria-label="Enviar mensagem"
                     onClick={handleSendMessage}
                     disabled={!inputValue.trim()}
                     className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        inputValue.trim() ? 'bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-[#0c0d0d]' : 'bg-zinc-100 text-zinc-400'
                     }`}
                   >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                   </button>
                 </div>
               </div>
               <p className="text-center text-[10px] text-zinc-400 mt-4 font-medium opacity-60">
                 a lia pode cometer falhar verifique antes
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons: Only visible after Hero animation is done */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
        <AnimatePresence>
          {canShow && (
            <>
              {/* Lia Button */}
              <motion.button
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                exit={{ y: 200 }}
                transition={{ duration: 0.875, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`flex items-center h-12 bg-[#B597FF] hover:bg-[#a27ef7] text-white rounded-full transition-all border border-white/20 active:scale-95 ${isOpen ? 'px-8 justify-center min-w-[120px]' : 'px-2 pr-6'}`}
              >
                {!isOpen && (
                  <div className="relative shrink-0 pl-2">
                    <span className="text-lg">✨</span>
                  </div>
                )}
                <motion.div initial={false} animate={{ opacity: 1 }} className="overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <span className={`font-bold text-[13px] whitespace-nowrap ${isOpen ? 'pl-0' : 'pl-2'}`}>
                    {isOpen ? t.liaPopup.close : t.liaPopup.talkToLia}
                  </span>
                </motion.div>
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
