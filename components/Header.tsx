"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Bot, MessageSquare, Zap, Target, BookOpen, Newspaper, ChevronRight } from "lucide-react";

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('PT');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: 'PT', flag: '🇧🇷', name: 'Português' },
    { code: 'EN', flag: '🇺🇸', name: 'English' },
    { code: 'ES', flag: '🇪🇸', name: 'Español' },
  ];

  const current = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-zinc-100 transition-colors text-sm font-semibold text-zinc-600 focus:outline-none"
      >
        <span className="text-base leading-none drop-shadow-sm">{current.flag}</span>
        <span className="hidden sm:inline-block tracking-tight">{lang}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-36 bg-white border border-zinc-100 rounded-2xl shadow-xl overflow-hidden py-1 z-50"
          >
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setIsOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
              >
                <span className="text-base leading-none drop-shadow-sm">{l.flag}</span>
                <span className="text-sm font-semibold text-zinc-600">{l.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MegaMenu() {
  const menuItems = [
    {
      title: "Agentes de IA",
      links: [
        { name: "Vendas e Conversão", desc: "IA treinada para fechar negócios.", icon: <Target className="w-5 h-5" /> },
        { name: "Qualificação de Leads", desc: "Filtre os melhores leads no WhatsApp.", icon: <Bot className="w-5 h-5" /> },
        { name: "Suporte 24/7", desc: "Atendimento imediato e humano.", icon: <MessageSquare className="w-5 h-5" /> },
      ]
    },
    {
      title: "Recursos",
      links: [
        { name: "Blog da Tlin", desc: "Novidades e estratégias de IA.", icon: <Newspaper className="w-5 h-5" /> },
        { name: "Documentação", desc: "Guia completo de integração.", icon: <BookOpen className="w-5 h-5" /> },
        { name: "API Reference", desc: "Para desenvolvedores e automações.", icon: <Zap className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 p-8 bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] w-[600px] z-[100]"
    >
      <div className="grid grid-cols-2 gap-10">
        {menuItems.map((category) => (
          <div key={category.title}>
            <h4 className="text-[11px] font-bold tracking-wide text-zinc-400 mb-6 px-4">{category.title}</h4>
            <div className="flex flex-col gap-2">
              {category.links.map((link) => (
                <a 
                  key={link.name} 
                  href="#" 
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-all group/item"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-[#B597FF] group-hover/item:bg-[#B597FF] group-hover/item:text-white transition-all shadow-sm">
                    {link.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900 mb-0.5 flex items-center gap-1">
                      {link.name}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-4px] group-hover/item:translate-x-0" />
                    </div>
                    <p className="text-xs font-medium text-zinc-500 leading-snug">{link.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-8 border-t border-zinc-100 flex items-center justify-between px-4">
        <p className="text-xs font-medium text-zinc-400">Pronto para transformar sua operação?</p>
        <a href="#pricing" className="text-xs font-bold text-[#B597FF] hover:underline transition-all">Ver todos os planos →</a>
      </div>
    </motion.div>
  );
}

function NavLinks() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <nav className="flex items-center gap-2 font-semibold text-sm text-zinc-600 relative">
      <div 
        className="relative py-2 px-4 cursor-pointer hover:text-[#0c0d0d] transition-colors"
        onMouseEnter={() => setHoveredLink('solucoes')}
        onMouseLeave={() => setHoveredLink(null)}
      >
        <div className="flex items-center gap-1">
          Soluções
          <svg className={`w-3 h-3 transition-transform duration-300 ${hoveredLink === 'solucoes' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>
        
        <AnimatePresence>
          {hoveredLink === 'solucoes' && (
            <>
              {/* Invisible bridge to prevent menu from closing when moving mouse from link to menu */}
              <div className="absolute top-full left-0 w-full h-4" />
              <MegaMenu />
            </>
          )}
        </AnimatePresence>
      </div>

      <a href="#roi" className="py-2 px-4 hover:text-[#0c0d0d] transition-colors">Simulador</a>
      <a href="#pricing" className="py-2 px-4 hover:text-[#0c0d0d] transition-colors">Preços</a>
      <a href="#faq" className="py-2 px-4 hover:text-[#0c0d0d] transition-colors">Dúvidas</a>
    </nav>
  );
}

/**
 * Animated Button for Header (matches Hero design)
 */
function HeaderCTA({ padding = "px-5 py-2.5" }: { padding?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  return (
    <div className="relative">
      <a 
        href="#pricing"
        className={`relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer ${isHovered ? 'z-[100]' : 'z-10'} block`}
        onMouseEnter={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           mouseX.set(e.clientX - rect.left);
           mouseY.set(e.clientY - rect.top);
           setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           mouseX.set(e.clientX - rect.left);
           mouseY.set(e.clientY - rect.top);
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-150%] opacity-100 transition-opacity"
          style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 180deg, transparent 240deg 360deg)` }}
        />
        <div className={`relative ${padding} rounded-full bg-[#0c0d0d] text-white text-[12px] font-bold transition-all z-10 group-hover/btn:text-[#0c0d0d] flex items-center justify-center text-center`}>
          <span className="relative z-10">Começar agora</span>
          <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-300 group-hover/btn:opacity-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
        </div>
      </a>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{ position: "absolute", left: springX, top: springY, x: "15px", y: "-50%", zIndex: 200, pointerEvents: "none" }}
            className="px-2 py-0.5 bg-zinc-950 rounded-full border border-white/10 shadow-xl whitespace-nowrap"
          >
            <span className="text-[9px] font-bold text-white tracking-wide leading-none">Demo 100% grátis</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const { scrollY } = useScroll();
  const [showFloating, setShowFloating] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest < 150) {
      setShowFloating(false);
    } else if (latest < previous) {
      setShowFloating(true);
    } else {
      setShowFloating(false);
    }
  });

  return (
    <>
      {/* 1. Top Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-[var(--fd-banner-height,0px)] left-0 right-0 z-[100] pt-6 px-4 md:px-6 w-full max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 cursor-pointer">
             <img src="/Logo%20Horizontal.svg" alt="Tlin Logo" className="h-7 w-auto" />
          </div>

          <div className="hidden md:block">
            <NavLinks />
          </div>

          <div className="flex items-center gap-2">
             <LanguageSelector />
             <a href="#" className="hidden md:block px-4 py-2 text-sm font-bold text-zinc-600 hover:text-[#0c0d0d] transition-colors">
                Entrar
             </a>
             <HeaderCTA padding="px-5 py-2.5" />
          </div>
        </div>
      </motion.header>

      {/* 2. Floating Header */}
      <AnimatePresence>
        {showFloating && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4"
          >
            <div className="pointer-events-auto flex items-center justify-between overflow-hidden bg-white border border-zinc-200 shadow-lg rounded-full px-4 py-2 w-max gap-8 transition-all hover:bg-zinc-50">
              
              <div className="flex items-center gap-2 cursor-pointer">
                 <img src="/Logo%20Horizontal.svg" alt="Tlin Logo" className="h-6 w-auto" />
              </div>

              <div className="hidden lg:block">
                <NavLinks />
              </div>

              <div className="flex items-center gap-2">
                 <LanguageSelector />
                 <HeaderCTA padding="px-4 py-2" />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}

