<!-- generated-by: gsd-doc-writer -->
# tlin.ai

Site comercial da tlin.ai: uma operação de vendas com IA para WhatsApp, CRM, follow-up e agendamento. O projeto é uma landing page em Next.js focada em conversão, páginas de campanha, captura de leads e marcação de demos.

> **Estado atual · 17 de setembro de 2026**  
> A experiência comercial está implementada em desktop e mobile: home, páginas de solução, preços, calculadora de ROI, comparativos, fluxo de demo, chat “Fale com a IA”, blog e páginas legais. O foco de evolução agora é polimento de conversão, conteúdo real de cases e validação das integrações de produção.

## Para uma IA que vai continuar o trabalho

Leia esta seção antes de editar o produto.

- A proposta é **IA comercial**, não uma ferramenta genérica de chat. A Tlin atende, qualifica, acompanha e agenda usando o contexto comercial.
- A identidade visual é clara, editorial e precisa: preto `#0c0d0d`, gradiente roxo `#B597FF` → ciano `#38E3FF`, bordas suaves, pouca sombra e motion sutil.
- Texto de interface deve sair de `lib/dictionaries/` quando o componente já usa `useLanguage()`. Mantenha PT, EN e ES em paridade.
- Não use ponto final em títulos e textos auxiliares de marketing. Evite hífens na copy visível.
- CTAs pretos de conversão usam a borda gradiente e, em desktop, a pílula animada **Demo 100% grátis**. Reutilize `components/DemoHoverPill.tsx` em vez de recriar o efeito.
- Mobile não é desktop comprimido: o header abre um mega menu abaixo da navegação, o scroll é nativo e os layouts precisam preservar hierarquia e respiro.
- Não altere arquivos gerados ou locais sem necessidade: `next-env.d.ts`, `tsconfig.tsbuildinfo`, logs e `.planning/` podem estar sujos por processos locais.
- Antes de concluir uma alteração: rode `npx tsc --noEmit` e `git diff --check`. Faça commits pequenos e envie para `main` quando a alteração estiver validada.

## O que está pronto

| Frente | Situação | Onde está |
| --- | --- | --- |
| Landing principal | Hero, motion, capacidades, ROI, planos, prova social, FAQ e CTA final | `app/page.tsx`, `components/MarketingLandingPage.tsx` |
| Páginas de campanha | Cinco variações de solução com hero, jornada, reviews, ROI e comparação | `app/ia-whatsapp`, `app/recuperacao-de-leads`, `app/crm-com-ia`, `app/infoprodutores`, `app/agentes-de-ia` |
| Página de preços | Cards Starter, Scale e Enterprise, alternância mensal/anual, comparação de planos, FAQ e rodapé | `app/precos/page.tsx`, `components/Pricing.tsx` |
| Conversão | Fluxo guiado de qualificação, agenda, máscara de telefone por país e estado de sucesso | `components/LeadQualificationPopup.tsx` |
| Chat comercial | Pop-up “Fale com a IA” com o fluxo de conversa da Lia | `components/LiaPopup.tsx` |
| Conteúdo | Listagem e detalhe de blog, RSS, sitemap, robots e páginas legais | `app/blog`, `app/legal`, `app/rss.xml`, `app/sitemap.ts` |
| Métricas | GA4, GTM, UTMs e eventos de funil | `app/layout.tsx`, `lib/utm.ts`, `components/UTMTracker.tsx` |

## Rotas públicas

| Rota | Papel |
| --- | --- |
| `/` | Landing principal |
| `/ia-whatsapp` | Solução de IA para WhatsApp |
| `/recuperacao-de-leads` | Solução para recuperar oportunidades |
| `/crm-com-ia` | Solução de CRM com IA |
| `/infoprodutores` | Solução para operações de infoproduto |
| `/agentes-de-ia` | Solução de agentes de IA |
| `/como-funciona` | Página institucional sobre a operação |
| `/precos` | Página dedicada de planos e comparação |
| `/demo` e `/comece` | Fluxo standalone de qualificação e agendamento |
| `/qualificar` | Entrada alternativa para a qualificação |
| `/blog` e `/blog/[slug]` | Conteúdo editorial |
| `/legal` e `/legal/[id]` | Documentos legais |
| `/obrigado` | Confirmação após conversão |

## Arquitetura de alto nível

```text
app/
  page.tsx                       home
  precos/page.tsx                página de preços independente
  {solução}/page.tsx             páginas de campanha
  api/                           chat, lead, agenda, notificação e webhook

components/
  MarketingLandingPage.tsx       composição compartilhada da home e campanhas
  Hero.tsx / CampaignHero.tsx    primeiras dobras
  Pricing.tsx                    planos e tabelas comparativas
  LeadQualificationPopup.tsx     máquina de estados da conversão
  lead-qualification/            peças do fluxo de qualificação
  LiaPopup.tsx                   chat comercial
  SiteChrome.tsx                 header, chat e scroll globais

lib/
  dictionaries/                  PT, EN e ES
  utm.ts                         captura e eventos de funil
  deskcomm-mcp.ts                disponibilidade e agenda via Deskcomm
  supabase-leads.ts              persistência/projeção de leads
  siteConfig.ts                  URLs e metadados canônicos
```

### Composição das landings

