# Modelo de LP — Igor Marin

Este é o template das landing pages de materiais gratuitos do Igor Marin. A estrutura visual e técnica já está pronta; para criar uma nova página, altere o conteúdo da campanha e mantenha os componentes.

## Estrutura da página

Rota padrão:

```text
/playbook/[slug]
```

A LP segue esta ordem:

1. Hero escura com foto, perfil, selo de playbook, headline e formulário.
2. Seção branca com os quatro pilares do material.
3. Seção escura final com CTA, cards de benefício e logos das ferramentas.

Os cards, selo e CTAs levam para o formulário `#desbloquear`.

## Onde alterar cada parte

| O que mudar | Arquivo |
| --- | --- |
| Nome do playbook, slug, descrição, keyword e conteúdo | `lib/igor-campaigns.ts` |
| Estrutura da LP | `app/playbook/[slug]/page.tsx` |
| Visual da LP | `app/playbook/[slug]/playbook.module.css` |
| Formulário em duas telas | `components/igor/LeadMagnetForm.tsx` |
| Visual do formulário | `components/igor/LeadMagnetForm.module.css` |
| Foto de perfil | `public/igor-marin-profile.png` |
| Página após captura | `app/playbook/[slug]/obrigado/page.tsx` |

## Criando uma nova landing page

1. Abra `lib/igor-campaigns.ts`.
2. Duplique uma campanha existente.
3. Crie um `slug` novo, por exemplo `claude-para-growth`.
4. Defina o `keyword` que será usado no ManyChat, por exemplo `CLAUDE`.
5. Atualize título, descrição, promessa e os pilares do material.
6. Acesse localmente em `/playbook/seu-novo-slug`.

Não é necessário criar outra página TSX. A rota dinâmica usa o `slug` da campanha.

## Como trocar a copy sem quebrar o design

No arquivo `page.tsx`, a copy fixa do template está nestes pontos:

- Headline da hero.
- Texto de apoio da hero.
- Título e texto da seção branca.
- Pilares: Pesquisa, Conteúdo, Conversão e Operação.
- Título, benefícios e CTA da seção final.

Para um novo material, mantenha o formato curto:

```text
Headline: 2 linhas, com 1 ou 2 palavras em destaque.
Descrição: benefício concreto em até 2 linhas.
Pilares: título curto + explicação em até 3 linhas.
CTA: “Receber grátis”, “Quero o playbook” ou equivalente direto.
```

## Formulário e consentimento

O formulário tem duas telas:

1. Nome.
2. E-mail e WhatsApp.

Ao enviar, o lead é registrado com campanha, keyword, UTM e versão de consentimento. A nota de privacidade fica abaixo do botão final. A assinatura de conteúdos promocionais não é marcada automaticamente no código atual.

API de captura:

```text
POST /api/growth-leads
```

Banco/tabela esperada:

```text
growth_leads
```

## Checklist antes de publicar

- Testar desktop e mobile sem scroll horizontal.
- Conferir se todos os cards levam para `#desbloquear`.
- Validar nome, e-mail e WhatsApp no formulário.
- Conferir a keyword do ManyChat.
- Atualizar título e descrição SEO da campanha.
- Confirmar se a integração do Supabase está configurada.

## Comandos locais

```bash
npm run dev
npx tsc --noEmit
npm run build
```
