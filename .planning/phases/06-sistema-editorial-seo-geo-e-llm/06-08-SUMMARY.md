---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "08"
subsystem: api-database
tags: [typescript, nextjs, deskcomm, supabase, postgres, attribution, vitest]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "07"
    provides: First e last touch editorial validados no navegador e projetados no payload do lead
  - phase: 01-medi-o-comercial-do-funil
    provides: Identidade leadCaptureId, captura Deskcomm-first, backup Supabase e RPC idempotente do funil
provides:
  - Validação server-side compartilhada para aquisição e first/last touch editorial nas duas rotas públicas
  - Projeção escalar allowlisted para Deskcomm e projeção sanitizada para o RPC do Supabase
  - Migration aditiva que preserva first touch, atualiza last touch e mantém execução restrita à service_role
affects: [06-09, funnel-report, editorial-attribution, deskcomm, supabase]

actuals:
  tokens: 6533
  tasks: 2
  commits: 12
plan_head_before: f608845f15208f38ecb8ee34aeb5694cfd0d5c0e

tech-stack:
  added: []
  patterns:
    - Sanitização fail-closed compartilhada antes de qualquer adapter comercial
    - Atribuição editorial escalar separada de aquisição e tratada apenas como contexto
    - Merge JSONB que preserva chaves first existentes e aceita atualização de last válida

key-files:
  created:
    - supabase/migrations/20260923_editorial_attribution.sql
  modified:
    - app/api/leads/capture/route.ts
    - app/api/notify/route.ts
    - lib/deskcomm-leads.ts
    - lib/supabase-leads.ts
    - tests/deskcomm-leads.test.ts
    - tests/notify-route.test.ts
    - tests/funnel-database.test.ts

key-decisions:
  - "As duas rotas públicas chamam o mesmo sanitizador e encaminham o mesmo leadCaptureId; atribuição editorial não autoriza captura, fit ou agenda."
  - "Deskcomm recebe somente campos escalares allowlisted, enquanto Supabase recebe a mesma projeção sanitizada no registro comercial existente."
  - "A migration não faz backfill: linhas históricas sem atribuição continuam sem origem inferida."
  - "A migration permanece um artefato versionado local; aplicação e validação em serviços reais continuam fora deste plano."

patterns-established:
  - "Commercial attribution boundary: validar slug, cluster, intent e CTA contra o registro publicado antes de Deskcomm ou Supabase."
  - "First/last persistence: chaves first são write-once por leadCaptureId; chaves last podem acompanhar novo contexto válido."

requirements-completed: [BLOG-06]

coverage:
  - id: D1
    description: "Captura precoce e confirmação encaminham a mesma atribuição editorial sanitizada com a mesma identidade de lead"
    requirement: BLOG-06
    verification:
      - kind: integration
        ref: "tests/notify-route.test.ts#forwards the same sanitized editorial attribution through early and final capture"
        status: pass
      - kind: unit
        ref: "tests/editorial/analytics-attribution.test.ts"
        status: pass
    human_judgment: false
  - id: D2
    description: "Deskcomm recebe somente escalares aprovados e o RPC Supabase preserva first touch, atualiza last touch e rejeita conteúdo inseguro"
    requirement: BLOG-06
    verification:
      - kind: unit
        ref: "npm run test:lead-capture (4/4 testes)"
        status: pass
      - kind: integration
        ref: "tests/funnel-database.test.ts (6/6 testes em PGlite)"
        status: pass
    human_judgment: false
  - id: D3
    description: "O contrato mantém idempotência, permissões restritas e o fluxo comercial anterior sem regressão local"
    requirement: BLOG-06
    verification:
      - kind: other
        ref: "npm run check (116/116 testes e build de produção)"
        status: pass
    human_judgment: false

duration: 20 min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 08: Persistência editorial no funil comercial Summary

**Atribuição editorial first/last validada nas duas rotas e persistida no mesmo lead via projeções Deskcomm/Supabase idempotentes**

## Performance

- **Duration:** 20 min de trabalho ativo, incluindo a retomada e verificação final
- **Started:** 2026-09-23T20:54:15Z
- **Completed:** 2026-09-23T21:14:10Z
- **Tasks:** 2
- **Files modified:** 8 arquivos de implementação/teste
- **Ledger window:** 12 commits medidos; 4 pertencem ao 06-08 e 8 são commits intercalados de outros planos na branch compartilhada

## Accomplishments

- Revalidou no servidor a aquisição e os bundles editoriais first/last nas rotas de captura precoce e confirmação, removendo objetos, PII, campos livres, valores longos e combinações que não correspondem ao registro publicado.
- Preservou `leadCaptureId`, Turnstile fora dos adapters e a ordem Deskcomm-first; atribuição permanece contexto declarativo sem mudar as regras de fit, agenda ou sucesso.
- Projetou apenas escalares allowlisted no webhook Deskcomm e a mesma atribuição sanitizada no RPC de backup do Supabase.
- Criou migration aditiva sem backfill que preserva chaves `first_*`, atualiza `last_*`, mantém o upsert por identidade e restringe execução a `service_role`.

