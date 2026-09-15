# Technology Stack

**Project:** Tlin — Otimização Contínua do Funil Comercial
**Researched:** 2026-09-15

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 16.3.5 | páginas, rotas e entrega | Já é a base estável do projeto; as novas páginas devem reutilizar App Router e componentes existentes. |
| React | 19 | demonstrações interativas e fluxo de conversão | A demonstração do processo pode ser uma experiência guiada no browser sem criar um produto paralelo. |
| Tailwind CSS | 4.2.2 | responsividade e composição visual | Mantém consistência com a LP existente. |

### Database

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase Postgres REST | existente | registrar leads e resultado operacional | Já persiste submissões; deve receber os estados necessários para atribuir demo e venda quando o CRM devolver esses eventos. |

### Infrastructure

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel | existente | deploy e runtime Next | Permite publicar incrementos e usar variáveis por ambiente. Variáveis novas exigem novo deploy. |
| Cloudflare | existente | DNS, TLS, edge protection e Turnstile | Mantém as proteções atuais para páginas e rotas públicas. |
| GA4 + GTM | existente | eventos de aquisição e conversão | É o caminho atual para medir o funil no browser; usar eventos recomendados e eventos internos consistentes. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion | existente | revelar a demonstração e prova de processo | Apenas onde a animação explica o produto ou melhora percepção; respeitar mobile e reduzir peso fora da dobra. |
| next/image | nativo | mídia de produto, equipe e prova visual | Para capturas/imagens reais que fizerem parte das novas páginas. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Nova página | componentes Next existentes | microsite separado | Fragmenta tracking, manutenção e consistência da marca. |
| Demonstração | jornada guiada dentro da LP | construir CRM de demonstração completo | A meta é provar a operação e gerar demo, não reproduzir todo o produto no site. |
| Métrica de venda | eventos + retorno do CRM | somente conversões de formulário | Formulário não mede qualidade nem receita. |

## Installation

```bash
# Não é necessária uma nova dependência para as páginas iniciais.
npm run lint
npx tsc --noEmit
npm run build
```

## Sources

- [Vercel: environment variables](https://vercel.com/kb/guide/how-to-add-vercel-environment-variables) — novas variáveis ficam disponíveis após redeploy; prefixo `NEXT_PUBLIC_` é necessário no cliente.
- [Google Analytics: eventos recomendados](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) — eventos de geração e fechamento de lead.

---

*Stack research for: LP B2B de IA comercial e conversão de demo*
*Researched: 2026-09-15*
