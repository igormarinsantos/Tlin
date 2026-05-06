"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { translations, Lang, TranslationSet } from "./translations";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationSet;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'PT',
  setLang: () => {},
  t: translations.PT,
});

/** Maps our Lang codes to Google Translate language codes */
const GT_CODES: Record<Lang, string> = { PT: 'pt', EN: 'en', ES: 'es' };

/**
 * Programmatically triggers Google Translate to switch the page language.
 * - For PT (original): clears the googtrans cookie and reloads.
 * - For EN/ES: finds the hidden GT combo and dispatches a change event.
 */
function triggerGoogleTranslate(lang: Lang) {
  if (typeof document === 'undefined') return;

  const code = GT_CODES[lang];

  // ── Reset to original Portuguese ─────────────────────────────────────────
  if (code === 'pt') {
    // Remove cookies that Google Translate uses to persist the language
    const clearCookie = (extra = '') => {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/${extra}`;
    };
    clearCookie();
    clearCookie(`; domain=${window.location.hostname}`);
    clearCookie(`; domain=.${window.location.hostname}`);
    window.location.reload();
    return;
  }

  // ── Switch to EN or ES ────────────────────────────────────────────────────
  // The GT combo select is rendered after the widget initialises.
  // Retry up to 15× (every 300ms = 4.5s max) to wait for it.
  const trySelect = (attempts = 0) => {
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (attempts < 15) {
      setTimeout(() => trySelect(attempts + 1), 300);
    }
  };
  trySelect();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('PT');

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    triggerGoogleTranslate(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
