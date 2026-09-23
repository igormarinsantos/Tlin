---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "03"
subsystem: editorial
tags: [typescript, vitest, seo, content-validation, migration]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "02"
    provides: Registro editorial, queries publicadas e tracer integrado às superfícies públicas
provides:
  - Segundo e terceiro artigos históricos publicados como módulos editoriais independentes
  - Registro canônico completo com os três slugs legados exatamente uma vez
  - Gates de intenção compatível com cluster e links internos resolvíveis
  - Paridade de conteúdo essencial, datas, fontes e aprovações antes da remoção do legado
affects: [06-04, 06-05, blog, discovery, editorial-governance]

actuals:
  tokens: 3656
  tasks: 2
  commits: 10
plan_head_before: 41d2e5117d230a62ef4099986311e434eb406942

tech-stack:
  added: []
  patterns:
    - Artigo histórico por módulo tipado com paridade contra fixture independente
    - Registro explícito validado com identidade, intenção, fontes, revisão e rotas conhecidas
    - Testes de descoberta projetados sobre todo o registro publicado, sem contagem fixa de artigos

key-files:
  created:
    - content/editorial/articles/como-avaliar-novos-modelos-de-ia-para-negocios.ts
    - content/editorial/articles/playbook-qualificacao-leads-whatsapp.ts
  modified:
    - lib/editorial/registry.ts
    - lib/editorial/validate.ts
    - tests/editorial/content-contract.test.ts
    - tests/editorial/migration-parity.test.ts
    - tests/editorial/tracer.test.ts

key-decisions:
  - "Os dois artigos preservam publishedAt e usam modifiedAt igual à publicação porque não houve alteração substantiva comprovada."
  - "A avaliação de modelos permanece informacional no cluster de IA comercial; o playbook permanece informacional no cluster de qualificação."
  - "A orientação editorial usa a fonte primária oficial da OpenAI sobre seleção, avaliação, instruções e intervenção humana, sem inventar benchmark ou integração."
  - "Links internos publicados resolvem somente para o hub geral do blog ou para hubs e owners comerciais registrados na taxonomia."

patterns-established:
  - "Full registry parity: cada fixture legada precisa encontrar um único módulo publicado com identidade, datas e conteúdo essencial preservados."
  - "Taxonomy-backed links: cluster e intentOwner definem a allowlist de destinos editoriais e comerciais válidos."

requirements-completed: [BLOG-01, BLOG-04, BLOG-07]

coverage:
  - id: D1
    description: "Artigo de avaliação de modelos migra para contrato tipado sem alterar slug, título, canonical, data ou conteúdo essencial"
    requirement: BLOG-01
    verification:
      - kind: integration
        ref: "tests/editorial/migration-parity.test.ts#migrates the model evaluation article without changing its public contract"
        status: pass
      - kind: other
        ref: "npm run typecheck"
        status: pass
    human_judgment: false
  - id: D2
    description: "Playbook de qualificação completa o registro com os três slugs históricos exatamente uma vez"
    requirement: BLOG-07
    verification:
      - kind: integration
        ref: "tests/editorial/migration-parity.test.ts#closes the canonical registry with each legacy article exactly once"
        status: pass
      - kind: integration
        ref: "npm run check (106 testes e build SSG das três rotas)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Publicação rejeita intenção fora do território do cluster e links internos sem rota registrada"
    requirement: BLOG-04
    verification:
      - kind: unit
        ref: "tests/editorial/content-contract.test.ts#rejects intents outside the cluster territory and unresolved internal routes"
        status: pass
    human_judgment: false

duration: 21 min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 03: Migração integral do registro editorial Summary

**Dois artigos históricos migrados para módulos tipados e registro canônico fechado com três slugs, fontes, revisão e paridade pública comprovada**

## Performance

- **Duration:** 21 min
- **Started:** 2026-09-23T20:23:56Z
- **Completed:** 2026-09-23T20:45:06Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Migrou `como-avaliar-novos-modelos-de-ia-para-negocios` preservando identidade pública, data original, conteúdo essencial e intenção informacional.
- Migrou `playbook-qualificacao-leads-whatsapp` para o cluster de qualificação com fontes verificadas, revisão factual/comercial e links úteis.
- Fechou o registro com exatamente os três slugs históricos, sem remover nem alterar o array legado antes do 06-04.
- Acrescentou gates para impedir intenção incompatível com o cluster e destinos internos fora das rotas conhecidas.
- Confirmou no build que as três URLs continuam sendo geradas diretamente como páginas SSG, sem redirects.

## Task Commits

Cada tarefa TDD registrou RED antes de GREEN:

1. **Task 1 RED: contrato do artigo de avaliação de modelos** - `49214e8` (test)
2. **Task 1 GREEN: módulo, registro e gates editoriais** - `77cf8e6` (feat)
3. **Task 2 RED: fechamento exato do registro canônico** - `e1eeb32` (test)
4. **Task 2 GREEN: módulo do playbook e registro completo** - `b58513f` (feat)
5. **Auto-fix: projeção tracer orientada pelo registro** - `7f5b90c` (fix)
6. **Auto-fix: contrato de evento editorial concorrente** - `397dc4d` (fix)

