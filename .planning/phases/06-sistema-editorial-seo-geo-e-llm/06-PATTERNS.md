# Phase 06: Sistema Editorial SEO, GEO e LLM - Pattern Map

**Mapped:** 2026-09-23
**Files analyzed:** 50 arquivos novos/modificados inferidos de `06-CONTEXT.md` e `06-RESEARCH.md`
**Analogs found:** 47 / 50

## Escopo extraído

O conjunto abaixo combina os arquivos nomeados na estrutura recomendada da pesquisa com os consumidores que necessariamente precisam mudar para cumprir BLOG-01..07. A lista mantém os três slugs atuais, trata `lib/blog.ts` como adaptador temporário de migração e inclui a persistência de atribuição até Supabase/Deskcomm. Nomes ainda não fixados pela pesquisa aparecem entre `<...>` e devem ser concretizados pelo planner sem alterar o papel indicado.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `content/editorial/articles/agentes-de-ia-no-whatsapp-para-vendas.ts` | model | transform | `lib/blog.ts` | role-match |
| `content/editorial/articles/como-avaliar-novos-modelos-de-ia-para-negocios.ts` | model | transform | `lib/blog.ts` | role-match |
| `content/editorial/articles/playbook-qualificacao-leads-whatsapp.ts` | model | transform | `lib/blog.ts` | role-match |
| `content/editorial/authors.ts` | model/config | transform | `lib/blog.ts` | partial |
| `content/editorial/taxonomy.ts` | model/config | transform | `lib/segmentLandingSeo.tsx` | role-match |
| `lib/editorial/types.ts` | model | transform | `lib/blog.ts` | exact-role |
| `lib/editorial/registry.ts` | service/registry | batch | `lib/blog.ts` | exact-role |
| `lib/editorial/queries.ts` | service | CRUD/read projection | `lib/blog.ts` | exact-role |
| `lib/editorial/validate.ts` | utility | transform | — | no close analog |
| `lib/editorial/structured-data.ts` | utility | transform | `lib/segmentLandingSeo.tsx` | exact-role |
| `lib/editorial/feed.ts` | utility | transform | — | no close analog |
| `lib/editorial/analytics.ts` | utility | event-driven | `lib/analytics-events.ts` | exact-role |
| `app/blog/page.tsx` | route/component | request-response | `app/blog/page.tsx` | exact |
| `app/blog/[slug]/page.tsx` | route/component | request-response | `app/blog/[slug]/page.tsx` | exact |
| `app/blog/temas/[cluster]/page.tsx` | route/component | request-response | `app/blog/[slug]/page.tsx` | role-match |
| `app/blog/rss.xml/route.ts` | route | request-response/transform | `app/blog/rss.xml/route.ts` | exact migration target |
| `app/blog/layout.tsx` | route/config | request-response | `app/blog/layout.tsx` | exact |
| `components/blog/ArticleBlocks.tsx` | component | transform | — | no close analog |
| `components/blog/EditorialCta.tsx` | component | event-driven | `components/QualificationController.tsx` | role-match |
| `components/blog/ArticleCard.tsx` | component | request-response | `components/blog/ArticleCard.tsx` | exact |
| `components/blog/BlogSearchAndGrid.tsx` | component | event-driven/filter | `components/blog/BlogSearchAndGrid.tsx` | exact |
| `components/blog/FeaturedCarousel.tsx` | component | event-driven | `components/blog/FeaturedCarousel.tsx` | exact |
| `components/blog/categoryVisuals.ts` | config | transform | `components/blog/categoryVisuals.ts` | exact |
| `app/sitemap.ts` | config/metadata route | batch | `app/sitemap.ts` | exact migration target |
| `app/robots.ts` | config/metadata route | request-response | `app/robots.ts` | exact |
| `public/llms.txt` | config/content | file-I/O | `public/llms.txt` | exact migration target |
| `public/llms-full.txt` | config/content | file-I/O | `public/llms-full.txt` | exact migration target |
| `lib/analytics-events.ts` | utility | event-driven | `lib/analytics-events.ts` | exact |
| `lib/utm.ts` | service/store | event-driven | `lib/utm.ts` | exact |
| `components/UTMTracker.tsx` | component/provider | event-driven | `components/UTMTracker.tsx` | exact |
| `components/QualificationController.tsx` | controller | event-driven | `components/QualificationController.tsx` | exact |
| `components/LeadQualificationPopup.tsx` | component/controller | event-driven/request-response | `components/LeadQualificationPopup.tsx` | exact |
| `components/lead-qualification/useQualificationRequest.ts` | hook/service | request-response | `components/lead-qualification/useQualificationRequest.ts` | exact |
| `app/api/leads/capture/route.ts` | route/controller | request-response | `app/api/leads/capture/route.ts` | exact |
| `app/api/notify/route.ts` | route/controller | request-response | `app/api/notify/route.ts` | exact |
| `lib/deskcomm-leads.ts` | service | request-response | `lib/deskcomm-leads.ts` | exact |
| `lib/supabase-leads.ts` | service | CRUD | `lib/supabase-leads.ts` | exact |
| `supabase/migrations/<timestamp>_editorial_attribution.sql` | migration | CRUD/batch | `supabase/migrations/20260917_funnel_reliability.sql` | role-match |
| `lib/blog.ts` | compatibility adapter/removal target | transform | `lib/blog.ts` | exact migration target |
| `docs/editorial/README.md` | config/documentation | batch | `docs/quality/phase-3-tracking-crm.md` | role-match |
| `docs/editorial/content-brief.md` | config/documentation | batch | `docs/quality/phase-3-tracking-crm.md` | partial |
| `docs/editorial/quality-checklist.md` | config/documentation | batch | `docs/quality/README.md` | role-match |
| `docs/editorial/distribution.md` | config/documentation | batch | `docs/quality/phase-3-tracking-crm.md` | role-match |
| `tests/editorial/fixtures/legacy-articles.ts` | test fixture | batch | `lib/blog.ts` | partial |
| `tests/editorial/content-contract.test.ts` | test | transform | `tests/segment-seo.test.ts` | role-match |
| `tests/editorial/information-architecture.test.ts` | test | request-response | `tests/segment-seo.test.ts` | role-match |
| `tests/editorial/discovery-outputs.test.ts` | test | request-response/transform | `tests/segment-seo.test.ts` | role-match |
| `tests/editorial/governance.test.ts` | test | file-I/O/transform | `tests/segment-seo.test.ts` | role-match |
| `tests/editorial/analytics-attribution.test.ts` | test | event-driven/CRUD | `tests/analytics-events.test.ts` | exact-role |
| `tests/editorial/migration-parity.test.ts` | test | batch/regression | `tests/funnel-database.test.ts` | role-match |

