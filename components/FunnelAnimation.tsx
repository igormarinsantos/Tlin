"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useVelocity, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { MousePointer2, LayoutDashboard, Users, MessageSquare, BarChart3, Settings, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface Lead {
  id: number;
  name: string;
  avatar: string;
  stage: "topo" | "meio" | "fundo";
  justMoved?: boolean;
  hasCursor?: boolean;
  origin?: string;
  meetingDate?: string;
}

const names = ["Ricardo M.", "Ana Paula", "Bruno S.", "Lucas G.", "Carla F.", "Roberto T.", "Juliana K.", "Marcos O.", "Fernanda S.", "Paulo R."];
const hours = ["09:00", "10:30", "14:00", "15:30", "17:00"];
const avatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop"
];

export function FunnelAnimation() {
  const { t } = useLanguage();
  const f = t.funnelAnimation;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const xVelocity = useVelocity(cursorX);
  const xSwing = useTransform(xVelocity, [-1000, 1000], [25, -25]);
  const rotateSwing = useTransform(xVelocity, [-1000, 1000], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  useEffect(() => {
    setLeads([
      { id: 12, name: "Paulo R.", avatar: avatars[0], stage: "topo", justMoved: false, hasCursor: false, origin: f.origins[0] },
      { id: 11, name: "Fernanda S.", avatar: avatars[4], stage: "meio", justMoved: false, hasCursor: false },
      { id: 10, name: "Lucas G.", avatar: avatars[3], stage: "meio", justMoved: false, hasCursor: false },
      { id: 9, name: "Carla F.", avatar: avatars[4], stage: "meio", justMoved: false, hasCursor: false },
      { id: 8, name: "Ana Paula", avatar: avatars[1], stage: "meio", justMoved: false, hasCursor: false },
      { id: 7, name: "Roberto T.", avatar: avatars[5], stage: "meio", justMoved: false, hasCursor: false },
      { id: 6, name: "Bruno S.", avatar: avatars[2], stage: "meio", justMoved: false, hasCursor: false },
      { id: 5, name: "Ricardo M.", avatar: avatars[0], stage: "fundo", justMoved: false, hasCursor: false, meetingDate: `${f.days[1]}, 14:00` },
      { id: 4, name: "Juliana K.", avatar: avatars[5], stage: "fundo", justMoved: false, hasCursor: false, meetingDate: `${f.days[0]}, 16:30` },
      { id: 3, name: "Marcos O.", avatar: avatars[0], stage: "topo", justMoved: false, hasCursor: false, origin: f.origins[1] }
    ]);

    const interval = setInterval(() => {
      setLeads(prev => {
        let nextLeads = [...prev];
        
        // Find oldest 'meio' to move to 'fundo'
        const oldestMeio = [...nextLeads].reverse().find(l => l.stage === "meio");
        
        let cursorAssigned = false;
        
        nextLeads = nextLeads.map(l => {
          let stage = l.stage;
          let justMoved = false;
          
          // All topo move to meio (IA qualificar)
          if (l.stage === "topo") {
            stage = "meio";
            justMoved = true;
          }
          // Move oldest from meio to fundo (1 by 1)
          else if (oldestMeio && l.id === oldestMeio.id) {
            stage = "fundo";
            justMoved = true;
            l.meetingDate = `${f.days[Math.floor(Math.random() * f.days.length)]}, ${hours[Math.floor(Math.random() * hours.length)]}`;
          }
          
          let hasCursor = false;
          if (justMoved && !cursorAssigned) {
            hasCursor = true;
            cursorAssigned = true;
          }
          
          return { ...l, stage, justMoved, hasCursor };
        }).filter(l => {
          const lifeTime = l.stage === "fundo" ? 120000 : 60000;
          return l.id > (Date.now() - lifeTime);
        });

        // Ensure the loop never stops by feeding new leads
        if (nextLeads.filter(l => l.stage !== "fundo").length < 6) {
          const toAdd = Math.floor(Math.random() * 2) + 1;
          const newBatch: Lead[] = [];
          for (let i = 0; i < toAdd; i++) {
            newBatch.push({
              id: Date.now() + i,
              name: names[Math.floor(Math.random() * names.length)],
              avatar: avatars[Math.floor(Math.random() * avatars.length)],
              stage: "topo",
              justMoved: false,
              hasCursor: false,
              origin: f.origins[Math.floor(Math.random() * f.origins.length)]
            });
          }
          nextLeads = [...newBatch, ...nextLeads];
        }
        
        return nextLeads;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center p-4 md:p-8 overflow-hidden cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* User Tracking Badge & Custom Cursor */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ 
              x: cursorX, 
              y: cursorY,
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 200,
              pointerEvents: "none"
            }}
            className="flex items-start justify-start"
          >
            {/* Custom Pointer Icon */}
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="#38E3FF" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinejoin="round"
              className="absolute top-0 left-0 drop-shadow-md z-10"
              style={{ transform: "rotate(-10deg) translate(-2px, -2px)" }}
            >
              <path d="M4.5 3L21 12L13.5 14.5L11 22L4.5 3Z" />
            </svg>

            {/* The Badge */}
            <motion.div 
              style={{ x: xSwing, rotate: rotateSwing }}
              className="mt-5 ml-4 px-3 py-1 bg-[#38E3FF] text-[#0c0d0d] rounded-full shadow-xl shadow-[#38E3FF]/20 border border-white/20 origin-top flex items-center justify-center relative z-0"
            >
              <span className="text-[10px] font-black tracking-tight leading-none">{f.you}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        {/* Lateral Menu (Sidebar) - Premium Light Style */}
        <div className="w-12 md:w-14 bg-white border-r border-zinc-100 flex flex-col items-center py-8 gap-7 shrink-0">
          <div className="w-8 h-8 flex items-center justify-center mb-2">
             <img src="/favicon.svg" alt="Tlin Logo" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col gap-7 items-center">
            <LayoutDashboard className="w-4 h-4 text-[#B597FF]" />
            <Users className="w-4 h-4 text-zinc-300" />
            <MessageSquare className="w-4 h-4 text-zinc-300" />
            <BarChart3 className="w-4 h-4 text-zinc-300" />
          </div>
          
          <div className="mt-auto flex flex-col gap-6 items-center">
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-100 bg-white z-10 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm text-zinc-800 tracking-tight">{f.title}</h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded-md border border-indigo-100/50">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     className="w-2.5 h-2.5 border-2 border-indigo-200 border-t-indigo-600 rounded-full" 
                   />
                   <span className="text-[9px] text-indigo-600 font-bold tracking-tight">{f.updating}</span>
                </div>
              </div>
            </div>
            
            {/* Filters Row */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg border border-zinc-100 bg-zinc-50 flex items-center gap-2 cursor-pointer">
                <span className="text-[10px] font-bold text-zinc-600">{f.general}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="px-3 py-1.5 rounded-lg border border-zinc-100 bg-zinc-50 flex items-center gap-2 cursor-pointer">
                <Users className="w-3 h-3 text-zinc-400" />
                <span className="text-[10px] font-bold text-zinc-600">{f.allInboxes}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex-1 bg-zinc-50/30 p-4 md:p-6 grid grid-cols-3 gap-3 md:gap-5">
            <Column title={f.col1} color="#38E3FF" leads={leads.filter(l => l.stage === 'topo')} bgColor="bg-[#38E3FF]/10" />
            <Column title={f.col2} color="#B597FF" leads={leads.filter(l => l.stage === 'meio')} isHighlighted bgColor="bg-[#B597FF]/10" />
            <Column title={f.col3} color="#25D366" leads={leads.filter(l => l.stage === 'fundo')} bgColor="bg-[#25D366]/10" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Column({ title, color, leads, isHighlighted, bgColor }: { title: string, color: string, leads: Lead[], isHighlighted?: boolean, bgColor?: string }) {
  const sortedLeads = [...leads].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className={`flex flex-col gap-3 min-w-0 h-full rounded-xl p-2 ${bgColor || ''}`}>
      <div className="flex flex-col mb-1">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black tracking-tight ${isHighlighted ? 'text-zinc-900' : 'text-zinc-500'}`}>
              {title}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3 relative pt-1 overflow-hidden max-h-[450px]">
        <AnimatePresence>
          {sortedLeads.map(lead => (
            <AnimatedLeadCard key={lead.id} lead={lead} isHighlighted={isHighlighted} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnimatedLeadCard({ lead, isHighlighted }: { lead: Lead, isHighlighted?: boolean }) {
  const { t } = useLanguage();
  const f = t.funnelAnimation;
  const [showMouse, setShowMouse] = useState(lead.hasCursor);

  useEffect(() => {
    if (lead.hasCursor) {
      setShowMouse(true);
      const timer = setTimeout(() => setShowMouse(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [lead.hasCursor, lead.stage]);

  return (
    <motion.div
      layout
      layoutId={`kanban-lead-${lead.id}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        zIndex: showMouse ? 100 : 10,
        boxShadow: showMouse ? "0 25px 50px -12px rgba(181, 151, 255, 0.25)" : "none"
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        type: "spring", 
        stiffness: showMouse ? 150 : 300, 
        damping: showMouse ? 15 : 25,
        layout: { 
          type: "spring", 
          stiffness: showMouse ? 150 : 250, 
          damping: showMouse ? 15 : 25,
          mass: 0.8
        }
      }}
      className={`rounded-xl flex items-center gap-2 w-full transition-colors duration-300 relative group/card origin-center ${
        showMouse ? 'bg-white shadow-2xl p-2 md:p-2.5' :
        isHighlighted && lead.stage === 'meio' 
          ? 'p-[2px]' 
          : 'bg-white border border-zinc-100 shadow-sm p-2 md:p-2.5'
      }`}
    >
      {!showMouse && isHighlighted && lead.stage === 'meio' && (
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 z-0 rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(270deg, #B597FF, #38E3FF, #B597FF)",
            backgroundSize: "200% 200%",
          }}
        />
      )}

      {showMouse && (
        <>
          <style>{`
            @keyframes marchingAnts {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: -20; }
            }
          `}</style>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ borderRadius: '12px' }}>
            <rect 
              x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="11" ry="11"
              fill="none" 
              stroke="#38E3FF" 
              strokeWidth="2.5" 
              strokeDasharray="6 6" 
              style={{ animation: 'marchingAnts 0.5s infinite linear' }}
            />
          </svg>
        </>
      )}
      
      <div className={`flex-1 flex items-center gap-2 relative z-10 w-full ${!showMouse && isHighlighted && lead.stage === 'meio' ? 'bg-white rounded-[10px] p-2 md:p-2.5' : ''}`}>
        <img src={lead.avatar} alt="" className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover shrink-0 border border-zinc-100" />
        <div className="min-w-0 flex-1">
          <div className="text-[9px] md:text-[10px] font-black text-zinc-800 truncate leading-tight">{lead.name}</div>
          <div className={`text-[7px] md:text-[8px] font-bold truncate mt-0.5 ${isHighlighted && lead.stage === 'meio' ? 'text-[#B597FF]' : 'text-zinc-400'}`}>
            {lead.stage === 'topo' && (lead.origin || f.capturedVia)}
            {lead.stage === 'meio' && f.qualifying}
            {lead.stage === 'fundo' && (lead.meetingDate ? `${f.meeting} ${lead.meetingDate}` : f.scheduled)}
          </div>
        </div>
      </div>

      {/* IA Mouse Pointer Drag Effect - Dynamic Tracking Style */}
      <AnimatePresence>
        {showMouse && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, x: 20, y: 20, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute -bottom-5 right-2 flex items-center gap-1.5 pointer-events-none z-[100]"
          >
            <motion.img 
              src="/TlinIA.svg" 
              alt="Tlin IA" 
              className="w-5 h-5 drop-shadow-xl" 
            />
            
            {/* Name Capsule with trailing effect */}
            <motion.div 
              initial={{ opacity: 0, x: -15, rotate: -10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.1 }}
              className="px-2.5 py-0.5 bg-[#B597FF] rounded-full shadow-lg shadow-[#B597FF]/30 border border-white/20 flex items-center justify-center origin-left"
            >
              <span className="text-white text-[8px] font-bold tracking-tight leading-none">Tlin IA</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
