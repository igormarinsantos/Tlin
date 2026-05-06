"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = 'PT' | 'EN' | 'ES';

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'PT',
  setLang: () => {},
});

const GT_CODES: Record<Lang, string> = { PT: 'pt', EN: 'en', ES: 'es' };

function triggerGoogleTranslate(lang: Lang) {
  if (typeof document === 'undefined') return;

  const code = GT_CODES[lang];

  // Reset to original Portuguese
  if (code === 'pt') {
    const clearCookie = (extra = '') => {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/${extra}`;
    };
    clearCookie();
    clearCookie(`; domain=${window.location.hostname}`);
    clearCookie(`; domain=.${window.location.hostname}`);
    window.location.reload();
    return;
  }

  // Switch to EN or ES — retry until the GT combo is ready
  const trySelect = (attempts = 0) => {
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (attempts < 20) {
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
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
