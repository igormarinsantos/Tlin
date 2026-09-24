import { Bot } from "lucide-react";

export function AiSummaryButton({
  articleUrl,
  articleTitle,
  variant = "soft",
  className = "",
}: {
  articleUrl: string;
  articleTitle: string;
  variant?: "soft" | "gradient";
  className?: string;
}) {
  const isGradient = variant === "gradient";

  return (
    <a
      href={createChatGptSummaryUrl(articleUrl)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Resumir “${articleTitle}” com IA`}
      className={`group/summary inline-flex items-center whitespace-nowrap py-2 font-bold outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#B597FF]/25 ${
        isGradient
          ? "justify-center rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] px-2 text-sm text-[#0c0d0d] hover:saturate-125"
          : "gap-2 rounded-full border border-[#B597FF]/25 bg-[#F3EEFF] px-3 text-sm text-[#5B3DB3] hover:border-[#B597FF]/50 hover:bg-[#EAE2FF] hover:text-[#3F267F]"
      } ${className}`}
    >
      {!isGradient && (
        <span
          aria-hidden="true"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[#8659e7] transition-transform duration-300 group-hover/summary:-rotate-6 group-hover/summary:scale-105"
        >
          <Bot className="h-3.5 w-3.5" strokeWidth={2.25} />
        </span>
      )}
      <span>Resumir com IA</span>
    </a>
  );
}

export function createChatGptSummaryUrl(articleUrl: string) {
  const prompt = `Resuma esse artigo pra mim, em português, com os pontos principais: ${articleUrl}`;
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}
