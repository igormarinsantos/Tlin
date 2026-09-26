# Base de qualidade e evolução

Plano definido com Igor em 17/09/2026. Métrica principal: **demos confirmadas
com leads qualificados**. A qualificação é confirmada pela equipe no CRM;
score do formulário não comprova qualificação comercial.

## Sequência de fases

Esta numeração pertence ao ciclo de qualidade de 17/09. Não substitui nem marca
como concluídas as fases antigas de `.planning/`.

| Fase | Entrega | Estado |
| --- | --- | --- |
| 1. Base de qualidade | Documentação atual, lint, checks automáticos e referência visual | Implementada localmente; publicação/CI remoto pendentes |
| 2. Funil confiável | CTAs globais, token, captura/retry, identidade, retomada e confirmação | Implementada localmente; integrações reais/publicação pendentes |
| 3. Tracking e CRM | Contrato de eventos, atribuição, correlação, deduplicação, contas e painel | Implementada localmente; banco e etapas preparados, ativação pendente |
| 4. Fundação do design system | Tokens, componentes oficiais e catálogo real | Implementada localmente; migração gradual na fase 5 |
| 5. Aplicação e consistência | Migração gradual, teclado, acessibilidade, idiomas e mobile | Implementada localmente nas rotas de maior conversão |
| 6. Otimização de conversão | Experimentos de mensagem, CTA, prova e fricção | Planejada |

As evidências e riscos de cada frente estão na
[auditoria inicial](../auditoria-padroes-conversao-2026-09-17.md).
Não antecipar uma reescrita de visual ou tracking durante a base de qualidade.

## Ambiente reproduzível

- Node.js 24.13.0 em `.nvmrc`, também lido pelo CI; `package.json` declara a linha 24.
- Use `npm ci` para instalar o lockfile. Alterações intencionais de dependências
  precisam incluir o lockfile e explicar o motivo.
- As verificações não exigem chaves de produção. Os testes existentes simulam
  o transporte do CRM; build não comprova que CRM, SMTP ou analytics funcionam.
- `next/font/google` pode precisar de acesso à rede durante o build.
- Preserve `.env.local`, cache TypeScript e outras mudanças locais de quem abriu
  a tarefa. Arquivos gerados já versionados não devem entrar incidentalmente no diff.

## Checks de entrega

```bash
npm ci
npm run check
git diff --check
git diff --cached --check
git status --short
```

| Comando | Responsabilidade |
| --- | --- |
| `npm run typecheck` | `next typegen` e `tsc --noEmit --incremental false`; funciona sem um build prévio |
| `npm run lint` | Diagnóstico completo de ESLint, incluindo a dívida conhecida |
| `npm run lint:check` | Bloqueia erros e aumento dos avisos por arquivo/regra |
| `npm test` | Vitest: adaptadores, endpoints simulados, tokens, retomada, formulário, CTAs, confirmação e política de lint |
| `npm run test:lead-capture` | Apenas o teste existente do adaptador Deskcomm |
| `npm run build` | Compilação de produção e geração das rotas |
| `npm run check` | Executa tipos, lint controlado, testes e build em sequência |

O workflow [Quality](../../.github/workflows/quality.yml) roda em todos os PRs,
pushes para `main` e execução manual. Usa Node de `.nvmrc`, lockfile,
permissão somente de leitura e nenhum segredo comercial. Confere whitespace
do diff completo no PR e do último commit em pushes/execução manual.
As actions oficiais [checkout](https://github.com/actions/checkout) e
[setup-node](https://github.com/actions/setup-node) estão fixadas em commits
verificados das suas tags v6; atualizações dessas referências devem ser revisadas.

Depois de publicado, o check chama-se **Quality checks**. Torná-lo obrigatório
antes do merge requer uma regra de proteção no GitHub; essa configuração externa
não foi alterada. O workflow não publica o site nem controla o deploy automático
da Vercel. Merge ou push em `main` depende de autorização explícita do Igor.

## Política de avisos

A [referência JSON](lint-baseline.json) permite apenas a dívida já conhecida,
por arquivo e regra. Nenhuma regra foi desligada e os avisos continuam disponíveis
em `npm run lint`. Um arquivo limpo não recebe crédito porque outro foi corrigido.
O limite é por contagem, não uma comparação semântica das mensagens: substituir
um aviso por outro da mesma regra no mesmo arquivo ainda exige revisão do diff.

Ao corrigir avisos, rode `npm run lint:baseline`, confira que os limites diminuíram
e inclua essa redução no commit. Não aumente limites automaticamente para fazer
CI passar. Exceções precisam de justificativa no PR e decisão explícita do responsável.
Renomear arquivo com dívida exige revisar a transferência dos limites.

O script recusa atualizar a referência enquanto houver erro de lint. A política
tem testes para dívida existente, redução, arquivo/regra novos e aumento de contagem.
Veja o [backlog priorizado](lint-backlog.md) antes de escolher a próxima limpeza.

## Revisão visual e funcional

Use a [referência visual](visual-baseline.md). Mudanças de UI exigem comparação
nas rotas afetadas, em desktop e mobile; observe foco/teclado, overflow e estados
de carregamento, erro e sucesso quando aplicáveis.

Alterações no funil devem cobrir sucesso, erro e retry com integrações simuladas.
Não dispare leads, e-mails ou demos reais para validar um PR sem uma decisão
explícita sobre o ambiente e a operação. A validação operacional antiga permanece
adiada; só deve ser declarada concluída com evidência real quando for retomada.

## Evidências da fase 1

- Única alteração funcional: link interno de privacidade da Lia migrado para `Link`, preservando destino/classes e fechando o popup na navegação, como acontecia com o recarregamento anterior.
- README e AGENTS alinhados ao código, às seis fases e à exigência de autorização para publicação.
- 124 warnings existentes registrados por arquivo/regra e agrupados por impacto; zero novos limites para código de qualidade.
- CI e template de PR adicionados, com os mesmos comandos de verificação local.
- Capturas reais das primeiras dobras de home, campanha, preços e demo, em desktop/mobile, com limites de cobertura declarados.

Checks finais e limitações desta entrega estão em [phase-1-verification.md](phase-1-verification.md).

## Evidências da fase 2

Contrato, verificações e limites de retry em [phase-2-verification.md](phase-2-verification.md).
Testes de interface usam React Testing Library e jsdom apenas como dependências de desenvolvimento.

## Evidências da fase 3

Contrato, configuração externa e pendências em [phase-3-tracking-crm.md](phase-3-tracking-crm.md).
