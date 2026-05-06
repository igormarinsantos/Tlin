"use client";

import { Banner } from "./ui/banner";
import { useLanguage } from "@/lib/LanguageContext";

export function TopBanner() {
  const { t } = useLanguage();
  const handleOpenChat = () => {
    window.dispatchEvent(new Event("open-lia-chat"));
  };

  return (
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
  );
}
