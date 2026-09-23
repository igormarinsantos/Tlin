---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "10"
subsystem: editorial-governance
tags: [editorial, governance, seo, geo, typescript, vitest]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "03"
    provides: Registro editorial tipado com fontes, contribuição e aprovações
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "05"
    provides: Projeções públicas coerentes derivadas do registro publicado
provides:
  - Workflow editorial versionado para operador técnico com gates humanos e automatizados
  - Brief, checklist e rotina manual de distribuição rastreável
  - Validação de owner da intenção, datas de evidência e aprovações humanas
affects: [editorial-content, publication-gates, seo, geo, distribution]

actuals:
  tokens: 9066
  tasks: 2
  commits: 15
plan_head_before: ad64d9e9a099803241ce5dc52dbc9145564a2538

tech-stack:
  added: []
  patterns:
    - Processo editorial local em arquivos tipados com revisão Git/PR
    - Gates técnicos exigem evidência humana sem alegar comprovar verdade ou plágio
    - Distribuição externa permanece manual, deliberada e registrada

key-files:
  created:
    - docs/editorial/README.md
    - docs/editorial/content-brief.md
    - docs/editorial/quality-checklist.md
    - docs/editorial/distribution.md
    - tests/editorial/governance.test.ts
  modified:
    - lib/editorial/validate.ts

key-decisions:
  - "O brief automatizável usa intenção, cluster e URL owner da taxonomia; público, problema, aplicabilidade e escopo continuam revisão humana documentada."
  - "A fonte tipada registra identidade, URL e acesso; o checklist humano relaciona cada claim ao escopo sem fingir que código comprova verdade ou originalidade."
  - "CMS headless só reabre com requisito confirmado de publicação não técnica; a operação atual permanece local, tipada e revisada por Git/PR."
  - "Distribuição em terceiros é manual e usa UTMs deliberadas somente depois que a canonical publicada foi verificada."

patterns-established:
  - "Human-evidence gate: revisores aprovados e datados são pré-condição de publicação, mas o julgamento permanece explicitamente humano."
  - "Risk-triggered maintenance: modifiedAt representa mudança substantiva; gatilhos e risco dirigem a reavaliação sem fake freshness."

requirements-completed: [BLOG-04, BLOG-05]

coverage:
  - id: D1
    description: "Brief, workflow e checklist tornam intenção, fontes, contribuição, revisão, atualização e autoria um processo versionado"
    requirement: BLOG-04
    verification:
      - kind: unit
        ref: "tests/editorial/governance.test.ts#editorial governance documents"
        status: pass
      - kind: other
        ref: "npm run check (143 testes e build de produção)"
        status: pass
    human_judgment: true
    rationale: "Os testes comprovam o contrato documental, mas a suficiência factual, comercial e anti-plágio de cada peça exige julgamento humano."
  - id: D2
    description: "O validador bloqueia publicação sem intenção/owner, fontes válidas e aprovações humanas datadas, mantendo drafts fora da query pública"
    requirement: BLOG-04
    verification:
      - kind: unit
        ref: "tests/editorial/governance.test.ts#editorial publication governance"
        status: pass
      - kind: integration
        ref: "tests/editorial/content-contract.test.ts"
        status: pass
      - kind: other
        ref: "npm run typecheck"
        status: pass
    human_judgment: false
  - id: D3
    description: "Rotina de distribuição manual registra canal, URL real, responsável, UTMs e evidência sem disparar terceiros"
    requirement: BLOG-05
    verification:
      - kind: unit
        ref: "tests/editorial/governance.test.ts#keeps third-party distribution manual and traceable with deliberate UTMs"
        status: pass
    human_judgment: true
    rationale: "A execução em canais externos continua manual e só pode ser verificada quando houver uma publicação autorizada real."

duration: 20min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 10: Governança editorial operacional Summary

**Workflow editorial com brief, gates de verdade e originalidade, manutenção por risco e distribuição manual, protegido por validação técnica de evidências**

## Performance

- **Duration:** 20 min
- **Started:** 2026-09-23T21:24:42Z
- **Completed:** 2026-09-23T21:43:59Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Versionou o fluxo `draft → review → published → archived` para um operador técnico, com owners, evidências, gatilhos de atualização e limites claros para autoria, imagens e `modifiedAt`.
- Entregou brief e checklist que proíbem plágio, benchmark, cliente, resultado, experiência, integração ou URL inventados, além de separar práticas documentadas, hipóteses experimentais e heurísticas sem suporte.
- Definiu distribuição manual com canonical previamente verificada, UTMs deliberadas e registro de evidência, sem autorização para disparos ou automação em terceiros.
- Reforçou o gate de publicação para exigir intenção e URL owner válidas, fontes com IDs únicos e acesso não futuro, aprovações humanas existentes e não futuras e permanência de drafts fora das queries públicas.

