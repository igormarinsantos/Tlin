"use client";

import { Banner } from "./ui/banner";

export function TopBanner() {
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
      className="border-b border-zinc-100"
    >
      <div 
        onClick={handleOpenChat}
        className="flex items-center gap-2 cursor-pointer group px-4 h-full"
      >
        <span className="text-[11px] md:text-xs font-bold tracking-tight text-[#0c0d0d] underline underline-offset-4 decoration-[#B597FF]/30">
          Tem alguma dúvida sobre a Tlin? <span className="text-[#B597FF]">Pergunte para a Lia</span>
        </span>
      </div>
    </Banner>
  );
}