## Pattern Assignments

### Fonte editorial: artigos, autores, taxonomia, tipos, registro, queries e compatibilidade

**Aplica-se a:**

- `content/editorial/articles/*.ts`
- `content/editorial/authors.ts`
- `content/editorial/taxonomy.ts`
- `lib/editorial/types.ts`
- `lib/editorial/registry.ts`
- `lib/editorial/queries.ts`
- `lib/blog.ts`
- `tests/editorial/fixtures/legacy-articles.ts`

**Analog principal:** `lib/blog.ts`

**Contrato tipado atual** (`lib/blog.ts:1-17`):

```typescript
export type BlogCategory =
  | "IA em movimento"
  | "Vendas com IA"
  | "WhatsApp e atendimento"
  | "Guias e playbooks";

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  publishedAt: string;
  readingTime: string;
  author: string;
  featured?: boolean;
  content: { heading: string; paragraphs: string[] }[];
};
```

**Registro local e um objeto por artigo** (`lib/blog.ts:19-30`):

```typescript
export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "agentes-de-ia-no-whatsapp-para-vendas",
    title: "Agentes de IA no WhatsApp: onde eles realmente ajudam vendas",
    description:
      "Uma visão prática de como agentes de IA reduzem tempo de resposta, qualificam contatos e preservam o contexto para o time comercial.",
    category: "Vendas com IA",
    publishedAt: "2026-07-21",
    readingTime: "6 min de leitura",
    author: "Redação Tlin",
    featured: true,
    content: [
```

**Query e ordenação de relacionados atuais** (`lib/blog.ts:117-127`):

```typescript
export function getArticle(slug: string) {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

export function getRelatedArticles(article: BlogArticle, limit = 2) {
  const others = BLOG_ARTICLES.filter((a) => a.slug !== article.slug);
  const sameCategory = others.filter((a) => a.category === article.category);
  const rest = others.filter((a) => a.category !== article.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
```

**Como copiar:** preservar os três slugs e o shape consumido pela UI durante o tracer; mover cada objeto para um módulo próprio; agregar imports explicitamente em `registry.ts`; fazer toda leitura pública passar por `queries.ts`. O filtro `status === "published"`, a exclusão de datas futuras e a ordenação determinística devem existir uma vez na query, não ser repetidos por página/feed/sitemap. Relacionados devem migrar de categoria implícita para cluster/taxonomia explícita, mantendo fallback determinístico.

**Import/data-map pattern adicional** (`lib/segmentLandingSeo.tsx:1-17`):

```typescript
import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export type SegmentLandingKey = "clinicas" | "escolas" | "assessorias" | "advocacia";

type SegmentLandingSeo = {
  path: `/${string}`;
  title: string;
  description: string;
  // ...campos discretos do domínio
};

export const segmentLandingSeo: Record<SegmentLandingKey, SegmentLandingSeo> = {
```

