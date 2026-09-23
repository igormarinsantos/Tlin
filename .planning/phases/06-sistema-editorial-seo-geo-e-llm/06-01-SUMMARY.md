---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "01"
subsystem: editorial
tags: [typescript, vitest, seo, json-ld, rss, content-validation]

requires: []
provides:
  - Contrato editorial tipado com blocos discriminados, autoria, taxonomia e estados de publicação
  - Gates puros para datas, referências, URLs, headings, mídia, evidência e aprovações
  - Builders seguros de Article, BreadcrumbList e RSS sem conectar consumidores públicos
  - Baseline independente dos três artigos legados e matriz explícita de migração
affects: [06-02, 06-03, 06-04, editorial, blog, discovery]

actuals:
  tokens: 10227
  tasks: 2
  commits: 5
plan_head_before: f9b293d86b0a0ff608973865a1a963d31938dd1f

tech-stack:
  added: []
  patterns:
    - União discriminada de blocos editoriais sem HTML cru
    - Gates de publicação puros com diagnósticos por código
    - Serialização segura por projeção do contrato canônico
    - Fixture independente e imutável para migração tracer

key-files:
  created:
    - content/editorial/authors.ts
    - content/editorial/taxonomy.ts
    - lib/editorial/types.ts
    - lib/editorial/validate.ts
    - lib/editorial/structured-data.ts
    - lib/editorial/feed.ts
    - tests/editorial/fixtures/legacy-articles.ts
    - tests/editorial/content-contract.test.ts
    - tests/editorial/migration-parity.test.ts
  modified: []

key-decisions:
  - "O perfil editorial aprovado usa Igor Marin e a rota pública /como-funciona; bio e credenciais não foram inventadas."
  - "A imagem autoral só foi declarada porque /public/team/igor-avatar.png já é um ativo local aprovado e publicado."
  - "Canonical, JSON-LD e RSS são derivados do slug e do siteConfig, enquanto a baseline histórica fixa https://tlin.ia.br literalmente para não aceitar drift ambiental."
  - "Nenhum consumidor público importa o novo contrato neste plano; 06-02 permanece o primeiro corte tracer."

patterns-established:
  - "Publication gate: drafts e reviews podem permanecer incompletos, mas status published exige contrato, evidência e aprovações completos."
  - "Safe discovery projection: JSON-LD escapa o caractere < e RSS escapa texto XML campo a campo."
  - "Migration parity: expectativas legadas vivem em fixture de teste independente do registro novo."

requirements-completed: [BLOG-01, BLOG-03, BLOG-07]

coverage:
  - id: D1
    description: "Contrato editorial tipado e gates de publicação para autoria, datas, referências, URLs, mídia e revisão"
    requirement: BLOG-01
    verification:
      - kind: unit
        ref: "tests/editorial/content-contract.test.ts (10 testes)"
        status: pass
      - kind: other
        ref: "npm run typecheck"
        status: pass
    human_judgment: false
  - id: D2
    description: "Builders seguros de Article, BreadcrumbList e RSS com escaping adversarial"
    requirement: BLOG-03
    verification:
      - kind: unit
        ref: "tests/editorial/migration-parity.test.ts#safe editorial serializers"
        status: pass
      - kind: integration
        ref: "npm run check"
        status: pass
    human_judgment: false
  - id: D3
    description: "Baseline imutável e matriz de paridade dos três slugs públicos antes do tracer"
    requirement: BLOG-07
    verification:
      - kind: unit
        ref: "tests/editorial/migration-parity.test.ts#legacy article migration parity"
        status: pass
    human_judgment: false

duration: 18 min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 01: Contratos e baseline editorial Summary

**Contrato editorial com gates de publicação, serializers seguros de JSON-LD/RSS e baseline independente dos três artigos existentes**

## Performance

- **Duration:** 18 min
- **Started:** 2026-09-23T19:30:35Z
- **Completed:** 2026-09-23T19:47:58Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Definiu artigos, blocos, IDs, autoria, intenção, cluster, fontes, links, CTA, mídia, revisão e estados editoriais sem HTML cru ou dependência nova.
- Implementou gates puros para impedir publicação com referências inexistentes, datas inválidas, URLs inseguras, headings instáveis, mídia sem alt/aprovação ou revisão incompleta.
- Congelou os três artigos atuais com slug, título, data, canonical, navegação, compartilhamento, sitemap, RSS e conteúdo essencial, mantendo o estado migrado explicitamente pendente.
- Criou builders puros de Article/BreadcrumbList e RSS com escaping adversarial, ainda sem alterar rotas públicas.

