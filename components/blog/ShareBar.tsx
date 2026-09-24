"use client";

import { useState } from "react";
import { captureEditorialTouch } from "@/lib/editorial/analytics";
import { safePageUrl } from "@/lib/analytics-events";
import { trackFunnelEvent } from "@/lib/utm";
import { CheckIcon, LinkIcon, LinkedInIcon, WhatsAppShareIcon, XSocialIcon } from "./icons";

export function ShareBar({
  url,
  title,
  compact = false,
}: {
  url: string;
  title: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = safePageUrl(url);

  const trackShare = (method: "whatsapp" | "linkedin" | "x" | "copy_link") => {
    const touch = captureEditorialTouch(shareUrl);
    if (!touch) return;
    trackFunnelEvent("share", {
      method,
      content_type: "article",
      item_id: touch.article_slug,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      trackShare("copy_link");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissao de clipboard nesse navegador -- sem fallback,
      // simplesmente nao mostra a confirmacao de copiado.
    }
  };

  const buttonClass =
    `group/social flex items-center justify-center rounded-full border bg-white outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#B597FF]/25 ${compact ? "h-9 w-9" : "h-10 w-10"}`;

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no WhatsApp"
        className={`${buttonClass} hover:bg-green-50`}
        style={{ color: "#25D366", borderColor: "rgb(37 211 102 / 0.25)" }}
        onClick={() => trackShare("whatsapp")}
      >
        <WhatsAppShareIcon className={`${compact ? "h-4 w-4" : "h-[18px] w-[18px]"} transition-transform duration-300 group-hover/social:scale-110`} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn"
        className={`${buttonClass} hover:bg-sky-50`}
        style={{ color: "#0A66C2", borderColor: "rgb(10 102 194 / 0.25)" }}
        onClick={() => trackShare("linkedin")}
      >
        <LinkedInIcon className={`${compact ? "h-[15px] w-[15px]" : "h-[17px] w-[17px]"} transition-transform duration-300 group-hover/social:scale-110`} />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no X"
        className={`${buttonClass} hover:bg-zinc-100`}
        style={{ color: "#000000", borderColor: "rgb(0 0 0 / 0.2)" }}
        onClick={() => trackShare("x")}
      >
        <XSocialIcon className="h-4 w-4 transition-transform duration-300 group-hover/social:scale-110" />
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar link"
        className={`${buttonClass} border-zinc-200 text-zinc-500 hover:border-[#B597FF]/40 hover:bg-[#F3EEFF] hover:text-[#8659e7]`}
      >
        {copied ? <CheckIcon className="w-4 h-4 text-[#38A9E3]" /> : <LinkIcon />}
      </button>
    </div>
  );
}
