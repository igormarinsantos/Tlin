# Plano — proposta de conteúdo por landing page de campanha

**✅ Implementado e no ar (2026-09-11)** — commits `2aa5181`..`556d8e1` no
`main`. PainSection + CampaignHero + FAQ reordenável pras 5 páginas,
testado desktop/mobile, home e `/demo` intocados.

Base: as 5 páginas já reaproveitam `MarketingLandingPage.tsx` inteiro (Hero →
TrustedBy → TextReveal → Features → RoiCalculator → Pricing → Testimonials →
FAQ → FooterBanner → Footer). Essa tabela propõe, **por página**, o que muda
além do Hero — sempre reaproveitando conteúdo real que já existe, nada
inventado. Onde não tem prova/feature específica disponível, marquei
explicitamente como lacuna em vez de forçar algo.

## Tabela de proposta

| Página | Dor a nomear (bloco novo, só copy) | Feature a priorizar (dos 4 cards existentes) | FAQ a subir pro topo | Observação |
|---|---|---|---|---|
| **/ia-whatsapp** | "Leads chegam no WhatsApp fora do horário comercial e ninguém responde a tempo — cada minuto de demora derruba a chance de fechar." | **f1** — *IA Respondendo em Segundos* (já é sobre velocidade de resposta, match direto) | q5 *(IA entende áudio?)* + q4 *(tempo pra ver lucro)* | Reordenar Features é só subir f1 pra primeiro (hoje já é o primeiro — nesse caso não muda nada, só confirma que a ordem atual já serve). |
| **/recuperacao-de-leads** | "O lead esfriou, ninguém ligou de volta, e a venda que já tava quase fechada some do radar." | **f1** — a descrição já fala em "garantir que nenhum cliente esfrie", é o card mais próximo que existe | q7 *(follow-up automático)* + q8 *(agenda sozinha)* | **Lacuna real**: não existe um card de Features dedicado a "recuperação/follow-up" — só aparece no FAQ. Pra essa página especificamente, o FAQ subindo pro topo compensa isso sem inventar feature nova. |
| **/crm-com-ia** | "Você gerencia lead em planilha, grupo de WhatsApp e CRM que ninguém atualiza — cada ferramenta a mais é um lugar a mais de perder venda." | **f2** — *IA Qualificando seu Lead* (é literalmente o card atrás da âncora `#crm`) | q3 *(integração Hubspot/RD)* + q1 *(erros/inventa preço)* | q3 já foi reescrita essa sessão pra liderar com "CRM próprio" — bate direto com a página. |
| **/infoprodutores** | "No dia do lançamento o WhatsApp trava de mensagem e o time não dá conta de qualificar quem realmente vai comprar." | **f3** — *IA Escalando seu Atendimento* (pico de volume) | q4 *(tempo pra ver lucro)* + q7 *(follow-up, pra quem sumiu no carrinho)* | Sem case real desse nicho ainda (decisão já tomada: copy genérica, sem prova falsa). |
| **/agentes-de-ia** | "Contratar e treinar mais um vendedor custa caro, demora meses, e o resultado ainda depende de quem tá on-line naquele dia." | Nenhum card único — essa página é sobre o mecanismo em si, os 4 cards já contam essa história juntos | q1 *(erros/inventa preço)* + q2 *(robô engessado)* | Único caso onde não reordenar nada é a proposta certa — a página existe pra mostrar o agente por inteiro. |

## Prova social (Testimonials) — lacuna transversal

Hoje os 4 depoimentos em `Testimonials.tsx` são genéricos, sem segmentação
por dor/vertical — não dá pra "priorizar" um pra cada página porque nenhum
fala especificamente de WhatsApp lento, lead frio, CRM manual, lançamento ou
substituição de vendedor. **Proposta: manter o mesmo pool nas 5 páginas por
enquanto** e tratar "depoimento segmentado por ângulo" como um item pra
quando houver esse tipo de prova real disponível — não é algo pra forçar
com o que já existe hoje.

## Resumo do que muda por página, tecnicamente

- **Novo**: 1 bloco de "Dor" (copy nova, ×3 idiomas) logo depois do Hero — o
  único conteúdo genuinamente novo desta rodada.
- **Reordenar**: dentro de `Features.tsx`, permitir opcionalmente que a
  página informe qual card vem primeiro (hoje a ordem é fixa pras 5 páginas).
