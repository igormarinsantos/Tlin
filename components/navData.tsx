// Dados compartilhados entre Header.tsx (nav/megamenu desktop) e
// MobileNavDrawer.tsx (menu mobile) -- ficam num arquivo a parte pra evitar
// import circular entre os dois (o drawer precisa do que o Header define).

import { MessageCircle, RefreshCw, Kanban, Bot, GraduationCap } from "lucide-react";

// Icones das solucoes -- lucide-react (ja usada em FunnelAnimation.tsx),
// em vez de SVG desenhado a mao, pra um traco mais consistente/polido.
function WhatsAppIcon() {
  return <MessageCircle size={20} strokeWidth={1.75} />;
}
function RecoveryIcon() {
  return <RefreshCw size={20} strokeWidth={1.75} />;
}
function CrmIcon() {
  return <Kanban size={20} strokeWidth={1.75} />;
}
function AgentIcon() {
  return <Bot size={20} strokeWidth={1.75} />;
}
function CourseIcon() {
  return <GraduationCap size={20} strokeWidth={1.75} />;
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
