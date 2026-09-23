# Phase 6: Sistema Editorial SEO, GEO e LLM - Research

**Researched:** 2026-09-23
**Domain:** arquitetura editorial, SEO técnico, descoberta generativa, atribuição de conteúdo e governança
**Confidence:** HIGH para SEO/Next.js e diagnóstico do repositório; MEDIUM para efeitos de descoberta generativa

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### Escopo e resultado
- **D-01:** O escopo aprovado é um sistema completo, incluindo tecnologia, arquitetura de informação, clusters, produção, autoridade, distribuição, mensuração e governança.
- **D-02:** O resultado comercial continua sendo demos confirmadas com leads qualificados; tráfego, impressões e formulários são indicadores intermediários.
- **D-03:** A fase depende da medição comercial da Phase 1, mas pode ser executada em paralelo às Phases 2–5.

### Posicionamento e conteúdo
- **D-04:** O território editorial deve fortalecer “IA comercial” como categoria principal e tratar CRM nativo, follow-up e agendamento como capacidades de apoio.
- **D-05:** A arquitetura deve separar intenção informacional, comparação/avaliação e conversão, evitando que artigos canibalizem home e páginas de campanha.
- **D-06:** Conteýo deve ser people-first, sustentado por fontes e contribuição original. Não inventar pesquisas, benchmarks, clientes, experiências, integrações, resultados ou links.
- **D-07:** Extensão, quantidade de headings, links, imagens e palavras-chave devem decorrer da intenção e da utilidade, nunca de cotas mecânicas.

### Descoberta generativa
- **D-08:** GEO e descoberta por LLMs serão tratados como clareza de entidade, consistência factual, passagens citáveis, fontes, autoria, HTML acessível e distribuição; `llms.txt` é complementar, não um atalho de ranking.
- **D-09:** Recomendações devem distinguir práticas documentadas, hipóteses experimentais e itens sem garantia de impacto.

### Implementação e operação
- **D-10:** Preservar URLs e comportamento dos três artigos atuais durante a migração.
- **D-11:** Reutilizar o design system e os componentes visuais existentes; esta fase não abre um redesign autônomo do blog.
- **D-12:** O modelo editorial deve permitir publicação e revisão sustentáveis sem manter todo o acervo em um único array TypeScript.
- **D-13:** A primeira entrega deve ser um tracer vertical verificável: um artigo migrado atravessa o novo modelo, renderiza metadados/schema/feed/sitemap, participa de um cluster e mede CTA sem quebrar a URL existente.

### the agent's Discretion

Nenhuma área de discricionariedade foi explicitada no CONTEXT.md.

### Deferred Ideas (OUT OF SCOPE)

- Publicação automática em canais de terceiros fica fora da primeira implementação; o plano deve definir o processo e pontos de integração antes de automatizar.
- Conteúdo em escala para PT/EN/ES fica adiado até existir autoridade e operação editorial consistente em português do Brasil.
- Claims de performance e estudos de caso dependem de dados reais, autorização e revisão comercial.

Fonte integral das restrições: [VERIFIED: .planning/phases/06-sistema-editorial-seo-geo-e-llm/06-CONTEXT.md:13-59]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BLOG-01 | A equipe publica, revisa e atualiza artigos por um modelo de conteúdo tipado que suporta autoria, datas de publicação e modificação, resumo, imagens, seções, fontes, links internos, CTA e status editorial. | Modelo `EditorialArticle`, registro por arquivo, validação de invariantes e projeções públicas descritos abaixo. |
| BLOG-02 | O blog organiza conteúdo em pilares, clusters e hubs com URLs, breadcrumbs e interligação coerentes, preservando a função comercial das landing pages existentes. | Taxonomia central, mapa de intenção/URL, hubs em `/blog/temas/[cluster]`, breadcrumbs e regras de links internos. |
| BLOG-03 | Páginas editoriais entregam HTML indexável, metadados únicos, canonical, Open Graph, dados estruturados válidos, sitemap e feed consistentes, imagens acessíveis e sinais de atualização verdadeiros. | Uma única projeção publicada alimenta página, metadata, JSON-LD, sitemap, RSS e OG; testes contratuais evitam divergência. |
| BLOG-04 | O processo editorial exige intenção de busca definida, fontes verificáveis, contribuição original, revisão factual e comercial, regras anti-plágio e proibição de dados ou experiências inventados. | Workflow de estados, brief, fontes, checklist e portas de revisão com responsabilidades definidas. |
| BLOG-05 | O sistema oferece briefs, templates, checklist de qualidade e rotina de atualização/distribuição para operar o calendário editorial com consistência. | Artefatos operacionais versionados no repositório e cadência de revisão/distribuição manual. |
| BLOG-06 | Analytics relaciona artigo, cluster, CTA e origem a engajamento, demo confirmada, qualificação e venda usando o contrato comercial da Phase 1. | Taxonomia de eventos de baixa cardinalidade, contexto durável no lead e ligação com estados do funil da Phase 1. |
| BLOG-07 | Os três artigos atuais são migrados sem quebrar URLs, canonical, sitemap, RSS, compartilhamento, navegação ou aparência essencial. | Estratégia tracer + adaptador temporário + snapshot dos três slugs e testes de paridade antes de remover `lib/blog.ts`. |

Descrições copiadas de [VERIFIED: .planning/REQUIREMENTS.md:38-44].
</phase_requirements>

## Summary

O repositório já tem uma base editorial funcional, mas monolítica: três artigos vivem em um único array TypeScript; página, sitemap e RSS projetam subconjuntos diferentes desse array; autoria, modificação real, fontes, imagens, CTA, intenção, cluster e status editorial não fazem parte do contrato. O artigo usa `publishedAt` também como `dateModified`, atribui autoria à organização no JSON-LD embora mostre uma pessoa na UI, e o CTA não transporta identidade editorial para a captura. [VERIFIED: lib/blog.ts:1-127; app/blog/[slug]/page.tsx:19-46,74-90,131-140; app/sitemap.ts:6-19; app/blog/rss.xml/route.ts:4-32]

A arquitetura recomendada é local e compilada: um arquivo por artigo, registros tipados separados de autores/taxonomia, uma camada única de consulta pública e validadores executados nos testes. Essa fonte canônica deve gerar HTML, metadata, JSON-LD, sitemap, RSS, breadcrumbs, hubs e contexto analítico. Para este repositório pequeno, isso resolve D-12 sem introduzir CMS, parser MDX ou dependência nova; a troca para CMS só deve ocorrer se surgir requisito confirmado de autoria por equipe não técnica. [ASSUMED]

SEO e descoberta generativa devem compartilhar a mesma fundação verificável: conteúdo útil e original, URLs canônicas, links rastreáveis, autoria e datas verdadeiras, HTML acessível e dados estruturados coerentes. Google afirma que não há requisitos especiais adicionais para aparecer em AI Overviews/AI Mode, que `llms.txt` não é usado por seus sistemas e que técnicas como “chunking” especial ou schema inventado não são necessárias. Portanto, clareza de passagem, testes de recuperabilidade e `llms.txt` ficam como hipóteses/artefatos complementares, nunca como promessa de ranking ou citação. [CITED: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide]