- **Reordenar**: dentro de `Faq.tsx`, mesma lógica pras 2 perguntas de
  destaque por página.
- **Sem mudança**: TrustedBy, RoiCalculator, Pricing, Testimonials,
  FooterBanner, Footer — continuam idênticos em todas as páginas.

## Seção "Dor" — texto + imagem, página por página

Achado importante olhando o código: cada card de Features **já vem pareado
com uma animação própria**, feita e funcionando hoje no ar:

| Card | Animação já pareada a ele | O que ela mostra |
|---|---|---|
| f1 — Respondendo em Segundos | `ObjectionAnimation` | Chat simulando alguém hesitando no preço, a IA contornando e fechando a venda |
| f2 — Qualificando/CRM | `WhatsAppQualifyAnimation` | Conversa de WhatsApp ao vivo qualificando um lead e mandando pro CRM |
| f3 — Escalando Atendimento | `SalesNotification` | Toasts ambientes de "Fulano acabou de comprar via WhatsApp" em sequência |
| f4 — Funil | `FunnelAnimation` | Kanban/pipeline com colunas "Novos Leads → IA em Ação → Pronto pra Reunião" |

Isso é exatamente a "mesma estrutura, não igual mas parecida" que você
pediu: em vez de criar imagem nova, cada bloco de Dor reaproveita a
animação que **narrativamente** mais bate com aquela dor específica —
independente de qual card de Features fica em primeiro naquela página.

