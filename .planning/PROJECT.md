# Tlin — Otimização Contínua do Funil Comercial

## What This Is

Tlin é uma landing page de uma operação de IA comercial para negócios que já recebem volume de leads pelo WhatsApp. O site apresenta agentes de IA, CRM, follow-up e agendamento, qualifica visitantes e busca transformar interesse em demonstrações e vendas, com acompanhamento de uma equipe humana real.

Este ciclo não reconstrói a landing existente: evolui uma LP já posicionada com melhorias contínuas de mensagem, prova de produto, conversão e acompanhamento do funil.

## Core Value

Transformar tráfego com potencial comercial em leads qualificados, demos agendadas e vendas para negócios com volume de WhatsApp.

## Business Context

- **Customer**: negócios que já recebem volume de leads no WhatsApp e precisam qualificar, responder e vender melhor.
- **Revenue model**: venda consultiva da operação/plataforma de IA comercial após demonstração.
- **Success metric**: conversão de leads com potencial comercial em vendas; demos agendadas são a principal etapa intermediária.
- **Strategy notes**: tráfego inicial vem de anúncios pagos, mídia social orgânica e parceiros.

## Requirements

### Validated

- ✓ Landing pública com páginas de campanha e posicionamento de IA comercial — existente antes deste ciclo.
- ✓ Captação e qualificação conversacional de leads, consulta de disponibilidade e agendamento de demo — existente antes deste ciclo.
- ✓ Integração operacional com Supabase, Deskcomm, SMTP e atribuição UTM — existente antes deste ciclo.
- ✓ Proteções iniciais de transporte e abuso para rotas públicas — adicionadas no commit `18d174a`.

### Active

- [ ] Evoluir a LP com melhorias contínuas orientadas por leads qualificados, demos e vendas.
- [ ] Criar uma página “Como funciona” que demonstre a operação comercial completa e o acompanhamento humano.
- [ ] Criar uma página “Planos” que ajude visitantes com fit a avançar para a demonstração.
- [ ] Criar uma página de obrigado pós-formulário que confirme o próximo passo, reforce autoridade com impacto mensurável e ofereça WhatsApp opcional.
- [ ] Melhorar a visibilidade do funil para acompanhar qualidade de lead, demos agendadas e conversão em venda.

### Out of Scope

- Reconstruir a landing do zero — a estrutura atual já é a base do trabalho; o foco é evolução orientada a conversão.
- Criar um produto CRM novo neste repositório — o CRM operacional está fora deste código-base; aqui é a experiência de aquisição e conversão.
- Tratar volume de formulários como métrica final — o objetivo é qualidade comercial e venda, não apenas captação.

## Context

- O repositório é uma aplicação Next.js 16.3.5 / React 19 hospedada na Vercel e entregue em `https://tlin.ia.br`.
- A arquitetura e os riscos atuais foram mapeados em `.planning/codebase/` em 2026-09-15.
- O fluxo atual já agenda demos, mas a página de obrigado deve prolongar a decisão com autoridade, ganhos de eficiência/custo e um atalho opcional para WhatsApp.
- A futura demonstração visual deve mostrar a jornada inteira: tráfego chega, IA atende e qualifica no WhatsApp, CRM/follow-up conduzem o processo e uma equipe humana acompanha a operação.
- Wireframes e estratégia detalhada para as novas páginas ainda serão definidos com o dono do produto.

## Constraints

- **Base existente**: preservar a LP já posicionada e evoluir incrementos com baixo risco de regressão.
- **Foco comercial**: priorizar decisões que impactem qualidade de lead, demo e venda em vez de métricas de vaidade.
- **Produto externo**: o CRM e a operação comercial não vivem neste repositório; as páginas devem demonstrá-los sem assumir uma reconstrução deles aqui.
- **Deploy**: `main` publica automaticamente pela Vercel; alterações que afetem produção exigem confirmação explícita.
- **Segurança**: segredos permanecem em variáveis de ambiente; Turnstile será ativado após configuração das chaves de produção.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Evoluir a LP existente, sem reconstrução | A estrutura e o posicionamento atuais já estão prontos | — Pending |
| Priorizar negócios com volume de WhatsApp | É onde a proposta de IA comercial tem maior aderência | — Pending |
| Demonstrar processo + acompanhamento humano | Diferencia a oferta de uma simples ferramenta de software | — Pending |
| Criar “Como funciona”, “Planos” e página de obrigado | Fecha lacunas de entendimento, intenção e pós-conversão do funil | — Pending |
| Medir vendas e qualidade comercial | Evita otimização só para volume de leads | — Pending |

## Evolution

Após cada fase, revisar requisitos validados, escopo ativo, decisões e se esta descrição continua fiel ao produto. Requisitos só passam a validados após implementação, verificação e confirmação de valor.

---

*Last updated: 2026-09-15 after initial project definition*
