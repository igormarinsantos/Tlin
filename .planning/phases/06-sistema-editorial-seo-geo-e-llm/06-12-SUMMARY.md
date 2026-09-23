---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "12"
subsystem: editorial-validation
tags: [vitest, nextjs, seo, geo, llms, accessibility, analytics, governance]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plans: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"]
    provides: Sistema editorial, descoberta, atribuição, governança e testes incrementais
provides:
  - Gate final automatizado com 64 testes editoriais e 148 testes integrais verdes
  - Evidência HTTP local dos três slugs, hubs, sitemap, RSS, robots e superfícies LLM
  - Mapa Nyquist atualizado com arquivos reais, gates verdes e bloqueios externos explícitos
  - Checklist de UAT com passos, esperado, resultado e pendência para cada checkpoint humano
affects: [verify-work, editorial-uat, seo-operations, analytics-operations, crawler-policy]

actuals:
  tokens: 6378
  tasks: 2
  commits: 2
plan_head_before: 9e7e1e092cc2b2ab2187304abc1ff4fb14e7fabb

tech-stack:
  added: []
  patterns:
    - Evidência local, humana, externa e operacional registrada separadamente
    - Sign-off fail-closed quando preview, consoles ou decisão do owner não existem
    - Build local canônico com override de processo sem alterar ambiente persistido

key-files:
  created:
    - docs/quality/phase-6-editorial-system.md
    - .planning/phases/06-sistema-editorial-seo-geo-e-llm/06-12-SUMMARY.md
  modified:
    - .planning/phases/06-sistema-editorial-seo-geo-e-llm/06-VALIDATION.md

key-decisions:
  - "Automação local verde não fecha schema externo, aparência, acessibilidade, GA4, Search Console ou operação comercial real."
  - "nyquist_compliant permanece false e o status de validação permanece blocked enquanto checkpoints humanos/externos obrigatórios não tiverem evidência ou aceitação explícita."
  - "Search/fetch e crawlers de treinamento continuam políticas separadas; robots.ts foi preservado por falta de decisão do owner."
  - "O smoke canônico usa NEXT_PUBLIC_SITE_URL=https://tlin.ia.br apenas no processo de build local, sem editar .env.local nem publicar."

patterns-established:
  - "Evidence classification: cada claim identifica se foi provado por automação local, inspeção humana, console externo ou operação real."
  - "Blocked is evidence: ausência de acesso ou autorização permanece BLOCKED, nunca é convertida em sucesso por inferência."

requirements-completed: [BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07]

coverage:
  - id: D1
    description: "Matriz automatizada final cobre contratos editoriais e regressão integral sem chamar serviços comerciais"
    requirement: BLOG-01
    verification:
      - kind: integration
        ref: "npm test -- tests/editorial (7 arquivos, 64 testes)"
        status: pass
      - kind: other
        ref: "npm run check (25 arquivos, 148 testes e build de 39 páginas)"
        status: pass
      - kind: other
        ref: "git diff --check"
        status: pass
    human_judgment: false
  - id: D2
    description: "Três slugs e saídas públicas resolvem localmente com canonicals e conjuntos coerentes"
    requirement: BLOG-07
    verification:
      - kind: integration
        ref: "next start smoke local com NEXT_PUBLIC_SITE_URL=https://tlin.ia.br no build"
        status: pass
    human_judgment: true
    rationale: "O smoke prova o artefato local, mas aparência, acessibilidade, cache social e versão publicada ainda exigem UAT humano/externo."
  - id: D3
    description: "Checkpoints de HTML sem JS, acessibilidade, schema, OG, GA4, Search Console e correlação operacional estão prontos para UAT"
    requirement: BLOG-03
    verification: []
    human_judgment: true
    rationale: "Não havia preview público autorizado nem acesso aos consoles; os itens permanecem BLOCKED com passos e esperado documentados."
  - id: D4
    description: "Política de crawler preserva robots.ts e exige decisão separada para busca/fetch e treinamento"
    requirement: BLOG-05
    verification:
      - kind: other
        ref: "git diff --exit-code 9e7e1e0 HEAD -- app/robots.ts"
        status: pass
    human_judgment: true
    rationale: "Permissão de treinamento é decisão do owner; nenhum padrão pode ser assumido pelo executor."

duration: 18min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 12: Gate final e checkpoints editoriais Summary

**Automação editorial e build canônico verdes, com smoke dos três slugs e sign-off externo mantido honestamente bloqueado**

## Performance

- **Duration:** 18 min
- **Started:** 2026-09-23T23:01:11Z
- **Completed:** 2026-09-23T23:18:48Z
- **Tasks:** 2
- **Files created/modified:** 3

## Accomplishments

