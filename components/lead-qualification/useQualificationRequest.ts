"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bookingOutcome, contactFingerprint, QualificationRequest } from "@/lib/qualification-request";
import { trackFunnelEvent } from "@/lib/utm";
import type { TurnstileHandle } from "@/components/Turnstile";

function browserStorage() {
  try { return window.localStorage; } catch { return undefined; }
}

export function useQualificationRequest() {
  const [request] = useState(() => new QualificationRequest(browserStorage()));
  const turnstileRef = useRef<TurnstileHandle>(null);
  const captureRef = useRef<Promise<void> | null>(null);
  const captureAttemptRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const activeRef = useRef(true);
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(request.state.submission === "unknown");

  useEffect(() => {
    activeRef.current = true;
    return () => { activeRef.current = false; };
  }, []);

  const capture = useCallback((data: { name: string; phone: string; countryCode: string; utm: unknown }) => {
    const key = contactFingerprint(data);
    if (busyRef.current || request.state.submission !== "idle" || captureRef.current
      || request.state.capturedContact === key || captureAttemptRef.current === key) return;
    request.identifyPhone(data.countryCode.replace(/\D/g, "") + data.phone.replace(/\D/g, ""));
    captureAttemptRef.current = key;
    const id = request.state.id;
    captureRef.current = (async () => {
      try {
        if (!turnstileRef.current) return;
        const token = await turnstileRef.current.takeToken();
        if (!activeRef.current || request.state.id !== id) return;
        const response = await fetch("/api/leads/capture", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, leadCaptureId: id, turnstileToken: token }),
          signal: AbortSignal.timeout(15_000),
        });
        const result = await response.json();
        if (response.ok && result.success === true && activeRef.current && request.state.id === id) {
          request.captured(key);
          trackFunnelEvent("generate_lead", { event_id: id });
        }
      } catch {
        // Final submission retries capture with the same identity and the latest fields.
      } finally { captureRef.current = null; }
    })();
  }, [request]);

  const submit = async (payload: Record<string, unknown>) => {
    if (busyRef.current) return "busy" as const;
    if (request.state.submission === "unknown" || request.state.submission === "pending") return "unknown" as const;
    if (request.state.submission === "booked") return "already-booked" as const;
    busyRef.current = true;
    setBusy(true);
    let dispatched = false;
    try {
      await captureRef.current;
      if (typeof payload.phone === "string" && payload.phone) {
        request.identifyPhone(String(payload.countryCode || "+55").replace(/\D/g, "") + payload.phone.replace(/\D/g, ""));
      }
      if (!turnstileRef.current) return "retry" as const;
      const token = await turnstileRef.current.takeToken();
      request.mark("pending");
      dispatched = true;
      const response = await fetch("/api/notify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, leadCaptureId: request.state.id, turnstileToken: token }),
        signal: AbortSignal.timeout(60_000),
      });
      const result = await response.json().catch(() => null);
      const outcome = bookingOutcome(response.status, result);
      if (result?.crmCaptured === true && !request.state.capturedContact) {
        request.captured(contactFingerprint(payload as { name: string; phone: string; countryCode: string }));
        trackFunnelEvent("generate_lead", { event_id: request.state.id });
      }
      request.mark(outcome === "booked" ? "booked" : outcome === "unknown" ? "unknown" : "idle");
      setUncertain(outcome === "unknown");
      return outcome;
    } catch {
      request.mark(dispatched ? "unknown" : "idle");
      setUncertain(dispatched);
      return dispatched ? "unknown" as const : "retry" as const;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const reset = () => {
    if (busyRef.current || uncertain || request.state.submission === "pending") return false;
    request.reset();
    captureAttemptRef.current = null;
    return true;
  };

  return { request, turnstileRef, capture, submit, reset, busy, busyRef, uncertain };
}
