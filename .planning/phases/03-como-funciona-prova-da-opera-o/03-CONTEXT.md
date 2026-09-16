# Phase 03: Como Funciona — Prova da Operação - Context

**Gathered:** 2026-09-16
**Status:** Ready for visual planning

<domain>
## Phase Boundary

Explicar diretamente ao visitante como a Tlin funciona para a sua operação: o que a IA executa diariamente, o que o fundador faz para adaptá-la e melhorá-la, e o que o cliente recebe. A página é uma apresentação de entrega e identidade da Tlin, não um dashboard de produto nem uma página de organograma.

</domain>

<decisions>
## Implementation Decisions

### Narrativa e voz
- **D-01:** A página fala diretamente com o cliente: “na sua operação”, “você recebe” e “a IA faz”. Evitar narrativa institucional genérica.
- **D-02:** A sequência de valor é: o que a IA faz → o que a Tlin faz para a IA funcionar no contexto do cliente → o que o cliente recebe.
- **D-03:** O conteúdo deve ser percebido como uma página “quem somos” orientada por entrega, sem se tornar uma demonstração de painel ou CRM.

### Prova humana e marca
- **D-04:** A prova humana será individual e founder-led: foto do Igor, fundador da Tlin, em vez de apresentar uma equipe grande ou mutável.
- **D-05:** O mascote Tlin deve aparecer como “funcionário digital”: a personificação da IA que atende, qualifica e não deixa lead esperando.
- **D-06:** A apresentação do fundador será em primeira pessoa, para transmitir proximidade e responsabilidade direta: “Eu entendo sua operação…”.

### Sistema visual
- **D-07:** A página deve reutilizar rigorosamente o sistema visual da index: composição editorial, `GlobalBackground`, seções claras, eyebrow animado existente, tipografia, cards e CTAs já usados. Não criar estética de dashboard/IA escura isolada.

</decisions>

<canonical_refs>
## Canonical References

- `.planning/PROJECT.md` — posicionamento e foco comercial.
- `.planning/ROADMAP.md` — requisitos COMO-01, COMO-02 e COMO-03.
- `components/MarketingLandingPage.tsx` — composição e wrappers da index.
- `components/CampaignHowItWorks.tsx` — eyebrow, cards e CTA que definem a linguagem visual reutilizável.
- `components/GlobalBackground.tsx` — fundo visual da index.
- `components/FooterBanner.tsx` — CTA de fechamento existente.
- `public/team/igor-avatar.png` — imagem aprovada do fundador.
- `public/TlinIA.svg` — identidade visual do funcionário digital/mascote.

</canonical_refs>

<deferred>
## Deferred Ideas

- Perfis de uma equipe ampla não fazem parte desta página; podem mudar ao longo do tempo e não sustentam a proposta founder-led.

</deferred>
