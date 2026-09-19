# Fase 2 — funil confiável

Implementação local em 17/09/2026, sobre a fase 1 (`afa656d`). Branch:
`codex/fase-2-funil-confiavel`. Nenhum push, merge, deploy ou teste com lead real.

## Contrato implementado

- Um único `QualificationController` em `SiteChrome` atende CTAs de todas as rotas
  com navegação. Preserva plano e origem, ignora aberturas repetidas e desmonta ao
  trocar de pathname. `/demo` e `/comece` mantêm o fluxo embedded.
- `Turnstile` usa `onReady`, inclusive ao reabrir um widget com script em cache.
  `SingleUseToken` entrega cada token a uma única requisição, aguarda carregamento
  tardio e renova na próxima solicitação. Expiração, erro, timeout e unmount limpam
  o estado. Sem chave pública, o cliente envia token nulo; a validação server-side
  existente continua exigindo token quando a chave secreta está configurada.
- `useQualificationRequest` captura somente depois da confirmação do telefone.
  Só registra captura concluída após HTTP OK e `success: true`. Uma falha não
  interrompe as perguntas: o envio final tenta a captura com dados revisados,
  mesma identidade e um novo token. Captura e envio final são serializados.
- `QualificationRequest` mantém identidade, contato capturado e estado de envio
  no localStorage por 24 horas de inatividade. Novo pedido explícito gera novo ID.
  Progresso antigo válido continua retomável; campos inválidos são descartados e
  horários expirados/incompletos voltam à consulta de disponibilidade.
- Uma confirmação em curso bloqueia novo envio, edição, voltar e fechar pelo
  formulário. Uma interrupção após o POST mantém estado incerto ao remontar.
  A interface oferece verificar com a equipe, com a referência da solicitação,
  sem repetir automaticamente a reserva.
- Disponibilidade faz uma consulta por entrada na etapa ou retry explícito.
  Troca de etapa/idioma cancela a consulta anterior. Horário recusado limpa a
  seleção e consulta novamente os dias; erros não causam um loop automático.
- `/api/notify` exige um horário futuro e só retorna sucesso comercial com
  `marcado === true`. A busca de contato exige telefone exato normalizado.
  Resposta incerta do MCP é distinta de recusa explícita. Falha posterior em SMTP
  ou atualização secundária não apaga uma reserva confirmada. As chamadas de
  webhook, MCP e SMTP têm limites de espera. O token não entra no payload salvo
  no Supabase.
- `/obrigado` só abre após confirmação explícita; recibo versionado contém
  referência, data ISO, dia/hora e validade de 24 horas em sessionStorage.
  Refresh não consome o recibo. Sem recibo válido, inclusive em desenvolvimento,
  volta a `/demo`. Se a gravação for bloqueada, memória permite a navegação
  imediata na mesma aba; não promete sobrevivência a reload sem storage.
- `qualify_lead` no formulário foi movido para depois da reserva confirmada.
  Isso elimina a emissão no envio recusado; ainda não define qualificação
  comercial. O contrato completo de métricas permanece na fase 3.

## Verificação

Suite Vitest com transporte, CRM, SMTP e segurança simulados; React Testing
Library/jsdom são dependências apenas de desenvolvimento. Cobertura:

| Frente | Casos |
| --- | --- |
| CTAs | Home, campanha, preços, como funciona, blog, legal e obrigado; abertura única, fechar/reabrir, troca de rota e exclusão das rotas embedded |
| Segurança | Token tardio, uso único, expiração, timeout, cancelamento, duas requisições e reabertura com script em cache |
| Captura/envio | HTTP 502/403, identidade nas tentativas, captura antes da reserva, duplo envio, falha de segurança e resposta perdida com remount |
| Formulário real renderizado | Retomada na revisão, confirmação única, persistência antes da navegação, erro sem conversão, horário recusado, consulta com retry explícito e estado incerto |
| Servidor | Captura recusada, JSON inválido, ausência de horário, horário passado, segurança recusada, reserva confirmada/recusada/incerta, contato exato e falhas secundárias/SMTP |
| Retomada/recibo | Dados legados, progresso inválido, horário expirado, nova identidade, storage bloqueado, recibo expirado, remontagem de obrigado e acesso direto sem recibo |

Verificação manual no navegador local: CTA de `/legal` em desktop (1280×720),
CTA do menu de `/blog` em mobile (390×844), fechamento com Escape e acesso direto
a `/obrigado` retornando a `/demo`. Tela inicial de demo mobile comparada com
`visual/2026-09-17/demo-mobile.png`, mantendo aparência. Nenhum erro de console
nessa navegação. Estados transacionais foram validados na suite simulada, sem
enviar formulários pelo navegador conectado às credenciais locais.

Checks finais: `npm run check` (tipos, lint controlado, testes e build) e
`git diff --check`. O aviso preexistente de Cache-Control em `/_next/static`
continua no build. O limite de lint só diminui; nenhuma regra foi desligada.

Resultado final: **48 testes passaram em 10 arquivos**, TypeScript aprovado,
**0 erros e 121 avisos conhecidos** no lint (124 na fase 1), build aprovado com
27 páginas geradas. O teste de captura tardia também garante que uma instância
fechada do popup não sobrescreva a identidade de um novo pedido.

## Limites e próximo trabalho

- **A proteção do cliente não é idempotência durável do servidor.** O webhook
  recebe o mesmo `lead_capture_id`/`Idempotency-Key`, mas precisa aplicar a
  deduplicação e atualização no Deskcomm. O envio final inclui novos dados mesmo
  quando já houve captura antecipada. Validar como o webhook trata esses updates
  e criar deduplicação persistente para reservas são tarefas da fase 3.
- Abas simultâneas, outro dispositivo, storage apagado e chamadas diretas à API
  não têm garantia de envio único. Não resolver com cache em memória de uma
  instância da Vercel. Uma resposta perdida exige conferência humana até existir
  reconciliação/idempotência persistente no servidor.
- O recibo é estado de apresentação, não um comprovante autenticado nem uma
  autorização do servidor. Não contém dados pessoais de contato.
- Cloudflare real, Deskcomm, SMTP, Supabase e métricas de produção não foram
  homologados nesta entrega. CI remoto e publicação continuam pendentes.
- Fase 3: contrato de eventos, identificação e deduplicação no CRM, atribuição,
  definição de lead qualificado e painel de demos confirmadas qualificadas.

Referência de integração: [ciclo de widgets Turnstile](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/).
O comportamento `onReady` foi conferido na documentação local do Next.js instalado.
