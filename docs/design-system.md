# Tlin Design System

Guia pratico para manter o site Tlin consistente em novas secoes, landing pages, popups e materiais de produto.

## 1. Essencia visual

A Tlin mistura sensacao de IA premium com interface comercial direta. O visual deve parecer:

- limpo, rapido e confiante;
- preto/branco como base;
- gradiente azul + lilas como assinatura;
- cantos bem arredondados em CTAs e elementos flutuantes;
- texto grande, pesado e com tracking apertado em momentos de impacto;
- movimento suave, mas sempre a servico da experiencia.

Evitar:

- paleta monotona so roxa ou so azul;
- cards decorativos demais em secoes operacionais;
- sombras pesadas em excesso;
- blobs/orbs novos sem necessidade;
- textos explicando a interface dentro da propria interface.

## 2. Tokens

### Cores principais

| Token | Hex | Uso |
| --- | --- | --- |
| `tlin.black` | `#0c0d0d` | Texto principal, CTAs escuros, fundos premium |
| `tlin.white` | `#ffffff` | Fundo principal e superficies claras |
| `tlin.purple` | `#B597FF` | Marca, badges, foco, highlights |
| `tlin.blue` | `#38E3FF` | Marca, highlights, contraste tech |
| `tlin.carbon` | `#1a1a1a` | Fundos escuros secundarios |
| `tlin.whatsapp` | `#25D366` | Acoes ligadas ao WhatsApp |

### Neutros

| Token | Hex / Tailwind | Uso |
| --- | --- | --- |
| `zinc.50` | `#fafafa` | Fundos leves |
| `zinc.100` | `#f4f4f5` | Hover, divisores claros |
| `zinc.200` | `#e4e4e7` | Bordas |
| `zinc.400` | `#a1a1aa` | Texto auxiliar fraco |
| `zinc.500` | `#71717a` | Corpo secundario |
| `zinc.600` | `#52525b` | Navegacao, labels |
| `zinc.800` | `#27272a` | Texto em cards |
| `zinc.950` | `#09090b` | Fundos escuros alternativos |

### Gradientes

Assinatura principal:

```css
linear-gradient(90deg, #B597FF 0%, #38E3FF 100%)
```

Uso em Tailwind:

```tsx
className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF]"
```

Texto com gradiente:

```tsx
className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]"
```

Borda animada com conic gradient:

```tsx
<div className="relative p-[1px] rounded-full overflow-hidden">
  <div
    className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
    style={{
      backgroundImage:
        "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)",
    }}
  />
  <div className="relative rounded-full bg-[#0c0d0d] text-white">...</div>
</div>
```

## 3. Tipografia

Fonte principal: `DM Sans`.

Configurada via `next/font/google` em `app/layout.tsx` e exposta como `--font-dm-sans`.

### Escala recomendada

| Papel | Classes base |
| --- | --- |
| Hero H1 | `text-[36px] xs:text-[42px] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight md:tracking-tighter leading-[1.1]` |
| Section H2 | `text-4xl md:text-6xl font-bold tracking-tight leading-tight` |
| Feature H3 | `text-4xl md:text-7xl font-black tracking-tight leading-[1.2] md:leading-[1.1]` |
| Card title | `text-lg md:text-xl font-bold tracking-tight leading-tight` |
| Body | `text-base md:text-lg font-medium leading-relaxed text-zinc-500` |
| Micro label | `text-[10px] md:text-[11px] font-bold tracking-wide uppercase` |
| Button | `text-[14px] md:text-[15px] font-bold` |

Regras:

- usar `font-bold` e `font-black` para impacto;
- usar `tracking-tight` em titulos;
- evitar letter spacing negativo manual;
- em paineis compactos, reduzir heading antes de aumentar container.

## 4. Layout

### Containers

Base geral:

```tsx
className="max-w-6xl mx-auto px-4 md:px-6"
```

Secoes grandes:

```tsx
className="w-full py-24 md:py-32 bg-white"
```

Hero:

