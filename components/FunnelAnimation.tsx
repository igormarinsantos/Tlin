"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MousePointer2 } from "lucide-react";

interface Lead {
  id: number;
  name: string;
  avatar: string;
  stage: "topo" | "meio" | "fundo";
  justMoved?: boolean;
}

const names = ["Ricardo M.", "Ana Paula", "Bruno S.", "Lucas G.", "Carla F.", "Roberto T.", "Juliana K."];
const avatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces"
];

const cardColors = [
  "bg-blue-100 border-blue-200 text-blue-700",
  "bg-emerald-100 border-emerald-200 text-emerald-700",
  "bg-amber-100 border-amber-200 text-amber-700",
  "bg-rose-100 border-rose-200 text-rose-700",
  "bg-indigo-100 border-indigo-200 text-indigo-700",
  "bg-cyan-100 border-cyan-200 text-cyan-700"
];

export function FunnelAnimation() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Start with a busy board: many leads in the IA column to show the system at work
    setLeads([
      { id: 10, name: "Lucas G.", avatar: avatars[3], stage: "meio", justMoved: false },
      { id: 9, name: "Carla F.", avatar: avatars[4], stage: "meio", justMoved: false },
      { id: 8, name: "Ana Paula", avatar: avatars[1], stage: "meio", justMoved: false },
      { id: 7, name: "Roberto T.", avatar: avatars[5], stage: "meio", justMoved: false },
      { id: 6, name: "Bruno S.", avatar: avatars[2], stage: "meio", justMoved: false },
      { id: 5, name: "Ricardo M.", avatar: avatars[0], stage: "fundo", justMoved: false },
      { id: 4, name: "Juliana K.", avatar: avatars[5], stage: "fundo", justMoved: false },
      { id: 3, name: "Marcos O.", avatar: avatars[0], stage: "topo", justMoved: false }
    ]);

    const interval = setInterval(() => {
      const newLead: Lead = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        stage: "topo",
        justMoved: false
      };
      
      setLeads(prev => {
        // Move leads forward with independent random chances to create a "push" effect
        const movedLeads = prev.map(l => {
          // 40% chance to stay in stage, 60% to move forward
          const shouldMove = Math.random() > 0.4;
          
          if (shouldMove) {
            if (l.stage === "topo") return { ...l, stage: "meio" as const, justMoved: true };
            if (l.stage === "meio") return { ...l, stage: "fundo" as const, justMoved: true };
          }
          return { ...l, justMoved: false };
        }).filter(l => l.id < 10 || l.id > Date.now() - 15000);

        // Prepend new lead so it's always at the "top" of the logical list
        if (movedLeads.length < 8) {
          return [newLead, ...movedLeads];
        }
        return movedLeads;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
      <div className="w-full h-full max-w-[600px] bg-white/40 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-white/40">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/20 flex items-center justify-between bg-white/20 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B597FF] to-[#8C64FF] flex items-center justify-center text-white shadow-lg shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </div>
            <h4 className="font-black text-xs text-zinc-900 tracking-widest uppercase">Funil de Vendas CRM</h4>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 bg-white/5 p-4 md:p-6 grid grid-cols-3 gap-3 md:gap-5 overflow-hidden">
          
          <Column title="1. Contato" color="#38E3FF" leads={leads.filter(l => l.stage === 'topo')} />
          <Column title="2. IA em Ação ✨" color="#B597FF" leads={leads.filter(l => l.stage === 'meio')} isHighlighted />
          <Column title="3. Fechamento" color="#25D366" leads={leads.filter(l => l.stage === 'fundo')} />

        </div>
      </div>
    </div>
  );
}

function Column({ title, color, leads, isHighlighted }: { title: string, color: string, leads: Lead[], isHighlighted?: boolean }) {
  // Sort leads by ID descending to ensure newest are always at the top of the column
  const sortedLeads = [...leads].sort((a, b) => b.id - a.id);

  return (
    <div className="flex flex-col gap-3 min-w-0 h-full">
      <div className="flex items-center justify-between border-b-2 pb-1.5" style={{ borderColor: color }}>
        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-tight truncate ${isHighlighted ? 'text-zinc-900' : 'text-zinc-700'}`}>
          {title}
        </span>
        <span className="text-[9px] md:text-[10px] font-bold text-zinc-700 bg-white/40 backdrop-blur-sm px-1.5 py-0.5 rounded shrink-0 border border-white/20">{leads.length}</span>
      </div>
      <div className="flex-1 flex flex-col gap-3 relative overflow-hidden pt-1">
        <AnimatePresence mode="popLayout">
          {sortedLeads.map(lead => (
            <AnimatedLeadCard key={lead.id} lead={lead} isHighlighted={isHighlighted} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnimatedLeadCard({ lead, isHighlighted }: { lead: Lead, isHighlighted?: boolean }) {
  const [showMouse, setShowMouse] = useState(lead.justMoved);

  useEffect(() => {
    if (lead.justMoved) {
      setShowMouse(true);
      // Hide the mouse pointer shortly after the transition completes
      const timer = setTimeout(() => setShowMouse(false), 700);
      return () => clearTimeout(timer);
    }
  }, [lead.justMoved, lead.stage]);

  return (
    <motion.div
      layoutId={`kanban-lead-${lead.id}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        zIndex: showMouse ? 50 : 10 
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileLayout={{ 
        scale: 1.05, 
        rotate: 2, 
        zIndex: 50,
        transition: { type: "spring", stiffness: 200, damping: 20 } 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 28,
        layout: { 
          type: "spring", 
          stiffness: 180, 
          damping: 22,
          mass: 1 
        }
      }}
      className={`rounded-xl p-2.5 flex items-center gap-2 w-full backdrop-blur-md transition-shadow duration-300 relative ${
        isHighlighted && lead.stage === 'meio' 
          ? 'bg-white/80 border-2 border-[#B597FF] shadow-[0_15px_30px_-5px_rgba(181,151,255,0.4)]' 
          : 'bg-white/50 border border-white/40 shadow-sm'
      }`}
    >
      <img src={lead.avatar} alt="" className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full object-cover shrink-0 border border-white/40" />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold text-zinc-900 truncate">{lead.name}</div>
        <div className={`text-[8px] font-medium truncate mt-0.5 ${isHighlighted && lead.stage === 'meio' ? 'text-[#8C64FF] font-extrabold' : 'text-zinc-600'}`}>
          {lead.stage === 'topo' && 'Lead Capturado'}
          {lead.stage === 'meio' && 'Qualificando...'}
          {lead.stage === 'fundo' && 'Pronto p/ Venda'}
        </div>
      </div>

      {/* IA Mouse Pointer Drag Effect */}
      <AnimatePresence>
        {showMouse && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, x: 20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="absolute -bottom-5 -right-3 text-[#B597FF] drop-shadow-2xl flex flex-col items-center z-[60]"
          >
            <div className="bg-gradient-to-r from-[#B597FF] to-[#8C64FF] text-white text-[7px] font-black px-1.5 py-0.5 rounded-full mb-0.5 shadow-sm flex items-center gap-0.5">
                ✨ IA
            </div>
            <MousePointer2 className="w-6 h-6 fill-current" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

  );
}
