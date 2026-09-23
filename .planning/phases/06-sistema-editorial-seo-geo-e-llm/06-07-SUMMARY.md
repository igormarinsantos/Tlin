---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "07"
subsystem: analytics
tags: [typescript, react, analytics, attribution, localstorage, vitest]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "02"
    provides: Registro editorial publicado, tracer SSR e CTA conectado ao controlador global
  - phase: 01-medi-o-comercial-do-funil
    provides: Contrato browser-side de first/last UTM e eventos do funil comercial
provides:
  - First e last touch editorial duráveis por 30 dias, validados contra o registro publicado
  - Payload de lead com aquisição externa e atribuição editorial em campos escalares distintos
  - Eventos de view, CTA e share restritos a dimensões editoriais de baixa cardinalidade
  - Contexto editorial preservado até a abertura única do funil global
affects: [06-08, analytics, editorial, qualification, crm-attribution]

actuals:
  tokens: 6869
  tasks: 2
  commits: 9
plan_head_before: 49214e8b88cdec14de7284b0fa5d9ee788102e86

tech-stack:
  added: []
  patterns:
    - Estado first/last redundante em localStorage e cookie com validação fail-closed
    - Projeções editoriais separadas para evento e payload durável de lead
    - Allowlist de analytics com validadores específicos por dimensão editorial
    - Contexto do evento rederivado do registro antes de entrar no funil

key-files:
  created:
    - lib/editorial/analytics.ts
    - tests/editorial/analytics-attribution.test.ts
  modified:
    - lib/analytics-events.ts
    - lib/utm.ts
    - components/UTMTracker.tsx
    - components/QualificationController.tsx
    - components/blog/EditorialCta.tsx
    - components/blog/ShareBar.tsx
    - tests/analytics-events.test.ts

key-decisions:
  - "A atribuição editorial usa chaves próprias e não reaproveita utm_campaign; aquisição e conteúdo permanecem conceitos distintos."
  - "Slug, cluster, intenção e CTA persistidos são revalidados contra o artigo publicado; detalhes de eventos nunca autorizam operações."
  - "O evento share envia somente method, content_type e item_id; título, URL, query, hash e contato não entram no payload analítico."
  - "O controlador global deriva novamente o contexto canônico ao abrir o funil e preserva a trava de instância única."

patterns-established:
  - "Editorial attribution: first touch é imutável durante o TTL e last touch só muda após contexto editorial válido."
  - "Controlled analytics: dimensões editoriais precisam passar por allowlist de chave, formato, enum e limite de tamanho."
  - "Funnel handoff: o clique persiste atribuição antes de despachar open-qualification; o popup continua lendo o payload Phase 1 composto."

requirements-completed: [BLOG-06]

coverage:
  - id: D1
    description: "First/last touch editorial durável, validado e projetado ao lado de UTMs no payload do lead"
    requirement: BLOG-06
    verification:
      - kind: unit
        ref: "tests/editorial/analytics-attribution.test.ts#editorial analytics attribution"
        status: pass
      - kind: other
        ref: "npm run typecheck"
        status: pass
    human_judgment: false
  - id: D2
    description: "Views, CTAs e shares usam somente IDs editoriais controlados sem PII ou texto livre"
    requirement: BLOG-06
    verification:
      - kind: unit
        ref: "tests/analytics-events.test.ts#allows only controlled editorial analytics dimensions"
        status: pass
      - kind: integration
        ref: "tests/editorial/analytics-attribution.test.ts#emits a controlled CTA event and carries editorial context into the global funnel"
        status: pass
      - kind: integration
        ref: "tests/editorial/analytics-attribution.test.ts#emits recommended share fields without title, URL, query or contact data"
        status: pass
    human_judgment: false
  - id: D3
    description: "A abertura editorial reutiliza o controlador global uma única vez e mantém aquisição e resultado comercial semanticamente separados"
    requirement: BLOG-06
    verification:
      - kind: integration
        ref: "tests/qualification-controller.test.tsx"
        status: pass
      - kind: other
        ref: "npm run check (106/106 testes e build de produção)"
        status: pass
    human_judgment: false

duration: 21 min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 07: Atribuição e eventos editoriais Summary

**First/last content touch validado por 30 dias, payload de lead composto e eventos editoriais seguros até a abertura do funil global**

## Performance

- **Duration:** 21 min
- **Started:** 2026-09-23T20:21:15Z
- **Completed:** 2026-09-23T20:41:21Z
- **Tasks:** 2
- **Files modified:** 9
- **Ledger window:** 9 commits medidos; 4 pertencem ao 06-07 e 5 são commits intercalados do 06-03 executado na mesma branch

