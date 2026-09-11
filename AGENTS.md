# tlin.ai — contexto para agentes de IA

Este arquivo documenta o estado real do projeto tal como está em produção
(`main`, deployado em https://tlin.ia.br via Vercel), para que qualquer
assistente de IA que abra este repositório entenda rapidamente do que se
trata, sem precisar re-explorar tudo do zero.

## O que é o projeto

**tlin.ai** é um site de vendas (landing page em Next.js) para um produto de
agentes de IA que atendem, qualificam e vendem via WhatsApp 24/7. A proposta
de valor central hoje (desde 2026-09-10) é liderar com **"IA comercial"** como
categoria — mesma lógica do Claude/Anthropic (a IA é o núcleo, a plataforma
vem embutida) — com CRM nativo, follow-up automático e agendamento automático
como capacidades de apoio, nunca descritas como integração de terceiro.

- Nome do produto/marca: `tlin.ai` (ver `lib/siteConfig.ts`).
- Domínio de produção: `https://tlin.ia.br` (não `tlin.ai.br` — atenção à ordem
  das letras, é um erro fácil de cometer).
- App/sistema (fora deste repo): `https://app.tlin.ia.br`.
- Idioma principal do conteúdo: português do Brasil. Existe suporte a
  PT/EN/ES via `lib/LanguageContext.tsx` + `lib/dictionaries/`, mas o
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

Em 2026-09-10: reposicionamento de copy/SEO/GEO pra liderar com "IA comercial"
(title/meta/structured data/FAQ/`llms.txt`/`llms-full.txt`); criação de 5
páginas de campanha (`/ia-whatsapp`, `/recuperacao-de-leads`, `/crm-com-ia`,
`/infoprodutores`, `/agentes-de-ia`, ver seção de estrutura); polimento de
i18n/UI (calculadora de ROI totalmente traduzida, bandeiras de país/idioma
trazidas pra `public/flags/` em vez de um CDN externo, dropdown de idioma
centralizado); popup de qualificação chama a pessoa de volta pelo título da
aba quando ela sai (`embedded` only); e uma limpeza estrutural grande (ver
"Estrutura" e "Convenções" abaixo pra pastas novas) — removidos ~1100 linhas
de código morto confirmado (rota `/api/qualify`, 6 componentes órfãos,
`@google/generative-ai`, chaves de dicionário sem uso), `lib/dictionaries.ts`
dividido por idioma, `LeadQualificationPopup.tsx` quebrado em subcomponentes,
templates de e-mail extraídos pra `lib/emailTemplates.ts`. Zero mudança de
comportamento nessa limpeza — só reorganização.

## Stack

- **Framework**: Next.js 16.2.3 (App Router), React 19, TypeScript 5
  (`strict: false`, alias `@/*` → raiz do repo).
- **Estilo**: Tailwind CSS 4 (`@tailwindcss/postcss`), sem arquivo de tema
  centralizado — classes utilitárias inline nos componentes.
- **Animação**: Framer Motion 12; scroll suave via `lenis` em
  `components/SmoothScroll.tsx`.
- **IA**: a assistente "Lia" (`components/LiaPopup.tsx` → `app/api/chat/route.ts`)
  fala com um endpoint próprio, auto-hospedado, compatível com Ollama
  (`LIA_AI_URL`, modelo `gemma3:1b` por padrão), com o prompt carregado de
  `lia_system_prompt_v3_tlin.md` na raiz. Não há mais nenhum uso de Gemini
  no projeto (a rota `app/api/qualify/route.ts`, que usava
  `@google/generative-ai`, foi removida em 2026-09-10 por estar morta —
  nada a chamava).
- **Leads**: `lib/supabase-leads.ts` (REST, sem SDK) grava leads; notificação
  por e-mail via `nodemailer` em `app/api/notify/route.ts`, com os templates
  HTML em `lib/emailTemplates.ts`.
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
app/                        rotas do App Router (page.tsx, layout.tsx, api/*, sitemap, robots)
app/{demo,comece}/          mesmo popup embedded standalone; /comece é alias de /demo (canonical aponta pra /demo)
app/{ia-whatsapp,recuperacao-de-leads,crm-com-ia,infoprodutores,agentes-de-ia}/
                            5 páginas de campanha — reaproveitam MarketingLandingPage.tsx
                            inteiro, só o Hero muda (variant), self-canonical (conteúdo distinto)
components/                 seções da landing e primitivos de UI (components/ui/)
components/lead-qualification/
                            subcomponentes do LeadQualificationPopup.tsx (ver seção própria abaixo)
lib/                        siteConfig, structuredData, utm, supabase-leads, emailTemplates, deskcomm-mcp
lib/dictionaries/           pt.ts/en.ts/es.ts + index.ts (getDictionary/TranslationDictionary) — dividido por idioma
public/                     assets estáticos, incluindo llms.txt / llms-full.txt / flags/ (bandeiras locais, não CDN)
supabase/                   migrations SQL da tabela de leads
```

### Composição da landing (`components/MarketingLandingPage.tsx`)

`app/page.tsx` (home) e as 5 páginas de campanha (`app/{ia-whatsapp,...}/page.tsx`)
só renderizam `<MarketingLandingPage heroVariant={...} />` — toda a composição
real vive nesse componente compartilhado. Ordem das seções: Hero → TrustedBy →
TextReveal → Features (`#features`) → RoiCalculator (`#roi`) → Pricing →
Testimonials (`#testimonials`) → Faq (`#faq`) → FooterBanner → Footer, mais os
popups globais (`LiaPopup`, `LeadQualificationPopup`, disparado pelo evento DOM
`open-qualification`). `Hero.tsx` aceita uma prop opcional `variant` (chave de
`t.campaigns.*` em vez de `t.hero.*`) pra trocar headline/subtítulo/palavra em
degradê por campanha, sem duplicar o resto da página — sem `variant`, o
comportamento é idêntico ao de sempre (home, `/demo`, `/comece`).

A maioria das seções abaixo da dobra é carregada via `next/dynamic` com
`ssr: false` e um wrapper `DeferredSection` (IntersectionObserver) que só
monta o conteúdo quando a seção entra perto da viewport. **Isso significa
que essas seções não aparecem no HTML inicial enviado ao crawler** — é uma
escolha deliberada de performance no `main` atual; não é um bug, mas é
importante saber disso antes de assumir que o conteúdo é indexável sem JS.

### Pricing (`components/Pricing.tsx`)

É a seção mais complexa: preços com efeito de "rolling numbers", timer de
oferta (`lib/useOfferTimer.ts`), badges de desconto por plano, e usa o bloco
`t.pricing.*` de `lib/dictionaries/` (Starter/Scale/Enterprise). Diferente
de outras seções, aqui o `t.pricing` **é** usado ativamente — não remover
essas chaves do dicionário sem checar este componente primeiro.

### Agendamento de demo (`components/LeadQualificationPopup.tsx`)

Desde 2026-09-10 o arquivo (que já foi de 1849 linhas) tem o núcleo da máquina
de estados (`advanceChat`, `getQuestion`, `getOptions`, o loop de chat, os
inputs de nome/telefone/e-mail, o dropdown de país) mas as partes mais
periféricas viraram subcomponentes em `components/lead-qualification/`:
`constants.ts` (países/timezones/`SUCCESS_STEP`/tipos), `HighlightText`,
`TypewriterQuestion`, `AvailabilityCalendar`, `ProgressHeader` (header +
trilha de progresso), `WelcomeScreen`, `ResumeSessionOverlay`,
`FieldEditOverlay`, `SuccessStep`. Mudança puramente estrutural — nenhum
comportamento novo.

**Bug preexistente encontrado nessa limpeza (não corrigido, fora de escopo)**:
o botão "Continuar" do `ResumeSessionOverlay` restaura `currentStep`/
`formData`/`chatHistory` do localStorage corretamente, mas nunca reativa
`hasStarted` — a tela de boas-vindas (`WelcomeScreen`) volta a aparecer por
cima do estado já restaurado. Reproduzível: avançar até o step 2+, recarregar
a página, clicar "Continuar" no overlay de retomada.

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

- `embedded=true` (`/demo`, `/comece`): fundo branco, header estilo WhatsApp
  completo (foto/nome "Igor"/status online-digitando), trilha de progresso
  estreita. Único modo que chama a pessoa de volta pelo título da aba
  (`document.title`) quando ela sai da aba, personalizado com o nome assim
  que digitado (`t.leadQualify.tabAwayGeneric`/`tabAwayNamed`).
- `embedded=false` (popup da home e das 5 páginas de campanha): fundo escuro,
  sem header/logo/avatar, trilha de progresso larga (full width) com bolinha
  branca sólida até a etapa completar, então vira o degradê da marca. Ambos
  os modos mostram a mesma tela de boas-vindas (`WelcomeScreen`) antes da
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
- Texto de UI passa por `lib/dictionaries/` (`ptBR`/`enUS`/`esES` em arquivos
  separados, `getDictionary(lang)` em `index.ts`) + `useLanguage()`
  (`lib/LanguageContext.tsx`) — evite strings hardcoded em componentes que já
  usam `t.*`. Padrão mecânico pra chave nova: adicionar em `pt.ts` primeiro,
  depois espelhar em `en.ts`/`es.ts` — `tsc --noEmit` confirma paridade (o
  tipo `TranslationDictionary` deriva de `typeof ptBR`).
- Componente React grande e stateful (tipo `LeadQualificationPopup.tsx`)
  guarda o núcleo/máquina de estados no arquivo principal e extrai só as
  partes de UI mais periféricas/independentes pra uma pasta irmã em
  kebab-case (`components/lead-qualification/`) — evita virar "componente-deus"
  sem forçar uma reescrita completa. Ver essa pasta como exemplo do padrão.

## O que evitar

- Não reintroduzir o reposicionamento "CRM comercial" ou as âncoras SEO da
  branch descartada sem confirmação explícita do usuário.
- Não confundir `tlin.ia.br` (domínio real) com `tlin.ai.br`.
- Antes de qualquer ação que afete o branch `main` (merge, reset, force-push),
  confirme explicitamente com o usuário — já houve um incidente em que uma
  branch errada foi promovida a produção por engano. Verifique branches
  irmãs (`git branch -a`, `git merge-base`) antes de assumir qual é a
  "correta".
