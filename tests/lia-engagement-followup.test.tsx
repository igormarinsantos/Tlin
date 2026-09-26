// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPendingReplyCount,
  useEngagementFollowUp,
  type EngagementFollowUp,
} from "../components/lia-popup/useEngagementFollowUp";
import { appendEngagementFollowUp } from "../components/lia-popup/chatHistory";

vi.mock("@/lib/utm", () => ({ trackFunnelEvent: vi.fn() }));

const copy = {
  formIdleMessage: "Vamos continuar?",
  formIdleHighlights: ["Vamos continuar?"],
  pageCompleteMessage: "Chegou até aqui?",
  pageCompleteHighlights: ["Chegou até aqui?"],
  notificationTitle: "Igor te chamou | tlin.ai",
};

type HarnessProps = {
  isOpen?: boolean;
  isBusy?: boolean;
  inputValue?: string;
  formActive?: boolean;
  qualificationStep?: number;
  messages?: Array<{ role: "user" | "bot"; text: string }>;
  onTypingChange: (typing: boolean) => void;
  onDeliverMessage: (message: string, source: EngagementFollowUp["source"]) => void;
};

function Harness({
  isOpen = false,
  isBusy = false,
  inputValue = "",
  formActive = false,
  qualificationStep = 0,
  messages = [],
  onTypingChange,
  onDeliverMessage,
}: HarnessProps) {
  const { externalFollowUp } = useEngagementFollowUp({
    pathname: "/ia-para-clinicas",
    isOpen,
    isBusy,
    inputValue,
    formActive,
    qualificationStep,
    messages,
    copy,
    onTypingChange,
    onDeliverMessage,
  });

  return <output data-testid="external-follow-up">{externalFollowUp?.source ?? "none"}</output>;
}