Copiar o uso de union keys + `Record` para autores/taxonomia. Os módulos de artigo devem usar o tipo compartilhado (idealmente `satisfies EditorialArticle`) sem importar consumidores de rota.

---

### Validação editorial

**Arquivo:** `lib/editorial/validate.ts`

**Analog:** nenhum validador editorial próximo no repositório.

Usar funções puras que recebem o registro e retornam/lançam diagnósticos determinísticos. Cobrir, no mínimo: slug/ID único, autor/cluster existentes, status, `publishedAt`/`modifiedAt`, URL/protocolo, alt de imagem, heading IDs, links internos, fontes, CTA e gates obrigatórios para `published`. Não acoplar o validador a React, browser, filesystem ou `process.env`.

**Convenção de erro observável no código** (`app/api/leads/capture/route.ts:13-24`) — útil apenas para mensagens previsíveis, não para transformar o validador em route handler:

```typescript
const data = await req.json().catch(() => null);
if (!data || typeof data !== "object" || Array.isArray(data)) {
  return NextResponse.json({ success: false }, { status: 400 });
}
// validação explícita e retorno precoce
```

---

### Metadata, schema, hub e rotas editoriais

**Aplica-se a:**

- `lib/editorial/structured-data.ts`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/blog/temas/[cluster]/page.tsx`
- `app/blog/layout.tsx`
- `components/blog/ArticleCard.tsx`
- `components/blog/BlogSearchAndGrid.tsx`
- `components/blog/FeaturedCarousel.tsx`
- `components/blog/categoryVisuals.ts`

**Analog principal:** `lib/segmentLandingSeo.tsx`

**Metadata completa, sem depender de shallow merge do layout** (`lib/segmentLandingSeo.tsx:67-95`):

```typescript
export function createSegmentMetadata(segment: SegmentLandingKey): Metadata {
  const page = segmentLandingSeo[segment];
  const url = absoluteUrl(page.path);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
      languages: { "pt-BR": url },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: page.title,
      description: page.description,
      url,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [socialImage.url],
    },
  };
}
```

Artigos devem trocar `type: "website"` por `"article"` e adicionar `publishedTime`, `modifiedTime`, autores e imagem derivados do registro. Hubs usam `website` e seu próprio canonical. Não herdar implicitamente `openGraph.images` do `app/blog/layout.tsx`.

**Schema como projeção da mesma configuração** (`lib/segmentLandingSeo.tsx:97-137`):

```typescript
export function createSegmentStructuredData(segment: SegmentLandingKey) {
  const page = segmentLandingSeo[segment];
  const url = absoluteUrl(page.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "pt-BR",
        isPartOf: { "@id": absoluteUrl("/#website") },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
        ],
      },
    ],
  };
}
```

Para `Article`, ligar `publisher` a `absoluteUrl("/#organization")`, `author.url` ao registro real de autor e `mainEntityOfPage` ao canonical. Não copiar a inconsistência atual de `app/blog/[slug]/page.tsx:41`, que declara `Organization` enquanto a UI mostra uma pessoa.

**Serialização JSON-LD segura** (`lib/segmentLandingSeo.tsx:140-149`; também `lib/structuredData.ts:222-224`):

```tsx
export function SegmentLandingStructuredData({ segment }: { segment: SegmentLandingKey }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(createSegmentStructuredData(segment)).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

Centralizar a serialização em helper compartilhado; nenhum objeto editorial deve ser interpolado cru em `<script>`.

**Static params, notFound e consulta server-side atuais** (`app/blog/[slug]/page.tsx:19-40`):

```typescript
export function generateStaticParams() { return BLOG_ARTICLES.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  // metadata derivada do artigo
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
```

Trocar as leituras diretas pelo `getPublishedArticles()`/`getArticleBySlug()` central. O hub tem o mesmo desenho: `generateStaticParams()` a partir de clusters públicos, metadata por cluster e `notFound()` para cluster inexistente/não publicável.

**UI a preservar** (`components/blog/ArticleCard.tsx:31-60`):

```tsx
<div className={`relative flex flex-1 flex-col px-6 pb-6 ${featured ? "md:px-10 md:pb-10" : ""}`}>
  <span>{article.category}</span>
  <h2 className={`relative ${featured ? "text-3xl md:text-5xl" : "text-xl"} text-balance font-black tracking-tight text-[#0c0d0d]`}>
    <Link href={`/blog/${article.slug}`} className="outline-none after:absolute after:inset-0">{article.title}</Link>
  </h2>
  <p className="relative mt-4 text-pretty leading-7 text-zinc-500">{article.description}</p>
  <span>{formatArticleDate(article.publishedAt)}</span>
</div>
```

Preservar classes/aparência e trocar somente o tipo/projeção. Hubs precisam de links SSR reais; `BlogSearchAndGrid` continua sendo aprimoramento de busca, não arquitetura de informação.

---

### Renderer de blocos editoriais

**Arquivo:** `components/blog/ArticleBlocks.tsx`

**Analog:** não existe renderer de união discriminada. O trecho mais próximo é o loop atual em `app/blog/[slug]/page.tsx:117-129`:

```tsx
<div className="space-y-12">
  {article.content.map((section) => (
    <section key={section.heading} id={slugifyHeading(section.heading)} className="scroll-mt-28">
      <h2 className="text-2xl font-black tracking-tight text-[#0c0d0d]">{section.heading}</h2>
      <div className="mt-4 space-y-4 text-lg leading-8 text-zinc-700">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  ))}
</div>
```

Extrair as classes existentes por tipo de bloco; renderizar texto como children React. Não aceitar `dangerouslySetInnerHTML`, JSX armazenado no conteúdo ou HTML arbitrário. Heading IDs vêm do modelo validado, não de texto mutável na borda.

---

### CTA editorial e integração com o fluxo global

**Aplica-se a:**

- `components/blog/EditorialCta.tsx`
- `components/QualificationController.tsx`
- `components/LeadQualificationPopup.tsx`
- `components/lead-qualification/useQualificationRequest.ts`

**Analog de abertura global:** `components/QualificationController.tsx`

**Evento único e baixa cardinalidade** (`components/QualificationController.tsx:14-27`):

```typescript
useEffect(() => {
  const open = (event: Event) => {
    if (openRef.current) return;
    const detail = (event as CustomEvent<{ plan?: string; source?: string }>).detail;
    const nextPlan = typeof detail?.plan === "string" ? detail.plan || "TLIN" : "TLIN";
    openRef.current = true;
    setPlan(nextPlan);
    trackFunnelEvent("lead_form_opened", {
      plan_name: nextPlan,
      cta_source: typeof detail?.source === "string" ? detail.source : "unknown",
    });
  };
  window.addEventListener("open-qualification", open);
  return () => window.removeEventListener("open-qualification", open);
}, []);
```

`EditorialCta` deve ser um client component pequeno: emitir `article_cta_click` com IDs controlados (`article_slug`, `content_cluster`, `content_intent`, `cta_source`, `cta_location`) e despachar o mesmo `open-qualification`. Não criar listener local no blog. Ampliar o tipo de `detail` do controlador para transportar o contexto, preservando plano/source e a trava de abertura única.

**CTA visual reutilizável** (`components/DemoHoverPill.tsx:8-16,30-42`):

```tsx
type DemoHoverPillProps = {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
};

export function DemoHoverPill({ children, className = "", enabled = true }: DemoHoverPillProps) {
  if (!enabled) return <>{children}</>;
  return <div className={`relative ${className}`}>{children}</div>;
}
```

Usar este wrapper no CTA preto, mantendo foco/teclado no botão interno. Não copiar o `<a href="https://tlin.ia.br/#planos">` atual (`app/blog/[slug]/page.tsx:131-140`).

**Contexto que já entra no lead em captura e confirmação** (`components/LeadQualificationPopup.tsx:93-97,657-661`):

```typescript
capture({ ...formData, utm: getUtmLeadPayload() });

const outcome = await submit({
  ...updatedData, planName, ...score, utm: getUtmLeadPayload(),
  demoSlot: { starts_at: selectedSlot!.startsAt },
});
```

Copiar o contexto editorial para o payload retornado por `getUtmLeadPayload()` (ou helper de atribuição composto) antes da captura; não depender só do evento GA4. Tokens Turnstile continuam fora de storage e são acrescentados apenas na requisição (`useQualificationRequest.ts:35-43,67-74`).

---

### Analytics, first/last content touch e sanitização

**Aplica-se a:**

- `lib/editorial/analytics.ts`
- `lib/analytics-events.ts`
- `lib/utm.ts`
- `components/UTMTracker.tsx`
- `tests/editorial/analytics-attribution.test.ts`
- `tests/analytics-events.test.ts`

**Allowlist/PII pattern** (`lib/analytics-events.ts:14-21`):

```typescript
// Explicit parameters only: contact details, message text and click IDs never go to GA.
const allowed = /^(first_|last_)?utm_(source|medium|campaign|term|content)$|^(event_category|lead_step|field_name|plan_name|lead_score|lead_quality|lead_volume|team_size|form_mode|cta_source|cta_location|cta_text|source|destination|solution|page_location|page_referrer|page_path|event_id)$/;
export function cleanAnalyticsParams(params: Params): Params {
  return Object.fromEntries(Object.entries(params).filter(([key, value]) => allowed.test(key) && value !== undefined).map(([key, value]) => {
    if (typeof value !== "string") return [key, value];
    const clean = key === "page_location" || key === "page_referrer" ? safePageUrl(value) : value;
    return [key, /@|\+?\d[\d ().-]{8,}\d/.test(clean) ? "[redacted]" : clean.slice(0, 200)];
  }));
}
```

Adicionar apenas chaves editoriais de cardinalidade controlada. Não liberar payload arbitrário para acomodar conteúdo. `article_slug`, `content_cluster`, `content_intent`, `content_group`, `cta_id`, `method`, `content_type` e `item_id` precisam de testes de aceitação; e-mail, telefone, título livre e texto digitado permanecem bloqueados.

**Persistência redundante e validação temporal** (`lib/utm.ts:128-151`):

```typescript
function saveUtm(key: string, utm: UtmParams): void {
  const json = JSON.stringify(utm);
  try { localStorage.setItem(key, json); } catch { /* quota exceeded */ }
  setCookie(key, json);
}

function validStoredUtm(value: UtmParams): UtmParams | null {
  const time = Date.parse(value?.captured_at || "");
  if (!Number.isFinite(time) || time > Date.now() || Date.now() - time > COOKIE_MAX_AGE * 1000 || typeof value.utm_source !== "string") return null;
  return { ...value, landing_page: safePageUrl(value.landing_page || ""), current_page: safePageUrl(value.current_page || ""), referrer: safePageUrl(value.referrer || "") };
}
```

**First touch imutável, last touch atualizável** (`lib/utm.ts:161-191`):

```typescript
const existingFirst = loadUtm(KEY_FIRST);
if (!existingFirst) {
  const firstUtm = parsed || getFallbackUtm();
  saveUtm(KEY_FIRST, firstUtm);
}

if (parsed) {
  saveUtm(KEY_LAST, parsed);
} else if (!loadUtm(KEY_LAST)) {
  saveUtm(KEY_LAST, getFallbackUtm());
}
```

Criar first/last content touch paralelo, sem reutilizar `utm_campaign`. Validar TTL, slug/cluster/intent/CTA contra formatos controlados e limpar estado inválido. `UTMTracker` já executa por mudança de pathname (`components/UTMTracker.tsx:25-39`); a captura de contexto editorial deve entrar nesse ciclo sem criar outro observer global.

**Payload durável existente** (`lib/utm.ts:220-262`):

```typescript
function getUtmEventPayload(extraData: Record<string, EventParam> = {}) {
  const first = getFirstTouch();
  const last = getLastTouch();
  const payload: Record<string, string | number | boolean> = {
    first_utm_source: first.utm_source,
    // ...
    last_utm_content: last.utm_content,
  };
  Object.entries(extraData).forEach(([key, value]) => {
    if (value !== undefined) payload[key] = value;
  });
  return payload;
}

export function getUtmLeadPayload() {
  const first = getFirstTouch(); const last = getLastTouch();
  return { ...getUtmEventPayload(), first_gclid: first.gclid, last_gclid: last.gclid, first_fbclid: first.fbclid, last_fbclid: last.fbclid };
}
```

Estender a projeção do lead com first/last editorial; a projeção de analytics continua passando por `cleanAnalyticsParams` e não recebe click IDs.

---

### Persistência server-side e relatório comercial

**Aplica-se a:**

- `app/api/leads/capture/route.ts`
- `app/api/notify/route.ts`
- `lib/deskcomm-leads.ts`
- `lib/supabase-leads.ts`
- `supabase/migrations/<timestamp>_editorial_attribution.sql`

**Captura precoce preserva a mesma identidade** (`app/api/leads/capture/route.ts:26-36`):

```typescript
const leadCaptureId = typeof data.leadCaptureId === "string" && data.leadCaptureId.length > 0 && data.leadCaptureId.length <= 128 ? data.leadCaptureId : crypto.randomUUID();
const result = await captureDeskcommLead({
  leadCaptureId,
  name,
  phone: `+${countryCode}${phone}`,
  status: "novo",
  utm: typeof data.utm === "object" && data.utm ? data.utm : undefined,
});
if (result.ok) await saveLeadSubmission({ leadCaptureId, name, phone, countryCode, utm: data.utm,
  deskcommLeadId: result.leadId, deskcommContactId: result.contactId,
  contactKey: operationKey("contact", `+${countryCode}${phone}`), capturedAt: new Date().toISOString(), payload: {} });
```

Passar atribuição editorial nas duas gravações (`capture` e `notify`) com a mesma identidade. Validar shape/tamanho no servidor; não confiar no browser para autorizar nenhuma operação.

**Projeção final existente** (`app/api/notify/route.ts:120-148`):

```typescript
const deskcommCapture = await captureDeskcommLead({
  leadCaptureId,
  name,
  phone: fullPhone,
  email,
  leadScore: lead_score,
  leadQuality: lead_quality,
  status: "novo",
  utm,
});

let supabaseResult = await saveLeadSubmission({
  leadCaptureId,
  deskcommLeadId: deskcommCapture.ok ? deskcommCapture.leadId : undefined,
  deskcommContactId: deskcommCapture.ok ? deskcommCapture.contactId : undefined,
  // ...dados comerciais...
  utm,
  payload: { ...data, turnstileToken: undefined },
});
```

O contexto editorial deve ser explicitamente projetado e o `turnstileToken` continuar removido. Não declarar BLOG-06 completo somente porque o JSON chegou ao Supabase.

**Allowlist escalar do CRM** (`lib/deskcomm-leads.ts:42-46`):

```typescript
// The CRM inbound mapper discards nested objects. Keep attribution scalar.
...Object.fromEntries(Object.entries(input.utm || {}).filter(([key, value]) =>
  /^(first_|last_)?(utm_(source|medium|campaign|term|content)|landing_page|current_page|referrer|referrer_host|gclid|fbclid)$/.test(key)
  && typeof value === "string")),
```

Ampliar com nomes escalares editoriais aprovados, mantendo allowlist explícita. Não enviar objeto editorial aninhado ao Deskcomm.

**RPC/projeção de banco** (`lib/supabase-leads.ts:43-52`):

```typescript
const row = await funnelRpc("record_funnel_lead", { p_lead: {
  lead_capture_id: input.leadCaptureId,
  // ...
  utm: input.utm || {}, payload: input.payload || {},
} });
```

**Semântica first/last no upsert e agregação** (`supabase/migrations/20260917_funnel_reliability.sql:98-110,149-160`):

```sql
on conflict (lead_capture_id) where lead_capture_id is not null do update set
  utm = current.utm || (
    select coalesce(jsonb_object_agg(key,value),'{}')
    from jsonb_each(excluded.utm)
    where key not like 'first_%' or not current.utm ? key
  ),
  payload = current.payload || excluded.payload;

select
  coalesce(nullif(l.utm->>'last_utm_source',''),'direct') as source,
  coalesce(nullif(l.utm->>'last_utm_campaign',''),'(not set)') as campaign,
  count(*) filter (where b.id is not null) as demos,
  count(*) filter (where b.id is not null and l.qualified is true) as qualified_demos,
  count(*) filter (where l.won_at is not null) as won
from public.lead_form_submissions l;
```

A migration editorial deve preservar first touch e atualizar last touch com a mesma regra, sem reescrever históricos que não têm evidência. O relatório precisa agrupar por IDs editoriais até demo confirmada/qualificação/venda; manter RLS/revokes/grants e testar em PGlite antes de qualquer aplicação externa.

---

### Sitemap, RSS, robots e artefatos LLM

**Aplica-se a:**

- `app/sitemap.ts`
- `app/blog/rss.xml/route.ts`
- `app/robots.ts`
- `public/llms.txt`
- `public/llms-full.txt`
- `lib/editorial/feed.ts`

**Sitemap typed projection** (`app/sitemap.ts:1-20`):

```typescript
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogArticles = BLOG_ARTICLES.map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`),
    lastModified: new Date(`${article.publishedAt}T12:00:00`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
```

Manter `MetadataRoute.Sitemap` e `absoluteUrl`, mas substituir `BLOG_ARTICLES` pela projeção publicada e usar `modifiedAt` verdadeiro. Incluir hubs publicados. Não copiar `const lastModified = new Date()` (`app/sitemap.ts:6`) para conteúdo estável, nem depender de `priority`/`changeFrequency` como sinal de Google.

**Route Handler RSS atual** (`app/blog/rss.xml/route.ts:1-8`):

```typescript
export function GET() {
  const items = BLOG_ARTICLES.map((article) => `<item>...</item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>...</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
```

Copiar apenas o contrato do Route Handler/headers. A interpolação/CDATA atual é alvo de substituição, não padrão: `lib/editorial/feed.ts` deve escapar `&`, `<`, `>`, aspas quando aplicável, Unicode e a sequência `]]>`; receber somente artigos já publicados; manter link/GUID/canonical iguais e datas válidas.

**Política de crawlers existente** (`app/robots.ts:4-20`):

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
```

