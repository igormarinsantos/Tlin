# Phase 1: Medição Comercial do Funil - Context

**Gathered:** 2026-09-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Estabelecer a leitura comercial do funil da Tlin: preservar origem de aquisição, criar um lead operacional somente após WhatsApp utilizável, usar o formulário gamificado como SDR digital, e permitir que Deskcomm informe os estágios posteriores até venda. Esta fase prepara dados e integrações; não cria o relatório do Fernando nem reconstrói o CRM.

</domain>

<decisions>
## Implementation Decisions

### Fonte de verdade e estágios comerciais
- **D-01:** Deskcomm é a fonte de verdade dos estágios comerciais posteriores ao lead capturado: demo agendada, demo realizada, oportunidade qualificada, proposta enviada, venda ganha ou perdida. — **Reversibility:** costly — a mudança exige remapear histórico e a integração do relatório futuro.
- **D-02:** Deskcomm é a fonte de verdade operacional desde a criação do lead com WhatsApp utilizável. Supabase é um espelho secundário de backup e histórico; sua indisponibilidade não pode impedir a criação, atualização, automação ou agendamento no Deskcomm. — **Reversibility:** costly — exige reorientar o orquestrador atual e a leitura de dados já gravados.
- **D-03:** O relatório futuro do Fernando deve consumir a mesma estrutura de estágios, sem criar uma medição paralela.

### Qualificação e agenda do closer
- **D-04:** O formulário gamificado é o SDR digital: ele classifica fit antes de liberar agenda do closer.
- **D-05:** Apenas leads com fit aprovado podem acessar a agenda do closer. — **Reversibility:** costly — altera a promessa e o caminho de conversão já publicado.
- **D-06:** Quem informa WhatsApp mas não tem fit imediato entra no Deskcomm para nutrição/remarketing e fica marcado como “a desenvolver”, não como perdido.

### Captura e atribuição
- **D-07:** O evento de início do formulário é intenção analítica; um lead operacional só é criado após um WhatsApp utilizável ser informado.
- **D-08:** Lead com WhatsApp que abandona antes de concluir entra em remarketing via WhatsApp.
- **D-09:** A primeira origem recebe o crédito principal de aquisição; a última origem é armazenada como contexto de apoio. — **Reversibility:** costly — muda comparativos históricos por canal.

### the agent's Discretion
- A forma técnica de correlacionar LP, Supabase e Deskcomm fica a cargo do planejamento, desde que preserve os estágios e regras acima.
- A taxonomia exata de eventos no GA4/GTM pode seguir nomes recomendados e eventos customizados compatíveis com a estrutura de CRM.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Escopo e decisões de produto
- `.planning/PROJECT.md` — valor central, cliente, restrições e decisões do ciclo.
- `.planning/REQUIREMENTS.md` — requisitos FUN-01, FUN-02, FUN-03 e OTIM-01 vinculados à fase.
- `.planning/ROADMAP.md` §Phase 1 — objetivo, dependências e critérios observáveis da fase.
- `.planning/research/SUMMARY.md` §Phase 1 — recomendação de ciclo fechado e lacuna de contrato de dados de CRM.

### Fluxo e integrações existentes
- `components/LeadQualificationPopup.tsx` — formulário gamificado atual, envio de lead e escolha de agenda.
- `app/api/notify/route.ts` — orquestração atual de lead, webhook, agenda, Supabase e e-mail.
- `lib/utm.ts` — captura e persistência atuais de primeira e última origem.
- `lib/supabase-leads.ts` — persistência atual do lead e payload de atribuição.
- `lib/deskcomm-mcp.ts` — adaptador MCP atual para contato, disponibilidade e agendamento.
- `supabase/migrations/20260602210412_create_lead_form_submissions.sql` — esquema existente de lead e `notification_result`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/utm.ts`: já mantém first-touch e last-touch em localStorage/cookie e expõe `getUtmLeadPayload()`.
- `components/LeadQualificationPopup.tsx`: já tem os dados de volume, equipe, e-mail e slot de demo, e calcula `lead_score`/`lead_quality`.
- `app/api/notify/route.ts`: hoje persiste no Supabase antes de disparar o webhook Deskcomm, e só envia ao Deskcomm quando há demo; deve ser invertido nesta fase.
- `lib/supabase-leads.ts`: deve permanecer como espelho de backup, sem disparar ou governar ações comerciais.

### Established Patterns
- Integrações externas ficam em `lib/` e retornam unions com `ok`/`error`; handlers em `app/api/` validam o request primeiro.
- Dados sensíveis ficam em variáveis server-side; browser envia apenas dados de lead e atribuição.
- Para narrowing de resultados do Deskcomm, usar `result.ok === false`.

### Integration Points
- `POST /api/notify` é o ponto principal para criar/atualizar o lead operacional primeiro no Deskcomm e, depois, espelhar o resultado no Supabase.
- `lib/deskcomm-mcp.ts` pode receber novas operações de estágio somente depois de confirmar a capacidade real da API/MCP Deskcomm.
- `lib/utm.ts` e o payload salvo no Supabase são o ponto para preservar primeira/última origem.

</code_context>

<specifics>
## Specific Ideas

- O percurso desejado é: formulário iniciado → WhatsApp informado/criação de lead e remarketing possível → fit aprovado pelo SDR gamificado → agenda do closer → demo/proposta/venda no Deskcomm.
- A demonstração e o relatório futuro devem usar os mesmos significados de estágio, para não produzir números conflitantes.

</specifics>

<deferred>
## Deferred Ideas

- Sistema de relatórios do Fernando, semelhante a um UTMify — capacidade futura que deve consumir os dados desta fase; não construir nesta fase.
- Página de obrigado, “Como funciona” e “Planos” — pertencem às Phases 2, 3 e 4 respectivamente.

</deferred>

---

*Phase: 1-Medição Comercial do Funil*
*Context gathered: 2026-09-15*
