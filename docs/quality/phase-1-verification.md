# Verificação da fase 1

Data: 17/09/2026. Branch de implementação: `codex/fase-1-base-qualidade`.
Base do produto: `27b26cf`. Status: **implementação e verificação local concluídas**.

## Aceite

| Critério | Evidência |
| --- | --- |
| Contexto atual para quem continua o projeto | README e AGENTS revisados contra rotas, composição, runtime, scripts e integrações |
| Regra de publicação consistente | Ambos exigem autorização explícita do Igor para alterar/publicar `main` |
| Lint sem erros | `npm run lint:check`: zero erros; 124 avisos conhecidos; nenhuma regressão por arquivo/regra |
| Avisos organizados por impacto | `lint-backlog.md` e referência JSON por arquivo/regra |
| Checks automáticos definidos | Workflow `Quality`, Node em `.nvmrc`, comando `npm run check` e template de PR |
| Referência visual preservada | 10 PNGs reais, quatro rotas em desktop/mobile, menu mobile e Lia desktop; condições em `visual-baseline.md` |
| Alteração funcional verificada | Lia → Política de Privacidade navega a `/legal?tab=privacidade` e fecha o popup |

## Checks executados

- `npm run check`: **passou** após o último ajuste funcional.
- Tipos de rota gerados por `next typegen`; TypeScript sem emissão/incremental: **passou**.
- Controle de lint: **passou**, com 124 avisos conhecidos visíveis na referência.
- Vitest: **6 testes passaram**, em dois arquivos. Dois testes do adaptador Deskcomm e quatro da política de avisos.
- Build de produção: **passou**. Permanece o aviso preexistente sobre Cache-Control customizado para `/_next/static`.
- Workflow YAML carregado e validado localmente; metadata de engine do lockfile conferida com `package.json`.
- Capturas PNG abertas/inspecionadas e dimensões conferidas.
- Navegação no navegador após o último build: destino correto e botão de boas-vindas da Lia deixou de estar visível, confirmando fechamento.
- `git diff --check` e revisão do diff: sem erros de whitespace; cache local excluído do commit.

## Limites

- GitHub Actions não foi executado remotamente, pois não houve push. A primeira
  execução remota e uma eventual regra de proteção da branch ainda dependem da
  publicação autorizada/configuração do repositório.
- O Node 24 é o padrão declarado para desenvolvimento e CI; o runtime atualmente
  configurado no painel de produção da Vercel não foi inspecionado.
- Não foram disparados leads, e-mails ou agendamentos reais. A verificação
  operacional Deskcomm/Supabase continua pendente.
- Capturas são referência manual da primeira viewport. Não certificam todo o
  site, os estados posteriores do funil, touch, teclado virtual ou os três idiomas.
- O guia visual e o showcase anteriores foram preservados. Componentização e
  correções de acessibilidade continuam reservadas às fases 4/5.
- Os bugs de funil e tracking da auditoria permanecem no escopo das fases 2/3.
