---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "06"
subsystem: editorial-information-architecture
tags: [nextjs, ssr, seo, json-ld, breadcrumbs, internal-linking, vitest]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "04"
    provides: Hub do blog e cards alimentados exclusivamente pela projecao editorial publicada
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "05"
    provides: Identidade editorial coerente entre metadata, schema, sitemap e feed
provides:
  - Hubs tematicos SSR com params publicados, canonical proprio, breadcrumb visivel e BreadcrumbList coerente
  - Perfil autoral SSR derivado somente de autoria aprovada com artigo publicado
  - Grafo HTML rastreavel entre home, hubs, cards, artigos e perfis autorais
  - Relacionados ordenados por cluster, intencao e fallback deterministico
affects: [blog, seo, geo, discovery, internal-linking, 06-11, 06-12]

actuals:
  tokens: 8469
  tasks: 2
  commits: 14
plan_head_before: e4814440f85e8a04119a5664884f2211e9541631

tech-stack:
  added: []
  patterns:
    - Params publicos derivados da mesma projecao filtrada usada pela renderizacao
    - Canonical, breadcrumb visivel e BreadcrumbList projetados da mesma URL editorial
    - Links SSR descritivos como base rastreavel, com busca client-side apenas como aprimoramento
    - Relacionados por cluster e intencao com fallback deterministico e limite do layout

key-files:
  created:
    - app/blog/autores/[author]/page.tsx
    - tests/editorial/information-architecture.test.ts
  modified:
    - app/blog/temas/[cluster]/page.tsx
    - app/blog/page.tsx
    - app/blog/[slug]/page.tsx
    - components/blog/ArticleCard.tsx
    - lib/editorial/queries.ts
    - lib/editorial/structured-data.ts

key-decisions:
  - "Clusters e autores so recebem params publicos quando a projecao publicada contem ao menos um artigo elegivel."
  - "Hubs informacionais mantem canonical proprio; intentOwner continua apontando para a landing comercial correspondente sem substituir o hub."
  - "O perfil editorial de autor deriva nome, funcao, bio e imagem do registro aprovado, sem inventar credenciais ou experiencia."
  - "A navegacao artigo para hub foi adicionada ao template compartilhado para que o grafo exista no HTML de cada artigo, nao apenas nos cards."

patterns-established:
  - "Published-only public IA: drafts, artigos futuros e entidades vazias nao atravessam para params, navegacao ou rotas publicas."
  - "Intent ownership split: hubs atendem descoberta informacional e CTAs contextuais apontam para conversao sem canonical cruzado."
  - "Crawlable editorial graph: home, card, artigo, hub e autor usam anchors reais do Next Link no HTML SSR/SSG."

requirements-completed: [BLOG-02, BLOG-03]

coverage:
  - id: D1
    description: "Clusters e autores com conteudo publicado geram params e paginas SSG; entidades vazias, desconhecidas, draft ou futuras nao sao publicadas"
    requirement: BLOG-02
    verification:
      - kind: integration
        ref: "tests/editorial/information-architecture.test.ts#derives public cluster params only from published articles"
        status: pass
      - kind: integration
        ref: "tests/editorial/information-architecture.test.ts#derives public author params only from authors with published articles"
        status: pass
      - kind: other
        ref: "npm run check (build SSG de dois hubs e um perfil autoral)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Metadata, canonical, breadcrumb visivel e BreadcrumbList concordam para hubs e autoria sem apontar canonical para landing comercial"
    requirement: BLOG-03
    verification:
      - kind: integration
        ref: "tests/editorial/information-architecture.test.ts#keeps cluster metadata, visible breadcrumb and BreadcrumbList on the same hub URL"
        status: pass
      - kind: integration
        ref: "tests/editorial/information-architecture.test.ts#renders the approved author identity without inventing a biography"
        status: pass
    human_judgment: false
  - id: D3
    description: "Um crawler sem JavaScript percorre home para hub para artigo e artigo para hub, autor e relacionados por anchors HTML"
    requirement: BLOG-02
    verification:
      - kind: integration
        ref: "tests/editorial/information-architecture.test.ts#links home, cards and every article to their published hubs without JavaScript"
        status: pass
      - kind: integration
        ref: "tests/editorial/information-architecture.test.ts#orders related articles by cluster, then intent, with a deterministic fallback"
        status: pass
    human_judgment: false
  - id: D4
    description: "Todo link interno declarado resolve para rota conhecida e hubs nao colidem com os owners comerciais"
    requirement: BLOG-02
    verification:
      - kind: integration
        ref: "tests/editorial/information-architecture.test.ts#resolves every declared internal link and keeps URL ownership collision-free"
        status: pass
      - kind: integration
        ref: "tests/editorial/migration-parity.test.ts"
        status: pass
    human_judgment: false

