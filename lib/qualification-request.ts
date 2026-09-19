const REQUEST_KEY = "tlin_qualification_request_v1";
const CONFIRMATION_KEY = "tlin_demo_confirmation";
const MAX_AGE = 24 * 60 * 60_000;

type RequestState = {
  id: string;
  updatedAt: number;
  capturedContact: string | null;
  identityPhone?: string;
  submission: "idle" | "pending" | "unknown" | "booked";
};

export type DemoConfirmation = {
  version: 1;
  requestId: string;
  day: string;
  time: string;
  startsAt: string;
  expiresAt: number;
};

let memoryConfirmation: DemoConfirmation | null = null;
let confirmationStorageFailed = false;

export function saveDemoConfirmation(input: Omit<DemoConfirmation, "version" | "expiresAt">) {
  const confirmation: DemoConfirmation = { ...input, version: 1, expiresAt: Date.now() + MAX_AGE };
  memoryConfirmation = confirmation;
  confirmationStorageFailed = false;
  try { sessionStorage.setItem(CONFIRMATION_KEY, JSON.stringify(confirmation)); } catch { confirmationStorageFailed = true; }
}

export function readDemoConfirmation(): DemoConfirmation | null {
  let value: DemoConfirmation | null = confirmationStorageFailed ? memoryConfirmation : null;
  try {
    const raw = sessionStorage.getItem(CONFIRMATION_KEY);
    if (raw && !confirmationStorageFailed) value = JSON.parse(raw);
  } catch { value = memoryConfirmation; }
  if (!value || value.version !== 1 || typeof value.requestId !== "string" || !value.requestId
    || typeof value.day !== "string" || !value.day || typeof value.time !== "string" || !value.time
    || !Number.isFinite(Date.parse(value.startsAt)) || !(value.expiresAt > Date.now())) return null;
  return value;
}

/** Client retry guard; not a substitute for durable idempotency in the CRM. */
export class QualificationRequest {
  state: RequestState;
  constructor(private storage?: Pick<Storage, "getItem" | "setItem">) {
    let saved: RequestState | null = null;
    try { saved = JSON.parse(storage?.getItem(REQUEST_KEY) || "null"); } catch { /* Start fresh. */ }
    this.state = saved && typeof saved.id === "string" && saved.id.length > 0 && saved.updatedAt > Date.now() - MAX_AGE
      && ["idle", "pending", "unknown", "booked"].includes(saved.submission)
      ? { ...saved, submission: saved.submission === "pending" ? "unknown" : saved.submission }
      : this.fresh();
    this.persist();
  }

  private fresh(): RequestState {
    return { id: crypto.randomUUID(), updatedAt: Date.now(), capturedContact: null, submission: "idle" };
  }
  private persist() {
    this.state.updatedAt = Date.now();
    try { this.storage?.setItem(REQUEST_KEY, JSON.stringify(this.state)); } catch { /* In-memory state remains usable. */ }
  }
  reset() { this.state = this.fresh(); this.persist(); }
  identifyPhone(phone: string) {
    if (this.state.submission !== "idle") return;
    if (this.state.identityPhone && this.state.identityPhone !== phone) this.reset();
    this.state.identityPhone = phone;
    this.persist();
  }
  captured(contact: string) { this.state.capturedContact = contact; this.persist(); }
  mark(submission: RequestState["submission"]) { this.state.submission = submission; this.persist(); }
}

export function contactFingerprint(data: { name: string; phone: string; countryCode: string }) {
  return JSON.stringify([data.name.trim(), data.countryCode.replace(/\D/g, ""), data.phone.replace(/\D/g, "")]);
}

export type BookingResponse = { demoBooking?: { booked?: boolean; pendingConfirmation?: boolean; slotUnavailable?: boolean; attempted?: boolean }; success?: boolean };

export function bookingOutcome(status: number, result: BookingResponse): "booked" | "retry" | "slots" | "unknown" {
  if (result?.demoBooking?.booked === true) return "booked";
  if (result?.demoBooking?.pendingConfirmation) return "unknown";
  if (result?.demoBooking?.slotUnavailable) return "slots";
  if ([400, 403, 413, 429].includes(status) || result?.demoBooking?.booked === false) return "retry";
  return "unknown";
}