```tsx
className="relative w-full min-h-[100svh] pt-40 pb-12 px-4 flex flex-col items-center justify-center bg-white overflow-hidden"
```

### Breakpoints praticos

| Breakpoint | Uso |
| --- | --- |
| default | Mobile primeiro |
| `sm` | Ajustes de popup/input, textos um pouco maiores |
| `md` | Layout desktop inicial, nav visivel, secoes em duas colunas |
| `lg` | Experiencias completas, mascote desktop, grids amplos |

## 5. Componentes

### Badge de secao

Usado em FAQ, Pricing, Testimonials e secoes institucionais.

```tsx
<div className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-8">
  <div
    className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
    style={{
      backgroundImage:
        "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)",
    }}
  />
  <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide">
    Label
  </div>
</div>
```

### CTA primario

Botao escuro com borda animada e hover para gradiente.

```tsx
<button className="relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300">
  <div
    className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
    style={{
      backgroundImage:
        "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)",
    }}
  />
  <div className="relative px-8 py-4 rounded-full font-bold text-white group-hover/btn:text-[#0c0d0d] text-center">
    <span className="relative z-10">CTA</span>
    <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-500 group-hover/btn:opacity-0" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
  </div>
</button>
```

### CTA secundario

```tsx
className="px-6 md:px-10 py-3.5 rounded-full bg-white border border-zinc-200 text-[#0c0d0d] font-bold text-[14px] md:text-[15px] hover:bg-zinc-50 transition-all"
```

### Nav link

```tsx
className="relative py-2 px-4 rounded-full hover:bg-zinc-100 hover:text-[#0c0d0d] transition-colors duration-200"
```

### Dropdown

```tsx
className="absolute top-full right-0 mt-4 w-36 bg-white border border-zinc-200 rounded-2xl overflow-hidden py-1 px-1 z-50"
```

Item:

```tsx
className="w-full text-left px-3 py-2 rounded-full hover:bg-zinc-100 flex items-center gap-3 transition-all duration-200 ease-out"
```

### Cards claros

Usar para itens repetidos, FAQ, notificacoes e blocos de ferramenta.

```tsx
className="bg-white border border-zinc-100 rounded-2xl p-4"
```

Cards grandes podem usar `rounded-3xl`, mas evitar card dentro de card.

### Cards escuros

```tsx
className="bg-[#0c0d0d] border border-white/10 rounded-3xl text-white"
```

### Popup Lia

Caracteristicas:

- posicao fixa no canto inferior no desktop;
- full width com margens no mobile;
- borda conic gradient de 2px;
- superficie branca translucidada;
- input compacto depois da primeira mensagem;
- sem sombra nos baloes;
- avatar sem borda/sombra.

Base:

```tsx
className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 right-3 sm:left-auto sm:bottom-24 sm:right-6 sm:w-[420px] z-[150] rounded-[2.5rem] overflow-hidden p-[2px]"
```

### Popup de qualificacao

Caracteristicas:

- fundo escuro;
- tela cheia;
- area interna rolavel;
- scrollbar discreta cinza escuro;
- mobile sem blur pesado;
- salvar progresso em localStorage com debounce;
- evitar polling de scroll.

Overlay:

```tsx
className="fixed inset-x-0 top-[var(--lead-popup-offset-top,0px)] h-[var(--lead-popup-height,100dvh)] w-full z-[300] flex flex-col items-center justify-center overflow-hidden p-2 sm:p-[10px] bg-black/70 sm:bg-black/60 sm:backdrop-blur-md overscroll-none"
```

## 6. Estados e interacao

### Hover

Usar hover discreto em elementos utilitarios:

```tsx
hover:bg-zinc-100 hover:text-[#0c0d0d] transition-colors duration-200
```

Usar gradiente em CTAs de conversao.

### Focus

Campos usam anel lilas suave:

```tsx
focus-within:border-[#B597FF]/50 focus-within:ring-4 ring-[#B597FF]/5
```

Inputs:

