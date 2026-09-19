# Fase 3 — tracking e CRM

Implementação na branch `codex/fase-3-tracking-crm`, sobre a fase 2 (`e8f6001`).
Decisão do Igor: qualificação confirmada pela equipe no CRM; Supabase do site
como banco de tracking. Não houve push, merge, deploy ou teste com lead real.

## Contrato comercial

**Demo qualificada = agendamento confirmado pelo CRM + avaliação positiva da equipe.**
Score alto, clique no WhatsApp, preenchimento e visualização de `/obrigado` não
comprovam qualificação nem venda. Reserve as etapas de avaliação para decisões
da equipe; agentes e automações não devem avançar leads para essas etapas.
O webhook atual do CRM não fornece a identidade do autor: a aplicação identifica
a etapa, mas não consegue provar tecnicamente que a movimentação foi humana.

| Etapa no funil Comercial / Leads | Projeção |
| --- | --- |
| Qualificação confirmada | `qualified=true` |
| Não qualificado | `qualified=false`, inclusive revisão de decisão anterior |
| Call realizada | Registra primeira realização; preserva qualificação |
| Ganho | Registra primeira venda; preserva qualificação |
| Demais etapas | Preservam a avaliação anterior |

O mapeamento com IDs verificados está em `supabase/configure-tlin-funnel.sql`.
`Perdido` não significa automaticamente “não qualificado”: uma oportunidade
qualificada também pode ser perdida. Agendamentos, realizações e vendas são
marcos históricos, sem compensação automática de cancelamentos ou reaberturas.

## Eventos do site

| Evento | Quando acontece |
| --- | --- |
| `page_view` | Entrada e mudança de pathname público |
| `lead_form_opened` | Controlador abre o modal |
| `start_lead_form` | Pessoa aciona “Vamos começar”, modal ou embedded |
| `lead_step_completed` | Resposta enviada a uma etapa |
| `generate_lead` | Backend confirma a captura no CRM |
| `demo_booked` | Backend confirma a reserva |
| `lead_form_abandoned` | Fechamento explícito do modal durante o preenchimento |
| `click_whatsapp` | Clique; não indica conversa, qualificação ou venda |
| `demo_thank_you_viewed` | Visualização do recibo; não é nova reserva |

`qualify_lead` e `close_convert_lead` não são mais emitidos pelo site.
`lia_chat_started` distingue a conversa da Lia do formulário de demo.
Abandono em navegação/fechamento de aba deve ser inferido pela exploração de
funil no GA4; o navegador não garante entrega de um evento de saída.

`NEXT_PUBLIC_ANALYTICS_OWNER=ga4|gtm|off` escolhe um único carregador. Sem valor,
analytics fica desligado. IDs precisam ser definidos explicitamente. Inicialização
GA precede hidratação; eventos antecipados ficam no `dataLayer`. Parâmetros são
limitados a uma lista explícita, URLs perdem query/hash, e valores que parecem
e-mail/telefone são removidos. Nenhum nome, telefone, e-mail, mensagem ou click ID
é enviado pelos eventos personalizados. Isso não substitui a revisão de tags
adicionadas diretamente no GTM ou da configuração de coleta automática do GA.

GA4: desativar pageviews por histórico na medição otimizada ao usar os pageviews
manuais; conferir também a coleta automática de formulários. Em GTM, criar a tag
GA4 disparada pelos eventos do `dataLayer` e impedir tags duplicadas. Consultar a
[documentação de pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views).
Não marcar clique no WhatsApp como venda ou conversão principal.

UTMs mantêm primeiro e último toque por 30 dias, inclusive quando a URL contém
somente campanha. UTMs explícitos prevalecem sobre inferências de gclid/fbclid.
Os click IDs ficam na atribuição enviada ao backend; URLs não carregam query/hash.
O primeiro toque é preservado no banco e o último é atualizado na conclusão.

## Integração e deduplicação

- Captura envia `external_id=leadCaptureId`, a chave que o inbound do CRM realmente
  usa para deduplicar. UTMs são escalares porque seu mapper descarta objetos.
  A resposta precisa conter `data.lead_id` para ser considerada captura confirmada.
