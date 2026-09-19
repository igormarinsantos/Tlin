export const HOME_HERO_CTA_EXPERIMENT = "home_hero_cta_v1";

export type HomeHeroCtaVariant = "control" | "demo_clarity";

export type ExperimentAttribution = {
  experiment_id: typeof HOME_HERO_CTA_EXPERIMENT;
  experiment_variant: HomeHeroCtaVariant;
};

type StoredExperiment = ExperimentAttribution & { assigned_at: number };

const STORAGE_KEY = "tlin_experiment_home_hero_cta_v1";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function isStoredExperiment(value: unknown): value is StoredExperiment {
  if (!value || typeof value !== "object") return false;
  const experiment = value as Partial<StoredExperiment>;
  return experiment.experiment_id === HOME_HERO_CTA_EXPERIMENT
    && (experiment.experiment_variant === "control" || experiment.experiment_variant === "demo_clarity")
    && typeof experiment.assigned_at === "number"
    && experiment.assigned_at <= Date.now()
    && Date.now() - experiment.assigned_at <= MAX_AGE_MS;
}

function readStoredExperiment(): StoredExperiment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored: unknown = JSON.parse(raw);
    return isStoredExperiment(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Assigns one stable variant per browser without using identity or contact data. */
export function getOrAssignHomeHeroCtaExperiment(): ExperimentAttribution {
  const stored = readStoredExperiment();
  if (stored) return {
    experiment_id: stored.experiment_id,
    experiment_variant: stored.experiment_variant,
  };

  const experiment: StoredExperiment = {
    experiment_id: HOME_HERO_CTA_EXPERIMENT,
    experiment_variant: Math.random() < 0.5 ? "control" : "demo_clarity",
    assigned_at: Date.now(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(experiment));
  } catch {
    // Storage is optional. The current page still has a valid attribution.
  }
  return {
    experiment_id: experiment.experiment_id,
    experiment_variant: experiment.experiment_variant,
  };
}

/** Returns the active experiment only after it has been assigned on the client. */
export function getExperimentAttribution(): Partial<ExperimentAttribution> {
  const stored = readStoredExperiment();
  return stored ? {
    experiment_id: stored.experiment_id,
    experiment_variant: stored.experiment_variant,
  } : {};
}
