# Plano de implementação da Meta Ads

Plano-base definido com Igor em 30/09/2026. O objetivo é iniciar aquisição por
Facebook e Instagram com medição confiável, públicos reaproveitáveis e otimização
progressiva para **demos confirmadas com leads qualificados**.

Este plano complementa a
[governança central do GTM](gtm-tracking-governance.md). O GTM continua sendo o
único carregador de mídia no navegador. O CRM continua sendo a fonte da
qualificação comercial.

## Resultado esperado

```text
Anúncio segmentado
  → landing page do segmento
  → formulário iniciado
  → lead capturado
  → demo confirmada
  → qualificação confirmada no CRM
  → retorno de qualidade para a Meta
```

O Pixel deve permitir remarketing e atribuição desde o primeiro ciclo. A
Conversions API entra depois da coleta pelo navegador estar validada e usa o
mesmo `event_id` para impedir contagem dupla.

## Estado inicial

- GTM `GTM-NH6DWSH4` ativo em produção como carregador único.
- GA4 recebe os eventos aprovados do `dataLayer`.
- A tag antiga `Tlin - Pixel Web` está pausada.
- O dataset confirmado é `Tlin - Pixel Web` (`1909493637072194`), pertencente
  ao Business `Tlin` (`213354731072099`) e conectado à conta `TLIN ADS`
  (`1397532772041218`). Página, Instagram e domínio ainda precisam de auditoria.
- O código já possui preferência separada para métricas e publicidade, com
  negação por padrão, revogação no rodapé e validade de 180 dias. A publicação
  e a validação no GTM ainda estão pendentes.
- A coleta automática de detalhes de páginas e produtos foi desativada no
  Events Manager em 30/09/2026. Os eventos ficam limitados ao contrato explícito.
- O workspace isolado `Meta Ads - Fundação` foi criado no GTM. Ele contém sete
  acionadores explícitos e uma tag roteadora ainda não publicada. O
  `Default Workspace` preserva separadamente as mudanças existentes em
  formulário e variáveis de scroll.
- O site já publica `event_id` em `generate_lead` e `demo_booked`.
- Existem landing pages próprias para clínicas, escolas, assessorias e advocacia.

## Princípios de execução

1. Nenhum snippet da Meta entra diretamente em componentes ou layouts.
2. O Pixel não observa cliques, formulários ou histórico pelo DOM. Ele consome
   somente eventos explícitos do `dataLayer`.
3. `PageView` nasce do evento `page_view`, nunca de `All Pages`, para preservar
   uma visualização por navegação no App Router.
4. Nome, telefone, e-mail e conteúdo de conversa não entram no Pixel.
5. Eventos do navegador e do servidor compartilham `event_id` quando descrevem
   a mesma ação.
6. `Lead` não significa lead qualificado. `Schedule` não significa venda.
7. A campanha só muda para uma conversão mais profunda quando houver volume e
   estabilidade suficientes para o algoritmo aprender.
8. Públicos do site podem ser criados vazios, mas só acumulam pessoas depois
   que o Pixel passa a coletar.

## Fases

| Fase | Entrega | Dependência | Estado |
| --- | --- | --- | --- |
| 0. Propriedade | Business, conta, Página, Instagram, domínio e dataset confirmados | Acesso Meta | Em andamento |
| 1. Consentimento | Regra técnica de publicidade e política atualizadas | Decisão de privacidade | Implementada localmente |
| 2. Pixel no GTM | Inicialização e eventos explícitos | Fases 0 e 1 | Rascunho configurado no GTM |
| 3. Validação | Test Events, SPA, payload e duplicação | Fase 2 | Pendente |
| 4. Públicos | Públicos frios, quentes e exclusões | Pixel validado | Pendente |
| 5. Campanhas | Prospecção segmentada e remarketing | Fase 4 | Pendente |
| 6. CAPI | Eventos de servidor com deduplicação | Pixel estável | Pendente |
| 7. Qualidade CRM | Qualificação e venda retornam para mídia | CAPI e estágios CRM | Pendente |
| 8. Otimização | Orçamento e criativos guiados por qualidade | Dados suficientes | Contínua |

## Fase 0 — propriedade e acessos

### Trabalho

- Confirmar o Business Portfolio da Tlin.
- Confirmar a conta de anúncios que pagará as campanhas.
- Vincular Página do Facebook e perfil profissional do Instagram.
- Confirmar o domínio `tlin.ia.br` na Meta.
- Confirmar qual dataset/Pixel pertence à Tlin e registrar seu ID sem criar um
  segundo Pixel por engano.
