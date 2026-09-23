export type SegmentHeroFlow = {
  contact: { name: string; avatar: string; status: string };
  contactLabel: string;
  conversationLabel: string;
  aiLabel: string;
  crmLabel: string;
  identifyingLabel: string;
  updatingLabel: string;
  updatedLabel: string;
  summary: string;
  messages: Array<{ from: "contact" | "ai"; text: string }>;
  fields: Array<{ label: string; value: string }>;
  stages: [string, string, string];
  activities: [string, string, string, string];
  outcome: {
    title: string;
    detail: string;
    crmStatus: string;
    supportingText: string;
  };
};

export type SegmentHeroFlowKey = "clinicas" | "escolas" | "assessorias" | "advocacia";

type SegmentHeroFlows = Record<SegmentHeroFlowKey, SegmentHeroFlow>;

export const ptSegmentHeroFlows: SegmentHeroFlows = {
  clinicas: {
    contact: { name: "Ana Paula", avatar: "/lotties/avatars/1_avatar.webp", status: "online agora" },
    contactLabel: "Paciente",
    conversationLabel: "Novo contato recebido",
    aiLabel: "IA em ação",
    crmLabel: "CRM Tlin",
    identifyingLabel: "Contexto identificado pela IA",
    updatingLabel: "Atualizando etapa...",
    updatedLabel: "Etapa atualizada",
    summary: "A IA atende uma paciente, identifica a preferência de horário, registra o contexto no CRM e agenda a consulta",
    messages: [
      { from: "contact", text: "Oi! Gostaria de agendar uma consulta inicial. Tem horário esta semana?" },
      { from: "ai", text: "Claro! Você prefere atendimento pela manhã ou à tarde?" },
      { from: "contact", text: "À tarde, se possível" },
      { from: "ai", text: "Perfeito. Encontrei quinta-feira às 15h. Posso reservar?" },
    ],
    fields: [
      { label: "Interesse", value: "Consulta inicial" },
      { label: "Preferência", value: "Período da tarde" },
      { label: "Origem", value: "Instagram" },
      { label: "Próximo passo", value: "Agendamento" },
    ],
    stages: ["Novo contato", "Interesse identificado", "Consulta agendada"],
    activities: ["IA respondeu em segundos", "Preferência registrada", "Contato criado no CRM", "Horário reservado automaticamente"],
    outcome: {
      title: "Consulta agendada",
      detail: "Quinta-feira, 15h",
      crmStatus: "CRM atualizado pela IA",
      supportingText: "Atendimento organizado sem deixar o paciente esperando",
    },
  },
  escolas: {
    contact: { name: "Carla Freitas", avatar: "/lotties/avatars/6_avatar.webp", status: "online agora" },
    contactLabel: "Família",
    conversationLabel: "Nova família recebida",
    aiLabel: "IA em ação",
    crmLabel: "CRM Tlin",
    identifyingLabel: "Contexto identificado pela IA",
    updatingLabel: "Atualizando etapa...",
    updatedLabel: "Etapa atualizada",
    summary: "A IA atende uma família, identifica o interesse de matrícula, registra os dados no CRM e agenda uma visita",
    messages: [
      { from: "contact", text: "Olá! Gostaria de saber mais sobre matrículas para o 6º ano" },
      { from: "ai", text: "Claro! Você procura qual período e gostaria de conhecer a escola?" },
      { from: "contact", text: "Período da manhã. Podemos visitar esta semana?" },
      { from: "ai", text: "Sim. Tenho quarta-feira às 10h. Posso agendar a visita?" },
    ],
    fields: [
      { label: "Série", value: "6º ano" },
      { label: "Período", value: "Manhã" },
      { label: "Interesse", value: "Conhecer a escola" },
      { label: "Próximo passo", value: "Visita" },
    ],
    stages: ["Nova família", "Interesse de matrícula", "Visita agendada"],
    activities: ["IA respondeu à família", "Interesse registrado", "Família adicionada ao CRM", "Visita confirmada automaticamente"],
    outcome: {
      title: "Visita agendada",
      detail: "Quarta-feira, 10h",
      crmStatus: "Interesse atualizado no CRM",
      supportingText: "Da primeira mensagem à visita, sem perder o interesse da família",
    },
  },
  assessorias: {
    contact: { name: "Marcos Oliveira", avatar: "/lotties/avatars/8_avatar.webp", status: "online agora" },
    contactLabel: "Lead",
    conversationLabel: "Novo lead recebido",
    aiLabel: "IA em ação",
    crmLabel: "CRM Tlin",
    identifyingLabel: "Contexto identificado pela IA",
    updatingLabel: "Atualizando etapa...",
    updatedLabel: "Etapa atualizada",
    summary: "A IA atende um lead, entende o objetivo comercial, organiza o contexto no CRM e agenda um diagnóstico",
    messages: [
      { from: "contact", text: "Vi o anúncio e quero entender se vocês conseguem ajudar minha empresa" },
      { from: "ai", text: "Qual é o principal objetivo da empresa hoje?" },
      { from: "contact", text: "Organizar o comercial. Somos uma equipe de 8 pessoas" },
      { from: "ai", text: "Entendi. Tenho amanhã às 14h para um diagnóstico. Posso reservar?" },
    ],
    fields: [
      { label: "Objetivo", value: "Organizar o comercial" },
      { label: "Equipe", value: "8 pessoas" },
      { label: "Origem", value: "Campanha" },
      { label: "Próximo passo", value: "Diagnóstico" },
    ],
    stages: ["Novo lead", "Contexto comercial", "Diagnóstico agendado"],
    activities: ["IA respondeu ao novo lead", "Objetivo comercial identificado", "Informações registradas no CRM", "Diagnóstico agendado"],
    outcome: {
      title: "Diagnóstico agendado",
      detail: "Amanhã, 14h",
      crmStatus: "Oportunidade avançada pela IA",
      supportingText: "O lead chega à reunião com o contexto comercial organizado",
    },
  },
  advocacia: {
    contact: { name: "Ricardo Mendes", avatar: "/lotties/avatars/2_avatar.webp", status: "online agora" },
    contactLabel: "Contato",
    conversationLabel: "Novo contato recebido",
    aiLabel: "IA em ação",
    crmLabel: "CRM Tlin",
    identifyingLabel: "Contexto identificado pela IA",
    updatingLabel: "Atualizando etapa...",
    updatedLabel: "Etapa atualizada",
    summary: "A IA acolhe o primeiro contato, organiza as informações no CRM e encaminha a conversa à equipe responsável",
    messages: [
      { from: "contact", text: "Olá, preciso falar com um advogado sobre um contrato" },
      { from: "ai", text: "O contrato é empresarial ou pessoal? Existe algum prazo próximo?" },
      { from: "contact", text: "Empresarial. Preciso revisar o documento até sexta-feira" },
      { from: "ai", text: "Contexto registrado. Vou encaminhar para a equipe responsável" },
    ],
    fields: [
      { label: "Área informada", value: "Contratos" },
      { label: "Contexto", value: "Empresarial" },
      { label: "Prazo informado", value: "Sexta-feira" },
      { label: "Próximo passo", value: "Encaminhamento" },
    ],
    stages: ["Novo contato", "Contexto organizado", "Equipe responsável"],
    activities: ["IA respondeu ao contato", "Informações iniciais organizadas", "Contexto registrado no CRM", "Contato encaminhado à equipe"],
    outcome: {
      title: "Contato encaminhado",
      detail: "Equipe de Contratos",
      crmStatus: "Contexto disponível no CRM",
      supportingText: "A análise e a orientação são realizadas pelo advogado responsável",
    },
  },
};