## Accomplishments

- Criou first e last touch editorial redundantes em localStorage/cookie, com TTL de 30 dias e rejeição de estado expirado, futuro, malformado ou fora do registro publicado.
- Enriqueceu `getUtmLeadPayload()` com campos escalares editoriais separados das UTMs e click IDs da Phase 1, sem armazenar token, PII, título ou texto livre.
- Instrumentou page view, clique de CTA e share com IDs de baixa cardinalidade e preservou o contexto validado na abertura única de `open-qualification`.
- Manteve demo confirmada, qualificação humana e venda fora da semântica de clique/formulário, preservando D-02.

## Task Commits

Cada tarefa TDD registrou RED antes de GREEN:

1. **Task 1 RED: contrato de payload editorial durável** - `2cca9cf` (test)
2. **Task 1 GREEN: first/last content touch e composição com UTMs** - `6c6af22` (feat)
3. **Task 2 RED: allowlist de dimensões editoriais controladas** - `8a2bfc6` (test)
4. **Task 2 GREEN: view, CTA, share e handoff do funil** - `6eb01ff` (feat)

## Files Created/Modified

- `lib/editorial/analytics.ts` - Tipo `EditorialTouch`, persistência redundante, validação temporal/canônica e projeções para evento/lead.
- `lib/analytics-events.ts` - Allowlist editorial com formatos, enums e limites de tamanho.
- `lib/utm.ts` - Composição da atribuição editorial no payload durável da Phase 1.
- `components/UTMTracker.tsx` - Captura do toque por pathname e contexto editorial no page view global existente.
- `components/QualificationController.tsx` - Detalhe editorial tipado, revalidação e transporte até a abertura única do funil.
- `components/blog/EditorialCta.tsx` - Persistência do CTA, evento controlado e detalhe editorial completo.
- `components/blog/ShareBar.tsx` - Evento recomendado `share` por método fixo e URL de compartilhamento sem query/hash.
- `tests/analytics-events.test.ts` - Casos aceitos/rejeitados da allowlist editorial.
- `tests/editorial/analytics-attribution.test.ts` - First/last, TTL, registro, ausência de PII, CTA, share e handoff global.

## Decisions Made

- Atribuição de conteúdo permanece paralela à aquisição: nenhum campo editorial é escondido dentro de `utm_campaign`.
- O registro publicado é a fonte canônica para reidratar slug, cluster, intenção e CTA; valores browser-side são atribuição, nunca autorização.
- `content_group` é aceito e usado como constante `editorial`, enquanto `method`, `content_type` e posições de CTA usam enums fechados.
- O share mantém o comportamento de compartilhamento, mas seu evento analítico carrega apenas método, tipo e slug.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- O primeiro `npm run check` capturou uma corrida de coordenação: o teste tracer do 06-03 ainda refletia o payload anterior enquanto `content_group` já estava no GREEN do 06-07. Os executores alinharam a expectativa ao contrato final e o gate integral seguinte passou sem alterar o comportamento do plano.
- Como 06-03 e 06-07 compartilharam a branch, o ledger obrigatório mede nove commits no intervalo; os quatro commits próprios deste plano estão listados acima.

## TDD Gate Compliance

- Task 1: RED `2cca9cf` validado como `RED_EVIDENCE_OK`; GREEN `6c6af22` com first/last, TTL, registry validation e payload composto verdes.
- Task 2: RED `8a2bfc6` validado como `RED_EVIDENCE_OK`; GREEN `6eb01ff` com allowlist, CTA, share e controlador global verdes.
- Não houve refactor separado; `npm run check` confirmou 106/106 testes, typecheck, lint controlado e build de produção.

## Known Stubs

None. Objetos/arrays vazios encontrados são acumuladores de evento ou defaults de função testados, não placeholders nem dados vazios enviados à UI.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Planos posteriores podem persistir os mesmos campos escalares no servidor/CRM sem reinterpretar UTMs ou criar outra identidade de lead.
- GA4/GTM continua desativado por padrão; configuração externa e validação operacional real permanecem fora deste plano.
- Nenhum bloqueio técnico ou dependência nova foi introduzido.

## Self-Check: PASSED

- Os nove arquivos de implementação/teste e este resumo existem no disco.
- Os quatro commits RED/GREEN do 06-07 estão presentes no histórico.
- As três entregas de cobertura foram classificadas como automaticamente cobertas.
- `npm run check`, `git diff --check` e `git diff --cached --check` passaram no estado final coordenado.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