## Task Commits

1. **Task 1 RED: contrato dos artefatos de governança** - `e481444` (test)
2. **Task 1 GREEN: workflow, brief, checklist e distribuição** - `880ba69` (feat)
3. **Task 1 REFACTOR: finais de arquivo normalizados** - `9d9ad66` (refactor)
4. **Task 2 RED: contrato dos gates de evidência** - `d5ff771` (test)
5. **Task 2 GREEN: gate de publicação editorial** - `4819094` (feat)
6. **Task 2 REFACTOR: evidências alinhadas ao registro tipado** - `f6aa166` (refactor)

O ledger mediu 15 commits desde `plan_head_before`; seis pertencem ao 06-10 e nove são commits intercalados dos planos 06-06 e 06-09 na branch compartilhada.

## Files Created/Modified

- `docs/editorial/README.md` - Estados, responsabilidades, evidências, atualização e limite do CMS.
- `docs/editorial/content-brief.md` - Template de intenção, owner, claims, revisões, arquitetura e medição.
- `docs/editorial/quality-checklist.md` - Gates técnicos e humanos de verdade, comercial, anti-plágio, SEO/GEO, autoria e atualização.
- `docs/editorial/distribution.md` - Rotina manual de canais, URLs reais, UTMs e observação.
- `lib/editorial/validate.ts` - Gates de brief, fontes e datas de aprovação para conteúdo publicado.
- `tests/editorial/governance.test.ts` - Contrato data-driven dos artefatos e da fronteira de publicação.

## Decisions Made

- Campos que o registro já tipa são validados em código; aplicabilidade da fonte, escopo do claim, verdade factual, adequação comercial e anti-plágio ficam no checklist assinado por pessoas.
- `modifiedAt` só muda com alteração substantiva perceptível ao leitor; uma cadência de revisão não autoriza fabricar freshness.
- Comprimento, headings, links, imagens e palavras-chave derivam da intenção e da utilidade, sem score, densidade ou cotas mecânicas.
- CMS e automação de terceiros ficaram explicitamente fora do escopo e exigem novo requisito e novo plano para serem reconsiderados.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- A primeira execução de `npm run check` cruzou a RED concorrente do 06-06 e falhou no teste de arquitetura ainda propositalmente incompleto. Depois do GREEN `6908f9c`, a suíte completa foi repetida e passou com 143 testes e build de produção.
- O primeiro GREEN do Task 2 tratava claims por uma propriedade não pertencente ao contrato tipado. O refactor `f6aa166` eliminou essa interface morta e validou as evidências que o modelo realmente suporta, deixando escopo/aplicabilidade como gate humano explícito.

## TDD Gate Compliance

- Task 1: RED `e481444` validado como `RED_EVIDENCE_OK`, seguido do GREEN `880ba69` e REFACTOR `9d9ad66`.
- Task 2: RED `d5ff771` validado como `RED_EVIDENCE_OK`, seguido do GREEN `4819094` e REFACTOR `f6aa166`.
- As duas tarefas terminaram com testes focais, typecheck, lint controlado, suíte integral e build verdes.

## Known Stubs

None. `não disponível` no template de distribuição é um valor operacional justificado quando o canal não fornece evidência, não conteúdo de UI incompleto; arrays/objetos vazios do validador são acumuladores locais.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Self-Check: PASSED

- Os seis arquivos criados/modificados pelo plano existem no checkout e totalizam 9.066 tokens na escala `estimateTokens` (`chars/4`, arredondado para cima).
- Os commits `e481444`, `880ba69`, `9d9ad66`, `d5ff771`, `4819094` e `f6aa166` existem e são ancestrais do `HEAD` atual.
- O classificador de coverage aceitou as três entregas sem erro: D2 auto coberta; D1 e D3 preservadas para julgamento humano.
- `npm run check` passou no estado atual com typecheck, lint controlado, 143 testes e build de produção; `git diff --check` também passou.

## Next Phase Readiness

- Novos artigos podem usar o mesmo brief/checklist e só alcançar superfícies públicas após os gates tipados e as aprovações humanas.
- BLOG-04/BLOG-05 têm operação versionada e testes; execução real de distribuição e qualidade editorial de cada peça permanecem corretamente sujeitas a autorização e revisão humanas.
- Nenhum pacote, CMS, integração externa, endpoint, disparo real, merge, push ou deploy foi introduzido.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
