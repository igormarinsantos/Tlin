# Padrões de qualidade, design system e conversão

Data: 17/09/2026. Base analisada: `27b26cf` de `origin/main`.

## Objetivo e escopo

Prioridade confirmada pelo Igor: **demos agendadas com leads qualificados**.
Preservar a identidade e a experiência atuais, consolidando os padrões que já funcionam.
Os canais prioritários de aquisição ainda não foram definidos nesta conversa.

Este documento registra uma análise estática do README, design system, componentes,
rotas, tracking e integrações, acompanhada de checks locais. As propostas abaixo
ainda não foram implementadas. Não houve publicação, alteração de tags externas,
envio de leads, e-mails ou agendamentos de teste.

## Diagnóstico

A base tem direção visual clara e boa reutilização de composição. `MarketingLandingPage`
reúne home e campanhas; `SiteChrome` centraliza a navegação; o fluxo de qualificação
compartilha sua máquina de estados entre modal e páginas independentes. Dicionários
tipados, adaptações para teclado mobile e safe areas também são pontos a preservar.

Há um guia visual amplo em `docs/design-system.md` e um showcase em HTML. Entretanto,
boa parte das regras ainda depende de copiar classes e de revisão manual. O próximo
passo é fazer os componentes reais incorporarem essas regras e os testes protegerem
os comportamentos comerciais importantes.

O tracking já captura first/last touch e vários eventos. A lacuna principal está no
significado dos eventos e na ligação confiável entre visita, lead, agenda e resultado
no CRM. A presença de GA4/GTM no código não comprova a configuração das contas.

## Achados prioritários

Referências de linha correspondem à base analisada. P1 indica impacto direto no funil
ou na confiabilidade do resultado; P2 indica consistência e manutenção.

| Prioridade | Evidência | Consequência e encaminhamento |
| --- | --- | --- |
| P1 | `components/LeadQualificationPopup.tsx:616,676`; `components/Turnstile.tsx:32`; `lib/turnstile.ts:22` | O mesmo token pode ser validado na captura do telefone e na confirmação final, sem renovação após consumo. Com Turnstile configurado, a segunda validação pode falhar. Renovar o token para cada operação e testar expiração/reabertura. A configuração de produção não foi inspecionada. |
| P1 | `components/Header.tsx:196`; `components/SiteChrome.tsx:18`; listeners em `MarketingLandingPage.tsx:103`, `app/precos/page.tsx:27`, `app/como-funciona/page.tsx:89` | O header global dispara um evento que não tem listener em blog e páginas legais. Nesses caminhos o CTA não abre a qualificação. Centralizar o controlador do modal ou oferecer navegação para `/demo`. |
| P1 | `components/LeadQualificationPopup.tsx:654,666,700` | `qualify_lead` é enviado antes da resposta da API. Uma tentativa malsucedida pode ser contabilizada como qualificação. Separar tentativa, lead aceito, demo confirmada e qualificação comercial. |
| P1 | `lib/supabase-leads.ts:44,117`; `app/api/notify/route.ts:124` | O insert não preenche a coluna `lead_capture_id`, mas o retorno do CRM faz PATCH por ela. O fluxo do código não garante correlação entre submissão e estágio. Gravar a identidade na coluna, tratar registros anteriores e verificar o resultado da atualização. |
| P1 | `app/api/webhooks/deskcomm/route.ts:36`; `lib/supabase-leads.ts:115` | O endpoint responde sucesso mesmo quando a projeção retorna falha. O PATCH não é verificado e não há proteção contra estágio antigo sobrescrever novo. Definir persistência, retry, deduplicação e ordenação temporal verificáveis. |
| P1 | `components/LeadQualificationPopup.tsx:616,629` | Captura precoce exige um token já disponível; erros HTTP não entram no `.catch`. O código pode marcar a captura como feita mesmo com 403/502, ou nem tentar se o token chegar depois. Confirmar `response.ok` e permitir retomada sem duplicar o lead. |
| P2 | `components/LeadQualificationPopup.tsx:67,479` | A identidade e a flag de captura precoce vivem em refs; `resetForm` não as reinicia. Uma nova solicitação na mesma montagem pode reutilizar a identidade anterior; recarregar uma sessão retomada pode gerar outra. Definir o ciclo de vida da solicitação. |
| P2 | `lib/utm.ts:66,67,216,263` | Click IDs sobrescrevem UTMs explícitas; `gclid`/`fbclid` são capturados, mas não enviados como campos dedicados pelo payload do lead. Preservar a informação original e separar atribuição comercial do payload de analytics. |
| P2 | `lib/utm.ts:248`; `app/layout.tsx:117,118,161` | Eventos são descartados quando `gtag` ainda não existe. GA direto e GTM coexistem; duplicação depende do conteúdo do container, que não foi auditado. Definir uma única responsabilidade de envio por destino e verificar navegação entre rotas. |
| P2 | `components/LeadQualificationPopup.tsx:528`; `lib/utm.ts:274` | `close_convert_lead` representa clique para WhatsApp, não venda. Score usa texto traduzido e regex; não é confirmação comercial. Usar códigos estáveis para respostas e separar score estimado de qualificação do CRM. |
| P2 | `components/Header.tsx:138,262,361`; `components/LeadQualificationPopup.tsx:893,1239,1319,1356` | Menu desktop e modal precisam de um contrato de teclado/foco; há campos e controles sem nome acessível. Incorporar isso aos componentes reutilizáveis e verificar com navegação por teclado. |