- Conceder à conta de anúncios acesso ao dataset.
- Conferir moeda, fuso `America/Sao_Paulo` e dados comerciais da conta antes de
  criar campanhas.

### Critério de aceite

- Página, Instagram, conta de anúncios, domínio e dataset aparecem sob a mesma
  estrutura empresarial autorizada.
- A conta de anúncios consegue selecionar o dataset como fonte de conversão.
- O ID confirmado substitui qualquer referência histórica não comprovada.

## Fase 1 — consentimento e privacidade

### Trabalho

- Definir com o responsável de privacidade quando tags de publicidade podem
  disparar no Brasil e em outros mercados atendidos.
- Implementar um estado único de consentimento para analytics e publicidade.
- Impedir a tag da Meta enquanto o estado exigido não estiver concedido.
- Documentar Pixel, remarketing e preferências na política aplicável.
- Definir expiração e revogação da preferência.

### Critério de aceite

- A decisão de consentimento é verificável no navegador e respeitada pelo GTM.
- Revogar publicidade impede novos eventos da Meta sem desligar funções do site.
- Nenhum identificador de cliente é enviado sem a base definida pelo responsável.

## Fase 2 — Pixel pelo GTM

### Mapeamento da tag

O rascunho usa uma única tag física, `Tlin - Meta - Eventos do Funil`, para
centralizar carregamento, verificação de consentimento, inicialização e a lista
permitida de eventos. Sete acionadores de evento personalizado mantêm a origem
de cada disparo auditável. O roteador não lê campos ou histórico do DOM.

| Ação lógica | Origem | Evento Meta | Finalidade |
| --- | --- | --- | --- |
| Inicialização | Consentimento de publicidade | Inicialização sem PageView automático | Carregar o Pixel uma vez |
| Visualização | `page_view` | `PageView` | Navegação e audiência do site |
| Conteúdo | `page_view` em LP segmentada | `ViewContent` | Interesse por solução |
| Formulário aberto | `lead_form_opened` | `LeadFormOpened` personalizado | Intenção inicial |
| Formulário iniciado | `start_lead_form` | `LeadFormStarted` personalizado | Formulário iniciado |
| Lead | `generate_lead` | `Lead` | Captura confirmada |
| Contato | `click_whatsapp` | `Contact` | Intenção de conversa |
| Demo | `demo_booked` | `Schedule` | Demo confirmada |

### Regras de implementação

- Inicializar o Pixel uma única vez dentro do roteador antes de processar o
  evento permitido.
- Disparar `ViewContent` apenas em páginas comerciais aprovadas, derivando o
  segmento de `pathname` ou do parâmetro controlado `solution`.
- Adicionar ao GTM somente variáveis necessárias, incluindo `solution` se o
  mapeamento por caminho não for suficiente.
- Enviar `event_id` em `Lead` e `Schedule`.
- Não enviar valor financeiro fictício para lead ou demo.
- Não disparar `Lead` e `Schedule` para a mesma ação: são etapas diferentes.
- Manter tags de publicidade em pasta própria e usar o prefixo `Tlin - Meta -`.
- Publicar uma versão do container com nome e descrição da mudança.
- No aceite inicial, `consent_updated` registra a página atual uma única vez;
  a navegação posterior usa `page_view`, com deduplicação por `pathname` dentro
  do ciclo da página.

### Critério de aceite

- Uma visita gera exatamente um `PageView`.
- Uma navegação SPA gera exatamente um novo `PageView`.
- `Lead` acontece somente após captura confirmada.
- `Schedule` acontece somente após agendamento confirmado pelo backend.
- Nenhum parâmetro contém nome, e-mail, telefone, mensagem, query string ou ID
  de clique bruto.

## Fase 3 — validação controlada

### Matriz mínima

| Cenário | Resultado esperado |
| --- | --- |
| Home carregada | Um `PageView` |
| Navegação para preços | Um novo `PageView` |
| LP de clínicas | `PageView` e `ViewContent` com segmento clínicas |
| Abrir formulário | Um evento de abertura |
| Começar formulário | Um evento de início |
| Clicar no WhatsApp | Um `Contact` |
| Dados simulados sem agenda | Nenhum `Schedule` |
| Consentimento negado/revogado | Nenhuma requisição da Meta |

### Ferramentas e evidências