duration: 19 min active
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 06: Arquitetura editorial publica e interligada Summary

**Hubs tematicos e autoria publicados como SSG canonico, conectados a home, cards e artigos por um grafo HTML rastreavel sem disputar a intencao das landings comerciais**

## Performance

- **Duration:** 19 min ativos: 12 min de implementacao antes da interrupcao e 7 min de recuperacao/auditoria
- **Implementation window:** 2026-09-23T21:28:48Z a 2026-09-23T21:40:34Z
- **Recovery completed:** 2026-09-23T22:32:00Z
- **Tasks:** 2
- **Files created/modified:** 8

## Accomplishments

- Publicou dois hubs tematicos e um perfil autoral a partir da projecao realmente publicada, excluindo clusters e autores vazios, desconhecidos, em draft ou apenas futuros.
- Alinhou canonical, metadata, breadcrumb visivel e JSON-LD de hubs e autoria, preservando IA comercial como pilar e as landings como owners comerciais distintos.
- Conectou a home do blog, chips dos cards e o template de artigo aos hubs por links HTML descritivos, mantendo a busca client-side opcional.
- Adicionou relacionados por cluster e intencao com fallback deterministico, sem cotas editoriais artificiais.
- Validou o inventario de rotas internas e bloqueou colisao entre hubs informacionais e URLs comerciais.

## Task Commits

As duas tarefas TDD ja estavam implementadas e foram auditadas sem repeticao:

1. **Task 1 RED: contrato publico de hubs e autoria** - `bd48572` (test)
2. **Task 1 GREEN: hubs tematicos e perfil autoral canonicos** - `97303d8` (feat)
3. **Task 2 RED: contrato do grafo de links internos** - `e1ae266` (test)
4. **Task 2 GREEN: interligacao editorial SSR e relacionados** - `6908f9c` (feat)

O ledger persistido em `.git/gsd-plan-head-before-06-06` aponta para `e4814440f85e8a04119a5664884f2211e9541631` e mediu 14 commits ate o `HEAD` no momento da escrita. Quatro pertencem ao 06-06; os outros dez foram commits intercalados dos planos 06-09 e 06-10 na branch compartilhada.

## Files Created/Modified

- `app/blog/autores/[author]/page.tsx` - Gera params publicados, metadata canonica, breadcrumb, ProfilePage/Person seguro e lista de artigos do autor aprovado.
- `app/blog/temas/[cluster]/page.tsx` - Completa o tracer de hub para todos os clusters publicados, com metadata, CollectionPage, breadcrumb, artigos e CTA contextual.
- `app/blog/page.tsx` - Adiciona navegacao SSR pelos temas realmente publicados antes da busca cliente.
- `app/blog/[slug]/page.tsx` - Liga cada artigo ao hub tematico e ao perfil autoral publico, fechando o caminho artigo para hub no HTML.
- `components/blog/ArticleCard.tsx` - Transforma o tema do card em link direto e focavel para o hub correspondente.
- `lib/editorial/queries.ts` - Centraliza projecoes publicadas de clusters/autores e o ranking deterministico de relacionados.
- `lib/editorial/structured-data.ts` - Projeta BreadcrumbList e ProfilePage/Person das mesmas URLs canonicas renderizadas.
- `tests/editorial/information-architecture.test.ts` - Cobre params, `notFound`, canonical, breadcrumbs, autoria, ownership, links conhecidos e ranking de relacionados.

