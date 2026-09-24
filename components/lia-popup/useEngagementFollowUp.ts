"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trackFunnelEvent } from "@/lib/utm";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

export type EngagementFollowUp = {
  id: string;
  message: string;
  highlights: string[];
  source: "form_idle" | "page_complete";
};

type FollowUpCopy = {
  formIdleMessage: string;
  formIdleHighlights: string[];
  pageCompleteMessage: string;
  pageCompleteHighlights: string[];
  notificationTitle: string;
};

type UseEngagementFollowUpOptions = {
  pathname: string;
  isOpen: boolean;
  isBusy: boolean;
  inputValue: string;
  formActive: boolean;
  qualificationStep: number;
  messages: ChatMessage[];
  copy: FollowUpCopy;
  onTypingChange: (typing: boolean) => void;
  onDeliverMessage: (message: string, source: EngagementFollowUp["source"]) => void;
};

type SessionState = {
  count: number;
  lastShownAt: number | null;
  formKeys: string[];
  completedPaths: string[];
};

const STORAGE_KEY = "tlin_lia_engagement_v3";
const MAX_SESSION_FOLLOW_UPS = 2;
const FOLLOW_UP_COOLDOWN_MS = 60000;
const OPEN_FORM_IDLE_MS = 18000;
const CLOSED_FORM_IDLE_MS = 25000;
const PAGE_COMPLETE_DWELL_MS = 2000;
const TYPING_DURATION_MS = 700;

const EMPTY_SESSION_STATE: SessionState = {
  count: 0,
  lastShownAt: null,
  formKeys: [],
  completedPaths: [],
};

function readSessionState(): SessionState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_SESSION_STATE };
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    return {
      count: Number.isFinite(parsed.count) ? Math.max(parsed.count ?? 0, 0) : 0,
      lastShownAt: typeof parsed.lastShownAt === "number" ? parsed.lastShownAt : null,
      formKeys: Array.isArray(parsed.formKeys) ? parsed.formKeys.filter((key): key is string => typeof key === "string") : [],
      completedPaths: Array.isArray(parsed.completedPaths)
        ? parsed.completedPaths.filter((path): path is string => typeof path === "string")
        : [],
    };
  } catch {
    return { ...EMPTY_SESSION_STATE };
  }
}

function writeSessionState(state: SessionState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // O follow-up continua funcional mesmo quando o storage está indisponível.
  }
}

export function getPendingReplyCount(messages: ChatMessage[]) {
  const lastUserMessageIndex = messages.reduce(
    (lastIndex, message, index) => message.role === "user" ? index : lastIndex,
    -1,
  );

  return Math.min(
    messages.slice(lastUserMessageIndex + 1).filter((message) => message.role === "bot").length,
    3,
  );
}

