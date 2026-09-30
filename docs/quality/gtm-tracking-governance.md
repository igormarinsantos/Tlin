# Governança de tracking com Google Tag Manager

Plano-base aprovado por Igor em 30/09/2026. Este documento é a referência para
instalação, evolução e auditoria de analytics no site da Tlin.

## Objetivo e fontes de verdade

O Google Tag Manager é o único carregador de ferramentas de mídia e analytics no
site. O código publica eventos controlados no `dataLayer`; o GTM distribui esses
eventos para GA4, Google Ads e outras plataformas aprovadas.

Cada sistema responde por uma camada diferente:

| Camada | Responsabilidade |
| --- | --- |
| Código do site | Evento, contexto seguro, atribuição e `event_id` |
| GTM | Regras de disparo e distribuição para fornecedores |
| GA4 | Comportamento e funil digital |
| Supabase | Correlação e histórico técnico do funil |
| Deskcomm | Lead qualificado, demo realizada e venda ganha |

`demo_booked` é o único evento principal do navegador. A métrica comercial
prioritária continua sendo **demo confirmada com lead qualificado**, cuja
qualificação só existe após avaliação da equipe no CRM.

## Regras que evitam duplicação

1. Nunca carregar GA4 direto e GTM juntos.
2. Nunca colar outro snippet GTM em páginas, componentes ou layouts aninhados.
3. O Google Tag do container deve usar `send_page_view=false`.
4. O GA4 não deve observar alterações de histórico nem interações de formulário
   automaticamente; o site já publica esses eventos.
5. Tags de CTA, formulário e WhatsApp devem escutar eventos do `dataLayer`, sem
   triggers paralelos por clique, seletor CSS ou URL.
6. `demo_thank_you_opened` e `demo_thank_you_viewed` são diagnósticos, não novas
   reservas nem conversões principais.
7. `click_whatsapp` mede clique. Não comprova conversa, qualificação ou venda.
8. `generate_lead` usa o mesmo `event_id` nas rotas defensivas de captura.
   `demo_booked` usa a identidade persistida do pedido confirmado.
9. Nenhum evento pode enviar nome, telefone, e-mail, mensagem, query string,
   click ID ou texto livre ao analytics.

## Instalação no Next.js

O loader vive somente em `app/layout.tsx`. Quando o proprietário é `gtm`, ele
insere o script no `<head>` e o `noscript` como primeiro conteúdo do `<body>`,
cobrindo todas as rotas do App Router.

Produção:

```env
NEXT_PUBLIC_ANALYTICS_OWNER=gtm
NEXT_PUBLIC_GTM_ID=GTM-NH6DWSH4
```

O carregador direto do GA4 foi removido do código. Valores antigos como `ga4`
são tratados como `off`, evitando que uma configuração obsoleta recrie duas
fontes de coleta.

Desenvolvimento e testes permanecem com `NEXT_PUBLIC_ANALYTICS_OWNER=off`, a
menos que uma sessão local de validação determine explicitamente o contrário.

## Catálogo de eventos

O catálogo tipado está em `lib/analytics-contract.ts`. Strings fora desse
contrato falham no TypeScript antes de chegar à produção.

### Aquisição e navegação

- `page_view`
- `utm_capture`
- `nav_solutions_menu_open`
- `nav_solution_click`
- `nav_link_click`
- `nav_ai_click`
- `article_cta_click`
- `share`
- `login_gateway_continue`

### Funil de demo

- `click_pricing_cta`
- `select_plan`
- `lead_form_opened`
- `start_lead_form`
- `lead_step_completed`
- `generate_lead`
- `demo_booked`
- `demo_thank_you_opened`
- `demo_thank_you_viewed`
- `lead_form_abandoned`
- `click_whatsapp`

### Conversa e follow-up do Igor

- `lia_chat_opened`
- `lia_chat_started`
- `lia_message_sent`
- `lia_chat_reset`
- `lia_followup_scheduled`
- `lia_followup_typing`
- `lia_followup_shown`
- `lia_followup_opened`
- `lia_followup_dismissed`

## Classificação no GA4

| Classe | Eventos |
| --- | --- |
| Principal | `demo_booked` |
| Secundária | `generate_lead`, `start_lead_form`, `click_whatsapp` |
| Diagnóstico | Todos os demais |

Não recriar `qualify_lead` nem `close_convert_lead`. Se ainda existirem na
propriedade, retirar seu status de evento principal.

## Configuração mínima do container

