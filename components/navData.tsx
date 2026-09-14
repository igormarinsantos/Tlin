// Dados compartilhados entre Header.tsx (nav/megamenu desktop) e
// MobileNavDrawer.tsx (menu mobile) -- ficam num arquivo a parte pra evitar
// import circular entre os dois (o drawer precisa do que o Header define).

// Icones minimos, um por solucao -- mesmo padrao de SVG-inline-em-JSX ja
// usado em outros componentes do site (ex.: XIcon/CheckIcon em CampaignComparison).
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3C7.03 3 3 7.03 3 12c0 1.77.5 3.42 1.38 4.83L3 21l4.3-1.35A8.93 8.93 0 0012 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 10.5c.4 2.6 2.4 4.6 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function RecoveryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18 3v4h-4M6 21v-4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrmIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="5" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="9.5" y="5" width="5" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="15.5" y="5" width="5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function AgentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="8" width="14" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="4" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="13.5" r="1.3" fill="currentColor" />
      <circle cx="14.5" cy="13.5" r="1.3" fill="currentColor" />
    </svg>
  );
}
function CourseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
    </svg>
  );
}

// Icone do item "Fale com a IA" do nav (desktop + mobile) -- mesmo estrelinha
// usada como acento de "IA" no blog (Resumir com IA), reaproveitado aqui pra
// manter a mesma linguagem visual em vez de inventar um icone novo.
export function SparkleIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        fill="currentColor"
      />
    </svg>
  );
}

// As 5 paginas de campanha num grid unico -- a nomenclatura ("por
// funcionalidade" x "por segmento") virou so a ordem dos cards, sem
// precisar de colunas separadas; cada uma ganha um icone proprio.
export const SOLUTIONS = [
  { href: "/ia-whatsapp", nameKey: "solutionsLink1", descKey: "solutionsDesc1", Icon: WhatsAppIcon },
  { href: "/recuperacao-de-leads", nameKey: "solutionsLink2", descKey: "solutionsDesc2", Icon: RecoveryIcon },
  { href: "/crm-com-ia", nameKey: "solutionsLink3", descKey: "solutionsDesc3", Icon: CrmIcon },
  { href: "/agentes-de-ia", nameKey: "solutionsLink5", descKey: "solutionsDesc5", Icon: AgentIcon },
  { href: "/infoprodutores", nameKey: "solutionsLink4", descKey: "solutionsDesc4", Icon: CourseIcon },
] as const;

// Paginas que renderizam a mesma Features/Pricing da home (mesmos ids
// #como-funciona/#planos) -- nelas o link e uma ancora pura. Em qualquer
// outra pagina (ex.: /comece, /legal) a secao nao existe ali, entao o link
// aponta pra home com a ancora, em vez de "clicar e nao acontecer nada".
export const PAGES_WITH_FEATURES_SECTION = ["/", "/ia-whatsapp", "/recuperacao-de-leads", "/crm-com-ia", "/infoprodutores", "/agentes-de-ia"];
