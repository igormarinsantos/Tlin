import type { Metadata } from "next";
import { TlinButton, TlinCard, TlinEyebrow, TlinGradientText, TlinSpecimen } from "@/components/ui/tlin";

export const metadata: Metadata = {
  title: "Design system | tlin.ai",
  robots: { index: false, follow: false },
};

/** Catálogo vivo: os exemplos importam os mesmos componentes usados no site. */
export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-tlin-surface-muted px-4 py-12 text-tlin-ink md:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <TlinEyebrow>Uso interno</TlinEyebrow>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">Sistema visual <TlinGradientText>tlin.ai</TlinGradientText></h1>
          <p className="mt-5 text-base leading-relaxed text-tlin-muted md:text-lg">Tokens e componentes que mantêm a experiência comercial consistente em páginas, funis e painéis.</p>
        </header>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <TlinSpecimen title="Ações de conversão">
            <TlinButton>Agendar demo</TlinButton>
            <TlinButton variant="secondary">Ver como funciona</TlinButton>
            <TlinButton variant="gradient">Começar agora</TlinButton>
          </TlinSpecimen>
          <TlinSpecimen title="Superfícies e hierarquia">
            <TlinCard className="w-full p-5"><p className="font-bold">Card claro</p><p className="mt-1 text-sm text-tlin-muted">Informação secundária com pouco ruído visual</p></TlinCard>
            <TlinCard tone="dark" className="w-full p-5"><p className="font-bold">Card escuro</p><p className="mt-1 text-sm text-white/60">Ênfase para decisões e CTAs</p></TlinCard>
          </TlinSpecimen>
        </div>

        <TlinSpecimen title="Tokens oficiais" className="mt-5">
          <div className="grid w-full gap-3 sm:grid-cols-4">
            {[
              ["tlin-ink", "bg-tlin-ink"],
              ["tlin-purple", "bg-tlin-purple"],
              ["tlin-blue", "bg-tlin-blue"],
              ["tlin-surface-muted", "bg-tlin-surface-muted"],
            ].map(([token, colorClass]) => <div key={token} className="rounded-xl border border-zinc-100 bg-white p-3"><span className={`block h-12 rounded-lg ${colorClass}`} /><p className="mt-2 text-xs font-bold text-tlin-muted">{token}</p></div>)}
          </div>
        </TlinSpecimen>
      </div>
    </main>
  );
}
