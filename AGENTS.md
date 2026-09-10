# tlin.ai — contexto para agentes de IA

Este arquivo documenta o estado real do projeto tal como está em produção
(`main`, deployado em https://tlin.ia.br via Vercel), para que qualquer
assistente de IA que abra este repositório entenda rapidamente do que se
trata, sem precisar re-explorar tudo do zero.

## O que é o projeto

**tlin.ai** é um site de vendas (landing page em Next.js) para um produto de
agentes de IA que atendem, qualificam e vendem via WhatsApp 24/7. A proposta
de valor central hoje é: "Copiloto IA Comercial no WhatsApp 24/7" — resposta
rápida a leads, qualificação automática, e escalar atendimento sem aumentar
o time.

- Nome do produto/marca: `tlin.ai` (ver `lib/siteConfig.ts`).
- Domínio de produção: `https://tlin.ia.br` (não `tlin.ai.br` — atenção à ordem
  das letras, é um erro fácil de cometer).
- App/sistema (fora deste repo): `https://app.tlin.ia.br`.
- Idioma principal do conteúdo: português do Brasil. Existe suporte a
  PT/EN/ES via `lib/LanguageContext.tsx` + `lib/dictionaries.ts`, mas o
  `<html lang>` e os metadados são fixados em `pt-BR`.

## Histórico recente relevante

Em 2026-09-09, existia uma branch (`codex/phase-1-verdade-factual`) com um
reposicionamento estratégico completo (Tlin como "CRM comercial com IA" em
vez de "agência/copiloto de IA"), incluindo uma reestruturação de SEO da
landing (âncoras semânticas, H2 por seção). Essa branch foi **descartada**
por decisão do dono do produto — o `main` atual reflete a branch
`codex/scroll-base-producao`, que é uma sequência de ajustes incrementais
sobre o posicionamento anterior (não uma reescrita de posicionamento).

Se uma tarefa futura mencionar "CRM comercial", "verdade factual", ou
âncoras como `#como-funciona`/`#agentes`/`#crm`/`#planos`, ela provavelmente
se refere a esse trabalho descartado — confirme com o usuário antes de
reintroduzir esse direcionamento; não assuma que ele ainda é válido.

## Stack

- **Framework**: Next.js 16.2.3 (App Router), React 19, TypeScript 5
  (`strict: false`, alias `@/*` → raiz do repo).
- **Estilo**: Tailwind CSS 4 (`@tailwindcss/postcss`), sem arquivo de tema
  centralizado — classes utilitárias inline nos componentes.
- **Animação**: Framer Motion 12; scroll suave via `lenis` em
  `components/SmoothScroll.tsx`.
- **IA**: `@google/generative-ai` (Gemini) usado em `app/api/chat/route.ts`
  e `app/api/qualify/route.ts`, com prompts carregados de arquivos
  `.md` na raiz (`lia_system_prompt_v3_tlin.md`, `lead_qualification_prompt.md`).
- **Leads**: `lib/supabase-leads.ts` (REST, sem SDK) grava leads; notificação
  por e-mail via `nodemailer` em `app/api/notify/route.ts`.
- **CRM (Deskcomm)**: `lib/deskcomm-mcp.ts` fala com o servidor MCP do
  Deskcomm (`DESKCOMM_MCP_URL`, protocolo MCP/JSON-RPC via Bearer token em
  `DESKCOMM_API_TOKEN`) para consultar horários livres (`crm_find_free_slots`)
  e marcar a demo (`crm_book_appointment`). Ver "Agendamento de demo" abaixo.
- **Build/scripts**: `npm run dev|build|start|lint` (ver `package.json`).
  Sem `.nvmrc`; Node >=18 é o mínimo compatível conhecido.
- **Deploy**: Vercel, com deploy automático a partir de push em `main`
  (não há `vercel.json` versionado — configuração fica no painel do Vercel).

## Estrutura

```
app/            rotas do App Router (page.tsx, layout.tsx, api/*, sitemap, robots)
components/     seções da landing e primitivos de UI (components/ui/)
lib/            dicionários i18n, siteConfig, structuredData, utm, supabase-leads
public/         assets estáticos, incluindo llms.txt / llms-full.txt
supabase/       migrations SQL da tabela de leads
```

### Composição da landing (`app/page.tsx`)

Ordem das seções: Hero → TrustedBy → TextReveal → Features (`#features`) →
RoiCalculator (`#roi`) → Pricing → Testimonials (`#testimonials`) →
Faq (`#faq`) → FooterBanner → Footer, mais os popups globais (`LiaPopup`,
`LeadQualificationPopup`, disparado pelo evento DOM `open-qualification`).

A maioria das seções abaixo da dobra é carregada via `next/dynamic` com
`ssr: false` e um wrapper `DeferredSection` (IntersectionObserver) que só
monta o conteúdo quando a seção entra perto da viewport. **Isso significa
que essas seções não aparecem no HTML inicial enviado ao crawler** — é uma
escolha deliberada de performance no `main` atual; não é um bug, mas é
importante saber disso antes de assumir que o conteúdo é indexável sem JS.

### Pricing (`components/Pricing.tsx`)

É a seção mais complexa: preços com efeito de "rolling numbers", timer de
oferta (`lib/useOfferTimer.ts`), badges de desconto por plano, e usa o bloco
`t.pricing.*` de `lib/dictionaries.ts` (Starter/Scale/Enterprise). Diferente
de outras seções, aqui o `t.pricing` **é** usado ativamente — não remover
essas chaves do dicionário sem checar este componente primeiro.

### Agendamento de demo (`components/LeadQualificationPopup.tsx`)

O wizard de qualificação (popup e `/demo` embedded) tem 10 steps: nome, telefone,
confirmação, volume, equipe, e-mail, **escolher dia** (7), **escolher horário** (8),
revisão (9), sucesso (`SUCCESS_STEP = 10`). Os steps 7/8 consultam
`GET /api/public/demo/availability` (que chama o Deskcomm via
`lib/deskcomm-mcp.ts` e agrupa por dia civil no fuso da agenda usando `Intl`
nativo — nunca uma lib de timezone). A confirmação final (`POST /api/notify`)
also dispara o webhook de captação já existente do Deskcomm e
`crm_book_appointment` via MCP.

**Achado importante**: o parâmetro `dia` da tool `crm_find_free_slots` não
filtra como a documentação descreve nesta instância do Deskcomm (devolve
sempre o espalhamento de vários dias) — por isso `findFreeSlots()` só usa
`dias_a_frente`, e o agrupamento por dia é feito neste repo, não pedido ao
Deskcomm. Reveja isso se um dia a tool for corrigida upstream.

**Quirk de TypeScript observado neste projeto**: `if (!result.ok)` não
restringe (narrow) unions discriminadas como `{ok:true,data}|{ok:false,error}`
neste ambiente (TS 5.9.3 local) — use `if (result.ok === false)` em vez de
`!result.ok`. Reproduzido em um arquivo isolado, não é específico deste
componente.

- `embedded=true` (`/demo`): fundo branco, sem gate de "Iniciar", com header
  estilo WhatsApp (foto/nome "Igor"/status online-digitando).
- `embedded=false` (popup): fundo escuro, com tela de "Iniciar" antes da
  primeira pergunta.
- Variáveis novas em `.env.local`: `DESKCOMM_MCP_URL`, `DESKCOMM_API_TOKEN`,
  `DESKCOMM_WEBHOOK_URL`, `DESKCOMM_DEMO_EVENT_TYPE_SLUG` (hoje `reuniao`).

## Convenções

- Componentes React em PascalCase, um por arquivo, em `components/`.
- Utilitários/dados em camelCase ou kebab-case em `lib/`.
- Import root-relative via alias `@/*` (`@/components/...`, `@/lib/...`);
  imports relativos só entre arquivos fortemente acoplados (ex.: popups que
  importam subcomponentes locais).
- Duas linhas de indentação, aspas duplas, ponto e vírgula — mas o
  formatador não é imposto (`eslint-config-next` está no `package.json`
  porém não há `eslint.config.*`/`.eslintrc*` no repo). Preserve o estilo
  do arquivo que estiver editando.
- `console.error`/`console.warn` em falhas de integração externa
  (Supabase, SMTP, WhatsApp). Não logar credenciais ou payloads de auth.
- Texto de UI passa por `lib/dictionaries.ts` + `useLanguage()`
  (`lib/LanguageContext.tsx`) — evite strings hardcoded em componentes que já
  usam `t.*`.

## O que evitar

- Não reintroduzir o reposicionamento "CRM comercial" ou as âncoras SEO da
  branch descartada sem confirmação explícita do usuário.
- Não confundir `tlin.ia.br` (domínio real) com `tlin.ai.br`.
- Antes de qualquer ação que afete o branch `main` (merge, reset, force-push),
  confirme explicitamente com o usuário — já houve um incidente em que uma
  branch errada foi promovida a produção por engano. Verifique branches
  irmãs (`git branch -a`, `git merge-base`) antes de assumir qual é a
  "correta".
