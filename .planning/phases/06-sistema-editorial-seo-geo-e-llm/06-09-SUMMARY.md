---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "09"
subsystem: reporting
tags: [postgres, pglite, nextjs, attribution, funnel, security]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "08"
    provides: Atribuição editorial first/last validada e persistida no registro comercial existente
  - phase: 01-medi-o-comercial-do-funil
    provides: Marcos booked, qualified e won, identidade de lead e relatório interno protegido
provides:
  - Breakdown editorial agregado por first/last article, cluster e CTA no read_funnel_report
  - Contrato HTTP allowlisted que mantém autenticação e impede PII ou linhas individuais
  - Painel interno que separa indicadores de conteúdo de demo, qualificação humana e venda
affects: [BLOG-06, funnel-report, editorial-attribution, internal-reporting]

actuals:
  tokens: 5527
  tasks: 2
  commits: 11
plan_head_before: 880ba6975f4d3694b19c6422bad3101094e526cb

tech-stack:
  added: []
  patterns:
    - Agregação editorial sobre a mesma identidade e os mesmos marcos comerciais do funil
    - Allowlist de resposta na fronteira autenticada mesmo quando o RPC já retorna agregados
    - Dimensões editoriais escalares com sentinel explícito unattributed e sem backfill

key-files:
  created: []
  modified:
    - supabase/migrations/20260923_editorial_attribution.sql
    - app/api/internal/funnel/route.ts
    - app/internal/funnel/page.tsx
    - tests/funnel-database.test.ts
    - tests/funnel-report-route.test.ts

key-decisions:
  - "Cada lead aparece separadamente nos grupos first e last; a UI não soma os dois toques como se fossem leads distintos."
  - "Ausência de artigo, cluster ou CTA vira unattributed no banco e Não atribuído na UI, sem reconstruir histórico."
  - "A rota projeta somente campos agregados conhecidos e revalida dimensões, evitando que futuras mudanças do RPC exponham PII por passthrough."
  - "Descoberta e clique permanecem no analytics; o relatório comercial começa na captação persistida e só promove estados confirmados pelo funil."

patterns-established:
  - "Protected aggregate boundary: banco agrega, rota faz allowlist e a UI consome apenas o contrato sanitizado."
  - "Content outcome semantics: score, clique e evento analítico nunca substituem booked, qualified ou won."

requirements-completed: [BLOG-06]

coverage:
  - id: D1
    description: "O relatório agrega first/last article, cluster e CTA persistidos aos mesmos leads, demos confirmadas, qualificações humanas e vendas."
    requirement: BLOG-06
    verification:
      - kind: integration
        ref: "tests/funnel-database.test.ts#aggregates persisted editorial touches without inventing commercial stages"
        status: pass
    human_judgment: false
  - id: D2
    description: "A rota autenticada entrega somente campanhas, conteúdo e contadores agregados allowlisted, sem PII ou payload bruto."
    requirement: BLOG-06
    verification:
      - kind: unit
        ref: "tests/funnel-report-route.test.ts#returns only allowlisted campaign and editorial aggregates"
        status: pass
      - kind: unit
        ref: "tests/funnel-report-route.test.ts#requires authentication before querying data"
        status: pass
    human_judgment: false
  - id: D3
    description: "O painel interno apresenta artigo, cluster e CTA por primeiro/último toque, distinguindo analytics de resultados comerciais."
    requirement: BLOG-06
    verification:
      - kind: other
        ref: "npm run check (typecheck, lint, 143 testes e build)"
        status: pass
    human_judgment: true
    rationale: "Legibilidade e comparação visual do breakdown no painel protegido permanecem apropriadas para UAT humano."

duration: 20 min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 09: Relatório editorial do funil Summary

**Atribuição editorial first/last ligada a demo, qualificação humana e venda no relatório interno protegido, com resposta agregada e livre de PII**

## Performance

- **Duration:** 20 min
- **Started:** 2026-09-23T21:22:55Z
- **Completed:** 2026-09-23T21:42:55Z
- **Tasks:** 2
- **Files modified:** 5
- **Ledger window:** 11 commits medidos; 4 pertencem ao 06-09 e 7 são commits intercalados dos planos 06-06/06-10 no checkout compartilhado

## Accomplishments

- Estendeu `read_funnel_report` com grupos separados de primeiro e último toque por artigo, cluster e CTA, preservando período, deduplicação de agenda e os marcos comerciais existentes.
- Tornou histórico sem atribuição explicitamente `unattributed` e provou que score alto, evento analítico ou payload não promovem demo, qualificação ou venda.
- Fechou a fronteira autenticada com allowlist de shape e dimensões, impedindo passthrough acidental de nome, telefone, e-mail, payload ou linha individual.
- Atualizou o painel interno para comparar conteúdo por captação, demo confirmada, qualificação da equipe e venda, mantendo descoberta e clique como indicadores separados no analytics.

