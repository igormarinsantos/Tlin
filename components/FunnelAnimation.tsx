"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MousePointer2, LayoutDashboard, Users, MessageSquare, BarChart3, Settings } from "lucide-react";

interface Lead {
  id: number;
  name: string;
  avatar: string;
  stage: "topo" | "meio" | "fundo";
  justMoved?: boolean;
}

const names = ["Ricardo M.", "Ana Paula", "Bruno S.", "Lucas G.", "Carla F.", "Roberto T.", "Juliana K.", "Marcos O.", "Fernanda S.", "Paulo R."];
const avatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop"
];

export function FunnelAnimation() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads([
      { id: 12, name: "Paulo R.", avatar: avatars[0], stage: "topo", justMoved: false },
      { id: 11, name: "Fernanda S.", avatar: avatars[4], stage: "meio", justMoved: false },
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
      setLeads(prev => {
        // 1. Move existing leads
        const movedLeads = prev.map(l => {
          let shouldMove = false;
          if (l.stage === "topo") shouldMove = Math.random() > 0.3; // Fast movement to IA
          else if (l.stage === "meio") shouldMove = Math.random() > 0.8; // Varied qualification
          
          if (shouldMove) {
            if (l.stage === "topo") return { ...l, stage: "meio" as const, justMoved: true };
            if (l.stage === "meio") return { ...l, stage: "fundo" as const, justMoved: true };
          }
          return { ...l, justMoved: false };
        }).filter(l => {
          const lifeTime = l.stage === "fundo" ? 10000 : 25000;
          return l.id > Date.now() - lifeTime;
        });

        // 2. Add multiple new leads at once (simulating high volume arrival)
        const currentCount = movedLeads.length;
        const toAdd = Math.min(3, 15 - currentCount);
        const newBatch: Lead[] = [];
        
        if (toAdd > 0) {
          for (let i = 0; i < toAdd; i++) {
            newBatch.push({
              id: Date.now() + i,
              name: names[Math.floor(Math.random() * names.length)],
              avatar: avatars[Math.floor(Math.random() * avatars.length)],
              stage: "topo",
              justMoved: false
            });
          }
          return [...newBatch, ...movedLeads];
        }
        
        return movedLeads;
      });
    }, 1800); // Faster tick for high-intensity flow

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
      {/* Background Animated Blob (Subtle) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#B597FF]/10 to-[#38E3FF]/10 blur-[100px] rounded-full pointer-events-none"
      />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full h-[115%] max-w-[700px] bg-white rounded-t-[2rem] flex shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-zinc-100 relative z-10 translate-y-8 overflow-hidden"
      >
        {/* Lateral Menu (Sidebar) */}
        <div className="w-12 md:w-16 bg-zinc-50 border-r border-zinc-100 flex flex-col items-center py-6 gap-6 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600 mb-4">
             <LayoutDashboard className="w-4 h-4" />
          </div>
          <Users className="w-4 h-4 text-zinc-400" />
          <MessageSquare className="w-4 h-4 text-zinc-400" />
          <BarChart3 className="w-4 h-4 text-zinc-400" />
          <div className="mt-auto">
            <Settings className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-white z-10 shrink-0">
            <div className="flex items-center gap-2">
              <img src="/Logo Horizontal.svg" alt="Tlin.ai" className="h-5 w-auto" />
              <div className="h-4 w-[1px] bg-zinc-200 mx-2" />
              <h4 className="font-bold text-[10px] text-zinc-400 tracking-wider">Kanban</h4>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex-1 bg-zinc-50/30 p-4 md:p-6 grid grid-cols-3 gap-3 md:gap-5 overflow-hidden">
            <Column title="1. Novos Leads" color="#38E3FF" leads={leads.filter(l => l.stage === 'topo')} />
            <Column title="2. IA Qualificando ✨" color="#B597FF" leads={leads.filter(l => l.stage === 'meio')} isHighlighted />
            <Column title="3. Prontos p/ Venda" color="#25D366" leads={leads.filter(l => l.stage === 'fundo')} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Column({ title, color, leads, isHighlighted }: { title: string, color: string, leads: Lead[], isHighlighted?: boolean }) {
  const sortedLeads = [...leads].sort((a, b) => b.id - a.id);

  return (
    <div className="flex flex-col gap-3 min-w-0 h-full">
      <div className="flex flex-col border-b-2 pb-1.5" style={{ borderColor: color }}>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis ${isHighlighted ? 'text-zinc-900' : 'text-zinc-400'}`}>
            {title}
          </span>
          <span className="text-[8px] md:text-[9px] font-bold text-zinc-500 bg-white px-1.5 py-0.5 rounded shadow-sm border border-zinc-100 shrink-0">{leads.length}</span>
        </div>
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
        rotate: 1, 
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
      className={`rounded-xl p-2 md:p-2.5 flex items-center gap-2 w-full transition-shadow duration-300 relative ${
        isHighlighted && lead.stage === 'meio' 
          ? 'bg-white border-2 border-[#B597FF]' 
          : 'bg-white border border-zinc-100 shadow-sm'
      }`}
    >
      <img src={lead.avatar} alt="" className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover shrink-0 border border-zinc-100" />
      <div className="min-w-0 flex-1">
        <div className="text-[9px] md:text-[10px] font-black text-zinc-800 truncate leading-tight">{lead.name}</div>
        <div className={`text-[7px] md:text-[8px] font-bold truncate mt-0.5 ${isHighlighted && lead.stage === 'meio' ? 'text-[#B597FF]' : 'text-zinc-400'}`}>
          {lead.stage === 'topo' && 'Capturado'}
          {lead.stage === 'meio' && 'Qualificando...'}
          {lead.stage === 'fundo' && 'Disponível'}
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
            <div className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-white text-[7px] font-black px-2 py-0.5 rounded-full mb-0.5 shadow-md flex items-center gap-0.5">
                ✨ IA
            </div>
            <MousePointer2 className="w-6 h-6 fill-current" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
