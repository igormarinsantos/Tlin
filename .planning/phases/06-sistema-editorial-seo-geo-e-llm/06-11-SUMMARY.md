---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "11"
subsystem: editorial-discovery
tags: [nextjs, route-handlers, llms-txt, seo, geo, vitest]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "03"
    provides: Registro canônico completo e validado com três artigos históricos
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "05"
    provides: Sitemap e RSS derivados da projeção editorial publicada
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "06"
    provides: Queries finais de hubs, autores e artigos publicados
provides:
  - llms.txt curto e experimental derivado somente de hubs e artigos publicados
  - llms-full.txt expandido com blocos, datas, autoria e fontes editoriais aprovadas
  - Rotas text/plain UTF-8 estáticas sem arquivos public concorrentes
  - Contrato de paridade entre superfícies LLM, sitemap e RSS
affects: [06-12, editorial-discovery, crawler-governance, seo, geo]

actuals:
  tokens: 5996
  tasks: 2
  commits: 7
plan_head_before: 9dfbb92dd4dab580e1aab21e6d7f19431d575357

tech-stack:
  added: []
  patterns:
    - Route Handlers force-static com Response nativa e Content-Type explícito
    - Serializadores textuais puros recebem somente projeções editoriais publicadas
    - Texto adversarial é normalizado e escapado; URLs usam allowlist de protocolo, origem e forma

key-files:
  created:
    - lib/editorial/llms.ts
    - app/llms.txt/route.ts
    - app/llms-full.txt/route.ts
  modified:
    - tests/editorial/discovery-outputs.test.ts

key-decisions:
  - "As duas superfícies se identificam como complementares e experimentais e afirmam explicitamente que não garantem ranking, inclusão ou citação."
  - "Canonicals editoriais são gerados por absoluteUrl somente para paths seguros; fontes externas aceitam exclusivamente HTTPS sem credenciais, query ou fragmento."
  - "llms-full.txt serializa apenas a união discriminada de blocos aprovada, sem interpretar HTML, MDX ou JSX e sem expor imagens decorativas."
  - "robots.ts permaneceu intacto; política de crawlers continua reservada ao checkpoint humano do 06-12."

patterns-established:
  - "Published projection only: rotas LLM consomem getPublishedArticles e getPublishedClusters, nunca registry cru."
  - "Complementary discovery: formatos LLM compartilham o conjunto canônico de sitemap/RSS, mas não são descritos como requisito ou sinal de ranking."
  - "Context-safe text: campos editoriais são normalizados e escapados antes de entrar na sintaxe textual."

requirements-completed: [BLOG-03, BLOG-05]

coverage:
  - id: D1
    description: "llms.txt responde texto UTF-8 com somente hubs e artigos publicados, sem draft, conteúdo futuro, URL insegura ou arquivo estático concorrente"
    requirement: BLOG-03
    verification:
      - kind: integration
        ref: "tests/editorial/discovery-outputs.test.ts#publishes a short experimental LLM index from safe published projections"
        status: pass
      - kind: integration
        ref: "tests/editorial/discovery-outputs.test.ts#serves the short LLM index as UTF-8 plain text without a competing static file"
        status: pass
    human_judgment: false
  - id: D2
    description: "llms-full.txt preserva o mesmo conjunto publicado e projeta datas, autoria, fontes e blocos estruturados com escaping seguro"
    requirement: BLOG-05
    verification:
      - kind: integration
        ref: "tests/editorial/discovery-outputs.test.ts#expands the same published LLM projection with approved structured content"
        status: pass
      - kind: integration
        ref: "tests/editorial/discovery-outputs.test.ts#serves the expanded LLM projection as UTF-8 plain text without a static duplicate"
        status: pass
    human_judgment: false
  - id: D3
    description: "Índice curto, projeção expandida, sitemap e RSS compartilham as mesmas identidades editoriais permitidas"
    requirement: BLOG-03
    verification:
      - kind: integration
        ref: "tests/editorial/discovery-outputs.test.ts#keeps both LLM URL sets aligned with the canonical sitemap and RSS projections"
        status: pass
      - kind: other
        ref: "npm run check (148 testes e build estático de /llms.txt e /llms-full.txt)"
        status: pass
    human_judgment: false
  - id: D4
    description: "As saídas rotulam o formato como experimental, não prometem benefício e não alteram a política de crawlers"
    requirement: BLOG-05
    verification:
      - kind: integration
        ref: "tests/editorial/discovery-outputs.test.ts#publishes a short experimental LLM index from safe published projections"
        status: pass
      - kind: other
        ref: "git diff --exit-code 9dfbb92 HEAD -- app/robots.ts"
        status: pass
    human_judgment: false

duration: 11 min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 11: Superfícies LLM derivadas e filtradas Summary

