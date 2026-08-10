import { NextRequest, NextResponse } from "next/server";
import { getIgorCampaign } from "@/lib/igor-campaigns";
import { saveGrowthLead } from "@/lib/growth-leads";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const campaign = getIgorCampaign(String(body.campaignSlug || ""));
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();

    if (!campaign || !name || !/^\S+@\S+\.\S+$/.test(email) || whatsapp.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Confira nome, e-mail e WhatsApp para continuar." }, { status: 400 });
    }

    const result = await saveGrowthLead({
      name,
      email,
      whatsapp,
      campaignSlug: campaign.slug,
      campaignKeyword: campaign.keyword,
      consentMarketing: Boolean(body.consentMarketing),
      consentVersion: campaign.consentVersion,
      utm: typeof body.utm === "object" && body.utm ? body.utm : {},
    });

    if (!result.saved) return NextResponse.json({ error: result.error }, { status: 503 });
    return NextResponse.json({ ok: true, id: result.id });
  } catch {
    return NextResponse.json({ error: "Não foi possível processar o cadastro." }, { status: 500 });
  }
}
