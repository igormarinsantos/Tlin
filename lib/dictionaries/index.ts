import { ptBR } from "./pt";
import { enUS } from "./en";
import { esES } from "./es";
import type { TranslationDictionary } from "./pt";

export type { TranslationDictionary } from "./pt";

export const getDictionary = (lang: string): TranslationDictionary => {
  switch (lang) {
    case 'EN': return enUS;
    case 'ES': return esES;
    case 'PT':
    default: return ptBR;
  }
};
