import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "gradient" | "quiet";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "pill" | "soft";

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3.5 text-sm md:px-8 md:text-[15px]",
  lg: "px-8 py-4 text-[15px] md:px-10",
};

/**
 * CTA oficial da Tlin. A variante primary preserva a borda em movimento usada
 * nos pontos de conversão; secondary é a alternativa clara para a mesma ação.
 */
export function TlinButton({
  children,
  className,
  variant = "primary",
  size = "md",
  shape = "pill",
  fullWidth = false,
  contentClassName,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
  contentClassName?: string;
}) {
  const radius = shape === "pill" ? "rounded-tlin-control" : "rounded-2xl";
  const clipping = shape === "pill"
    ? "[clip-path:inset(0_round_9999px)]"
    : "[clip-path:inset(0_round_1rem)]";
  const shared = cn(
    "relative inline-flex items-center justify-center overflow-hidden font-bold transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    radius,
    buttonSizes[size],
    fullWidth && "w-full",
    className,
  );

  if (variant === "primary") {
    return (
      <button type={type} className={cn("group/btn isolate relative inline-flex overflow-hidden p-px font-bold text-white transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50", radius, clipping, fullWidth && "w-full", className, "cursor-pointer")} {...props}>
        <span
          aria-hidden="true"
          className="absolute inset-[-150%] z-0 animate-[spin_3s_linear_infinite] will-change-transform"
          style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)" }}
        />
        <span className={cn("relative z-10 block w-full bg-tlin-ink text-center transition-colors duration-300 group-hover/btn:text-tlin-ink", radius, buttonSizes[size], contentClassName)}>
          <span className="relative z-10">{children}</span>
          <span aria-hidden="true" className={cn("absolute inset-0 bg-tlin-ink transition-opacity duration-500 group-hover/btn:opacity-0", radius)} />
          <span aria-hidden="true" className={cn("absolute inset-0 bg-gradient-to-r from-tlin-purple to-tlin-blue opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100", radius)} />
        </span>
      </button>
    );
  }

  const variants: Record<Exclude<ButtonVariant, "primary">, string> = {
    secondary: "border border-zinc-200 bg-white text-tlin-ink hover:bg-zinc-50",
    gradient: "bg-gradient-to-r from-tlin-purple to-tlin-blue text-tlin-ink hover:opacity-90",
    quiet: "text-tlin-ink hover:bg-zinc-100",
  };
  return <button type={type} className={cn(shared, variants[variant])} {...props}>{children}</button>;
}

export function TlinCard({ className, children, tone = "light", ...props }: HTMLAttributes<HTMLDivElement> & { tone?: "light" | "muted" | "dark" }) {
  const tones = {
    light: "border border-zinc-100 bg-white text-tlin-ink",
    muted: "border border-zinc-100 bg-tlin-surface-muted text-tlin-ink",
    dark: "border border-white/10 bg-tlin-ink text-white",
  };
  return <div className={cn("rounded-tlin-card", tones[tone], className)} {...props}>{children}</div>;
}

export function TlinEyebrow({ children, className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex rounded-tlin-control border border-tlin-purple/20 bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-tlin-purple", className)} {...props}>{children}</span>;
}

export function TlinGradientText({ children, className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("bg-gradient-to-r from-tlin-purple to-tlin-blue bg-clip-text text-transparent", className)} {...props}>{children}</span>;
}

export function TlinField({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("rounded-xl border border-zinc-200 bg-white px-3 py-2 text-tlin-ink outline-none transition-colors placeholder:text-zinc-400 focus:border-tlin-purple/60 focus:shadow-[var(--tlin-shadow-focus)]", className)} {...props} />;
}

export function TlinSpecimen({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return <section className={cn("rounded-tlin-panel border border-zinc-100 bg-white p-6", className)}><h2 className="text-sm font-bold text-tlin-ink">{title}</h2><div className="mt-5 flex flex-wrap items-center gap-3">{children}</div></section>;
}
