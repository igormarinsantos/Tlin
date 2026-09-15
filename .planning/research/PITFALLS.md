# Pitfalls Research

**Domain:** LP B2B de IA comercial e conversão de demo
**Researched:** 2026-09-15
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Otimizar para formulário em vez de venda

**What goes wrong:** campanhas parecem eficientes porque geram muitos contatos, mas trazem baixo fit e poucas vendas.
**Why it happens:** a LP tem eventos de clique/formulário, porém não recebe o resultado comercial do CRM.
**How to avoid:** definir uma taxonomia de lead, demo e venda; manter origem até o resultado e usar esses estados para análise e mídia.
**Warning signs:** custo por lead cai enquanto taxa de demo ou fechamento cai.
**Phase to address:** Medição do funil.

---

### Pitfall 2: Prova de produto sem contexto humano

**What goes wrong:** o visitante entende que há IA, mas teme uma automação abandonada ou genérica.
**Why it happens:** páginas mostram telas/recursos isolados e não explicam implantação, acompanhamento e responsabilidade humana.
**How to avoid:** demonstrar o processo completo, destacar pontos de acompanhamento humano e usar provas específicas.
**Warning signs:** objeções de confiança ou perguntas repetidas sobre “quem vai configurar/acompanhar?”.
**Phase to address:** Página “Como funciona”.

---

### Pitfall 3: Página de obrigado que compete com a demo

**What goes wrong:** WhatsApp ou múltiplos CTAs desviam o visitante da reunião que acabou de agendar.
**Why it happens:** a página trata o pós-formulário como nova aquisição, não como continuidade do compromisso.
**How to avoid:** tornar confirmação e preparação para demo o conteúdo principal; WhatsApp fica claramente opcional.
**Warning signs:** aumento de conversas sem confirmação de agenda ou queda de presença.
**Phase to address:** Pós-conversão.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Criar nova página copiando a home | velocidade aparente | copy, tracking e UI divergem | Nunca; reutilizar composição/seções. |
| Criar números de eficiência sem origem | impacto visual rápido | perda de confiança e risco comercial | Nunca. |
| Usar somente analytics do browser | implementação simples | não mede venda nem qualificação real | Apenas até o CRM expor estágios. |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GA4 | chamar qualquer clique de conversão final | separar `generate_lead`, demo agendada, qualificado e fechamento. |
| Google Ads | otimizar campanhas com conversão de topo apenas | importar ou associar conversões offline/CRM quando houver dados confiáveis. |
| Vercel | adicionar variável e esperar que o deploy antigo leia o valor | redeploy após criar/alterar variável. |
| Deskcomm | tratar agendamento como venda | registrar agenda, presença, qualificação e ganho como estados distintos. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Vídeo/animação pesada acima da dobra | mobile lento e queda de conversão | compressão, poster, lazy load e teste em rede móvel | imediatamente em tráfego pago mobile. |
| Demonstração que monta tudo de uma vez | long tasks/hidratação cara | renderizar cenas sob demanda e reutilizar assets | ao adicionar múltiplos efeitos/medias. |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Inserir segredo do CRM/Turnstile no componente cliente | credencial exposta | somente variáveis `NEXT_PUBLIC_` podem chegar ao browser. |
| Enviar evento de venda com dados pessoais para analytics sem revisão | privacidade/compliance e dados ruins | transmitir identificadores mínimos e revisar payloads. |
| Confiar apenas no limite local de API | abuso em várias instâncias | manter limite Cloudflare e usar proteção distribuída quando necessário. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Explicar IA com jargão | visitante não entende valor | narrar o que acontece com o lead real. |
| Planos sem ajuda de escolha | visitante compara preço sem entender fit | ligar cada plano/caminho a volume, operação e demo. |
| CTA de WhatsApp obrigatório | cria atrito e desvia do processo | manter como opção de suporte no momento certo. |

## "Looks Done But Isn't" Checklist

- [ ] **Página “Como funciona”:** visual bonito sem mensagem sobre acompanhamento humano — verificar que cada cena explica responsabilidade e resultado.
- [ ] **Página “Planos”:** preços/tiers sem CTA de demo e sem critério de fit — verificar caminho de conversão.
- [ ] **Página de obrigado:** confirmação sem próximo passo ou prova — verificar reforço de agenda e autoridade.
- [ ] **Analytics:** evento de formulário sem retorno comercial — verificar conexão com estados do CRM.

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Métrica de topo | Medição do funil | origem, lead, demo e venda distinguíveis em relatório. |
| Prova sem humano | Como funciona | usuário consegue explicar a jornada e o papel humano após ver a página. |
| Pós-conversão disperso | Página de obrigado | confirmação é clara e WhatsApp não é obrigatório. |
| Tráfego desalinhado | Otimização de entrada | mensagem/CTA refletem a origem da campanha. |

## Sources

- [Google Ads: qualidade e landing page](https://support.google.com/google-ads/answer/156066) — relevância e experiência de página fazem parte da qualidade do anúncio.
- [Google Ads: valores de conversões](https://support.google.com/google-ads/answer/13063108) — recomenda enviar valores de leads qualificados/fechados vindos de CRM.
- [Vercel: environment variables](https://vercel.com/kb/guide/how-to-add-vercel-environment-variables) — variáveis requerem novo deploy.

---

*Pitfalls research for: LP B2B de IA comercial e conversão de demo*
*Researched: 2026-09-15*
