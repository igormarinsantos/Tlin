# tlin.ai — contexto para agentes de IA

Este arquivo documenta o código revisado em 17/09/2026, para que qualquer
assistente de IA que abra este repositório entenda rapidamente do que se
trata, sem precisar re-explorar tudo do zero.

`main` publica em https://tlin.ia.br via Vercel. Alterações numa branch local
não estão necessariamente em produção. A prioridade comercial confirmada é
**demos agendadas com leads qualificados**.

## Referências e fluxo de trabalho

- Leia `README.md`, este arquivo e `docs/quality/README.md` antes de editar.
- O contrato visual está em `docs/design-system.md`; as capturas de referência
  estão em `docs/quality/visual-baseline.md`.
- A sequência de seis fases aprovada em 17/09 está em `docs/quality/README.md`.
  Ela é distinta da numeração do ciclo GSD anterior em `.planning/`.
- `.planning/` registra decisões históricas e a validação operacional adiada.
  Algumas páginas ali marcadas como não iniciadas já existem. Confira o código
  e não recrie páginas a partir de um status antigo.
- Confira `git status`, branches e base antes de trabalhar; preserve mudanças
  locais. Use branch `codex/` e commits pequenos. Não inclua cache TypeScript,
  alterações geradas de `next-env.d.ts`, segredos ou logs no commit.
- Rode `npm run check` e `git diff --check`. O lint bloqueia erros e aumentos
  de avisos por arquivo/regra; consulte `docs/quality/lint-backlog.md`.
- Merge, push ou outras alterações em `main` exigem autorização explícita do
  Igor. CI verde não autoriza publicação. Não dispare leads, e-mails ou agendas
  reais como parte dos testes locais; use serviços simulados.

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
por decisão do dono do produto. O código evoluiu depois desse descarte;
o posicionamento atual continua sendo IA comercial.

Não reintroduza o posicionamento descartado sem confirmação. As âncoras
`#como-funciona`, `#agentes`, `#crm` e `#planos` já existem no código atual:
sua presença não significa que a antiga branch deva ser recuperada. Preserve
as âncoras em uso e confira os links antes de alterá-las.

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
comportamento nessa limpeza — só reorganização. Corrigido também um bug
preexistente achado durante a verificação: o "Continuar" do
`ResumeSessionOverlay` restaurava `currentStep`/`formData`/`chatHistory` mas
não reativava `hasStarted`, fazendo a tela de boas-vindas voltar a aparecer
por cima do estado já restaurado.

## Stack

- **Framework**: Next.js 16.3.5 (App Router), React 19, TypeScript 5
  (`strict: false`, alias `@/*` → raiz do repo).
- **Estilo**: Tailwind CSS 4 (`@tailwindcss/postcss`), tokens parciais em
  `app/globals.css` e muitas classes inline. O design system completo ainda
  será consolidado nas fases 4/5; não suponha que o guia já seja imposto por componentes.
- **Animação**: Framer Motion 12; scroll suave via `lenis` em
  `components/SmoothScroll.tsx`; mobile/touch usa scroll nativo.
- **IA**: a assistente "Lia" (`components/LiaPopup.tsx` → `app/api/chat/route.ts`)
  fala com um endpoint próprio, auto-hospedado, compatível com Ollama
  (`LIA_AI_URL`, modelo `gemma3:1b` por padrão), com o prompt carregado de
  `lia_system_prompt_v3_tlin.md` na raiz. Não há mais nenhum uso de Gemini
  no projeto (a rota `app/api/qualify/route.ts`, que usava
  `@google/generative-ai`, foi removida em 2026-09-10 por estar morta —
  nada a chamava).
- **Leads**: Deskcomm recebe a captura operacional por `lib/deskcomm-leads.ts`.
  `lib/supabase-leads.ts` é uma projeção de backup via REST, sem SDK. E-mails
  via Nodemailer em `app/api/notify/route.ts`, com templates em `lib/emailTemplates.ts`.
- **CRM (Deskcomm)**: `lib/deskcomm-mcp.ts` fala com o servidor MCP do
  Deskcomm (`DESKCOMM_MCP_URL`, protocolo MCP/JSON-RPC via Bearer token em
  `DESKCOMM_API_TOKEN`) para consultar horários livres (`crm_find_free_slots`)
  e marcar a demo (`crm_book_appointment`). Ver "Agendamento de demo" abaixo.
- **Runtime/checks**: Node 24 (`.nvmrc`: 24.13.0), instalação com `npm ci`.
  `npm run check` executa geração de tipos de rota + TypeScript sem incremental,
  política de lint, Vitest e build. `npm run lint` exibe o diagnóstico detalhado.
  `npm test` cobre o adaptador de captura e o controle de dívida de lint; não
  existe ainda cobertura de ponta a ponta do funil.
- **Deploy**: Vercel, com deploy automático a partir de push em `main`
  (não há `vercel.json` versionado — configuração fica no painel do Vercel).

## Estrutura