export function useEngagementFollowUp({
  pathname,
  isOpen,
  isBusy,
  inputValue,
  formActive,
  qualificationStep,
  messages,
  copy,
  onTypingChange,
  onDeliverMessage,
}: UseEngagementFollowUpOptions) {
  const [externalFollowUp, setExternalFollowUp] = useState<EngagementFollowUp | null>(null);
  const latestRef = useRef({ isOpen, isBusy, inputValue, formActive, qualificationStep, messages });
  const originalTitleRef = useRef("");
  const titleChangedRef = useRef(false);
  const audioUnlockedRef = useRef(false);
  const deliveryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageDwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequenceRef = useRef(0);
  const activeDeliveryRef = useRef<EngagementFollowUp | null>(null);

  useEffect(() => {
    latestRef.current = { isOpen, isBusy, inputValue, formActive, qualificationStep, messages };
  }, [formActive, inputValue, isBusy, isOpen, messages, qualificationStep]);

  const restoreTitle = useCallback(() => {
    if (!titleChangedRef.current) return;
    document.title = originalTitleRef.current;
    titleChangedRef.current = false;
  }, []);

  const notifyClosedChat = useCallback((followUp: EngagementFollowUp) => {
    if (audioUnlockedRef.current) {
      const audio = new Audio("/sounds/igor-notification.wav");
      audio.volume = 0.42;
      void audio.play().catch(() => undefined);
    }

    document.title = copy.notificationTitle;
    titleChangedRef.current = true;
    trackFunnelEvent("lia_followup_shown", {
      trigger: followUp.source,
      chat_state: "closed",
      pathname,
      qualification_step: latestRef.current.qualificationStep,
      pending_reply_count: getPendingReplyCount(latestRef.current.messages),
    });
  }, [copy.notificationTitle, pathname]);

  const triggerFollowUp = useCallback((
    source: EngagementFollowUp["source"],
    message: string,
    highlights: string[],
    stateKey: string,
  ) => {
    const latest = latestRef.current;
    if (latest.isBusy || latest.inputValue.trim()) return false;

    const now = Date.now();
    const session = readSessionState();
    if (session.count >= MAX_SESSION_FOLLOW_UPS) return false;
    if (session.lastShownAt !== null && now - session.lastShownAt < FOLLOW_UP_COOLDOWN_MS) return false;
    if (source === "form_idle" && session.formKeys.includes(stateKey)) return false;
    if (source === "page_complete" && session.completedPaths.includes(stateKey)) return false;

    const nextSession: SessionState = {
      ...session,
      count: session.count + 1,
      lastShownAt: now,
      formKeys: source === "form_idle" ? [...session.formKeys, stateKey] : session.formKeys,
      completedPaths: source === "page_complete"
        ? [...session.completedPaths, stateKey]
        : session.completedPaths,
    };
    writeSessionState(nextSession);

    const followUp: EngagementFollowUp = {
      id: `${source}-${now}-${sequenceRef.current++}`,
      message,
      highlights,
      source,
    };
    activeDeliveryRef.current = followUp;

    trackFunnelEvent("lia_followup_scheduled", {
      trigger: source,
      chat_state: latest.isOpen ? "open" : "closed",
      pathname,
      qualification_step: latest.qualificationStep,
      pending_reply_count: getPendingReplyCount(latest.messages),
    });

    trackFunnelEvent("lia_followup_typing", {
      trigger: source,
      chat_state: latest.isOpen ? "open" : "closed",
      pathname,
      qualification_step: latest.qualificationStep,
      pending_reply_count: getPendingReplyCount(latest.messages),
    });

    if (latest.isOpen) {
      onTypingChange(true);
    } else {
      setExternalFollowUp(followUp);
    }

    if (deliveryTimerRef.current) clearTimeout(deliveryTimerRef.current);
    deliveryTimerRef.current = setTimeout(() => {
      onTypingChange(false);
      onDeliverMessage(message, source);
      activeDeliveryRef.current = null;

      if (!latestRef.current.isOpen) notifyClosedChat(followUp);
      else {
        trackFunnelEvent("lia_followup_shown", {
          trigger: source,
          chat_state: "open",
          pathname,
          qualification_step: latestRef.current.qualificationStep,
          pending_reply_count: getPendingReplyCount(latestRef.current.messages),
        });
      }
    }, TYPING_DURATION_MS);

    return true;
  }, [notifyClosedChat, onDeliverMessage, onTypingChange, pathname]);

  useEffect(() => {
    if (!activeDeliveryRef.current || !deliveryTimerRef.current) return;
    const userResumed = Boolean(inputValue.trim()) || messages.at(-1)?.role === "user";
    if (!userResumed) return;

    clearTimeout(deliveryTimerRef.current);
    deliveryTimerRef.current = null;
    const cancelled = activeDeliveryRef.current;
    activeDeliveryRef.current = null;
    onTypingChange(false);
    trackFunnelEvent("lia_followup_dismissed", {
      trigger: cancelled.source,
      dismiss_reason: "user_resumed",
      pathname,
      qualification_step: qualificationStep,
    });
  }, [inputValue, messages, onTypingChange, pathname, qualificationStep]);

  useEffect(() => {
    originalTitleRef.current = document.title;
    titleChangedRef.current = false;

    return () => {
      restoreTitle();
    };
  }, [pathname, restoreTitle]);

  useEffect(() => {
    const unlockAudio = () => {
      audioUnlockedRef.current = true;
    };
    window.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") restoreTitle();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [restoreTitle]);

  useEffect(() => {
    if (isOpen) restoreTitle();
  }, [isOpen, restoreTitle]);

  useEffect(() => {
    if (formTimerRef.current) clearTimeout(formTimerRef.current);
    if (!formActive || isBusy || inputValue.trim() || getPendingReplyCount(messages) === 0) return;

    const lastUserMessageIndex = messages.reduce(
      (lastIndex, message, index) => message.role === "user" ? index : lastIndex,
      -1,
    );
    const stateKey = `${qualificationStep}:${lastUserMessageIndex}`;
    const session = readSessionState();
    if (session.formKeys.includes(stateKey)) return;

    formTimerRef.current = setTimeout(() => {
      triggerFollowUp(
        "form_idle",
        copy.formIdleMessage,
        copy.formIdleHighlights,
        stateKey,
      );
    }, isOpen ? OPEN_FORM_IDLE_MS : CLOSED_FORM_IDLE_MS);

    return () => {
      if (formTimerRef.current) clearTimeout(formTimerRef.current);
    };
  }, [copy.formIdleHighlights, copy.formIdleMessage, formActive, inputValue, isBusy, isOpen, messages, qualificationStep, triggerFollowUp]);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;

    let footerVisible = false;

    const attemptPageFollowUp = () => {
      if (!footerVisible) return;

      const triggered = triggerFollowUp(
        "page_complete",
        copy.pageCompleteMessage,
        copy.pageCompleteHighlights,
        pathname,
      );
      if (triggered) return;

      const session = readSessionState();
      if (
        session.count >= MAX_SESSION_FOLLOW_UPS
        || session.completedPaths.includes(pathname)
      ) return;

      const cooldownRemaining = session.lastShownAt === null
        ? 0
        : Math.max(FOLLOW_UP_COOLDOWN_MS - (Date.now() - session.lastShownAt), 0);
      pageDwellTimerRef.current = setTimeout(
        attemptPageFollowUp,
        Math.max(cooldownRemaining + 50, 3000),
      );
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (pageDwellTimerRef.current) clearTimeout(pageDwellTimerRef.current);
      footerVisible = Boolean(entry?.isIntersecting);
      if (!footerVisible) return;

      pageDwellTimerRef.current = setTimeout(attemptPageFollowUp, PAGE_COMPLETE_DWELL_MS);
    }, { threshold: 0.15 });

    observer.observe(footer);
    return () => {
      observer.disconnect();
      if (pageDwellTimerRef.current) clearTimeout(pageDwellTimerRef.current);
    };
  }, [copy.pageCompleteHighlights, copy.pageCompleteMessage, pathname, triggerFollowUp]);

  useEffect(() => () => {
    if (deliveryTimerRef.current) clearTimeout(deliveryTimerRef.current);
    if (formTimerRef.current) clearTimeout(formTimerRef.current);
    if (pageDwellTimerRef.current) clearTimeout(pageDwellTimerRef.current);
  }, []);

  return {
    externalFollowUp,
    clearExternalFollowUp: () => setExternalFollowUp(null),
  };
}
