"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-white text-[#0c0d0d] py-20 px-10 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium tracking-tight">Atendimento em escala</h3>
            <p className="text-zinc-400 text-sm font-medium">O futuro da sua operação começa aqui.</p>
          </div>

          <div className="flex gap-20 md:gap-32">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold lowercase tracking-widest text-zinc-400 mb-2">Produto</h4>
              <a href="#" className="text-sm font-medium hover:text-[#B597FF] transition-colors">Funcionalidades</a>
              <a href="#roi" className="text-sm font-medium hover:text-[#B597FF] transition-colors">Simulador ROI</a>
              <a href="#pricing" className="text-sm font-medium hover:text-[#B597FF] transition-colors">Preços</a>
              <a href="#" className="text-sm font-medium hover:text-[#B597FF] transition-colors">Segurança</a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold lowercase tracking-widest text-zinc-400 mb-2">Empresa</h4>
              <a href="#" className="text-sm font-medium hover:text-[#B597FF] transition-colors">Sobre nós</a>
              <a href="#" className="text-sm font-medium hover:text-[#B597FF] transition-colors">Blog</a>
              <a href="#" className="text-sm font-medium hover:text-[#B597FF] transition-colors">Carreiras</a>
              <a href="#" className="text-sm font-medium hover:text-[#B597FF] transition-colors">Contato</a>
            </div>
          </div>
        </div>

        {/* Huge Brand Text */}
        <div className="relative w-full overflow-hidden mb-20 select-none">
          <h2 className="text-[15vw] md:text-[22vw] font-black tracking-tighter leading-[0.8] text-[#0c0d0d] -ml-[0.05em]">
            tlin.ai
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-zinc-100 gap-8">
          <div className="flex items-center gap-8">
            <img src="/Logo%20Horizontal.svg" alt="Tlin Logo" className="h-6 w-auto" />

          </div>

          <div className="flex gap-8 items-center">
            <Link href="/legal?tab=termos" className="text-xs font-bold text-zinc-400 hover:text-[#0c0d0d] lowercase tracking-widest transition-colors">Termos</Link>
            <Link href="/legal?tab=privacidade" className="text-xs font-bold text-zinc-400 hover:text-[#0c0d0d] lowercase tracking-widest transition-colors">Privacidade</Link>
            <Link href="/legal?tab=cookies" className="text-xs font-bold text-zinc-400 hover:text-[#0c0d0d] lowercase tracking-widest transition-colors">Cookies</Link>
            <span className="text-xs font-bold text-zinc-400 lowercase tracking-widest">Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

