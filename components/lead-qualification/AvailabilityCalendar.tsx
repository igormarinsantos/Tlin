"use client";

import { useState } from "react";
import {
  eachMonthOfInterval,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  format as formatDate,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { type DemoDay, DATE_LOCALE_BY_LANG } from "./constants";

// Calendario de verdade (grade de mes) em vez de uma lista de dias em botoes --
// dias com vaga ficam clicaveis, os demais aparecem so como referencia visual.
export function AvailabilityCalendar({
  days,
  onSelectDay,
  lang,
  isLight,
}: {
  days: DemoDay[];
  onSelectDay: (day: DemoDay) => void;
  lang: string;
  isLight: boolean;
}) {
  const locale = DATE_LOCALE_BY_LANG[lang] || ptBR;
  const [monthIdx, setMonthIdx] = useState(0);

  const byDate = new Map(days.map((d) => [d.date, d]));
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0] ? new Date(`${sorted[0].date}T00:00:00`) : new Date();
  const last = sorted[sorted.length - 1] ? new Date(`${sorted[sorted.length - 1].date}T00:00:00`) : first;

  const months = eachMonthOfInterval({ start: startOfMonth(first), end: startOfMonth(last) });
  const activeMonth = months[Math.min(monthIdx, months.length - 1)] || first;

  const gridStart = startOfWeek(startOfMonth(activeMonth), { weekStartsOn: 0 });
  const gridEnd = endOfWeek(endOfMonth(activeMonth), { weekStartsOn: 0 });
  const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weekdayLabels = eachDayOfInterval({ start: gridStart, end: addDays(gridStart, 6) }).map((d) =>
    formatDate(d, "EEEEE", { locale }),
  );

  return (
    <div className="w-full">
      {months.length > 1 && (
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <button
            type="button"
            onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
            disabled={monthIdx === 0}
            className={`p-1.5 rounded-lg disabled:opacity-20 transition-colors ${isLight ? "hover:bg-zinc-100 text-zinc-600" : "hover:bg-white/10 text-zinc-400"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <span className={`text-sm font-bold capitalize ${isLight ? "text-zinc-950" : "text-white"}`}>
            {formatDate(activeMonth, "MMMM yyyy", { locale })}
          </span>
          <button
            type="button"
            onClick={() => setMonthIdx((i) => Math.min(months.length - 1, i + 1))}
            disabled={monthIdx === months.length - 1}
            className={`p-1.5 rounded-lg disabled:opacity-20 transition-colors ${isLight ? "hover:bg-zinc-100 text-zinc-600" : "hover:bg-white/10 text-zinc-400"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdayLabels.map((w, i) => (
          <div key={i} className={`text-center text-[10px] sm:text-xs font-bold uppercase ${isLight ? "text-zinc-400" : "text-zinc-600"}`}>
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {gridDays.map((day) => {
          const key = formatDate(day, "yyyy-MM-dd");
          if (!isSameMonth(day, activeMonth)) return <div key={key} />;

          const available = byDate.get(key);
          if (available) {
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectDay(available)}
                className="h-8 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold border border-[#B597FF]/40 bg-gradient-to-br from-[#B597FF]/15 to-[#38E3FF]/15 text-zinc-950 hover:bg-none hover:bg-[#38E3FF]/20 hover:border-[#38E3FF] transition-all active:scale-95"
              >
                {formatDate(day, "d")}
              </button>
            );
          }
          return (
            <div
              key={key}
              className={`h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm ${isLight ? "text-zinc-300" : "text-zinc-700"}`}
            >
              {formatDate(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
