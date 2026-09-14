"use client";

import { useState } from "react";
import { CheckIcon, LinkIcon, LinkedInIcon, WhatsAppShareIcon, XSocialIcon } from "./icons";

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
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
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no WhatsApp"
        className={buttonClass}
      >
        <WhatsAppShareIcon />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn"
        className={buttonClass}
      >
        <LinkedInIcon />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no X"
        className={buttonClass}
      >
        <XSocialIcon />
      </a>
      <button type="button" onClick={handleCopy} aria-label="Copiar link" className={buttonClass}>
        {copied ? <CheckIcon className="w-4 h-4 text-[#38A9E3]" /> : <LinkIcon />}
      </button>
    </div>
  );
}
