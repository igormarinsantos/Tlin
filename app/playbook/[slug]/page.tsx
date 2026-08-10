import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Boxes, Sparkles, Zap } from "lucide-react";
import { LeadMagnetForm } from "@/components/igor/LeadMagnetForm";
import { getIgorCampaign, igorCampaigns } from "@/lib/igor-campaigns";
import styles from "./playbook.module.css";

type Props = { params: Promise<{ slug: string }> };

const pillars = [
  { title: "Pesquisa", description: "Encontre linguagem, objeções e oportunidades antes de criar." },
  { title: "Conteúdo", description: "Transforme repertório em distribuição com um sistema, não em posts aleatórios." },
  { title: "Conversão", description: "Use IA para diagnosticar atritos e melhorar a jornada de quem já demonstrou interesse." },
  { title: "Operação", description: "Estruture processos, rotinas e execução com mais clareza e consistência." },
];

const outcomes = [
  { icon: Boxes, title: "7 sistemas", description: "Um mapa completo para usar IA em pesquisa, conteúdo, aquisição, conversão e operação." },
  { icon: BookOpen, title: "1 playbook", description: "Objetivo, direto e aplicável. Do diagnóstico à execução, com clareza." },
  { icon: Zap, title: "100% prático", description: "Exemplos, prompts e modelos prontos para aplicar no seu negócio." },
];

const aiTools = [
  { name: "ChatGPT", icon: "openai" },
  { name: "Claude", icon: "anthropic" },
  { name: "Gemini", icon: "googlegemini" },
  { name: "Perplexity", icon: "perplexity" },
  { name: "Notion", icon: "notion" },
];

export function generateStaticParams() {
  return Object.keys(igorCampaigns).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const campaign = getIgorCampaign((await params).slug);
  return campaign ? { title: `${campaign.leadMagnet} | Igor Marin`, description: campaign.description } : {};
}

export default async function PlaybookPage({ params }: Props) {
  const campaign = getIgorCampaign((await params).slug);
  if (!campaign) notFound();

  return (
    <main className={styles.page}>
      <section id="inicio" className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.author}>
            <div className={styles.avatarLine}>
              <div className={styles.storyAvatar} aria-label="Foto de perfil de Igor Marin">
                <div className={styles.avatarPhoto} />
              </div>
            </div>
            <span>Igor Marin</span><BadgeCheck aria-label="Perfil verificado" size={17} />
            <small>@igormarin</small>
          </div>
          <a href="#desbloquear" className={`${styles.pill} no-underline`}><Sparkles size={15} /> PLAYBOOK GRÁTIS</a>
          <h1>IA não é para fazer <em>mais.</em><br />É para saber o que <strong>fazer.</strong></h1>
          <div id="desbloquear" className={styles.formArea}>
            <LeadMagnetForm campaignSlug={campaign.slug} campaignKeyword={campaign.keyword} consentVersion={campaign.consentVersion} buttonLabel="Receber grátis" tone="dark" />
            <p className={styles.microcopy}>Grátis. Sem spam. Cancele quando quiser.</p>
          </div>
          <p className={styles.heroDescription}>Receba grátis o mapa com 7 sistemas para usar IA em pesquisa, conteúdo, aquisição, conversão e operação.</p>
        </div>
      </section>

      <section className={styles.framework}>
        <div className={styles.sectionInner}>
          <div className={styles.frameworkIntro}>
            <div>
              <p className={styles.eyebrow}>O QUE TEM NO PLAYBOOK</p>
              <h2>Estratégia antes de automação<span>.</span></h2>
            </div>
            <p>Um material direto para quem quer colocar IA no processo de crescimento sem terceirizar pensamento.</p>
          </div>
          <div className={styles.pillars}>
            {pillars.map((pillar, index) => (
              <a href="#desbloquear" key={pillar.title} className={`${styles.pillar} text-inherit no-underline`}>
                <div><span>0{index + 1}</span><ArrowUpRight size={18} /></div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.outcomes}>
        <div className={styles.sectionInner}>
          <div className={styles.outcomesGrid}>
            <div className={styles.outcomesCopy}>
              <p className={styles.eyebrow}>POR QUE ESTE PLAYBOOK</p>
              <h2>Um mapa para pensar, decidir e operar melhor com IA.</h2>
              <p>Não é sobre ferramentas. É sobre sistemas. Menos ruído, mais direção.</p>
              <a href="#desbloquear" className={styles.cta}>QUERO RECEBER O PLAYBOOK <ArrowRight size={19} /></a>
            </div>
            <div className={styles.outcomeCards}>
              {outcomes.map(({ icon: Icon, title, description }) => (
                <a href="#desbloquear" className={`${styles.outcomeCard} text-inherit no-underline`} key={title}>
                  <Icon size={26} strokeWidth={1.65} />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </a>
              ))}
            </div>
          </div>
          <div className={styles.toolRow} aria-label="Ferramentas abordadas no playbook">
            {aiTools.map((tool) => <span key={tool.name}><img src={`https://cdn.simpleicons.org/${tool.icon}/a7a9ae`} alt="" aria-hidden="true" />{tool.name}</span>)}
          </div>
        </div>
      </section>
    </main>
  );
}
