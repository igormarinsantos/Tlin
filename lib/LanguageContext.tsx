"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getDictionary, TranslationDictionary } from "./dictionaries";

export type Lang = 'PT' | 'EN' | 'ES';

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationDictionary;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'PT',
  setLang: () => {},
  t: getDictionary('PT'),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('PT');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem('site_lang') as Lang;
    if (savedLang && ['PT', 'EN', 'ES'].includes(savedLang)) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('site_lang', newLang);
  };

  const t = getDictionary(lang);

  return (
    <LanguageContext.Provider value={{ lang: isClient ? lang : 'PT', setLang, t: isClient ? t : getDictionary('PT') }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
