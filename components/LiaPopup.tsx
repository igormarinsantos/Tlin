"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { LeadQualificationPopup } from "@/components/LeadQualificationPopup";
import { useLanguage } from "@/lib/LanguageContext";
import { trackFunnelEvent } from "@/lib/utm";

// O atalho flutuante continua pessoal, mas leva para o mesmo fluxo da demo.
export function LiaPopup() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [canShow, setCanShow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCanShow(latest > 400);
  });

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      trackFunnelEvent("igor_flow_opened", { cta_source: "nav_or_page" });
    };

    window.addEventListener("open-lia-chat", handleOpen);
    return () => window.removeEventListener("open-lia-chat", handleOpen);
  }, []);

  const openFlow = () => {
    setIsOpen(true);
    trackFunnelEvent("igor_flow_opened", { cta_source: "floating_igor" });
  };

  return (
    <>
      <LeadQualificationPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        planName="TLIN"
        darkTheme
        fullScreenMobile
        forceProgressHeader
      />

      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-[200] flex flex-col items-center">
        <AnimatePresence>
          {(canShow || isOpen) && (
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="group relative"
            >
              <div className="pointer-events-none absolute -inset-1 rounded-full bg-[#B597FF] opacity-50 blur-md transition-opacity duration-300 group-hover:opacity-80" />
              <button
                type="button"
                onClick={openFlow}
                className="relative flex h-12 items-center gap-2 rounded-full bg-[#0c0d0d] px-5 text-[13px] font-bold text-white transition-transform active:scale-95"
              >
                <span aria-hidden="true">✨</span>
                <span>{t.liaPopup.talkToLia}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
