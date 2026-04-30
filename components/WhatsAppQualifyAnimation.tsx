"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Kanban, MousePointer2 } from "lucide-react";

export function WhatsAppQualifyAnimation() {
  const [step, setStep] = useState(0);

  const leadPhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces";

  // Dynamic step sequencing
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const nextStep = (current: number) => {
      let delay = 1000;
      if (current === 0) delay = 1500; // Read first msg
      else if (current === 1) delay = 1200; // Bot typing...
      else if (current === 2) delay = 2000; // Read bot msg
      else if (current === 3) delay = 1500; // User replies
      else if (current === 4) delay = 1200; // Bot typing...
      else if (current === 5) delay = 1500; // Final bot msg (Zooms in)
      else if (current === 6) delay = 1800; // Dragging phase
      else delay = 3000; // Wait at end before reset
      
      timeout = setTimeout(() => {
        setStep(prev => (prev + 1) % 8);
      }, delay);
    };
    nextStep(step);
    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <div className="absolute inset-0 bg-[#B597FF] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Background blobs for depth */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-0 w-80 h-80 bg-white/30 blur-[100px] rounded-full z-0"
      />
      
      {/* Kanban CRM (Background, fades in) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: step >= 5 ? 1 : 0, 
          scale: step >= 5 ? 1 : 0.95 
        }}
        transition={{ duration: 0.5 }}
        className="absolute w-full max-w-[600px] h-[420px] z-10"
      >
        <KanbanMockup isDragging={step >= 6} leadPhoto={leadPhoto} />
      </motion.div>

      {/* WhatsApp Chat - Stays mounted, just fades/blurs out */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: step >= 6 ? 0 : 1, 
          scale: step >= 6 ? 1.05 : 1,
          filter: step >= 6 ? "blur(15px)" : "blur(0px)",
          pointerEvents: step >= 6 ? "none" : "auto"
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute w-full max-w-[280px] h-[380px] bg-[#efeae2] rounded-2xl border border-white/20 overflow-hidden flex flex-col z-20 shadow-2xl"
      >
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] p-3 pt-4 pb-3 flex items-center gap-3 text-white shrink-0 z-10 relative">
          <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-zinc-200 overflow-hidden shrink-0">
            <img src={leadPhoto} alt="Marcos Oliveira" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold leading-tight truncate">Marcos Oliveira</div>
            <div className="text-[10px] text-white/80 leading-tight mt-0.5">online</div>
          </div>
        </div>

        {/* Chat Body */}
        <div className="p-4 flex flex-col gap-3 h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
          <Message side="right" visible={step >= 0}>
            Bom dia! Vi o anúncio da Tlin.
          </Message>
          
          {step === 1 && <TypingIndicator />}
          <Message side="left" visible={step >= 2} isBot={true}>
            Bom dia! Qual seu volume de leads?
          </Message>
          
          <Message side="right" visible={step >= 3}>
            300 leads por mês.
          </Message>

          {step === 4 && <TypingIndicator />}
          
          {/* Final Message with Subtle Highlight Effect */}
          {step >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: step >= 6 ? 0 : 1, // Fades out when drag starts
                y: 0,
                scale: 1.02 // Subtle zoom, not breaking layout
              }}
              transition={{ duration: 0.3 }}
              className="mt-auto relative z-10"
            >
              <Message side="left" visible={true} isBot={true} isHighlighted={true}>
                Vou te encaminhar agora!
              </Message>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Dragging CRM Card (The Transformation) */}
      <AnimatePresence>
        {step >= 6 && step < 7 && (
          <motion.div
            initial={{ 
              x: -80, // Starts precisely where the message was
              y: 110, 
              scale: 0.9, 
              opacity: 0 
            }}
            animate={{ 
              x: 20, // Direct path to the CRM column
              y: -40,
              scale: 1,
              opacity: 1
            }}
            exit={{ 
              y: -20, // Drops into the column
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.2 }
            }}
            transition={{ 
              type: "spring", 
              damping: 22, 
              stiffness: 120, // Smooth, realistic iOS-like physics
              mass: 1 
            }}
            className="absolute z-50 bg-white rounded-2xl p-4 shadow-[0_30px_60px_-15px_rgba(181,151,255,0.6)] border-2 border-[#B597FF] flex items-center gap-4 min-w-[200px] max-w-[240px] overflow-hidden"
          >
            <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-zinc-100 overflow-hidden border-2 border-[#B597FF]/20 shrink-0">
              <img src={leadPhoto} alt="Marcos Oliveira" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black text-zinc-800 truncate">Marcos Oliveira</div>
              <div className="text-[10px] bg-gradient-to-r from-[#B597FF] to-[#8C64FF] bg-clip-text text-transparent font-black uppercase tracking-wider flex items-center gap-1 truncate mt-0.5">
                ✨ Lead Automado
              </div>
            </div>
            
            {/* Mouse Pointer */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, x: 20, y: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="absolute -bottom-6 -right-6 text-[#B597FF] drop-shadow-xl flex flex-col items-center"
            >
              <div className="bg-gradient-to-r from-[#B597FF] to-[#8C64FF] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full mb-0.5 shadow-sm flex items-center gap-0.5">
                  ✨ IA
              </div>
              <MousePointer2 className="w-8 h-8 fill-current" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white p-3 rounded-2xl rounded-tl-none self-start flex gap-1.5 items-center w-fit border border-black/5"
    >
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
    </motion.div>
  );
}

function KanbanMockup({ isDragging, leadPhoto }: { isDragging: boolean, leadPhoto: string }) {
  return (
    <div className={`w-full h-full flex flex-col bg-[#f8f9fa] rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-400 ${isDragging ? 'opacity-60 blur-[2px]' : 'opacity-100 blur-0'}`}>
      {/* Kanban Header */}
      <div className="bg-white border-b border-zinc-100 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B597FF] to-[#8C64FF] flex items-center justify-center text-white shadow-sm">
            <Kanban className="w-5 h-5" />
          </div>
          <h4 className="font-black text-xs text-zinc-800 tracking-widest uppercase">Pipeline de Vendas</h4>
        </div>
      </div>

      {/* Columns Area */}
      <div className="flex-1 p-5 grid grid-cols-3 gap-5 overflow-hidden h-full">
        <KanbanColumn title="Aguardando" color="#38E3FF" count="2">
          <KanbanCard name="Ricardo" time="2d" tag="ativo" />
          <KanbanCard name="Ana" time="5h" tag="ativo" />
        </KanbanColumn>
        
        <KanbanColumn title="✨ Respondido IA" color="#B597FF" count={!isDragging ? "1" : "0"}>
          {!isDragging && (
            <motion.div
              initial={{ y: -40, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 150 }}
            >
              <KanbanCard name="Marcos" time="agora" tag="tlin" isHighlight photo={leadPhoto} />
            </motion.div>
          )}
        </KanbanColumn>

        <KanbanColumn title="Ganhos" color="#25D366" count="0">
          <div className="h-full min-h-[100px] border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-zinc-300 text-2xl font-black bg-zinc-50/50">+</div>
        </KanbanColumn>
      </div>
    </div>
  );
}

function Message({ children, side, visible, isBot, isHighlighted }: { children: React.ReactNode, side: 'left' | 'right', visible: boolean, isBot?: boolean, isHighlighted?: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25 }}
      className={`max-w-[85%] p-3 rounded-2xl relative border ${
        side === 'right' 
          ? "bg-[#dcf8c6] self-end rounded-tr-none border-black/5" 
          : isHighlighted 
            ? "bg-[#f8f5ff] self-start rounded-tl-none border-[#B597FF]/30 ring-1 ring-[#B597FF]/10 shadow-sm" 
            : "bg-white self-start rounded-tl-none border-black/5"
      }`}
    >
      <div className={`text-xs leading-relaxed font-semibold ${isHighlighted ? 'text-[#4A1D96]' : 'text-zinc-800'}`}>
        {children}
      </div>
      {isBot && (
        <div className="mt-2 flex items-center gap-1 bg-gradient-to-r from-[#B597FF] to-[#8C64FF] px-2.5 py-1 rounded-full w-fit">
          <span className="text-[7px] font-black text-white uppercase tracking-wider flex items-center gap-1">
            ✨ TLIN AI
          </span>
        </div>
      )}
    </motion.div>
  );
}

