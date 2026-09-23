---
phase: "06-sistema-editorial-seo-geo-e-llm"
reviewed: "2026-09-23T23:54:44Z"
depth: standard
files_reviewed: 57
files_reviewed_list:
  - "content/editorial/authors.ts"
  - "content/editorial/taxonomy.ts"
  - "lib/editorial/types.ts"
  - "lib/editorial/validate.ts"
  - "lib/editorial/structured-data.ts"
  - "lib/editorial/feed.ts"
  - "tests/editorial/fixtures/legacy-articles.ts"
  - "tests/editorial/content-contract.test.ts"
  - "tests/editorial/migration-parity.test.ts"
  - "content/editorial/articles/agentes-de-ia-no-whatsapp-para-vendas.ts"
  - "lib/editorial/registry.ts"
  - "lib/editorial/queries.ts"
  - "components/blog/EditorialCta.tsx"
  - "app/blog/temas/[cluster]/page.tsx"
  - "tests/editorial/tracer.test.ts"
  - "app/blog/[slug]/page.tsx"
  - "app/sitemap.ts"
  - "app/blog/rss.xml/route.ts"
  - "content/editorial/articles/como-avaliar-novos-modelos-de-ia-para-negocios.ts"
  - "content/editorial/articles/playbook-qualificacao-leads-whatsapp.ts"
  - "app/blog/page.tsx"
  - "components/blog/ArticleCard.tsx"
  - "components/blog/BlogSearchAndGrid.tsx"
  - "components/blog/FeaturedCarousel.tsx"
  - "components/blog/categoryVisuals.ts"
  - "app/blog/[slug]/opengraph-image.tsx"
  - "tests/editorial/discovery-outputs.test.ts"
  - "app/blog/autores/[author]/page.tsx"
  - "tests/editorial/information-architecture.test.ts"
  - "lib/editorial/analytics.ts"
  - "tests/editorial/analytics-attribution.test.ts"
  - "lib/analytics-events.ts"
  - "lib/utm.ts"
  - "components/UTMTracker.tsx"
  - "components/QualificationController.tsx"
  - "components/blog/ShareBar.tsx"
  - "tests/analytics-events.test.ts"
  - "supabase/migrations/20260923_editorial_attribution.sql"
  - "app/api/leads/capture/route.ts"
  - "app/api/notify/route.ts"
  - "lib/deskcomm-leads.ts"
  - "lib/supabase-leads.ts"
  - "tests/deskcomm-leads.test.ts"
  - "tests/notify-route.test.ts"
  - "tests/funnel-database.test.ts"
  - "app/api/internal/funnel/route.ts"
  - "app/internal/funnel/page.tsx"
  - "tests/funnel-report-route.test.ts"
  - "docs/editorial/README.md"
  - "docs/editorial/content-brief.md"
  - "docs/editorial/quality-checklist.md"
  - "docs/editorial/distribution.md"
  - "tests/editorial/governance.test.ts"
  - "lib/editorial/llms.ts"
  - "app/llms.txt/route.ts"
  - "app/llms-full.txt/route.ts"
  - "docs/quality/phase-6-editorial-system.md"
findings:
  critical: 6
  warning: 9
  info: 0
  total: 15
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-09-23T23:54:44Z  
**Depth:** standard  
**Files Reviewed:** 57  
**Status:** issues_found

## Summary

Foram revisados todos os 57 arquivos existentes declarados em `key-files.created` e `key-files.modified` pelos resumos 06-01 a 06-12, excluindo os próprios artefatos de planejamento e respeitando as remoções declaradas. Os 148 testes verdes documentados pela fase são um sinal útil, mas não cobrem vários caminhos adversariais abaixo.

A implementação tem seis defeitos bloqueantes: aceita falsa atualização futura, atribui visitas de hub a artigos não visitados, envia e-mails de sucesso sem reserva, persiste campos arbitrários do cliente, registra PII em logs e pode sobrescrever o first touch apesar do fallback redundante. Há ainda nove riscos de robustez e governança em relatório, identidade de autor, RSS, LLM, sitemap, instrumentação e datas.

## Critical Issues

### CR-01: [BLOCKER] `modifiedAt` futuro é aceito e publicado como atualização real

