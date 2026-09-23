# Roadmap: Tlin — Otimização Contínua do Funil Comercial

## Overview

Este roadmap evolui uma LP já posicionada em cinco fatias verticais: primeiro torna o resultado comercial mensurável, depois melhora o momento pós-conversão, prova visualmente a operação, esclarece planos e, por fim, abre espaço para otimização de mensagem por origem. Cada fase produz uma capacidade observável do funil sem reconstruir a base existente.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [~] **Phase 1: Medição Comercial do Funil** - Implementada e publicada; validação operacional CRM pendente aceita no backlog.
- [ ] **Phase 2: Pós-conversão de Alta Intenção** - Transforma a confirmação do formulário em continuidade de confiança e preparação para demo.
- [ ] **Phase 3: Como Funciona — Prova da Operação** - Mostra visualmente a jornada comercial com IA e acompanhamento humano.
- [ ] **Phase 4: Planos e Caminho de Fit** - Ajuda o visitante a entender a oferta e avançar para uma demo apropriada.
- [ ] **Phase 5: Otimização por Origem** - Permite testar mensagem e entrada sem duplicar o fluxo comercial.

## Phase Details

### Phase 1: Medição Comercial do Funil

**Goal**: A equipe consegue relacionar origem de aquisição a lead, demo, qualificação e venda, em vez de otimizar só pelo formulário.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FUN-01, FUN-02, FUN-03, OTIM-01
**Success Criteria** (what must be TRUE):

  1. Cada lead criado pela LP mantém informação de origem/campanha disponível no registro operacional.
  2. A equipe pode distinguir em seus dados lead gerado, demo agendada, lead qualificado e venda.
  3. Um canal de aquisição pode ser comparado por qualidade comercial e resultado, não apenas por submissões.

**Plans**:

- **Wave 1:** `01-01-PLAN.md` — Contrato e adaptador idempotente de captura Deskcomm (bloqueia na configuração real do CRM).
- **Wave 2** *(blocked on Wave 1 completion)*: `01-02-PLAN.md` — Fluxo Deskcomm-first, espelho Supabase e retorno seguro de estágios.

**Cross-cutting constraints:** Deskcomm é a fonte operacional; Supabase é somente espelho de backup e não dispara ações comerciais. Atribuição preserva first-touch como crédito primário e last-touch como contexto.
**UI hint**: yes

### Phase 2: Pós-conversão de Alta Intenção

**Goal**: Quem conclui a qualificação recebe uma experiência de obrigado que confirma o próximo passo e fortalece a intenção de comparecer à demo.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: OBR-01, OBR-02, OBR-03
**Success Criteria** (what must be TRUE):

  1. Após uma conclusão bem-sucedida, o visitante chega a uma página de obrigado dedicada em vez de apenas uma mensagem genérica no fluxo.
  2. A página deixa claro o status/próximo passo da demo e apresenta prova de valor com contexto suficiente para ser crível.
  3. O visitante pode iniciar uma conversa no WhatsApp se quiser, mas a página mantém a reunião agendada como ação principal.

**Plans**: TBD
**UI hint**: yes

### Phase 3: Como Funciona — Prova da Operação

**Goal**: Um visitante com volume de leads entende concretamente como a Tlin conduz a operação comercial e por que há acompanhamento humano.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: COMO-01, COMO-02, COMO-03
**Success Criteria** (what must be TRUE):

  1. O visitante pode acessar uma página “Como funciona” com uma demonstração visual guiada da jornada do lead.
  2. A demonstração deixa explícitos IA, CRM, follow-up, agendamento e os pontos de atuação da equipe humana.
  3. Um visitante que identifica fit encontra um caminho claro para a demo existente ao final da experiência.

**Plans**: TBD
**UI hint**: yes

### Phase 4: Planos e Caminho de Fit

**Goal**: Um visitante entende os caminhos de oferta da Tlin e consegue avançar para uma conversa comercial adequada ao seu contexto.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: PLAN-01, PLAN-02
**Success Criteria** (what must be TRUE):

  1. O visitante pode acessar uma página “Planos” que torna a proposta e o fit de cada caminho compreensíveis.
  2. Os caminhos de plano conduzem visitantes elegíveis para agendar uma demo, sem criar um fluxo paralelo de qualificação.
  3. A página mantém o foco em resultado operacional e fit, e não apenas em comparação de preços.

**Plans**: TBD
**UI hint**: yes

### Phase 5: Otimização por Origem

**Goal**: A LP pode evoluir mensagem e entrada por canal com hipóteses mensuráveis, preservando a mesma jornada de qualificação.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: OTIM-02
**Success Criteria** (what must be TRUE):

  1. A equipe pode criar futuras variações de mensagem ou entrada por origem sem copiar o fluxo de qualificação e agenda.
  2. Cada variante preserva tracking suficiente para ser comparada pelos resultados comerciais definidos na Phase 1.

**Plans**: TBD
**UI hint**: yes

### Phase 6: Sistema Editorial SEO, GEO e LLM

