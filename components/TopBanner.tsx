"use client";

import { Banner } from "./ui/banner";
import { useLanguage } from "@/lib/LanguageContext";
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function TopBanner() {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  });

  const handleOpenChat = () => {
    window.dispatchEvent(new Event("open-lia-chat"));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[110]"
        >
          <Banner 
            id="lia-banner" 
            variant="rainbow" 
            height="2.5rem"
            rainbowColors={[
              "rgba(181,151,255,0.4)",
              "rgba(56,227,255,0.4)",
              "rgba(181,151,255,0.2)",
              "rgba(56,227,255,0.2)",
            ]}
            className=""
          >
            <div 
              onClick={handleOpenChat}
              className="flex items-center gap-2 cursor-pointer group px-4 h-full"
            >
              <span className="text-[11px] md:text-xs font-bold tracking-tight text-[#0c0d0d] underline underline-offset-4 decoration-[#B597FF]/30">
                {t.topBanner.question} <span className="text-[#B597FF]">{t.topBanner.ask}</span>
              </span>
            </div>
          </Banner>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
