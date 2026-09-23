import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const db = new PGlite();
async function rpc(name: string, params: unknown[]) {
  const result = await db.query<{ value: Record<string, unknown> }>(`select public.${name}(${params.map((_, i) => `$${i + 1}`).join(",")}) as value`, params);
  return result.rows[0].value;
}
beforeAll(async () => {
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
  for (const file of ["20260602210412_create_lead_form_submissions.sql", "20260915_deskcomm_backup_projection.sql", "20260917_funnel_reliability.sql"]) {
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
  }
  await db.exec("insert into funnel_stage_mapping(stage_id,label,qualified,attended,won) values ('qualified','Qualified',true,false,false),('rejected','Rejected',false,false,false),('attended','Attended',null,true,false),('won','Won',null,false,true)");
}, 30_000);
afterAll(() => db.close());

describe("durable funnel in PostgreSQL", () => {
  it("claims once, holds uncertainty and replays the confirmed result", async () => {
    const first = "11111111-1111-4111-8111-111111111111", second = "22222222-2222-4222-8222-222222222222";
    expect(await rpc("claim_funnel_operation", ["booking:one", first])).toMatchObject({ state: "claimed" });
    expect(await rpc("claim_funnel_operation", ["booking:one", second])).toMatchObject({ state: "pending" });
    await rpc("finish_funnel_operation", ["booking:one", first, { booked: true }, false]);
    expect(await rpc("claim_funnel_operation", ["booking:one", second])).toMatchObject({ state: "done", result: { booked: true } });
    await expect(rpc("finish_funnel_operation", ["booking:one", second, {}, false])).rejects.toThrow();
  });

  it("deduplicates a capture and never treats score as human qualification", async () => {
    const lead = { lead_capture_id: "capture-one", contact_key: "contact-one", captured_at: "2026-09-17T10:00:00Z", lead_score: 100, lead_quality: "high", utm: { first_utm_source: "google", last_utm_source: "google" } };
    await rpc("record_funnel_lead", [lead]);
    await rpc("record_funnel_lead", [{ ...lead, utm: { first_utm_source: "meta", last_utm_source: "meta" }, booked_at: "2026-09-17T11:00:00Z", booking_key: "booking-one" }]);
    const rows = await db.query("select * from lead_form_submissions where lead_capture_id='capture-one'");
    expect(rows.rows).toHaveLength(1);
    expect(rows.rows[0]).toMatchObject({ qualified: null, utm: { first_utm_source: "google", last_utm_source: "meta" } });
  });

  it("preserves first editorial touch, updates last touch and rejects unsafe attribution", async () => {
    const original = {
      lead_capture_id: "capture-editorial",
      utm: {
        first_article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
        first_content_cluster: "cluster:ia-comercial",
        first_content_intent: "informational",
        last_article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
        last_content_cluster: "cluster:ia-comercial",
        last_content_intent: "informational",
        last_cta_id: "cta:demo",
        nested: { injected: true },
        turnstileToken: "secret",
      },
    };
    await rpc("record_funnel_lead", [original]);
    await rpc("record_funnel_lead", [{
      lead_capture_id: "capture-editorial",
      utm: {
        first_article_slug: "como-avaliar-novos-modelos-de-ia-para-negocios",
        first_content_cluster: "cluster:crm-nativo",
        first_content_intent: "commercial-investigation",
        last_article_slug: "playbook-qualificacao-leads-whatsapp",
        last_content_cluster: "cluster:qualificacao",
        last_content_intent: "informational",
        last_cta_id: "cta:demo",
      },
    }]);
    await rpc("record_funnel_lead", [{ lead_capture_id: "capture-historical" }]);

    const current = (await db.query("select utm from lead_form_submissions where lead_capture_id='capture-editorial'")).rows[0];
    expect(current).toMatchObject({
      utm: {
        first_article_slug: "agentes-de-ia-no-whatsapp-para-vendas",
        first_content_cluster: "cluster:ia-comercial",
        first_content_intent: "informational",
        last_article_slug: "playbook-qualificacao-leads-whatsapp",
        last_content_cluster: "cluster:qualificacao",
        last_content_intent: "informational",
        last_cta_id: "cta:demo",
      },
    });
    expect(JSON.stringify(current)).not.toMatch(/nested|injected|turnstile|secret/);
    expect((await db.query("select utm from lead_form_submissions where lead_capture_id='capture-historical'")).rows[0])
      .toEqual({ utm: {} });
  });

  it("reconciles early events, ignores duplicates and preserves event chronology", async () => {
    const event = { eventId: "event-q", leadId: "crm-two", status: "qualified", occurredAt: "2026-09-17T12:00:00Z", payload: { event: "lead.stage_changed" } };
    expect(await rpc("apply_funnel_crm_event", [event])).toMatchObject({ saved: true, projected: false });
    await rpc("record_funnel_lead", [{ lead_capture_id: "capture-two", deskcomm_lead_id: "crm-two", captured_at: "2026-09-17T10:00:00Z", booked_at: "2026-09-17T11:00:00Z", booking_key: "booking-two" }]);
    expect(await rpc("apply_funnel_crm_event", [event])).toMatchObject({ duplicate: true, projected: true });
    await rpc("apply_funnel_crm_event", [{ ...event, eventId: "old", status: "rejected", occurredAt: "2026-09-17T09:00:00Z" }]);
    await rpc("apply_funnel_crm_event", [{ ...event, eventId: "new", status: "attended", occurredAt: "2026-09-17T13:00:00Z" }]);
    const row = (await db.query("select * from lead_form_submissions where lead_capture_id='capture-two'")).rows[0];
    expect(row).toMatchObject({ qualified: true, crm_status: "attended" });
    await expect(rpc("apply_funnel_crm_event", [{ ...event, payload: { changed: true } }])).rejects.toThrow("Event identity conflict");
    const report = (await db.query("select sum(qualified_demos)::int as qualified, sum(attended_demos)::int as attended from funnel_report")).rows[0];
    expect(report).toMatchObject({ qualified: 1, attended: 1 });
    await rpc("apply_funnel_crm_event", [{ ...event, eventId: "revoke", status: "rejected", occurredAt: "2026-09-17T14:00:00Z" }]);
    expect((await db.query("select qualified from lead_form_submissions where lead_capture_id='capture-two'")).rows[0]).toMatchObject({ qualified: false });
  });

  it("blocks public reads and function execution", async () => {
    await db.exec("set role anon");
    try {
      await expect(db.query("select * from funnel_report")).rejects.toThrow();
      await expect(rpc("record_funnel_lead", [{ lead_capture_id: "attack" }])).rejects.toThrow();
    } finally { await db.exec("reset role"); }
  });

  it("counts a repeated booking once and treats an unmapped stage as unknown", async () => {
    await rpc("record_funnel_lead", [{ lead_capture_id: "capture-three", contact_key: "contact-one", captured_at: "2026-09-17T11:00:00Z", booked_at: "2026-09-17T12:00:00Z", booking_key: "booking-one" }]);
    await rpc("apply_funnel_crm_event", [{ eventId: "unmapped", leadCaptureId: "capture-three", status: "new-stage", occurredAt: "2026-09-17T13:00:00Z", payload: {} }]);
    expect((await db.query("select qualified from lead_form_submissions where lead_capture_id='capture-three'")).rows[0]).toMatchObject({ qualified: null });
    const report = await rpc("read_funnel_report", ["2020-01-01", "2100-01-01"]);
    const campaigns = report.campaigns as { demos: number }[];
    expect(campaigns.reduce((sum, row) => sum + row.demos, 0)).toBe(2);
  });
});