**File:** `lib/editorial/validate.ts:143-158`  
**Evidence:** A validação rejeita `publishedAt` futuro na linha 149 e verifica a ordem entre as datas, mas nunca rejeita `modifiedAt > now`. Esse valor segue para `dateModified` no schema (`lib/editorial/structured-data.ts:108-110`), para `modifiedTime` e para a data visível do artigo (`app/blog/[slug]/page.tsx:62-63,141-143`) e para `lastModified` do sitemap (`app/sitemap.ts:15-18`). Assim, um erro editorial pode publicar uma atualização futura e gerar sinal falso de frescor para usuário, crawler e consumidor LLM. Os testes cobrem publicação futura, não modificação futura.  
**Fix:** Adicionar em `validateDates` uma falha específica quando `modifiedAt` for posterior ao instante de validação, usando a mesma política temporal de `publishedAt`, e criar teste de contrato que confirme a rejeição e impeça a propagação para schema/sitemap.

### CR-02: [BLOCKER] CTA do hub fabrica atribuição a um artigo que o visitante não abriu

**File:** `app/blog/temas/[cluster]/page.tsx:62,142-147`  
**Evidence:** O hub escolhe o artigo mais recente como `leadArticle` e passa slug, cluster, intenção e variante desse artigo ao `EditorialCta`. O componente transforma isso em `/blog/{slug}` e grava o touch (`components/blog/EditorialCta.tsx:32-34`), embora a página visitada tenha sido `/blog/temas/{cluster}`. O modelo de atribuição só admite caminho de artigo (`lib/editorial/analytics.ts:110-139`), e o controlador reaproveita o touch falso ao abrir o funil (`components/QualificationController.tsx:34-36`). O artigo creditado também muda quando outro texto se torna o mais recente.  
**Fix:** Modelar explicitamente a origem `article | cluster_hub` (ou permitir touch editorial sem `article_slug`), persistir a URL real do hub e só preencher `article_slug` depois de uma visita real ao artigo. Adicionar teste de jornada direta hub → CTA → captura assegurando que nenhum artigo receba crédito.

### CR-03: [BLOCKER] E-mails de confirmação são enviados quando a demo falha, fica pendente ou nem é tentada

**File:** `app/api/notify/route.ts:156-175,177-244`  
**Evidence:** O resultado da reserva pode ser recusado, incerto ou não tentado nas linhas 156-175, mas o bloco SMTP roda incondicionalmente antes de `success` ser calculado na linha 244. O template afirma “Bem-vindo”, informa recebimento bem-sucedido e diz que a equipe analisará uma demonstração personalizada (`lib/emailTemplates.ts:95,111,146`). Os testes de falha e estado pendente (`tests/notify-route.test.ts:117-129`) não habilitam SMTP nem verificam ausência de e-mail, portanto deixam a regressão passar.  
**Fix:** Enviar a confirmação ao lead somente após `demoBooking.booked === true`. Se a equipe precisar de alerta em falha/pending, usar template interno separado que explicite o estado. Cobrir `refused`, `pending` e `not attempted` com SMTP simulado e asserção de zero e-mails de sucesso.

### CR-04: [BLOCKER] Corpo arbitrário da requisição é persistido no Supabase

**File:** `app/api/notify/route.ts:113-115,150`  
**Evidence:** `mirroredPayload` é construído por spread de todo o JSON fornecido pelo cliente e só remove `turnstileToken`; depois é persistido. `lib/supabase-leads.ts:112-121` encaminha esse objeto e a migration o insere/mescla integralmente (`supabase/migrations/20260923_editorial_attribution.sql:38,53`). Um cliente pode assim gravar campos não previstos, objetos aninhados, segredos ou PII adicional no JSON de leads. O teste existente sanitiza valores dentro de `utm` (`tests/notify-route.test.ts:64-94`), mas não prova que campos top-level desconhecidos sejam descartados.  
**Fix:** Construir o payload persistido a partir de uma allowlist de campos normalizados e limitados, em vez de copiar `data`; omitir tokens e qualquer dado não necessário. Criar teste com campos top-level como `password`, `message` e objetos aninhados, exigindo que não cheguem ao adaptador Supabase.

### CR-05: [BLOCKER] Logs de produção expõem o e-mail do lead e metadados SMTP