Preservar `MetadataRoute.Robots`; separar qualquer decisão futura de search/fetch/treino. Não mudar a permissão de `GPTBot`/`Google-Extended` sem decisão explícita do owner. `llms.txt` e `llms-full.txt` continuam complementares e factuais; apontar para hubs/artigos publicados sem prometer ranking/citação e sem duplicar claims mutáveis não derivados do registro.

---

### Testes de contrato, descoberta, atribuição e paridade

**Aplica-se a:** todos os arquivos em `tests/editorial/` e ajustes em `tests/analytics-events.test.ts`.

**Teste de projeções puras** (`tests/segment-seo.test.ts:9-35`):

```typescript
const segments = Object.keys(segmentLandingSeo) as SegmentLandingKey[];

describe("segment landing SEO", () => {
  it("keeps every title concise and every canonical unique", () => {
    const canonicals = segments.map((segment) => {
      const metadata = createSegmentMetadata(segment);
      expect(metadata.openGraph?.images).toBeTruthy();
      expect(metadata.twitter?.images).toBeTruthy();
      return String(metadata.alternates?.canonical);
    });
    expect(new Set(canonicals).size).toBe(segments.length);
  });

  it("describes each page as a WebPage, Service and BreadcrumbList", () => {
    for (const segment of segments) {
      const schema = createSegmentStructuredData(segment);
      expect(schema["@graph"].map((entity) => entity["@type"])).toEqual([
        "WebPage", "Service", "BreadcrumbList",
      ]);
    }
  });
});
```

