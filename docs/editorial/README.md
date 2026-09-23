# Operação editorial

Este diretório transforma o contrato editorial tipado em um processo operável por
um operador técnico. O conteúdo é editado em arquivos locais, validado em teste e
publicado pelo fluxo normal de Git/PR do produto. A prioridade continua sendo
qualidade comercial comprovável, não volume de páginas, tráfego isolado ou uma
promessa de ranking.

## Limite da operação

- A fonte de verdade é o registro tipado em `content/editorial/`.
- O operador técnico prepara o brief, altera o artigo, registra evidências, roda os
  checks e abre a revisão Git/PR.
- O revisor factual confirma a sustentação dos claims e os limites das fontes.
- O revisor comercial confirma posicionamento, oferta, CTA e ausência de promessa
  não autorizada.
- A identidade autoral precisa existir em `content/editorial/authors.ts`, com
  identidade e perfil aprovados. Bio, credencial ou experiência não comprovada
  bloqueia publicação.
- Imagem declarada precisa apontar para um ativo local aprovado, com aprovação,
  dimensões quando aplicáveis e texto alternativo útil. Não se baixa nem se
  inventa uma imagem durante a revisão.

CMS headless não faz parte desta fase. Ele só pode ser reconsiderado quando
existir requisito confirmado de publicação não técnica que o fluxo local com
Git/PR não atenda. Até lá, não duplicar conteúdo nem aprovações em outra fonte.

## Estados e responsabilidades

O fluxo é `draft → review → published → archived`.

| Estado | Pode estar incompleto | Responsável | Saída permitida |
| --- | --- | --- | --- |
| `draft` | Sim | Operador técnico | Somente registro interno |
| `review` | Sim | Revisores factual e comercial | Somente registro interno |
| `published` | Não | Operador técnico após as duas aprovações | Query pública, página, feed, sitemap e arquivos LLM |
| `archived` | Sim | Owner editorial | Fora das queries públicas; decisão de redirect é separada |

Uma pessoa pode acumular papéis em uma operação pequena, mas cada aprovação
continua explícita, identificada e datada. O código verifica presença e forma da
evidência; não prova que a revisão humana foi competente.

## Fluxo executável

1. Copiar `content-brief.md`, definir o owner da peça e preencher público,
   problema, estágio, intenção, URL owner, cluster e hipótese de medição.
2. Levantar fontes primárias. Para estatística ou claim mutável, registrar fonte,
   data de acesso, escopo e a afirmação exata que ela sustenta.
3. Escrever a contribuição original. Comprimento, headings, links, imagens e
   palavras-chave decorrem da intenção e da utilidade; não há cotas editoriais.
4. Manter o registro em `draft` enquanto faltar conteúdo ou evidência. Promover
   para `review` somente quando o brief e o checklist puderem ser avaliados.
5. Executar `quality-checklist.md`. O revisor factual e o revisor comercial
   registram aprovação com identidade e data; a revisão anti-plágio é humana.
6. Rodar os testes editoriais, `npm run typecheck` e `git diff --check`.
7. Alterar para `published` somente após todos os gates. A data `publishedAt`
   marca a primeira publicação; `modifiedAt` só muda quando há atualização
   substantiva perceptível ao leitor.
8. Revisar o diff no Git/PR, conferir canonical e superfícies públicas e então
   seguir o processo de publicação já autorizado do produto. Check verde não
   autoriza merge, push ou deploy.
9. Executar a rotina de `distribution.md` manualmente depois que a URL canônica
   estiver pública e verificada.

## Evidência e datas

Cada mudança deve preservar uma trilha curta e auditável no brief, registro e PR:

- owner e intenção da URL;
- fontes consultadas, data de acesso e escopo quando o fato puder mudar;
- contribuição original e claims que dependem de fonte;
- identidades e datas das revisões factual e comercial;
- motivo da atualização e evidência do que mudou;
- gatilho ou cadência da próxima revisão;
- resultado dos checks e destinos de distribuição realmente executados.

`modifiedAt` não muda por correção de espaço, rebuild, troca de dependência,
republicação do mesmo texto ou intenção de parecer recente. Atualização
substantiva inclui corrigir uma informação, substituir uma fonte, ampliar uma
explicação útil, mudar uma recomendação ou alterar materialmente o CTA.

## Gatilhos de atualização e cadência

A revisão é dirigida por gatilho e risco, não por “fake freshness”. O owner deve
reabrir a peça quando ocorrer qualquer um destes eventos:

- fonte removida, redirecionada ou contradita;
- mudança no produto, oferta, integração, interface ou URL citada;
- claim temporal vencido ou estatística fora do escopo registrado;
- feedback factual ou comercial verificável;
- queda ou mudança relevante observada na intenção de busca ou na jornada;
- atualização de política, documentação primária ou requisito legal relacionado.

Na ausência de gatilho, use a cadência registrada no brief: risco alto para
claims mutáveis, oferta e integrações; risco médio para playbooks e comparação;
risco baixo para explicações estáveis. A cadência é uma data de reavaliação, não
permissão para alterar `modifiedAt` sem mudança substantiva. Se a peça não puder
ser corrigida com evidência, mova para `archived` e registre a decisão.

## Base documentada, hipóteses e práticas recusadas

Práticas documentadas nesta operação: conteúdo people-first, HTML acessível,
canonical coerente, fontes verificáveis, autoria real e links úteis. São
requisitos de qualidade, não promessa de posição.

Hipóteses experimentais: recuperabilidade de passagens, presença em respostas
generativas e citação amostral. Devem ter amostra, período e resultado observável;
um resultado pontual não vira garantia.

Práticas sem suporte e recusadas como gate: keyword density, word count mínimo,
quantidade fixa de headings, “chunking” especial, schema inventado e atualização
de data sem mudança real. `llms.txt` é complementar e não garante indexação,
ranking ou citação.

## Arquivos operacionais

- `content-brief.md`: intenção, evidências, contribuição, revisão e medição.
- `quality-checklist.md`: gates técnicos e aprovações humanas antes de publicar.
- `distribution.md`: registro manual de canais, URLs, UTMs e observação.

