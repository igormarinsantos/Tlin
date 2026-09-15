# Project Research Summary

**Project:** Tlin — Otimização Contínua do Funil Comercial
**Domain:** LP B2B de IA comercial orientada a demo e venda
**Researched:** 2026-09-15
**Confidence:** HIGH

## Executive Summary

A Tlin já possui a base certa: uma landing em Next.js, qualificação, agenda, CRM, atribuição UTM e canais de e-mail. O próximo ciclo deve ser de conversão, não de reconstrução. A melhor estratégia é tornar a proposta mais concreta para negócios que já têm volume no WhatsApp: em vez de apenas enumerar IA, CRM e follow-up, mostrar como um lead percorre a operação e onde a equipe humana acompanha o resultado.

Para tráfego pago, orgânico e de parceiros, a página de entrada precisa corresponder à promessa que trouxe o visitante e chegar rapidamente à prova e ao CTA de demo. A orientação oficial do Google Ads reforça que relevância entre anúncio, landing page e CTA, experiência mobile e navegação simples afetam a experiência de destino e os resultados de campanha.

A métrica deve fechar o ciclo: origem → lead → lead qualificado → demo → venda. GA4 permite eventos recomendados de geração de lead e fechamento; para mídia paga, o caminho maduro é receber estados/valores de CRM e não selecionar vencedores apenas pelo formulário. A página de obrigado é parte desse funil: confirma a agenda, reforça autoridade e oferece WhatsApp como suporte opcional, sem desviar da demo.

## Key Findings

### Recommended Stack

Não é necessário trocar a base técnica. Usar Next.js 16.3.5, React 19, Tailwind, componentes existentes e a estrutura App Router reduz risco e preserva performance/SEO. A evolução deve adicionar rotas e componentes de conversão; integrações já existentes continuam sendo a fonte operacional.

**Core technologies:**
- **Next.js**: novas páginas, metadata e rotas — já adotado e validado.
- **GA4/GTM + UTM**: eventos e atribuição — já presentes, precisam de taxonomia de funil.
- **Supabase + Deskcomm**: histórico de lead e operação de demo — base para conectar resultado comercial.

### Expected Features

**Must have (table stakes):**
- Mensagem e CTA coerentes com a origem do tráfego.
- Prova compreensível do que acontece com o lead antes da demo.
- Páginas “Como funciona”, “Planos” e um pós-conversão que não seja beco sem saída.
- Métricas que não terminam no formulário.

**Should have (competitive):**
- Demonstração visual da operação inteira.
- Acompanhamento humano explícito como parte da proposta.
- WhatsApp opcional e contextual no pós-conversão.

**Defer (v2+):**
- Personalização profunda por segmento e calculadora de benchmarks antes de dados próprios confiáveis.

### Architecture Approach

As novas páginas devem ser rotas leves do App Router que montam componentes reutilizáveis. A demonstração deve existir como cenas guiadas e responsivas, não como um CRM simulado completo. A instrumentação deve preservar origem e identificar cada etapa até o CRM informar qualidade, presença e venda.

**Major components:**
1. **Páginas de intenção** — alinhamento de promessa, prova e CTA.
2. **Demonstração de processo** — visualiza jornada do lead e atuação humana.
3. **Pós-conversão** — confirma, educa e facilita suporte opcional.
4. **Medição de ciclo fechado** — une aquisição ao desfecho comercial.

### Critical Pitfalls

1. **Otimizar para formulário, não para venda** — ligar origem aos estágios reais de CRM.
2. **Mostrar produto sem evidenciar a operação humana** — demonstrar quem acompanha e o que ocorre depois da IA.
3. **Transformar o obrigado em distração** — manter a demo como próximo passo principal; WhatsApp é opcional.
4. **Usar resultados genéricos como prova** — só publicar números com contexto e fonte defensável.

## Implications for Roadmap

