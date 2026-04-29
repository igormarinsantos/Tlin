"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden flex flex-col bg-[#B597FF]/10 z-[9999]">
      {/* Custom Header for 404 */}
      <header className="absolute top-0 left-0 w-full p-8 z-50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/Logo%20Horizontal.svg" alt="Tlin Logo" className="h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold text-[#B597FF] tracking-widest uppercase hidden md:block">Sistema Fora de Rota</span>
          <div className="w-8 h-8 rounded-full bg-[#B597FF]/10 border border-[#B597FF]/20 flex items-center justify-center animate-pulse">
            <div className="w-1.5 h-1.5 bg-[#B597FF] rounded-full shadow-[0_0_10px_rgba(181,151,255,0.8)]" />
          </div>
        </div>
      </header>

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply z-0"
      >
        <source src="/robocamera.mp4" type="video/mp4" />
      </video>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-6 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8 relative inline-flex">
             <div className="absolute inset-0 bg-[#B597FF]/40 blur-xl rounded-full" />
             <span className="relative px-4 py-1.5 rounded-full border border-[#B597FF]/20 bg-white/80 backdrop-blur-md text-[#B597FF] text-[11px] font-bold tracking-widest uppercase">
               Erro 404
             </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#0c0d0d] mb-6 leading-none">
            Perdido no <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">espaço?</span>
          </h1>
          
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl mx-auto mb-12 leading-relaxed">
            A página que você procura foi movida para outra dimensão ou nunca existiu. Deixe nossos robôs te guiarem de volta para a base.
          </p>

          <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
            <Link 
              href="/" 
              className="group relative flex items-center justify-center w-full py-5 rounded-2xl bg-[#0c0d0d] text-white font-bold text-lg hover:bg-zinc-800 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Voltar para a Base
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link 
              href="/#pricing" 
              className="w-full py-5 rounded-2xl border border-[#B597FF]/20 bg-white/50 text-[#0c0d0d] font-bold text-lg hover:bg-white/80 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
            >
              Ver Planos de IA
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Custom Footer for 404 */}
      <footer className="absolute bottom-0 left-0 w-full p-8 z-50 flex items-center justify-between text-[10px] font-bold text-[#B597FF]/40 tracking-widest uppercase">
        <span>Tlin AI v2.0.4</span>
        <span>Coordenadas não encontradas</span>
      </footer>

      {/* Decorative Blur */}
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-[#B597FF]/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#38E3FF]/20 blur-[150px] rounded-full pointer-events-none" />
    </main>
  );
}