O ledger compartilhado entre executores mediu 10 commits desde `plan_head_before`; seis pertencem ao 06-03 e quatro foram commits intercalados do 06-07.

## Files Created/Modified

- `content/editorial/articles/como-avaliar-novos-modelos-de-ia-para-negocios.ts` - Segundo artigo histórico como módulo editorial aprovado.
- `content/editorial/articles/playbook-qualificacao-leads-whatsapp.ts` - Terceiro artigo histórico como módulo editorial aprovado.
- `lib/editorial/registry.ts` - Registro explícito completo com três módulos.
- `lib/editorial/validate.ts` - Gates de intenção por cluster e resolução de links internos.
- `tests/editorial/content-contract.test.ts` - Casos negativos dos novos gates.
- `tests/editorial/migration-parity.test.ts` - Paridade individual e fechamento data-driven do registro.
- `tests/editorial/tracer.test.ts` - Descoberta e evento validados para o registro expandido.

## Decisions Made

- `modifiedAt` permanece igual a `publishedAt` nos dois artigos porque a migração preservou o conteúdo e não sustenta uma alegação de atualização posterior.
- O artigo de modelos pertence a IA comercial, mas não assume a intenção transacional da home; o playbook pertence a qualificação, sem canonicalizar para a landing comercial.
- A fonte oficial da OpenAI sustenta o contexto sobre avaliação por tarefa, custo, latência, instruções, guardrails e intervenção humana; o texto legado continua apresentado como orientação, não como benchmark da Tlin.
- A allowlist de links nasce da taxonomia já aprovada, evitando aceitar paths apenas porque são sintaticamente seguros.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removida a expectativa fixa de um único artigo no tracer de sitemap**
- **Found during:** Verificação integral após Task 2
- **Issue:** O tracer do 06-02 esperava exatamente uma entrada editorial no sitemap e falhou corretamente quando o registro passou de um para três artigos.
- **Fix:** A asserção agora deriva URL e `lastModified` de cada artigo publicado, preservando as verificações de canonical e RSS do tracer original.
- **Files modified:** `tests/editorial/tracer.test.ts`
- **Verification:** `npm test -- tests/editorial/tracer.test.ts` e `npm run check` passaram.
- **Committed in:** `7f5b90c`

**2. [Rule 3 - Blocking] Alinhado o tracer ao contrato de evento editorial concluído em paralelo**
- **Found during:** Reexecução do gate integral após o GREEN concorrente do 06-07
- **Issue:** O CTA passou a emitir o campo controlado `content_group: editorial`, enquanto o tracer ainda comparava o payload anterior.
- **Fix:** A expectativa do tracer passou a incluir o campo estável, sem alterar analytics ou arquivos do 06-07.
- **Files modified:** `tests/editorial/tracer.test.ts`
- **Verification:** `npm test -- tests/editorial/tracer.test.ts` e `npm run check` passaram.
- **Committed in:** `397dc4d`

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking integration issue)
**Impact on plan:** Os ajustes mantêm os testes de integração coerentes com a expansão canônica e com o contrato paralelo, sem ampliar comportamento de produção.

## Issues Encountered

- Os dois REDs reais do Vitest foram normalizados para o formato TAP esperado pelo verificador GSD; ambos receberam `RED_EVIDENCE_OK` antes das implementações.
- A primeira execução integral atravessou o 06-07 enquanto seus testes e implementação ainda estavam intercalados. Nenhum arquivo do executor paralelo foi alterado; o gate foi repetido somente após o commit estável `6eb01ff`.
- O contador mecânico do ledger inclui quatro commits do 06-07 porque os dois planos executaram na mesma branch compartilhada; a lista acima distingue os seis commits próprios do 06-03.

## TDD Gate Compliance

- Task 1: RED `49214e8` validado como `RED_EVIDENCE_OK`; GREEN `77cf8e6` com 18/18 testes focais.
- Task 2: RED `e1eeb32` validado como `RED_EVIDENCE_OK`; GREEN `b58513f` com 19/19 testes focais.
- Não houve refactor separado; os dois ajustes posteriores corrigiram testes de integração tornados obsoletos pela expansão e pelo trabalho paralelo.

## Known Stubs

None. Arrays vazios e objetos default encontrados são acumuladores/opções locais de testes e do validador, não conteúdo incompleto enviado à UI.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- O 06-04 pode remover o adaptador `lib/blog.ts` somente depois de confirmar que listagem, cards e consumidores restantes usam as queries canônicas.
- Os três módulos publicados passam por autoria, taxonomia, intenção, fontes, revisão, datas, links e CTA antes de chegar às superfícies públicas.
- Nenhum pacote, integração real, redirect ou alteração de manifesto foi introduzido.

## Self-Check: PASSED

- Os sete arquivos de implementação/teste e este resumo existem no disco.
- Os seis commits próprios do 06-03 estão presentes no histórico.
- O contrato de cobertura reconheceu os três entregáveis como automaticamente cobertos.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
