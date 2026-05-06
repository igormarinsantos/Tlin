"use client";

import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export function LiaPopup() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [canShow, setCanShow] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: t.liaPopup.botReply,
      }]);
    }, 1500);
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/5511916248604?text=Olá! Vim pelo site da Tlin e gostaria de falar com a equipe.", "_blank");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[320px] sm:w-[400px] bg-white rounded-3xl border border-zinc-200 shadow-2xl z-50 flex flex-col overflow-hidden h-auto max-h-[75vh]"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 pb-2 bg-white/80 backdrop-blur-md border-b border-zinc-100 z-10">
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-[#0c0d0d] text-base">Lia</span>
                <span className="text-[11px] font-medium text-green-500">{t.liaPopup.online}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 transition-colors"
                aria-label={t.liaPopup.close}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col custom-scrollbar">
              
              {messages.length === 0 ? (
                <>
                  <div className="flex flex-col items-center mt-6 mb-6">
                    <div className="w-12 h-12 mb-3 text-[#B597FF] flex items-center justify-center text-4xl">
                      ✨
                    </div>
                    <h2 className="text-xl font-bold text-[#0c0d0d] mb-1 tracking-tight text-center">{t.liaPopup.title}</h2>
                    <p className="text-sm text-zinc-600 font-medium text-center">{t.liaPopup.subtitle}</p>
                  </div>

                  <div className="flex flex-col mb-5">
                    <button onClick={() => setInputValue(t.liaPopup.suggestion1)} className="flex items-start gap-4 py-3 border-b border-zinc-100/80 hover:bg-zinc-50/50 transition-colors text-left group">
                      <svg className="w-4 h-4 text-zinc-400 mt-0.5 group-hover:text-[#B597FF] transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                      <span className="text-sm text-zinc-700 font-medium leading-snug">{t.liaPopup.suggestion1}</span>
                    </button>
                    <button onClick={() => setInputValue(t.liaPopup.suggestion2)} className="flex items-start gap-4 py-3 border-b border-zinc-100/80 hover:bg-zinc-50/50 transition-colors text-left group">
                      <svg className="w-4 h-4 text-zinc-400 mt-0.5 group-hover:text-[#B597FF] transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                      <span className="text-sm text-zinc-700 font-medium leading-snug">{t.liaPopup.suggestion2}</span>
                    </button>
                    <button onClick={openWhatsApp} className="flex items-center gap-4 py-3 px-4 bg-green-50/50 rounded-xl mt-4 hover:bg-green-100 transition-colors text-left group border border-green-100 shadow-sm">
                      <div className="w-5 h-5 text-green-500 shrink-0">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <span className="text-sm text-green-800 font-bold leading-snug">{t.liaPopup.whatsappBtn}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4 py-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${
                        msg.role === 'user' 
                          ? 'bg-[#B597FF] text-white rounded-tr-none shadow-sm' 
                          : 'bg-zinc-100 text-zinc-800 rounded-tl-none border border-zinc-200/50'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-100 p-3 rounded-2xl rounded-tl-none border border-zinc-200/50 flex gap-1">
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-4 pb-4 bg-white">
               <div className="border border-zinc-200 rounded-2xl bg-zinc-50/50 p-3 pt-4 flex flex-col focus-within:border-[#B597FF]/50 focus-within:bg-white focus-within:ring-2 ring-[#B597FF]/10 transition-all shadow-sm">
                 <textarea 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                   placeholder={t.liaPopup.placeholder}
                   className="bg-transparent border-none outline-none text-sm text-zinc-800 placeholder-zinc-400 resize-none w-full min-h-[60px] font-medium"
                 />
                 <div className="flex justify-end mt-2">
                   <button 
                     onClick={handleSendMessage}
                     disabled={!inputValue.trim()}
                     className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                        inputValue.trim() ? 'bg-[#B597FF] text-white hover:bg-[#a27ef7]' : 'bg-zinc-100 text-zinc-400'
                     }`}
                   >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                   </button>
                 </div>
               </div>
               <p className="text-center text-[10px] text-zinc-400 mt-3 font-medium">
                 {messages.length > 0 ? t.liaPopup.demoMode : t.liaPopup.errorWarning}
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons: Only visible after Hero animation is done */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col sm:flex-row items-center justify-end gap-3">
        <AnimatePresence>
          {canShow && (
            <>
              {/* WhatsApp Quick Button */}
              {!isOpen && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={openWhatsApp}
                  className="w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:bg-[#20bd5a] border border-white/20"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </motion.button>
              )}

              {/* Lia Button */}
              <motion.button
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`flex items-center h-12 bg-[#B597FF] hover:bg-[#a27ef7] text-white rounded-full shadow-xl transition-all border border-white/20 active:scale-95 animate-in fade-in zoom-in duration-300 ${isOpen ? 'px-8 justify-center min-w-[120px]' : 'px-2 pr-6'}`}
              >
                {!isOpen && (
                  <div className="relative shrink-0 pl-2">
                    <span className="text-lg">✨</span>
                  </div>
                )}
                <motion.div initial={false} animate={{ width: "auto", opacity: 1 }} className="overflow-hidden flex-shrink-0 flex items-center justify-center">
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