### Phase 1: Instrumentação comercial do funil
**Rationale:** sem definição de sucesso, páginas novas só deslocam cliques.
**Delivers:** taxonomia de eventos e pontos de integração para acompanhar origem, qualificação, demo e venda.
**Addresses:** medição de etapa e origem.
**Avoids:** otimização por formulário barato.

### Phase 2: Pós-conversão e confiança
**Rationale:** aproveita o tráfego/qualificação existentes e reduz incerteza logo após a ação principal.
**Delivers:** página de obrigado com confirmação, autoridade, impacto contextual e WhatsApp opcional.
**Addresses:** continuidade do funil e presença em demo.
**Avoids:** página de obrigado como beco sem saída.

### Phase 3: Como funciona — prova da operação
**Rationale:** a demonstração de processo é a peça de entendimento e diferenciação antes de ampliar a aquisição.
**Delivers:** página guiada que mostra jornada do lead, IA, CRM, follow-up e equipe humana.
**Addresses:** prova concreta de produto/serviço.
**Avoids:** catálogo de features sem resultado ou CRM fake complexo.

### Phase 4: Planos e decisão de fit
**Rationale:** depois de provar operação e resultado, organizar planos facilita a autoqualificação e a conversa comercial.
**Delivers:** página de planos contextualizada por fit e CTA de demo.
**Addresses:** decisão de compra e qualificação de intenção.
**Avoids:** comparação de preço sem contexto.

### Phase 5: Otimização por origem e experimento
**Rationale:** usa dados das fases anteriores para adaptar mensagem, prova e CTA aos melhores canais/segmentos.
**Delivers:** hipóteses e variantes mensuráveis para anúncio, social e parceiros.
**Addresses:** alinhamento entre campanha e landing.
**Avoids:** mudanças visuais sem hipótese ou métrica.

### Phase Ordering Rationale

- Medição vem antes de otimização porque o objetivo é venda, não volume.
- A página de obrigado depende pouco de wireframe futuro e reforça imediatamente o fluxo existente.
- “Como funciona” estabelece a narrativa/prova que “Planos” precisa para não reduzir a decisão a preço.
- Variações por origem só entram após um baseline e uma taxonomia de resultados.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** contrato de dados entre Deskcomm/CRM, Supabase, GA4 e Google Ads deve ser confirmado antes de implementação.
- **Phase 3:** wireframes, capturas autorizadas e a mensagem de acompanhamento humano precisam de decisão de produto antes de construir.

Phases with standard patterns:
- **Phase 2:** confirmação pós-conversão e CTA contextual usam padrões conhecidos.
- **Phase 4:** rota de planos e CTA aproveitam o stack/fluxo existente.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | confirmado no código-base e documentação da Vercel. |
| Features | HIGH | alinhado ao objetivo declarado e às práticas de relevância/conversão do Google Ads. |
| Architecture | HIGH | baseado na arquitetura atual e em limites claros do repositório. |
| Pitfalls | HIGH | convergência entre funil declarado, código atual e documentação oficial de Ads/Analytics. |

**Overall confidence:** HIGH

### Gaps to Address

- **Wireframes e estratégia de conteúdo:** decidir antes de planejar a página “Como funciona” e “Planos”.
- **Dados de CRM:** definir quais estados de lead/venda podem retornar e por qual integração antes da Fase 1.
- **Provas numéricas:** só usar ganhos de custo/eficiência depois de validar origem, contexto e permissão de publicação.

## Sources

### Primary (HIGH confidence)
- [Google Ads: otimizar anúncios e landing pages](https://support.google.com/google-ads/answer/6238826) — correspondência de mensagem, CTA e experiência mobile.
- [Google Ads: valores de conversão](https://support.google.com/google-ads/answer/13063108) — conversões offline/CRM para leads qualificados e fechados.
- [Google Analytics: eventos recomendados](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) — `generate_lead` e eventos de fechamento.
- [Vercel: environment variables](https://vercel.com/kb/guide/how-to-add-vercel-environment-variables) — variáveis e redeploy.

---

*Research completed: 2026-09-15*
*Ready for roadmap: yes*
