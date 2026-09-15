# Architecture Research

**Domain:** LP B2B de IA comercial e conversão de demo
**Researched:** 2026-09-15
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
Aquisição (anúncios, social, parceiros)
                |
                v
Páginas de intenção (home / como funciona / planos)
                |
                v
CTA único de demo -> qualificação -> agenda
                |
                v
Pós-conversão (confirmação, autoridade, WhatsApp opcional)
                |
                v
CRM + resultado de venda -> analytics e otimização de origem
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Páginas de intenção | alinhar promessa, segmento e prova ao tráfego | rotas App Router finas que reutilizam seções em `components/` |
| Demonstração de processo | revelar o que acontece com um lead e onde a equipe humana atua | componente guiado, visual e responsivo; não um CRM funcional paralelo |
| Qualificação/agendamento | capturar fit e reservar demo | `LeadQualificationPopup` e rotas existentes |
| Página de obrigado | reduzir incerteza, reforçar valor e oferecer WhatsApp opcional | rota dedicada carregada após submissão/agenda bem-sucedida |
| Camada de medição | ligar campanha, evento, qualidade, demo e venda | `lib/utm.ts`, GA4/GTM e atualização de estados originada pelo CRM |

## Recommended Project Structure

```text
app/
├── como-funciona/page.tsx  # rota de demonstração de processo
├── planos/page.tsx         # rota de oferta e caminho para demo
├── obrigado/page.tsx       # rota pós-conversão
└── api/                    # apenas endpoints que validam ou recebem estado
components/
├── product-demo/           # cenas visuais reutilizáveis da jornada
├── conversion/             # blocos de CTA/prova/pós-conversão
└── lead-qualification/     # UI já separada do wizard
lib/
├── utm.ts                  # atribuição e eventos
└── conversion.ts           # futuro helper puro para nomes/payloads de eventos
```

### Structure Rationale

- **`app/`:** cada página é uma intenção de compra distinta e deve ter URL, metadata e tracking próprios.
- **`components/product-demo/`:** evita transformar uma única página em componente monolítico e permite reaproveitar cenas na home.
- **`lib/`:** mantém a taxonomia de eventos independente de um componente visual.

## Architectural Patterns

### Pattern 1: promessa correspondente à origem

**What:** a mensagem inicial e a prova visível refletem a promessa do anúncio, conteúdo ou parceiro que trouxe o visitante.
**When to use:** em rotas específicas ou variantes de hero de campanha.
**Trade-offs:** mais variantes exigem disciplina de conteúdo e medição por origem.

### Pattern 2: narrativa de operação, não catálogo de recursos

**What:** a demonstração visual segue o lead pelo processo comercial e mostra a intervenção humana.
**When to use:** página “Como funciona” e blocos de prova na home.
**Trade-offs:** exige cenas e copy precisas; é melhor do que tentar replicar todas as telas reais do produto.

### Pattern 3: medição de ciclo fechado

**What:** cada identificador de lead preserva origem/UTM até o CRM informar qualificação, demo e venda.
**When to use:** antes de otimizar orçamento ou promessas por canal.
**Trade-offs:** exige contrato de dados com o CRM, mas evita escolher campanhas por formulários baratos.

## Data Flow

### Request Flow

```text
Anúncio/Conteúdo/Parceiro
    ↓
Página com UTM → CTA → qualificação → POST /api/notify
    ↓                         ↓
GA4/GTM                 Supabase + Deskcomm
    ↓                         ↓
Relatório por origem ← estado de demo/venda no CRM
```

### State Management

- Use estado local para cenas e interação da página.
- Use URL/UTM persistida para origem; não passe informações de venda por parâmetros públicos.
- Use dados confirmados pelo CRM como fonte de verdade para qualificado, demo e venda.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k leads/mês | monólito Next + Supabase/Deskcomm atual é suficiente; foco em instrumentação e clareza. |
| 1k-100k leads/mês | mover rate limit para serviço distribuído e automatizar ingestão de estados do CRM. |
| 100k+ leads/mês | separar pipeline analítico e eventos de conversão do caminho síncrono de envio de lead. |

## Anti-Patterns

### Anti-Pattern 1: página de obrigado como beco sem saída

**What people do:** mostram apenas “recebemos seus dados”.
**Why it's wrong:** perde o momento de maior intenção e não reduz no-show.
**Do this instead:** confirmar o próximo passo, reafirmar prova e oferecer WhatsApp de maneira opcional.

### Anti-Pattern 2: usar animação sem mensagem comercial

**What people do:** criam efeitos visuais que não explicam o produto.
**Why it's wrong:** aumenta peso e distração sem ampliar entendimento.
**Do this instead:** cada cena deve responder “o que ocorre com o meu lead e quem acompanha?”.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GA4/GTM | eventos de lead e eventos customizados de etapas | padronizar nomes e validar no DebugView. |
| Deskcomm | agenda e futuro retorno de estágio comercial | definir identificador de correlação antes de importar vendas. |
| Supabase | histórico do lead e payload de atribuição | evitar gravar credenciais ou dados desnecessários no cliente. |

## Sources

- [Google Ads: landing page e anúncio](https://support.google.com/google-ads/answer/6238826) — relevância, CTA correspondente e experiência mobile.
- [Google Ads: experiência de destino](https://support.google.com/adspolicy/answer/16427615) — destino funcional e fácil de navegar.
- [Google Analytics: configurar eventos](https://developers.google.com/analytics/devguides/collection/ga4/events) — uso de eventos recomendados e customizados.

---

*Architecture research for: LP B2B de IA comercial e conversão de demo*
*Researched: 2026-09-15*