export const enSegmentHeroFlows: SegmentHeroFlows = {
  clinicas: {
    ...ptSegmentHeroFlows.clinicas,
    contact: { ...ptSegmentHeroFlows.clinicas.contact, status: "online now" },
    contactLabel: "Patient", conversationLabel: "New contact received", aiLabel: "AI in action", crmLabel: "Tlin CRM", identifyingLabel: "Context identified by AI", updatingLabel: "Updating stage...", updatedLabel: "Stage updated",
    summary: "AI assists a patient, identifies their preferred time, records the context in the CRM, and books the appointment",
    messages: [{ from: "contact", text: "Hi! I'd like to book an initial appointment. Is there a time this week?" }, { from: "ai", text: "Of course! Do you prefer morning or afternoon?" }, { from: "contact", text: "Afternoon, if possible" }, { from: "ai", text: "Great. I found Thursday at 3 PM. May I book it?" }],
    fields: [{ label: "Interest", value: "Initial appointment" }, { label: "Preference", value: "Afternoon" }, { label: "Source", value: "Instagram" }, { label: "Next step", value: "Booking" }],
    stages: ["New contact", "Interest identified", "Appointment booked"],
    activities: ["AI replied in seconds", "Preference recorded", "Contact created in CRM", "Time booked automatically"],
    outcome: { title: "Appointment booked", detail: "Thursday, 3 PM", crmStatus: "CRM updated by AI", supportingText: "Organized service without leaving the patient waiting" },
  },
  escolas: {
    ...ptSegmentHeroFlows.escolas,
    contact: { ...ptSegmentHeroFlows.escolas.contact, status: "online now" },
    contactLabel: "Family", conversationLabel: "New family received", aiLabel: "AI in action", crmLabel: "Tlin CRM", identifyingLabel: "Context identified by AI", updatingLabel: "Updating stage...", updatedLabel: "Stage updated",
    summary: "AI assists a family, identifies enrollment interest, records the details in the CRM, and books a visit",
    messages: [{ from: "contact", text: "Hi! I'd like to learn more about 6th grade enrollment" }, { from: "ai", text: "Of course! Which period do you need, and would you like to visit?" }, { from: "contact", text: "Morning. Could we visit this week?" }, { from: "ai", text: "Yes. I have Wednesday at 10 AM. May I book the visit?" }],
    fields: [{ label: "Grade", value: "6th grade" }, { label: "Period", value: "Morning" }, { label: "Interest", value: "Visit the school" }, { label: "Next step", value: "Visit" }],
    stages: ["New family", "Enrollment interest", "Visit booked"],
    activities: ["AI replied to the family", "Interest recorded", "Family added to CRM", "Visit confirmed automatically"],
    outcome: { title: "Visit booked", detail: "Wednesday, 10 AM", crmStatus: "Interest updated in CRM", supportingText: "From the first message to the visit without losing the family's interest" },
  },
  assessorias: {
    ...ptSegmentHeroFlows.assessorias,
    contact: { ...ptSegmentHeroFlows.assessorias.contact, status: "online now" },
    contactLabel: "Lead", conversationLabel: "New lead received", aiLabel: "AI in action", crmLabel: "Tlin CRM", identifyingLabel: "Context identified by AI", updatingLabel: "Updating stage...", updatedLabel: "Stage updated",
    summary: "AI assists a lead, understands their sales goal, organizes the context in the CRM, and books a diagnostic call",
    messages: [{ from: "contact", text: "I saw the ad and want to know if you can help my company" }, { from: "ai", text: "What is the company's main goal today?" }, { from: "contact", text: "Organize sales. We are a team of 8" }, { from: "ai", text: "Got it. I have tomorrow at 2 PM for a diagnostic call. Shall I book it?" }],
    fields: [{ label: "Goal", value: "Organize sales" }, { label: "Team", value: "8 people" }, { label: "Source", value: "Campaign" }, { label: "Next step", value: "Diagnostic" }],
    stages: ["New lead", "Sales context", "Diagnostic booked"],
    activities: ["AI replied to the lead", "Sales goal identified", "Details recorded in CRM", "Diagnostic call booked"],
    outcome: { title: "Diagnostic booked", detail: "Tomorrow, 2 PM", crmStatus: "Opportunity advanced by AI", supportingText: "The lead reaches the meeting with their sales context organized" },
  },
  advocacia: {
    ...ptSegmentHeroFlows.advocacia,
    contact: { ...ptSegmentHeroFlows.advocacia.contact, status: "online now" },
    contactLabel: "Contact", conversationLabel: "New contact received", aiLabel: "AI in action", crmLabel: "Tlin CRM", identifyingLabel: "Context identified by AI", updatingLabel: "Updating stage...", updatedLabel: "Stage updated",
    summary: "AI welcomes the first contact, organizes the information in the CRM, and routes the conversation to the responsible team",
    messages: [{ from: "contact", text: "Hi, I need to speak with a lawyer about a contract" }, { from: "ai", text: "Is the contract business or personal? Is there a deadline?" }, { from: "contact", text: "Business. I need the document reviewed by Friday" }, { from: "ai", text: "Context recorded. I'll route this to the responsible team" }],
    fields: [{ label: "Area provided", value: "Contracts" }, { label: "Context", value: "Business" }, { label: "Deadline provided", value: "Friday" }, { label: "Next step", value: "Routing" }],
    stages: ["New contact", "Context organized", "Responsible team"],
    activities: ["AI replied to the contact", "Initial details organized", "Context recorded in CRM", "Contact routed to the team"],
    outcome: { title: "Contact routed", detail: "Contracts team", crmStatus: "Context available in CRM", supportingText: "Analysis and guidance are provided by the responsible lawyer" },
  },
};

