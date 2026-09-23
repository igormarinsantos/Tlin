# Brief editorial

Copie este template para a descrição do PR ou para um documento versionado junto
da peça. Campos não aplicáveis recebem `não aplicável` com justificativa; não use
texto genérico apenas para atravessar o gate.

## Identidade e owner

- **ID/slug:**
- **Título provisório:**
- **Owner editorial:** pessoa responsável por manter a peça
- **Autor publicado:** identidade existente e perfil aprovado no registro
- **Público:** quem precisa tomar qual decisão ou executar qual tarefa
- **Problema:** dificuldade concreta que a peça resolve
- **Estágio da jornada:** descoberta, avaliação ou apoio à conversão
- **Intenção:** `informational`, `commercial-investigation` ou `conversion-support`
- **URL owner:** página que deve possuir a intenção principal e evitar canibalização
- **Cluster:** ID e hub editorial correspondente

## Evidência e contribuição

- **Fontes:** para cada fonte, registrar título, URL HTTPS verificada, publicador,
  data de acesso e por que é primária ou adequada ao escopo
- **Contribuição original:** síntese, método, explicação ou aplicação própria que
  a peça acrescenta sem se apropriar do texto da fonte
- **Claims:** listar cada afirmação verificável e o ID da fonte que a sustenta;
  para estatística ou claim mutável, incluir data de acesso, período, população,
  geografia, unidade e demais limites relevantes
- **Experiência ou resultado próprio:** `não aplicável` até existir evidência real,
  autorização e revisão; nunca preencher por inferência
- **Risco factual:** baixo, médio ou alto, com motivo

## Revisão e atualização

- **Revisor factual:** identidade aprovada, data e evidência examinada
- **Revisor comercial:** identidade aprovada, data, posicionamento e promessa examinados
- **Revisão anti-plágio:** responsável, data, trechos/fontes comparados e decisão
- **Gatilhos de atualização:** fatos, fontes, produto, oferta, integração, URL ou
  sinal observado que obrigam reabrir a peça
- **Cadência de reavaliação:** data ou intervalo coerente com o risco, sem atualizar
  `modifiedAt` se nada substantivo mudou
- **Motivo de `modifiedAt`:** alteração perceptível ao leitor e sua evidência

## Arquitetura e conversão

- **Pergunta principal respondida:**
- **Subperguntas úteis:** definidas pela intenção, sem cota de headings
- **Links internos:** destino, label e propósito; confirmar rota real
- **CTA:** ID, texto, destino real e relação com o estágio da jornada
- **Imagem:** `não aplicável` ou path do ativo local aprovado, aprovação, dimensões,
  alt e legenda; nunca declarar URL/asset ainda inexistente
- **Canonical esperado:** derivado do slug e da configuração oficial do site

## Medição

- **Hipótese de medição:** comportamento observável esperado, sem prometer resultado
- **Indicador intermediário:** descoberta, leitura ou CTA, sem confundir com venda
- **Resultado comercial relacionado:** demo confirmada, qualificação humana ou venda
- **Janela e segmento de análise:**
- **Critério para revisar, manter ou arquivar:**

## Estado proposto

- [ ] `draft`: pode estar incompleto e nunca entra na query pública
- [ ] `review`: pronto para julgamento factual, comercial e anti-plágio
- [ ] `published`: somente após evidências e aprovações completas
- [ ] `archived`: removido da query pública com decisão registrada

