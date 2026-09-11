import { ptBR, enUS, es } from "date-fns/locale";
import type { Locale } from "date-fns";

export type Message = {
  role: 'bot' | 'user';
  text: string;
};

export const SUCCESS_STEP = 10;
export const WHATSAPP_NUMBER = "5511916248604";

// Common Country Codes
export const COUNTRIES = [
  { code: '+55', flag: 'br', name: 'Brasil' },
  { code: '+1', flag: 'us', name: 'EUA' },
  { code: '+351', flag: 'pt', name: 'Portugal' },
  { code: '+34', flag: 'es', name: 'Espanha' },
  { code: '+44', flag: 'gb', name: 'Reino Unido' },
  { code: '+54', flag: 'ar', name: 'Argentina' },
  { code: '+56', flag: 'cl', name: 'Chile' },
  { code: '+57', flag: 'co', name: 'Colômbia' },
  { code: '+52', flag: 'mx', name: 'México' },
];

export const LANGUAGE_CODES = ["PT", "EN", "ES"] as const;
export const FALLBACK_FORM_DATA = {
  name: '',
  phone: '',
  countryCode: '+55',
  volume: '',
  team: '',
  email: ''
};

export const COUNTRY_CODE_BY_TIMEZONE: Record<string, string> = {
  "America/Argentina/Buenos_Aires": "+54",
  "America/Argentina/Catamarca": "+54",
  "America/Argentina/Cordoba": "+54",
  "America/Argentina/Jujuy": "+54",
  "America/Argentina/La_Rioja": "+54",
  "America/Argentina/Mendoza": "+54",
  "America/Argentina/Rio_Gallegos": "+54",
  "America/Argentina/Salta": "+54",
  "America/Argentina/San_Juan": "+54",
  "America/Argentina/San_Luis": "+54",
  "America/Argentina/Tucuman": "+54",
  "America/Argentina/Ushuaia": "+54",
  "America/Bogota": "+57",
  "America/Chicago": "+1",
  "America/Denver": "+1",
  "America/Los_Angeles": "+1",
  "America/Mazatlan": "+52",
  "America/Mexico_City": "+52",
  "America/New_York": "+1",
  "America/Santiago": "+56",
  "America/Sao_Paulo": "+55",
  "America/Recife": "+55",
  "America/Fortaleza": "+55",
  "America/Manaus": "+55",
  "America/Belem": "+55",
  "America/Campo_Grande": "+55",
  "America/Cuiaba": "+55",
  "America/Porto_Velho": "+55",
  "America/Rio_Branco": "+55",
  "Atlantic/Azores": "+351",
  "Atlantic/Madeira": "+351",
  "Europe/Lisbon": "+351",
  "Europe/London": "+44",
  "Europe/Madrid": "+34",
};

export function getInitialCountryCode(language: string): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneCountryCode = COUNTRY_CODE_BY_TIMEZONE[timezone];
    if (timezoneCountryCode) return timezoneCountryCode;
  } catch {
    // Falls back to the selected site language when the browser does not expose a timezone.
  }

  if (language === "EN") return "+1";
  if (language === "ES") return "+34";
  return "+55";
}

export type DemoDay = { date: string; label: string; slots: DemoSlot[] };
export type DemoSlot = { startsAt: string; endsAt: string; when: string };

export const DATE_LOCALE_BY_LANG: Record<string, Locale> = { PT: ptBR, EN: enUS, ES: es };
