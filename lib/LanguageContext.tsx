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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('PT');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
