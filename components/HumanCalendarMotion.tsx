"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const APPOINTMENTS = [
  {
    time: "09:00",
    name: "Carla F.",
    image: "/lotties/avatars/6_avatar.webp",
    qualifications: [
      { label: "Fit alto", className: "bg-[#F0EBFF] text-[#7254c8]" },
      { label: "Urgente", className: "bg-[#E8FAFC] text-[#15808d]" },
    ],
  },
  {
    time: "11:30",
    name: "Rafael M.",
    image: "/lotties/avatars/7_avatar.webp",
    qualifications: [
      { label: "Decisor", className: "bg-[#FFF3E6] text-[#b86816]" },
      { label: "Qualificado", className: "bg-[#F0EBFF] text-[#7254c8]" },
    ],
  },
  {
    time: "15:00",
    name: "Marina L.",
    image: "/lotties/avatars/8_avatar.webp",
    qualifications: [
      { label: "Fit alto", className: "bg-[#F0EBFF] text-[#7254c8]" },
      { label: "Pronto", className: "bg-[#E8FAFC] text-[#15808d]" },
    ],
  },
] as const;

export function HumanCalendarMotion({ isActive }: { isActive: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % (APPOINTMENTS.length + 2));
    }, 950);

    return () => window.clearInterval(timer);
  }, [isActive]);

  const visibleCount = Math.min(step, APPOINTMENTS.length);

  return (
    <div className="absolute inset-0 bg-white px-4 py-3.5">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
        <div>
          <p className="text-[10px] font-bold text-[#0c0d0d]">Agenda comercial</p>
          <p className="mt-0.5 text-[8px] text-zinc-400">Hoje · reuniões qualificadas</p>
        </div>
        <span className="rounded-full bg-[#0c0d0d] px-2 py-1 text-[8px] font-bold text-white">Hoje</span>
      </div>

      <div className="mt-2.5 grid gap-1.5">
        {APPOINTMENTS.map((appointment, index) => {
          const isVisible = index < visibleCount;

          return (
            <div key={appointment.time} className="grid h-8 grid-cols-[32px_minmax(0,1fr)] items-center gap-1.5">
              <span className="self-center text-right text-[8px] font-medium leading-none text-zinc-400">{appointment.time}</span>
              <div className="relative h-8 rounded-lg border border-dashed border-zinc-100 bg-[#F7F7FB]/60">
                <AnimatePresence initial={false}>
                  {isVisible && (
                    <motion.div
                      initial={{ opacity: 0, x: 16, scale: 0.92 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -8, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className="absolute inset-0 flex min-w-0 items-center gap-1.5 rounded-lg border border-[#B597FF]/20 bg-white px-1.5"
                    >
                      <div className="relative h-[18px] w-[18px] shrink-0 overflow-hidden rounded-full">
                        <Image src={appointment.image} alt="" fill sizes="18px" className="object-cover" />
                      </div>
                      <span className="min-w-0 truncate text-[8px] font-bold text-[#0c0d0d]">{appointment.name}</span>
                      <span className="ml-auto flex shrink-0 items-center gap-1">
                        {appointment.qualifications.map((qualification) => (
                          <span key={qualification.label} className={`rounded-full px-1.5 py-0.5 text-[7px] font-bold leading-none ${qualification.className}`}>
                            {qualification.label}
                          </span>
                        ))}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
