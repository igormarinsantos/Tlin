"use client";

import { useState } from "react";
import { captureEditorialTouch } from "@/lib/editorial/analytics";
import { safePageUrl } from "@/lib/analytics-events";
import { trackFunnelEvent } from "@/lib/utm";
import { CheckIcon, LinkIcon, LinkedInIcon, WhatsAppShareIcon, XSocialIcon } from "./icons";

export function ShareBar({ url, title }: { url: string; title: string }) {
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
    "w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 transition-colors hover:border-[#B597FF]/40 hover:text-[#8659e7]";

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no WhatsApp"
        className={buttonClass}
        onClick={() => trackShare("whatsapp")}
      >
        <WhatsAppShareIcon />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn"
        className={buttonClass}
        onClick={() => trackShare("linkedin")}
      >
        <LinkedInIcon />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no X"
        className={buttonClass}
        onClick={() => trackShare("x")}
      >
        <XSocialIcon />
      </a>
      <button type="button" onClick={handleCopy} aria-label="Copiar link" className={buttonClass}>
        {copied ? <CheckIcon className="w-4 h-4 text-[#38A9E3]" /> : <LinkIcon />}
      </button>
    </div>
  );
}
