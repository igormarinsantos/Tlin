"use client";

import Image from "next/image";
import { type ComponentType, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Bot,
  Bell,
  Archive,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  FileText,
  Funnel,
  Inbox,
  ListTodo,
  Power,
  Route,
  Search,
  Settings,
  Webhook,
} from "lucide-react";

type SystemView = "inbox" | "radar" | "agenda" | "respostas" | "funis" | "contatos" | "tarefas" | "agentes" | "roteadores" | "webhooks";

function TlinRadarIcon({ size = 16, className }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}><path d="M12 19.5a7.5 7.5 0 1 0-7.5-7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 15.8a3.8 3.8 0 1 0-3.8-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 12 18.6 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="12" r="2" fill="currentColor" /><circle cx="19" cy="5" r="2" fill="#38E3FF" /></svg>;
}

const NAVIGATION: { section: string; items: { id: SystemView; label: string; Icon: ComponentType<{ size?: number; className?: string }> }[] }[] = [
  {
    section: "Atendimento",
    items: [
      { id: "inbox", label: "Inbox", Icon: Inbox },
      { id: "radar", label: "Radar", Icon: TlinRadarIcon },
      { id: "agenda", label: "Agenda", Icon: CalendarDays },
      { id: "respostas", label: "Respostas rápidas", Icon: FileText },
    ],
  },
  {
    section: "CRM",
    items: [
      { id: "funis", label: "Funis", Icon: Funnel },
      { id: "contatos", label: "Contatos", Icon: CircleUserRound },
      { id: "tarefas", label: "Tarefas", Icon: ListTodo },
    ],
  },
  {
    section: "Agente de IA",
    items: [
      { id: "agentes", label: "Agentes", Icon: Bot },
      { id: "roteadores", label: "Roteadores", Icon: Route },
    ],
  },
  {
    section: "Canais",
    items: [
      { id: "webhooks", label: "Webhooks", Icon: Webhook },
    ],
  },
];

const LEADS = [
  { name: "Carla Freitas", detail: "Quer organizar o comercial", tag: "Fit alto", tone: "bg-[#F0EBFF] text-[#7254c8]" },
  { name: "Rafael Mendes", detail: "Pediu uma demonstração", tag: "Decisor", tone: "bg-[#FFF3E6] text-[#b86816]" },
  { name: "Marina Lopes", detail: "Conversando com a IA", tag: "Novo lead", tone: "bg-[#E8FAFC] text-[#15808d]" },
];

const CONTACTS = [
  ["Carla Freitas", "Diretora comercial", "Avaliação", "Alto"],
  ["Rafael Mendes", "Sócio", "Reunião", "Alto"],
  ["Marina Lopes", "Gestora de vendas", "Entrada", "Médio"],
  ["Lucas Almeida", "Fundador", "Qualificação", "Alto"],
  ["Beatriz Costa", "Comercial", "Entrada", "Médio"],
  ["Fernanda Rocha", "Operações", "Avaliação", "Médio"],
  ["Gustavo Pires", "Diretor", "Reunião", "Alto"],
  ["Aline Souza", "Marketing", "Qualificação", "Médio"],
] as const;

const VIEW_COPY: Record<SystemView, { title: string; description: string }> = {
  inbox: { title: "Inbox", description: "Leads e conversas organizados em um só lugar." },
  radar: { title: "Radar", description: "Oportunidades que pedem atenção agora." },
  agenda: { title: "Agenda", description: "Reuniões preparadas com o contexto do lead." },
  respostas: { title: "Respostas rápidas", description: "Respostas prontas para o comercial agir com velocidade." },
  funis: { title: "Funis", description: "Cada oportunidade no momento certo da venda." },
  contatos: { title: "Contatos", description: "Informações que ajudam o comercial a decidir." },
  tarefas: { title: "Tarefas", description: "Próximas ações visíveis para ninguém perder o momento." },
  agentes: { title: "Agentes", description: "IA configurada para trabalhar no seu processo." },
  roteadores: { title: "Roteadores", description: "Cada conversa segue para quem pode resolver o próximo passo." },
  webhooks: { title: "Webhooks", description: "Eventos que mantêm seus dados e processos sincronizados." },
};

