import type { EngagementFollowUp } from "@/components/lia-popup/useEngagementFollowUp";

export type LiaChatMessage = {
  role: "user" | "bot";
  text: string;
  type: "text" | "handoff";
};

export function appendEngagementFollowUp(
  messages: LiaChatMessage[],
  message: string,
  source: EngagementFollowUp["source"],
  welcomeMessages: LiaChatMessage[],
) {
  const history = source === "page_complete" && messages.length === 0
    ? welcomeMessages
    : messages;

  return [...history, { role: "bot" as const, text: message, type: "text" as const }];
}