Copiar o padrão data-driven: iterar todo o registro e comparar metadata/schema/hub/sitemap/feed, incluindo drafts e publicação futura ausentes de toda projeção pública.

**jsdom, cleanup e sanitização** (`tests/analytics-events.test.ts:1-20`):

```typescript
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  localStorage.clear();
  document.cookie = "tlin_first_utm=; max-age=0; path=/";
  document.cookie = "tlin_last_utm=; max-age=0; path=/";
});

it("strips contact fields and query strings from analytics", () => {
  expect(cleanAnalyticsParams({ email: "ana@example.test", phone: "11999999999", lead_step: 4 }))
    .toEqual({ lead_step: 4 });
});
```

Adicionar cookies/storage editoriais ao cleanup. Testar first touch imutável, last touch atualizável, expiração, IDs permitidos, PII/título livre bloqueados e contexto presente tanto no evento quanto no payload server-side.

**Migration integration test** (`tests/funnel-database.test.ts:10-16,29-35`):

```typescript
beforeAll(async () => {
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
  for (const file of [/* migrations em ordem */]) {
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
  }
}, 30_000);

it("deduplicates a capture and never treats score as human qualification", async () => {
  await rpc("record_funnel_lead", [lead]);
  await rpc("record_funnel_lead", [{ ...lead, utm: { first_utm_source: "meta", last_utm_source: "meta" } }]);
  expect(rows.rows[0]).toMatchObject({
    qualified: null,
    utm: { first_utm_source: "google", last_utm_source: "meta" },
  });
});
```