- GTM Preview para conferir triggers, tags e variáveis.
- Test Events do Events Manager para conferir recebimento.
- Inspeção de rede ou Pixel Helper para confirmar ausência de duplicação.
- Captura do payload sem dados pessoais.
- Registro da versão publicada e do resultado de cada cenário.

Não marcar demo real, enviar e-mail real ou criar lead operacional apenas para
validar o Pixel. `Schedule` será validado em uma janela de teste autorizada ou
pela primeira conversão real monitorada.

## Fase 4 — públicos

### Convenção de nomes

```text
TLIN | WCA | Todos visitantes | 30d
TLIN | WCA | Clínicas | 60d
TLIN | WCA | Form iniciou sem demo | 14d
TLIN | ENG | Instagram | 365d
TLIN | EXC | Demo agendada | 180d
TLIN | LAL | Demo qualificada | BR | 1%
```

`WCA` identifica público do site, `ENG` engajamento, `EXC` exclusão e `LAL`
público semelhante.

### Públicos do site

- Todos os visitantes: 30, 60 e 180 dias.
- Visitantes por segmento: clínicas, escolas, assessorias e advocacia, em 30 e
  60 dias.
- Abriu formulário e não iniciou: 7 e 14 dias.
- Iniciou formulário e não virou lead: 7, 14 e 30 dias.
- Virou lead e não agendou: 30 dias.
- Clicou no WhatsApp e não agendou: 30 dias.
- Agendou demo: 180 dias, usado principalmente como exclusão.

### Públicos dentro da Meta

- Engajamento com Instagram: 30, 90 e 365 dias.
- Engajamento com Facebook: 30, 90 e 365 dias.
- Pessoas que enviaram mensagem.
- Visualizadores de 50% e 75% dos vídeos: 30 e 90 dias.

### Públicos frios e semelhantes

- Criar públicos frios por segmento e localização sem fragmentar excessivamente
  o orçamento.
- Testar audiência ampla/Advantage junto do sinal de conversão por segmento.
- Criar semelhantes somente quando a origem tiver qualidade e tamanho úteis.
- Priorizar como semente demos qualificadas e clientes, não visitantes genéricos.
- Lista de clientes só pode ser importada com autorização, finalidade e base de
  uso confirmadas; o arquivo não entra no repositório.

### Critério de aceite

- Inclusões, exclusões, janelas e origem de cada público estão documentadas.
- Públicos de abandono excluem `Schedule`.
- Públicos de prospecção excluem clientes e demos agendadas quando aplicável.

## Fase 5 — campanhas iniciais

### Estrutura

```text
TLIN | META | Prospecção | Leads | BR
  ├── Clínicas → /ia-para-clinicas
  ├── Escolas → /ia-para-escolas
  ├── Assessorias → /ia-para-assessorias
  └── Advocacia → /ia-para-advocacia

TLIN | META | Remarketing | Leads | BR
  ├── Visitou solução
  ├── Abriu ou iniciou formulário
  └── Lead sem demo
```

Se o orçamento não comportar quatro conjuntos com aprendizado útil, iniciar com
os dois segmentos de maior prioridade comercial e abrir os demais por rodada.

### Configuração inicial

- Objetivo de Leads com conversão no site.
- Otimizar inicialmente para `Lead` enquanto `Schedule` ainda tiver pouco volume.
- Medir `Schedule` desde o primeiro dia.
- Testar otimização para `Schedule` quando o evento estiver estável e recorrente,
  sem usar um número arbitrário como garantia.
- Usar a LP correspondente ao anúncio e preservar UTMs.
- Excluir demos agendadas e clientes das campanhas de aquisição aplicáveis.
- Alterar uma variável importante por teste: ângulo, criativo, promessa ou CTA.

### Critério de aceite

- Cada anúncio chega à LP correta e mantém UTMs.
- A plataforma atribui `Lead` e `Schedule` sem duplicação.
- O relatório separa os quatro segmentos.
- Nenhuma decisão é tomada apenas por clique barato ou CTR.

## Fase 6 — Conversions API

### Arquitetura proposta

```text
Browser → Pixel → Meta
Backend → fila/outbox → Conversions API → Meta
                    ↘ mesmo event_id ↙
                       deduplicação
```

### Implementação no repositório