- No envio final, lê os campos existentes e atualiza os dados do formulário via
  MCP, preservando campos manuais. Falha nessa atualização não apaga uma captura
  confirmada; `metadataSynced` registra o resultado no espelho de notificações.
  O e-mail revisado fica no campo do lead, sem alterar o cadastro global do contato.
- Corrigir telefone gera outra identidade de solicitação, evitando reutilizar um
  lead preso ao contato anterior. A captação anterior permanece como histórico.
- Agendamento usa uma chave derivada de telefone normalizado + horário UTC.
  O banco reivindica a operação antes da chamada externa. Repetições retornam o
  resultado persistido; operações incertas ficam bloqueadas para conferência.
  Falha explícita antes da reserva libera nova tentativa. Não há expiração que
  permita repetir cegamente uma reserva possivelmente efetuada.
- Sem coordenador disponível, o endpoint não agenda. Por isso, a migração e as
  variáveis precisam estar prontas **antes** de publicar esta versão.
- E-mails têm uma operação própria por solicitação. Falha entre os dois envios
  requer conferência; não repete automaticamente o primeiro e-mail.
- Retorno exige HMAC sobre o corpo original. Só responde sucesso após persistir.
  Falha de banco responde 503 com `Retry-After`; evento repetido é idempotente.
  Eventos anteriores à criação do espelho são reconciliados depois.
- Eventos usam `event_id` quando disponível; o envelope legado usa hash do corpo.
  A projeção ordena por `occurred_at`, nunca pela ordem de recebimento. O emissor
  legado usa horário de envio, não o timestamp original da alteração: reexecutar
  manualmente eventos antigos nesse emissor pode alterar a ordenação. Evoluir o
  emissor para ID/timestamp originais é uma pendência do produto CRM.

## Painel

`/internal/funnel` consulta `/api/internal/funnel` com Bearer token de no mínimo
32 caracteres, configurado em `FUNNEL_REPORT_TOKEN`. O token fica apenas no estado
da página, sem URL/storage. A API não retorna dados pessoais, exige datas válidas
e intervalo de até 366 dias, tem limite de requisições e `Cache-Control: no-store`.
A página tem `noindex` e não carrega o chrome comercial.

Mostra captações, demos, demos qualificadas, realizadas, vendas, pendentes de
avaliação e taxas por origem/campanha. Coorte é a data de criação da solicitação
no fuso de São Paulo. Cada solicitação conta uma captação; reservas iguais para
contato/horário contam uma vez. A tabela começa a medir os novos registros:
histórico antigo sem correlação não é inventado nem automaticamente classificado.
Custo por demo permanece indisponível até integrar gastos de mídia. Visitas e
abandono ficam no GA4; não são apresentados como dados observados pelo Supabase.

## Configuração externa realizada

- Supabase `nhclqbnygvkyjcxscrgt`: migração de correlação de 15/09, estrutura de
  17/09 e quatro mapeamentos aplicados pelo SQL Editor em 17/09. Editor confirmou
  sucesso, sem exclusão de dados. SQL testado antes em PostgreSQL via PGlite.
- CRM: criada entrada assinada **Site Tlin | Demos qualificadas**
  (`aca5af1f-2dc4-4028-b4ad-5765463e1bef`), no pipeline Comercial / Leads,
  etapa Novo. `.env.local` aponta para essa entrada. A entrada antiga permanece
  intacta; configuração local não muda a produção.
- CRM: criada etapa **Não qualificado**, posicionada após Qualificação confirmada.
- Automação existente **Status do funil Tlin → backup**
  (`5b570943-69b7-4716-aea9-6c4911d86db9`) está ativa, dispara em
  `lead.stage_changed`, aponta para `https://tlin.ia.br/api/webhooks/deskcomm`
  e possui segredo armazenado. Não foi duplicada ou sobrescrita.

## Ativação pendente

### Configuração de analytics verificada em 18/09

- Conta GA `383539525`, propriedade **Tlin** `536371479`, fluxo web
  `14820691976`, ID `G-9LQN3ZWCNS`. O painel informou coleta nas últimas 48 horas.
- URL do fluxo corrigida de `https://tlin.cloud` para `https://tlin.ia.br`.
- `demo_booked` cadastrado como evento principal enviado por código, contado
  por evento e sem valor monetário padrão. Não foi disparada conversão de teste.
