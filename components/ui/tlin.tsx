import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "gradient" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

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
  fullWidth = false,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}) {
  const shared = cn(
    "relative inline-flex items-center justify-center overflow-hidden rounded-tlin-control font-bold transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    buttonSizes[size],
    fullWidth && "w-full",
    className,
  );

  if (variant === "primary") {
    return (
      <button type={type} className={cn("relative inline-flex overflow-hidden rounded-tlin-control p-px font-bold transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50", fullWidth && "w-full", className, "group/btn cursor-pointer text-white")} {...props}>
        <span
          aria-hidden="true"
          className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
          style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)" }}
        />
        <span className={cn("relative z-10 block w-full rounded-tlin-control bg-tlin-ink text-center transition-colors duration-300 group-hover/btn:text-tlin-ink", buttonSizes[size])}>
          <span className="relative z-10">{children}</span>
          <span aria-hidden="true" className="absolute inset-0 rounded-tlin-control bg-tlin-ink transition-opacity duration-500 group-hover/btn:opacity-0" />
          <span aria-hidden="true" className="absolute inset-0 rounded-tlin-control bg-gradient-to-r from-tlin-purple to-tlin-blue opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
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
