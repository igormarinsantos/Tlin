"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "A Inteligência Artificial comete erros operacionais ou inventa preços?",
    a: "Não. Diferente do ChatGPT aberto, a Tlin trabalha fechada dentro do seu playbook de regras. Ela é programada por 'guardrails' duros: só propõe o que estiver no seu inventário/tabela de preços. Caso faça uma pergunta impossível de interpretar, ela roteia imediatamente para o transbordo humano."
  },
  {
    q: "Meus clientes vão sentir que estão falando com robôs engessados?",
    a: "Esqueça fluxogramas de botões. Nossos agentes operam em linguagem natural avançada. Eles identificam sotaques, informalidade ou mensagens em áudio e respondem num tom de voz idêntico ao do seu melhor vendedor."
  },
  {
    q: "É complexo integrar no meu ecossistema atual (Hubspot, RD)?",
    a: "Zero complexidade. Oferecemos conectores One-Click para a maioria dos CRMs do mercado. Se você usar planilhas, puxamos dados via Zapier ou Webhooks direto pro Google Sheets."
  },
  {
    q: "Em quanto tempo a operação começa a ver lucro?",
    a: "ROI no primeiro dia de implantação. Ao zerar seu tempo de espera para responder, a taxa de conversão levanta imediatamente devido ao pico agudo de receptividade do lead."
  },
  {
    q: "A IA entende áudios e responde à altura?",
    a: "Sim. A Tlin processa áudios, transcreve e entende o contexto emocional. Ela pode responder via texto ou áudio (opcional), mantendo a fluidez da conversa no WhatsApp como se fosse um humano."
  },
  {
    q: "Como faço para solicitar uma demonstração personalizada?",
    a: "Basta clicar em qualquer botão 'Ver Demo' ou falar diretamente com a Lia aqui no chat. Nosso time agendará uma call estratégica para mapear seu funil e mostrar o potencial de escala."
  }
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-24 md:py-32 bg-white">
       <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
          <div className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-150%]"
              style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)` }}
            />
            <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide flex items-center gap-2">
              🙋 Dúvidas Comuns
            </div>
          </div>
             <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0c0d0d] mb-6">
                Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">Frequentes</span>
             </h2>
             <p className="text-zinc-500 font-medium text-lg max-w-xl mx-auto">Tudo o que você precisa saber para escalar sua operação com a Tlin.</p>
          </div>

          <div className="flex flex-col gap-4 mb-24">
             {faqs.map((faq, idx) => {
               const isOpen = openIndex === idx;
               return (
                 <motion.div 
                   key={idx}
                   initial={false}
                   animate={{ 
                     backgroundColor: isOpen ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.5)",
                     borderColor: isOpen ? "#B597FF" : "#E4E4E7"
                   }}
                   className={`group rounded-3xl border-2 transition-all duration-300 overflow-hidden ${isOpen ? '' : 'hover:border-zinc-300'}`}
                 >
                    <button 
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6 group/btn"
                    >
                       <span className={`text-lg md:text-xl font-bold tracking-tight leading-tight transition-colors ${isOpen ? 'text-[#0c0d0d]' : 'text-zinc-600 group-hover/btn:text-[#0c0d0d]'}`}>
                          {faq.q}
                       </span>
                       <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#B597FF] text-white' : 'text-zinc-400 group-hover/btn:text-zinc-600 bg-zinc-100'}`}>
                          <motion.div 
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="relative w-3 h-3"
                          >
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-current -translate-y-1/2 rounded-full" />
                            <div className="absolute top-0 left-1/2 w-[2px] h-full bg-current -translate-x-1/2 rounded-full" />
                          </motion.div>
                       </div>
                    </button>

                    <AnimatePresence initial={false}>
                       {isOpen && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                         >
                            <div className="px-6 md:px-8 pb-8">
                               <div className="w-full h-px bg-zinc-100 mb-6" />
                               <p className="text-zinc-500 text-base md:text-lg font-medium leading-relaxed">
                                  {faq.a}
                               </p>
                               <div className="mt-6 pt-6 border-t border-zinc-100">
                                  <p className="text-sm font-medium text-zinc-400">
                                     Sua dúvida não foi esclarecida? <a href="https://wa.me/5511916248604" target="_blank" rel="noopener noreferrer" className="text-[#B597FF] hover:underline font-bold transition-all">Fale com nossos especialistas</a>
                                  </p>
                               </div>
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </motion.div>
               );
             })}
           </div>


       </div>
    </section>
  );
}
