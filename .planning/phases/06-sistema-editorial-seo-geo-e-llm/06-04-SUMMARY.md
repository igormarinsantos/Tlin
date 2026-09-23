---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "04"
subsystem: editorial-ui
tags: [nextjs, react, typescript, ssr, search, migration]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "03"
    provides: Registro canônico completo com três artigos publicados e queries filtradas
provides:
  - Hub público do blog alimentado exclusivamente por summaries de getPublishedArticles
  - Cards, busca e carrossel tipados pela projeção editorial serializável
  - Busca client-side por título, resumo e tema canônico sem receber conteúdo não publicado
  - Remoção definitiva do array monolítico lib/blog.ts após gate de consumidores
affects: [06-05, 06-06, blog, editorial, discovery]

actuals:
  tokens: 6727
  tasks: 2
  commits: 13
plan_head_before: ecc1daefe6b7dc969087818ffa28702717d708fd

tech-stack:
  added: []
  patterns:
    - Projeção server-side mínima antes da fronteira de Client Components
    - Agrupamento e busca client-side sobre summaries já publicáveis
    - Visuais editoriais indexados por ClusterId tipado

key-files:
  created: []
  modified:
    - app/blog/page.tsx
    - components/blog/ArticleCard.tsx
    - components/blog/BlogSearchAndGrid.tsx
    - components/blog/FeaturedCarousel.tsx
    - components/blog/categoryVisuals.ts
    - tests/editorial/migration-parity.test.ts
  deleted:
    - lib/blog.ts

key-decisions:
  - "A fronteira cliente recebe apenas EditorialArticleSummary, projetado no Server Component a partir de getPublishedArticles e da taxonomia aprovada."
  - "O tema exibido e pesquisável vem de editorialClusters; visuais da listagem resolvem pelo ClusterId, sem manter categorias editoriais livres no cliente."
  - "O alias visual nominal usado pela rota de detalhe foi preservado somente como compatibilidade de apresentação; toda superfície migrada neste plano usa ClusterId."
  - "Datas e URLs de resumo foram mantidas como helpers de apresentação sem recriar dados editoriais ou um segundo registro."

patterns-established:
  - "Published summary boundary: registry, blocos, revisão e rascunhos nunca atravessam para busca ou carrossel."
  - "Legacy removal gate: exclusão do adapter exige varredura de app/components/lib por imports e BLOG_ARTICLES."

requirements-completed: [BLOG-01, BLOG-07]

coverage:
  - id: D1
    description: "Hub SSR lista os três artigos publicados e entrega apenas summaries canônicos aos componentes cliente"
    requirement: BLOG-01
    verification:
      - kind: integration
        ref: "tests/editorial/migration-parity.test.ts#renders every published slug in the server HTML with navigation and summary links"
        status: pass
      - kind: other
        ref: "npm run check"
        status: pass
    human_judgment: false
  - id: D2
    description: "Busca encontra título, resumo e tema; cards e carrossel preservam links de leitura, resumo, foco e estrutura responsiva"
    requirement: BLOG-07
    verification:
      - kind: integration
        ref: "tests/editorial/migration-parity.test.ts#searches the serializable article topic as well as title and summary"
        status: pass
      - kind: integration
        ref: "tests/editorial/migration-parity.test.ts#renders every published slug in the server HTML with navigation and summary links"
        status: pass
    human_judgment: true
    rationale: "A paridade estrutural é automatizada, mas a comparação visual final em desktop e mobile continua dependendo de julgamento humano."
  - id: D3
    description: "lib/blog.ts foi removido sem consumidor de produção, duplicação de BLOG_ARTICLES ou perda dos três slugs"
    requirement: BLOG-07
    verification:
      - kind: integration
        ref: "tests/editorial/migration-parity.test.ts#removes the legacy monolith only after every production consumer is canonical"
        status: pass
      - kind: integration
        ref: "npm run check (116 testes e build SSG dos três slugs)"
        status: pass
    human_judgment: false

duration: 13 min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 04: Listagem canônica e remoção do legado Summary

**Hub, busca, cards e carrossel alimentados por summaries publicados, com o monólito editorial removido após uma varredura integral de consumidores**

## Performance

