"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Lead {
  id: number;
  name: string;
  avatar: string;
  stage: "topo" | "meio" | "fundo";
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
    const interval = setInterval(() => {
      const newLead: Lead = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        stage: "topo"
      };
      
      setLeads(prev => {
        const movedLeads = prev.map(l => {
          if (l.stage === "topo") return { ...l, stage: "meio" as const };
          if (l.stage === "meio") return { ...l, stage: "fundo" as const };
          return l;
        }).filter(l => l.id > Date.now() - 12000);

        return [...movedLeads, newLead];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 overflow-hidden pointer-events-none">
      
      {/* Abstract Background for Funnel Card */}
      <div className="absolute inset-0 z-0 bg-[#B597FF]">
         <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
      </div>

      <div className="relative w-full max-w-[320px] h-full flex flex-col items-center justify-center gap-2 z-10 py-10">
        
        {/* TOPO - Wide */}
        <div className="w-full h-[100px] relative flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-white/20 border border-white/30" 
              style={{ clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)", borderRadius: "1rem" }}
            />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white/40 rounded-full text-[9px] font-black text-white uppercase tracking-tighter">Topo do Funil</div>
            <div className="relative z-10 flex flex-wrap justify-center gap-1.5 p-4">
               <AnimatePresence mode="popLayout">
                 {leads.filter(l => l.stage === "topo").map(l => (
                   <LeadCard key={l.id} lead={l} />
                 ))}
               </AnimatePresence>
            </div>
        </div>

        {/* MEIO - Medium */}
        <div className="w-[85%] h-[100px] relative flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-white/30 border border-white/40" 
              style={{ clipPath: "polygon(5% 0%, 95% 0%, 85% 100%, 15% 100%)", borderRadius: "1rem" }}
            />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white/50 rounded-full text-[9px] font-black text-white uppercase tracking-tighter">Qualificação</div>
            <div className="relative z-10 flex flex-wrap justify-center gap-1.5 p-4">
               <AnimatePresence mode="popLayout">
                 {leads.filter(l => l.stage === "meio").map(l => (
                   <LeadCard key={l.id} lead={l} />
                 ))}
               </AnimatePresence>
            </div>
        </div>

        {/* FUNDO - Narrow */}
        <div className="w-[65%] h-[100px] relative flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-white/50 border border-white/60 shadow-xl" 
              style={{ clipPath: "polygon(10% 0%, 90% 0%, 75% 100%, 25% 100%)", borderRadius: "1rem" }}
            />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white/70 rounded-full text-[9px] font-black text-[#B597FF] uppercase tracking-tighter">Venda Final</div>
            <div className="relative z-10 flex flex-wrap justify-center gap-1.5 p-4">
               <AnimatePresence mode="popLayout">
                 {leads.filter(l => l.stage === "fundo").map(l => (
                   <LeadCard key={l.id} lead={l} />
                 ))}
               </AnimatePresence>
            </div>
        </div>

      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const colorClass = cardColors[lead.id % cardColors.length];
  
  return (
    <motion.div
      layoutId={`lead-${lead.id}`}
      initial={{ opacity: 0, scale: 0, y: -40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`${colorClass} px-2.5 py-1.5 rounded-full shadow-lg border backdrop-blur-sm flex items-center gap-1.5`}
    >
      <img src={lead.avatar} alt="" className="w-4 h-4 rounded-full object-cover border border-white/50" />
      <span className="text-[9px] font-black whitespace-nowrap tracking-tight">{lead.name.split(" ")[0]}</span>
    </motion.div>
  );
}
