"use client";

import { Footer } from "@/components/Footer";
import { ENCYCLOPEDIA_DATA } from "@/lib/encyclopediaData";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function ArticlePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const article = useMemo(() => {
    return ENCYCLOPEDIA_DATA.find((item) => item.id === id);
  }, [id]);

  if (!article) {
    return (
      <main className="flex min-h-screen flex-col bg-white text-[#0c0d0d]">
        <div className="max-w-4xl mx-auto px-6 py-32 text-center flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold text-zinc-400">Artigo não encontrado</h1>
          <p className="text-zinc-500 font-medium">O conceito ou termo que você tentou acessar não existe ou foi removido.</p>
          <Link href="/legal" className="mt-4 px-6 py-3 rounded-xl bg-zinc-950 text-white font-bold text-sm hover:opacity-90 transition-opacity">
            Voltar para a Enciclopédia
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white text-[#0c0d0d]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 w-full flex-1">
        
        {/* Navigation Link */}
        <Link 
          href="/legal" 
          className="inline-block text-zinc-400 hover:text-[#B597FF] transition-colors mb-12 font-bold text-xs sm:text-sm uppercase tracking-widest"
        >
          ← Voltar para a Enciclopédia
        </Link>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-start gap-4 mb-12"
        >
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[#B597FF]">
            {article.category}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
            {article.title}
          </h1>
        </motion.div>

        {/* Article Body Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="border-t border-zinc-100 pt-10"
        >
          <div className="text-base sm:text-xl text-zinc-600 font-medium leading-relaxed space-y-6">
            <p className="text-xl sm:text-2xl text-zinc-800 font-bold leading-relaxed border-l-2 border-[#B597FF] pl-6 py-1">
              {article.definition}
            </p>

            <div className="pt-8 space-y-6 text-sm sm:text-base text-zinc-500">
              <p>
                Este conteúdo faz parte do repositório oficial de termos normativos e lógicas operacionais da Tlin.ai. O gerenciamento e a administração das definições descritas aqui são mantidos para fornecer aos nossos clientes transparência absoluta quanto à arquitetura de agentes autônomos.
              </p>
              
              <p>
                Caso haja dúvidas ou necessidade de alteração contratual prévia, nossa equipe de engenharia legal e sucesso do cliente pode ser acionada diretamente pelos canais de atendimento ou através da qualificação assistida em nossa plataforma.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation back helper at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-16 pt-8 border-t border-zinc-100 flex items-center justify-between"
        >
          <Link
            href="/legal"
            className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest"
          >
            ← Explorar outros termos
          </Link>
          
          <span className="text-xs font-bold text-zinc-300">
            Tlin.ai Encyclopedia
          </span>
        </motion.div>

      </div>
      <Footer />
    </main>
  );
}