- Pageviews automáticos por alteração de histórico e interações automáticas de
  formulário desativados para evitar sobreposição com a instrumentação do site.
  A coleta por carregamento permanece; o código da fase 3 usa `send_page_view: false`.
- Dimensões de escopo Evento criadas: **Etapa do formulário** (`lead_step`) e
  **Modo do formulário** (`form_mode`). Origem/mídia/campanha nativas permanecem
  disponíveis nos relatórios de aquisição; a atribuição persistida está no Supabase.
- GTM `GTM-NH79DSND`: espaço de trabalho inspecionado sem tags e sem alterações
  pendentes. Responsável escolhido para a ativação: GA4 direto, com
  `NEXT_PUBLIC_ANALYTICS_OWNER=ga4` e
  `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-9LQN3ZWCNS`. Não carregar GTM em paralelo.
- Os eventos principais antigos `qualify_lead` e `close_convert_lead` ainda
  existem na propriedade. Retirar seu status de evento principal na transição
  de produção; não interpretar o segundo como venda. Nenhuma regra de derivação
  foi criada para transformar os eventos antigos em `demo_booked`.
- Na Vercel, as configurações públicas `NEXT_PUBLIC_ANALYTICS_OWNER=ga4` e
  `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-9LQN3ZWCNS` foram adicionadas para Production.
  Os segredos `FUNNEL_REPORT_TOKEN`, `DESKCOMM_MCP_URL`, `DESKCOMM_API_TOKEN` e
  `DESKCOMM_WEBHOOK_SECRET` foram salvos como Secret em Production e Preview.
  As variáveis existentes `DESKCOMM_WEBHOOK_URL`,
  `DESKCOMM_STATUS_WEBHOOK_SECRET`, `SUPABASE_URL` e
  `SUPABASE_SERVICE_ROLE_KEY` não foram sobrescritas. Tudo só terá efeito depois
  de um novo deploy. DebugView com a nova versão e a verificação operacional
  continuam pendentes. Analytics local permanece desligado.

### Conexão e publicação

Conferência local em 19/09: `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
foram salvas em `.env.local`. A chamada de leitura à RPC `read_funnel_report`
respondeu `200`; a credencial não entra no Git nem foi impressa.

1. Confirmar, depois do deploy autorizado, que a automação do Deskcomm usa o
   mesmo segredo de retorno já salvo em `DESKCOMM_STATUS_WEBHOOK_SECRET`.
   Não presumir HMAC operacional sem essa verificação.
2. Configurar e validar GA/GTM com os novos nomes, dimensões de origem/campanha e
   exploração de etapas. O banco é a fonte de verdade para demos qualificadas;
   bloqueadores, consentimento e falhas de rede podem impedir eventos do browser.
3. Publicar somente após autorização explícita do Igor. A validação operacional
   com captação, agenda e e-mail reais exige ambiente/teste autorizado separado.

Para operação incerta, consultar `funnel_operations` e conferir no CRM/SMTP antes
de decidir se a operação foi concluída ou pode ser repetida. Não apagar locks por
idade. A chave é um hash: a correlação da solicitação está no resultado quando
conhecido e no espelho do lead. A resolução operacional ainda é manual.

## Evidências de verificação

- `npm run check`: tipos, política de lint, 66 testes e build aprovados.
  Lint manteve os 121 avisos conhecidos, sem regressão de orçamento.
- Depois foram adicionados dois casos de regressão: reserva compartilhada entre
  solicitações e confirmação externa preservada quando a gravação final falha.
  Os nove testes dos dois arquivos afetados passaram, totalizando 68 casos.
- Migração executada em PostgreSQL via PGlite nos testes, incluindo permissões,
  concorrência de operações, replay, correlação e agregação do relatório.
- Painel inspecionado em desktop e mobile; acesso sem token válido recusado.
  A visualização com dados reais permanece pendente da conexão local.
- Integrações de testes simuladas: nenhum lead, e-mail ou agendamento real enviado.
- `git diff --check` aprovado. Publicação, CI remoto e validação operacional de
  ponta a ponta não fazem parte dessas evidências locais.
