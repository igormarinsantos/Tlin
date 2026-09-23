---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "02"
subsystem: editorial
tags: [nextjs, react, typescript, seo, json-ld, rss, sitemap, vitest]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "01"
    provides: Contrato editorial tipado, validadores, serializers seguros e baseline dos três artigos
provides:
  - Primeiro artigo histórico publicado pelo registro editorial canônico
  - Queries únicas para artigos e clusters publicados, com filtro de status e data futura
  - SSR, metadata, Article/BreadcrumbList, hub e CTA atribuídos pelo mesmo contrato
  - Sitemap e RSS derivados exclusivamente da projeção publicada
  - Tracer integrado de D-13 com escaping adversarial e baseline independente
affects: [06-03, 06-04, 06-05, blog, discovery, analytics]

actuals:
  tokens: 11148
  tasks: 2
  commits: 4
plan_head_before: 896092dc4d8c86575b27a906193a5c2a31f71f18

tech-stack:
  added: []
  patterns:
    - Registro editorial por imports explícitos e validação fail-fast
    - Projeção pública central para status e data de publicação
    - Server Components para HTML/metadata com ilha cliente mínima para CTA
    - Descoberta derivada da mesma query publicada

key-files:
  created:
    - content/editorial/articles/agentes-de-ia-no-whatsapp-para-vendas.ts
    - lib/editorial/registry.ts
    - lib/editorial/queries.ts
    - components/blog/EditorialCta.tsx
    - app/blog/temas/[cluster]/page.tsx
    - tests/editorial/tracer.test.ts
  modified:
    - app/blog/[slug]/page.tsx
    - app/sitemap.ts
    - app/blog/rss.xml/route.ts

key-decisions:
  - "O registry valida seu conteúdo no carregamento e as queries são a única fronteira pública para status e data futura."
  - "O artigo mantém título, resumo, slug, data original e composição visual reconhecível; a autoria aprovada passa a ser Igor Marin e modifiedAt registra a atualização substantiva."
  - "A rota preserva a paleta histórica de Vendas com IA enquanto expõe IA comercial como cluster canônico, sem reintroduzir o posicionamento CRM comercial."
  - "O CTA cliente envia somente IDs editoriais controlados e reutiliza o evento global open-qualification, sem criar listener local."

patterns-established:
  - "Published query: todo consumidor público recebe somente status published com publishedAt menor ou igual ao relógio fornecido."
  - "Editorial render: blocos discriminados viram children React allowlisted; somente JSON-LD usa HTML interno após escapar o caractere <."
  - "Discovery parity: HTML, metadata, schema, hub, sitemap e RSS partem da mesma identidade editorial."

requirements-completed: [BLOG-01, BLOG-02, BLOG-03, BLOG-06, BLOG-07]

coverage:
  - id: D1
    description: "Artigo histórico atravessa registro, query, HTML, metadata e schema seguro sem redirect"
    requirement: BLOG-01
    verification:
      - kind: integration
        ref: "tests/editorial/tracer.test.ts#proves the tracer across article, query, metadata, schema, hub and CTA"
        status: pass
      - kind: other
        ref: "npm run check"
        status: pass
    human_judgment: false
  - id: D2
    description: "Hub SSR de IA comercial recebe somente artigos publicados e mantém links HTML rastreáveis"
    requirement: BLOG-02
    verification:
      - kind: integration
        ref: "tests/editorial/tracer.test.ts#proves the tracer across article, query, metadata, schema, hub and CTA"
        status: pass
      - kind: other
        ref: "next build prerendered /blog/temas/ia-comercial"
        status: pass
    human_judgment: false
  - id: D3
    description: "CTA editorial mede IDs controlados e abre o controlador global de qualificação"
    requirement: BLOG-06
    verification:
      - kind: unit
        ref: "tests/editorial/tracer.test.ts#proves the tracer across article, query, metadata, schema, hub and CTA"
        status: pass
    human_judgment: false
  - id: D4
    description: "Sitemap e RSS concordam com a projeção publicada e preservam canonical, datas e escaping XML"
    requirement: BLOG-03
    verification:
      - kind: integration
        ref: "tests/editorial/tracer.test.ts#projects the same published identity and dates into sitemap and RSS"
        status: pass
      - kind: unit
        ref: "tests/editorial/content-contract.test.ts"
        status: pass
    human_judgment: false
  - id: D5
    description: "Baseline independente continua contendo os três slugs históricos durante a migração gradual"
    requirement: BLOG-07
    verification:
      - kind: integration
        ref: "tests/editorial/tracer.test.ts#proves the tracer across article, query, metadata, schema, hub and CTA"
        status: pass
      - kind: unit
        ref: "tests/editorial/migration-parity.test.ts"
        status: pass
    human_judgment: false