- **Duration:** 13 min
- **Started:** 2026-09-23T20:52:15Z
- **Completed:** 2026-09-23T21:04:40Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Migrou `/blog` de `BLOG_ARTICLES` para `getPublishedArticles()`, projetando no servidor somente identidade, texto de listagem, tema, data, leitura e destaque.
- Tipou cards, busca e carrossel com `EditorialArticleSummary`, preservando classes, links de artigo, ação de resumo, autoplay, dots, foco e estrutura responsiva.
- Estendeu a busca para o tema canônico derivado da taxonomia e agrupou a grade pelos temas realmente presentes nos artigos publicados.
- Removeu `lib/blog.ts` depois de comprovar que nenhum arquivo de produção importa o caminho ou referencia `BLOG_ARTICLES`.
- Confirmou os três slugs em HTML SSR, sitemap, RSS, params estáticos e build SSG sem redirects.

## Task Commits

Cada tarefa TDD registrou RED antes de GREEN:

1. **Task 1 RED: contrato da migração da listagem** - `f608845` (test)
2. **Task 1 GREEN: summaries publicados na home e componentes** - `0d1213b` (feat)
3. **Task 2 RED: gate de remoção do monólito** - `002ce5f` (test)
4. **Task 2 GREEN: exclusão de lib/blog.ts** - `5dcc99e` (feat)

O ledger compartilhado mediu 13 commits desde `plan_head_before`; quatro pertencem ao 06-04 e os demais foram commits intercalados dos planos 06-05 e 06-08.

## Files Created/Modified

- `app/blog/page.tsx` - Consulta publicados e cria a projeção serializável antes da fronteira cliente.
- `components/blog/ArticleCard.tsx` - Define o summary de apresentação e preserva navegação, data e resumo via ChatGPT.
- `components/blog/BlogSearchAndGrid.tsx` - Busca título, resumo e tema e agrupa apenas summaries recebidos.
- `components/blog/FeaturedCarousel.tsx` - Renderiza destaques canônicos sem depender do tipo legado.
- `components/blog/categoryVisuals.ts` - Resolve gradientes e ícones por IDs tipados de cluster.
- `tests/editorial/migration-parity.test.ts` - Cobre SSR, busca, navegação, compartilhamento e ausência de consumidores legados.
- `lib/blog.ts` - Removido após a migração integral.

## Decisions Made

- O summary público é um contrato de apresentação local construído sobre tipos editoriais publicados; blocos, fontes, revisão e workflow permanecem exclusivamente no servidor.
- Os temas vêm diretamente de `editorialClusters`, evitando outro array de categorias ou strings editoriais concorrentes.
- A grade deriva sua ordem da consulta publicada e da primeira ocorrência de cada tema, mantendo o filtro cliente como aprimoramento sobre links SSR já presentes.
- O helper de data fixa `America/Sao_Paulo` para formatar os timestamps editoriais sem drift de dia entre ambientes.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- A primeira tentativa de `npm run check` atravessou um RED transitório do executor paralelo do 06-08 e falhou em dois testes de atribuição fora do escopo. Nenhum arquivo alheio foi alterado; depois do GREEN concorrente, o gate integral passou com 116/116 testes e build.

## TDD Gate Compliance

- Task 1: RED `f608845` falhou por busca de tema ausente e dependência do monólito; GREEN `0d1213b` passou com 11/11 testes focais e typecheck.
- Task 2: RED `002ce5f` deixou somente a existência de `lib/blog.ts` como falha; GREEN `5dcc99e` passou com 23/23 testes editoriais e typecheck.
- O gate integral final passou typecheck, lint sem regressão, 116/116 testes e build Next.js com os três artigos SSG.

## Known Stubs

None. Arrays encontrados são projeções, resultados de busca ou acumuladores de teste; nenhum placeholder ou mock chega à UI pública.

## Threat Flags

None. A mudança reduz a superfície de divulgação ao filtrar publicações no servidor e não adiciona endpoint, autenticação, acesso a arquivo ou mudança de schema.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Sitemap, RSS e demais superfícies agora podem depender de uma única fonte editorial sem compatibilidade com o monólito.
- A paridade visual estrutural está coberta; a comparação subjetiva final com a baseline em desktop/mobile permanece apropriada para o UAT da fase.
- Nenhum bloqueio técnico ou dependência externa foi introduzido.

## Self-Check: PASSED

- Os seis arquivos modificados, a exclusão de `lib/blog.ts` e este summary foram confirmados no disco.
- Os quatro commits próprios do plano estão presentes no histórico.
- O classificador de cobertura aceitou os três entregáveis sem erro e roteou somente o julgamento visual para UAT humano.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