Adicionar a nova migration à ordem real e provar first/last editorial, relatório por artigo/cluster e ausência de inferência retroativa. Nunca chamar serviços reais.

**Matriz mínima por arquivo:**

| Test file | Assertions to copy/extend |
|---|---|
| `content-contract.test.ts` | Registro completo, IDs/slugs únicos, datas ISO com timezone, autor/taxonomia válidos, sources/links/CTA/image/alt e gates de `published` |
| `information-architecture.test.ts` | Cluster/hub existente, URL owner sem colisão com landing, breadcrumb e links internos resolvíveis |
| `discovery-outputs.test.ts` | Uma mesma canonical/data/autor/imagem em metadata, JSON-LD, sitemap e RSS; JSON-LD sem `<`; XML adversarial escapado |
| `governance.test.ts` | Templates versionados existem e artigos publicados carregam brief/revisores/evidência/approval exigidos |
| `analytics-attribution.test.ts` | Allowlist, sem PII, first/last content touch, captura + confirmação + Deskcomm/Supabase simulados |
| `migration-parity.test.ts` | Três slugs, titles/canonicals, links, feed/sitemap, HTML essencial e aparência estrutural preservados antes de remover adapter |

---

### Governança e documentação editorial

**Aplica-se a:**

- `docs/editorial/README.md`
- `docs/editorial/content-brief.md`
- `docs/editorial/quality-checklist.md`
- `docs/editorial/distribution.md`

