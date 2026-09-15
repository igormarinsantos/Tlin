---
phase: "01"
slug: "medi-o-comercial-do-funil"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-09-15"
---

# Phase 01 — Validation Strategy

> Contrato de validação da mudança de fonte de verdade comercial: Deskcomm primeiro, Supabase como espelho secundário.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | nenhum framework de testes automatizados detectado; Wave 0 define a base mínima |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npx tsc --noEmit && npm run lint && npm run build` |
| **Estimated runtime** | ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit && npm run lint`
- **After every plan wave:** Run `npx tsc --noEmit && npm run lint && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | TBD | 1 | FUN-01, FUN-02 | T-01-01 | CRM aceita captura idempotente antes do backup | unit/integration | MISSING — Wave 0 test command defined with the plan | ❌ W0 | ⬜ pending |
| 01-01-02 | TBD | 1 | FUN-03, OTIM-01 | T-01-02 | estados do CRM mantêm correlação com origem | unit/integration | MISSING — Wave 0 test command defined with the plan | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Definir a ferramenta de teste compatível com Next.js/TypeScript e criar testes de rota para `POST /api/notify`.
- [ ] Criar doubles para o adaptador Deskcomm e o espelho Supabase, sem credenciais reais.
- [ ] Cobrir ordem de chamadas, idempotência e degradação independente de CRM e backup.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fonte de captação Deskcomm recebe e mapeia o payload real | FUN-01, FUN-02 | depende da configuração da instância Deskcomm | enviar lead de teste com WhatsApp válido e conferir contato, estágio, campos de origem e chave de correlação |
| Pipeline aplica nutrição/agenda conforme fit | FUN-02 | depende de estágios e automações reais do CRM | enviar um lead sem fit e um com fit; conferir `a_desenvolver` e a demo no mesmo contato |
| Resultado comercial volta associado à origem | FUN-03, OTIM-01 | depende do evento/webhook de saída do CRM | alterar um lead de teste para ganha/perdida e conferir o registro analítico correlacionado |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