## Task Commits

Cada ciclo TDD foi registrado antes da implementação:

1. **Task 1 RED: contrato e gates editoriais** - `6212935` (test)
2. **Task 1 GREEN: tipos, autoria, taxonomia e validação** - `5ac7200` (feat)
3. **Task 2 RED: baseline e serializers seguros** - `e1743f4` (test)
4. **Task 2 GREEN: JSON-LD, BreadcrumbList e RSS** - `ef66646` (feat)
5. **Correção de lint da verificação integral** - `038e02b` (fix)

## Files Created/Modified

- `content/editorial/authors.ts` - Registro da identidade autoral real e do ativo local aprovado.
- `content/editorial/taxonomy.ts` - Clusters do território de IA comercial e owners de intenção.
- `lib/editorial/types.ts` - Contrato tipado de artigos, blocos, evidências, mídia e workflow.
- `lib/editorial/validate.ts` - Invariantes puras e diagnósticos específicos do gate de publicação.
- `lib/editorial/structured-data.ts` - Builders Article/BreadcrumbList e serializer JSON-LD seguro.
- `lib/editorial/feed.ts` - Escaping XML e serializer RSS derivado do contrato.
- `tests/editorial/fixtures/legacy-articles.ts` - Baseline imutável e independente dos três artigos.
- `tests/editorial/content-contract.test.ts` - Dez casos positivos e negativos do contrato editorial.
- `tests/editorial/migration-parity.test.ts` - Paridade legada e fixtures adversariais de descoberta.

## Decisions Made

- Igor Marin é a única identidade autoral aprovada nesta fundação porque nome, papel, perfil público e ativo local já existem no produto.
- Bio e credenciais ficaram opcionais e vazias em vez de serem fabricadas para satisfazer o tipo.
- A taxonomia separa intenção informacional/comparativa dos owners comerciais já existentes, preservando “IA comercial” como categoria principal.
- A baseline histórica usa o domínio literal correto para detectar regressão mesmo quando variáveis locais alterarem `siteConfig`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removidos novos avisos de lint introduzidos pela implementação**
- **Found during:** Verificação integral após Task 2
- **Issue:** Um import e duas bindings usadas apenas para omitir campos excederam a baseline de lint do projeto.
- **Fix:** O import foi removido e a projeção da fixture passou a listar os campos legados explicitamente.
- **Files modified:** `lib/editorial/validate.ts`, `tests/editorial/migration-parity.test.ts`
- **Verification:** `npm run lint:check` e `npm run check` passaram sem regressão.
- **Committed in:** `038e02b`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Correção estritamente necessária para cumprir a política de qualidade, sem ampliar escopo ou alterar comportamento.

## Issues Encountered

Nenhum problema pendente. A primeira execução de `npm run check` encontrou a regressão de lint acima, corrigida e validada antes da conclusão.

## TDD Gate Compliance

- Task 1: RED `6212935` validado como `RED_EVIDENCE_OK`; GREEN `5ac7200` com 10/10 testes.
- Task 2: RED `e1743f4` validado como `RED_EVIDENCE_OK`; GREEN `ef66646` com 6/6 testes.
- Não houve refactor separado; a correção posterior preservou os 16 testes editoriais verdes.

## Known Stubs

None. Inicializações vazias locais são acumuladores/opções de funções testadas, não dados enviados à UI nem placeholders de produção.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- O plano 06-02 pode criar o registro/query e migrar o primeiro slug como tracer usando os contratos e builders prontos.
- Página, sitemap, RSS e demais consumidores públicos seguem no legado até esse corte, como exigido por D-13.
- Nenhum bloqueio técnico ou dependência externa foi introduzido.

## Self-Check: PASSED

- Os nove arquivos de implementação/teste e este resumo existem no disco.
- Os cinco commits de tarefa estão presentes no histórico.
- A classificação de cobertura reconheceu os três entregáveis como automaticamente cobertos.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