```tsx
className="outline-none border-2 border-transparent focus:border-[#B597FF]/30"
```

### Selection

Padrao global:

```css
::selection {
  background: rgba(56, 227, 255, 0.32);
  color: #0c0d0d;
}
```

## 7. Motion

Biblioteca principal: `framer-motion`.

Duracoes:

| Tipo | Duracao |
| --- | --- |
| Hover simples | `0.2s` a `0.3s` |
| Entrada de dropdown | `0.15s` |
| Entrada de popup | `0.18s` a `0.3s` |
| Secao/card reveal | `0.4s` a `0.7s` |
| Borda girando | `3s` a `4s linear infinite` |

Eases comuns:

```tsx
ease: [0.16, 1, 0.3, 1]
ease: [0.23, 1, 0.32, 1]
```

Performance:

- em mobile, evitar `backdrop-blur` pesado;
- evitar `setInterval` para rolagem/animacao;
- preferir `requestAnimationFrame` para ajustes de scroll;
- desmontar animacoes fora da viewport;
- usar `preload="none"` em video de hover.

## 8. Iconografia e assets

Preferir `lucide-react` para icones de interface:

- `Play`
- `ArrowRight`
- `Minus`
- `Plus`
- `RotateCcw`
- `CheckCircle2`
- `TrendingUp`

Logo:

- horizontal: `/Logo%20Horizontal.svg`
- mascote/cursor: `/TlinIA.svg`
- Lia perfil: `/LIA PERFIL.webp`

Avatares pequenos:

- usar `/lotties/avatars/*_avatar.webp`
- nao usar imagens `2048x2048` para avatar pequeno.

## 9. Scrollbars

Scrollbar clara geral:

```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #E4E4E7 transparent;
}
```

Scrollbar do popup escuro:

```css
.lead-popup-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #52525b #0c0d0d;
}
```

Regras:

- nao mostrar setas do scrollbar;
- thumb escuro discreto no popup;
- evitar scrollbar branco sobre fundo preto.

## 10. Acessibilidade

Minimos obrigatorios:

- botoes icon-only precisam de `aria-label`;
- inputs precisam de label ou `aria-label`;
- contraste alto em texto principal;
- nao depender apenas de hover para acao essencial;
- respeitar safe areas em popups e botoes flutuantes:

```tsx
bottom-[max(1rem,env(safe-area-inset-bottom))]
```

## 11. Responsividade

Padrao:

- mobile primeiro;
- CTAs devem caber em linha quando possivel, mas quebrar sem overflow;
- popups usam `100dvh`/`visualViewport`;
- texto nunca deve ultrapassar container;
- elementos fixos devem respeitar `env(safe-area-inset-bottom)`.

Exemplo popup:

```tsx
h-[min(560px,calc(var(--lia-popup-height,100dvh)-2rem))]
max-h-[calc(var(--lia-popup-height,100dvh)-2rem)]
```

## 12. Regras de conteudo

Tom:

- direto;
- comercial;
- premium sem parecer institucional demais;
- foco em conversao, velocidade, WhatsApp, IA e escala.

Exemplos de microcopy:

- "Quero converter leads 24/7"
- "Ver demo"
- "Novo chat"
- "Falar com especialista"
- "Alavancar meu comercial agora"

Evitar:

- textos longos explicando a UI;
- excesso de jargao tecnico;
- promessas absolutas sem contexto.

## 13. Checklist para novas telas

Antes de publicar:

- Usa `DM Sans`?
- Usa `#0c0d0d`, branco e gradiente Tlin como base?
- CTA principal segue o padrao de pill + gradiente?
- Hover de nav/menu usa fundo arredondado claro?
- Mobile nao usa blur/sombra pesada demais?
- Imagens pequenas estao otimizadas?
- Popups respeitam teclado e safe area?
- Textos cabem em 360px de largura?
- Build passa com `npm run build`?
- Alteracoes nao incluem arquivos gerados como `tsconfig.tsbuildinfo`?
