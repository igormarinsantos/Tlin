# Fase 4 — fundação do design system

## Objetivo

Converter o contrato visual existente em uma base reutilizável, preservando a
identidade atual e reduzindo cópias de CTAs e superfícies em novas páginas.

## Entregue nesta etapa

- tokens semânticos globais para cor, raio, superfícies e foco;
- foco visível compartilhado em controles de teclado;
- primitivos em `components/ui/tlin.tsx` para botões, cards, campos, etiquetas
  e texto de destaque;
- catálogo vivo em `/internal/design-system`, excluído de indexação;
- campanhas, CTA final e painel interno usando os componentes oficiais.

## Regras de adoção

1. Todo CTA novo usa `TlinButton`, salvo quando um componente de produto exigir
   uma interação visual própria documentada.
2. Novas superfícies usam `TlinCard`; não criar novos valores de borda, raio ou
   sombra sem antes avaliar um token.
3. Campos novos usam `TlinField` ou mantêm o contrato de foco equivalente
   quando dependerem de um controle composto.
4. A migração do legado é progressiva. Não substituir classes em massa sem
   comparação visual de desktop e mobile.

## Validação

- `npm run typecheck` passou.
- `npm run build` passou e incluiu a rota do catálogo.
- A próxima entrega da fase amplia a migração nas páginas de maior conversão e
  revisa teclado, mobile e idiomas antes de considerar a base consolidada.