**Primary recommendation:** planejar um tracer vertical sobre um dos slugs existentes, fazendo-o atravessar o novo modelo até HTML/metadata/schema/feed/sitemap/hub/CTA, e só então migrar os outros dois com testes de paridade; nenhuma dependência externa nova é necessária. [ASSUMED]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Fonte editorial, autores, taxonomia e workflow | Frontend Server (build-time) | Git/revisão humana | Conteúdo local é compilado e revisado antes do deploy; nenhum editor em runtime foi solicitado. [ASSUMED] |
| HTML de artigo, hubs e breadcrumbs | Frontend Server (SSR/SSG) | Browser / Client | Conteúdo indexável deve existir no HTML inicial; busca/filtros podem continuar progressivos no cliente. [CITED: https://nextjs.org/docs/app/getting-started/metadata-and-og-images] |
| Metadata, canonical, OG e JSON-LD | Frontend Server | CDN / Static | Next.js resolve metadata e páginas estáticas no servidor/build; ativos OG podem ser estáticos ou gerados. [CITED: https://nextjs.org/docs/app/getting-started/metadata-and-og-images] |
| Sitemap, robots e RSS | Frontend Server | CDN / Static | Metadata files e Route Handlers são as superfícies nativas do App Router. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap; https://nextjs.org/docs/app/api-reference/file-conventions/route] |
| Imagens editoriais | CDN / Static | Frontend Server | `next/image` reserva dimensões, otimiza entrega e evita layout shift; alt/caption permanecem responsabilidade editorial. [CITED: https://nextjs.org/docs/app/getting-started/images; https://www.w3.org/WAI/tutorials/images/] |
| Eventos de leitura/CTA | Browser / Client | Frontend Server | Interações nascem no navegador; o servidor deve persistir somente o contexto necessário à atribuição do lead. [VERIFIED: lib/analytics-events.ts:1-74; lib/utm.ts:1-162] |
| Atribuição até demo/qualificação/venda | API / Backend | Database / Storage | A cadeia comercial precisa sobreviver à sessão e chegar ao registro do lead/CRM; eventos de navegador isolados não fecham o loop. [VERIFIED: lib/deskcomm-leads.ts:1-76; supabase/migrations/20250915120000_create_leads_table.sql:1-15] |
| Políticas de crawlers de busca/treino | CDN / Static | Governança | `robots.txt` expressa decisões separadas para busca, treinamento e fetch iniciado pelo usuário. [CITED: https://developers.openai.com/api/docs/bots; https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers] |
| Revisão factual, comercial e distribuição | Governança humana | Frontend Server | Código pode exigir campos/checklists, mas não substitui comprovação, autorização e revisão editorial. [ASSUMED] |

## Current Implementation Findings

### Modelo e inventário

O contrato atual é deliberadamente estreito. Valores discretos lidos da fonte:

DATA_K7Q2M9PX_START
`BlogCategory = "IA em movimento" | "Vendas com IA" | "WhatsApp e atendimento" | "Guias e playbooks"`

`BlogArticle` contém `slug`, `title`, `description`, `category`, `publishedAt`, `readingTime`, `author`, `featured?` e `content: { heading: string; paragraphs: string[] }[]`.
DATA_K7Q2M9PX_END

[VERIFIED: lib/blog.ts:1-17]

Os slugs que formam o contrato de migração são, verbatim:

DATA_R4N8V2KC_START
`"agentes-de-ia-no-whatsapp-para-vendas"`

`"como-avaliar-novos-modelos-de-ia-para-negocios"`

`"playbook-qualificacao-leads-whatsapp"`
DATA_R4N8V2KC_END

[VERIFIED: lib/blog.ts:19-108]

A seleção de relacionados hoje privilegia mesma categoria e completa com os demais artigos; não existe relação de cluster explícita. [VERIFIED: lib/blog.ts:121-127]

### Superfícies públicas e divergências

- `generateStaticParams()` e `generateMetadata()` consultam diretamente `blogArticles`; metadata inclui canonical e Open Graph textual, mas não uma imagem própria do artigo. Como campos de metadata aninhados são substituídos, não mesclados profundamente, um `openGraph` filho incompleto não deve depender da imagem do layout raiz. [VERIFIED: app/blog/[slug]/page.tsx:19-37] [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-metadata]
- O JSON-LD atual usa `Article`, replica `publishedAt` em `dateModified` e usa `Organization` como `author`; a UI mostra o campo pessoal `article.author`. Isso gera semântica inconsistente e impede sinal verdadeiro de atualização. [VERIFIED: app/blog/[slug]/page.tsx:41-46,74-90]
- O CTA final aponta diretamente para `https://tlin.ia.br/#planos`, sem abrir o fluxo global nem carregar `article`, `cluster` ou `cta` como contexto. [VERIFIED: app/blog/[slug]/page.tsx:131-140]
- A listagem entrega artigos via SSR, mas a busca e a grade são clientes; o filtro pesquisa somente título e descrição. Hubs/temas precisam ter rotas e HTML próprios, não depender de um filtro client-side. [VERIFIED: app/blog/page.tsx:8-33; components/blog/BlogSearchAndGrid.tsx:1-107]
- O sitemap usa `new Date()` para páginas institucionais/blog e `publishedAt` para artigos. Assim, páginas estáveis parecem modificadas a cada build enquanto artigos realmente atualizados não têm data distinta. Google recomenda `lastmod` preciso e ignora `priority` e `changefreq`. [VERIFIED: app/sitemap.ts:1-62] [CITED: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap]
- O RSS é XML montado por interpolação manual e publica título, descrição, link, GUID e `pubDate`; é preciso escapar todos os campos e derivar a mesma projeção de artigos publicados usada pelo site. [VERIFIED: app/blog/rss.xml/route.ts:1-39]
- `public/llms.txt` e `public/llms-full.txt` duplicam fatos comerciais manualmente e não apontam para o blog; essa duplicação é fonte de drift. [VERIFIED: public/llms.txt:1-48; public/llms-full.txt:1-122]

### Medição existente

A allowlist atual aceita, verbatim:

DATA_F8T3W6NJ_START
`/^(first_|last_)?utm_(source|medium|campaign|term|content)$|^(event_category|lead_step|field_name|plan_name|lead_score|lead_quality|lead_volume|team_size|form_mode|cta_source|cta_location|cta_text|source|destination|solution|page_location|page_referrer|page_path|event_id)$/`
DATA_F8T3W6NJ_END

Portanto `article_id`, `article_slug`, `content_cluster`, `content_intent`, `content_group`, `method`, `content_type` e `item_id` seriam descartados hoje. [VERIFIED: lib/analytics-events.ts:14-20]

O módulo de UTM mantém primeiro/último toque por 30 dias e grava landing/referrer, mas o adaptador Deskcomm só projeta campos escalares de campanha/landing/referrer; `cta_source` e taxonomia editorial não formam hoje um contexto durável até o CRM. O schema Supabase dispõe de `utm jsonb`, mas não possui colunas editoriais específicas. [VERIFIED: lib/utm.ts:1-162; lib/deskcomm-leads.ts:42-45; supabase/migrations/20250915120000_create_leads_table.sql:1-15]

## Standard Stack

### Core

| Library / recurso | Version | Purpose | Why Standard |
|-------------------|---------|---------|--------------|
| Next.js App Router | 16.3.5 | rotas estáticas, metadata, sitemap/robots, Route Handler do feed e imagens | Já é o framework fixado no produto e possui primitivas nativas para todas as superfícies técnicas desta fase. [VERIFIED: package.json; package-lock.json; node_modules/next/dist/docs] |
| React | 19.2.4 | renderização semântica e componentes editoriais | Stack já fixada no projeto; escaping de texto por padrão reduz a superfície de HTML injetado. [VERIFIED: package.json; package-lock.json] |
| TypeScript | 5.9.3 | contrato editorial e registros `satisfies` | Já instalado; adequado para modelo estático tipado sem dependência adicional. [VERIFIED: package.json; package-lock.json] |
| Vitest | 3.2.4 | invariantes de conteúdo, migração, metadata/schema/feed/sitemap e analytics | Infraestrutura existente e rápida; a suíte focal atual passou 6 testes. [VERIFIED: package.json; package-lock.json; vitest.config.ts; npm test local] |
| Git + revisão por PR | existente | workflow editorial e governança | Conteúdo local pode compartilhar revisão, histórico e deploy já usados pelo projeto. [ASSUMED] |

### Supporting

| Recurso | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `Metadata` / `generateMetadata` | Next 16.3.5 | metadata única, canonical e OG por rota | Em cada artigo e hub, sempre derivado do registro canônico. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-metadata] |
| `Image` / metadata image files | Next 16.3.5 | imagens editoriais e de compartilhamento | Para hero/inline com dimensões conhecidas e para OG específico por artigo. [CITED: https://nextjs.org/docs/app/getting-started/images; https://nextjs.org/docs/app/getting-started/metadata-and-og-images] |
| Metadata files `sitemap.ts`/`robots.ts` | Next 16.3.5 | descoberta técnica | Para expor somente artigos/hubs publicados e política de crawler deliberada. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap; https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots] |
| Route Handler | Next 16.3.5 | RSS XML | Para resposta XML testável, com escaping e headers explícitos. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/route] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| arquivos TypeScript por artigo | MDX | MDX é melhor quando o conteúdo precisa de composição rica por autor técnico, mas adiciona compilação, política de componentes e risco de HTML/componentes arbitrários; não é necessário para os blocos atuais. [ASSUMED] |
| conteúdo local | CMS headless | CMS é indicado quando editores não técnicos e publicação desacoplada são requisitos; acrescenta API, preview, webhooks, autenticação, migração e indisponibilidade externa. Esse requisito não está no contexto. [ASSUMED] |
| validadores puros + Vitest | biblioteca de schema runtime | Útil quando conteúdo entra em runtime por API; para módulos compilados no repo, uma dependência nova não se justifica nesta fase. [ASSUMED] |

**Installation:** nenhuma. A fase deve usar as dependências já existentes. [ASSUMED]

## Package Legitimacy Audit

Não aplicável: a recomendação prescritiva não instala pacotes. O plano deve reabrir o gate de legitimidade somente se decidir introduzir MDX, CMS ou validador externo. [ASSUMED]

## Architecture Patterns

### System Architecture Diagram

```text
autor/revisor
    |
    v
brief + fontes + artigo tipado por arquivo -----> validação build/test
    |                                                |
    |                                          falha -> não publicar
    v                                                |
registro canônico publicado <------------------------+
    |
    +--> query pública --> HTML de artigo/hub --> crawler, pessoa, LLM
    +--> metadata      --> canonical + OG
    +--> schema        --> Article + BreadcrumbList
    +--> discovery     --> sitemap + RSS + llms complementar
    +--> taxonomy      --> links internos + relacionados
    +--> analytics     --> page/CTA + origem
                               |
                               v
                       captura de lead/API
                               |
                               v
                    Supabase/Deskcomm + funil Phase 1
                               |
                               v
                 demo confirmada -> qualificação -> venda
```

O ponto decisório é `status === published`: somente essa projeção pode alcançar rotas, static params, hubs, sitemap, RSS e artefatos de descoberta. O valor de status é uma proposta a ser codificada e testada, não um valor existente. [ASSUMED]

### Recommended Project Structure

```text
content/
└── editorial/
    ├── articles/                  # um módulo por artigo; slugs preservados
    ├── authors.ts                 # pessoas e URLs de perfil
    ├── taxonomy.ts                # pilares, clusters e intents
    └── templates/                 # brief/checklist versionados
lib/
└── editorial/
    ├── types.ts                   # contrato e block union
    ├── registry.ts                # agregação explícita dos módulos
    ├── queries.ts                 # única API de leitura pública
    ├── validate.ts                # invariantes de build/test
    ├── structured-data.ts         # Article/BreadcrumbList
    ├── feed.ts                    # escape e serialização RSS
    └── analytics.ts               # IDs estáveis e payload permitido
app/blog/
├── page.tsx                       # hub principal SSR
├── [slug]/page.tsx                # URL atual preservada
├── temas/[cluster]/page.tsx       # hubs temáticos explícitos
└── rss.xml/route.ts               # projeção do registro publicado
docs/editorial/
├── README.md                      # workflow, RACI e cadência
├── content-brief.md               # template de brief
├── quality-checklist.md           # gate factual/comercial/SEO
└── distribution.md                # rotina manual e pontos de integração
tests/editorial/
├── content-contract.test.ts
├── migration-parity.test.ts
├── metadata-schema.test.ts
├── discovery-outputs.test.ts
└── analytics-attribution.test.ts
```

Essa estrutura é uma recomendação adequada ao tamanho e stack atuais; nomes finais são [ASSUMED].

### Pattern 1: Canonical content registry with projections

**What:** todo consumidor lê artigos por `getPublishedArticles()`/`getArticleBySlug()`, nunca importa arquivos individuais nem o array legado. Metadata, schema, sitemap e RSS são projeções do mesmo objeto validado. [ASSUMED]

**When to use:** em toda superfície pública e teste da fase.

**Consequence:** elimina datas, URLs, autores e status divergentes entre página e feeds. A query pública deve retornar somente publicados e ordenar deterministicamente. [ASSUMED]

### Pattern 2: Tagged block union, not arbitrary HTML

**What:** modelar parágrafos, headings, listas, quotes, imagens e callouts como uma união discriminada renderizada por componentes permitidos. Não armazenar JSX ou HTML cru no artigo inicial. [ASSUMED]

**When to use:** no novo `sections`, preservando a aparência por componentes existentes.

**Example (contrato proposto, valores ainda não existentes):**

```typescript
// Padrão proposto [ASSUMED]; validar por TypeScript + testes de invariantes.
type EditorialStatus = "draft" | "review" | "published" | "archived";
type SearchIntent =
  | "informational"
  | "commercial-investigation"
  | "conversion-support";

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string };
```

### Pattern 3: Intent-to-URL ownership map

**What:** cada brief registra intenção, pergunta principal, cluster, estágio e URL que é dona do assunto. Artigos informacionais ficam em `/blog/{slug}`; hubs em `/blog/temas/{cluster}`; termos transacionais permanecem na home e nas páginas de campanha existentes. [ASSUMED]

**When to use:** antes de aprovar qualquer pauta ou novo hub.

**Rule:** um artigo pode apoiar uma landing por links e CTA, mas não deve copiar sua proposta, title, H1 ou intenção principal. Não há cota mecânica de links; cada link deve explicar uma relação útil. Google recomenda links rastreáveis em `<a href>` e texto âncora descritivo. [CITED: https://developers.google.com/search/docs/crawling-indexing/links-crawlable]

### Pattern 4: Tracer migration with compatibility adapter

**What:** introduzir a nova query com um artigo migrado; adaptar consumidores para aceitar projeção nova; validar URL e saída; migrar os outros dois; só então remover o array antigo. [ASSUMED]

**Order:**

1. Congelar snapshots dos três slugs, canonicals, titles, HTML essencial, sitemap e itens RSS. [ASSUMED]
2. Implementar tipos, taxonomia, autores, validação e query publicada. [ASSUMED]
3. Migrar `agentes-de-ia-no-whatsapp-para-vendas` como tracer por estar diretamente alinhado ao território de IA comercial. [ASSUMED]
4. Alimentar artigo, metadata, schema, sitemap, RSS, hub e CTA pelo novo registro. [ASSUMED]
5. Migrar os dois restantes e provar paridade antes de excluir `lib/blog.ts`. [ASSUMED]

### Pattern 5: Editorial review as an enforceable state machine

**What:** draft → factual/commercial review → published → scheduled review/archive. Código bloqueia campos ausentes; pessoas confirmam evidência, claims e adequação comercial. [ASSUMED]

**Minimum gate:** intenção/URL dona, contribuição original, fontes acessadas, claims ligados a fontes, autoria/revisor, datas, mídia/alt, links internos, CTA, preview, plagiarism check humano/ferramenta autorizada e aprovação comercial para claims. [ASSUMED]

### Pattern 6: Progressive attribution, not analytics-only attribution

**What:** eventos de navegador usam IDs estáveis e baixa cardinalidade; quando uma pessoa inicia qualificação, o contexto editorial é copiado para o payload durável do lead e segue até Supabase/Deskcomm/funil. [ASSUMED]

**Recommended fields:** `article_slug`, `content_cluster`, `content_intent`, `cta_id`, `cta_location` e first/last content touch. Nomes finais exigem alinhamento com o contrato da Phase 1 e são [ASSUMED]. Não reutilizar `utm_campaign` para taxonomia interna; UTM descreve aquisição externa. [ASSUMED]

GA4 proíbe envio de informações pessoalmente identificáveis e permite dimensões personalizadas por evento; use IDs controlados, nunca título livre, e-mail, telefone, consulta ou texto do usuário. [CITED: https://support.google.com/analytics/answer/6366371; https://support.google.com/analytics/answer/14240153]

### Established vs Experimental vs Unsupported

| Classificação | Prática | Planejamento |
|---------------|---------|--------------|
| Documentada | conteúdo people-first, original, com autoria/fontes; HTML acessível; canonical consistente; links rastreáveis; sitemap/lastmod verdadeiro; Article/Breadcrumb schema; imagens representativas | Deve virar requisito e teste. [CITED: https://developers.google.com/search/docs/fundamentals/creating-helpful-content; https://developers.google.com/search/docs/appearance/structured-data/article] |
| Documentada | permitir `OAI-SearchBot` controla a possibilidade de conteúdo aparecer na busca do ChatGPT; `GPTBot` controla potencial uso em treinamento; são controles independentes | Decisão explícita de política, sem prometer inclusão. [CITED: https://developers.openai.com/api/docs/bots] |
| Documentada | `Google-Extended` controla certos usos Gemini/grounding e não afeta inclusão/ranking no Google Search | Separar política de IA da indexação do Google. [CITED: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers] |
| Experimental | passagens autocontidas, respostas diretas, definições consistentes, tabelas úteis e testes periódicos de recuperabilidade/citação em LLMs | Usar como diagnóstico editorial; medir, registrar variação e não declarar causalidade. [ASSUMED] |
| Complementar | `llms.txt`/`llms-full.txt` | Manter pequeno, factual e sincronizado; Google diz ignorá-lo e a especificação pública se apresenta como proposta. [CITED: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide; https://llmstxt.org/] |
| Sem suporte | schema “especial para IA”, keyword stuffing, texto oculto, fake freshness, volume automático sem valor, compra/invenção de menções e garantia de citações | Proibir no checklist. Google afirma que não é necessário schema especial nem mudanças técnicas específicas e trata produção escalada sem valor como risco de spam. [CITED: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide; https://developers.google.com/search/docs/fundamentals/using-gen-ai-content] |

### Anti-Patterns to Avoid

- **Duplicar conteúdo canônico em múltiplas estruturas:** página, RSS, sitemap, schema e llms devem ser projeções, não cópias manuais. [ASSUMED]
- **Expor draft em um consumidor esquecido:** centralizar filtro publicado e testá-lo em todas as saídas. [ASSUMED]
- **Usar `new Date()` como `lastModified`:** sinaliza mudança inexistente; usar `modifiedAt` somente após alteração substantiva. [CITED: https://developers.google.com/search/docs/appearance/publication-dates]
- **Mudar data para parecer recente:** Google recomenda data visível e estruturada consistente com atualização real. [CITED: https://developers.google.com/search/docs/appearance/publication-dates]
- **Criar hub client-only:** filtros não substituem URL indexável, canonical, título e links SSR. [ASSUMED]
- **Adicionar CMS/MDX antes do workflow:** tecnologia não resolve revisão factual, ownership ou atribuição. [ASSUMED]
- **Usar PageRank interno mecânico:** cotas de links por artigo contradizem D-07; ligar quando há relação útil. [VERIFIED: 06-CONTEXT.md:24-25]
- **Tratar crawler allow como opt-in de ranking:** `robots.txt` dá permissão de acesso, não inclusão nem citação. [CITED: https://developers.openai.com/api/docs/bots]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Metadata e canonical | tags imperativas no DOM | `Metadata`/`generateMetadata` | Integração nativa com App Router e renderização server-side. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-metadata] |
| Sitemap/robots | endpoints genéricos sem tipos | metadata files do Next | Contrato e serialização nativos. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata] |
| Imagem otimizada | `<img>` sem dimensões para hero | `next/image` | Reserva de espaço, otimização e lazy loading; alt continua editorial. [CITED: https://nextjs.org/docs/app/getting-started/images] |
| Timezone/data editorial | heurística de strings | ISO 8601 com timezone e `Date` somente na borda | Google pede timezone em datas estruturadas e consistência visível. [CITED: https://developers.google.com/search/docs/appearance/structured-data/article] |
| HTML rico | `dangerouslySetInnerHTML`/parser próprio | block union + componentes React | Menor superfície XSS e aparência controlada. [ASSUMED] |
| Analytics | query params/títulos livres e payload arbitrário | `trackEvent` existente + allowlist ampliada + IDs estáveis | Preserva controle de PII/cardinalidade e o contrato do funil. [VERIFIED: lib/analytics-events.ts:1-74] |
| XML | interpolação sem escape | pequeno serializer/escape testado, sem dependência | XML exige escaping correto; o formato é pequeno o suficiente para função pura e testes. [ASSUMED] |
| Auditoria humana | “score SEO” inventado | checklist, evidência e owners | Um score não comprova verdade, originalidade nem revisão comercial. [ASSUMED] |

**Key insight:** as primitivas técnicas já existem no framework; o trabalho complexo é estabelecer uma fonte canônica, invariantes entre projeções e governança humana verificável. [ASSUMED]

## Runtime State Inventory

Esta fase inclui migração; atualizar arquivos não cobre todo o estado observado por busca, analytics e CRM.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | Conteúdo atual está no repo, não em banco. Leads existentes usam `utm jsonb`; não há campos editoriais específicos no schema lido. [VERIFIED: lib/blog.ts:1-127; supabase/migrations/20250915120000_create_leads_table.sql:1-15] | Preservar os três slugs; definir migração somente para novos campos de atribuição futura. Não reescrever leads históricos sem fonte confiável. [ASSUMED] |
| Live service config | GA4 custom definitions, Search Console e configuração Vercel ficam fora do código inspecionado. [ASSUMED] | Criar checkpoint manual: registrar dimensões/eventos, submeter/verificar sitemap após deploy e confirmar propriedade/produção; não declarar configurado por teste local. [ASSUMED] |
| OS-registered state | Nenhuma tarefa/serviço de blog é declarado no repo; a fase não requer registro de SO. [VERIFIED: repository scan] | Nenhuma ação de migração de SO identificada. [ASSUMED] |
| Secrets/env vars | Não há segredo editorial; IDs/configuração de analytics existentes não devem ser renomeados. Credenciais de Search Console não estão versionadas. [VERIFIED: repository scan] | Não adicionar segredo para conteúdo local; usar acesso humano já governado para consoles. [ASSUMED] |
| Build artifacts / installed packages | `.next` e `tsconfig.tsbuildinfo` são gerados; não há pacote editorial instalado. [VERIFIED: repository scan; package.json] | Rebuild após migração; não versionar cache TypeScript nem saída do Next. [VERIFIED: AGENTS.md:20-24] |

Estado externo inevitável: URLs já podem estar indexadas, linkadas e armazenadas em analytics. Preservar rota/canonical e observar Search Console é obrigatório; o repositório não permite provar backlinks ou cobertura atuais. [ASSUMED]

## Common Pitfalls

### Pitfall 1: Shallow metadata merge removes inherited OG fields

**What goes wrong:** artigo define `openGraph` sem imagem e perde a imagem do layout superior.
**Why it happens:** campos aninhados são substituídos, não profundamente mesclados.
**How to avoid:** retornar o objeto OG completo ou compartilhar a imagem explicitamente.
**Warning signs:** preview social sem imagem/locale/type. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-metadata]

### Pitfall 2: Publication date masquerades as modification date

**What goes wrong:** `dateModified` e sitemap não representam revisão real.
**Why it happens:** o modelo só possui `publishedAt`.
**How to avoid:** `modifiedAt` obrigatório quando houver mudança substantiva; mostrar a data e usá-la em schema/sitemap/RSS.
**Warning signs:** todos os artigos “atualizados” no deploy ou `dateModified === datePublished` após revisão. [VERIFIED: app/blog/[slug]/page.tsx:41-46] [CITED: https://developers.google.com/search/docs/appearance/publication-dates]

### Pitfall 3: Schema syntaticamente válido, semanticamente contraditório

**What goes wrong:** UI mostra pessoa, JSON-LD declara organização, publisher não referencia a entidade global e imagem está ausente.
**Why it happens:** schema é mantido à parte da UI.
**How to avoid:** construir schema do mesmo registro, usar `author.url`, `publisher.@id`, datas e imagens coerentes, e validar em Rich Results Test e Schema Markup Validator.
**Warning signs:** valores que não aparecem na página ou entidades duplicadas. [CITED: https://developers.google.com/search/docs/appearance/structured-data/article; https://developers.google.com/search/docs/appearance/structured-data/sd-policies]

### Pitfall 4: Draft leakage

**What goes wrong:** draft entra em `generateStaticParams`, sitemap ou RSS mesmo sem navegação visível.
**Why it happens:** cada consumidor filtra por conta própria.
**How to avoid:** uma query publicada, teste matriz de consumidores e `notFound()` para não publicados.
**Warning signs:** contagens diferentes entre blog, sitemap e feed. [ASSUMED]

### Pitfall 5: Internal search/client filter treated as information architecture

**What goes wrong:** clusters não têm URL, canonical, breadcrumb nem links rastreáveis.
**Why it happens:** tags visuais parecem navegação suficiente.
**How to avoid:** hubs SSR explícitos e links `<a href>` entre artigos/hubs/landing.
**Warning signs:** cluster só aparece após digitar ou executar JavaScript. [CITED: https://developers.google.com/search/docs/crawling-indexing/links-crawlable]

### Pitfall 6: Analytics stops at CTA click

**What goes wrong:** dashboards mostram clique, mas não qual artigo originou demo confirmada, qualificação e venda.
**Why it happens:** contexto vive apenas no browser/evento e não entra no lead.
**How to avoid:** persistir first/last content touch no payload do lead e manter `event_id`/identidade do contrato comercial.
**Warning signs:** `article_cta_click` alto e nenhum campo correspondente no Supabase/Deskcomm. [VERIFIED: lib/analytics-events.ts:14-20; lib/deskcomm-leads.ts:42-45]

### Pitfall 7: High-cardinality or PII analytics

**What goes wrong:** parâmetros incluem títulos livres, termos digitados, e-mail ou telefone.
**Why it happens:** instrumentação copia estado da UI.
**How to avoid:** slugs/IDs controlados e allowlist; revisão explícita de PII.
**Warning signs:** valores quase únicos ou texto fornecido pelo usuário. [CITED: https://support.google.com/analytics/answer/6366371]

### Pitfall 8: RSS broken by valid editorial text

**What goes wrong:** `&`, `<`, `>` ou sequência CDATA inválida quebra o feed.
**Why it happens:** interpolação manual.
**How to avoid:** escapar campo por campo e parsear a resposta nos testes.
**Warning signs:** feed funciona com fixtures simples e falha com título real. [VERIFIED: app/blog/rss.xml/route.ts:4-32]

### Pitfall 9: GEO cargo cult

**What goes wrong:** equipe investe em `llms.txt`, blocos artificiais ou schema inventado e negligencia conteúdo/HTML/links.
**Why it happens:** confundir hipótese de recuperabilidade com documentação de ranking.
**How to avoid:** rotular cada tática e exigir fonte/experimento; manter KPIs comerciais.
**Warning signs:** promessa de citação, ranking ou “otimização para LLM” sem baseline. [CITED: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide]

### Pitfall 10: Migration changes the content contract and appearance together

**What goes wrong:** regressão é difícil de atribuir e os três artigos quebram de uma vez.
**Why it happens:** big-bang sem tracer.
**How to avoid:** um artigo, adaptador temporário e snapshots de saída antes da migração em lote.
**Warning signs:** remoção de `lib/blog.ts` no mesmo commit que cria todas as novas rotas/componentes. [ASSUMED]

## Code Examples

### Safe JSON-LD serialization

```tsx
// Source: Next.js official guide
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
  }}
/>
```

O padrão evita interpretar `<` vindo do objeto como HTML; ainda é necessário construir `articleSchema` somente com dados validados. [CITED: https://nextjs.org/docs/app/guides/json-ld]

### Article schema projection

```typescript
// Campos recomendados pela documentação; IDs/nomes locais são proposta [ASSUMED].
const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  datePublished: article.publishedAt,
  dateModified: article.modifiedAt,
  image: article.heroImage.structuredDataUrls,
  author: article.authors.map((author) => ({
    "@type": "Person",
    name: author.name,
    url: author.profileUrl,
  })),
  publisher: { "@id": `${siteConfig.url}/#organization` },
  mainEntityOfPage: article.canonicalUrl,
};
```

Google recomenda `author.name`, `author.url`, datas com timezone, headline e imagens representativas; proporções 1:1, 4:3 e 16:9 aumentam a elegibilidade visual, quando imagens equivalentes existirem de verdade. [CITED: https://developers.google.com/search/docs/appearance/structured-data/article]

### Published projection invariant

```typescript
// Padrão proposto [ASSUMED].
export function getPublishedArticles(now = new Date()) {
  return editorialArticles
    .filter((article) => article.status === "published")
    .filter((article) => new Date(article.publishedAt) <= now)
    .toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
```

Testes devem cobrir status, publicação futura, slug duplicado, datas, autores/taxonomia inexistentes, URLs/alt e contagem igual entre projeções. [ASSUMED]

### Event payload with controlled cardinality

```typescript
// Nomes recomendados, sujeitos ao contrato Phase 1 [ASSUMED].
trackEvent("article_cta_click", {
  article_slug: article.slug,
  content_cluster: article.clusterId,
  content_intent: article.intent,
  cta_source: article.cta.id,
  cta_location: "article_footer",
});
```

O planner deve incluir a ampliação da allowlist e um teste de sanitização; sem isso, os novos parâmetros desaparecem silenciosamente. [VERIFIED: lib/analytics-events.ts:14-20]

## Editorial Operating Model

### Brief obrigatório

Cada pauta deve registrar: problema do leitor, público, estágio, intenção, pergunta principal, URL dona/possível conflito, cluster/pilar, evidência primária, contribuição original, claims permitidos/proibidos, especialista/revisor, links internos esperados por utilidade, CTA e hipótese de medição. Esses campos são governança proposta. [ASSUMED]

### Evidência e originalidade

Priorizar documentação oficial, legislação/regulador quando aplicável, pesquisa original publicada e dados internos autorizados. Fontes secundárias servem para contexto, não para transformar alegação não verificada em fato. Toda estatística mutável deve armazenar fonte, data de acesso e escopo; remover ou atualizar claim quando a fonte deixar de sustentá-lo. [ASSUMED]

Google orienta demonstrar experiência/conhecimento, explicar quem criou o conteúdo, citar fontes e agregar valor original; também afirma não existir contagem preferida de palavras. Conteúdo generativo pode apoiar pesquisa/estrutura, mas páginas produzidas em escala sem valor podem infringir políticas de spam. [CITED: https://developers.google.com/search/docs/fundamentals/creating-helpful-content; https://developers.google.com/search/docs/fundamentals/using-gen-ai-content]

### Review and update cadence

- Gatilhos mais importantes que calendário fixo: mudança do produto, alteração de fonte/documentação, mudança regulatória, queda sustentada de desempenho, links quebrados ou claim que perdeu validade. [ASSUMED]
- Revisão periódica por risco: conteúdo de produto/claims e páginas de alto tráfego com maior frequência; conteúdo estável com menor frequência. A frequência concreta deve ser escolhida pelo owner e registrada no artigo. [ASSUMED]
- Atualizar `modifiedAt` somente com mudança substantiva e registrar resumo da revisão no histórico do Git/PR. [CITED: https://developers.google.com/search/docs/appearance/publication-dates]
- Distribuição inicial é manual: newsletter/social/parceiros/canais próprios com URL/UTM definida; automação fica apenas como interface documentada, conforme escopo diferido. [VERIFIED: 06-CONTEXT.md:54-59]

### Authorship and authority

Criar páginas reais de autor com nome, função, bio, temas de competência e links verificáveis; Article schema deve apontar para essa URL. Não inventar credenciais nem usar autor fictício. Para artigos com claims comerciais, registrar revisor comercial/factual mesmo que o schema público mostre apenas autores. [ASSUMED] [CITED: https://developers.google.com/search/docs/appearance/structured-data/article]

## Measurement Design

### Funnel

```text
Search Console / referência / UTM
        -> article_view + engagement
        -> article_cta_click
        -> qualification_started
        -> demo_booked (confirmada)
        -> avaliação/qualificação no CRM
        -> venda
```

Os nomes pós-CTA devem reutilizar exatamente o contrato da Phase 1; não criar uma taxonomia paralela. O repositório já registra eventos e UTM, mas a identidade editorial ainda não percorre o lead. [VERIFIED: lib/analytics-events.ts:1-74; lib/utm.ts:1-162; .planning/phases/06-sistema-editorial-seo-geo-e-llm/06-CONTEXT.md:17-19]

### Dimensions and KPIs

| Layer | Dimensions | Metrics | Interpretation |
|-------|------------|---------|----------------|
| Discovery | landing page, query aggregate, country/device, cluster | impressions, clicks, CTR | demanda/visibilidade, não resultado comercial. [CITED: https://support.google.com/webmasters/answer/16984139] |
| On-site | article slug, cluster, intent, CTA id/location, source/medium | views, engaged sessions, CTA clicks | consumo e progressão; não qualificação. [CITED: https://developers.google.com/analytics/devguides/collection/ga4/views] |
| Conversion | first/last article, cluster, CTA, origin | demo confirmada, taxa de demo | resultado operacional intermediário definido pelo projeto. [VERIFIED: 06-CONTEXT.md:17-19] |
| Commercial | mesmos IDs ligados ao lead | qualificação e venda | norte real; exige persistência server-side/CRM. [VERIFIED: .planning/REQUIREMENTS.md:43] |
| Generative | referral observado, crawler access e amostra manual | sessões/referrals; presença/citação em amostra | diagnóstico experimental, sem inferir cobertura total ou causalidade. [ASSUMED] |

GA4 oferece o evento recomendado `share` com `method`, `content_type` e `item_id`; usar o padrão para compartilhamento e evento custom apenas para CTA editorial. [CITED: https://developers.google.com/analytics/devguides/collection/ga4/reference/events]

### Required implementation decisions

1. Ampliar allowlist com parâmetros editoriais e testes de descarte/PII. [ASSUMED]
2. Definir first/last content touch e persistência no pedido/lead sem substituir UTM. [ASSUMED]
3. Projetar esses campos para Supabase e Deskcomm ou documentar, com o owner da Phase 1, onde o join ocorre. [ASSUMED]
4. Registrar custom dimensions no GA4 após deploy; mudança de código sozinha não cria relatórios. [CITED: https://support.google.com/analytics/answer/14240153]
5. Criar relatório por artigo/cluster até `demo_booked`, qualificação e venda; tráfego não é sucesso final. [VERIFIED: 06-CONTEXT.md:17-19]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| “conteúdo para mecanismo” e contagem de palavras | people-first, utilidade, originalidade, autoria e evidência | orientação atual e contínua do Google | checklist deve avaliar valor e verdade, não quotas. [CITED: https://developers.google.com/search/docs/fundamentals/creating-helpful-content] |
| otimização GEO como camada técnica especial | fundamentos de SEO + conteúdo único; sem schema/chunking/arquivo especial obrigatório | guia oficial atual | separar prática documentada de hipótese; `llms.txt` não é ranking lever do Google. [CITED: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide] |
| um único bot OpenAI | `OAI-SearchBot`, `GPTBot` e `ChatGPT-User` com propósitos diferentes | documentação oficial atual | política robots precisa decidir busca e treino separadamente; user fetch pode não obedecer robots. [CITED: https://developers.openai.com/api/docs/bots] |
| data de build como freshness | `datePublished`, `dateModified` e sitemap `lastmod` verdadeiros | orientação atual | modelo precisa de modificação substantiva, não timestamp automático. [CITED: https://developers.google.com/search/docs/appearance/publication-dates; https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap] |
| métricas de tráfego isoladas | cadeia conteúdo → demo confirmada → qualificação → venda | decisão do projeto | BLOG-06 exige dados duráveis no lead, não apenas GA4. [VERIFIED: .planning/REQUIREMENTS.md:43] |

**Deprecated/outdated:**

- Usar `priority`/`changefreq` como otimização de Google: Google declara que os ignora. [CITED: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap]
- Atualizar datas sem mudança substancial: prática enganosa e sem utilidade. [CITED: https://developers.google.com/search/docs/appearance/publication-dates]
- Tratar `Google-Extended` como controle da busca orgânica: a documentação afirma que não impacta inclusão nem ranking no Google Search. [CITED: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Editoria desta fase será baseada em arquivos tipados locais e Git/PR por operador técnico. | Standard Stack | Resolvido para Phase 6; CMS só reabre mediante requisito confirmado de publicação não técnica. |
| A2 | `/blog/temas/[cluster]` é a melhor convenção de hubs sem conflitar com `[slug]`. | Architecture Patterns | Uma taxonomia/URL já definida pelo negócio exigiria redirects e revisão do mapa. |
| A3 | O primeiro tracer deve ser `agentes-de-ia-no-whatsapp-para-vendas`. | Migration | Outro artigo pode ter menor risco ou prioridade comercial maior. |
| A4 | Campos editoriais first/last estendem o contrato Phase 1 com IDs limitados e transportes simulados. | Measurement | O shape exato deve ser fundamentado no código atual; ativação externa continua checkpoint e não autoriza integração real. |
| A5 | Testes manuais de recuperabilidade/citação em LLMs têm valor diagnóstico. | GEO/LLM | Resultados são voláteis e podem não representar usuários; nunca usar como garantia/KPI principal. |
| A6 | Um serializer RSS puro local é suficiente; não é necessário pacote. | Don't Hand-Roll | Requisitos futuros de múltiplos formatos/extensões podem justificar biblioteca verificada. |
| A7 | Não há estado OS/editorial externo além dos consoles citados. | Runtime State | Configuração não versionada desconhecida pode exigir passo manual adicional. |

## Open Questions (RESOLVED)

1. **RESOLVED — Operação editorial e CMS**
   - Phase 6 usa arquivos tipados locais com Git/PR review por operador técnico. Não há CMS runtime, parser MDX ou publicação desacoplada nesta arquitetura. Um CMS headless permanece diferido até existir requisito confirmado de publicação por operador não técnico. [VERIFIED: lib/blog.ts:1-127] [ASSUMED: decisão operacional vinculante desta revisão]

2. **RESOLVED — Contexto editorial durável**
   - Reutilizar e estender os contratos first/last-touch e a projeção de leads da Phase 1 com IDs editoriais limitados. Os campos exatos de storage/payload devem partir do código atual (`utm jsonb`, adaptadores Deskcomm/Supabase) e ser provados somente por transportes simulados; nenhuma integração externa real nova está autorizada. Suporte/ativação externa do Deskcomm permanece checkpoint operacional, não pergunta arquitetural. [VERIFIED: supabase/migrations/20250915120000_create_leads_table.sql:1-15; lib/deskcomm-leads.ts:42-45]

3. **RESOLVED — Política de crawlers**
   - Busca e fetch iniciado pelo usuário permanecem permitidos. Crawlers de treinamento exigem política documentada e decisão humana explícita; até esse checkpoint, preservar conservadoramente a política deliberada observada em `robots.ts` e não alegar efeito sobre ranking, indexação ou citação. [VERIFIED: app/robots.ts:11-18] [CITED: https://developers.openai.com/api/docs/bots; https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers]

4. **RESOLVED — Identidade, bio e ativos de autor**
   - Artigo publicado exige identidade/perfil real aprovado. Quando o modelo declarar imagem, ela precisa ser um ativo local aprovado e disponível; na ausência de bio/foto comprovada, o gate bloqueia o campo ou a publicação correspondente em vez de fabricar credencial, biografia ou imagem. [VERIFIED: lib/blog.ts:1-17] [ASSUMED: decisão operacional vinculante desta revisão]

5. **RESOLVED — GA4 e Search Console**
   - Acesso aos consoles é dependência externa e checkpoint manual. A conclusão local cobre contratos de eventos e payloads simulados; baseline, custom dimensions/admin e ativação permanecem `BLOCKED` até o proprietário fornecer acesso/evidência. Nenhum teste local pode declarar essa configuração concluída. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | build/test | ✓ | 24.13.0 | versão fixada em `.nvmrc`. [VERIFIED: local CLI; .nvmrc] |
| npm | install/test | ✓ | 11.6.2 | `npm ci`. [VERIFIED: local CLI] |
| Git | workflow/migration snapshots | ✓ | 2.51.2 | — [VERIFIED: local CLI] |
| Next.js docs locais | APIs v16 | ✓ | 16.3.5 | documentação oficial web. [VERIFIED: node_modules/next/dist/docs; package.json] |
| Vitest | validação automatizada | ✓ | 3.2.4 | — [VERIFIED: package.json; local test run] |
| Google Search Console | baseline/submissão/monitoramento | não acessível nesta sessão | — | checkpoint humano/export. [ASSUMED] |
| GA4 admin | custom dimensions/relatórios | não acessível nesta sessão | — | código + checklist; ativação manual obrigatória. [ASSUMED] |
| Vercel production | smoke pós-deploy | não usado | — | preview/local primeiro; produção só com autorização. [VERIFIED: AGENTS.md:7,26-28] |

**Missing dependencies with no fallback:** acesso humano a GA4/Search Console é necessário para validar configuração externa e baseline, mas não para construir/testar o tracer local. [ASSUMED]

**Missing dependencies with fallback:** nenhuma dependência de build está ausente. [VERIFIED: local CLI and package inspection]

## Validation Architecture

Nyquist validation está habilitada e security enforcement também. [VERIFIED: .planning/config.json:24,47]

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 [VERIFIED: package.json] |
| Config file | `vitest.config.ts` [VERIFIED: vitest.config.ts] |
| Quick run command | `npm test -- tests/editorial/content-contract.test.ts tests/editorial/migration-parity.test.ts` [ASSUMED] |
| Full suite command | `npm run check` [VERIFIED: package.json; AGENTS.md:24,104-106] |

Teste focal executado nesta pesquisa: `npm test -- tests/segment-seo.test.ts tests/analytics-events.test.ts` passou 6 testes. [VERIFIED: local test run 2026-09-23]

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| BLOG-01 | tipos/validadores exigem autores, datas, summary, imagens, sections, sources, links, CTA e status; slugs/datas/IDs únicos e válidos | unit/typecheck | `npm test -- tests/editorial/content-contract.test.ts` | ❌ Wave 0 |
| BLOG-02 | pilares/clusters existem, hubs geram params/breadcrumbs, links resolvem e não duplicam URLs comerciais | unit/integration | `npm test -- tests/editorial/information-architecture.test.ts` | ❌ Wave 0 |
| BLOG-03 | HTML/metadata/canonical/OG/schema/sitemap/RSS são consistentes e imagens/lastmod válidos | integration/contract | `npm test -- tests/editorial/discovery-outputs.test.ts` | ❌ Wave 0 |
| BLOG-04 | published exige brief, fontes, contribuição, revisores e approval; sem fontes/claims bloqueia | unit + manual gate | `npm test -- tests/editorial/governance.test.ts` | ❌ Wave 0 |
| BLOG-05 | templates/checklist/rotina existem e exemplos satisfazem contrato | document contract | `npm test -- tests/editorial/governance.test.ts` | ❌ Wave 0 |
| BLOG-06 | allowlist preserva IDs editoriais sem PII; CTA/contexto chega ao payload de captura e relatório simulado | unit/integration | `npm test -- tests/editorial/analytics-attribution.test.ts tests/analytics-events.test.ts` | ❌ Wave 0 / ✅ base analytics existente |
| BLOG-07 | três slugs/canonicals/links/feed/sitemap/HTML essencial permanecem; nenhum redirect/404 | regression/smoke | `npm test -- tests/editorial/migration-parity.test.ts` | ❌ Wave 0 |

### Additional contract assertions

- `published` é a única projeção pública; drafts/future content ausentes de params, hub, sitemap e RSS. [ASSUMED]
- Metadata e JSON-LD usam a mesma canonical e datas; `modifiedAt >= publishedAt`; datas têm timezone. [CITED: https://developers.google.com/search/docs/appearance/structured-data/article]
- JSON-LD serializado não contém `<`; schema liga author URL e publisher `@id`. [CITED: https://nextjs.org/docs/app/guides/json-ld]
- RSS parseia como XML com fixtures contendo `&`, `<`, `>` e Unicode; GUID/link/canonical são iguais. [ASSUMED]
- Todo link interno resolve para rota conhecida; toda página importante recebe ao menos um link HTML rastreável. [CITED: https://developers.google.com/search/docs/crawling-indexing/links-crawlable]
- Alt vazio é permitido somente para imagem decorativa; imagem informativa exige alt e, se complexa, equivalente textual. [CITED: https://www.w3.org/WAI/tutorials/images/]
- Nenhum parâmetro de evento aceita e-mail/telefone/texto arbitrário; IDs têm tamanho/conjunto controlado. [CITED: https://support.google.com/analytics/answer/6366371]

### Manual and external validation

Automação local não prova indexação, rich result, entrega social, GA4 admin, Search Console ou cadeia real no CRM. O phase gate precisa incluir, em preview/staging quando possível: inspeção de HTML sem JS, Rich Results Test, Schema Markup Validator, validação RSS, preview OG, teclado/screen reader básico, verificação de sitemap/robots/llms, DebugView GA4 com dados simulados e teste de lead totalmente simulado. Produção, leads, e-mails e agendas reais não podem ser disparados sem autorização. [VERIFIED: AGENTS.md:26-28] [ASSUMED]

### Sampling Rate

- **Per task commit:** teste focal do arquivo/requirement modificado + `npx tsc --noEmit --incremental false`. [ASSUMED]
- **Per wave merge:** `npm test` e `git diff --check`. [VERIFIED: AGENTS.md:24]
- **Phase gate:** `npm run check`, todos os contratos editoriais verdes, paridade dos três slugs e checklist manual/external documentado antes de `$gsd-verify-work`. [VERIFIED: AGENTS.md:24,104-106] [ASSUMED]

### Wave 0 Gaps

- [ ] `tests/editorial/fixtures/legacy-articles.ts` — snapshot dos três slugs/saídas de BLOG-07. [ASSUMED]
- [ ] `tests/editorial/content-contract.test.ts` — BLOG-01. [ASSUMED]
- [ ] `tests/editorial/information-architecture.test.ts` — BLOG-02. [ASSUMED]
- [ ] `tests/editorial/discovery-outputs.test.ts` — BLOG-03 e BLOG-07. [ASSUMED]
- [ ] `tests/editorial/governance.test.ts` — BLOG-04/05. [ASSUMED]
- [ ] `tests/editorial/analytics-attribution.test.ts` — BLOG-06. [ASSUMED]
- [ ] helper para importar/validar o registro sem depender de browser. [ASSUMED]
- [ ] fixture de XML adversarial e parser disponível no runtime; se o Node não oferecer parser adequado, testar escaping/estrutura e validar o endpoint com ferramenta já disponível antes de cogitar dependência. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no para leitura pública | Nenhum login editorial runtime é proposto; publicação ocorre por Git/revisão. [ASSUMED] |
| V3 Session Management | no para conteúdo | Reusar controles do funil; artigo não cria sessão própria. [ASSUMED] |
| V4 Access Control | yes no processo | Branch/PR/deploy já governados; nenhuma rota admin/CMS pública. `main` exige autorização. [VERIFIED: AGENTS.md:20-28] |
| V5 Validation, Sanitization and Encoding | yes | types + validadores; React escaping; JSON-LD com `<` escapado; RSS XML escaped; URL protocols permitidos. [CITED: https://nextjs.org/docs/app/guides/json-ld] |
| V6 Stored Cryptography | no | Nenhuma criptografia nova; não armazenar secrets no conteúdo. [ASSUMED] |
| V7 Error Handling/Logging | yes | Falha de build/test para conteúdo inválido; não logar payloads de auth/PII. [VERIFIED: AGENTS.md:225-227] |
| V14 Configuration | yes | drafts não indexáveis, crawler policy explícita, headers/content types testados. [ASSUMED] |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS por HTML/MDX/JSON-LD editorial | Tampering / Elevation | não aceitar HTML cru; block renderer; React escaping; `JSON.stringify(...).replace(/</g, "\\u003c")`. [CITED: https://nextjs.org/docs/app/guides/json-ld] |
| XML injection no RSS | Tampering | escapar texto/atributos e parsear fixtures adversariais. [ASSUMED] |
| URL `javascript:`/link enganoso | Spoofing | aceitar somente paths internos ou `https:` aprovados; rotular links externos e revisar destino. [ASSUMED] |
| Draft/claim não aprovado publicado | Information Disclosure / Tampering | filtro central por status + review gate + testes de todas as projeções. [ASSUMED] |
| PII em GA4/URLs/logs | Information Disclosure | IDs controlados, allowlist e proibição de e-mail/telefone/texto livre. [CITED: https://support.google.com/analytics/answer/6366371] |
| SSRF/supply chain por CMS/imagem remota | Tampering / SSRF | não introduzir CMS/fetch remoto nesta fase; ativos locais aprovados; qualquer pacote futuro passa gate. [ASSUMED] |
| Fato comercial inventado ou stale | Spoofing / reputational | fonte, data de acesso, reviewer e approval; remoção/atualização por gatilho. [VERIFIED: 06-CONTEXT.md:22-25] |

## Project Constraints (from AGENTS.md)

- `main` publica automaticamente em `https://tlin.ia.br` via Vercel; merge/push ou alteração em `main` exige autorização explícita de Igor. [VERIFIED: AGENTS.md:7-8,26-28,108-109]
- O domínio real é `https://tlin.ia.br`, não `tlin.ai.br`; o app externo é `https://app.tlin.ia.br`. [VERIFIED: AGENTS.md:40-42]
- O posicionamento é “IA comercial”; CRM nativo, follow-up e agendamento são capacidades, e o posicionamento descartado “CRM comercial” não deve voltar. [VERIFIED: AGENTS.md:31-38,49-61]
- Stack é Next.js 16.3.5 App Router, React 19 e TypeScript 5; antes de implementar, ler a documentação correspondente em `node_modules/next/dist/docs/`. [VERIFIED: AGENTS.md:82-83,272-273]
- Reutilizar design system/componentes existentes e preservar âncoras/rotas em uso; não fazer redesign autônomo. [VERIFIED: AGENTS.md:64-68,213-219]
- Conteúdo principal é PT-BR; escala PT/EN/ES está diferida para esta fase. [VERIFIED: AGENTS.md:43-46; 06-CONTEXT.md:57-59]
- Usar alias `@/*`, dois espaços, aspas duplas, ponto e vírgula e padrões locais; UI nova que usar dicionário precisa espelhar PT/EN/ES. [VERIFIED: AGENTS.md:211-224]
- Preservar mudanças locais; não incluir cache TypeScript, `next-env.d.ts`, segredos ou logs. [VERIFIED: AGENTS.md:20-24]
- Rodar `npm run check` e `git diff --check`; lint bloqueia regressões. [VERIFIED: AGENTS.md:24-25,104-106]
- Testes não podem disparar leads, e-mails ou agendas reais; integrações devem ser simuladas. [VERIFIED: AGENTS.md:26-28]

## Planning Recommendations

### Suggested wave decomposition

1. **Wave 0 — contracts and baseline:** snapshots legados, tipos/test validators, taxonomia/ownership map, authors, templates/governance, baseline manual de consoles. [ASSUMED]
2. **Wave 1 — vertical tracer:** novo registry/query, um artigo, render/metadata/Article+BreadcrumbList/OG, hub, sitemap/RSS e CTA attribution; manter adaptador legado. [ASSUMED]
3. **Wave 2 — full migration:** outros dois artigos, relacionamentos por cluster, busca/listagem, imagens/perfis, paridade e remoção segura do array. [ASSUMED]
4. **Wave 3 — closed-loop measurement:** allowlist, first/last content context, persistência Supabase/Deskcomm, relatório sobre contrato Phase 1 e testes simulados. Pode avançar em paralelo, mas depende das decisões da Phase 1. [ASSUMED]
5. **Wave 4 — governance/discovery gate:** robots policy, llms sincronizado, documentação operacional, validação manual externa, accessibility/schema/feed/social smoke e checklist de produção. [ASSUMED]

### Definition of done by requirement

- BLOG-01 não termina com tipos: um conteúdo inválido deve falhar build/test e o workflow deve demonstrar publicação/revisão/atualização. [ASSUMED]
- BLOG-02 não termina com tags: hubs devem ter URL, SSR, metadata, breadcrumb e links rastreáveis, com ownership de intenção. [ASSUMED]
- BLOG-03 não termina com schema: todas as projeções precisam concordar e passar testes/ferramentas externas. [ASSUMED]
- BLOG-04/05 exigem artefatos e owner/cadência, não só texto dentro do modelo. [ASSUMED]
- BLOG-06 não termina com evento GA4: artigo/cluster/CTA precisam chegar a demo confirmada, qualificação e venda ou a dependência externa deve permanecer explicitamente aberta. [VERIFIED: .planning/REQUIREMENTS.md:43]
- BLOG-07 não termina com 200 OK: URL, canonical, sitemap, RSS, compartilhamento, navegação, conteúdo e aparência essencial entram no contrato de paridade. [VERIFIED: .planning/REQUIREMENTS.md:44]

## Sources

### Primary (HIGH confidence)

- [Google Search Central — Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — autoria, evidência, originalidade e ausência de word count preferido.
- [Google Search Central — AI features and your website](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — fundamentos, ausência de requisitos especiais, `llms.txt`, schema/chunking e medição.
- [Google Search Central — Using generative AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) — uso responsável e abuso em escala.
- [Google Search Central — Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) — autores, datas, imagem e propriedades.
- [Google Search Central — Publication dates](https://developers.google.com/search/docs/appearance/publication-dates) — data visível, schema e atualização substantiva.
- [Google Search Central — Canonicals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) — canonical, sitemap e links consistentes.
- [Google Search Central — Crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) — âncoras e discoverability.
- [Google Search Central — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) — URLs absolutas, `lastmod`, `priority`/`changefreq`.
- [Google Search Central — Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) — breadcrumbs.
- [OpenAI Developers — Bots](https://developers.openai.com/api/docs/bots) — funções e controles dos crawlers OpenAI.
- [Google common crawlers — Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) — controle Gemini separado da busca.
- [Next.js 16 docs — Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — metadata e imagens sociais.
- [Next.js 16 docs — generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — composição e shallow merge.
- [Next.js 16 docs — JSON-LD](https://nextjs.org/docs/app/guides/json-ld) — serialização segura.
- [Next.js 16 docs — Images](https://nextjs.org/docs/app/getting-started/images) — dimensões e otimização.
- [GA4 — PII policy](https://support.google.com/analytics/answer/6366371) — proibição de PII.
- [GA4 — Custom dimensions](https://support.google.com/analytics/answer/14240153) — dimensões event-scoped.
- [W3C WAI — Images tutorial](https://www.w3.org/WAI/tutorials/images/) — alt de imagens informativas/decorativas/complexas.
- Código e documentos do repositório citados inline, abertos nesta sessão.

### Secondary (MEDIUM confidence)

- [llms.txt proposal](https://llmstxt.org/) — proposta comunitária; usada somente para caracterizar o formato como experimental/complementar.

### Tertiary (LOW confidence)

- Julgamentos arquiteturais e operacionais marcados `[ASSUMED]`; todos estão inventariados no Assumptions Log quando podem mudar o plano.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — dependências e versões verificadas no manifesto/lockfile e localmente; nenhuma nova instalação.
- Current implementation: HIGH — arquivos fonte abertos e testes focais executados.
- SEO technical guidance: HIGH — documentação oficial Google/Next/W3C.
- OpenAI crawler controls: HIGH — documentação oficial OpenAI Developers, consultada sob a skill `openai-docs`.
- Architecture: MEDIUM — prescritiva e compatível com o repo; operação por Git/PR e extensão simulada do contrato Phase 1 estão resolvidas para a fase, enquanto ativações externas permanecem checkpoints.
- GEO/LLM impact: MEDIUM/LOW — controles de crawler são documentados; efeitos de passagens/llms/testes de citação são experimentais e sem garantia.
- Analytics closed loop: MEDIUM — gaps no código são verificados; campos/integração finais dependem da Phase 1 e Deskcomm.

**Research date:** 2026-09-23
**Valid until:** 2026-10-23 para stack/SEO; revisar em 2026-09-30 as superfícies generativas e políticas de crawlers, que mudam mais rapidamente.
