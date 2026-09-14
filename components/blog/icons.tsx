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

// Icones do ShareBar (compartilhar / copiar link na pagina de artigo).
export function WhatsAppShareIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3C7.03 3 3 7.03 3 12c0 1.77.5 3.42 1.38 4.83L3 21l4.3-1.35A8.93 8.93 0 0012 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
      <path d="M8.5 10.5c.4 2.6 2.4 4.6 5 5" strokeLinecap="round" />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2 2 0 11-.02 4 2 2 0 01.02-4zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.8 5 6.3V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z" />
    </svg>
  );
}

export function XSocialIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 3H22l-7.6 8.7L23 21h-6.8l-5.3-6.4L4.8 21H2l8.1-9.3L1.6 3h7l4.8 5.8L18.9 3zm-1.2 16.2h1.7L7.1 4.7H5.3l12.4 14.5z" />
    </svg>
  );
}

export function LinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9.5 14.5l5-5" strokeLinecap="round" />
      <path d="M11 6.5l1.2-1.2a3.5 3.5 0 015 5L16 11.5M13 17.5l-1.2 1.2a3.5 3.5 0 01-5-5L8 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
