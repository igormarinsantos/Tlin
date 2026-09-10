import { NextRequest, NextResponse } from "next/server";
import { findFreeSlots } from "@/lib/deskcomm-mcp";

const EVENT_TYPE_SLUG = process.env.DESKCOMM_DEMO_EVENT_TYPE_SLUG || "reuniao";
const DEFAULT_DIAS_A_FRENTE = 21;

/** Data civil (YYYY-MM-DD) do instante, no fuso da agenda — sem lib de timezone, Intl resolve isso nativamente. */
function civilDate(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(iso),
  );
}

/** "Quinta-feira, 10 de setembro" no fuso da agenda, pro rótulo do dia. */
function dayLabel(iso: string, timeZone: string, locale: string): string {
  const formatted = new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(iso));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const LOCALE_BY_LANG: Record<string, string> = { PT: "pt-BR", EN: "en-US", ES: "es-ES" };

/**
 * GET /api/public/demo/availability?diasAFrente=21&lang=PT
 *
 * Consulta os horarios livres reais no Deskcomm via MCP (`crm_find_free_slots`)
 * e agrupa por dia civil no fuso da propria agenda (Intl nativo, sem lib de
 * timezone). Nunca expoe o token do Deskcomm nem detalhes internos ao browser.
 *
 * Nota: nao usamos o parametro `dia` da tool (consulta de um unico dia) porque,
 * na instancia observada, ele nao filtra o retorno como a documentacao da tool
 * descreve — devolve o mesmo espalhamento de varios dias. Contornamos buscando
 * sempre o periodo inteiro e agrupando aqui.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const diasAFrenteParam = url.searchParams.get("diasAFrente");
  const diasAFrente = diasAFrenteParam ? Number(diasAFrenteParam) : DEFAULT_DIAS_A_FRENTE;
  const locale = LOCALE_BY_LANG[url.searchParams.get("lang") || "PT"] || "pt-BR";

  const result = await findFreeSlots({ eventTypeSlug: EVENT_TYPE_SLUG, diasAFrente, limite: 50 });

  if (result.ok === false) {
    return NextResponse.json({ success: false, error: result.error }, { status: 502 });
  }

  const { horarios, fuso_da_regra: timezone, publicou_horarios: schedulePublished, fuso_suposto: timezoneAssumed } =
    result.data;

  const byDate = new Map<string, { date: string; label: string; slots: { startsAt: string; endsAt: string; when: string }[] }>();
  for (const s of horarios) {
    const date = civilDate(s.inicio, timezone);
    if (!byDate.has(date)) {
      byDate.set(date, { date, label: dayLabel(s.inicio, timezone, locale), slots: [] });
    }
    byDate.get(date)!.slots.push({ startsAt: s.inicio, endsAt: s.fim, when: s.quando });
  }

  return NextResponse.json({
    success: true,
    timezone,
    schedulePublished,
    timezoneAssumed,
    days: Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date)),
  });
}
