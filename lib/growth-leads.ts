type GrowthLeadInput = {
  name: string;
  email: string;
  whatsapp: string;
  campaignSlug: string;
  campaignKeyword: string;
  consentMarketing: boolean;
  consentVersion: string;
  utm: Record<string, unknown>;
};

export async function saveGrowthLead(input: GrowthLeadInput) {
  const supabaseUrl = (process.env.SUPABASE_URL || "https://nhclqbnygvkyjcxscrgt.supabase.co").replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!serviceRoleKey) {
    return { saved: false, error: "Integração de leads ainda não configurada." };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/growth_leads`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email.toLowerCase(),
      whatsapp: input.whatsapp,
      campaign_slug: input.campaignSlug,
      campaign_keyword: input.campaignKeyword,
      consent_marketing: input.consentMarketing,
      consent_channels: input.consentMarketing ? ["email", "whatsapp"] : [],
      consent_version: input.consentVersion,
      utm: input.utm,
    }),
  });

  if (!response.ok) {
    return { saved: false, error: "Não foi possível registrar o cadastro agora." };
  }

  const rows = await response.json();
  return { saved: true, error: null, id: rows?.[0]?.id as string | undefined };
}
