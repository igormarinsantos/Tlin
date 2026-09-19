# Fase 5 — aplicação e consistência

## Entregue

- CTAs da home e do header passaram a usar `TlinButton`, mantendo os eventos de
  tracking, o hover de demo e o comportamento do mascote;
- CTAs dos cards de planos usam a mesma base, com forma suave quando o contexto
  pede um botão de card em vez de pílula;
- foco de teclado é visível nos controles; revisão local confirmou esse estado
  na navegação mobile;
- `FooterBanner` passou a iniciar com o mesmo HTML no servidor e no navegador.
  A preferência de movimento reduzido é aplicada depois da hidratação, sem
  erro de React e sem iniciar a animação para quem a desativou;
- não foram adicionadas strings de interface, preservando a paridade PT/EN/ES.

## Revisão local

- home mobile: CTA, hierarquia e foco por teclado;
- preços desktop: cards e botões de plano;
- preços em uma nova sessão: nenhum erro de hidratação no console.

## Limites

A migração continua incremental: componentes de fluxo de qualificação mantêm
suas superfícies próprias por terem estados, contraste e interações específicos.
Novas telas devem usar os componentes da fase 4 desde o início.