## Decisions Made

- A existencia publica de cluster ou autor e consequencia de artigo publicado, nao apenas da presenca na taxonomia ou no registro de autores.
- O `intentOwner` comercial permanece separado do `hubPath`: o primeiro define ownership de conversao; o segundo recebe canonical informacional proprio.
- O fallback de relacionados reaproveita a ordenacao publicada deterministica e limita o resultado ao espaco do layout, sem fabricar quota de links.
- O perfil autoral omite bio quando o registro nao possui uma, em vez de inferir ou inventar credenciais.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] Incluido o template de artigo no grafo editorial**
- **Found during:** Task 2
- **Issue:** A lista inicial de `files_modified` nao incluia `app/blog/[slug]/page.tsx`, mas o comportamento e o criterio do proprio plano exigiam artigo para hub e autoria em HTML rastreavel.
- **Fix:** O commit adicionou links SSR do artigo para o hub tematico e para o perfil autoral publicado, reutilizando as queries e a taxonomia canonicas.
- **Files modified:** `app/blog/[slug]/page.tsx`
- **Verification:** O teste focal cobre cada artigo publicado e `npm run check` gerou os tres artigos SSG, dois hubs SSG e o perfil autoral SSG.
- **Committed in:** `6908f9c`

---

**Total deviations:** 1 auto-fix (1 funcionalidade critica ausente da lista de arquivos)
**Impact on plan:** O desvio foi autorizado e estritamente necessario para cumprir o caminho artigo para hub; nao criou nova taxonomia, rota comercial ou integracao.

## Issues Encountered

- O orquestrador foi interrompido depois dos quatro commits de implementacao. A recuperacao inspecionou os commits e o estado atual, sem duplicar ou reexecutar as tarefas.
- O ledger e compartilhado com execucoes concorrentes; por isso `actuals.commits` registra os 14 commits medidos mecanicamente desde a base, enquanto a lista de commits proprios contem quatro.
- `npm run check` manteve 121 avisos de lint conhecidos sem regressao e exibiu o aviso preexistente de `Cache-Control` customizado. Nenhum aviso foi causado ou alterado pelo plano.

## TDD Gate Compliance

- Task 1 preserva RED `bd48572` antes de GREEN `97303d8`.
- Task 2 preserva RED `e1ae266` antes de GREEN `6908f9c`.
- A recuperacao nao reproduziu estados RED nem refez tarefas; auditou a ordem no historico e validou o estado GREEN atual.
- Gates finais: 21/21 testes focais, typecheck, lint sem regressao, 143/143 testes integrais e build Next.js passaram.

## Known Stubs

None. A varredura dos oito arquivos nao encontrou TODO, FIXME, placeholder, teste pulado ou valor vazio hardcoded fluindo para a UI. Retornos de metadata vazia para params desconhecidos sao o caminho intencional que antecede `notFound`.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Hubs, autoria e artigos agora formam um grafo SSR/SSG verificavel e podem ser consumidos pelas etapas restantes de governanca e validacao da fase.
- A verificacao visual subjetiva em desktop/mobile continua apropriada para o UAT da fase; nenhum resultado visual externo foi declarado como aprovado por estes testes locais.
- Nenhum bloqueio tecnico, dependencia externa ou regressao diretamente causada pelo plano permanece aberto.

## Self-Check: PASSED

- O summary e os oito arquivos criados/modificados pelo plano foram confirmados no disco.
- Os quatro commits proprios existem, sao commits validos e permanecem ancestrais de `HEAD`.
- `git diff --check` passou; o staging continua vazio e nenhuma mudanca paralela foi incorporada.
- Os criterios do plano foram confirmados pelos 21 testes focais, pelo typecheck e pelo gate integral com 143/143 testes e build SSG.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
