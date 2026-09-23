# Distribuição editorial

Esta rotina define distribuição manual, rastreável e posterior à publicação. Ela
não autoriza automação de terceiros, não dispara posts, mensagens, e-mails ou
anúncios e não transforma uma URL ainda não verificada em campanha.

## Pré-condições

- artigo em `published`, data não futura e checks locais aprovados;
- URL canônica pública conferida pelo operador após deploy autorizado;
- título, resumo, imagem e CTA coerentes com o registro aprovado;
- canal, audiência, responsável e autorização definidos;
- destino e UTMs revisados sem dados pessoais.

Testes locais e PRs nunca devem acionar um canal externo. Push, merge, deploy e
qualquer publicação em terceiro continuam sujeitos à autorização operacional do
produto.

## Registro de distribuição

Crie uma linha por envio realmente realizado:

| Campo | Preenchimento |
| --- | --- |
| Artigo | ID, slug e canonical verificada |
| Canal | Nome real do canal aprovado |
| Destino | URL exata do post, mensagem ou campanha depois de criado |
| Responsável | Identidade de quem executou manualmente |
| Data/hora | ISO 8601 com timezone |
| Audiência | Segmento pretendido, sem dados pessoais |
| Mensagem | Texto aprovado ou referência versionada |
| UTM | URL final deliberada e conferida |
| Evidência | Link/ID real fornecido pelo canal ou `não disponível` justificado |
| Observação | Resultado observado no período definido, sem causalidade inventada |

Não invente uma URL de post antes de o terceiro fornecê-la. Não preencha alcance,
clique, lead, demo, qualificação ou venda sem fonte observável.

## Convenção de UTM

- `utm_source`: plataforma/origem estável e real
- `utm_medium`: tipo de distribuição, como social, email ou referral
- `utm_campaign`: iniciativa editorial deliberada e de baixa cardinalidade
- `utm_content`: variante específica da mensagem/posição, quando necessária
- `utm_term`: somente quando houver termo de mídia real; nunca para “encher” tracking

Use a canonical como base, preserve o slug e monte a query apenas no link de
distribuição. Não altere canonical, links internos do artigo ou URL owner para
carregar UTM. Antes do envio, abra a URL final e confirme destino e parâmetros.

Exemplo de estrutura, sem URL ou canal fictício:

```text
{canonical}?utm_source={origem_aprovada}&utm_medium={meio_aprovado}&utm_campaign={iniciativa}&utm_content={variante}
```

## Execução manual

1. Escolher somente canais aprovados e úteis para o público do brief.
2. Adaptar a mensagem ao canal sem criar novo claim, cliente, resultado ou promessa.
3. Revisar texto, destino e UTM com a mesma evidência da peça publicada.
4. Publicar manualmente na interface oficial do terceiro.
5. Copiar o identificador ou URL real retornado e completar o registro.
6. Observar indicadores no período do brief. Relacionar artigo, cluster, CTA e
   origem até demo, qualificação e venda pelo contrato comercial existente.
7. Registrar aprendizado como hipótese; não atribuir causalidade a uma amostra isolada.

## Interfaces futuras

Qualquer integração futura precisa preservar aprovação humana, idempotência,
limites de taxa, credenciais fora do repositório, preview, logs sem dados pessoais,
cancelamento e reconciliação. A presença desta interface documental não autoriza
automação nem cria requisito para CMS headless. A automação só reabre em outro
plano com canal, permissão, proprietário e risco confirmados.
