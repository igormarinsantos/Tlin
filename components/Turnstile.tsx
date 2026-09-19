"use client";

import Script from "next/script";
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";

import { SingleUseToken } from "@/lib/single-use-token";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export type TurnstileHandle = { takeToken: () => Promise<string | null> };
type TurnstileProps = { ref?: Ref<TurnstileHandle> };

/**
 * Cloudflare Turnstile for the lead form. It stays visually silent unless
 * Cloudflare asks the visitor to complete a challenge.
 */
export function Turnstile({ ref }: TurnstileProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [tokens] = useState(() => new SingleUseToken(() => {}));
  useImperativeHandle(ref, () => ({ takeToken: () => siteKey ? tokens.take() : Promise.resolve(null) }), [siteKey, tokens]);

  useEffect(() => {
    if (!siteKey || !scriptLoaded || !containerRef.current || !window.turnstile || widgetIdRef.current) return;

    tokens.setRenew(() => {
      if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
    });

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "lead-qualification",
      appearance: "interaction-only",
      callback: (token: string) => tokens.receive(token),
      "expired-callback": () => tokens.receive(null),
      "error-callback": () => tokens.cancel(),
      "timeout-callback": () => tokens.cancel(),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
      tokens.cancel();
    };
  }, [tokens, scriptLoaded, siteKey]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptLoaded(true)}
        onError={() => tokens.cancel()}
      />
      <div ref={containerRef} aria-label="Proteção contra envios automatizados" />
    </>
  );
}