export const esSegmentHeroFlows: SegmentHeroFlows = {
  clinicas: {
    ...ptSegmentHeroFlows.clinicas,
    contact: { ...ptSegmentHeroFlows.clinicas.contact, status: "en línea ahora" },
    contactLabel: "Paciente", conversationLabel: "Nuevo contacto recibido", aiLabel: "IA en acción", crmLabel: "CRM Tlin", identifyingLabel: "Contexto identificado por la IA", updatingLabel: "Actualizando etapa...", updatedLabel: "Etapa actualizada",
    summary: "La IA atiende a un paciente, identifica su horario preferido, registra el contexto en el CRM y agenda la consulta",
    messages: [{ from: "contact", text: "¡Hola! Quisiera agendar una consulta inicial. ¿Hay horario esta semana?" }, { from: "ai", text: "¡Claro! ¿Prefieres por la mañana o por la tarde?" }, { from: "contact", text: "Por la tarde, si es posible" }, { from: "ai", text: "Perfecto. Encontré el jueves a las 15 h. ¿Puedo reservar?" }],
    fields: [{ label: "Interés", value: "Consulta inicial" }, { label: "Preferencia", value: "Por la tarde" }, { label: "Origen", value: "Instagram" }, { label: "Próximo paso", value: "Agenda" }],
    stages: ["Nuevo contacto", "Interés identificado", "Consulta agendada"],
    activities: ["La IA respondió en segundos", "Preferencia registrada", "Contacto creado en el CRM", "Horario reservado automáticamente"],
    outcome: { title: "Consulta agendada", detail: "Jueves, 15 h", crmStatus: "CRM actualizado por la IA", supportingText: "Atención organizada sin dejar al paciente esperando" },
  },
  escolas: {
    ...ptSegmentHeroFlows.escolas,
    contact: { ...ptSegmentHeroFlows.escolas.contact, status: "en línea ahora" },
    contactLabel: "Familia", conversationLabel: "Nueva familia recibida", aiLabel: "IA en acción", crmLabel: "CRM Tlin", identifyingLabel: "Contexto identificado por la IA", updatingLabel: "Actualizando etapa...", updatedLabel: "Etapa actualizada",
    summary: "La IA atiende a una familia, identifica el interés de matrícula, registra los datos en el CRM y agenda una visita",
    messages: [{ from: "contact", text: "¡Hola! Quisiera saber más sobre matrículas para 6º grado" }, { from: "ai", text: "¡Claro! ¿Qué turno buscas y te gustaría conocer la escuela?" }, { from: "contact", text: "Por la mañana. ¿Podemos visitar esta semana?" }, { from: "ai", text: "Sí. Tengo el miércoles a las 10 h. ¿Puedo agendar la visita?" }],
    fields: [{ label: "Grado", value: "6º grado" }, { label: "Turno", value: "Mañana" }, { label: "Interés", value: "Conocer la escuela" }, { label: "Próximo paso", value: "Visita" }],
    stages: ["Nueva familia", "Interés de matrícula", "Visita agendada"],
    activities: ["La IA respondió a la familia", "Interés registrado", "Familia añadida al CRM", "Visita confirmada automáticamente"],
    outcome: { title: "Visita agendada", detail: "Miércoles, 10 h", crmStatus: "Interés actualizado en el CRM", supportingText: "Del primer mensaje a la visita sin perder el interés de la familia" },
  },
  assessorias: {
    ...ptSegmentHeroFlows.assessorias,
    contact: { ...ptSegmentHeroFlows.assessorias.contact, status: "en línea ahora" },
    contactLabel: "Lead", conversationLabel: "Nuevo lead recibido", aiLabel: "IA en acción", crmLabel: "CRM Tlin", identifyingLabel: "Contexto identificado por la IA", updatingLabel: "Actualizando etapa...", updatedLabel: "Etapa actualizada",
    summary: "La IA atiende a un lead, entiende su objetivo comercial, organiza el contexto en el CRM y agenda un diagnóstico",
    messages: [{ from: "contact", text: "Vi el anuncio y quiero saber si pueden ayudar a mi empresa" }, { from: "ai", text: "¿Cuál es el principal objetivo de la empresa hoy?" }, { from: "contact", text: "Organizar ventas. Somos un equipo de 8" }, { from: "ai", text: "Entiendo. Tengo mañana a las 14 h para un diagnóstico. ¿Lo reservo?" }],
    fields: [{ label: "Objetivo", value: "Organizar ventas" }, { label: "Equipo", value: "8 personas" }, { label: "Origen", value: "Campaña" }, { label: "Próximo paso", value: "Diagnóstico" }],
    stages: ["Nuevo lead", "Contexto comercial", "Diagnóstico agendado"],
    activities: ["La IA respondió al lead", "Objetivo comercial identificado", "Datos registrados en el CRM", "Diagnóstico agendado"],
    outcome: { title: "Diagnóstico agendado", detail: "Mañana, 14 h", crmStatus: "Oportunidad avanzada por la IA", supportingText: "El lead llega a la reunión con el contexto comercial organizado" },
  },
  advocacia: {
    ...ptSegmentHeroFlows.advocacia,
    contact: { ...ptSegmentHeroFlows.advocacia.contact, status: "en línea ahora" },
    contactLabel: "Contacto", conversationLabel: "Nuevo contacto recibido", aiLabel: "IA en acción", crmLabel: "CRM Tlin", identifyingLabel: "Contexto identificado por la IA", updatingLabel: "Actualizando etapa...", updatedLabel: "Etapa actualizada",
    summary: "La IA recibe el primer contacto, organiza la información en el CRM y dirige la conversación al equipo responsable",
    messages: [{ from: "contact", text: "Hola, necesito hablar con un abogado sobre un contrato" }, { from: "ai", text: "¿El contrato es empresarial o personal? ¿Hay algún plazo?" }, { from: "contact", text: "Empresarial. Necesito revisar el documento antes del viernes" }, { from: "ai", text: "Contexto registrado. Lo dirigiré al equipo responsable" }],
    fields: [{ label: "Área informada", value: "Contratos" }, { label: "Contexto", value: "Empresarial" }, { label: "Plazo informado", value: "Viernes" }, { label: "Próximo paso", value: "Derivación" }],
    stages: ["Nuevo contacto", "Contexto organizado", "Equipo responsable"],
    activities: ["La IA respondió al contacto", "Información inicial organizada", "Contexto registrado en el CRM", "Contacto derivado al equipo"],
    outcome: { title: "Contacto derivado", detail: "Equipo de Contratos", crmStatus: "Contexto disponible en el CRM", supportingText: "El análisis y la orientación los realiza el abogado responsable" },
  },
};
