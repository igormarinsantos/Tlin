// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { getExperimentAttribution, getOrAssignHomeHeroCtaExperiment, HOME_HERO_CTA_EXPERIMENT } from "../lib/conversion-experiments";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("conversion experiments", () => {
  it("assigns a stable browser variant without any contact data", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.8);
    const first = getOrAssignHomeHeroCtaExperiment();
    expect(first).toEqual({ experiment_id: HOME_HERO_CTA_EXPERIMENT, experiment_variant: "demo_clarity" });
    expect(getOrAssignHomeHeroCtaExperiment()).toEqual(first);
    expect(getExperimentAttribution()).toEqual(first);
  });

  it("discards expired assignments before creating a replacement", () => {
    localStorage.setItem("tlin_experiment_home_hero_cta_v1", JSON.stringify({
      experiment_id: HOME_HERO_CTA_EXPERIMENT,
      experiment_variant: "control",
      assigned_at: Date.now() - 31 * 24 * 60 * 60 * 1000,
    }));
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    expect(getOrAssignHomeHeroCtaExperiment()).toMatchObject({ experiment_variant: "control" });
  });
});
