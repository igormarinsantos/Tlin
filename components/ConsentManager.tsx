"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import {
  CONSENT_STORAGE_KEY,
  OPEN_CONSENT_EVENT,
  createConsentPreferences,
  parseConsentPreferences,
  updateConsentMode,
} from "@/lib/consent";

export function ConsentManager() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const isClient = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [isForcedOpen, setIsForcedOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const savedPreferences = isClient
    ? parseConsentPreferences(localStorage.getItem(CONSENT_STORAGE_KEY))
    : null;
  const isOpen = isForcedOpen || (isClient && !savedPreferences && !isDismissed);

  useEffect(() => {
    const openPreferences = () => {
      const current = parseConsentPreferences(localStorage.getItem(CONSENT_STORAGE_KEY));
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setIsCustomizing(true);
      setIsForcedOpen(true);
    };

    window.addEventListener(OPEN_CONSENT_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openPreferences);
  }, []);

  if (pathname.startsWith("/internal/")) return null;

  const save = (allowAnalytics: boolean, allowMarketing: boolean) => {
    const preferences = createConsentPreferences(allowAnalytics, allowMarketing);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
    updateConsentMode(preferences);
    setAnalytics(allowAnalytics);
    setMarketing(allowMarketing);
    setIsDismissed(true);
    setIsForcedOpen(false);
    setIsCustomizing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.98 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[1000] overflow-hidden rounded-[24px] border border-white/10 bg-[#0c0d0d] text-white sm:left-5 sm:right-auto sm:bottom-5 sm:w-[min(620px,calc(100vw-40px))]"
        >
          <div className="h-px bg-gradient-to-r from-[#B597FF] to-[#38E3FF]" />
          <div className="p-5 sm:p-6">
            <div className="max-w-xl">
              <h2 id="consent-title" className="text-lg font-bold tracking-[-0.02em] sm:text-xl">
                {t.consentManager.title}
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">
                {t.consentManager.description}{" "}
                <Link href="/legal?tab=cookies" className="font-semibold text-[#64E5FA] hover:underline">
                  {t.consentManager.learnMore}
                </Link>
              </p>
            </div>

            <AnimatePresence initial={false}>
              {isCustomizing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-3">
                    <ConsentOption
                      label={t.consentManager.necessaryTitle}
                      description={t.consentManager.necessaryDescription}
                      checked
                      disabled
                    />
                    <ConsentOption
                      label={t.consentManager.analyticsTitle}
                      description={t.consentManager.analyticsDescription}
                      checked={analytics}
                      onChange={setAnalytics}
                    />
                    <ConsentOption
                      label={t.consentManager.marketingTitle}
                      description={t.consentManager.marketingDescription}
                      checked={marketing}
                      onChange={setMarketing}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => save(true, true)}
                className="min-h-11 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] px-5 text-sm font-bold text-[#0c0d0d] transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64E5FA]"
              >
                {t.consentManager.acceptAll}
              </button>
              {isCustomizing ? (
                <button
                  type="button"
                  onClick={() => save(analytics, marketing)}
                  className="min-h-11 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {t.consentManager.savePreferences}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCustomizing(true)}
                  className="min-h-11 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {t.consentManager.customize}
                </button>
              )}
              <button
                type="button"
                onClick={() => save(false, false)}
                className="min-h-11 px-3 text-sm font-bold text-zinc-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t.consentManager.necessaryOnly}
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function ConsentOption({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-24 cursor-pointer flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#64E5FA]">
      <span>
        <span className="block text-sm font-bold text-white">{label}</span>
        <span className="mt-1 block text-xs font-medium leading-relaxed text-zinc-500">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-3 h-4 w-4 accent-[#B597FF] focus-visible:outline-none"
      />
    </label>
  );
}