1. Uma Google Tag para `G-9LQN3ZWCNS`, acionada em Initialization / All Pages,
   com `send_page_view=false`.
2. Uma tag GA4 Event para `page_view`, acionada pelo Custom Event `page_view`.
3. Tags GA4 Event para os nomes do catálogo, acionadas somente por Custom Event.
4. Variáveis de Data Layer apenas para os parâmetros documentados e sanitizados
   por `lib/analytics-events.ts`.
5. Nenhuma tag genérica deve disparar para eventos internos `gtm.*`.
6. Google Ads e Meta devem consumir o evento aprovado; não observar o mesmo
   botão novamente pelo DOM.

## Fases de implantação

| Fase | Entrega | Estado |
| --- | --- | --- |
| 1. Governança | Guia, proprietário único e catálogo tipado | Implementada localmente |
| 2. Contrato seguro | Parâmetros úteis do Igor, filtros de cardinalidade e PII | Implementada localmente |
| 3. Deduplicação | `event_id` na captura, reserva e recibo | Implementada localmente |
| 4. Container | Google Tag e tags de evento sem triggers paralelos | Configuração externa pendente |
| 5. Ativação | Variáveis da Vercel, deploy e publicação do container | Pendente de autorização de produção |
| 6. Validação | Preview, DebugView e relatório de duplicação | Pendente após deploy |

## Auditoria externa de 30/09/2026

- O container ativo da conta Tlin é `GTM-NH6DWSH4`. O identificador
  `GTM-NH79DSND` pertence à inspeção histórica de 18/09 e não deve ser usado
  no deploy atual.
- A variável `ID GA4` do container aponta para `G-9LQN3ZWCNS`.
- A tag `Tlin - Tag do Google` roda em `Initialization - All Pages` sem
  `send_page_view=false`; no estado atual ela concorreria com o `page_view`
  publicado pelo site.
- A tag `Tlin - Pixel Web` inicializa o Pixel `1909493637072194` e dispara
  `PageView` em `All Pages`. Antes da ativação, a inicialização e o PageView
  precisam ser separados para a navegação SPA não gerar duas fontes de página.
- A Vercel ainda usa `NEXT_PUBLIC_ANALYTICS_OWNER=ga4` e
  `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-9LQN3ZWCNS`; `NEXT_PUBLIC_GTM_ID` ainda não
  existe no ambiente de produção.
- No GA4, `close_convert_lead`, `qualify_lead` e `demo_booked` estão marcados
  como eventos principais. Os dois primeiros precisam perder esse status.
- A conversão aberta no Google Ads, `Lead form - Submit`, tem origem
  "Hospedado pelo Google". Ela não representa a confirmação de demo no site.
- A conta de anúncios Meta aberta não exibe fonte de dados, embora exista uma
  tag de Pixel no GTM. Confirmar a propriedade do Pixel antes de usá-lo para
  otimização ou remarketing.

## Validação sem gerar lead real

No GTM Preview e no GA4 DebugView:

1. Abrir uma rota com UTMs fictícias e confirmar um `page_view`.
2. Navegar por três rotas SPA e confirmar exatamente um `page_view` por rota.
3. Abrir o formulário e avançar apenas em dados simulados, sem confirmar agenda.
4. Conferir `click_pricing_cta`, `lead_form_opened`, `start_lead_form` e
   `lead_step_completed` uma vez por ação.
5. Abrir e fechar a conversa do Igor e conferir os contextos de follow-up.
6. Confirmar que e-mail, telefone, nome, mensagens e query string não aparecem.
7. Não testar `demo_booked`, CRM, e-mail ou agenda em produção sem uma janela de
   teste autorizada.

## Checklist de auditoria após publicação

- O HTML contém `GTM-NH6DWSH4` e não contém carregamento direto de
  `gtag/js?id=G-9LQN3ZWCNS`.
- `window.dataLayer` recebe um objeto por interação.
- Cada interação gera no máximo uma requisição GA4 correspondente.
- `demo_booked` contém `event_id` e só aparece após confirmação do backend.
- Os eventos do Igor preservam `trigger`, `chat_state`, `pathname` e contagens,
  sem conteúdo da conversa.
- O painel do CRM continua sendo a fonte da qualificação comercial.

## Rollback

Se o container publicar duplicações, pausar as tags problemáticas no GTM. Se o
loader inteiro precisar ser suspenso, definir `NEXT_PUBLIC_ANALYTICS_OWNER=off`
e fazer novo deploy. Não reativar GA4 direto como correção rápida sem revisar
pageviews, formulário automático e o histórico desta decisão.