function LeadRows() {
  return <div className="mt-4 space-y-2">{LEADS.map((lead) => <div key={lead.name} className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-white px-2.5 py-2"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B597FF]/30 to-[#38E3FF]/35 text-[9px] font-bold text-[#0c0d0d]">{lead.name.split(" ").map((part) => part[0]).join("")}</div><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-bold text-[#0c0d0d]">{lead.name}</p><p className="truncate text-[8px] text-zinc-400">{lead.detail}</p></div><span className={`hidden rounded-full px-1.5 py-1 text-[7px] font-bold sm:inline ${lead.tone}`}>{lead.tag}</span></div>)}</div>;
}

function AgendaCalendar() {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const dates = [29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const events: Record<number, { name: string; tone: string }> = {
    7: { name: "Carla", tone: "bg-[#F0EBFF] text-[#7254c8]" },
    9: { name: "Rafael", tone: "bg-[#FFF3E6] text-[#b86816]" },
    12: { name: "Marina", tone: "bg-[#E8FAFC] text-[#15808d]" },
    16: { name: "Demo", tone: "bg-zinc-200 text-zinc-600" },
  };

  return <div className="mt-4 rounded-2xl border border-zinc-100 bg-white p-3"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold text-[#0c0d0d]">Outubro</p><p className="mt-0.5 text-[8px] text-zinc-400">Reuniões do comercial</p></div><span className="rounded-full bg-[#F0EBFF] px-2 py-1 text-[8px] font-bold text-[#7254c8]">Hoje</span></div><div className="mt-4 grid grid-cols-7 gap-1">{days.map((day) => <span key={day} className="text-center text-[7px] font-bold text-zinc-400">{day}</span>)}{dates.map((date, index) => <div key={`${date}-${index}`} className={`min-h-14 rounded-lg p-1.5 ${events[date] ? "bg-[#F7F7FB]" : "bg-zinc-50/60"}`}><p className={`text-[7px] font-bold ${date === 7 ? "text-[#7254c8]" : "text-zinc-400"}`}>{date}</p>{events[date] && <span className={`mt-1 block truncate rounded px-1 py-0.5 text-[6px] font-bold ${events[date].tone}`}>{events[date].name}</span>}</div>)}</div></div>;
}

function FunnelBoard() {
  const stageConfig = [
    { name: "Chegou", tone: "border-[#38E3FF]/40 bg-[#E8FAFC] text-[#15808d]" },
    { name: "Qualificado", tone: "border-[#B597FF]/40 bg-[#F0EBFF] text-[#7254c8]" },
    { name: "Reunião", tone: "border-[#F5B35C]/50 bg-[#FFF3E6] text-[#b86816]" },
  ];
  const [stages, setStages] = useState<Record<string, string[]>>({ Chegou: ["Marina Lopes", "Beatriz Costa", "Aline Souza"], Qualificado: ["Rafael Mendes", "Lucas Almeida", "Fernanda Rocha"], Reunião: ["Carla Freitas", "Gustavo Pires", "Thiago Ramos"] });
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const moveLead = (lead: string, targetStage: string) => {
    if (!lead) return;
    setStages((current) => {
      const next = Object.fromEntries(Object.entries(current).map(([stage, leads]) => [stage, leads.filter((item) => item !== lead)]));
      next[targetStage] = [...next[targetStage], lead];
      return next;
    });
    setDraggedLead(null);
    setSelectedLead(null);
  };

  return <div className="mt-4"><p className="mb-2 text-[8px] text-zinc-400">Arraste o card ou selecione e escolha a etapa de destino.</p><div className="grid h-[250px] grid-cols-3 gap-2">{stageConfig.map(({ name: stage, tone }) => <div key={stage} onDragEnter={(event) => event.preventDefault()} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={(event) => { event.preventDefault(); moveLead(event.dataTransfer.getData("text/plain") || draggedLead || "", stage); }} onClick={() => { if (selectedLead && !stages[stage].includes(selectedLead)) moveLead(selectedLead, stage); }} className={`h-full rounded-2xl border p-2 transition-colors ${tone} ${selectedLead ? "cursor-pointer" : ""}`}><div className="flex items-center justify-between"><p className="text-[8px] font-bold">{stage}</p><span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[7px] font-bold">{stages[stage].length}</span></div><div className="mt-2 space-y-1.5">{stages[stage].map((lead) => <div key={lead} draggable onClick={(event) => { event.stopPropagation(); setSelectedLead(lead); }} onDragStart={(event) => { event.dataTransfer.setData("text/plain", lead); event.dataTransfer.effectAllowed = "move"; setDraggedLead(lead); setSelectedLead(lead); }} onDragEnd={() => setDraggedLead(null)} className={`cursor-grab rounded-lg border bg-white p-2 text-left transition-all active:cursor-grabbing ${selectedLead === lead ? "border-[#0c0d0d] ring-1 ring-[#0c0d0d]" : "border-white/80"}`}><p className="truncate text-[7px] font-bold text-[#0c0d0d]">{lead}</p><p className="mt-0.5 text-[6px] text-zinc-500">Oportunidade</p></div>)}</div></div>)}</div></div>;
}

function ContactList() {
  return <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100"><div className="grid grid-cols-[1.2fr_.9fr_.7fr] border-b border-zinc-100 bg-[#F7F7FB] px-3 py-2 text-[7px] font-bold text-zinc-400"><span>Contato</span><span>Momento</span><span className="text-right">Fit</span></div>{CONTACTS.map(([name, role, moment, fit], index) => <div key={name} className="grid grid-cols-[1.2fr_.9fr_.7fr] items-center border-b border-zinc-100 px-3 py-2.5 last:border-0"><div className="min-w-0"><p className="truncate text-[9px] font-bold text-[#0c0d0d]">{name}</p><p className="truncate text-[7px] text-zinc-400">{role}</p></div><span className="text-[8px] text-zinc-500">{moment}</span><span className={`justify-self-end rounded-full px-1.5 py-1 text-[7px] font-bold ${index % 3 === 0 ? "bg-[#F0EBFF] text-[#7254c8]" : "bg-[#E8FAFC] text-[#15808d]"}`}>{fit}</span></div>)}</div>;
}

function TaskList() {
  const initialTasks = [
    { id: "proposal", title: "Revisar proposta", lead: "Carla Freitas", when: "Hoje" },
    { id: "meeting", title: "Confirmar reunião", lead: "Rafael Mendes", when: "11:00" },
    { id: "context", title: "Atualizar contexto", lead: "Marina Lopes", when: "Amanhã" },
    { id: "followup", title: "Retomar conversa", lead: "Lucas Almeida", when: "14:30" },
    { id: "briefing", title: "Enviar briefing", lead: "Beatriz Costa", when: "Hoje" },
    { id: "review", title: "Revisar qualificação", lead: "Fernanda Rocha", when: "Amanhã" },
  ];
  const [tasks, setTasks] = useState(initialTasks);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const archiveTask = (id: string) => setTasks((current) => current.filter((task) => task.id !== id));

  return <div className="mt-4 space-y-1.5">{tasks.map((task) => <div key={task.id} className="flex items-center gap-3 rounded-xl border border-zinc-100 px-3 py-2.5"><button onClick={() => setCompleted((current) => ({ ...current, [task.id]: !current[task.id] }))} aria-label={completed[task.id] ? `Desmarcar ${task.title}` : `Concluir ${task.title}`} className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border text-[7px] font-bold transition-colors ${completed[task.id] ? "border-[#0c0d0d] bg-[#0c0d0d] text-white" : "border-zinc-300 text-transparent"}`}>✓</button><div className="min-w-0 flex-1"><p className={`text-[9px] font-bold text-[#0c0d0d] ${completed[task.id] ? "text-zinc-400 line-through" : ""}`}>{task.title}</p><p className={`mt-0.5 text-[8px] text-zinc-400 ${completed[task.id] ? "line-through" : ""}`}>{task.lead}</p></div><span className="text-[8px] font-bold text-[#7254c8]">{task.when}</span><button onClick={() => archiveTask(task.id)} aria-label={`Arquivar ${task.title}`} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-[#F7F7FB] hover:text-[#0c0d0d]"><Archive size={11} /></button></div>)}{tasks.length === 0 && <div className="rounded-xl border border-dashed border-zinc-200 p-5 text-center"><p className="text-[9px] font-bold text-zinc-500">Nenhuma tarefa visível</p><p className="mt-1 text-[8px] text-zinc-400">Atualize a página para restaurar a demonstração.</p></div>}</div>;
}

function AgentGrid() {
  const [activeAgents, setActiveAgents] = useState<Record<string, boolean>>({ Luan: true, Sofia: true, Theo: false });
  const agents = [
    { name: "Luan", area: "Comercial", detail: "Converte oportunidades", specialty: "Qualifica e agenda", tone: "bg-[#F0EBFF] text-[#7254c8]" },
    { name: "Sofia", area: "Suporte", detail: "Resolve dúvidas", specialty: "Orienta e direciona", tone: "bg-[#E8FAFC] text-[#15808d]" },
    { name: "Theo", area: "Financeiro", detail: "Organiza cobranças", specialty: "Responde sobre pagamentos", tone: "bg-[#FFF3E6] text-[#b86816]" },
  ];
  return <div className="mt-4 grid gap-2 sm:grid-cols-3">{agents.map((agent) => { const isActive = activeAgents[agent.name]; return <div key={agent.name} className="rounded-xl border border-zinc-100 bg-white p-3"><div className="flex items-start justify-between"><span className={`flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-bold ${agent.tone}`}>{agent.name[0]}</span><button onClick={() => setActiveAgents((current) => ({ ...current, [agent.name]: !current[agent.name] }))} aria-label={isActive ? `Desativar ${agent.name}` : `Ativar ${agent.name}`} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[7px] font-bold transition-colors ${isActive ? "bg-[#F7F7FB] text-zinc-500 hover:bg-zinc-100 hover:text-[#0c0d0d]" : "bg-[#0c0d0d] text-white hover:bg-zinc-800"}`}><Power size={9} />{isActive ? "Desativar" : "Ativar"}</button></div><p className="mt-4 text-[10px] font-bold text-[#0c0d0d]">{agent.name}</p><p className="mt-0.5 text-[8px] font-bold text-zinc-500">{agent.area}</p><p className="mt-3 text-[7px] leading-relaxed text-zinc-400">{agent.detail}</p><p className={`mt-3 rounded-lg px-2 py-1.5 text-[7px] font-bold ${agent.tone}`}>{agent.specialty}</p><p className="mt-2 text-[7px] font-bold text-zinc-400">{isActive ? "Em funcionamento" : "Desativado"}</p></div>; })}</div>;
}

function WebhookControls() {
  const [active, setActive] = useState<Record<string, boolean>>({ "lead.criado": true, "agenda.confirmada": true, "contato.atualizado": false });
  const labels: Record<string, string> = { "lead.criado": "Novo lead recebido", "agenda.confirmada": "Reunião confirmada", "contato.atualizado": "Contexto atualizado" };
  return <div className="mt-4 space-y-2">{Object.entries(active).map(([event, enabled]) => <button key={event} onClick={() => setActive((current) => ({ ...current, [event]: !current[event] }))} className="flex w-full items-center gap-3 rounded-xl border border-zinc-100 p-3 text-left"><div className="min-w-0 flex-1"><p className="text-[9px] font-bold text-[#0c0d0d]">{event}</p><p className="mt-0.5 text-[8px] text-zinc-400">{labels[event]}</p></div><span aria-label={enabled ? "Desativar webhook" : "Ativar webhook"} className={`relative h-4 w-7 rounded-full transition-colors ${enabled ? "bg-[#0c0d0d]" : "bg-zinc-200"}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${enabled ? "translate-x-3.5" : "translate-x-0.5"}`} /></span></button>)}</div>;
}

function ViewContent({ view }: { view: SystemView }) {
  if (view === "inbox") return <div className="mt-4 grid gap-3 md:grid-cols-[.9fr_1.1fr]"><LeadRows /><div className="hidden rounded-2xl border border-zinc-100 bg-[#F7F7FB] p-3 md:block"><p className="text-[9px] font-bold text-[#0c0d0d]">Carla Freitas</p><p className="mt-1 text-[8px] text-zinc-400">Hoje, 10:24</p><div className="mt-4 rounded-xl bg-white p-2.5 text-[8px] leading-relaxed text-zinc-500">Quero entender como a Tlin pode organizar os leads do meu comercial.</div><div className="ml-5 mt-2 rounded-xl bg-[#0c0d0d] p-2.5 text-[8px] leading-relaxed text-white">Perfeito. Posso te fazer algumas perguntas rápidas?</div></div></div>;

  if (view === "radar") return <div className="mt-4 space-y-2">{LEADS.map((lead, index) => <div key={lead.name} className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold ${index === 0 ? "bg-[#F0EBFF] text-[#7254c8]" : "bg-[#F7F7FB] text-zinc-500"}`}>0{index + 1}</span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold text-[#0c0d0d]">{lead.name}</p><p className="mt-0.5 truncate text-[8px] text-zinc-400">{index === 0 ? "Pediu proposta e está aguardando resposta" : lead.detail}</p></div><span className={`rounded-full px-2 py-1 text-[7px] font-bold ${lead.tone}`}>{index === 0 ? "Prioridade" : lead.tag}</span></div>)}</div>;

  if (view === "agenda") return <AgendaCalendar />;

  if (view === "respostas") return <div className="mt-4 grid gap-2 sm:grid-cols-2">{[["Primeiro contato", "Entender o que o lead busca"], ["Pergunta sobre preço", "Explicar o próximo passo"], ["Objeção", "Responder com contexto"], ["Agendamento", "Levar para a agenda"]].map(([title, text]) => <button key={title} className="rounded-xl border border-zinc-100 bg-white p-3 text-left transition-colors hover:border-[#B597FF]/30 hover:bg-[#F7F7FB]"><p className="text-[9px] font-bold text-[#0c0d0d]">{title}</p><p className="mt-1 text-[8px] text-zinc-400">{text}</p></button>)}</div>;

  if (view === "funis") return <FunnelBoard />;

  if (view === "contatos") return <ContactList />;

  if (view === "tarefas") return <TaskList />;

  if (view === "agentes") return <AgentGrid />;

  if (view === "roteadores") return <div className="mt-4 rounded-2xl border border-zinc-100 bg-[#F7F7FB] p-4"><div className="flex items-center justify-between"><span className="rounded-full bg-white px-2 py-1 text-[8px] font-bold text-zinc-500">Nova mensagem</span><span className="h-px flex-1 bg-zinc-200" /><span className="rounded-full bg-[#F0EBFF] px-2 py-1 text-[8px] font-bold text-[#7254c8]">IA comercial</span></div><div className="mx-auto h-4 w-px bg-zinc-200" /><div className="grid grid-cols-2 gap-2"><div className="rounded-xl border border-zinc-100 bg-white p-2 text-center"><p className="text-[8px] font-bold">Comercial</p><p className="mt-1 text-[7px] text-zinc-400">Quando há fit</p></div><div className="rounded-xl border border-zinc-100 bg-white p-2 text-center"><p className="text-[8px] font-bold">Suporte</p><p className="mt-1 text-[7px] text-zinc-400">Quando precisa de ajuda</p></div></div></div>;

  return <WebhookControls />;
}

function DetailPanel({ view }: { view: SystemView }) {
  if (view !== "inbox") return null;

  return <div className="hidden w-[31%] border-l border-zinc-100 p-4 lg:block"><p className="text-[9px] font-bold text-zinc-400">Contexto do lead</p><div className="mt-4 rounded-2xl bg-[#F7F7FB] p-3"><p className="text-[10px] font-bold text-[#0c0d0d]">Próximo passo claro</p><p className="mt-2 text-[8px] leading-relaxed text-zinc-500">Interesse, necessidade e próximo passo visíveis antes da resposta.</p></div><div className="mt-3 rounded-2xl border border-zinc-100 p-3"><p className="text-[8px] font-bold text-[#7254c8]">Qualificação</p><p className="mt-2 text-[9px] font-bold text-[#0c0d0d]">Fit alto para reunião</p></div></div>;
}

function InboxScreen() {
  const inboxLeads = [
    { name: "Carla Freitas", message: "Quero organizar o comercial", time: "agora", initials: "CF", tone: "from-[#B597FF]/35 to-[#38E3FF]/35", unread: true },
    { name: "Rafael Mendes", message: "Podemos marcar uma conversa?", time: "12 min", initials: "RM", tone: "from-[#FFF1E2] to-[#F5B35C]/30", unread: true },
    { name: "Marina Lopes", message: "Entendi. Vou falar com a equipe.", time: "28 min", initials: "ML", tone: "from-[#E8FAFC] to-[#38E3FF]/30", unread: false },
    { name: "Lucas Almeida", message: "Qual é o próximo passo?", time: "1 h", initials: "LA", tone: "from-[#F0EBFF] to-[#B597FF]/30", unread: false },
    { name: "Beatriz Costa", message: "Recebi a proposta, obrigada.", time: "2 h", initials: "BC", tone: "from-[#FFF1E2] to-[#F5B35C]/25", unread: true },
  ];

  return <div className="grid h-full min-w-0 flex-1 grid-cols-[.85fr_1.3fr_.9fr] overflow-hidden">
    <div className="min-w-0 border-r border-zinc-100 p-3">
      <div className="flex items-center gap-1.5 rounded-lg bg-[#F7F7FB] px-2 py-1.5 text-[7px] text-zinc-400"><Search size={9} />Buscar por nome</div>
      <div className="mt-2 flex gap-1"><button className="rounded-full bg-[#F7F7FB] px-1.5 py-1 text-[6px] font-medium text-zinc-500">Todos os números</button><button className="rounded-full border border-zinc-100 px-1.5 py-1 text-[6px] font-medium text-zinc-500">Tags</button></div>
      <div className="mt-3 flex items-center gap-2 border-b border-zinc-100 pb-1.5 text-[6.5px] font-medium text-zinc-400"><span className="text-[#0c0d0d]">Fila</span><span>Minhas</span><span>Todas <b className="text-[#7254c8]">8</b></span></div>
      <div className="mt-1 space-y-0.5">{inboxLeads.map((lead, index) => <button key={lead.name} className={`w-full rounded-lg p-1.5 text-left transition-colors ${index === 0 ? "bg-gradient-to-r from-[#F0EBFF] to-[#E8FAFC]" : "hover:bg-zinc-50"}`}><div className="flex items-center gap-1.5"><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${lead.tone} text-[6px] font-bold text-[#0c0d0d]`}>{lead.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-1"><p className="truncate text-[7px] font-bold text-[#0c0d0d]">{lead.name}</p><span className="ml-auto shrink-0 text-[5.5px] text-zinc-400">{lead.time}</span></div><p className="mt-0.5 truncate text-[6px] text-zinc-400">{lead.message}</p></div></div></button>)}</div>
    </div>

    <div className="flex min-w-0 flex-col border-r border-zinc-100 p-3">
      <div className="border-b border-zinc-100 pb-2"><div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F0EBFF] text-[6px] font-bold text-[#7254c8]">CF</span><div><p className="text-[9px] font-bold text-[#0c0d0d]">Carla Freitas</p><p className="mt-0.5 text-[6px] text-zinc-400">Responsável: Luan</p></div></div><span className="rounded-full bg-[#F0EBFF] px-1.5 py-0.5 text-[6px] font-bold text-[#7254c8]">Aberta</span></div><div className="mt-2 flex justify-end gap-1"><button className="rounded bg-[#0c0d0d] px-1.5 py-1 text-[6px] font-bold text-white">Assumir</button><button className="rounded border border-zinc-200 px-1.5 py-1 text-[6px] font-medium text-zinc-500">Transferir</button><button className="rounded border border-zinc-200 px-1.5 py-1 text-[6px] font-medium text-zinc-500">Lembrar</button><button className="rounded border border-zinc-200 px-1.5 py-1 text-[6px] font-medium text-zinc-500">Fechar</button></div></div>
      <div className="flex-1 space-y-2 overflow-hidden py-2.5"><p className="mx-auto w-fit rounded-full bg-zinc-100 px-2 py-0.5 text-[5.5px] font-medium text-zinc-400">Hoje, 10:21</p><div className="ml-auto max-w-[88%] rounded-xl bg-[#0c0d0d] p-2 text-[7px] leading-relaxed text-white">Oi, Carla. A Tlin organiza os leads e prepara a agenda do seu comercial. Posso entender seu momento?</div><p className="-mt-1 text-right text-[6px] text-zinc-300">10:21</p><div className="max-w-[82%] rounded-xl bg-[#F7F7FB] p-2 text-[7px] leading-relaxed text-zinc-600">Quero entender como a Tlin pode organizar os leads do meu comercial.</div><div className="mx-auto flex w-fit items-center gap-1 rounded-full bg-[#F0EBFF] px-2 py-1 text-[6px] font-bold text-[#7254c8]"><Bot size={8} />Luan identificou fit alto</div><div className="ml-auto max-w-[88%] rounded-xl bg-[#0c0d0d] p-2 text-[7px] leading-relaxed text-white">Perfeito. Hoje vocês têm bastante volume no WhatsApp?</div><p className="-mt-1 text-right text-[6px] text-zinc-300">10:24</p><div className="max-w-[82%] rounded-xl bg-[#F7F7FB] p-2 text-[7px] leading-relaxed text-zinc-600">Temos, mas a equipe demora para voltar em alguns contatos.</div></div>
      <div className="rounded-lg border border-zinc-200 bg-white"><div className="flex items-center justify-between border-b border-zinc-100 px-2 py-1"><span className="text-[6px] font-bold text-[#7254c8]">Responder</span><button className="text-[6px] text-zinc-400">Nota interna</button><button className="rounded border border-zinc-100 px-1 py-0.5 text-[5.5px] text-zinc-500">Sugerir resposta</button></div><div className="flex items-center gap-1.5 p-1.5"><button aria-label="Anexar arquivo" className="rounded p-0.5 text-zinc-400 hover:bg-zinc-50"><FileText size={9} /></button><span className="min-w-0 flex-1 text-[7px] text-zinc-400">Escreva uma mensagem</span><button className="rounded-md bg-[#0c0d0d] px-1.5 py-1 text-[6px] font-bold text-white">Enviar</button></div></div>
    </div>

    <div className="min-w-0 p-3"><p className="text-[8px] font-bold text-[#0c0d0d]">Contato</p><div className="mt-2 rounded-xl border border-zinc-100 p-2"><div className="flex items-center gap-1.5"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B597FF]/25 text-[7px] font-bold text-[#7254c8]">CF</span><div><p className="text-[8px] font-bold text-[#0c0d0d]">Carla Freitas</p><p className="mt-0.5 text-[6px] text-zinc-400">Diretora comercial</p></div></div><p className="mt-2 text-[6.5px] font-medium text-[#7254c8]">Marcar compromisso</p><div className="mt-2 flex gap-1"><span className="rounded border border-zinc-100 px-1.5 py-1 text-[6px] text-zinc-500">Lead</span><span className="rounded border border-zinc-100 px-1.5 py-1 text-[6px] text-zinc-500">Ver contato</span></div></div><div className="mt-3 border-t border-zinc-100 pt-2"><p className="text-[7px] font-bold text-[#0c0d0d]">Tags da conversa</p><div className="mt-1.5 flex flex-wrap gap-1"><span className="rounded-full bg-[#E8FAFC] px-1.5 py-0.5 text-[6px] font-bold text-[#15808d]">IA comercial</span><span className="rounded-full bg-[#F0EBFF] px-1.5 py-0.5 text-[6px] font-bold text-[#7254c8]">Fit alto</span><span className="rounded-full bg-[#FFF1E2] px-1.5 py-0.5 text-[6px] font-bold text-[#C97A27]">Decisora</span><button className="rounded-full border border-zinc-100 px-1.5 py-0.5 text-[6px] text-zinc-400">+ tag</button></div></div><div className="mt-3 border-t border-zinc-100 pt-2"><div className="flex items-center justify-between"><p className="text-[7px] font-bold text-[#0c0d0d]">Demandas abertas</p><span className="text-[6px] text-zinc-400">2 ativas</span></div><div className="mt-1.5 space-y-1.5"><div className="rounded-lg border border-zinc-100 p-1.5"><p className="text-[6px] font-bold text-[#7254c8]">Aberta</p><p className="mt-0.5 text-[6.5px] font-medium text-zinc-600">Responder à nova mensagem</p><button className="mt-1 text-[6px] font-bold text-[#7254c8]">Encerrar demanda</button></div><div className="rounded-lg border border-zinc-100 p-1.5"><p className="text-[6px] font-bold text-[#7254c8]">Aberta</p><p className="mt-0.5 text-[6.5px] font-medium text-zinc-600">Definir próximo passo</p><button className="mt-1 text-[6px] font-bold text-[#7254c8]">Marcar próximo passo</button></div></div></div></div>
  </div>;
}

export function SystemPreview() {
  const [view, setView] = useState<SystemView>("inbox");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const smoothX = useSpring(offsetX, { damping: 28, stiffness: 70, mass: 0.7 });
  const smoothY = useSpring(offsetY, { damping: 28, stiffness: 70, mass: 0.7 });
  const copy = VIEW_COPY[view];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isPreviewHovered || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      offsetX.set(((event.clientX / window.innerWidth) - 0.5) * 7);
      offsetY.set(((event.clientY / window.innerHeight) - 0.5) * 5);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPreviewHovered, offsetX, offsetY]);

  return (
    <motion.div style={{ x: smoothX, y: smoothY }} onMouseEnter={() => { offsetX.set(smoothX.get()); offsetY.set(smoothY.get()); setIsPreviewHovered(true); }} onMouseLeave={() => setIsPreviewHovered(false)} className="relative isolate w-full">
      <div className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-gradient-to-r from-[#B597FF]/20 via-[#B597FF]/10 to-[#38E3FF]/20 blur-3xl" />
      <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white">
        <div className="relative flex h-11 items-center justify-between border-b border-zinc-100 px-4">
          <div className="flex items-center gap-2"><Image src="/Logo%20Horizontal.svg" alt="Tlin" width={44} height={18} className="h-[18px] w-[44px] object-contain" /><span className="h-3 border-l border-zinc-200" /><span className="text-[9px] font-medium text-zinc-500">Sua empresa</span><ChevronDown size={12} className="text-zinc-400" /></div>
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-lg border border-zinc-200 bg-[#FCFCFD] px-2.5 py-1 sm:flex"><Search size={11} className="text-zinc-400" /><span className="text-[8px] text-zinc-400">Buscar no sistema</span><span className="ml-3 rounded bg-white px-1 text-[7px] font-bold text-zinc-400">⌘ K</span></div>
          <div className="flex items-center gap-2"><button onClick={() => setNotificationsOpen((current) => !current)} aria-label="Abrir notificações" className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-[#F7F7FB]"><Bell size={13} /></button><Image src="/lotties/avatars/6_avatar.avif" alt="Perfil da usuária" width={24} height={24} className="h-6 w-6 rounded-full object-cover" /></div>
          {notificationsOpen && <div className="absolute right-4 top-9 z-20 w-44 rounded-xl border border-zinc-200 bg-white p-2.5"><p className="text-[8px] font-bold text-[#0c0d0d]">Notificações</p><p className="mt-2 text-[8px] leading-relaxed text-zinc-500">Carla respondeu à qualificação.</p><p className="mt-2 text-[8px] leading-relaxed text-zinc-500">Nova reunião confirmada.</p></div>}
        </div>

        <div className="flex h-[390px] overflow-hidden">
          <aside className="preview-sidebar-scrollbar hidden h-full min-h-0 w-[122px] shrink-0 overscroll-contain overflow-y-auto border-r border-zinc-100 bg-[#FCFCFD] px-2 py-2.5 sm:block">
            <div className="flex min-h-[455px] flex-col">{NAVIGATION.map((group) => <div key={group.section} className="mb-3"><p className="mb-1 px-1.5 text-[7px] font-bold text-zinc-400">{group.section}</p>{group.items.map(({ id, label, Icon }) => <button key={id} onClick={() => setView(id)} aria-pressed={view === id} className={`flex w-full items-center gap-1.5 px-1.5 py-1.5 text-left text-[8px] font-bold transition-colors ${view === id ? "rounded-full bg-gradient-to-r from-[#B597FF]/20 to-[#38E3FF]/25 text-[#0c0d0d] shadow-[inset_0_0_0_1px_rgba(181,151,255,0.35)]" : "rounded-md text-zinc-500 hover:bg-white hover:text-[#0c0d0d]"}`}><Icon size={11} />{label}</button>)}</div>)}<div className="mt-auto border-t border-zinc-100 pt-2"><div className="flex items-center gap-1.5 px-1.5 text-[8px] font-bold text-zinc-500"><Settings size={11} />Configurações</div></div></div>
          </aside>

          {view === "inbox" ? <InboxScreen /> : <><div className="min-h-0 min-w-0 flex-1 overflow-hidden p-3.5 sm:p-5">
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-[#0c0d0d]">{copy.title}</p><p className="mt-1 max-w-[260px] text-[9px] leading-relaxed text-zinc-400">{copy.description}</p></div><span className="rounded-full bg-[#F0EBFF] px-2 py-1 text-[8px] font-bold text-[#7254c8]">Prévia</span></div>

            <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 sm:hidden">{NAVIGATION.flatMap((group) => group.items).map(({ id, label }) => <button key={id} onClick={() => setView(id)} className={`shrink-0 rounded-full px-2.5 py-1 text-[8px] font-bold ${view === id ? "bg-[#0c0d0d] text-white" : "bg-[#F7F7FB] text-zinc-500"}`}>{label}</button>)}</div>

            <ViewContent view={view} />
          </div>

          <DetailPanel view={view} /></>}
        </div>
      </div>
    </motion.div>
  );
}