**Atualização**: a pedido do Igor, a Dor agora lidera com **dado de mercado**
(não Tlin-específico — a empresa é nova, não tem base própria nessa escala
ainda) + **disclaimer embaixo**, no mesmo espírito do disclaimer que já
existe no RoiCalculator ("simulação baseada em... resultados variam
conforme sua operação"). Só usei número onde encontrei estatística real e
amplamente citada no setor — nas 2 onde não tenho uma base sólida, marquei
isso explicitamente em vez de inventar um número bonito.

| Página | Headline com dado (proposta) | Corpo | Disclaimer |
|---|---|---|---|
| **/ia-whatsapp** | **"Responder na 1ª hora torna a venda até 7x mais provável."** | Depois de 24h sem resposta, a chance de qualificar esse lead despenca. Cada mensagem que espera é uma venda que esfria. | *Dado de mercado (estudo Oldroyd/Harvard Business Review sobre tempo de resposta a leads), não específico da Tlin. Resultados variam conforme sua operação. |
| **/recuperacao-de-leads** | **"80% das vendas exigem pelo menos 5 follow-ups — mas 44% dos vendedores desistem depois do 1º."** | O lead não disse não. Só parou de responder — e sem alguém pra retomar no momento certo, essa venda nunca mais aparece. | *Dado de mercado amplamente citado em treinamentos de vendas (National Sales Executive Association), não específico da Tlin. |
| **/crm-com-ia** | **"Empresas que usam CRM de forma consistente reportam até 29% mais vendas."** | Planilha, grupo de WhatsApp e CRM que ninguém atualiza são 3 lugares diferentes pra um lead se perder. | *Dado de mercado (Salesforce, State of Sales), não específico da Tlin. Resultados variam conforme o segmento. |
| **/infoprodutores** | **"O abandono de carrinho no e-commerce chega a 70% — falta de resposta rápida é um dos motivos."** | No dia do lançamento, cada mensagem que demora a ser respondida é uma venda que pode esfriar antes do carrinho fechar. | *Dado de mercado (Baymard Institute, média de abandono de carrinho), não específico de infoprodutos nem da Tlin. |
| **/agentes-de-ia** | **"Responder na 1ª hora torna a venda até 7x mais provável."** *(igual à de /ia-whatsapp — decisão do Igor: o mecanismo é o mesmo, é IA conversacional respondendo em tempo real, seja no papel de "atendimento" ou de "agente/vendedor")* | Um agente de IA responde nessa velocidade 24/7 — sem folga, sem precisar contratar e treinar mais gente pra dar conta do volume. | *Dado de mercado (estudo Oldroyd/Harvard Business Review sobre tempo de resposta a leads), não específico da Tlin. Resultados variam conforme sua operação. |

### Onde isso entra tecnicamente (se topar)

Um componente novo (ex.: `components/PainSection.tsx`), com props de
texto (headline/corpo, ×3 idiomas) + qual dessas 4 animações renderizar,
entrando em `MarketingLandingPage.tsx` logo depois do Hero — só quando a
página tiver uma `variant` de campanha (mesmo padrão do `Hero`: sem
`variant`, home/`/demo`/`/comece` continuam idênticos a hoje).

## Hero das LPs — layout dividido (conteúdo esquerda / motion direita)

Hoje `Hero.tsx` é uma coluna só, centralizada (título com efeito de
digitação + mascote que segue o mouse) — usada igual na home e nas 5
campanhas, só o texto muda via `variant`. Proposta: **só nas 5 páginas de
campanha**, virar duas colunas — texto à esquerda (headline, subtítulo,
CTA), animação à direita — sem tocar no Hero atual da home/`/demo`/`/comece`.

Reaproveitando o mesmo pool de 4 animações já existentes (não é feature
nova, é o mesmo widget aparecendo de novo, agora no topo da página):

| Página | Motion no Hero (proposta) | Igual ao da seção Dor? |
|---|---|---|
| **/ia-whatsapp** | `WhatsAppQualifyAnimation` | Sim — reforça a mesma prova (resposta instantânea) já no primeiro scroll |
| **/recuperacao-de-leads** | `ObjectionAnimation` | Sim — mostra a recuperação acontecendo antes mesmo de explicar a dor |
| **/crm-com-ia** | `FunnelAnimation` | Sim — o pipeline organizado como primeira impressão |
| **/infoprodutores** | `WhatsAppQualifyAnimation` | Não — Dor usa `SalesNotification` (volume/energia), Hero mostra o mecanismo atendendo |
| **/agentes-de-ia** | `ObjectionAnimation` | Sim — o agente fechando venda como um closer, já na primeira dobra |

Fiquei na dúvida entre repetir o mesmo widget no Hero e na seção Dor
(reforça a mesma prova duas vezes, pode ser bom ou repetitivo) ou variar
sempre — deixei a maioria repetindo por consistência de mensagem, e só
variei em `/infoprodutores` pra não repetir a mesma coisa duas vezes tão
perto uma da outra. Me diz se prefere variar mais.

### Onde isso entra tecnicamente

Um `Hero.tsx` de 616 linhas já é bastante frágil (mascote que segue o
mouse, animação de digitação char-a-char) pra arriscar enfiar um segundo
layout dentro dele. Proposta: **componente novo** `components/CampaignHero.tsx`,
usado só pelas 5 páginas de campanha no lugar de `<Hero variant={...} />`
— zero risco pro Hero da home/`/demo`/`/comece`, que continua exatamente
como está. Layout: grid 2 colunas no desktop (texto | motion), empilhado
no mobile (texto em cima, motion embaixo, ou motion escondido se ficar
muito longo de rolagem — a decidir olhando na prática).

## Decisões já confirmadas com o Igor

- ✅ Hero dividido (texto esquerda / motion direita) nas 5 páginas, via
  `CampaignHero.tsx` novo — home/`/demo`/`/comece` intocados.
- ✅ Animações escolhidas fazem sentido — ajustamos ao longo se precisar.
- ✅ Repetir o mesmo motion no Hero e na Dor da mesma página, por
  consistência.
- ✅ Dor lidera com dado de mercado + disclaimer (estilo do disclaimer já
  usado no RoiCalculator), não dado específico da Tlin.
- ✅ `/agentes-de-ia` usa o mesmo dado de `/ia-whatsapp` (mesmo mecanismo —
  IA conversacional respondendo em tempo real).
- ✅ Lacuna de Features em `/recuperacao-de-leads`: compensar só subindo o
  FAQ certo, sem criar feature nova.
- ✅ Testimonials: mantém o mesmo pool nas 5 por enquanto (sem prova
  segmentada real disponível ainda).

**Pronto pra implementar.** Próximo passo: escrever as 5 versões ×3 idiomas
(PT/EN/ES) dos textos de Dor + disclaimer, criar `CampaignHero.tsx` e
`PainSection.tsx`, e reordenar o FAQ só em `/recuperacao-de-leads`.
5. Topa a lacuna do card de Features em `/recuperacao-de-leads` (compensar só
   com FAQ), ou prefere que eu pense em uma forma de destacar follow-up
   visualmente ali sem criar feature nova?
6. Confirma manter Testimonials igual nas 5 por enquanto?