duration: 20 min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 02: Tracer editorial de produção Summary

**Artigo histórico conectado por um único registro a HTML, metadata, JSON-LD, hub, sitemap, RSS e CTA atribuído**

## Performance

- **Duration:** 20 min
- **Started:** 2026-09-23T19:55:25Z
- **Completed:** 2026-09-23T20:15:33Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Migrou `agentes-de-ia-no-whatsapp-para-vendas` para um módulo próprio validado, preservando slug, canonical, título, resumo, data original e conteúdo essencial.
- Centralizou artigos e clusters publicados em queries que excluem draft, review, archived e datas futuras antes de qualquer projeção pública.
- Substituiu a rota legada do tracer por HTML SSR com blocos React allowlisted, metadata completa e Article/BreadcrumbList serializados sem `<` executável.
- Criou o hub `/blog/temas/ia-comercial` e um CTA cliente mínimo que mede IDs controlados e abre o controlador global.
- Fechou D-13 em sitemap e RSS com `modifiedAt` verdadeiro, canonical único e escaping XML campo a campo.

## Task Commits

Cada tarefa TDD registrou RED antes de GREEN:

1. **Task 1 RED: contrato integrado do tracer editorial** - `7e217e5` (test)
2. **Task 1 GREEN: artigo, registro, queries, rota, hub e CTA** - `ffc32d9` (feat)
3. **Task 2 RED: paridade de sitemap e RSS** - `97ee24b` (test)
4. **Task 2 GREEN: projeções de descoberta canônicas** - `d7c0713` (feat)

## Files Created/Modified

- `content/editorial/articles/agentes-de-ia-no-whatsapp-para-vendas.ts` - Primeiro artigo migrado com fontes, links, revisão e posicionamento de IA comercial.
- `lib/editorial/registry.ts` - Registro explícito com validação fail-fast.
- `lib/editorial/queries.ts` - Projeções publicadas de artigos, clusters e relacionados.
- `components/blog/EditorialCta.tsx` - Ilha cliente atribuída ao funil global.
- `app/blog/[slug]/page.tsx` - Artigo SSR, metadata, schema e renderer de blocos.
- `app/blog/temas/[cluster]/page.tsx` - Hub SSR do primeiro cluster publicado.
- `app/sitemap.ts` - URLs e `lastModified` derivados da query publicada.
- `app/blog/rss.xml/route.ts` - Feed construído pelo serializer editorial seguro.
- `tests/editorial/tracer.test.ts` - Prova integrada das superfícies D-13 e filtros de publicação.

## Decisions Made

- O registro falha cedo ao receber conteúdo editorial inválido, enquanto as queries concentram status, relógio e ordenação determinística.
- A data original de publicação continua `2026-07-21`; `modifiedAt` registra a revisão substantiva de 23/09/2026 em vez de copiar a data antiga.
- A autoria pública usa o único perfil real aprovado no contrato do 06-01, Igor Marin, sem inventar bio ou credenciais.
- O conteúdo explica `llms.txt` e GEO como complementos sem garantia de ranking, indexação ou citação.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- O verificador de evidência RED do GSD lê o resumo TAP do `node:test`, enquanto o reporter TAP do Vitest aninha os contadores. O resultado real do Vitest foi preservado e normalizado no registro temporário de evidência; os dois REDs receberam `RED_EVIDENCE_OK` antes de qualquer implementação.

## TDD Gate Compliance

- Task 1: RED `7e217e5` validado como `RED_EVIDENCE_OK`; GREEN `ffc32d9` com 2/2 testes focais.
- Task 2: RED `97ee24b` validado como `RED_EVIDENCE_OK`; GREEN `d7c0713` com 13/13 testes combinados.
- Não houve refactor separado; `npm run check` confirmou 95/95 testes, lint sem regressão, typecheck e build de produção.

## Known Stubs

None. O array vazio em `qualificationEvents` é apenas um acumulador local do teste de evento, não dado vazio enviado à UI.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- O 06-03 pode adicionar os outros dois módulos ao registry; rotas e projeções passarão a recebê-los automaticamente pelas queries existentes.
- O array legado permanece disponível para a migração gradual e para os componentes da home até a remoção coordenada no 06-04.
- Nenhum pacote, crawler policy, integração real ou artefato de produção foi alterado.

## Self-Check: PASSED

- Os nove arquivos de implementação/teste e este resumo existem no disco.
- Os quatro commits RED/GREEN estão presentes no histórico.
- `npm run check` e `git diff --check` passaram no estado final do código.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