`MarketingLandingPage` é o centro da experiência. A home não recebe `heroVariant`; as páginas de campanha passam uma variante e reaproveitam a maior parte das seções.

1. Hero e prova de confiança
2. Dor e explicação da operação para campanhas
3. Como funciona
4. Capacidades da Tlin
5. Calculadora de ROI
6. Comparativo de campanha quando aplicável
7. Preços
8. Depoimentos, FAQ, CTA final e rodapé

Seções abaixo da dobra usam carregamento dinâmico ou `DeferredSection` quando isso não compromete o conteúdo necessário para SEO. Antes de trocar `ssr: false`, confirme o impacto em indexação e hidratação.

## Fluxo de conversão

Os CTAs de marketing emitem o evento de navegador `open-qualification`. Cada página que contém o fluxo escuta esse evento e abre `LeadQualificationPopup` com a origem e o plano selecionado.

```text
CTA → open-qualification → LeadQualificationPopup
    → dados de contato → disponibilidade no Deskcomm
    → escolha de horário → revisão → POST /api/notify
    → confirmação e contato no WhatsApp
```

O popup tem duas apresentações:

- **Embedded** em `/demo` e `/comece`, como uma página de conversão própria
- **Modal escuro** nas páginas de marketing, aberto por CTA

O fluxo também usa `POST /api/leads/capture` para a captação primária. A agenda vem de `GET /api/public/demo/availability`; a confirmação final passa por `POST /api/notify`.

## Stack e comandos

- Next.js 16 com App Router
- React 19 e TypeScript
- Tailwind CSS 4 para estilo
- Framer Motion para motion
- Lenis para scroll suave em desktop
- Vitest para teste de captura de lead

```bash
npm install
npm run dev
npx tsc --noEmit
npm run lint
npm run test:lead-capture
npm run build
```

O endereço local padrão é `http://localhost:3000`.

## Configuração local

Copie `.env.local.example` para `.env.local` e preencha somente os serviços que você precisa testar. Nunca versionar valores reais.

| Grupo | Variáveis principais | Uso |
| --- | --- | --- |
| Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID` | GA4 e GTM |
| URLs públicas | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL` | Canonical, SEO e links para o app |
| Chat Lia | `LIA_AI_URL`, `LIA_AI_MODEL` | Respostas do chat comercial |
| Antibot | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Validação de lead |
| Captura | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Persistência de leads |
| Notificação | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `NOTIFICATION_EMAIL` | E-mail de conversão |
| Deskcomm | `DESKCOMM_MCP_URL`, `DESKCOMM_API_TOKEN`, `DESKCOMM_WEBHOOK_URL`, `DESKCOMM_STATUS_WEBHOOK_SECRET`, `DESKCOMM_DEMO_EVENT_TYPE_SLUG` | Captação, agenda e projeção de status |

O domínio configurado pelo código é `https://tlin.ia.br`; `https://app.tlin.ia.br` é o app externo. As URLs podem ser sobrescritas pelas variáveis públicas acima.

## API disponível

| Método | Endpoint | Responsabilidade |
| --- | --- | --- |
| `POST` | `/api/chat` | Conversa da Lia com o provedor configurado |
| `POST` | `/api/leads/capture` | Captura validada e limitada por taxa |
| `GET` | `/api/public/demo/availability` | Horários disponíveis no Deskcomm |
| `POST` | `/api/notify` | Confirmação, notificação e agendamento |
| `GET` | `/api/notify` | Verificação simples do endpoint de notificação |
| `POST` | `/api/webhooks/deskcomm` | Atualização de status assinada por HMAC |

## Convenções de implementação

- Use imports `@/` para módulos de raiz
- Preserve o padrão local de cada arquivo; o projeto usa predominantemente aspas duplas e ponto e vírgula
- Componentes React em PascalCase. Utilitários e dados em `lib/`
- Não crie uma nova página de campanha duplicando toda a landing: prefira uma nova `HeroVariant` e conteúdo nos dicionários
- Não mova a máquina de estados de `LeadQualificationPopup` para um componente gigante novo. Extras de UI ficam em `components/lead-qualification/`
- Use `trackFunnelEvent` e `trackConversion` para novas ações que representem etapa real de conversão
- Em unions discriminadas da integração Deskcomm, prefira `result.ok === false` em vez de `!result.ok`, pois o narrowing deste projeto foi inconsistente

## Checklist antes de subir

```bash
npx tsc --noEmit
git diff --check
git status --short
```

Depois, confira a rota afetada em desktop e mobile. Em mudanças de CTA, valide clique, origem do evento e abertura do fluxo de qualificação.

## Pontos que pedem cuidado

- O posicionamento ativo é **IA comercial**. Não reintroduza posicionamentos antigos como “agência” ou “CRM comercial” sem decisão explícita de produto
- A página `/comece` é uma experiência independente, mesmo compartilhando o componente de qualificação com `/demo`
- Os dados de disponibilidade vêm do Deskcomm e são agrupados no servidor pela data civil do fuso da agenda
- O menu mobile, o popup da Lia e as seções em motion foram ajustados manualmente para comportamento responsivo. Prefira ajustes localizados a reescritas amplas

## Referências internas

- [Contexto detalhado para agentes](AGENTS.md)
- [Design system](docs/design-system.md)
- [Plano das landing pages](plano-landing-pages.md)
- [Variáveis de ambiente](.env.local.example)

