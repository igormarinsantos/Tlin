export function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M19 12H5m6-6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparkleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.6L19.4 9.4 13.8 11.2 12 16.8l-1.8-5.6L4.6 9.4l5.6-1.8L12 2z" />
      <path d="M19 15l.7 2.1L21.8 18l-2.1.7L19 21l-.7-2.3-2.1-.7 2.1-.9L19 15z" />
    </svg>
  );
}

// Um icone por categoria de post -- usado no "banner" gradiente dos cards
// (o site nao tem foto de capa, ver categoryVisuals.ts) pra dar mais cara
// de imagem do que so uma cor lisa.
export function TrendUpIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChatBubbleIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5h16v11H9l-5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h8M8 13h5" strokeLinecap="round" />
    </svg>
  );
}

export function BookIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15.5H6.5A2.5 2.5 0 004 21V5.5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 18.5A2.5 2.5 0 016.5 16H20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
