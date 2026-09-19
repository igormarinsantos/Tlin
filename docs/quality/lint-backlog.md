# Dívida de lint priorizada

Referência inicial: 17/09/2026, código-base `27b26cf`, após corrigir o link interno
de `components/LiaPopup.tsx` para `Link`. Total: **0 erros e 124 avisos**.

A contagem abaixo é um retrato inicial, não um contador vivo. O limite executável
é [lint-baseline.json](lint-baseline.json). Use `npm run lint` para obter arquivos
e linhas atuais. Nenhum aviso foi suprimido para estabelecer esta referência.

| Ordem | Regras | Quantidade inicial | Prioridade de revisão |
| --- | --- | --- | --- |
| 1 | `react-hooks/exhaustive-deps` | 17 | Revisar primeiro os 6 avisos da qualificação e 3 da Lia: callbacks, estado capturado e retomada afetam a jornada. Outros 8 em Hero, Pricing e animações |
| 2 | `@typescript-eslint/no-explicit-any` | 28 | Começar nos contratos de notify/chat, Deskcomm e Supabase; depois props/eventos da interface. Tipar a fronteira sem mascarar validação de runtime |
| 3 | `react-hooks/set-state-in-effect` | 11 | Avaliar renders adicionais em motion, LanguageContext e DeferredSection; corrigir com medição e verificação visual |
| 4 | `@next/next/next-script-for-ga` | 1 | Revisar junto à arquitetura de tracking da fase 3; uma troca mecânica de script pode mudar ordem de inicialização/coleta |
| 5 | `@next/next/no-img-element` | 21 | Priorizar imagens com impacto real em carregamento/layout. Respeitar dimensões, SVGs e animações ao migrar |
| 6 | `@typescript-eslint/no-unused-vars` | 30 | Limpeza localizada; confirmar que remover imports/estado não elimina efeitos necessários |
| 7 | `@typescript-eslint/no-require-imports` | 12 | Scripts legados de modelos, Gemini e manutenção; separar utilidade atual de histórico antes de modificar |
| 8 | `react/no-unescaped-entities`, `prefer-const`, `import/no-anonymous-default-export` | 4 | Ajustes pontuais de texto e estilo, sem mudança de copy |

Avisos são sinais para revisão, não prova automática de bug. Não adicionar
dependências a um effect sem entender se isso reinicia uma conversa, timer ou
requisição. Cada correção deve ter uma verificação apropriada ao comportamento.

## Regras de redução

1. Escolher um conjunto pequeno ligado à fase/arquivo em trabalho.
2. Corrigir a causa; manter regras e severidades ativas.
3. Executar checks e revisão visual/funcional relevante.
4. Atualizar a referência com `npm run lint:baseline` e revisar a redução.
5. Se o alerta exigir uma exceção, explicar no PR; nunca aumentar limites só para passar no CI.

Não se exige corrigir os 124 avisos antes de iniciar a fase 2. A partir desta
base, novos arquivos e regras começam com limite zero.
