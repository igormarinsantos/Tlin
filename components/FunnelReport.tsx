"use client";

import { useState } from "react";

type Cohort = { source: string; campaign: string; leads: number; demos: number; qualified_demos: number; attended_demos: number; won: number; awaiting_qualification: number };
type Report = { campaigns: Cohort[]; pending_operations: number; unmatched_events: number; mapped_stages: number };
const keys = ["leads", "demos", "qualified_demos", "attended_demos", "won", "awaiting_qualification"] as const;
const labels = ["Captações", "Demos agendadas", "Demos qualificadas", "Demos realizadas", "Vendas ganhas", "Sem avaliação"];

export function FunnelReport() {
  const [token, setToken] = useState("");
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const totals = Object.fromEntries(keys.map(key => [key, report?.campaigns.reduce((sum, row) => sum + Number(row[key]), 0) || 0]));
  const rate = (demos: number, leads: number) => leads ? `${(100 * demos / leads).toFixed(1)}%` : "—";

  async function refresh(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setReport(null);
    try {
      const response = await fetch(`/api/internal/funnel?from=${from}&to=${to}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setReport(result);
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível carregar."); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-white p-6 text-slate-900 md:p-12">
    <div className="mx-auto max-w-7xl space-y-8">
      <header><p className="text-sm text-slate-500">tlin.ai · Uso interno</p><h1 className="text-3xl font-semibold">Funil comercial</h1><p className="mt-2 text-slate-600">Resultados por data de captação, no fuso de São Paulo. Qualificação confirmada pela equipe no CRM.</p></header>
      <form onSubmit={refresh} className="flex flex-wrap items-end gap-4">
        <label className="grid gap-1 text-sm">Chave de acesso<input required type="password" autoComplete="off" value={token} onChange={event => setToken(event.target.value)} className="rounded border p-2" /></label>
        <label className="grid gap-1 text-sm">De<input required type="date" value={from} onChange={event => setFrom(event.target.value)} className="rounded border p-2" /></label>
        <label className="grid gap-1 text-sm">Até<input required type="date" value={to} onChange={event => setTo(event.target.value)} className="rounded border p-2" /></label>
        <button disabled={busy} className="rounded bg-slate-900 px-5 py-2 text-white disabled:opacity-50">{busy ? "Carregando…" : "Atualizar"}</button>
        {report && <button type="button" onClick={() => { setReport(null); setToken(""); }} className="rounded border px-5 py-2">Sair</button>}
      </form>
      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}
      {report && <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{keys.map((key, index) => <div key={key} className="rounded-xl border p-4"><p className="text-sm text-slate-600">{labels[index]}</p><p className="mt-2 text-3xl font-semibold">{totals[key]}</p></div>)}</div>
        <p>Captação → demo: <strong>{rate(totals.demos, totals.leads)}</strong> · Demos qualificadas / agendadas: <strong>{rate(totals.qualified_demos, totals.demos)}</strong></p>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="mb-3 text-left font-semibold">Origem e campanha do último toque</caption><thead><tr>{["Origem", "Campanha", ...labels].map(label => <th key={label} className="border-b p-3">{label}</th>)}</tr></thead><tbody>{report.campaigns.map(row => <tr key={`${row.source}:${row.campaign}`}><td className="border-b p-3">{row.source}</td><td className="border-b p-3">{row.campaign}</td>{keys.map(key => <td key={key} className="border-b p-3">{row[key]}</td>)}</tr>)}</tbody></table>{!report.campaigns.length && <p className="p-4">Nenhuma captação no período. Ausência de dados não significa tracking validado.</p>}</div>
        <aside className="rounded-xl bg-slate-100 p-4 text-sm">Saúde da integração: {report.pending_operations} operações aguardando conferência · {report.unmatched_events} eventos sem vínculo · {report.mapped_stages} etapas mapeadas. Esses totais cobrem todo o histórico.</aside>
        <p className="text-sm text-slate-500">Captações são solicitações distintas; uma pessoa pode retornar. Agendamentos repetidos para o mesmo contato e horário contam uma vez. Visitas e abandono são medidos no GA4. Custo por demo: indisponível até conectar os gastos de mídia.</p>
      </>}
    </div>
  </main>;
}
