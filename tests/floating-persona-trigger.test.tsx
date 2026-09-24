// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FloatingPersonaTrigger } from "../components/FloatingPersonaTrigger";

const config = {
  attendant: { name: "Igor", avatarUrl: "/team/igor-avatar.avif" },
  followUpMessage: "Vamos transformar seu WhatsApp em uma operação comercial que vende 24/7?",
  followUpHighlights: ["WhatsApp", "vende 24/7"],
  revealAfterViewports: 1,
  typingDurationMs: 700,
  bubbleAutoDismissMs: 11000,
};

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { configurable: true, value });
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  setScrollY(0);
});

describe("floating persona trigger", () => {
  it("is visible before the fold and never reveals from a fallback timer", () => {
    vi.useFakeTimers();
    render(
      <FloatingPersonaTrigger
        config={config}
        label="Fale com o Igor"
        closeLabel="Fechar"
        isOpen={false}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Fale com o Igor" })).toBeTruthy();
    expect(screen.queryByAltText("Foto de Igor")).toBeTruthy();
    expect(document.querySelector(".persona-trigger--revealed")).toBeNull();

    act(() => vi.advanceTimersByTime(30000));

    expect(document.querySelector(".persona-trigger--revealed")).toBeNull();
    expect(screen.queryByText(config.followUpMessage)).toBeNull();
  });

  it("reveals only after one full viewport and never reverts", () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    render(
      <FloatingPersonaTrigger
        config={config}
        label="Fale com o Igor"
        closeLabel="Fechar"
        isOpen={false}
        onToggle={vi.fn()}
      />,
    );

    setScrollY(800);
    fireEvent.scroll(window);
    expect(document.querySelector(".persona-trigger--revealed")).toBeNull();

    setScrollY(801);
    fireEvent.scroll(window);
    expect(document.querySelector(".persona-trigger--revealed")).toBeNull();
    expect(document.querySelector(".persona-trigger--preparing")).toBeTruthy();
    expect(document.querySelector(".persona-trigger-wrap")?.className).toContain("w-[152px]");
    act(() => vi.advanceTimersByTime(149));
    expect(document.querySelector(".persona-trigger-wrap")?.className).toContain("w-[152px]");
    act(() => vi.advanceTimersByTime(1));
    expect(document.querySelector(".persona-trigger-wrap")?.className).toContain("w-12");
    expect(document.querySelector(".persona-trigger--revealed")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Igor está digitando" })).toBeNull();
    act(() => vi.advanceTimersByTime(700));
    expect(document.querySelector(".persona-trigger__online-dot")).toBeNull();
    act(() => vi.advanceTimersByTime(49));
    expect(document.querySelector(".persona-trigger__online-dot")).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(document.querySelector(".persona-trigger-wrap > .persona-trigger__online-dot")).toBeTruthy();
    act(() => vi.advanceTimersByTime(199));
    expect(screen.queryByRole("button", { name: "Igor está digitando" })).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("button", { name: "Igor está digitando" })).toBeTruthy();

    act(() => vi.advanceTimersByTime(700));
    expect(screen.getByRole("status").textContent).toBe(config.followUpMessage);
    expect(document.querySelectorAll(".persona-follow-up__highlight")).toHaveLength(2);

    setScrollY(0);
    fireEvent.scroll(window);
    expect(document.querySelector(".persona-trigger--revealed")).toBeTruthy();

    act(() => vi.advanceTimersByTime(11000));
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.querySelectorAll(".persona-follow-up__highlight")).toHaveLength(0);
    expect(document.querySelector(".persona-trigger--revealed")).toBeTruthy();
  });

  it("does not restart the typing sequence on later scroll events", () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    render(
      <FloatingPersonaTrigger
        config={config}
        label="Fale com o Igor"
        closeLabel="Fechar"
        isOpen={false}
        onToggle={vi.fn()}
      />,
    );

    setScrollY(900);
    fireEvent.scroll(window);
    act(() => vi.advanceTimersByTime(1800));
    expect(screen.getByRole("status").textContent).toBe(config.followUpMessage);

    setScrollY(1200);
    fireEvent.scroll(window);
    expect(screen.queryByRole("button", { name: "Igor está digitando" })).toBeNull();
    expect(screen.getByRole("status").textContent).toBe(config.followUpMessage);
  });

  it("opens the existing chat from either visual state", () => {
    vi.useFakeTimers();
    const onToggle = vi.fn();
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    render(
      <FloatingPersonaTrigger
        config={config}
        label="Fale com o Igor"
        closeLabel="Fechar"
        isOpen={false}
        onToggle={onToggle}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Fale com o Igor" }));
    setScrollY(900);
    fireEvent.scroll(window);
    act(() => vi.advanceTimersByTime(1200));
    fireEvent.click(screen.getByRole("button", { name: "Conversar com Igor" }));

    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it("shows pending replies only after the closing flip and caps the badge", () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    const { rerender } = render(
      <FloatingPersonaTrigger
        config={config}
        label="Fale com o Igor"
        closeLabel="Fechar"
        isOpen={false}
        pendingReplyCount={0}
        onToggle={vi.fn()}
      />,
    );

    setScrollY(900);
    fireEvent.scroll(window);
    act(() => vi.advanceTimersByTime(900));
    expect(document.querySelector(".persona-trigger__online-dot")).toBeTruthy();

    rerender(
      <FloatingPersonaTrigger
        config={config}
        label="Fale com o Igor"
        closeLabel="Fechar"
        isOpen={true}
        pendingReplyCount={7}
        onToggle={vi.fn()}
      />,
    );

    expect(document.querySelector(".persona-trigger__online-dot")).toBeNull();
    expect(document.querySelector(".persona-trigger__unread-badge")).toBeNull();
    act(() => vi.advanceTimersByTime(0));

    rerender(
      <FloatingPersonaTrigger
        config={config}
        label="Fale com o Igor"
        closeLabel="Fechar"
        isOpen={false}
        pendingReplyCount={7}
        onToggle={vi.fn()}
      />,
    );

    act(() => vi.advanceTimersByTime(749));
    expect(document.querySelector(".persona-trigger__unread-badge")).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("status", { name: "3 mensagens aguardando resposta" }).textContent).toBe("3");
  });

  it("renders an externally scheduled follow-up with typing and opens it on click", () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    const onExternalFollowUpOpen = vi.fn();
    const { rerender } = render(
      <FloatingPersonaTrigger
        config={config}
        label="Fale com o Igor"
        closeLabel="Fechar"
        isOpen={false}
        onToggle={vi.fn()}
      />,
    );

    setScrollY(900);
    fireEvent.scroll(window);
    act(() => vi.advanceTimersByTime(900));
    rerender(
      <FloatingPersonaTrigger
        config={config}
        label="Fale com o Igor"
        closeLabel="Fechar"
        isOpen={false}
        externalFollowUp={{
          id: "form-idle-1",
          message: "Vamos continuar?",
          highlights: ["Vamos continuar?"],
        }}
        onExternalFollowUpOpen={onExternalFollowUpOpen}
        onToggle={vi.fn()}
      />,
    );

    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByRole("button", { name: "Igor está digitando" })).toBeTruthy();
    act(() => vi.advanceTimersByTime(700));
    expect(screen.getByRole("status").textContent).toBe("Vamos continuar?");
    expect(document.querySelectorAll(".persona-follow-up__highlight")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Fechar mensagem" }));
    expect(onExternalFollowUpOpen).toHaveBeenCalledTimes(1);
  });
});
