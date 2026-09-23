---
phase: "06"
slug: "sistema-editorial-seo-geo-e-llm"
status: draft
nyquist_compliant: false
wave_0_complete: false
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
| 06-01-01 | 01 | 1 | BLOG-01 | T-06-04 | Contrato rejeita status, datas, autoria, mídia, URLs e referências inválidas | contract | `npm test -- tests/editorial/content-contract.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-01-02 | 01 | 1 | BLOG-03, BLOG-07 | T-06-01, T-06-02 | Baseline é independente; JSON-LD/RSS escapam conteúdo adversarial | contract/regression | `npm test -- tests/editorial/content-contract.test.ts tests/editorial/migration-parity.test.ts`<br>`git diff --check` | ❌ planned | ⬜ pending |
| 06-02-01 | 02 | 2 | BLOG-01, BLOG-02, BLOG-03, BLOG-06, BLOG-07 | T-06-01, T-06-02, T-06-04 | Um slug publicado atravessa HTML, metadata, schema, hub, sitemap, RSS e CTA | tracer/integration | `npm test -- tests/editorial/tracer.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-02-02 | 02 | 2 | BLOG-01, BLOG-07 | T-06-04 | Primeiro slug satisfaz paridade sem apagar expectativas dos outros dois | contract/regression | `npm test -- tests/editorial/content-contract.test.ts tests/editorial/migration-parity.test.ts tests/editorial/tracer.test.ts`<br>`git diff --check` | ❌ planned | ⬜ pending |
| 06-03-01 | 03 | 3 | BLOG-01, BLOG-04, BLOG-07 | T-06-04, T-06-05 | Artigo de modelos conserva URL e exige fonte/revisão sem claim inventado | contract/regression | `npm test -- tests/editorial/content-contract.test.ts tests/editorial/migration-parity.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-03-02 | 03 | 3 | BLOG-01, BLOG-04, BLOG-07 | T-06-04, T-06-05 | Playbook fecha registro único dos três slugs com links resolvíveis | contract/regression | `npm test -- tests/editorial/content-contract.test.ts tests/editorial/migration-parity.test.ts`<br>`git diff --check` | ❌ planned | ⬜ pending |
| 06-04-01 | 04 | 4 | BLOG-01, BLOG-07 | T-06-04 | Home/client recebem somente summaries publicados e preservam navegação | regression/UI contract | `npm test -- tests/editorial/migration-parity.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-04-02 | 04 | 4 | BLOG-01, BLOG-07 | T-06-04 | Legado só é removido com zero consumidores e três slugs em paridade | regression | `npm test -- tests/editorial/migration-parity.test.ts tests/editorial/content-contract.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-05-01 | 05 | 4 | BLOG-03, BLOG-07 | T-06-01, T-06-04 | Metadata/OG/schema usam dados publicados coerentes e JSON-LD seguro | integration | `npm test -- tests/editorial/discovery-outputs.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-05-02 | 05 | 4 | BLOG-03, BLOG-07 | T-06-02, T-06-04 | Sitemap/RSS excluem draft/future e preservam datas/escaping verdadeiros | integration/regression | `npm test -- tests/editorial/discovery-outputs.test.ts tests/editorial/migration-parity.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-06-01 | 06 | 5 | BLOG-02, BLOG-03 | T-06-04, T-06-05 | Hubs/autores vazios não publicam; canonical e breadcrumbs concordam | integration/contract | `npm test -- tests/editorial/information-architecture.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-06-02 | 06 | 5 | BLOG-02, BLOG-03 | T-06-05 | Grafo SSR resolve links sem canibalizar landings comerciais | contract/regression | `npm test -- tests/editorial/information-architecture.test.ts tests/editorial/migration-parity.test.ts`<br>`git diff --check` | ❌ planned | ⬜ pending |
| 06-07-01 | 07 | 3 | BLOG-06 | T-06-03, T-06-07 | First touch é imutável, last válido atualiza e estado inválido expira | unit/integration | `npm test -- tests/editorial/analytics-attribution.test.ts tests/analytics-events.test.ts`<br>`npm run typecheck` | ❌ planned / ✅ base | ⬜ pending |
| 06-07-02 | 07 | 3 | BLOG-06 | T-06-03, T-06-07 | CTA/share usam IDs allowlisted, sem PII, e abrem um único funil | integration/UI contract | `npm test -- tests/editorial/analytics-attribution.test.ts tests/analytics-events.test.ts tests/qualification-controller.test.tsx`<br>`npm run typecheck` | ❌ planned / ✅ base | ⬜ pending |
| 06-08-01 | 08 | 4 | BLOG-06 | T-06-03, T-06-07 | Capture/notify sanitizam o mesmo contexto e preservam leadCaptureId | route/integration | `npm test -- tests/editorial/analytics-attribution.test.ts tests/notify-route.test.ts`<br>`npm run typecheck` | ❌ planned / ✅ base | ⬜ pending |
| 06-08-02 | 08 | 4 | BLOG-06 | T-06-03, T-06-07 | Deskcomm recebe escalares e Supabase preserva first/atualiza last sem backfill | adapter/database | `npm run test:lead-capture`<br>`npm test -- tests/funnel-database.test.ts` | ❌ planned / ✅ base | ⬜ pending |
| 06-08-03 | 08 | 4 | BLOG-06 | T-06-03, T-06-08 | Relatório autenticado agrega conteúdo até booked/qualified/won sem PII | database/route | `npm test -- tests/funnel-database.test.ts tests/funnel-report-route.test.ts`<br>`npm run typecheck` | ❌ planned / ✅ base | ⬜ pending |
| 06-09-01 | 09 | 5 | BLOG-04, BLOG-05 | T-06-04 | Workflow exige verdade, aprovação, autoria/ativo real e operação Git/PR | governance contract | `npm test -- tests/editorial/governance.test.ts`<br>`git diff --check` | ❌ planned | ⬜ pending |
| 06-09-02 | 09 | 5 | BLOG-04, BLOG-05 | T-06-04 | Publicação sem evidência/revisor/approval falha; draft continua privado | contract | `npm test -- tests/editorial/governance.test.ts tests/editorial/content-contract.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-10-01 | 10 | 5 | BLOG-03, BLOG-05 | T-06-09, T-06-10, T-06-11 | llms.txt filtra publicados e não promete ranking/inclusão/citação | integration/contract | `npm test -- tests/editorial/discovery-outputs.test.ts`<br>`npm run typecheck` | ❌ planned | ⬜ pending |
| 06-10-02 | 10 | 5 | BLOG-03, BLOG-05 | T-06-09, T-06-10, T-06-11 | llms-full mantém conjunto canônico sem markup executável ou conteúdo privado | integration/contract | `npm test -- tests/editorial/discovery-outputs.test.ts tests/editorial/content-contract.test.ts`<br>`git diff --check` | ❌ planned | ⬜ pending |
| 06-11-01 | 11 | 6 | BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07 | T-06-03, T-06-10, T-06-11 | Gate completo registra resultados reais e não chama serviço comercial | phase gate | `npm test -- tests/editorial`<br>`npm run check`<br>`git diff --check` | ❌ planned | ⬜ pending |
| 06-11-02 | 11 | 6 | BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07 | T-06-03, T-06-10, T-06-11 | Evidência externa ausente fica BLOCKED; crawler-training requer decisão humana | contract/manual | `npm test -- tests/editorial/governance.test.ts tests/editorial/discovery-outputs.test.ts tests/editorial/analytics-attribution.test.ts` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

## Wave 0 / Test Scaffold Status

Não há wave executável separada chamada Wave 0: cada tarefa TDD cria o teste vermelho antes da implementação. `wave_0_complete: false` permanece correto até os arquivos abaixo existirem e os gates correspondentes passarem.

- [ ] `tests/editorial/fixtures/legacy-articles.ts` — 06-01-02, snapshot independente dos três slugs
- [ ] `tests/editorial/content-contract.test.ts` — 06-01-01, invariantes de tipo/identidade/datas/status/publicação
- [ ] `tests/editorial/migration-parity.test.ts` — 06-01-02 e expansões 06-02..06-06, contrato BLOG-07
- [ ] `tests/editorial/tracer.test.ts` — 06-02-01, D-13 ponta a ponta
- [ ] `tests/editorial/information-architecture.test.ts` — 06-06-01/02, ownership/hubs/breadcrumbs/links
- [ ] `tests/editorial/discovery-outputs.test.ts` — 06-05 e 06-10, metadata/OG/schema/sitemap/RSS/LLM/escaping
- [ ] `tests/editorial/governance.test.ts` — 06-09-01/02, brief/fontes/revisores/approval/operação
- [ ] `tests/editorial/analytics-attribution.test.ts` — 06-07/08, contexto editorial sem PII até transportes simulados
- [ ] Helper puro em `lib/editorial/queries.ts`/`validate.ts` para carregar e validar o registro sem navegador — 06-01/02

Os 11 planos preservam **46 direções explícitas de falha** em `<fails_when>`, acima do contrato mínimo de 42, distribuídas por todos os 23 tasks.

## Threat References

| Ref | Threat | Mitigation under test |
|-----|--------|-----------------------|
| T-06-01 | XSS por HTML/JSON-LD editorial | Sem HTML cru; React escaping; `<` escapado no JSON-LD |
| T-06-02 | XML injection ou feed inválido | Escape XML e fixtures com `&`, `<`, `>` e Unicode |
| T-06-03 | PII ou alta cardinalidade em analytics | Allowlist de IDs controlados; proibição de email, telefone e texto livre |
| T-06-04 | Draft, claim ou dado não aprovado publicado | Filtro central por status e contrato de revisão/aprovação |

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| HTML principal permanece compreensível sem JavaScript | BLOG-02, BLOG-03 | Exige inspeção de documento/render | Abrir artigos e hubs em preview, desabilitar JS e confirmar título, conteúdo, links, breadcrumbs e CTA |
| Rich Results e schema externo | BLOG-03 | Ferramentas externas não fazem parte da suíte local | Validar uma URL de preview/publicada no Rich Results Test e Schema Markup Validator; registrar evidência e limitações |
| Preview Open Graph | BLOG-03, BLOG-07 | Renderização depende de consumidores externos | Inspecionar título, descrição e imagem em ferramenta de preview social sem publicar em `main` sem autorização |
| Acessibilidade editorial | BLOG-02, BLOG-03, BLOG-07 | Leitura por teclado/screen reader requer julgamento humano | Percorrer headings, sumário, breadcrumbs, links, imagens e CTA por teclado; verificar nomes acessíveis e ordem |
| Identidade e ativos de autor | BLOG-01, BLOG-04 | Aprovação/direitos de bio e imagem não podem ser inferidos pelo código | Confirmar identidade/perfil real e, quando houver imagem declarada, o ativo local aprovado; sem evidência, registrar BLOCKED e não publicar o campo/claim |
| Política de crawler de treinamento | BLOG-03, BLOG-05 | Permissão de treinamento é decisão do owner, distinta de search/fetch | Documentar decisão explícita; sem aprovação, preservar `robots.ts`, registrar BLOCKED e não alegar impacto em ranking/citação |
| GA4/Search Console baseline e configuração | BLOG-06 | Requer contas externas | Exportar baseline por página/query; validar eventos/dimensões em DebugView com dados simulados; não disparar lead real |
| Correlação até CRM | BLOG-06 | Integração operacional real permanece adiada | Provar localmente com transportes simulados; manter ativação real como dependência operacional explícita |

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30 s para testes focais
- [ ] `npm run check` e `git diff --check` verdes
- [ ] Paridade dos três slugs documentada
- [ ] Validações manuais/externas registradas sem alegar indexação ou citação garantida
- [ ] `nyquist_compliant: true` set in frontmatter após execução comprovada

**Approval:** pending
