import { FALLBACK_FORM_DATA, type DemoDay, type DemoSlot, type Message } from "./constants";
import type { Lang } from "@/lib/LanguageContext";

export type QualificationProgress = {
  currentStep: number;
  lang: Lang;
  formData: typeof FALLBACK_FORM_DATA;
  selectedDay: DemoDay | null;
  selectedSlot: DemoSlot | null;
  chatHistory: Message[];
};

function isFutureSlot(value: unknown): value is DemoSlot {
  if (!value || typeof value !== "object") return false;
  const slot = value as DemoSlot;
  return typeof slot.when === "string" && typeof slot.startsAt === "string" && typeof slot.endsAt === "string"
    && Date.parse(slot.startsAt) > Date.now() && Date.parse(slot.endsAt) > Date.parse(slot.startsAt);
}

/** Old progress remains resumable; stale slots always return to a fresh calendar. */
export function parseQualificationProgress(value: unknown): QualificationProgress | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Partial<QualificationProgress>;
  if (!Number.isInteger(data.currentStep) || data.currentStep! <= 1 || data.currentStep! >= 10
    || !data.formData || !Object.keys(FALLBACK_FORM_DATA).every(key => typeof data.formData?.[key as keyof typeof FALLBACK_FORM_DATA] === "string")) return null;
  const savedDay = data.selectedDay;
  const slots = Array.isArray(savedDay?.slots) ? savedDay.slots.filter(isFutureSlot) : [];
  const day = savedDay && typeof savedDay.label === "string" && typeof savedDay.date === "string" && slots.length
    ? { ...savedDay, slots } : null;
  const slot = isFutureSlot(data.selectedSlot) && slots.some(item => item.startsAt === data.selectedSlot?.startsAt) ? data.selectedSlot : null;
  const step = (data.currentStep! >= 8 && !day) || (data.currentStep === 9 && !slot) ? 7 : data.currentStep!;
  return {
    currentStep: step, lang: ["PT", "EN", "ES"].includes(data.lang || "") ? data.lang! : "PT",
    formData: data.formData, selectedDay: step >= 8 ? day : null, selectedSlot: step >= 9 ? slot : null,
    chatHistory: [], // Rebuilt from localized questions, never trust persisted rendered text.
  };
}