- Executou a suíte editorial com 64/64 testes e o gate integral com 148/148 testes, typecheck, lint controlado e build de 39 páginas.
- Confirmou em servidor local que os três slugs respondem `200` sem redirect e geram os canonicals esperados no build controlado.
- Confirmou `200` e paridade dos três slugs em sitemap, RSS, `llms.txt` e `llms-full.txt`, mantendo avisos sem garantia e `robots.ts` inalterado.
- Atualizou o mapa Nyquist de intenção para execução real: todos os arquivos previstos existem, gates automatizados estão verdes e checkpoints humanos/externos permanecem bloqueados.
- Criou checklist de UAT que não autoriza lead, e-mail, agenda, migration externa, deploy, push ou merge.

## Task Commits

Cada tarefa foi commitada separadamente:

1. **Task 1: Rodar a matriz completa e registrar evidências reproduzíveis** - `eafab7d` (docs)
2. **Task 2: Preparar checkpoints externos e de julgamento para o UAT final** - `2c63fe9` (docs)

## Files Created/Modified

- `docs/quality/phase-6-editorial-system.md` - Evidências, limites, slugs, saídas públicas e checklist completo do UAT.
- `.planning/phases/06-sistema-editorial-seo-geo-e-llm/06-VALIDATION.md` - Mapa Nyquist com arquivos existentes, resultados reais e bloqueios.
- `.planning/phases/06-sistema-editorial-seo-geo-e-llm/06-12-SUMMARY.md` - Fechamento auditável do plano.

## Decisions Made

- O plano está concluído porque sua entrega é executar e documentar o gate; a validação da fase continua bloqueada até evidência humana/externa real.
- `nyquist_compliant` continua `false`; todos os testes previstos existem e passam, mas o contrato da fase também exige checkpoints que automação local não pode fechar.
- A política existente de crawlers foi preservada. Ausência de decisão do owner não é autorização implícita para treinamento nem motivo para alterar `robots.ts`.
- O smoke com domínio canônico foi isolado no processo local porque o serializer LLM rejeita corretamente URLs HTTP de desenvolvimento.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- O primeiro smoke usou o `NEXT_PUBLIC_SITE_URL` local em HTTP. Os artigos e hubs responderam corretamente, mas as saídas LLM omitiram canonicals por seu gate HTTPS deliberado. O build foi repetido com o domínio público controlado somente no processo local; as saídas então contiveram os três slugs, sem editar `.env.local` ou fazer deploy.
- A baseline visual existente não cobre profundamente as novas rotas editoriais. O checklist exige novas capturas/inspeção em preview em vez de alegar paridade visual por testes estruturais.

## Verification

- `npm test -- tests/editorial` — 7 arquivos, 64 testes, PASS.
- `npm run check` — typecheck PASS; lint 0 erros e 121 avisos conhecidos sem regressão; 25 arquivos, 148 testes; build de 39 páginas, PASS.
- Gate focal do Task 2 — 3 arquivos, 29 testes, PASS.
- `git diff --check` — PASS.
- Smoke local controlado — três artigos `200` sem redirect; sitemap, RSS, robots e superfícies LLM `200`.
- Nenhuma integração externa ou operação comercial foi executada.

## Known Stubs

None. Os marcadores `BLOCKED` são estados de validação deliberados e documentados, não placeholders de implementação.

## Threat Flags

None. O plano só escreveu documentação e não criou endpoint, autenticação, acesso a arquivo ou mudança de schema. As fronteiras de evidência e ferramentas externas do threat model foram tratadas de forma fail-closed.

## Authentication Gates

None. GA4 e Search Console não foram acessados; a ausência foi registrada como bloqueio externo, sem tentativa de autenticação.

## User Setup Required

- GA4: revisar/criar `article_slug`, `content_cluster`, `content_intent`, `cta_id` e `cta_location` em Custom definitions e validar somente eventos simulados no DebugView.
- Search Console: após publicação autorizada, exportar baseline por página/query e verificar o sitemap na propriedade correta.
- Crawler training: o owner precisa decidir e registrar separadamente busca/fetch e treinamento antes de qualquer alteração em `robots.ts`.

## Next Phase Readiness

- O UAT pode começar usando os passos exatos de `docs/quality/phase-6-editorial-system.md`.
- Automação local não tem bloqueio técnico conhecido.
- O sign-off final da fase permanece bloqueado por acessibilidade/aparência humana, validadores de schema/OG, GA4, Search Console e decisão de crawler training.
- A validação operacional Deskcomm/Supabase continua adiada e não foi reaberta por este plano.

## Self-Check: PASSED

- Os três arquivos do plano foram confirmados no disco.
- Os commits de tarefa `eafab7d` e `2c63fe9` existem no histórico.
- O mapa de validação liga BLOG-01..07 aos planos, comandos e resultados reais.
- `git diff --check` passou e nenhum arquivo alheio foi incluído no staging.
- A varredura de stubs encontrou somente linguagem documental sobre arquivos previstos e o termo explicado `placeholder`; nenhum dado vazio ou implementação incompleta flui para UI.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