```
app/                        rotas do App Router (page.tsx, layout.tsx, api/*, sitemap, robots)
app/{demo,comece}/          mesmo popup embedded standalone; /comece é alias de /demo (canonical aponta pra /demo)
app/{ia-whatsapp,recuperacao-de-leads,crm-com-ia,infoprodutores,agentes-de-ia}/
                            5 páginas de campanha — reaproveitam MarketingLandingPage.tsx
                            composição compartilhada com hero, dor, jornada e comparação por variante
app/{precos,como-funciona,obrigado}/
                            preços, demonstração da operação e confirmação da demo
app/{blog,legal}/            conteúdo e documentos; RSS em app/blog/rss.xml/
components/                 seções da landing e primitivos de UI (components/ui/)
components/lead-qualification/
                            subcomponentes do LeadQualificationPopup.tsx (ver seção própria abaixo)
lib/                        siteConfig, structuredData, utm, supabase-leads, emailTemplates, deskcomm-mcp
lib/dictionaries/           pt.ts/en.ts/es.ts + index.ts (getDictionary/TranslationDictionary) — dividido por idioma
public/                     assets estáticos, incluindo llms.txt / llms-full.txt / flags/ (bandeiras locais, não CDN)
supabase/                   migrations SQL da tabela de leads
tests/                      testes Vitest com serviços simulados
docs/quality/               checks, dívida de lint, sequência de fases e referência visual
.github/                    CI de qualidade e template de PR
```

### Composição da landing (`components/MarketingLandingPage.tsx`)

`app/page.tsx` (home) e as 5 páginas de campanha (`app/{ia-whatsapp,...}/page.tsx`)
só renderizam `<MarketingLandingPage heroVariant={...} />` — toda a composição
real vive nesse componente compartilhado. A home usa `Hero`; campanhas usam
`CampaignHero`, `PainSection`, `CampaignHowItWorks`, reviews e comparação.
A home combina TextReveal e CampaignHowItWorks com a variante `agentesDeIa`.
As seções compartilhadas incluem Features, ROI, Pricing, Testimonials, FAQ,
FooterBanner e Footer.

Features (`#como-funciona`, `#agentes`, `#crm`), Pricing (`#planos`),
Testimonials, FAQ e reviews de campanha são renderizados diretamente com SSR.
`DeferredSection` inicia vazio e só monta filhos perto da viewport: envolve
jornada, ROI, comparação e CTA final. Mesmo um import com SSR não produz HTML
inicial se seu pai adiar a montagem. TextReveal, ROI e FooterBanner também
usam imports com `ssr: false`. Avalie indexação e hidratação ao mudar isso.

`SiteChrome` fornece Header, LiaPopup, SmoothScroll e um único
`QualificationController` fora de `/demo` e `/comece`. Não adicione listeners
locais de `open-qualification`: blog/legal e as demais rotas já usam o controlador
global, que desmonta na mudança de pathname. `/qualificar` redireciona para `/demo`.

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

O wizard de qualificação (popup e `/demo` embedded) tem 10 steps: nome, telefone,
confirmação, volume, equipe, e-mail, **escolher dia** (7), **escolher horário** (8),
revisão (9), sucesso (`SUCCESS_STEP = 10`). Os steps 7/8 consultam
`GET /api/public/demo/availability` (que chama o Deskcomm via
`lib/deskcomm-mcp.ts` e agrupa por dia civil no fuso da agenda usando `Intl`
nativo — nunca uma lib de timezone). A confirmação final (`POST /api/notify`)
também dispara o webhook de captação do Deskcomm e
`crm_book_appointment` via MCP.

Na fase 2, `useQualificationRequest` centraliza captura, tokens e envio. Captura
antecipada só após confirmar telefone; cada envio consome um token diferente.
`QualificationRequest` persiste identidade/captura/estado por até 24 horas; um envio
interrompido vira incerto e exige verificar com a equipe antes de outra reserva.
Novo pedido explícito recebe nova identidade. Progresso inválido é descartado e
horários expirados voltam ao calendário. Nunca persista tokens de segurança.
`POST /api/notify` exige horário futuro e só retorna sucesso quando a agenda
confirma `marcado === true`; erros secundários preservam uma reserva já confirmada.
`/obrigado` usa recibo versionado por até 24 horas em sessionStorage, sem removê-lo
no refresh. Recibos são estado de UI, nunca autorização para operações no servidor.
Na fase 3, `demo_booked` substitui `qualify_lead` e `click_whatsapp` substitui
`close_convert_lead`. Só a etapa de avaliação no CRM qualifica comercialmente.
Supabase também coordena reservas com locks persistentes; sem banco, não agenda.
O painel `/internal/funnel` exige token. Retorno HMAC só acusa recebimento após
persistir o evento. Configuração externa, limites e ativação pendente estão em
`docs/quality/phase-3-tracking-crm.md`.
Leia `docs/quality/phase-2-verification.md` para limites e testes.

A validação real de ponta a ponta Deskcomm/Supabase foi adiada no ciclo anterior;
não a declare concluída com base em build ou testes do adaptador.

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
- Dois espaços de indentação, aspas duplas e ponto e vírgula; preserve o estilo
  local. ESLint está configurado em `eslint.config.mjs`; não há formatador imposto.
- Reutilize `DemoHoverPill` e o contrato visual, inclusive estados de foco,
  mobile, carregamento e erro. Conteúdo novo deve seguir o tom existente e
  evitar hífens e ponto final em títulos/textos auxiliares de marketing.
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

- Não reintroduzir o reposicionamento "CRM comercial" da branch descartada
  sem confirmação explícita do usuário. As âncoras existentes estão descritas acima.
- Não confundir `tlin.ia.br` (domínio real) com `tlin.ai.br`.
- Antes de qualquer ação que afete o branch `main` (merge, reset, force-push),
  confirme explicitamente com o usuário — já houve um incidente em que uma
  branch errada foi promovida a produção por engano. Verifique branches
  irmãs (`git branch -a`, `git merge-base`) antes de assumir qual é a
  "correta".

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