## Task Commits

As duas tarefas seguiram RED antes de GREEN:

1. **Task 1 RED: contrato PGlite do breakdown editorial** - `a5144c7` (test)
2. **Task 1 GREEN: agregação editorial no read_funnel_report** - `1eb9762` (feat)
3. **Task 2 RED: contrato allowlisted da rota autenticada** - `c2bbbf0` (test)
4. **Task 2 GREEN: rota sanitizada e painel editorial protegido** - `ba76d85` (feat)

## Files Created/Modified

- `supabase/migrations/20260923_editorial_attribution.sql` - Substitui de forma versionada a função de leitura para incluir `content`, mantendo revokes e execução por `service_role`.
- `app/api/internal/funnel/route.ts` - Conserva bearer token, período e erros, e projeta somente campos agregados allowlisted.
- `app/internal/funnel/page.tsx` - Renderiza aquisição e conteúdo em blocos separados, com rótulos de primeiro/último toque e não atribuído.
- `tests/funnel-database.test.ts` - Cobre first/last distintos, não atribuído, cada marco comercial, score sem promoção, ausência de PII e bloqueio público.
- `tests/funnel-report-route.test.ts` - Cobre 401, período, indisponibilidade, shape agregado e remoção de campos individuais injetados.

## Decisions Made

- O breakdown editorial é uma projeção do funil existente, não um funil ou evento de conversão paralelo.
- First e last são dimensões explícitas e independentes; comparar toques é válido, somar as duas coleções como total de leads não é.
- A rota não confia implicitamente no RPC: aplica allowlist e limites de formato antes de serializar a resposta autenticada.
- O valor `unattributed` é deliberado e estável; não há backfill nem inferência de origem para linhas históricas.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- O primeiro typecheck completo encontrou o commit RED temporário do plano 06-06 no checkout compartilhado. Nenhum arquivo externo ao 06-09 foi alterado; após o GREEN concorrente, `npm run check` passou integralmente.
- A janela persistida do ledger inclui sete commits intercalados de 06-06/06-10. O valor `actuals.commits` permanece o total medido de 11, enquanto os quatro commits próprios estão listados acima.

## TDD Gate Compliance

- Task 1: `RED_EVIDENCE_OK` confirmou a falha intencional `report.content was undefined` antes do commit GREEN `1eb9762`.
- Task 2: `RED_EVIDENCE_OK` confirmou o passthrough intencional de PII/campos extras antes do commit GREEN `ba76d85`.
- Não houve refactor próprio separado; o GREEN permaneceu mínimo e os testes direcionados passaram com 11/11 casos.

## Known Stubs

None. Valores vazios no formulário interno são estado interativo normal; não há mock, placeholder, TODO ou fonte de dados desconectada nos arquivos do plano.

## Threat Flags

None. A função service-role, a rota autenticada e o painel interno correspondem exatamente às superfícies registradas no threat model do plano.

## Authentication Gates

None.

## User Setup Required

- Nenhuma configuração foi alterada e nenhum serviço real foi chamado.
- A migration continua um artefato local versionado; aplicação no Supabase e validação operacional dependem de uma publicação futura explicitamente autorizada.

## Verification

- `npm test -- tests/funnel-report-route.test.ts tests/funnel-database.test.ts` — 11/11 testes passaram com PGlite e mocks locais.
- `npm run check` — typecheck, lint controlado, 143/143 testes e build de produção passaram.
- `git diff --check` e `git diff --cached --check` passaram; avisos de normalização pertencem a arquivos locais concorrentes não incluídos neste plano.
- Nenhum lead, e-mail, agendamento, migration remota, deploy, push ou merge foi executado.

## Next Phase Readiness

- BLOG-06 está fechado no loop local simulado: artigo/cluster/CTA persistidos chegam ao mesmo relatório de demo, qualificação humana e venda.
- A ativação real continua dependente da aplicação controlada da migration e da validação externa já adiada; isso não altera a evidência local deste plano.

## Self-Check: PASSED

- Os cinco arquivos de implementação/teste e este summary existem no disco.
- Os commits próprios `a5144c7`, `1eb9762`, `c2bbbf0` e `ba76d85` existem no histórico e preservam a ordem RED/GREEN.
- O validador de summary confirmou frontmatter, arquivos e commits.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