function KanbanColumn({ title, color, count, children }: { title: string, color: string, count: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 min-w-0 h-full">
      <div className="flex items-center justify-between border-b-2 pb-1.5" style={{ borderColor: color }}>
        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tight truncate">{title}</span>
        <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100/80 px-1.5 py-0.5 rounded">{count}</span>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-hide">
        {children}
      </div>
    </div>
  );
}

function KanbanCard({ name, time, tag, isHighlight, photo }: { name: string, time: string, tag: string, isHighlight?: boolean, photo?: string }) {
  return (
    <div className={`bg-white rounded-xl p-3 border flex flex-col gap-2 ${isHighlight ? 'border-[#B597FF] ring-2 ring-[#B597FF]/20 shadow-md' : 'border-zinc-100 shadow-sm'}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-zinc-100 overflow-hidden shrink-0">
          <img src={photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold text-zinc-800 truncate">{name}</div>
          <div className="text-[8px] text-zinc-400 font-medium">{time}</div>
        </div>
      </div>
      <div className={`px-2 py-1 rounded text-[7px] font-black uppercase w-fit flex items-center gap-1 ${
        tag === 'tlin' ? 'bg-gradient-to-r from-[#B597FF] to-[#8C64FF] text-white shadow-sm' : 'bg-zinc-100 text-zinc-600'
      }`}>
        {tag === 'tlin' && '✨'} {tag === 'tlin' ? 'Qualificado' : tag}
      </div>
    </div>
  );
}