## Task Commits

Cada tarefa TDD registrou RED antes de GREEN:

1. **Task 1 RED: contrato das duas rotas de lead** - `ebee9ab` (test)
2. **Task 1 GREEN: sanitização compartilhada e encaminhamento** - `269d284` (feat)
3. **Task 2 RED: contrato de persistência Deskcomm/Supabase** - `bc95e4e` (test)
4. **Task 2 GREEN: projeções escalares e merge first/last** - `0e359cd` (feat)

## Files Created/Modified

- `app/api/leads/capture/route.ts` - Sanitiza atribuição antes da captura precoce e do espelho Supabase.
- `app/api/notify/route.ts` - Reutiliza a atribuição sanitizada na confirmação, no Deskcomm, no backup e no template interno sem transportar Turnstile.
- `lib/deskcomm-leads.ts` - Espalha no payload apenas a projeção escalar allowlisted e mantém a chave idempotente existente.
- `lib/supabase-leads.ts` - Centraliza validação de aquisição/editorial e envia somente a projeção aprovada ao RPC.
- `supabase/migrations/20260923_editorial_attribution.sql` - Versiona o merge JSONB first/last e as permissões da função.
- `tests/deskcomm-leads.test.ts` - Prova allowlist escalar e ausência de PII, token, objeto ou campo injetado.
- `tests/notify-route.test.ts` - Prova paridade entre captura precoce e confirmação, inclusive payload adversarial.
- `tests/funnel-database.test.ts` - Prova idempotência, first imutável, last atualizável, ausência de backfill e bloqueio público em PGlite.

## Decisions Made

- O sanitizador server-side é a única fronteira aceita pelos dois adapters; nem o corpo bruto nem `turnstileToken` cruzam para CRM ou backup.
- Um touch editorial só é persistido quando slug, cluster, intenção e CTA formam um conjunto coerente com um artigo publicado.
- O merge de `utm jsonb` continua no registro existente: chaves `first_*` só entram quando ausentes; chaves `last_*` válidas podem ser substituídas.
- Histórico sem atribuição não é reconstruído, porque o repositório não possui fonte confiável para inferi-lo.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- O orquestrador foi interrompido depois dos quatro commits de implementação. O fechamento manual não refez tarefas nem alterou código; apenas auditou os commits, repetiu as verificações locais e criou este resumo.
- A janela do ledger contém oito commits de outros planos executados na mesma branch. O total medido permanece 12 conforme o ledger; somente os quatro commits listados em **Task Commits** pertencem ao 06-08.

## TDD Gate Compliance

- Task 1: RED `ebee9ab` precede GREEN `269d284`; os testes atuais das rotas e da atribuição passam.
- Task 2: RED `bc95e4e` precede GREEN `0e359cd`; os testes atuais do adapter e do banco em memória passam.
- Não houve commit de refactor separado. Por instrução de retomada, os REDs não foram reexecutados contra commits históricos; a ordem e o escopo foram confirmados no log, e o estado GREEN foi comprovado novamente.

## Known Stubs

None. Os valores vazios encontrados são defaults/retornos funcionais testados ou limpeza intencional de query/hash; não alimentam UI nem representam integração pendente mascarada.

## Threat Flags

None. As superfícies alteradas correspondem às duas fronteiras já registradas no threat model do plano: browser para rotas públicas e rotas para Deskcomm/Supabase.

## Authentication Gates

None.

## User Setup Required

- Aplicar a migration em Supabase e validar Deskcomm/Supabase reais continua deliberadamente pendente. Este plano não executou migration remota, webhook, e-mail, reserva, deploy, push ou merge.
- A evidência concluída é local: transports simulados, PGlite, typecheck, lint, testes e build.

## Next Phase Readiness

- O plano 06-09 pode agregar dimensões editoriais no relatório protegido a partir do mesmo `leadCaptureId` e do mesmo registro do funil.
- A semântica first/last, a allowlist escalar e o contrato de permissões estão cobertos por testes automatizados.
- A ativação operacional permanece condicionada à aplicação controlada da migration e à validação externa já adiada; não há bloqueio para continuar o desenvolvimento local.

## Self-Check: PASSED

- Os oito arquivos de implementação/teste e a migration existem no disco.
- Os quatro commits próprios do plano (`ebee9ab`, `269d284`, `bc95e4e`, `0e359cd`) existem e aparecem na ordem RED/GREEN esperada.
- `npm run test:lead-capture` passou com 4/4 testes.
- O conjunto direcionado passou com 23/23 testes, incluindo rotas, atribuição e PGlite.
- `npm run check` passou com typecheck, lint sem regressões, 116/116 testes e build de produção.
- `git diff --check` e `git diff --cached --check` passaram; avisos de normalização LF/CRLF pertencem a arquivos concorrentes não incluídos neste plano.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
