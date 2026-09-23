---
phase: "06"
slug: "sistema-editorial-seo-geo-e-llm"
status: blocked
nyquist_compliant: false
wave_0_complete: true
created: "2026-09-23"
---

# Phase 06 — Validation Strategy

> Contrato de validação incremental para o sistema editorial, incluindo regressão dos três artigos existentes, descoberta técnica, governança e atribuição comercial simulada.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm test -- tests/editorial` |
| **Full suite command** | `npm run check` |
| **Estimated runtime** | Quick: alvo inferior a 30 s; full: medir durante execução |

## Sampling Rate

- **After every task commit:** executar o teste focal do requisito alterado e `npm run typecheck`
- **After every plan wave:** executar `npm test` e `git diff --check`
- **Before `$gsd-verify-work`:** `npm run check` deve encerrar com código 0
- **Max feedback latency:** 30 s para a suíte editorial focal

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | BLOG-01 | T-06-04 | Contrato rejeita status, datas, autoria, mídia, URLs e referências inválidas | contract | `npm test -- tests/editorial/content-contract.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-01-02 | 01 | 1 | BLOG-03, BLOG-07 | T-06-01, T-06-02 | Baseline é independente; JSON-LD/RSS escapam conteúdo adversarial | contract/regression | `npm test -- tests/editorial/content-contract.test.ts tests/editorial/migration-parity.test.ts`<br>`git diff --check` | ✅ yes | ✅ green |
| 06-02-01 | 02 | 2 | BLOG-01, BLOG-02, BLOG-03, BLOG-06, BLOG-07 | T-06-01, T-06-04 | Um slug publicado atravessa modelo, query, HTML, metadata, schema, hub e CTA | tracer/integration | `npm test -- tests/editorial/tracer.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-02-02 | 02 | 2 | BLOG-03, BLOG-07 | T-06-02, T-06-04 | O mesmo slug fecha D-13 em sitemap/RSS seguro contra a fixture histórica | integration/regression | `npm test -- tests/editorial/tracer.test.ts tests/editorial/content-contract.test.ts`<br>`npm run typecheck && git diff --check` | ✅ yes | ✅ green |
| 06-03-01 | 03 | 3 | BLOG-01, BLOG-04, BLOG-07 | T-06-04, T-06-05 | Artigo de modelos conserva URL e exige fonte/revisão sem claim inventado | contract/regression | `npm test -- tests/editorial/content-contract.test.ts tests/editorial/migration-parity.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-03-02 | 03 | 3 | BLOG-01, BLOG-04, BLOG-07 | T-06-04, T-06-05 | Playbook fecha registro único dos três slugs com links resolvíveis | contract/regression | `npm test -- tests/editorial/content-contract.test.ts tests/editorial/migration-parity.test.ts`<br>`git diff --check` | ✅ yes | ✅ green |
| 06-04-01 | 04 | 4 | BLOG-01, BLOG-07 | T-06-04 | Home/client recebem somente summaries publicados e preservam navegação | regression/UI contract | `npm test -- tests/editorial/migration-parity.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-04-02 | 04 | 4 | BLOG-01, BLOG-07 | T-06-04 | Legado só é removido com zero consumidores e três slugs em paridade | regression | `npm test -- tests/editorial/migration-parity.test.ts tests/editorial/content-contract.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-05-01 | 05 | 4 | BLOG-03, BLOG-07 | T-06-01, T-06-04 | Metadata/OG/schema usam dados publicados coerentes e JSON-LD seguro | integration | `npm test -- tests/editorial/discovery-outputs.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-05-02 | 05 | 4 | BLOG-03, BLOG-07 | T-06-02, T-06-04 | Sitemap/RSS excluem draft/future e preservam datas/escaping verdadeiros | integration/regression | `npm test -- tests/editorial/discovery-outputs.test.ts tests/editorial/migration-parity.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-06-01 | 06 | 5 | BLOG-02, BLOG-03 | T-06-04, T-06-05 | Hubs/autores vazios não publicam; canonical e breadcrumbs concordam | integration/contract | `npm test -- tests/editorial/information-architecture.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-06-02 | 06 | 5 | BLOG-02, BLOG-03 | T-06-05 | Grafo SSR resolve links sem canibalizar landings comerciais | contract/regression | `npm test -- tests/editorial/information-architecture.test.ts tests/editorial/migration-parity.test.ts`<br>`git diff --check` | ✅ yes | ✅ green |
| 06-07-01 | 07 | 3 | BLOG-06 | T-06-03, T-06-07 | First touch é imutável, last válido atualiza e estado inválido expira | unit/integration | `npm test -- tests/editorial/analytics-attribution.test.ts tests/analytics-events.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-07-02 | 07 | 3 | BLOG-06 | T-06-03, T-06-07 | CTA/share usam IDs allowlisted, sem PII, e abrem um único funil | integration/UI contract | `npm test -- tests/editorial/analytics-attribution.test.ts tests/analytics-events.test.ts tests/qualification-controller.test.tsx`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-08-01 | 08 | 4 | BLOG-06 | T-06-03, T-06-07 | Capture/notify sanitizam o mesmo contexto e preservam leadCaptureId | route/integration | `npm test -- tests/editorial/analytics-attribution.test.ts tests/notify-route.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-08-02 | 08 | 4 | BLOG-06 | T-06-03, T-06-07 | Deskcomm recebe escalares e Supabase preserva first/atualiza last sem backfill | adapter/database | `npm run test:lead-capture`<br>`npm test -- tests/funnel-database.test.ts` | ✅ yes | ✅ green |
| 06-09-01 | 09 | 5 | BLOG-06 | T-06-03, T-06-07, T-06-08 | Função agrega conteúdo em booked/qualified/won, mantém não atribuído e não expõe PII | database | `npm test -- tests/funnel-database.test.ts`<br>`git diff --check` | ✅ yes | ✅ green |
| 06-09-02 | 09 | 5 | BLOG-06 | T-06-03, T-06-08 | Relatório autenticado renderiza agregados sem misturar clique com resultado comercial | route/UI contract | `npm test -- tests/funnel-report-route.test.ts tests/funnel-database.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-10-01 | 10 | 5 | BLOG-04, BLOG-05 | T-06-04 | Workflow exige verdade, aprovação, autoria/ativo real e operação Git/PR | governance contract | `npm test -- tests/editorial/governance.test.ts`<br>`git diff --check` | ✅ yes | ✅ green |
| 06-10-02 | 10 | 5 | BLOG-04, BLOG-05 | T-06-04 | Publicação sem evidência/revisor/approval falha; draft continua privado | contract | `npm test -- tests/editorial/governance.test.ts tests/editorial/content-contract.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-11-01 | 11 | 6 | BLOG-03, BLOG-05 | T-06-09, T-06-10, T-06-11 | llms.txt filtra publicados e não promete ranking/inclusão/citação | integration/contract | `npm test -- tests/editorial/discovery-outputs.test.ts`<br>`npm run typecheck` | ✅ yes | ✅ green |
| 06-11-02 | 11 | 6 | BLOG-03, BLOG-05 | T-06-09, T-06-10, T-06-11 | llms-full mantém conjunto canônico sem markup executável ou conteúdo privado | integration/contract | `npm test -- tests/editorial/discovery-outputs.test.ts tests/editorial/content-contract.test.ts`<br>`git diff --check` | ✅ yes | ✅ green |
| 06-12-01 | 12 | 7 | BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07 | T-06-03, T-06-10, T-06-11 | Gate completo registra resultados reais e não chama serviço comercial | phase gate | `npm test -- tests/editorial`<br>`npm run check`<br>`git diff --check` | ✅ yes | ✅ green |
| 06-12-02 | 12 | 7 | BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07 | T-06-03, T-06-10, T-06-11 | Evidência externa ausente fica BLOCKED; crawler-training requer decisão humana | contract/manual | `npm test -- tests/editorial/governance.test.ts tests/editorial/discovery-outputs.test.ts tests/editorial/analytics-attribution.test.ts` | ✅ yes | ⛔ blocked |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky · ⛔ blocked por evidência humana/externa*

## Wave 0 / Test Scaffold Status

Não houve wave executável separada chamada Wave 0: cada tarefa TDD criou o teste vermelho antes da implementação. Todos os arquivos previstos agora existem e passaram no gate final; `wave_0_complete: true` registra esse fato sem substituir os checkpoints humanos.

- [x] `tests/editorial/fixtures/legacy-articles.ts` — snapshot independente dos três slugs
- [x] `tests/editorial/content-contract.test.ts` — invariantes de tipo/identidade/datas/status/publicação
- [x] `tests/editorial/migration-parity.test.ts` — contrato BLOG-07 e paridade dos três slugs
- [x] `tests/editorial/tracer.test.ts` — D-13 ponta a ponta
- [x] `tests/editorial/information-architecture.test.ts` — ownership/hubs/breadcrumbs/links
- [x] `tests/editorial/discovery-outputs.test.ts` — metadata/OG/schema/sitemap/RSS/LLM/escaping
- [x] `tests/editorial/governance.test.ts` — brief/fontes/revisores/approval/operação
- [x] `tests/editorial/analytics-attribution.test.ts` — contexto editorial sem PII até transportes simulados
- [x] Helpers puros em `lib/editorial/queries.ts` e `lib/editorial/validate.ts`

Os 12 planos preservam **48 direções explícitas de falha** em `<fails_when>`, acima do contrato mínimo de 42, distribuídas por todos os 24 tasks.

## Threat References

| Ref | Threat | Mitigation under test |
|-----|--------|-----------------------|
| T-06-01 | XSS por HTML/JSON-LD editorial | Sem HTML cru; React escaping; `<` escapado no JSON-LD |
| T-06-02 | XML injection ou feed inválido | Escape XML e fixtures com `&`, `<`, `>` e Unicode |
| T-06-03 | PII ou alta cardinalidade em analytics | Allowlist de IDs controlados; proibição de email, telefone e texto livre |
| T-06-04 | Draft, claim ou dado não aprovado publicado | Filtro central por status e contrato de revisão/aprovação |

## Manual-Only Verifications

| Behavior | Requirement | Resultado em 23/09/2026 | Evidência ou pendência |
|----------|-------------|-------------------------|----------------------|
| HTML principal permanece compreensível sem JavaScript | BLOG-02, BLOG-03 | PASS estrutural / BLOCKED humano | Smoke do HTML bruto encontrou H1, autor, sumário, links, breadcrumbs e CTA nos três artigos; leitura humana com JS desativado ainda não foi registrada |
| Rich Results e schema externo | BLOG-03 | BLOCKED | Não há URL de preview autorizada; Rich Results Test e Schema Markup Validator não foram usados |
| Preview Open Graph | BLOG-03, BLOG-07 | BLOCKED | Metadata e rota OG passam localmente; consumo por ferramenta social externa não foi inspecionado |
| Acessibilidade editorial | BLOG-02, BLOG-03, BLOG-07 | BLOCKED | Contratos HTML existem, mas teclado, screen reader, foco, nomes acessíveis e ordem em desktop/mobile exigem inspeção humana |
| Identidade e ativos de autor | BLOG-01, BLOG-04 | PASS documental / BLOCKED humano | Registro usa Igor Marin e ativo local aprovado conforme 06-01; direitos, bio e suficiência do perfil continuam decisão humana |
| Política de crawler de treinamento | BLOG-03, BLOG-05 | BLOCKED | Nenhuma decisão do owner foi fornecida; `app/robots.ts` permaneceu inalterado. Search/fetch e treinamento continuam políticas separadas |
| GA4 DebugView e custom dimensions | BLOG-06 | BLOCKED | Sem acesso ao GA4; nenhuma dimensão foi criada/alterada e nenhum evento externo foi enviado |
| Search Console baseline e sitemap | BLOG-03, BLOG-06 | BLOCKED | Sem acesso e sem publicação autorizada; nenhuma cobertura/query foi inferida do build |
| Correlação até CRM | BLOG-06 | PASS simulado / adiada em produção | Testes de rota, adapters e PGlite passam; Deskcomm/Supabase reais não foram chamados |

## Execution Evidence — 06-12

| Gate | Result |
| --- | --- |
| `npm test -- tests/editorial` | ✅ 7 arquivos, 64 testes, código 0 |
| `npm run check` | ✅ typecheck; lint 0 erros/121 avisos conhecidos; 25 arquivos, 148 testes; build de 39 páginas; código 0 |
| `git diff --check` | ✅ código 0 |
| Gate focal do Task 2 | ✅ 3 arquivos, 29 testes, código 0 |
| Smoke local dos três slugs | ✅ `200`, sem redirect e canonical esperado no build controlado |
| Sitemap, RSS, robots e saídas LLM | ✅ `200`; três slugs presentes onde aplicável; headers e aviso sem garantia preservados |
| Operações externas/comerciais | ✅ nenhuma executada |

O build controlado definiu `NEXT_PUBLIC_SITE_URL=https://tlin.ia.br` somente no
processo local. O valor de `.env.local` permaneceu intacto. Detalhes e limites:
`docs/quality/phase-6-editorial-system.md`.

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30 s para testes focais
- [x] `npm run check` e `git diff --check` verdes
- [x] Paridade dos três slugs documentada
- [x] Validações manuais/externas registradas sem alegar indexação ou citação garantida
- [ ] Checkpoints humanos/externos obrigatórios concluídos ou aceitos pelo responsável
- [ ] `nyquist_compliant: true` — permanece falso enquanto o item anterior estiver bloqueado

**Approval:** blocked — automação local verde, sign-off humano/externo pendente