- Criar um adaptador isolado, por exemplo `lib/meta-conversions.ts`.
- Manter `META_DATASET_ID` e `META_CAPI_ACCESS_TOKEN` somente no servidor.
- Nunca criar variável `NEXT_PUBLIC_*` para o token da CAPI.
- Enfileirar eventos confirmados em vez de bloquear a resposta do formulário.
- Enviar `Lead` depois da captura confirmada.
- Enviar `Schedule` depois da reserva confirmada.
- Reutilizar o `event_id` emitido pelo navegador.
- Aplicar retry idempotente e registrar status sem logar payload pessoal.
- Normalizar e aplicar SHA-256 em identificadores permitidos somente depois da
  decisão de consentimento/base de uso.
- Usar `fbp` e `fbc` apenas conforme a política definida e sem expô-los ao GA4.

### Critério de aceite

- Browser e servidor aparecem deduplicados como uma ação no Events Manager.
- Falha da Meta não cria outra reserva, outro lead ou outro e-mail.
- Token, dados brutos e hashes não aparecem em logs nem analytics.
- O site continua concluindo o fluxo quando a Meta estiver indisponível.

## Fase 7 — qualidade comercial do CRM

### Trabalho

- Mapear no Deskcomm as mudanças para qualificado, demo realizada e venda ganha.
- Persistir cada mudança com a identidade já correlacionada do funil.
- Definir no Events Manager o evento aceito para qualificação comercial antes de
  enviá-lo; não inventar um nome que a campanha não consiga selecionar.
- Retornar pelo servidor apenas estados confirmados pelo CRM.
- Usar demos qualificadas ou vendas como semente dos públicos semelhantes.
- Testar a meta de otimização para qualidade somente quando o retorno tiver
  volume, cobertura e baixa latência suficientes.

### Critério de aceite

- O mesmo lead pode ser relacionado de anúncio até estágio comercial.
- Uma mudança repetida no CRM não gera conversão duplicada.
- O painel interno e a Meta concordam sobre o número de retornos enviados, com
  diferenças de atribuição documentadas.

## Fase 8 — medição e rotina de otimização

### Indicadores por segmento

- Investimento, alcance, frequência, CPM e CTR de link.
- Visualizações de LP e custo por visualização.
- Taxa de abertura e início do formulário.
- Leads, custo por lead e taxa de conclusão.
- Demos confirmadas e custo por demo.
- Demos qualificadas e custo por demo qualificada.
- Demos realizadas, vendas e custo de aquisição.

### Fontes de verdade

| Informação | Fonte |
| --- | --- |
| Investimento e entrega | Meta Ads |
| Comportamento no site | GA4 |
| Correlação técnica | Supabase |
| Qualificação, realização e venda | Deskcomm |

### Cadência

- Conferência técnica diária na primeira semana.
- Leitura de criativos e segmentos duas vezes por semana durante o aprendizado.
- Decisão de orçamento semanal com base em demo qualificada, não apenas lead.
- Auditoria mensal de eventos, públicos, exclusões e correspondência.

## Ordem prática das entregas

1. Confirmar a propriedade Meta e o dataset correto.
2. Decidir e implementar a regra de consentimento de publicidade.
3. Construir e validar as tags da Meta em workspace separado do GTM.
4. Publicar o Pixel e observar coleta sem campanha por um curto período.
5. Criar públicos personalizados e exclusões.
6. Preparar nomenclatura, UTMs, anúncios e destinos por segmento.
7. Publicar a primeira campanha de prospecção.
8. Ativar remarketing quando os públicos tiverem volume útil.
9. Implementar CAPI para `Lead` e `Schedule`.
10. Retornar qualificação e venda do CRM e otimizar por qualidade.

## Rollback

- Duplicação ou payload incorreto: pausar somente as tags `Tlin - Meta -` e
  republicar o container anterior.
- Pixel errado: não reutilizar públicos nem campanhas; corrigir a propriedade
  antes de nova coleta.
- Falha da CAPI: pausar o worker de envio sem afetar captura ou agendamento.
- Divergência CRM/Meta: interromper o retorno de qualidade, preservar os eventos
  persistidos e reconciliar antes de reenviar.

## Definição de concluído

A implantação inicial estará concluída quando:

- o Pixel correto estiver ativo pelo GTM e respeitar a regra de consentimento;
- PageView, ViewContent, Lead, Contact e Schedule estiverem testados;
- não houver duplicação entre SPA, Pixel e CAPI;
- públicos quentes e exclusões estiverem criados;
- cada campanha usar a landing page e as UTMs corretas;
- custo por demo e custo por demo qualificada puderem ser comparados por
  segmento;
- a equipe souber pausar tags, campanhas e retorno de servidor separadamente.
