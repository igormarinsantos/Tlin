# Roadmap: Tlin — Otimização Contínua do Funil Comercial

## Overview

Este roadmap evolui uma LP já posicionada em cinco fatias verticais: primeiro torna o resultado comercial mensurável, depois melhora o momento pós-conversão, prova visualmente a operação, esclarece planos e, por fim, abre espaço para otimização de mensagem por origem. Cada fase produz uma capacidade observável do funil sem reconstruir a base existente.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Medição Comercial do Funil** - Conecta origem, lead, demo e resultado comercial em uma taxonomia útil.
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

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Medição Comercial do Funil | 0/TBD | Not started | - |
| 2. Pós-conversão de Alta Intenção | 0/TBD | Not started | - |
| 3. Como Funciona — Prova da Operação | 0/TBD | Not started | - |
| 4. Planos e Caminho de Fit | 0/TBD | Not started | - |
| 5. Otimização por Origem | 0/TBD | Not started | - |

## Backlog

### Phase 999.1: Configuração operacional do Deskcomm (BACKLOG)

**Goal:** Concluir a configuração do CRM que não pode ser inventada pela landing: estágios, segredo da fonte de captação, resposta com identificador e webhook de saída para o backup.
**Requirements:** FUN-03
**Plans:** 0 plans

Plans:
- [ ] Criar/revisar os estágios e automações no Deskcomm; configurar e validar o webhook de retorno antes de promover esta pendência novamente.
