# Phase 06: Sistema Editorial SEO, GEO e LLM - Context

**Gathered:** 2026-09-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Transformar o blog existente em um sistema completo de aquisição e autoridade para SEO, descoberta em respostas generativas e compreensão por modelos de linguagem. A fase cobre fundação técnica, arquitetura editorial, clusters, qualidade, distribuição, mensuração e governança. Não promete rankings, citações ou volume de leads e não publica conteúdo em massa sem evidência.

</domain>

<decisions>
## Implementation Decisions

### Escopo e resultado
- **D-01:** O escopo aprovado é um sistema completo, incluindo tecnologia, arquitetura de informação, clusters, produção, autoridade, distribuição, mensuração e governança.
- **D-02:** O resultado comercial continua sendo demos confirmadas com leads qualificados; tráfego, impressões e formulários são indicadores intermediários.
- **D-03:** A fase depende da medição comercial da Phase 1, mas pode ser executada em paralelo às Phases 2–5.

### Posicionamento e conteúdo
- **D-04:** O território editorial deve fortalecer “IA comercial” como categoria principal e tratar CRM nativo, follow-up e agendamento como capacidades de apoio.
- **D-05:** A arquitetura deve separar intenção informacional, comparação/avaliação e conversão, evitando que artigos canibalizem home e páginas de campanha.
- **D-06:** Conteýo deve ser people-first, sustentado por fontes e contribuição original. Não inventar pesquisas, benchmarks, clientes, experiências, integrações, resultados ou links.
- **D-07:** Extensão, quantidade de headings, links, imagens e palavras-chave devem decorrer da intenção e da utilidade, nunca de cotas mecânicas.

### Descoberta generativa
- **D-08:** GEO e descoberta por LLMs serão tratados como clareza de entidade, consistência factual, passagens citáveis, fontes, autoria, HTML acessível e distribuição; `llms.txt` é complementar, não um atalho de ranking.
- **D-09:** Recomendações devem distinguir práticas documentadas, hipóteses experimentais e itens sem garantia de impacto.

### Implementação e operação
- **D-10:** Preservar URLs e comportamento dos três artigos atuais durante a migração.
- **D-11:** Reutilizar o design system e os componentes visuais existentes; esta fase não abre um redesign autônomo do blog.
- **D-12:** O modelo editorial deve permitir publicação e revisão sustentáveis sem manter todo o acervo em um único array TypeScript.
- **D-13:** A primeira entrega deve ser um tracer vertical verificável: um artigo migrado atravessa o novo modelo, renderiza metadados/schema/feed/sitemap, participa de um cluster e mede CTA sem quebrar a URL existente.

</decisions>

<canonical_refs>
## Canonical References

- `AGENTS.md` — posicionamento, convenções, qualidade e limites operacionais.
- `README.md` — arquitetura e rotas atuais.
- `docs/quality/README.md` — checks e métrica comercial.
- `.planning/phases/01-medi-o-comercial-do-funil/01-CONTEXT.md` — contrato de medição do funil.
- `lib/blog.ts` — modelo monolítico atual e três artigos existentes.
- `app/blog/page.tsx` e `app/blog/[slug]/page.tsx` — listagem e template editorial atuais.
- `app/sitemap.ts`, `app/robots.ts` e `app/blog/rss.xml/route.ts` — descoberta e feed atuais.
- `public/llms.txt` e `public/llms-full.txt` — contexto generativo atual.
- `lib/structuredData.ts` — identidade e dados estruturados globais.

</canonical_refs>

<deferred>
## Deferred Ideas

- Publicação automática em canais de terceiros fica fora da primeira implementação; o plano deve definir o processo e pontos de integração antes de automatizar.
- Conteúdo em escala para PT/EN/ES fica adiado até existir autoridade e operação editorial consistente em português do Brasil.
- Claims de performance e estudos de caso dependem de dados reais, autorização e revisão comercial.

</deferred>
