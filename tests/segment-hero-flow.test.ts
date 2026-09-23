import { describe, expect, it } from "vitest";
import { HERO_MOTION_BY_VARIANT, isSegmentHeroVariant } from "@/components/campaignMotion";
import {
  enSegmentHeroFlows,
  esSegmentHeroFlows,
  ptSegmentHeroFlows,
  type SegmentHeroFlowKey,
} from "@/lib/dictionaries/segmentHeroFlows";

const segments: SegmentHeroFlowKey[] = ["clinicas", "escolas", "assessorias", "advocacia"];
const languages = [ptSegmentHeroFlows, enSegmentHeroFlows, esSegmentHeroFlows];

describe("segment hero CRM flows", () => {
  it("routes only the four segment pages through the shared flow", () => {
    for (const segment of segments) {
      expect(isSegmentHeroVariant(segment)).toBe(true);
      expect(HERO_MOTION_BY_VARIANT[segment]).toBe("segmentFlow");
    }

    expect(isSegmentHeroVariant("iaWhatsapp")).toBe(false);
    expect(HERO_MOTION_BY_VARIANT.iaWhatsapp).toBe("whatsapp");
    expect(HERO_MOTION_BY_VARIANT.recuperacaoDeLeads).toBe("followup");
  });

  it("keeps every localized story complete and structurally consistent", () => {
    for (const dictionary of languages) {
      for (const segment of segments) {
        const flow = dictionary[segment];

        expect(flow.messages).toHaveLength(4);
        expect(flow.messages.map((message) => message.from)).toEqual(["contact", "ai", "contact", "ai"]);
        expect(flow.fields).toHaveLength(4);
        expect(flow.stages).toHaveLength(3);
        expect(flow.activities).toHaveLength(4);
        expect(flow.contact.avatar).toMatch(/^\/lotties\/avatars\/\d+_avatar\.webp$/);
        expect(flow.contact.name.length).toBeGreaterThan(5);
        expect(flow.summary.length).toBeGreaterThan(40);
        expect(Object.values(flow.outcome).every(Boolean)).toBe(true);
      }
    }
  });

  it("keeps one stable person for each segment journey", () => {
    expect(new Set(segments.map((segment) => ptSegmentHeroFlows[segment].contact.avatar)).size).toBe(segments.length);
    expect(new Set(segments.map((segment) => ptSegmentHeroFlows[segment].contact.name)).size).toBe(segments.length);
  });

  it("uses a segment-specific lead state in the conversation header", () => {
    expect(segments.map((segment) => ptSegmentHeroFlows[segment].conversationLabel)).toEqual([
      "Novo paciente",
      "Novo aluno",
      "Novo lead",
      "Novo contato",
    ]);
  });

  it("keeps the legal flow as intake and routing rather than legal advice", () => {
    const legal = ptSegmentHeroFlows.advocacia;
    const visibleCopy = JSON.stringify(legal).toLowerCase();

    expect(legal.stages[2]).toBe("Equipe responsável");
    expect(legal.outcome.supportingText).toContain("advogado responsável");
    expect(visibleCopy).not.toContain("parecer jurídico");
    expect(visibleCopy).not.toContain("caso qualificado");
  });
});
