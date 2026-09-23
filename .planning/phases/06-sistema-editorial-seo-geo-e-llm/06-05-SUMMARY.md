---
phase: 06-sistema-editorial-seo-geo-e-llm
plan: "05"
subsystem: editorial-discovery
tags: [nextjs, metadata, opengraph, json-ld, sitemap, rss, xml, vitest]

requires:
  - phase: 06-sistema-editorial-seo-geo-e-llm
    plan: "03"
    provides: Registro canônico validado com três artigos, autores, taxonomia, datas e queries publicáveis
provides:
  - Metadata, canonical, Open Graph, Twitter e imagem social específicos para cada artigo publicado
  - Article e BreadcrumbList coerentes com autoria, canonical, imagem e datas visíveis
  - Sitemap de artigos e hubs com modifiedAt editorial verdadeiro
  - RSS determinístico com canonical como GUID e escaping XML campo a campo
affects: [06-06, blog, seo, geo, discovery, sharing]

actuals:
  tokens: 5784
  tasks: 2
  commits: 14
plan_head_before: ecc1daefe6b7dc969087818ffa28702717d708fd

tech-stack:
  added: []
  patterns:
    - Metadata e dados estruturados como projeções puras do mesmo artigo publicado
    - Imagem social gerada por rota de metadata do Next sem fetch remoto
    - Sitemap e RSS alimentados exclusivamente pelas queries editoriais publicáveis
    - Serialização segura por contexto para JSON-LD e XML

key-files:
  created:
    - "app/blog/[slug]/opengraph-image.tsx"
    - tests/editorial/discovery-outputs.test.ts
  modified:
    - "app/blog/[slug]/page.tsx"
    - lib/editorial/structured-data.ts
    - lib/editorial/feed.ts
    - app/sitemap.ts
    - app/blog/rss.xml/route.ts
    - tests/editorial/tracer.test.ts

key-decisions:
  - "Cada artigo fornece o objeto Open Graph e Twitter completo, sem depender do shallow merge do layout."
  - "Canonical, imagem social, autoria e datas são derivados do registro editorial validado e reutilizados por metadata e JSON-LD."
  - "Hubs usam a maior modifiedAt real entre seus artigos publicados; nenhum timestamp de build representa atualização editorial."
  - "O RSS ordena uma cópia da entrada, preserva o chamador e usa a canonical absoluta como link e GUID."

patterns-established:
  - "Discovery identity matrix: metadata, schema, sitemap e RSS são comparados data-driven para todo artigo publicado."
  - "Context-aware escaping: JSON-LD substitui < por \\u003c e RSS escapa caracteres XML em todos os campos interpolados."

requirements-completed: [BLOG-03, BLOG-07]

coverage:
  - id: D1
    description: "Os três artigos publicam metadata, canonical, Open Graph, Twitter, Article e BreadcrumbList com a mesma identidade editorial"
    requirement: BLOG-03
    verification:
      - kind: integration
        ref: "tests/editorial/discovery-outputs.test.ts#projects coherent metadata and structured data for every published article"
        status: pass
      - kind: other
        ref: "npm run typecheck"
        status: pass
      - kind: other
        ref: "npm run check (116 testes e build das três rotas SSG e da rota de imagem OG)"
        status: pass
    human_judgment: true
    rationale: "Rich Results Test, Schema Markup Validator e preview Open Graph ainda precisam ser inspecionados em preview autorizado; o fechamento local não declara essa validação externa como concluída."
  - id: D2
    description: "Sitemap e RSS projetam somente artigos e hubs publicados, com datas reais, ordem determinística e canonical idêntica ao GUID"
    requirement: BLOG-03
    verification:
      - kind: integration
        ref: "tests/editorial/discovery-outputs.test.ts#projects deterministic published sitemap and RSS with safe escaping"
        status: pass
      - kind: integration
        ref: "tests/editorial/tracer.test.ts#exposes the canonical article through sitemap and RSS"
        status: pass
    human_judgment: false
  - id: D3
    description: "JSON-LD não contém < e o RSS escapa ampersand, sinais, aspas e Unicode sem expor draft ou publicação futura"
    requirement: BLOG-03
    verification:
      - kind: integration
        ref: "tests/editorial/discovery-outputs.test.ts"
        status: pass
    human_judgment: false
  - id: D4
    description: "Os três slugs históricos permanecem em metadata, sitemap, RSS e build SSG"
    requirement: BLOG-07
    verification:
      - kind: integration
        ref: "tests/editorial/migration-parity.test.ts"
        status: pass
      - kind: other
        ref: "npm run check"
        status: pass
    human_judgment: false

duration: 8 min
completed: 2026-09-23
status: complete
---

# Phase 06 Plan 05: Descoberta editorial coerente e segura Summary

**Metadata, imagem social, JSON-LD, sitemap e RSS agora projetam a mesma identidade publicada dos três artigos, com datas verdadeiras e escaping por contexto**

## Performance

- **Duration:** 8 min de retomada e auditoria; implementação concluída antes da interrupção do orquestrador
- **Started:** 2026-09-23T21:10:22Z
- **Completed:** 2026-09-23T21:18:31Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Completou metadata única para cada artigo com canonical, robots, autor, Open Graph `article`, Twitter e imagem social específica gerada de dados editoriais aprovados.
- Alinhou `Article` e `BreadcrumbList` à UI e à metadata, incluindo canonical, pessoa autora, publisher global, imagem e datas de publicação/modificação.
- Fez sitemap e RSS consumirem a projeção publicável, preservando os três slugs históricos, excluindo draft/futuro e evitando freshness fabricada para conteúdo editorial.
- Protegeu os dois contextos de serialização: JSON-LD sem `<` literal e XML com escaping de caracteres adversariais.

