# tlin.ai

Site comercial da tlin.ai: uma operação de vendas com IA para WhatsApp, CRM, follow-up e agendamento. O projeto é uma landing page em Next.js focada em conversão, páginas de campanha, captura de leads e marcação de demos.

> **Estado atual · 17 de setembro de 2026**  
> A experiência comercial está implementada em desktop e mobile: home, páginas de solução, preços, calculadora de ROI, comparativos, fluxo de demo, chat “Fale com a IA”, blog e páginas legais. O foco de evolução agora é polimento de conversão, conteúdo real de cases e validação das integrações de produção.

Prioridade comercial: **demos confirmadas com leads qualificados**. As fases 1 e 2 do
[plano de qualidade](docs/quality/README.md) estabelecem checks locais/CI, referência
visual e um fluxo de demo com retomada e tratamento de falhas. Integrações reais e
qualificação comercial ainda precisam da validação operacional da fase 3.

## Para uma IA que vai continuar o trabalho

Leia esta seção antes de editar o produto.

- A proposta é **IA comercial**, não uma ferramenta genérica de chat. A Tlin atende, qualifica, acompanha e agenda usando o contexto comercial.
- A identidade visual é clara, editorial e precisa: preto `#0c0d0d`, gradiente roxo `#B597FF` → ciano `#38E3FF`, bordas suaves, pouca sombra e motion sutil.
- Texto de interface deve sair de `lib/dictionaries/` quando o componente já usa `useLanguage()`. Mantenha PT, EN e ES em paridade.
- Não use ponto final em títulos e textos auxiliares de marketing. Evite hífens na copy visível.
- CTAs pretos de conversão usam a borda gradiente e, em desktop, a pílula animada **Demo 100% grátis**. Reutilize `components/DemoHoverPill.tsx` em vez de recriar o efeito.
- Mobile não é desktop comprimido: o header abre um mega menu abaixo da navegação, o scroll é nativo e os layouts precisam preservar hierarquia e respiro.
- Não altere arquivos gerados ou locais sem necessidade: `next-env.d.ts`, `tsconfig.tsbuildinfo`, logs e `.planning/` podem estar sujos por processos locais.
- Antes de concluir uma alteração: rode `npm run check` e `git diff --check`. Trabalhe em uma branch `codex/`, com commits pequenos. Merge ou push em `main` exige autorização explícita do Igor, pois publica na Vercel; checks verdes não autorizam publicação.

## O que está pronto

| Frente | Situação | Onde está |
| --- | --- | --- |
| Landing principal | Hero, motion, capacidades, ROI, planos, prova social, FAQ e CTA final | `app/page.tsx`, `components/MarketingLandingPage.tsx` |
| Páginas de campanha | Cinco variações de solução com hero, jornada, reviews, ROI e comparação | `app/ia-whatsapp`, `app/recuperacao-de-leads`, `app/crm-com-ia`, `app/infoprodutores`, `app/agentes-de-ia` |
| Página de preços | Cards Starter, Scale e Enterprise, alternância mensal/anual, comparação de planos, FAQ e rodapé | `app/precos/page.tsx`, `components/Pricing.tsx` |
| Conversão | Fluxo guiado de qualificação, agenda, máscara de telefone por país e estado de sucesso | `components/LeadQualificationPopup.tsx` |
| Chat comercial | Pop-up “Fale com a IA” com o fluxo de conversa da Lia | `components/LiaPopup.tsx` |
| Conteúdo | Listagem e detalhe de blog, RSS, sitemap, robots e páginas legais | `app/blog`, `app/legal`, `app/blog/rss.xml`, `app/sitemap.ts` |
| Métricas | Código de GA4, GTM, UTMs e eventos; correlação e configuração operacional ainda pedem validação | `app/layout.tsx`, `lib/utm.ts`, `components/UTMTracker.tsx` |

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
| `/qualificar` | Redireciona para `/demo` |
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

Features, Pricing, Testimonials, FAQ e reviews de campanha são renderizados diretamente
com SSR. `DeferredSection` monta outras seções apenas perto da viewport: isso inclui
`CampaignHowItWorks` e `CampaignComparison`, mesmo que seus imports não desativem SSR.
TextReveal, ROI e FooterBanner também usam `ssr: false`. Antes de alterar essa divisão,
avalie o HTML inicial, a hidratação e o custo de carregamento.

## Fluxo de conversão

Os CTAs emitem `open-qualification`. Um único `QualificationController` em
`SiteChrome` atende todas as páginas com header, incluindo blog e páginas legais.
Ele preserva plano/origem, ignora aberturas repetidas e desmonta na mudança de rota.
`/demo` e `/comece` continuam com o formulário embedded.