**Analog:** `docs/quality/phase-3-tracking-crm.md`

**Estrutura factual e operacional a copiar** (`docs/quality/phase-3-tracking-crm.md:8-30,128-181`):

```markdown
## Contrato comercial

**Demo qualificada = agendamento confirmado pelo CRM + avaliação positiva da equipe.**

## Eventos do site

| Evento | Quando acontece |
| --- | --- |
| `page_view` | Entrada e mudança de pathname público |

## Ativação pendente

## Evidências de verificação
```

O README editorial deve distinguir contrato, workflow/owners, estados, cadência, pontos externos pendentes e evidências. O brief registra intenção, URL owner, público, fontes, contribuição original, claims, reviewer, links úteis, CTA e hipótese de medição. O checklist separa gates automatizados de revisão factual/comercial humana. `distribution.md` descreve processo manual, convenção UTM e pontos de integração futuros; não automatiza publicação em terceiros nesta fase.

## Shared Patterns

### Imports e estilo

**Source:** `lib/segmentLandingSeo.tsx:1-2`, `app/blog/[slug]/page.tsx:1-17`

- Imports de raiz usam `@/...`; imports relativos ficam entre componentes irmãos fortemente acoplados.
- Dois espaços, aspas duplas e ponto e vírgula em arquivos novos. Não copiar as aspas simples históricas de `lib/utm.ts` para módulos novos.
- Componentes React em PascalCase; utilitários e dados em `lib/`/`content/` com nomes camelCase ou kebab-case.

