"use client";
import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MockupPlayer({ children }: { children: (isPlaying: boolean) => ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative w-full h-full group overflow-hidden rounded-2xl">
       {/* Inner content receiving isPlaying state */}
       <div className={`w-full h-full transition-all duration-300 ${!isPlaying ? 'opacity-80 grayscale-[30%]' : ''}`}>
          {children(isPlaying)}
       </div>

       {/* Top-right subtle play/pause control */}
       <div className="absolute top-2 right-2 z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <button 
             onClick={() => setIsPlaying(!isPlaying)}
             aria-label={isPlaying ? "Pausar demonstração" : "Reproduzir demonstração"}
             className="w-7 h-7 rounded-full bg-[#0c0d0d]/80 text-white flex items-center justify-center backdrop-blur-md hover:scale-105 active:scale-95 transition-all shadow-md"
          >
             {isPlaying ? (
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
             ) : (
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
             )}
          </button>
       </div>
       
       {/* Big center play icon when paused */}
       <AnimatePresence>
          {!isPlaying && (
             <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.8 }} 
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
             >
                <div className="w-12 h-12 rounded-full border border-white/20 bg-[#0c0d0d]/50 backdrop-blur-md text-white flex items-center justify-center pl-1 shadow-2xl">
                   <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M8 5v14l11-7z"/></svg>
                </div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  )
}
