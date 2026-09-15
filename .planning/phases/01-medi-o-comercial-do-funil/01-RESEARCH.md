# Phase 1: Medição Comercial do Funil — Pesquisa Técnica

**Data:** 2026-09-15  
**Escopo:** tornar o Deskcomm a fonte operacional do funil; manter Supabase apenas como backup/histórico.

## Decisão recomendada

O Deskcomm deve ser o **sistema de registro comercial** desde que o lead informa um WhatsApp válido. A landing não deve depender de uma escrita no Supabase para criar, qualificar, nutrir ou agendar no CRM.

O Supabase continua útil como cópia resiliente do envio e do contexto de atribuição, mas em modo *best effort*: falhar ao espelhar não muda a resposta comercial nem dispara retentativas a partir do banco secundário.

## Evidência no código atual

| Componente | Estado atual | Risco para o novo modelo |
|---|---|---|
| `app/api/notify/route.ts` | grava no Supabase antes de qualquer CRM; o webhook Deskcomm só roda se houver `demoSlot` | contatos de nutrição não chegam ao CRM e o backup aparece como fluxo principal |
| `lib/supabase-leads.ts` | registra payload e resultado de e-mail | bom para backup, mas não deve guardar o estado comercial canônico |
| `lib/deskcomm-mcp.ts` | conhece disponibilidade, busca de contato e agendamento | falta uma operação explícita e idempotente de criar/atualizar lead com metadados |
| `lib/utm.ts` | preserva first-touch e last-touch e fornece o payload completo | pode alimentar atributos/campos do Deskcomm sem perder a atribuição |
| `components/LeadQualificationPopup.tsx` | só envia a submissão ao concluir e já calcula score/qualidade | precisa separar o marco “WhatsApp utilizável” do marco “fit confirmado/demo” |

## Arquitetura alvo

```text
início do formulário (analytics somente)
  → WhatsApp validado
  → Deskcomm: cria/atualiza lead + origem + status "captado"
  → Supabase: espelho de backup, sem bloquear o fluxo
  → conclusão do SDR gamificado
     → Deskcomm: atualiza fit e encaminha para "a desenvolver" ou agenda
     → Deskcomm: agenda a demo do closer quando aplicável
     → Deskcomm: passa a governar demo, qualificação, proposta e ganho/perda
```

### Contrato de estados mínimos

| Marco | Dono | Valor proposto |
|---|---|---|
| formulário iniciado | analytics | `form_started` (não é lead CRM) |
| WhatsApp utilizável | Deskcomm | `captado` |
| fit ainda não concluído | Deskcomm | `em_qualificacao` |
| sem fit imediato | Deskcomm | `a_desenvolver` |
| apto a falar com closer | Deskcomm | `qualificado` |
| horário confirmado | Deskcomm | `demo_agendada` |
| etapas posteriores | Deskcomm | `demo_realizada`, `proposta_enviada`, `ganha`, `perdida` |

Os nomes finais precisam coincidir com os pipelines/estágios configurados na instância real do Deskcomm. A semântica acima, e não o rótulo, é o contrato da landing.

## Integração Deskcomm

O cliente existente já usa MCP server-side e um webhook de captação. A documentação pública do Deskcomm descreve fontes de captação por webhook e automações de entrada no funil; também estabelece `Idempotency-Key` para criações server-to-server. Isso favorece um adaptador único no servidor da landing que:

1. monta um identificador estável de submissão;
2. envia o payload completo ao Deskcomm com cabeçalho de idempotência, se o endpoint o suportar;
3. recebe ou resolve o `contact_id`/`lead_id` sem depender de polling frágil;
4. registra o identificador do Deskcomm no espelho Supabase;
5. envia todas as transições seguintes ao Deskcomm, nunca ao Supabase.

**Lacuna que não será inventada:** a instância atual expõe `crm_find_free_slots`, `crm_search_contacts` e `crm_book_appointment`, mas o contrato do webhook de captação e a tool de atualização de lead/estágio não estão versionados neste repositório. A execução deve começar com um checkpoint de configuração do Deskcomm: URL da fonte de captação, mapeamento de campos, estágio inicial, chave idempotente e evento/webhook de saída para mudanças comerciais.

## Segurança e resiliência

- Credenciais e URL com token permanecem apenas no servidor; nunca na URL do navegador ou em eventos GA4.
- O payload para o CRM deve incluir atribuição e score, mas não o token Turnstile nem segredos.
- A chamada ao Deskcomm deve ter timeout, resposta auditável e chave de idempotência para não duplicar leads em reenvios.
- Falha do Deskcomm não pode se disfarçar de sucesso: a UI deve orientar nova tentativa e o backup deve registrar o incidente sem tomar o controle.
- Falha do Supabase é não bloqueante e deve ser registrada de forma sanitizada; não há automação comercial disparada por esse banco.
- O identificador retornado pelo Deskcomm deve ser a chave de correlação para analytics, backup e futuro relatório.

## Fontes consultadas

- [DeskcommCRM — webhooks, automações e contexto do produto](https://github.com/melgarafael/DeskcommCRM)
- [DeskcommCRM — convenções de API, idempotência e segurança](https://github.com/melgarafael/DeskcommCRM/blob/main/docs/prd/01-prd-platform-base.md)
- [DeskcommCRM — índice e precedência de contratos técnicos](https://github.com/melgarafael/DeskcommCRM/blob/main/docs/index.md)

## Implicações para o plano

1. Criar um adaptador de captura Deskcomm que seja a única porta de escrita comercial da LP.
2. Mover o espelhamento Supabase para depois da tentativa no CRM e remover qualquer decisão baseada em `supabaseSaved`.
3. Dividir a submissão atual em marcos explícitos: WhatsApp captado, qualificação concluída e demo confirmada.
4. Definir eventos e um caminho de retorno Deskcomm → dados analíticos para relacionar `captado` a `ganha` por origem.
5. Incluir testes de ordem de chamadas, idempotência e degradação: CRM falha versus backup falha.

## Validation Architecture

### Testes automatizados necessários

- teste de rota para garantir que WhatsApp válido chama Deskcomm mesmo sem `demoSlot`;
- teste de ordem: Deskcomm é chamado antes do espelho Supabase;
- teste de falha do Supabase: resposta comercial do Deskcomm continua válida;
- teste de falha do Deskcomm: não há sucesso falso nem agendamento;
- teste de payload: first-touch, last-touch, score e qualidade chegam ao adaptador Deskcomm; Turnstile não;
- teste de idempotência: reenvio com a mesma chave não cria segundo lead.

### Verificação manual

- enviar um contato real de teste sem marcar demo e confirmar no Deskcomm o estágio `captado`;
- concluir um lead de baixo fit e confirmar `a_desenvolver`;
- concluir um lead apto, marcar horário e confirmar que o compromisso pertence ao mesmo contato/lead;
- alterar o estágio no Deskcomm e confirmar que o identificador permite a leitura do resultado por origem.