Tokens Turnstile são de uso único e expiram em cinco minutos, conforme a
[documentação oficial da Cloudflare](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

Outros ajustes de jornada: `/obrigado` remove a confirmação do sessionStorage ao
exibi-la (`app/obrigado/page.tsx:48`), fazendo o refresh voltar ao fluxo em produção.
Persistir um comprovante de confirmação com validade apropriada é preferível a
depender de uma visualização única. A página de obrigado não deve ser a fonte da
contagem de agendamentos.

## Contrato proposto para o design system

Preservar DM Sans, preto `#0c0d0d`, branco, gradiente `#B597FF → #38E3FF`, bordas
leves, CTAs arredondados e a linguagem editorial existente. Migrar por componentes,
comparando o antes/depois, sem substituir todos os estilos de uma vez.

| Camada | Padrão proposto | Critério de conclusão |
| --- | --- | --- |
| Tokens | Cores primitivas e papéis de texto, superfície, borda, foco e estados; tipografia, espaçamento, raios, camadas e motion | Valores compartilhados definidos em CSS e consumidos pelos componentes |
| Layout | `Container`, `Section`, `SectionHeading`, `SectionEyebrow` | Nova seção escolhe variantes explícitas sem copiar um bloco de classes |
| Conversão | `ConversionButton` com variantes, `DemoHoverPill` e abertura centralizada | O CTA mantém estilo, origem e destino corretos em toda rota |
| Formulários | `FormField`, `IconButton`, estados de erro/carregamento e shell do modal | Labels, foco, teclado, retry e prevenção de duplo envio consistentes |
| Navegação | Disclosure/menu com estado e semântica explícitos | Abrir, percorrer e fechar com teclado; foco retornando ao disparador |
| Catálogo | Renderizar os componentes reais, com variantes e estados | O catálogo acompanha o produto; não mantém uma segunda implementação HTML |
| Motion | Durações/eases compartilhados e política de movimento reduzido | CSS e Framer Motion respeitam a preferência; animações decorativas não bloqueiam ações |
| Conteúdo | Dicionários PT/EN/ES e códigos de domínio independentes da tradução | Labels visíveis e acessíveis traduzidos; métricas não mudam quando muda o idioma |

Ajustes concretos de fundação: `font-sans` aponta para Geist em `app/globals.css:39`,
embora o layout carregue DM Sans; `xs:` é usado sem um breakpoint correspondente;
gradientes cônicos aparecem em 14 arquivos; Header e Hero recriam partes do efeito
que `DemoHoverPill` deveria compartilhar. Cores decorativas claras precisam de
variantes semânticas apropriadas quando usadas em textos pequenos.

O Tailwind 4 permite transformar esses tokens em classes por meio de `@theme`, sem
exigir outra biblioteca de UI. Ver [documentação de theme variables](https://tailwindcss.com/docs/theme).

## Contrato proposto para tracking

**Resultado principal:** número de demos efetivamente confirmadas associadas a leads
com qualificação comercial registrada. Deduplicar por agendamento e manter a relação
com o lead. A definição exata de fit e os estágios do Deskcomm precisam ser alinhados
com a operação; score do formulário deve continuar sendo apenas um sinal estimado.

| Evento proposto | Quando emitir | Fonte de verdade |
| --- | --- | --- |
| `cta_clicked` | Clique no CTA, com origem, destino e plano | Interface |
| `lead_form_started` | Primeira interação real no fluxo | Interface; separar de abertura do modal |
| `lead_step_completed` | Etapa validada | Máquina de estados, com código estável da etapa |
| `lead_capture_succeeded` | CRM confirma recebimento | Servidor |
| `demo_booking_attempted` | Pedido válido de agendamento | Servidor |
| `demo_booked` | Agenda confirma o compromisso | Servidor/CRM, com identificador do agendamento |
| `demo_booking_failed` | Agenda falha | Servidor, com categoria de erro sem dados pessoais |
| `lead_qualified` | Operação confirma fit segundo regra definida | CRM |
| `demo_attended` / `sale_won` | Comparecimento/venda registrados | CRM |
| `whatsapp_clicked` | Abertura do link para WhatsApp | Interface; não significa conversa ou venda |

Esta é uma proposta de contrato interno. O mapeamento para nomes das plataformas
deve ser explícito e versionado; não renomear eventos em produção sem atualizar
relatórios, tags e objetivos que dependem deles.

Regras para implementar:

- Identidade estável da solicitação do início ao CRM e ao backup; identidade própria para cada agendamento e evento. Retry reutiliza a identidade da operação, nova solicitação recebe outra.
- Envelope tipado com versão, evento, horário, rota, variante, idioma, origem do CTA, plano e identidade aplicável. Não enviar nome, e-mail, telefone ou conteúdo livre da conversa ao analytics.
- Atribuição first/last touch preservada com janela explícita. Hoje o cookie expira em 30 dias, mas o localStorage lido primeiro não tem expiração equivalente (`lib/utm.ts:140`).
- Separar payload comercial e payload de analytics. Sanitizar URLs/referrers, controlar parâmetros aceitos e transportar click IDs apropriados ao canal até o backend quando necessário.
- Fila para eventos emitidos antes da inicialização, controle de ambiente para não contaminar produção e um responsável de envio por destino.
- Inspecionar configuração real de GA4/GTM, consentimento e navegação SPA antes de afirmar que a coleta está correta. O código não permite concluir como o container publicado se comporta.
- Testar deduplicação, falhas de rede, respostas 4xx/5xx, slot ocupado, recarga e retomada. Testes de integração locais devem usar serviços simulados.

A [documentação do Google sobre pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views)
orienta evitar sobreposição entre coleta automática e manual. A escolha precisa
considerar o container atual, e não ser inferida apenas pelo código da landing.

Painel mínimo: visita → início → contato recebido → demo confirmada → qualificação →
comparecimento → venda, segmentado por campanha, landing, dispositivo e variante.
Qualificação pode ocorrer antes ou depois do agendamento; o modelo precisa aceitar
essa ordem. Acompanhar também erro de agenda e abandono por etapa. Custo por demo
qualificada só pode ser calculado quando investimento e identidade estiverem conectados.

## Padrão de trabalho entre computadores e IAs

1. Ler README, AGENTS e os contratos relevantes; conferir branch, alterações locais e remoto antes de editar.
2. Registrar decisões novas em um lugar de referência e atualizar documentos que ficaram contraditórios.
3. Reutilizar componentes e tokens existentes. Nova variante deve ter motivo concreto e exemplo no catálogo.
4. Manter critérios de aceite da jornada, desktop/mobile, teclado e idiomas; verificar comportamento, não classes Tailwind.
5. Executar TypeScript, lint, testes relevantes, build e `git diff --check`. Configurar CI para repetir os checks de cada PR.
6. Entregar diff pequeno com objetivo, validação e limitações. Alterações em produção continuam exigindo autorização explícita do Igor.

Hoje README orienta enviar a `main` ao validar, enquanto AGENTS exige confirmação.
A regra de publicação deve ser unificada mantendo a exigência explícita do usuário.
AGENTS também descreve stack, lint, composição e SEO anteriores à versão atual;
o roadmap ainda marca como não iniciadas páginas que já existem. Atualizar esses
documentos evita que outra IA reconstrua algo pronto ou desfaça avanços recentes.

## Sequência sugerida de implementação

1. **Confiabilidade do funil:** CTA global, ciclo de token Turnstile, captura e retry, identidade/correlação, confirmação real e callback do CRM. Aceite: percurso completo com integrações simuladas, incluindo erro e retomada, sem contagem falsa.
2. **Fundação do design system:** tokens, CTA, eyebrow, layout, campos e modal; catálogo com os componentes reais. Aceite: primeiras telas migradas preservam o visual e passam por teclado/mobile.
3. **Medição operacional:** contrato tipado, atribuição, deduplicação, destinos e painel; validar contas e configuração do CRM. Aceite: uma jornada controlada aparece corretamente do canal ao resultado, quando essa validação operacional for retomada.
4. **Otimização de conversão:** testar hipóteses de CTA, mensagem, prova e fricção, uma mudança por experimento. Aceite: comparar demos qualificadas e erros por variante; sem prometer ganho antes de medir.

A validação operacional real Deskcomm/Supabase já foi adiada no planejamento existente.
Ela continua sendo uma pendência conhecida, não uma validação concluída por esta auditoria.

## Verificações desta análise

- Git atualizado por fast-forward de `8ec0786` para `27b26cf`: 79 commits, sem divergência local.
- Dependências sincronizadas com `npm ci --no-audit --no-fund`.
- `npx tsc --noEmit --incremental false`: passou.
- `npm run test:lead-capture`: 2 testes passaram. Cobrem o adaptador, não o funil inteiro.
- `npm run build`: passou, com aviso sobre Cache-Control customizado para `/_next/static`.
- `npm run lint`: falhou com 1 erro e 124 warnings existentes. Erro em `components/LiaPopup.tsx:531`: link interno para `/legal` usando `<a>` em vez de `Link`.
- Não foi feita inspeção visual no navegador, auditoria de contas externas nem teste real de agendamento. Os achados de jornada e acessibilidade são baseados no código.
- Nenhum código funcional foi alterado nesta etapa. O documento está na branch `codex/auditoria-padroes-conversao`; sem push ou deploy.
