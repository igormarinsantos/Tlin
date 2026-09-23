# Fase 6 — sistema editorial SEO, GEO e LLM

Gate final executado localmente em 23/09/2026 sobre a branch
`codex/lps-segmentadas-v2`, com base no commit
`9e7e1e092cc2b2ab2187304abc1ff4fb14e7fabb`.

## Estado da validação

- **Automação local:** PASS
- **Smoke HTTP local do build de produção:** PASS
- **Inspeção humana de acessibilidade e aparência:** BLOCKED, sem evidência humana nesta execução
- **Schema e Open Graph em ferramenta externa:** BLOCKED, sem preview público autorizado
- **GA4 e Search Console:** BLOCKED, sem acesso aos consoles e sem publicação autorizada
- **Política de crawlers de treinamento:** BLOCKED, aguardando decisão explícita do owner
- **Integração comercial real:** adiada; nenhum lead, e-mail, reserva ou migration remota foi executado

O código e os contratos locais estão verdes, mas a fase não recebe sign-off
operacional enquanto os checkpoints humanos e externos obrigatórios continuarem
sem evidência. Build, schema local, `llms.txt`, contagem de palavras, densidade de
palavras-chave ou estrutura de blocos não garantem indexação, rich result,
ranking, inclusão ou citação por modelos.

## Condições de execução

- Node.js `24.13.0`, Next.js `16.3.5`, Vitest `3.2.4`
- Build e servidor local; nenhuma URL de produção ou preview foi alterada
- Transportes comerciais simulados pelos testes existentes
- Nenhum segredo, payload pessoal ou evento de lead foi enviado a terceiros
- `.env.local` foi preservado e não entra nesta evidência
- `robots.ts` permaneceu sem diff desde a base do plano

## Evidências automatizadas

| Comando | Resultado real | O que prova | O que não prova |
| --- | --- | --- | --- |
| `npm test -- tests/editorial` | PASS, 7 arquivos e 64 testes, código 0 | Contrato, governança, descoberta, arquitetura, atribuição, tracer e paridade editorial | Aparência, screen reader, consoles externos ou indexação |
| `npm run check` | PASS, typegen/typecheck; lint com 0 erros, 121 avisos conhecidos e nenhuma regressão; 25 arquivos e 148 testes; build de 39 páginas, código 0 | Tipos, orçamento de lint, suíte integral e build de produção | CRM, SMTP, agenda, GA4, Search Console ou rich result reais |
| `git diff --check` | PASS, código 0 | Ausência de erro de whitespace no diff atual | Correção funcional |
| `npm test -- tests/editorial/governance.test.ts tests/editorial/discovery-outputs.test.ts tests/editorial/analytics-attribution.test.ts` | PASS, 3 arquivos e 29 testes, código 0 | Contratos focalizados do UAT editorial, saídas públicas e atribuição simulada | Julgamento factual, visual ou configuração externa |
| build local com `NEXT_PUBLIC_SITE_URL=https://tlin.ia.br` | PASS, 39 páginas geradas | Projeção estática com o domínio canônico controlado, sem deploy | Estado da Vercel ou conteúdo publicado atualmente |

O `npm run check` usou o ambiente local existente. Para o smoke de canonicals e
saídas LLM, o build foi repetido com `NEXT_PUBLIC_SITE_URL=https://tlin.ia.br`
somente no processo. Isso é necessário porque o serializer de LLM rejeita, por
segurança, canonicals HTTP; o valor local `http://localhost:3000` não representa
o artefato de produção. O arquivo `.env.local` não foi editado.

## Cobertura dos requisitos