## Task Commits

As duas tarefas TDD foram concluídas antes da interrupção do orquestrador:

1. **Task 1 RED: matriz de identidade metadata/schema/OG** - `9aed723` (test)
2. **Task 1 GREEN: metadata, schema, datas visíveis e imagem social** - `c9e8ce8` (feat)
3. **Task 2 RED: matriz de sitemap, RSS, filtro e escaping** - `0eabbe6` (test)
4. **Task 2 GREEN: projeções publicadas de sitemap e RSS** - `e41566e` (feat)
5. **Auto-fix: tracer distingue hubs publicados de artigos** - `1132663` (fix)

O ledger compartilhado mediu 14 commits desde `plan_head_before`; cinco pertencem ao 06-05 e os demais foram commits intercalados de outros planos executados na mesma branch.

## Files Created/Modified

- `app/blog/[slug]/opengraph-image.tsx` - Gera a arte social 1200x630 a partir do título, resumo e cluster validados.
- `app/blog/[slug]/page.tsx` - Projeta metadata completa, JSON-LD seguro e datas editoriais visíveis.
- `lib/editorial/structured-data.ts` - Centraliza imagem social, Article, BreadcrumbList e serialização JSON-LD segura.
- `lib/editorial/feed.ts` - Ordena sem mutar a entrada e serializa RSS com XML escapado e canonical como GUID.
- `app/sitemap.ts` - Inclui hubs e artigos publicados com `modifiedAt` editorial verdadeiro.
- `app/blog/rss.xml/route.ts` - Entrega o feed gerado da query publicável com Content-Type preservado.
- `tests/editorial/discovery-outputs.test.ts` - Exercita identidade, datas, filtros, ordem e payloads adversariais.
- `tests/editorial/tracer.test.ts` - Diferencia URLs de hubs e artigos na projeção publicada.

## Decisions Made

- A rota de imagem social usa apenas conteúdo do registro validado e tokens locais da marca, sem rede, asset remoto ou claim adicional.
- A metadata aninhada é completa por artigo porque o Next substitui objetos como `openGraph` em vez de fazer merge profundo.
- A data do hub é a maior `modifiedAt` de seus artigos publicados; páginas institucionais mantêm sua política separada.
- `priority` e `changeFrequency` não foram adicionados às entradas editoriais como suposto sinal de ranking.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tracer passou a separar hubs publicados de artigos**
- **Found during:** Task 2, após incluir hubs no sitemap.
- **Issue:** O tracer tratava toda URL abaixo de `/blog/` como artigo e deixou de refletir a projeção pública quando os hubs aprovados entraram no sitemap.
- **Fix:** Derivou conjuntos independentes de URLs de hubs e artigos pelas queries canônicas e comparou cada grupo com sua data editorial real.
- **Files modified:** `tests/editorial/tracer.test.ts`
- **Verification:** `npm test -- tests/editorial/discovery-outputs.test.ts tests/editorial/migration-parity.test.ts tests/editorial/tracer.test.ts` e `npm run check` passaram.
- **Committed in:** `1132663`

---

**Total deviations:** 1 auto-fix (1 bug)
**Impact on plan:** A correção mantém o tracer coerente com o novo sitemap sem ampliar o comportamento de produção.

## Issues Encountered

- O orquestrador foi interrompido depois dos cinco commits de implementação. A retomada auditou os commits e o estado final sem reexecutar nem duplicar tarefas.
- O ledger do 06-05 é compartilhado com planos concorrentes; por isso o contador mecânico registra 14 commits, enquanto a lista de commits próprios acima contém cinco.
- A validação externa em Rich Results Test, Schema Markup Validator e preview Open Graph não foi executada porque depende de preview autorizado. Ela permanece explicitamente roteada para julgamento humano e não foi contada como aprovação.

## TDD Gate Compliance

- Task 1 preserva a sequência RED `9aed723` antes do GREEN `c9e8ce8`.
- Task 2 preserva a sequência RED `0eabbe6` antes do GREEN `e41566e`.
- Não houve commit de refactor separado; o ajuste posterior `1132663` corrige o tracer afetado pela expansão do sitemap.

## Known Stubs

None. O array vazio do tracer é um acumulador de eventos de teste e o objeto vazio de opções do feed é o default intencional da API, não conteúdo incompleto enviado à UI.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Os consumidores de descoberta já compartilham canonical, autoria, imagens e datas do registro publicado.
- O preview externo de schema e compartilhamento permanece como UAT autorizada; não bloqueia os gates locais, mas não deve ser descrito como validado até haver evidência humana.
- Nenhuma dependência, integração real, redirect ou alteração de infraestrutura foi introduzida.

## Self-Check: PASSED

- O resumo e os oito arquivos de implementação/teste existem no disco.
- Os cinco commits próprios do 06-05 estão presentes e são ancestrais de `HEAD`.
- O classificador de cobertura aceitou os quatro entregáveis sem erro; três têm prova automática e um permanece corretamente roteado para julgamento humano.
- `git diff --check` não encontrou erro no resumo nem no registro da verificação externa pendente.

---
*Phase: 06-sistema-editorial-seo-geo-e-llm*
*Completed: 2026-09-23*
