# Feature Landscape

**Domain:** LP B2B de IA comercial orientada a demo e venda
**Researched:** 2026-09-15

## Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Mensagem alinhada à origem do tráfego | Tráfego de anúncios abandona rapidamente quando promessa e página divergem | Média | Criar variações de entrada sem duplicar o funil. |
| Prova clara do que o produto faz | Compradores B2B precisam entender a operação antes de aceitar uma demo | Média | Mostrar jornada de lead, IA, CRM e equipe humana. |
| CTA de demo evidente e rápido no mobile | É a ação comercial principal | Baixa | Reutilizar o fluxo qualificador atual. |
| Páginas de “Como funciona” e “Planos” | Diminuem lacunas de entendimento e intenção | Média | Não devem virar documentação extensa nem tabela sem contexto. |
| Pós-conversão útil | Confirma o próximo passo e reduz incerteza após enviar dados | Média | A página de obrigado deve reforçar autoridade e manter a demo como objetivo. |
| Medição de etapa e origem | Sem ligação com CRM, a LP otimiza somente volume | Média | Manter UTM e identificar lead, demo e venda. |

## Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Demonstração visual da operação inteira | Vende resultado operacional, não uma lista abstrata de recursos | Média | Fluxo: lead chega → IA atende → CRM/follow-up → acompanhamento humano → venda. |
| Acompanhamento humano explícito | Diferencia Tlin de ferramenta “self-service” ou chatbot isolado | Baixa/Média | Mostrar responsabilidades e momentos de intervenção humana. |
| Página de obrigado com impacto e WhatsApp opcional | Aumenta confiança sem substituir a reunião agendada | Média | WhatsApp deve ser escolha, nunca barreira ou desvio obrigatório. |
| Prova de eficiência contextual | Move conversa de “funcionalidades” para valor comercial | Média | Só usar números sustentáveis/atribuíveis; evitar promessa universal. |

## Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Reconstruir todo o CRM em uma demo fake | Custo alto e distância do objetivo de conversão | Fazer uma narrativa guiada de poucas cenas que prova o processo. |
| Vários CTAs concorrentes acima da dobra | Dilui o caminho para demo | Um CTA principal; WhatsApp apenas como opção de suporte no pós-conversão. |
| Prometer economia/resultado sem contexto | Prejudica confiança e pode atrair leads sem fit | Usar faixas, cenários e condicionais ligados a volume/processo. |
| Medir só clique e formulário | Otimiza leads baratos, não vendas | Fechar o ciclo com estados de CRM para qualificado, demo, ganho/perdido. |

## Feature Dependencies

```text
Proposta por origem de tráfego
    └── melhora entendimento da oferta
            └── aumenta início de qualificação
                    └── aumenta demo agendada
                            └── permite medir venda via CRM

Página de obrigado
    └── requer confirmação de submissão/demo
            └── reforça presença e comparecimento
```

## MVP Definition

### Launch With (v1)

- [ ] Página “Como funciona” com demonstração guiada da jornada e acompanhamento humano.
- [ ] Página “Planos” com contexto de valor e caminho explícito para demo.
- [ ] Página de obrigado pós-formulário com confirmação, prova de impacto e CTA opcional de WhatsApp.
- [ ] Eventos/estados que conectem origem, lead qualificado, demo e venda.

### Add After Validation (v1.x)

- [ ] Variações de landing por campanha/origem — ativar quando houver dados suficientes por canal.
- [ ] Personalização de prova por segmento — ativar após validar os segmentos de maior conversão.

### Future Consideration (v2+)

- [ ] Calculadora avançada por setor — adiar até haver benchmarks próprios confiáveis.
- [ ] Biblioteca de cases detalhados — adiar até existirem provas autorizadas e comparáveis.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Página de obrigado orientada a próxima ação | HIGH | MEDIUM | P1 |
| Demonstração “Como funciona” | HIGH | MEDIUM | P1 |
| Medição de lead → venda | HIGH | MEDIUM/HIGH | P1 |
| Página “Planos” | HIGH | MEDIUM | P1 |
| Variantes por canal | MEDIUM/HIGH | MEDIUM | P2 |

## Sources

- [Google Ads: otimizar anúncios e landing pages](https://support.google.com/google-ads/answer/6238826) — relevância entre anúncio, página e CTA; prioridade de mobile, clareza e navegação simples.
- [Google Ads: avaliar performance de landing pages](https://support.google.com/google-ads/answer/7543502) — acompanhamento regular de performance e experiência mobile.
- [Google Analytics: eventos recomendados](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) — `generate_lead` para aquisição e `close_convert_lead` para fechamento.

---

*Feature research for: LP B2B de IA comercial e conversão de demo*
*Researched: 2026-09-15*
