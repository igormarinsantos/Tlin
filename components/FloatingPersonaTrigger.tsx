"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type BubblePhase = "hidden" | "typing" | "message";

export type ExternalPersonaFollowUp = {
  id: string;
  message: string;
  highlights: string[];
};

export type FloatingPersonaTriggerConfig = {
  attendant: {
    name: string;
    avatarUrl: string;
  };
  followUpMessage: string;
  followUpHighlights?: string[];
  revealAfterViewports?: number;
  typingDurationMs?: number;
  bubbleAutoDismissMs?: number;
};

type FloatingPersonaTriggerProps = {
  config: FloatingPersonaTriggerConfig;
  label: string;
  closeLabel: string;
  isOpen: boolean;
  pendingReplyCount?: number;
  externalFollowUp?: ExternalPersonaFollowUp | null;
  onExternalFollowUpOpen?: () => void;
  onToggle: () => void;
};

function HighlightedFollowUp({
  message,
  highlights = [],
}: {
  message: string;
  highlights?: string[];
}) {
  const validHighlights = highlights.filter(Boolean);
  if (validHighlights.length === 0) return message;

  const escapedHighlights = validHighlights.map((highlight) =>
    highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const parts = message.split(new RegExp(`(${escapedHighlights.join("|")})`, "g"));

  return parts.map((part, index) =>
    validHighlights.includes(part) ? (
      <span
        key={`${part}-${index}`}
        className="persona-follow-up__highlight bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text font-extrabold text-transparent"
      >
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function FloatingPersonaTrigger({
  config,
  label,
  closeLabel,
  isOpen,
  pendingReplyCount = 0,
  externalFollowUp,
  onExternalFollowUpOpen,
  onToggle,
}: FloatingPersonaTriggerProps) {
  const [revealed, setRevealed] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [compacted, setCompacted] = useState(false);
  const [personaReady, setPersonaReady] = useState(false);
  const [closeFlipComplete, setCloseFlipComplete] = useState(!isOpen);
  const [bubblePhase, setBubblePhase] = useState<BubblePhase>("hidden");
  const [bubbleContent, setBubbleContent] = useState({
    message: config.followUpMessage,
    highlights: config.followUpHighlights ?? [],
    externalId: null as string | null,
  });
  const hasTriggeredRef = useRef(false);
  const prepareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const personaReadyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revealAfterViewports = Number.isFinite(config.revealAfterViewports)
    ? Math.max(config.revealAfterViewports ?? 1, 1)
    : 1;
  const typingDurationMs = config.typingDurationMs ?? 1400;
  const bubbleAutoDismissMs = config.bubbleAutoDismissMs ?? 11000;
  const visiblePendingReplyCount = Math.min(Math.max(pendingReplyCount, 0), 3);

  useEffect(() => {
    if (closeStatusTimerRef.current) clearTimeout(closeStatusTimerRef.current);

    if (isOpen) {
      closeStatusTimerRef.current = setTimeout(() => {
        setCloseFlipComplete(false);
      }, 0);
    } else {
      closeStatusTimerRef.current = setTimeout(() => {
        setCloseFlipComplete(true);
      }, 750);
    }

    return () => {
      if (closeStatusTimerRef.current) clearTimeout(closeStatusTimerRef.current);
    };
  }, [isOpen]);

  const clearBubbleTimers = () => {
    if (typingStartTimerRef.current) clearTimeout(typingStartTimerRef.current);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    typingStartTimerRef.current = null;
    typingTimerRef.current = null;
    dismissTimerRef.current = null;
  };

  const dismissBubble = () => {
    clearBubbleTimers();
    setBubblePhase("hidden");
  };

  useEffect(() => {
    if (!externalFollowUp || isOpen) return;

    clearBubbleTimers();
    typingStartTimerRef.current = setTimeout(() => {
      setBubbleContent({
        message: externalFollowUp.message,
        highlights: externalFollowUp.highlights,
        externalId: externalFollowUp.id,
      });
      setBubblePhase("typing");

      typingTimerRef.current = setTimeout(() => {
        setBubblePhase("message");
        dismissTimerRef.current = setTimeout(() => {
          setBubblePhase("hidden");
        }, bubbleAutoDismissMs);
      }, typingDurationMs);
    }, 0);

    return clearBubbleTimers;
  }, [bubbleAutoDismissMs, externalFollowUp, isOpen, typingDurationMs]);

  useEffect(() => {
    if (hasTriggeredRef.current) return;

    const startSequence = () => {
      if (hasTriggeredRef.current) return;

      hasTriggeredRef.current = true;
      window.removeEventListener("scroll", handleScroll);

      const flipDurationMs = 700;
      const prepareDurationMs = 150;
      const statusRevealDelayMs = 50;
      const postFlipPauseMs = 250;

      setPreparing(true);
      setBubbleContent({
        message: config.followUpMessage,
        highlights: config.followUpHighlights ?? [],
        externalId: null,
      });

      prepareTimerRef.current = setTimeout(
        () => {
          setCompacted(true);
          setRevealed(true);
        },
        prepareDurationMs,
      );

      personaReadyTimerRef.current = setTimeout(
        () => setPersonaReady(true),
        prepareDurationMs + flipDurationMs + statusRevealDelayMs,
      );

      typingStartTimerRef.current = setTimeout(() => {
        setBubblePhase("typing");
        typingTimerRef.current = setTimeout(() => {
          setBubblePhase("message");
          dismissTimerRef.current = setTimeout(() => {
            setBubblePhase("hidden");
          }, bubbleAutoDismissMs);
        }, typingDurationMs);
      }, prepareDurationMs + flipDurationMs + postFlipPauseMs);
    };

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * revealAfterViewports) {
        startSequence();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (prepareTimerRef.current) clearTimeout(prepareTimerRef.current);
      if (personaReadyTimerRef.current) clearTimeout(personaReadyTimerRef.current);
      clearBubbleTimers();
    };
  }, [bubbleAutoDismissMs, config.followUpHighlights, config.followUpMessage, revealAfterViewports, typingDurationMs]);

  return (
    <div className={`relative group ${isOpen ? "hidden sm:block" : ""}`}>
      <div
        className={`absolute -inset-1 rounded-full bg-[#B597FF] blur-md transition duration-1000 group-hover:duration-200 animate-pulse pointer-events-none ${isOpen ? "opacity-40" : "opacity-70 group-hover:opacity-100"}`}
      />
      <div
        className={`absolute -inset-2 rounded-full bg-gradient-to-r from-[#B597FF] to-[#38E3FF] blur-xl transition duration-1000 pointer-events-none ${isOpen ? "opacity-20" : "opacity-30 group-hover:opacity-60"}`}
      />

      {bubblePhase !== "hidden" && !isOpen && (
        <button
          type="button"
          onClick={() => {
            dismissBubble();
            if (bubbleContent.externalId) onExternalFollowUpOpen?.();
          }}
          className="persona-follow-up absolute bottom-0 right-[calc(100%+12px)] z-20 max-w-[min(18rem,calc(100vw-6rem))] rounded-[1.25rem] rounded-br-md border border-white/10 bg-[#0c0d0d] px-4 py-3 text-left shadow-[0_16px_45px_rgba(12,13,13,0.28)]"
          aria-label={bubblePhase === "typing" ? `${config.attendant.name} está digitando` : "Fechar mensagem"}
        >
          {bubblePhase === "typing" ? (
            <span className="flex h-5 min-w-10 items-center justify-center gap-1" role="status" aria-live="polite">
              <span className="persona-typing-dot" />
              <span className="persona-typing-dot [animation-delay:160ms]" />
              <span className="persona-typing-dot [animation-delay:320ms]" />
            </span>
          ) : (
            <span className="block min-w-[14rem] text-[14px] font-bold leading-snug tracking-[-0.01em] text-zinc-100" role="status" aria-live="polite">
              <HighlightedFollowUp
                message={bubbleContent.message}
                highlights={bubbleContent.highlights}
              />
            </span>
          )}
        </button>
      )}

      <span
        className={`persona-trigger-wrap relative z-10 inline-flex h-12 transition-[width] duration-[220ms] ${compacted && !isOpen ? "w-12" : isOpen ? "w-[120px]" : "w-[152px]"}`}
      >
        <button
          type="button"
          onClick={() => {
            dismissBubble();
            onToggle();
          }}
          className={`persona-trigger relative h-12 w-full cursor-pointer overflow-hidden rounded-full border-0 bg-zinc-950 p-0 text-white outline-none active:scale-95 focus-visible:ring-2 focus-visible:ring-[#B597FF] focus-visible:ring-offset-2 ${preparing && !isOpen ? "persona-trigger--preparing" : ""} ${compacted && !isOpen ? "persona-trigger--circle" : ""} ${revealed && !isOpen ? "persona-trigger--revealed" : ""} ${personaReady && !isOpen ? "persona-trigger--compacted" : ""}`}
          aria-label={isOpen ? closeLabel : revealed ? `Conversar com ${config.attendant.name}` : label}
        >
          {isOpen ? (
            <span className="grid h-full place-items-center px-6 text-[13px] font-bold tracking-wide">
              {closeLabel}
            </span>
          ) : (
            <span className="persona-trigger__flip">
              <span className="persona-trigger__face persona-trigger__face--front">
                <span className="persona-trigger__spark inline-flex h-5 w-5 items-center justify-center text-lg leading-none" aria-hidden="true">✨</span>
                <span className="persona-trigger__label text-[13px] font-bold leading-none tracking-wide whitespace-nowrap">{label}</span>
              </span>
              <span className="persona-trigger__face persona-trigger__face--back">
                <span className="persona-trigger__avatar">
                  <Image
                    src={config.attendant.avatarUrl}
                    alt={`Foto de ${config.attendant.name}`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
              </span>
            </span>
          )}
        </button>

        {personaReady && closeFlipComplete && !isOpen && (visiblePendingReplyCount > 0 ? (
          <span
            className="persona-trigger__unread-badge"
            role="status"
            aria-label={`${visiblePendingReplyCount} ${visiblePendingReplyCount === 1 ? "mensagem aguardando resposta" : "mensagens aguardando resposta"}`}
          >
            {visiblePendingReplyCount}
          </span>
        ) : (
          <span className="persona-trigger__online-dot" aria-label="Igor está online" />
        ))}
      </span>
    </div>
  );
}
