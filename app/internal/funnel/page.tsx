"use client";

import { useState } from "react";
import { TlinButton, TlinCard, TlinField } from "@/components/ui/tlin";

type CampaignRow = {
  source: string;
  campaign: string;
  leads: number;
  demos: number;
  qualified_demos: number;
  attended_demos: number;
  won: number;
  awaiting_qualification: number;
};

type ContentRow = {
  touch: "first" | "last";
  article_slug: string;
  content_cluster: string;
  cta_id: string;
  leads: number;
  demos: number;
  qualified_demos: number;
  won: number;
};

type Report = {
  campaigns: CampaignRow[];
  content: ContentRow[];
  pending_operations: number;
  unmatched_events: number;
  mapped_stages: number;
};

const campaignKeys = ["leads", "demos", "qualified_demos", "attended_demos", "won", "awaiting_qualification"] as const;
const campaignLabels = ["Captações", "Demos confirmadas", "Demos qualificadas", "Demos realizadas", "Vendas ganhas", "Sem avaliação"];
const contentKeys = ["leads", "demos", "qualified_demos", "won"] as const;
const contentLabels = ["Captações", "Demos confirmadas", "Qualificados pela equipe", "Vendas ganhas"];

function dimensionLabel(value: string) {
  return value === "unattributed" ? "Não atribuído" : value;
}

export default function FunnelReportPage() {
  const [token, setToken] = useState("");
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const totals = Object.fromEntries(campaignKeys.map(key => [key, report?.campaigns.reduce((sum, row) => sum + Number(row[key]), 0) || 0])) as Record<typeof campaignKeys[number], number>;
  const rate = (result: number, base: number) => base ? `${(100 * result / base).toFixed(1)}%` : "—";

  async function refresh(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setReport(null);
    try {
      const response = await fetch(`/api/internal/funnel?from=${from}&to=${to}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar.");
    } finally {
      setBusy(false);
    }
  }

  return <>
    <title>Funil comercial | tlin.ai</title>
    <meta name="robots" content="noindex, nofollow" />
    <main className="min-h-screen bg-white p-6 text-tlin-ink md:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm text-tlin-muted">tlin.ai · Uso interno</p>
          <h1 className="text-3xl font-bold tracking-tight">Funil comercial</h1>
          <p className="mt-2 text-zinc-600">Resultados por data de captação, no fuso de São Paulo. Qualificação confirmada pela equipe no CRM.</p>
        </header>
        <form onSubmit={refresh} className="flex flex-wrap items-end gap-4">
          <label className="grid gap-1 text-sm">Chave de acesso<TlinField required type="password" autoComplete="off" value={token} onChange={event => setToken(event.target.value)} /></label>
          <label className="grid gap-1 text-sm">De<TlinField required type="date" value={from} onChange={event => setFrom(event.target.value)} /></label>
          <label className="grid gap-1 text-sm">Até<TlinField required type="date" value={to} onChange={event => setTo(event.target.value)} /></label>
          <TlinButton type="submit" disabled={busy} size="sm">{busy ? "Carregando…" : "Atualizar"}</TlinButton>
          {report && <TlinButton type="button" variant="secondary" size="sm" onClick={() => { setReport(null); setToken(""); }}>Sair</TlinButton>}
        </form>
        {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}
        {report && <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {campaignKeys.map((key, index) => <TlinCard key={key} className="p-4"><p className="text-sm text-tlin-muted">{campaignLabels[index]}</p><p className="mt-2 text-3xl font-semibold">{totals[key]}</p></TlinCard>)}
          </div>
          <p>Captação → demo: <strong>{rate(totals.demos, totals.leads)}</strong> · Demos qualificadas / confirmadas: <strong>{rate(totals.qualified_demos, totals.demos)}</strong></p>
          <section className="space-y-3" aria-labelledby="campaign-report-title">
            <h2 id="campaign-report-title" className="text-xl font-bold tracking-tight">Aquisição por origem e campanha</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Origem e campanha do último toque</caption>
                <thead><tr>{["Origem", "Campanha", ...campaignLabels].map(label => <th key={label} className="border-b p-3">{label}</th>)}</tr></thead>
                <tbody>{report.campaigns.map(row => <tr key={`${row.source}:${row.campaign}`}><td className="border-b p-3">{row.source}</td><td className="border-b p-3">{row.campaign}</td>{campaignKeys.map(key => <td key={key} className="border-b p-3 tabular-nums">{row[key]}</td>)}</tr>)}</tbody>
              </table>
              {!report.campaigns.length && <p className="p-4">Nenhuma captação no período. Ausência de dados não significa tracking validado.</p>}
            </div>
          </section>
          <section className="space-y-3" aria-labelledby="content-report-title">
            <div>
              <h2 id="content-report-title" className="text-xl font-bold tracking-tight">Conteúdo até resultado comercial</h2>
              <p className="mt-1 text-sm text-tlin-muted">Descoberta e cliques continuam no analytics. Esta tabela começa na captação persistida e não promove interação, score ou abandono a demo, qualificação ou venda.</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-tlin-border">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Resultados comerciais agregados por artigo, cluster, CTA e primeiro ou último toque</caption>
                <thead className="bg-tlin-surface-muted"><tr>{["Atribuição", "Artigo", "Cluster", "CTA", ...contentLabels].map(label => <th key={label} className="border-b border-tlin-border p-3">{label}</th>)}</tr></thead>
                <tbody>{report.content.map((row, index) => <tr key={`${row.touch}:${row.article_slug}:${row.content_cluster}:${row.cta_id}:${index}`}>
                  <td className="border-b border-tlin-border p-3 font-medium">{row.touch === "first" ? "Primeiro toque" : "Último toque"}</td>
                  <td className="border-b border-tlin-border p-3">{dimensionLabel(row.article_slug)}</td>
                  <td className="border-b border-tlin-border p-3">{dimensionLabel(row.content_cluster)}</td>
                  <td className="border-b border-tlin-border p-3">{dimensionLabel(row.cta_id)}</td>
                  {contentKeys.map(key => <td key={key} className="border-b border-tlin-border p-3 tabular-nums">{row[key]}</td>)}
                </tr>)}</tbody>
              </table>
              {!report.content.length && <p className="p-4">Nenhuma atribuição editorial persistida no período.</p>}
            </div>
          </section>
          <TlinCard tone="muted" className="p-4 text-sm">Saúde da integração: {report.pending_operations} operações aguardando conferência · {report.unmatched_events} eventos sem vínculo · {report.mapped_stages} etapas mapeadas. Esses totais cobrem todo o histórico.</TlinCard>
          <p className="text-sm text-slate-500">Captações são solicitações distintas; uma pessoa pode retornar. Agendamentos repetidos para o mesmo contato e horário contam uma vez. Visitas e abandono são medidos no analytics. Custo por demo: indisponível até conectar os gastos de mídia.</p>
        </>}
      </div>
    </main>
  </>;
}
