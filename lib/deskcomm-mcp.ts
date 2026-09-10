/**
 * Cliente fino para o servidor MCP do Deskcomm CRM (protocolo MCP, transporte
 * Streamable HTTP/JSON-RPC 2.0). Server-only: usa DESKCOMM_API_TOKEN, que
 * nunca deve chegar ao browser.
 */

type McpToolResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const MCP_URL = process.env.DESKCOMM_MCP_URL || "";
const API_TOKEN = process.env.DESKCOMM_API_TOKEN || "";

let requestCounter = 0;

function extractContentJson(result: any): unknown {
  const text = result?.content?.[0]?.text;
  if (typeof text !== "string") return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Chama uma tool MCP do Deskcomm e devolve o `structuredContent` já tipado. */
export async function callDeskcommTool<T = Record<string, unknown>>(
  toolName: string,
  args: Record<string, unknown> = {},
): Promise<McpToolResult<T>> {
  if (!MCP_URL || !API_TOKEN) {
    return { ok: false, error: "Variaveis DESKCOMM_MCP_URL/DESKCOMM_API_TOKEN ausentes" };
  }

  requestCounter += 1;
  const id = requestCounter;

  try {
    const response = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id,
        method: "tools/call",
        params: { name: toolName, arguments: args },
      }),
    });

    const rawText = await response.text();
    // Transporte Streamable HTTP responde em formato SSE (`event: message\ndata: {...}`)
    // mesmo para uma chamada única — extraímos a última linha `data:`.
    const jsonLine = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .filter(Boolean)
      .at(-1);

    const payload = jsonLine ? JSON.parse(jsonLine) : rawText ? JSON.parse(rawText) : null;

    if (!response.ok || !payload) {
      return { ok: false, error: `Deskcomm MCP retornou HTTP ${response.status}` };
    }
    if (payload.error) {
      return { ok: false, error: payload.error?.message || "Erro MCP desconhecido" };
    }

    const content = (payload.result?.structuredContent ?? extractContentJson(payload.result)) as
      | (T & { motivo?: string; mensagem?: string })
      | null;

    if (payload.result?.isError) {
      return { ok: false, error: content?.mensagem || "A ferramenta do Deskcomm recusou a chamada" };
    }
    if (!content) {
      return { ok: false, error: "Resposta vazia do Deskcomm MCP" };
    }

    return { ok: true, data: content as T };
  } catch (error: any) {
    return { ok: false, error: error?.message || "Falha ao chamar o Deskcomm MCP" };
  }
}

export type DeskcommFreeSlot = { inicio: string; fim: string; quando: string };

export type DeskcommFreeSlotsResult = {
  horarios: DeskcommFreeSlot[];
  total_de_horarios: number;
  ha_mais: boolean;
  fuso_da_regra: string;
  publicou_horarios: boolean;
  fuso_suposto: boolean;
  motivo?: string;
  mensagem?: string;
};

export function findFreeSlots(params: { eventTypeSlug: string; diasAFrente?: number; limite?: number }) {
  return callDeskcommTool<DeskcommFreeSlotsResult>("crm_find_free_slots", {
    event_type_slug: params.eventTypeSlug,
    ...(params.diasAFrente ? { dias_a_frente: params.diasAFrente } : {}),
    ...(params.limite ? { limite: params.limite } : {}),
  });
}

export type DeskcommContact = { id: string; name: string | null; phone: string | null; email: string | null };

export function searchContactByPhone(phone: string) {
  return callDeskcommTool<{ contacts: DeskcommContact[] }>("crm_search_contacts", {
    query: phone,
    limit: 5,
  });
}

export type DeskcommBookResult = {
  marcado: boolean;
  compromisso?: unknown;
  motivo?: string;
  mensagem?: string;
};

export function bookAppointment(params: {
  eventTypeSlug: string;
  startsAt: string;
  contactId: string;
  title?: string;
  notes?: string;
}) {
  return callDeskcommTool<DeskcommBookResult>("crm_book_appointment", {
    event_type_slug: params.eventTypeSlug,
    starts_at: params.startsAt,
    contact_id: params.contactId,
    ...(params.title ? { title: params.title } : {}),
    ...(params.notes ? { notes: params.notes } : {}),
  });
}