**File:** `app/api/notify/route.ts:225-231`  
**Evidence:** O log de sucesso inclui explicitamente `mailOptions.to`, que é o endereço do lead. Os logs seguintes imprimem objetos de resposta SMTP, que normalmente incluem envelope e destinatários. Isso amplia a retenção de PII para a infraestrutura de logs e contraria a regra de minimização documentada para interfaces futuras (`docs/editorial/distribution.md:70-72`).  
**Fix:** Trocar por log estruturado sem destinatário nem resposta SMTP completa, contendo apenas identificador interno/capture ID, tipo de envio e resultado booleano ou código não identificável. Adicionar teste ou regra estática que impeça `email`, `to`, envelope e payload de autenticação nos logs.

### CR-06: [BLOCKER] Fallback redundante de UTM pode sobrescrever o first touch válido

**File:** `lib/utm.ts:141-173`  
**Evidence:** `loadStoredUtm` retorna `null` imediatamente quando o valor de `localStorage` é parseável porém inválido/expirado (linhas 141-151), sem tentar o cookie. Em seguida, `captureUtms` interpreta a ausência como first touch inexistente e o sobrescreve (linhas 169-173), mesmo que o cookie ainda contenha um first touch válido. Isso viola a garantia explícita de que first touch nunca é sobrescrito (linhas 157-160) e corrompe atribuição de aquisição. A suíte não cobre camadas divergentes, apenas expiração sem um cookie válido independente.  
**Fix:** Retornar somente quando o valor local for válido; se não for, removê-lo e continuar para o cookie. Adicionar teste com localStorage expirado + cookie válido e confirmar que uma nova campanha não substitui o first touch.

## Warnings

### WR-01: [WARNING] Período padrão do relatório usa UTC apesar de prometer dias civis de São Paulo

**File:** `app/internal/funnel/page.tsx:47-48,83`  
**Evidence:** As datas padrão são obtidas por `toISOString().slice(0, 10)`, portanto entre 21:00 e 23:59 em São Paulo podem apontar para o dia seguinte. A própria UI declara fuso de São Paulo e as coortes SQL usam `America/Sao_Paulo` (`supabase/migrations/20260923_editorial_attribution.sql:105`). O painel pode abrir com um intervalo diferente do período anunciado.  
**Fix:** Gerar o dia civil via `Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" })` e subtrair dias no mesmo referencial; adicionar teste com horário no limiar UTC/BRT.

### WR-02: [WARNING] A mesma pessoa recebe duas identidades canônicas incompatíveis

**File:** `content/editorial/authors.ts:8`  
**Evidence:** O registro define `profileUrl` como `/como-funciona`, e o artigo/JSON-LD o usa como URL do autor (`app/blog/[slug]/page.tsx:41-54`; `lib/editorial/structured-data.ts:111-115`). Já a UI liga o nome a `/blog/autores/igor-marin` (`app/blog/[slug]/page.tsx:81-83,133-139`), e a página de autor cria outro nó canônico `Person/ProfilePage`. Crawlers recebem duas identidades para o mesmo autor e o teste apenas cristaliza a URL antiga.  
**Fix:** Tornar a página `/blog/autores/{slug}` a URL canônica do autor em todos os consumidores; se `/como-funciona` for relevante, representá-la como `sameAs` ou vínculo secundário. Atualizar os testes para exigir uma única identidade.

### WR-03: [WARNING] Escaping do RSS não remove caracteres proibidos pelo XML 1.0

**File:** `lib/editorial/feed.ts:10-16`  
**Evidence:** O escape cobre apenas `&`, `<`, `>`, aspas e apóstrofo. Caracteres de controle como U+0000/U+000B em título, resumo ou texto deixam o XML malformado; a validação editorial não os proíbe. O serializador LLM já remove controles (`lib/editorial/llms.ts:112-121`), mas o feed não.  
**Fix:** Antes do escape, filtrar para o conjunto de code points válidos em XML 1.0 (incluindo tratamento de surrogate inválido) e adicionar testes adversariais que façam parse real do RSS gerado.

### WR-04: [WARNING] Checklist declara gates automatizados que o modelo e o validador não conseguem aplicar

