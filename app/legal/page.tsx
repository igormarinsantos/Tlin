"use client";

import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, Cookie } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LegalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("termos");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["termos", "privacidade", "cookies"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/legal?tab=${tab}`, { scroll: false });
  };

  const tabs = [
    { id: "termos", label: "Termos de Uso", icon: FileText },
    { id: "privacidade", label: "Privacidade", icon: Shield },
    { id: "cookies", label: "Cookies", icon: Cookie },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white text-[#0c0d0d]">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 w-full">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#B597FF] transition-colors mb-12 font-bold text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para Home
        </Link>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-12"
        >
          Central <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">Jurídica</span>
        </motion.h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive 
                    ? "bg-white text-[#B597FF] shadow-md border border-zinc-100" 
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-white/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#B597FF]" : "text-zinc-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="min-h-[400px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="prose prose-zinc max-w-none space-y-8 text-zinc-600 font-medium leading-relaxed"
            >
              {activeTab === "termos" && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">1. Aceitação dos Termos</h2>
                    <p>Ao acessar e utilizar a plataforma Tlin.ai, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.</p>
                  </section>
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">2. Descrição do Serviço</h2>
                    <p>A Tlin.ai fornece soluções de Inteligência Artificial para automação de vendas e atendimento via WhatsApp. Nossos agentes de IA são ferramentas de suporte e não substituem a responsabilidade final da empresa sobre a comunicação com seus clientes.</p>
                  </section>
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">3. Responsabilidades do Usuário</h2>
                    <p>O usuário é responsável por manter a confidencialidade de sua conta e por todas as atividades que ocorram nela. É proibido o uso da plataforma para envio de spam, conteúdo ilegal ou qualquer prática que viole as políticas do WhatsApp/Meta.</p>
                  </section>
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">4. Propriedade Intelectual</h2>
                    <p>Todo o conteúdo, algoritmos e tecnologias da Tlin.ai são de propriedade exclusiva da nossa empresa e protegidos por leis de direitos autorais e propriedade intelectual.</p>
                  </section>
                </div>
              )}

              {activeTab === "privacidade" && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">1. Coleta de Dados</h2>
                    <p>Coletamos informações necessárias para a prestação de nossos serviços, incluindo dados de contato, interações com a IA e logs de utilização para fins de melhoria contínua e suporte.</p>
                  </section>
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">2. Uso das Informações</h2>
                    <p>Seus dados são utilizados exclusivamente para operar a plataforma Tlin.ai, personalizar a experiência dos seus agentes e garantir a segurança da operação comercial.</p>
                  </section>
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">3. Segurança dos Dados</h2>
                    <p>Implementamos medidas técnicas e organizacionais avançadas para proteger seus dados contra acessos não autorizados, perda ou alteração, em total conformidade com a LGPD.</p>
                  </section>
                </div>
              )}

              {activeTab === "cookies" && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">1. O que são Cookies?</h2>
                    <p>Cookies são pequenos arquivos de texto enviados para o seu navegador quando você visita nosso site. Eles nos ajudam a entender como você interage com a plataforma e a melhorar sua experiência de navegação.</p>
                  </section>
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">2. Cookies Essenciais</h2>
                    <p>Estes são necessários para o funcionamento básico do site, como autenticação de usuário e salvamento de preferências de sessão. Sem eles, algumas funcionalidades podem não operar corretamente.</p>
                  </section>
                  <section>
                    <h2 className="text-2xl font-bold text-[#0c0d0d] mb-4">3. Cookies Analíticos</h2>
                    <p>Utilizamos ferramentas como Google Analytics para entender o volume de visitas e as páginas mais acessadas. Estes dados são coletados de forma anônima.</p>
                  </section>
                </div>
              )}
            </motion.div>
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
      <LegalContent />
    </Suspense>
  );
}
