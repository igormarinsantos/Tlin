# Fluxo de desenvolvimento e Git

Este repositório mantém uma única branch permanente: `main`. Ela representa o
código de produção e cada push nela inicia o deploy automático na Vercel.

## Branches de trabalho

Cada entrega usa uma branch nova, curta e com responsabilidade única, criada a
partir da `main` atualizada:

- `feat/nome-da-entrega` para funcionalidade nova
- `fix/nome-do-problema` para correção
- `refactor/nome-do-escopo` para reorganização sem mudança intencional de comportamento
- `docs/nome-do-documento` para documentação
- `test/nome-do-fluxo` para cobertura de testes
- `chore/nome-da-tarefa` para manutenção de infraestrutura

Não mantenha branches de fase, de agente ou pessoais depois do merge. Não
reutilize uma branch antiga para uma nova entrega.

## Início de uma entrega

Preserve qualquer modificação local que já exista e confirme a base antes de
editar:

```bash
git status --short
git fetch --prune origin
git switch main
git pull --ff-only origin main
git switch -c feat/nome-da-entrega
```

Se a árvore estiver suja, identifique o responsável pelos arquivos antes de
trocar de branch. Não descarte mudanças de outra pessoa ou de ferramentas locais.

## Commits e arquivos locais

Faça commits pequenos, coerentes e revisáveis. Uma mudança de produto não deve
carregar junto caches, logs, segredos ou progresso local de ferramentas.

Nunca versionar:

- `.env*` com valores reais
- `.gsd/`, `.planning/milestone.lock`, `.planning/research/.cache/` e `.planning/tmp/`
- `tsconfig.tsbuildinfo`, logs ou alterações incidentais de `next-env.d.ts`

Os documentos duráveis de `.planning/` continuam versionados quando a mudança é
intencional e faz parte da entrega.

## Validação e revisão

Antes de abrir o pull request:

```bash
npm run check
git diff --check
git status --short
```

Revise o diff completo contra `origin/main`. Mudanças visuais também precisam de
validação nas rotas afetadas em desktop e mobile, conforme
`docs/quality/visual-baseline.md`.

Abra o pull request para `main`, espere o workflow **Quality checks** e prefira
merge por squash. CI verde comprova os checks do repositório; não valida sozinho
Deskcomm, Supabase, SMTP, analytics ou outros serviços reais.

## Publicação e limpeza

Merge ou push direto em `main` exige autorização explícita do Igor porque inicia
o deploy na Vercel. Depois do merge:

```bash
git switch main
git pull --ff-only origin main
git branch -d nome-da-branch
git fetch --prune origin
```

Apague também a branch remota. Correções urgentes seguem o mesmo fluxo com uma
branch `fix/`; a urgência não elimina os checks nem a autorização de publicação.

Configuração local recomendada para impedir históricos acidentais e referências
remotas obsoletas:

```bash
git config fetch.prune true
git config pull.ff only
git config push.default current
```