| Requisito | Planos responsáveis | Evidência executada | Estado |
| --- | --- | --- | --- |
| BLOG-01 | 06-01, 06-02, 06-03, 06-04 | `content-contract`, `tracer`, `migration-parity`, typecheck e build | PASS local |
| BLOG-02 | 06-02, 06-06 | `information-architecture`, HTML SSR/SSG e smoke de hubs | PASS local; acessibilidade humana BLOCKED |
| BLOG-03 | 06-01, 06-02, 06-05, 06-06, 06-11 | `discovery-outputs`, `tracer`, sitemap, RSS, schema e saídas LLM | PASS local; validadores externos BLOCKED |
| BLOG-04 | 06-03, 06-10 | `content-contract` e `governance` | PASS técnico; julgamento factual/comercial continua humano |
| BLOG-05 | 06-10, 06-11 | `governance` e `discovery-outputs` | PASS técnico; distribuição real não executada |
| BLOG-06 | 06-07, 06-08, 06-09 | `analytics-attribution`, testes de rotas/adapters/PGlite e suíte integral | PASS simulado; GA4/CRM real BLOCKED ou adiado |
| BLOG-07 | 06-01 a 06-05 | fixture independente, `migration-parity`, build SSG e smoke dos três slugs | PASS estrutural; comparação visual humana BLOCKED |

## Três URLs históricas

Smoke feito contra `next start` local sobre o build com domínio canônico
controlado. Cada rota respondeu diretamente com `200`, sem header `Location`.

| Slug | Canonical gerado | HTML bruto |
| --- | --- | --- |
| `agentes-de-ia-no-whatsapp-para-vendas` | `https://tlin.ia.br/blog/agentes-de-ia-no-whatsapp-para-vendas` | H1, autor, sumário, links e CTA presentes |
| `como-avaliar-novos-modelos-de-ia-para-negocios` | `https://tlin.ia.br/blog/como-avaliar-novos-modelos-de-ia-para-negocios` | H1, autor, sumário, links e CTA presentes |
| `playbook-qualificacao-leads-whatsapp` | `https://tlin.ia.br/blog/playbook-qualificacao-leads-whatsapp` | H1, autor, sumário, links e CTA presentes |

O build listou as três rotas como SSG. Essa evidência comprova resolução local
direta e estrutura server-rendered; não comprova cache/CDN, indexação ou a versão
atualmente publicada na Vercel.

## Saídas públicas

O smoke local retornou `200` para `/blog`, os dois hubs publicados, o perfil de
autor, `/sitemap.xml`, `/blog/rss.xml`, `/robots.txt`, `/llms.txt` e
`/llms-full.txt`.

- Sitemap e RSS contêm os três slugs
- `llms.txt` e `llms-full.txt` contêm os mesmos três slugs e o aviso de que não
  garantem ranking, inclusão ou citação
- `robots.txt` aponta para `https://tlin.ia.br/sitemap.xml` no build controlado
- `robots.txt` continua permitindo busca/fetch e os agentes nomeados já
  existentes; nenhuma política foi alterada neste plano
- RSS preserva `application/rss+xml; charset=utf-8`; saídas LLM preservam
  `text/plain; charset=utf-8`

## Limites e riscos

- A automação valida coerência de dados e estrutura, não qualidade editorial,
  verdade de claims, originalidade ou adequação comercial
- O HTML bruto demonstra conteúdo sem depender de hidratação, mas não substitui
  navegação por teclado, screen reader, foco visível ou revisão em aparelho real
- O build local não prova configuração de custom dimensions, entrega de eventos,
  cobertura do sitemap, queries, backlinks ou indexação
- A migration editorial foi testada com PGlite e permanece não aplicada nesta
  execução; correlação operacional Deskcomm/Supabase continua adiada
- `llms.txt`, `llms-full.txt`, schema e técnicas de chunking são superfícies
  complementares, não garantias de descoberta ou citação
- A política de crawler de busca/fetch é distinta da permissão para treinamento;
  qualquer mudança de `GPTBot`, `Google-Extended` ou agentes equivalentes exige
  decisão explícita do owner

## Operações que não ocorreram

Nenhum lead, e-mail, agendamento, webhook, migration externa, publicação em canal
de terceiros, deploy, push ou merge foi executado. Nenhuma regra de produção,
propriedade GA4 ou propriedade Search Console foi alterada.

## Relação com o mapa Nyquist

O estado por task, os arquivos realmente existentes e os bloqueios manuais estão
em [06-VALIDATION.md](../../.planning/phases/06-sistema-editorial-seo-geo-e-llm/06-VALIDATION.md).
`nyquist_compliant` permanece `false` enquanto os checkpoints obrigatórios de
julgamento e consoles externos não tiverem evidência ou uma aceitação explícita
do responsável.