```text
CTA → open-qualification → LeadQualificationPopup
    → dados de contato → disponibilidade no Deskcomm
    → escolha de horário → revisão → POST /api/notify
    → demo confirmada → /obrigado → WhatsApp opcional
```

O popup tem duas apresentações:

- **Embedded** em `/demo` e `/comece`, como uma página de conversão própria
- **Modal escuro** nas páginas de marketing, aberto por CTA

Após confirmar o telefone, o fluxo aguarda um token e tenta `POST /api/leads/capture`.
A confirmação final aguarda essa captura, usa outro token e envia os dados revisados
com o mesmo identificador a `POST /api/notify`. Só `demoBooking.booked === true`
abre `/obrigado`; o recibo permanece na sessão por até 24 horas, inclusive no refresh.
Horários recusados levam a uma nova consulta. Falhas conhecidas permitem retry;
respostas incertas bloqueiam outra reserva e oferecem contato com a equipe.
Deskcomm continua sendo a fonte operacional; Supabase é a projeção de backup.
O bloqueio do cliente não substitui idempotência durável no CRM. Veja o
[contrato e limites da fase 2](docs/quality/phase-2-verification.md).

## Stack e comandos

- Node.js 24; versão de referência local/CI: `.nvmrc` (24.13.0)
- Next.js 16.3.5 com App Router
- React 19 e TypeScript
- Tailwind CSS 4 para estilo
- Framer Motion para motion
- Lenis para scroll suave em desktop
- Vitest para o adaptador de captura e a política de lint

```bash
npm ci
npm run dev
# Antes de entregar: tipos de rota, TypeScript, lint, testes e build
npm run check
```

O endereço local padrão é `http://localhost:3000`.
`npm run lint` mostra os avisos detalhados; `npm run lint:check` bloqueia erros e
aumento de avisos por arquivo/regra. `npm run typecheck`, `npm test` e
`npm run test:lead-capture` também podem ser executados separadamente.

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
| `GET` | `/api/notify` | Preview HTML do e-mail de boas-vindas; não testa SMTP ou CRM |
| `POST` | `/api/webhooks/deskcomm` | Atualização de status assinada por HMAC |

## Convenções de implementação

- Use imports `@/` para módulos de raiz
- Preserve o padrão local de cada arquivo; o projeto usa predominantemente aspas duplas e ponto e vírgula
- Componentes React em PascalCase. Utilitários e dados em `lib/`
- Não crie uma nova página de campanha duplicando toda a landing: prefira uma nova `HeroVariant` e conteúdo nos dicionários
- Não mova a máquina de estados de `LeadQualificationPopup` para um componente gigante novo. Extras de UI ficam em `components/lead-qualification/`
- Reutilize os helpers de tracking, mas confira a semântica: `qualify_lead` no formulário agora dispara apenas após reserva confirmada, mas ainda não comprova qualificação comercial e `close_convert_lead` representa um clique no WhatsApp. A correção do contrato está na fase 3
- Em unions discriminadas da integração Deskcomm, prefira `result.ok === false` em vez de `!result.ok`, pois o narrowing deste projeto foi inconsistente

## Checklist antes de subir

```bash
npm run check
git diff --check
git status --short
```

Depois, confira a rota afetada em desktop e mobile. Em mudanças de CTA, valide clique, origem do evento e abertura do fluxo de qualificação.
Consulte o [protocolo de qualidade](docs/quality/README.md) e a
[referência visual](docs/quality/visual-baseline.md). O workflow `Quality` executa
os checks em PRs e pushes nas branches previstas; ele não faz deploy. A exigência
do check nas regras de proteção do GitHub é uma configuração externa, não aplicada
por este repositório.

## Pontos que pedem cuidado

- O posicionamento ativo é **IA comercial**. Não reintroduza posicionamentos antigos como “agência” ou “CRM comercial” sem decisão explícita de produto
- `/comece` é uma entrada standalone que compartilha o componente com `/demo`; seu canonical aponta para `/demo`
- Os dados de disponibilidade vêm do Deskcomm e são agrupados no servidor pela data civil do fuso da agenda
- O menu mobile, o popup da Lia e as seções em motion foram ajustados manualmente para comportamento responsivo. Prefira ajustes localizados a reescritas amplas

## Referências internas

- [Contexto detalhado para agentes](AGENTS.md)
- [Design system](docs/design-system.md)
- [Qualidade e plano de evolução](docs/quality/README.md)
- [Dívida de lint priorizada](docs/quality/lint-backlog.md)
- [Referência visual](docs/quality/visual-baseline.md)
- [Auditoria do funil e dos padrões](docs/auditoria-padroes-conversao-2026-09-17.md)
- [Plano das landing pages](plano-landing-pages.md)
- [Variáveis de ambiente](.env.local.example)