### Uma projeção pública

**Source:** `lib/blog.ts:117-127` (query atual a substituir)

Todos os consumidores públicos importam `queries.ts`, nunca artigos individuais nem o registry cru. Somente `published` e `publishedAt <= now` chegam a static params, rotas, hubs, sitemap, RSS e llms.

### URLs absolutas

**Source:** `lib/siteConfig.ts:19-30`

```typescript
export function absoluteUrl(path = "/") {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
```

Canonical, schema, sitemap, RSS e share usam este helper. O domínio é `https://tlin.ia.br`.

### JSON-LD

**Source:** `lib/segmentLandingSeo.tsx:140-149`

Sempre `JSON.stringify(value).replace(/</g, "\\u003c")`; objeto construído de dados validados; publisher ligado a `/#organization`; sem schema inventado “para IA”.

### Erros e integrações

**Source:** `lib/deskcomm-leads.ts:50-92`, `lib/supabase-leads.ts:42-65`

- Retornos previsíveis para ausência/configuração inválida.
- `console.error`/`console.warn` apenas para falhas externas, sem credenciais ou payload de auth.
- Em unions Deskcomm, preferir `result.ok === false` quando precisar narrowing consistente.
- Testes simulam fetch/CRM/banco; não geram lead, e-mail ou agenda real.

### Segurança de analytics

**Source:** `lib/analytics-events.ts:14-21`

Allowlist explícita, URLs sem query/hash, strings truncadas, e-mail/telefone redacted. Conteúdo editorial usa IDs controlados e nunca títulos/texto do usuário como dimensão.

### Migração tracer

**Source:** `lib/blog.ts`, `app/blog/[slug]/page.tsx`, `tests/segment-seo.test.ts`

Congelar fixture dos três artigos; migrar primeiro `agentes-de-ia-no-whatsapp-para-vendas`; adaptar consumers; provar paridade; migrar os dois restantes; remover o array/adaptador somente depois. Evitar um commit que simultaneamente exclui `lib/blog.ts` e reescreve todas as superfícies.

## No Analog Found

| File | Role | Data Flow | Reason / Research pattern to use |
|---|---|---|---|
| `lib/editorial/validate.ts` | utility | transform | Não existe validador de invariantes editoriais; usar funções puras + matriz de contratos de `06-RESEARCH.md` |
| `lib/editorial/feed.ts` | utility | transform | O RSS atual é o anti-pattern a substituir; implementar escape XML pequeno e testado conforme `06-RESEARCH.md` |
| `components/blog/ArticleBlocks.tsx` | component | transform | O código atual só renderiza headings/parágrafos; usar tagged union + componentes React, sem HTML cru |

## Tracked-source gate

Todos os análogos nomeados acima foram verificados com `git ls-files -- <path>` e são fontes rastreadas no repositório. Nenhum caminho de mirror em `.gsd/`, cache de plugin, `.next` ou dependência instalada foi usado.

## Metadata

**Analog search scope:** `app/blog/`, `app/api/`, `components/blog/`, `components/lead-qualification/`, `components/`, `lib/`, `tests/`, `supabase/migrations/`, `docs/quality/`, `public/`

**Files scanned:** 32 arquivos rastreados, além de `06-CONTEXT.md`, `06-RESEARCH.md`, `AGENTS.md`, `README.md` e `docs/quality/README.md`

**Pattern extraction date:** 2026-09-23

**Notas de planejamento:**

- A política de crawlers de treino exige decisão explícita; não inferir autorização a partir do robots atual.
- Perfis/imagens/credenciais de autores precisam ser reais e aprovados; não inventar ativos.
- GA4 custom dimensions, Search Console e validação de produção são checkpoints externos, não efeitos automáticos do código.
- Atribuição fechada até qualificação/venda depende do contrato da Phase 1; manter dependência aberta se o join no CRM não puder ser comprovado.
