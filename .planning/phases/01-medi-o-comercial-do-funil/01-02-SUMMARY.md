---
phase: 01-medi-o-comercial-do-funil
plan: "02"
subsystem: lead-funnel
tags: [deskcomm, supabase, webhooks, turnstile]
requires:
  - phase: 01-medi-o-comercial-do-funil
    provides: "Captura idempotente Deskcomm-first"
provides:
  - "Marcos comerciais de WhatsApp, qualificação e demo no mesmo lead"
  - "Webhook autenticado de status Deskcomm para projeção de backup"
affects: [pos-conversao, crm-status, reporting]
actuals:
  tokens: 0
  tasks: 2
  commits: 3
tech-stack:
  added: []
  patterns: ["Deskcomm-first com backup degradável", "webhook HMAC somente de projeção"]
key-files:
  created: [app/api/webhooks/deskcomm/route.ts, supabase/migrations/20260915_deskcomm_backup_projection.sql]
  modified: [app/api/notify/route.ts, components/LeadQualificationPopup.tsx, lib/supabase-leads.ts]
key-decisions:
  - "Deskcomm governa estágios e Supabase só espelha eventos e correlação."
  - "O lead é capturado após WhatsApp válido; agenda só acontece depois da qualificação."
patterns-established:
  - "Webhooks recebidos não acionam chamadas de volta ao CRM."
requirements-completed: [FUN-01, FUN-02, FUN-03, OTIM-01]
coverage:
  - id: D1
    description: "Marcos de captura e qualificação Deskcomm-first"
    requirement: FUN-02
    verification:
      - kind: unit
        ref: "npm run test:lead-capture"
        status: pass
    human_judgment: true
    rationale: "Os três fluxos exigem confirmação na instância real do Deskcomm."
  - id: D2
    description: "Projeção de status autenticada no Supabase"
    requirement: FUN-03
    verification:
      - kind: other
        ref: "npx tsc --noEmit"
        status: pass
    human_judgment: true
    rationale: "Ainda falta disparar um evento real de alteração de estágio."
status: complete
---

# Phase 01 Plan 02 Summary

**Funil Deskcomm-first que registra captura, qualificação e demo, com status comercial espelhado no Supabase.**

## Accomplishments

- O formulário captura o WhatsApp válido antes do fim do wizard e preserva a correlação do lead.
- Leads sem fit seguem para nutrição, enquanto demos dependem de qualificação e resposta do CRM.
- Criado receptor HMAC para mudanças de estágio e migration aditiva para o backup secundário.

## Task Commits

1. **Captura ao validar WhatsApp** — `67617e2`
2. **Projeção de status no backup** — `2042bcb`
3. **Validação de assinatura do webhook** — `95a2067`

## Verification

- `npm run test:lead-capture` passou em 2026-09-16.
- `npx tsc --noEmit` passou em 2026-09-16.
- Migration e automação de status foram configuradas; a prova de evento real foi adiada pelo usuário.

## Deviations from Plan

O teste manual de três cenários e do webhook de retorno não foi concluído porque a automação do navegador ficou indisponível. Isso foi aceito como pendência operacional explícita, sem reverter nem mascarar a implementação.

## Next Phase Readiness

O pós-conversão pode usar a confirmação de demo já retornada pelo fluxo. A pendência de validação CRM permanece isolada e não bloqueia a preparação da experiência de obrigado por decisão do usuário.