let intersectionCallback: IntersectionObserverCallback | null = null;
const audioPlay = vi.fn(() => Promise.resolve());

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-24T12:00:00Z"));
  sessionStorage.clear();
  document.title = "Página original";
  intersectionCallback = null;
  audioPlay.mockClear();

  class MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      intersectionCallback = callback;
    }
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() { return []; }
    root = null;
    rootMargin = "0px";
    thresholds = [0.15];
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  vi.stubGlobal("Audio", class {
    volume = 1;
    play = audioPlay;
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("Lia engagement follow-up", () => {
  it("preserves the welcome conversation when the final-page follow-up starts the form", () => {
    const welcomeMessages = [
      { role: "bot" as const, text: "Olá, tudo bem?", type: "text" as const },
      { role: "bot" as const, text: "Vamos entender sua operação", type: "text" as const },
    ];

    expect(appendEngagementFollowUp([], copy.pageCompleteMessage, "page_complete", welcomeMessages)).toEqual([
      ...welcomeMessages,
      { role: "bot", text: copy.pageCompleteMessage, type: "text" },
    ]);

    const existingHistory = [
      { role: "bot" as const, text: "Qual é seu nome?", type: "text" as const },
      { role: "user" as const, text: "Ana", type: "text" as const },
    ];
    expect(appendEngagementFollowUp(existingHistory, copy.pageCompleteMessage, "page_complete", welcomeMessages)).toEqual([
      ...existingHistory,
      { role: "bot", text: copy.pageCompleteMessage, type: "text" },
    ]);
  });

  it("counts only bot messages sent after the latest user answer", () => {
    expect(getPendingReplyCount([
      { role: "bot", text: "Pergunta 1" },
      { role: "user", text: "Resposta" },
      { role: "bot", text: "Pergunta 2" },
      { role: "bot", text: "Lembrete" },
    ])).toBe(2);

    expect(getPendingReplyCount([
      { role: "bot", text: "1" },
      { role: "bot", text: "2" },
      { role: "bot", text: "3" },
      { role: "bot", text: "4" },
    ])).toBe(3);
  });

  it("sends one in-chat reminder after 18 seconds of unanswered inactivity", () => {
    const onTypingChange = vi.fn();
    const onDeliverMessage = vi.fn();
    render(
      <Harness
        isOpen
        formActive
        qualificationStep={1}
        messages={[{ role: "bot", text: "Qual é seu nome?" }]}
        onTypingChange={onTypingChange}
        onDeliverMessage={onDeliverMessage}
      />,
    );

    act(() => vi.advanceTimersByTime(17999));
    expect(onTypingChange).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onTypingChange).toHaveBeenCalledWith(true);
    expect(screen.getByTestId("external-follow-up").textContent).toBe("none");

    act(() => vi.advanceTimersByTime(700));
    expect(onDeliverMessage).toHaveBeenCalledWith(copy.formIdleMessage, "form_idle");
    expect(onTypingChange).toHaveBeenLastCalledWith(false);

    act(() => vi.advanceTimersByTime(60000));
    expect(onDeliverMessage).toHaveBeenCalledTimes(1);
  });

  it("shows a closed-chat typing signal, sound and tab title after 25 seconds", () => {
    const onTypingChange = vi.fn();
    const onDeliverMessage = vi.fn();
    const { rerender } = render(
      <Harness
        formActive
        qualificationStep={2}
        messages={[{ role: "bot", text: "Qual é seu WhatsApp?" }]}
        onTypingChange={onTypingChange}
        onDeliverMessage={onDeliverMessage}
      />,
    );
    fireEvent.pointerDown(window);

    act(() => vi.advanceTimersByTime(25000));
    expect(screen.getByTestId("external-follow-up").textContent).toBe("form_idle");
    expect(document.title).toBe("Página original");

    act(() => vi.advanceTimersByTime(700));
    expect(onDeliverMessage).toHaveBeenCalledWith(copy.formIdleMessage, "form_idle");
    expect(audioPlay).toHaveBeenCalledTimes(1);
    expect(document.title).toBe(copy.notificationTitle);

    rerender(
      <Harness
        isOpen
        formActive
        qualificationStep={2}
        messages={[{ role: "bot", text: "Qual é seu WhatsApp?" }]}
        onTypingChange={onTypingChange}
        onDeliverMessage={onDeliverMessage}
      />,
    );
    expect(document.title).toBe("Página original");
  });

  it("cancels a scheduled reminder when the user resumes typing", () => {
    const onTypingChange = vi.fn();
    const onDeliverMessage = vi.fn();
    const { rerender } = render(
      <Harness
        isOpen
        formActive
        qualificationStep={1}
        messages={[{ role: "bot", text: "Qual é seu nome?" }]}
        onTypingChange={onTypingChange}
        onDeliverMessage={onDeliverMessage}
      />,
    );

    act(() => vi.advanceTimersByTime(18000));
    expect(onTypingChange).toHaveBeenCalledWith(true);
    rerender(
      <Harness
        isOpen
        inputValue="Igor"
        formActive
        qualificationStep={1}
        messages={[{ role: "bot", text: "Qual é seu nome?" }]}
        onTypingChange={onTypingChange}
        onDeliverMessage={onDeliverMessage}
      />,
    );
    act(() => vi.advanceTimersByTime(700));

    expect(onTypingChange).toHaveBeenLastCalledWith(false);
    expect(onDeliverMessage).not.toHaveBeenCalled();
  });

  it("triggers the final-page remarketing once after the footer remains visible", () => {
    document.body.appendChild(document.createElement("footer"));
    const onTypingChange = vi.fn();
    const onDeliverMessage = vi.fn();
    render(
      <Harness
        onTypingChange={onTypingChange}
        onDeliverMessage={onDeliverMessage}
      />,
    );

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId("external-follow-up").textContent).toBe("page_complete");

    act(() => vi.advanceTimersByTime(700));
    expect(onDeliverMessage).toHaveBeenCalledWith(copy.pageCompleteMessage, "page_complete");

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
      vi.advanceTimersByTime(62000);
    });
    expect(onDeliverMessage).toHaveBeenCalledTimes(1);
  });

  it("does not discard the final-page remarketing when a form is already active", () => {
    document.body.appendChild(document.createElement("footer"));
    const onTypingChange = vi.fn();
    const onDeliverMessage = vi.fn();
    render(
      <Harness
        formActive
        qualificationStep={3}
        messages={[{ role: "bot", text: "Quantos leads você recebe?" }]}
        onTypingChange={onTypingChange}
        onDeliverMessage={onDeliverMessage}
      />,
    );

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByTestId("external-follow-up").textContent).toBe("page_complete");
    act(() => vi.advanceTimersByTime(700));
    expect(onDeliverMessage).toHaveBeenCalledWith(copy.pageCompleteMessage, "page_complete");
  });
});
