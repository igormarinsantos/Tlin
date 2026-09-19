# Fase 6 — otimização de conversão

## Experimento inicial

`home_hero_cta_v1` compara somente o texto do CTA principal da home:

| Variante | Texto |
| --- | --- |
| `control` | Começar Agora |
| `demo_clarity` | Agendar demo gratuita |

Cada navegador recebe uma variante aleatória, mantida por até 30 dias em
`localStorage`. A atribuição contém apenas o identificador e a variante; não usa
nome, telefone, e-mail, conversa ou qualquer outro dado pessoal.

O evento `experiment_exposed` registra a exposição no GA4. A mesma atribuição é
anexada aos eventos seguintes do funil, ao payload de captação, ao Deskcomm e à
projeção do Supabase. Assim, o painel interno pode comparar captações, demos,
demos qualificadas, presença e vendas por variante. A qualificação continua sendo
determinada exclusivamente pela equipe no CRM.

## Como operar

1. Aplicar a migration `20260919_conversion_experiment_report.sql` no Supabase.
2. No GA4, registrar `experiment_id` e `experiment_variant` como dimensões
   personalizadas de escopo de evento antes de analisar os eventos.
3. Manter o experimento isolado: não alterar prova, preço, fluxo de demo ou
   outra mensagem da home enquanto ele estiver ativo.
4. Avaliar a variante vencedora pelo número e pela taxa de demos qualificadas;
   demos marcadas, erros de agenda e abandono são métricas de proteção.
5. Só encerrar após uma janela comercial representativa e com volume suficiente
   para a decisão. Ausência de diferença não comprova ganho.

## Limites

- A atribuição começa na home e não retroage para leads anteriores ou entradas
  diretas no formulário; o painel mostra essas linhas como `not_assigned`.
- A migration e a configuração de dimensão no GA4 são operações externas. Esta
  entrega não declara validação operacional real do Deskcomm, Supabase ou GA4.