**llms.txt e llms-full.txt agora são projeções estáticas complementares do registro publicado, com escaping contextual, paridade de descoberta e nenhum claim de ranking ou citação**

## Performance

- **Duration:** 11 min
- **Started:** 2026-09-23T19:41:55-03:00
- **Completed:** 2026-09-23T22:52:44Z
- **Tasks:** 2
- **Files created/modified/deleted:** 6

## Accomplishments

- Substituiu os dois arquivos manuais em `public/` por Route Handlers `force-static` que consultam somente artigos e hubs publicados.
- Criou uma projeção curta factual e uma projeção expandida de blocos, datas, autoria e fontes aprovadas, ambas em `text/plain; charset=utf-8`.
- Bloqueou drafts, publicações futuras, slugs com query, protocolos ativos inseguros e HTML adversarial sem introduzir parser ou dependência.
- Provou paridade de URLs entre as duas superfícies LLM, sitemap e RSS, preservando `robots.ts` sem alteração.

## Task Commits

As tarefas TDD foram commitadas em sequência RED → GREEN:

1. **Task 1 RED: contrato do índice curto publicado** - `619519d` (test)
2. **Task 1 GREEN: serializer e rota llms.txt filtrados** - `dda96c3` (feat)
3. **Task 2 RED: contrato da projeção expandida segura** - `618230f` (test)
4. **Task 2 GREEN: serializer e rota llms-full.txt filtrados** - `9b6e78d` (feat)
5. **Task 2 coverage: paridade explícita com sitemap e RSS** - `feca8ba` (test)

O ledger mecânico mediu sete commits desde `plan_head_before`; cinco pertencem ao 06-11 e dois commits concorrentes de trabalho alheio foram intercalados na branch compartilhada.

## Files Created/Modified

- `lib/editorial/llms.ts` - Serializa índice curto e conteúdo expandido com canonicals seguros, texto escapado, datas, autoria e fontes aprovadas.
- `app/llms.txt/route.ts` - Entrega o índice curto publicado como texto UTF-8 estático.
- `app/llms-full.txt/route.ts` - Entrega a projeção expandida publicada como texto UTF-8 estático.
- `tests/editorial/discovery-outputs.test.ts` - Cobre filtro temporal/status, URLs, escaping, headers, duplicação estática e paridade de conjuntos.
- `public/llms.txt` - Removido após a rota curta ficar coberta e verde.
- `public/llms-full.txt` - Removido após a rota expandida ficar coberta e verde.

## Decisions Made

- A superfície curta contém apenas fatos institucionais já presentes em `siteConfig` e descrições editoriais aprovadas; fatos manuais antigos não foram migrados por inércia.
- A superfície expandida trata todos os blocos como texto e nunca executa HTML/MDX; imagens só contribuem alt aprovado quando não são decorativas.
- Fontes inseguras são omitidas em vez de reescritas, enquanto canonicals internos permanecem no domínio aprovado e sem query/fragmento.
- O aviso experimental é parte fixa das duas saídas para impedir que o formato seja interpretado como garantia de aquisição.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Dois commits concorrentes (`26e8799` e `a52617d`) entraram após a base do ledger. Eles não tocaram os seis arquivos do plano e não foram incluídos no staging dos commits próprios.
- O gate integral manteve 121 avisos de lint conhecidos e exibiu o aviso preexistente sobre `Cache-Control`; não houve regressão por arquivo/regra.

## TDD Gate Compliance

- Task 1: RED `619519d` recebeu `RED_EVIDENCE_OK` antes do GREEN `dda96c3`.
- Task 2: RED `618230f` recebeu `RED_EVIDENCE_OK` antes do GREEN `9b6e78d`.
- A evidência adicional `feca8ba` fechou a paridade explícita com sitemap e RSS; os 18 testes focais, 148 testes integrais, typecheck, lint controlado e build passaram.

## Known Stubs

None. A varredura dos arquivos criados/modificados não encontrou TODO, FIXME, placeholder, teste pulado ou valor vazio fluindo para saída pública.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- O plano 06-12 pode validar em preview as duas URLs e deliberar política de crawlers sem depender de cópias manuais em `public/`.
- Qualquer mudança em GPTBot, OAI-SearchBot, Google-Extended ou outros agentes continua exigindo decisão humana explícita; este plano não antecipou essa escolha.

## Self-Check: PASSED

- Os quatro arquivos criados/modificados e este summary existem; os dois arquivos estáticos antigos não existem mais.
- Os cinco commits próprios foram encontrados no histórico e preservam RED antes de GREEN em cada tarefa.
- O classificador de cobertura aceitou os quatro entregáveis como automaticamente cobertos, sem erro de schema.
- `npm run check`, `git diff --check` e `git diff --cached --check` passaram; `robots.ts` permaneceu sem diff desde a base do plano.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
