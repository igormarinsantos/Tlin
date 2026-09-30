export const ANALYTICS_EVENTS = [
  "page_view",
  "utm_capture",
  "click_pricing_cta",
  "lead_form_opened",
  "start_lead_form",
  "lead_step_completed",
  "generate_lead",
  "demo_booked",
  "demo_thank_you_opened",
  "demo_thank_you_viewed",
  "lead_form_abandoned",
  "click_whatsapp",
  "nav_solutions_menu_open",
  "nav_solution_click",
  "nav_link_click",
  "nav_ai_click",
  "select_plan",
  "article_cta_click",
  "share",
  "login_gateway_continue",
  "lia_chat_opened",
  "lia_chat_started",
  "lia_message_sent",
  "lia_chat_reset",
  "lia_followup_scheduled",
  "lia_followup_typing",
  "lia_followup_shown",
  "lia_followup_opened",
  "lia_followup_dismissed",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

/** Browser-side optimization signal. CRM evaluation remains the commercial truth. */
export const PRIMARY_ANALYTICS_CONVERSIONS = ["demo_booked"] as const satisfies readonly AnalyticsEventName[];

export const SECONDARY_ANALYTICS_CONVERSIONS = [
  "generate_lead",
  "start_lead_form",
  "click_whatsapp",
] as const satisfies readonly AnalyticsEventName[];
