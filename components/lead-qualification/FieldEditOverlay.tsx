"use client";

import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES } from "./constants";

type LeadFormData = {
  name: string;
  phone: string;
  countryCode: string;
  volume: string;
  team: string;
  email: string;
};

type LeadQualifyDictionary = {
  editTitles?: Record<string, string>;
  cancel?: string;
  placeholders?: { name?: string; phone?: string; email?: string };
  saveChange?: string;
  volumeOptions?: string[];
  teamOptions?: string[];
};

// Modal de edicao direta de um campo, aberto a partir do resumo (step 9).
export function FieldEditOverlay({
  editingField,
  formData,
  isLight,
  t,
  onChangeFormData,
  onClose,
  keepInputVisible,
  formatPhone,
}: {
  editingField: keyof LeadFormData | null;
  formData: LeadFormData;
  isLight: boolean;
  t?: LeadQualifyDictionary;
  onChangeFormData: (data: LeadFormData) => void;
  onClose: () => void;
  keepInputVisible: () => void;
  formatPhone: (value: string) => string;
}) {
  return (
    <AnimatePresence>
      {editingField && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 z-[200] flex flex-col items-center justify-center p-4 sm:p-6 backdrop-blur-md text-center ${isLight ? "bg-white/95" : "bg-[#0c0d0d]/95"}`}
        >
          <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            className={`max-w-md w-full border p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-4 text-left ${isLight ? "bg-white border-zinc-200" : "bg-zinc-900 border-white/10"}`}
          >
            <div className={`flex justify-between items-center border-b pb-3 ${isLight ? "border-zinc-200" : "border-white/10"}`}>
              <span className="text-xs font-black text-[#B597FF] uppercase tracking-wider">
                {t?.editTitles?.[editingField] || editingField}
              </span>
              <button onClick={onClose} className={`text-zinc-500 text-xs font-bold transition-colors ${isLight ? "hover:text-zinc-950" : "hover:text-white"}`}>
                {t?.cancel || "Cancelar"}
              </button>
            </div>

            {editingField === 'name' && (
              <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="flex flex-col gap-4">
                <input
                  autoFocus
                  type="text"
                  onFocus={keepInputVisible}
                  value={formData.name}
                  onChange={e => onChangeFormData({...formData, name: e.target.value})}
                  placeholder={t?.placeholders?.name || "Empresa..."}
                  className={`border rounded-xl px-4 py-3 font-bold outline-none focus:border-[#B597FF] transition-all ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-950" : "bg-black/50 border-white/10 text-white"}`}
                />
                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-bold transition-opacity hover:opacity-90">
                  {t?.saveChange || "Salvar"}
                </button>
              </form>
            )}

            {editingField === 'phone' && (
              <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={e => onChangeFormData({...formData, countryCode: e.target.value})}
                    className={`border rounded-xl px-3 py-3 font-bold outline-none ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-950" : "bg-black/50 border-white/10 text-white"}`}
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code} className="bg-zinc-900 text-white">{c.code} ({c.name})</option>
                    ))}
                  </select>
                  <input
                    autoFocus
                    type="text"
                    onFocus={keepInputVisible}
                    value={formData.phone}
                    onChange={e => onChangeFormData({...formData, phone: formatPhone(e.target.value)})}
                    placeholder={t?.placeholders?.phone || "WhatsApp..."}
                    className={`flex-1 border rounded-xl px-4 py-3 font-bold outline-none focus:border-[#B597FF] transition-all w-full ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-950" : "bg-black/50 border-white/10 text-white"}`}
                  />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-bold transition-opacity hover:opacity-90">
                  {t?.saveChange || "Salvar"}
                </button>
              </form>
            )}

            {editingField === 'volume' && (
              <div className="flex flex-col gap-2">
                {(t?.volumeOptions || []).map(opt => (
                  <button
                    key={opt}
                    onClick={() => { onChangeFormData({...formData, volume: opt}); onClose(); }}
                    className={`p-3 rounded-xl border text-left font-bold transition-all ${formData.volume === opt ? 'border-[#B597FF] bg-[#B597FF]/10 text-zinc-950' : isLight ? 'border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50' : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {editingField === 'team' && (
              <div className="flex flex-col gap-2">
                {(t?.teamOptions || []).map(opt => (
                  <button
                    key={opt}
                    onClick={() => { onChangeFormData({...formData, team: opt}); onClose(); }}
                    className={`p-3 rounded-xl border text-left font-bold transition-all ${formData.team === opt ? 'border-[#B597FF] bg-[#B597FF]/10 text-zinc-950' : isLight ? 'border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50' : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {editingField === 'email' && (
              <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="flex flex-col gap-4">
                <input
                  autoFocus
                  type="email"
                  onFocus={keepInputVisible}
                  value={formData.email}
                  onChange={e => onChangeFormData({...formData, email: e.target.value})}
                  placeholder={t?.placeholders?.email || "E-mail..."}
                  className={`border rounded-xl px-4 py-3 font-bold outline-none focus:border-[#B597FF] transition-all ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-950" : "bg-black/50 border-white/10 text-white"}`}
                />
                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] text-zinc-950 font-bold transition-opacity hover:opacity-90">
                  {t?.saveChange || "Salvar"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