**File:** `docs/editorial/quality-checklist.md:17-20`  
**Evidence:** O documento afirma que claims estruturados referenciam fontes e que gatilho, cadência e motivo de atualização são gates automáticos. Porém `lib/editorial/types.ts:83-101` não modela claims, cadência, gatilho nem motivo, e `lib/editorial/validate.ts:248-292` só verifica fontes, contribuição e aprovações. `tests/editorial/governance.test.ts:39-104` valida sobretudo presença de texto nos documentos, podendo ficar verde enquanto a política é inexequível.  
**Fix:** Ou adicionar campos tipados e validações executáveis para essas regras, ou classificá-las honestamente como revisão humana/PR. Fazer os testes operarem sobre artigos e resultados do validador, não apenas sobre frases da documentação.

### WR-05: [WARNING] Texto editorial pode injetar estrutura Markdown nas saídas LLM

**File:** `lib/editorial/llms.ts:112-121,173-174`  
**Evidence:** A sanitização remove HTML, protocolos e controles, mas parágrafos são emitidos diretamente como linhas Markdown. Um parágrafo iniciado por `#`, `>`, `-` ou `1.` vira título, citação ou lista e pode simular uma nova seção/instrução no corpus. O teste adversarial atual coloca o marcador depois de texto e newline, que é colapsado, então não cobre marcador no primeiro caractere (`tests/editorial/discovery-outputs.test.ts:256-299`).  
**Fix:** Escapar ou prefixar marcadores estruturais no início de cada bloco de texto livre, ou serializar conteúdo em um formato delimitado sem interpretação Markdown. Adicionar casos cujo primeiro caractere seja cada marcador estrutural.

### WR-06: [WARNING] Sitemap renova artificialmente a home do blog em toda build

**File:** `app/sitemap.ts:6,87-91`  
**Evidence:** `now = new Date()` é usado como `lastModified` de `/blog`. Qualquer build, mesmo sem alteração editorial, informa aos crawlers que a página acabou de mudar. Isso enfraquece o sinal de frescor que a fase tenta tornar factual, enquanto as URLs de artigo e hub já têm datas baseadas no conteúdo.  
**Fix:** Calcular `lastModified` da home do blog pelo maior `modifiedAt` publicado (ou pela data de uma mudança editorial real explicitamente versionada) e cobrir o valor com teste determinístico.

### WR-07: [WARNING] Observador de formulários não enxerga formulários montados dentro da árvore React

**File:** `components/UTMTracker.tsx:54-72`  
**Evidence:** O `MutationObserver` observa `document.body` com `subtree: false`. Ele só recebe filhos adicionados diretamente ao body; um formulário montado dinamicamente sob um container React existente não dispara o callback, apesar de o código tentar procurar `form` dentro dos nós adicionados. Formulários modais ou tardios podem ficar sem os campos ocultos de UTM.  
**Fix:** Observar com `subtree: true` e limitar/deduplicar a instrumentação por formulário, ou centralizar a inclusão de UTM no componente de formulário. Criar teste que adicione um formulário dentro de um descendente já existente.

### WR-08: [WARNING] Contrato permite `cta.href`, mas o CTA editorial ignora o destino aprovado

**File:** `components/blog/EditorialCta.tsx:32-63`  
**Evidence:** O tipo e o validador aceitam destinos internos/HTTPS (`lib/editorial/types.ts:47-51`), mas o componente sempre abre o fluxo de qualificação e nunca usa `cta.href`. Os CTAs atuais com `/demo` mascaram o problema; um CTA futuro validado para outra página ou proprietário continuará abrindo o popup errado.  
**Fix:** Fazer o componente honrar `cta.href` conforme uma política explícita (abrir qualificação apenas para o destino correspondente) ou remover `href` do contrato e rejeitar qualquer valor não suportado. Adicionar teste para destino interno alternativo e URL HTTPS aprovada.

### WR-09: [WARNING] Data do artigo depende do fuso do servidor, enquanto cards fixam São Paulo

**File:** `app/blog/[slug]/page.tsx:286-291`  
**Evidence:** A página formata datas sem `timeZone`, mas `ArticleCard` fixa `America/Sao_Paulo` (`components/blog/ArticleCard.tsx:83-89`). Um timestamp próximo da meia-noite pode exibir dias diferentes no card e no artigo conforme o ambiente de build/runtime. Os conteúdos atuais ao meio-dia não exercitam o limite.  
**Fix:** Extrair um formatador editorial compartilhado com fuso explícito de São Paulo e testá-lo em instantes próximos à virada do dia.

---

_Reviewed: 2026-09-23T23:54:44Z_  
_Reviewer: the agent (gsd-code-reviewer)_  
_Depth: standard_
