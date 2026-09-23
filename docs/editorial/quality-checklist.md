# Checklist de qualidade editorial

Use este checklist antes de alterar um artigo para `published`. Gates
automatizados detectam campos ausentes e referências inválidas; gates humanos
decidem verdade, escopo, originalidade, autorização e adequação comercial.

## Gates automatizados

- [ ] ID e slug são estáveis e únicos
- [ ] Status, intenção e cluster usam os valores tipados e a intenção pertence ao cluster
- [ ] URL owner deriva da taxonomia e links internos apontam para rotas registradas
- [ ] Autor aponta para identidade e perfil aprovados
- [ ] `publishedAt`, `modifiedAt`, datas de acesso e aprovações são ISO 8601 com timezone
- [ ] `publishedAt` não está no futuro e `modifiedAt` não antecede a publicação
- [ ] Conteúdo publicado tem resumo, blocos, fontes aplicáveis, links úteis e CTA
- [ ] Contribuição original, revisão factual e revisão comercial estão registradas
- [ ] Claim estruturado referencia uma fonte existente; claim mutável registra
  data de acesso e escopo
- [ ] Gatilho/cadência de revisão e motivo substantivo das datas estão presentes
- [ ] Imagem declarada aponta para ativo local aprovado e tem alt adequado
- [ ] Draft ou review incompleto permanece fora de página, feed, sitemap e arquivos LLM

Esses checks não provam que uma fonte é verdadeira, que um texto é original ou
que uma promessa está autorizada. Um build aprovado não substitui os gates humanos.

## Gates humanos

### Verdade e revisão factual

- [ ] A revisão factual abriu as fontes e confirmou que cada claim respeita o escopo
- [ ] Fonte primária foi preferida; fonte secundária tem motivo registrado
- [ ] Estatística ou claim mutável informa período, população, geografia, unidade
  e demais limites aplicáveis, além da data de acesso
- [ ] Não há benchmark inventado, cliente inventado, resultado inventado,
  experiência inventada, integração inventada ou URL inventada
- [ ] Opinião, hipótese, observação e fato estão identificáveis pelo leitor

### Adequação comercial

- [ ] A revisão comercial preserva “IA comercial” como categoria e não revive o
  posicionamento descartado de “CRM comercial”
- [ ] CTA e URL owner respeitam o estágio da jornada e não canibalizam landing pages
- [ ] Demo confirmada, qualificação humana e venda continuam eventos distintos
- [ ] Não há promessa universal de performance, autonomia, economia ou resultado
- [ ] Não há promessa de ranking nem promessa de citação por mecanismo generativo

### Originalidade e anti-plágio

- [ ] A contribuição original é concreta e perceptível, não uma paráfrase cosmética
- [ ] A revisão anti-plágio comparou o texto com as fontes e materiais de referência
- [ ] Citação literal é excepcional, curta, atribuída e compatível com o direito de uso
- [ ] Não há plágio, tradução disfarçada, experiência atribuída sem prova ou autoria falsa
- [ ] A identidade publicada tem identidade e perfil aprovados; bio e credencial são reais

### Utilidade, SEO e GEO

- [ ] A peça responde à intenção com HTML acessível, canonical coerente e fontes claras
- [ ] Comprimento, headings, links, imagens e keywords existem apenas quando ajudam o leitor
- [ ] Não se usa keyword density, word count mínimo, cota de headings, cota de links,
  “chunking” especial ou schema inventado como score de qualidade
- [ ] Passagens recuperáveis e citação amostral são hipóteses experimentais, não garantia
- [ ] `llms.txt` é complementar e não é descrito como atalho de indexação ou ranking

### Imagens, autoria e autorização

- [ ] Toda imagem declarada existe como ativo local aprovado e corresponde ao registro
- [ ] Texto alternativo descreve função/conteúdo; imagem decorativa está marcada como tal
- [ ] Não há foto, logo, depoimento, cliente ou resultado sem autorização verificável
- [ ] Autor e revisores são identidades aprovadas, com datas de aprovação registradas

## Gate de atualização

- [ ] A mudança responde a um gatilho real ou a uma reavaliação de risco documentada
- [ ] `modifiedAt` mudou apenas por alteração substantiva perceptível ao leitor
- [ ] Fonte substituída, claim corrigido ou recomendação alterada deixa evidência no PR
- [ ] Se a verdade não puder ser restabelecida, a peça vai para `archived`
- [ ] A próxima cadência/gatilho foi registrado sem fabricar “freshness”

## Saída do gate

Registre no PR: checks executados, revisores, data, evidências examinadas, pendências
e decisão `aprovar`, `retornar a draft/review` ou `arquivar`. Não gere texto de
aprovação automaticamente e não marque itens que não foram de fato verificados.

