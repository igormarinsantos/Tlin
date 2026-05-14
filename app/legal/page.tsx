"use client";

import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useMemo, Suspense } from "react";
import { ENCYCLOPEDIA_DATA, TermEntry } from "@/lib/encyclopediaData";

const CATEGORIES = ["Todos", "Termos de Uso", "Privacidade e LGPD", "Política de Cookies", "Glossário de IA"];

function EncyclopediaContent() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = useMemo(() => {
    return ENCYCLOPEDIA_DATA.filter(term => {
      const matchesCategory = selectedCategory === "Todos" || term.category === selectedCategory;
      const matchesSearch = term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="flex min-h-screen flex-col bg-white text-[#0c0d0d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 w-full flex-1">
        
        {/* Navigation Link */}
        <Link 
          href="/" 
          className="inline-block text-zinc-400 hover:text-[#B597FF] transition-colors mb-12 font-bold text-xs sm:text-sm uppercase tracking-widest"
        >
          ← Voltar para a Página Inicial
        </Link>

        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-[#0c0d0d]"
          >
            Enciclopédia <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">Tlin</span>
          </motion.h1>
          <p className="text-base sm:text-xl text-zinc-500 font-medium leading-relaxed">
            Navegue pelos nossos termos jurídicos, políticas regulatórias e conceitos técnicos de Inteligência Artificial de maneira centralizada e transparente.
          </p>
        </div>

        {/* Search and Filter Layout */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-stretch lg:items-center justify-between border-b border-zinc-100 pb-8">
          
          {/* Categories Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                    isActive 
                      ? "bg-zinc-950 text-white border-zinc-950" 
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-[#B597FF]/40 hover:text-zinc-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Clean Search Input without icons or shadows */}
          <div className="w-full lg:w-80 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar termo ou definição..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm font-bold text-zinc-900 outline-none focus:border-[#B597FF] focus:bg-white transition-all placeholder:text-zinc-400 placeholder:font-medium"
            />
          </div>

        </div>

        {/* Terms Encyclopedia Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
          <AnimatePresence>
            {filteredTerms.length > 0 ? (
              filteredTerms.map((term) => (
                <motion.div
                  layout
                  key={term.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="flex"
                >
                  <Link
                    href={`/legal/${term.id}`}
                    className="w-full border border-zinc-100 bg-white hover:border-[#B597FF]/40 p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-100 text-zinc-500 group-hover:border-[#B597FF]/20 group-hover:text-[#B597FF] transition-colors">
                          {term.category}
                        </span>
                        
                        <span className="text-xs font-bold text-zinc-300 group-hover:text-[#B597FF] transition-colors">
                          Ler artigo →
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 mt-2 group-hover:text-[#B597FF] transition-colors">
                        {term.title}
                      </h3>

                      <p className="text-sm sm:text-base text-zinc-500 font-medium leading-relaxed mt-1 line-clamp-3">
                        {term.definition}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center flex flex-col items-center gap-2"
              >
                <span className="text-lg font-bold text-zinc-400">Nenhum termo encontrado</span>
                <p className="text-sm text-zinc-400 font-medium">Tente buscar por outras palavras-chave ou redefina os filtros.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
      <Footer />
    </main>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <EncyclopediaContent />
    </Suspense>
  );
}
