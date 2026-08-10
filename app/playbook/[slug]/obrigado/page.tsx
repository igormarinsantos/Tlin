import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getIgorCampaign, igorCampaigns } from "@/lib/igor-campaigns";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.keys(igorCampaigns).map((slug) => ({ slug }));
}

export default async function ThankYouPage({ params }: { params: Promise<{ slug: string }> }) {
  const campaign = getIgorCampaign((await params).slug);
  if (!campaign) notFound();
  const systems = [
    ["Radar de mercado", "Use IA para resumir concorrentes, reviews e comentários antes de apostar numa mensagem.", "Analise estes comentários e agrupe: dor, objeção, desejo, linguagem literal e oportunidade."],
    ["Pesquisa de audiência", "Transforme conversas soltas em hipóteses que podem virar campanha.", "A partir desta base, quais são os 5 problemas mais caros e quais palavras o público usa para descrevê-los?"],
    ["Banco de ângulos", "Crie ângulos de conteúdo a partir de evidência, não de inspiração.", "Crie 15 ângulos de conteúdo que desafiem o senso comum, baseados apenas nos padrões encontrados."],
    ["Distribuição", "Converta uma boa ideia em formatos adequados a cada canal.", "Transforme esta tese em Reel, post de LinkedIn, carrossel e e-mail. Preserve a mesma ideia central."],
    ["Criativos e copy", "Use IA para gerar variações e diagnosticar por que uma mensagem parece fraca.", "Aponte a promessa, mecanismo, prova e objeção ausente nesta peça. Depois crie 3 novas hipóteses."],
    ["Conversão", "Mapeie atritos da jornada antes de simplesmente colocar mais tráfego no funil.", "Analise estas conversas e identifique o ponto em que a intenção cai, a objeção aparece ou o follow-up falha."],
    ["Operação", "Automatize o repetitivo para o time tomar decisões melhores, não para fingir que estratégia é automática.", "Liste tarefas repetitivas deste processo, risco de cada automação e o que precisa de revisão humana."],
  ];

  return <main className="min-h-screen bg-white text-[#0c0d0d]"><section className="bg-[#0c0d0d] px-5 py-20 text-center text-white sm:px-8"><div className="mx-auto max-w-2xl"><CheckCircle2 className="mx-auto h-12 w-12 text-[#38e3ff]" /><p className="mt-8 text-xs font-black tracking-[0.16em] text-[#b597ff]">ACESSO LIBERADO</p><h1 className="mt-4 text-5xl font-black leading-none tracking-[-0.06em]">Agora você tem o mapa.</h1><p className="mt-6 text-lg font-medium leading-relaxed text-zinc-400">Salva esta página. São os sistemas que eu usaria para aplicar IA em Growth sem abrir mão de estratégia.</p></div></section><section className="mx-auto max-w-4xl px-5 py-16 sm:px-8"><p className="text-xs font-black tracking-[0.16em] text-zinc-400">{campaign.leadMagnet.toUpperCase()}</p><div className="mt-8 space-y-5">{systems.map(([title, description, prompt], index) => <article key={title} className="rounded-[28px] border border-[#e4e4e7] p-6 sm:p-8"><p className="text-sm font-black text-[#b597ff]">0{index + 1}</p><h2 className="mt-5 text-3xl font-black tracking-[-0.05em]">{title}</h2><p className="mt-3 text-base font-medium leading-relaxed text-zinc-500">{description}</p><div className="mt-6 rounded-2xl bg-[#f4f0ff] p-4 text-sm font-semibold leading-relaxed text-[#44376c]"><span className="font-black">Prompt de partida: </span>“{prompt}”</div></article>)}</div><a href={`/playbook/${campaign.slug}`} className="mt-12 inline-flex items-center gap-2 rounded-full bg-[#0c0d0d] px-6 py-3.5 text-sm font-black text-white">Voltar para a página <ArrowRight size={16} /></a></section></main>;
}