**Goal:** A Tlin opera um sistema editorial tecnicamente descobrível, confiável e mensurável que conquista demanda orgânica, sustenta citações em respostas generativas e conduz leitores com fit para demos qualificadas.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07
**Success Criteria** (what must be TRUE):

  1. A equipe publica e atualiza artigos com autoria, datas, fontes, imagens, taxonomia, links, CTA e dados estruturados consistentes, sem editar um array monolítico de JSX/texto.
  2. O blog possui arquitetura de hubs, clusters e interligação que cobre IA comercial, vendas no WhatsApp, qualificação, follow-up, agendamento e CRM nativo sem canibalizar as páginas comerciais.
  3. Artigos, hubs e feeds são renderizados, indexáveis, acessíveis e compreensíveis para mecanismos de busca e sistemas generativos, com metadados e marcação verificáveis.
  4. Cada conteúdo segue um processo de pesquisa, evidência, revisão, atualização e distribuição que proíbe estatísticas, experiências e URLs inventadas.
  5. A equipe mede descoberta, engajamento, cliques comerciais, demos, qualificação e vendas por conteúdo/origem, sem tratar tráfego ou formulário como resultado final.

**Plans:** 7/12 plans executed

Plans:

- [x] 06-01-PLAN.md
- [x] 06-02-PLAN.md
- [x] 06-03-PLAN.md
- [x] 06-04-PLAN.md
- [x] 06-05-PLAN.md
- [ ] 06-06-PLAN.md
- [x] 06-07-PLAN.md
- [x] 06-08-PLAN.md
- [ ] 06-09-PLAN.md
- [ ] 06-10-PLAN.md
- [ ] 06-11-PLAN.md
- [ ] 06-12-PLAN.md
- [ ] `06-01-PLAN.md` — fixar contratos, serializers seguros e baseline independente sem trocar consumidores públicos
- [ ] `06-02-PLAN.md` — provar o primeiro corte de produção D-13 com um slug existente, da fonte tipada até CTA e superfícies públicas
- [ ] `06-03-PLAN.md` — migrar os dois slugs restantes e fechar o registro canônico publicado
- [ ] `06-04-PLAN.md` — trocar listagem e detalhe do blog para consultas públicas e remover o monólito legado após paridade
- [ ] `06-05-PLAN.md` — projetar metadados, OG, JSON-LD seguro, sitemap e RSS a partir do registro canônico
- [ ] `06-06-PLAN.md` — entregar hubs, autoria, breadcrumbs e malha de links internos sem canibalização comercial
- [ ] `06-07-PLAN.md` — persistir primeiro e último toque editorial e instrumentar CTAs/compartilhamento com allowlist
- [ ] `06-08-PLAN.md` — transportar e persistir atribuição editorial no mesmo lead/CRM com first/last touch e serviços simulados
- [ ] `06-09-PLAN.md` — agregar a atribuição persistida no relatório comercial protegido por artigo, cluster e CTA
- [ ] `06-10-PLAN.md` — instituir governança editorial verificável sem automatizar julgamentos humanos
- [ ] `06-11-PLAN.md` — gerar superfícies LLM experimentais após as mutações finais de hubs/queries, sem promessas de ranking
- [ ] `06-12-PLAN.md` — executar a convergência final e checkpoints de autoria, crawler policy, schema, OG, acessibilidade, GA4 e Search Console

**Waves:** Wave 1: 06-01; Wave 2: 06-02; Wave 3: 06-03 e 06-07; Wave 4: 06-04, 06-05 e 06-08; Wave 5: 06-06, 06-09 e 06-10; Wave 6: 06-11; Wave 7: 06-12.
**UI hint:** yes

## Progress

**Execution Order:**
Phases 2 → 3 → 4 → 5 follow the conversion track. Phase 6 depends only on Phase 1 and may run in parallel with Phases 2–5.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Medição Comercial do Funil | 2/2 | Implemented — operational validation deferred | 2026-09-16 |
| 2. Pós-conversão de Alta Intenção | 0/TBD | Not started | - |
| 3. Como Funciona — Prova da Operação | 0/TBD | Not started | - |
| 4. Planos e Caminho de Fit | 0/TBD | Not started | - |
| 5. Otimização por Origem | 0/TBD | Not started | - |
| 6. Sistema Editorial SEO, GEO e LLM | 7/12 | In Progress|  |

## Backlog

### Phase 999.1: Configuração operacional do Deskcomm (BACKLOG)

**Goal:** Manter a configuração do CRM e concluir a validação operacional que não pode ser provada apenas pela landing.
**Requirements:** FUN-03
**Plans:** 0 plans

Plans:

- [x] Criar/revisar a fonte, automações e webhook de saída no Deskcomm; adicionar o segredo de retorno e a migration de backup.
- [ ] Disparar um lead real de teste e uma mudança de estágio; confirmar a atividade no Deskcomm e a projeção correlacionada no Supabase, sem novo lead ou nova agenda.
