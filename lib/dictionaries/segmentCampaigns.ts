import {
  enSegmentHeroFlows,
  esSegmentHeroFlows,
  ptSegmentHeroFlows,
  type SegmentHeroFlow,
} from "./segmentHeroFlows";

type CampaignEntry = {
  title: string;
  subtitle: string;
  socialProof: string;
  highlightWords: string[];
  painHeadline: string;
  painBody: string;
  painBodyMobile: string;
  howItWorksCards: Array<{ title: string; desc: string }>;
  reviews: Array<{ name: string; role: string; text: string }>;
  comparison: Array<{ old: string; new: string }>;
  heroFlow: SegmentHeroFlow;
};

type SegmentCampaigns = Record<"clinicas" | "escolas" | "assessorias" | "advocacia", CampaignEntry>;

const ptReviews = [
  { name: "Marina Duarte", role: "Gerente comercial", text: "Respondo todo cliente na hora agora, nem parece que é um robô." },
  { name: "Thiago Ramos", role: "Dono de negócio", text: "A IA qualifica antes de eu abrir o WhatsApp." },
  { name: "Camila Nogueira", role: "Coordenadora de vendas", text: "Nunca mais um contato ficou esperando resposta." },
  { name: "Bruno Castro", role: "Sócio", text: "O atendimento ficou rápido como eu sempre quis." },
  { name: "Renata Alves", role: "Gerente de atendimento", text: "A equipe finalmente não perde mais mensagens fora do horário." },
  { name: "Diego Farias", role: "Empreendedor", text: "A velocidade da primeira resposta mudou nossa rotina comercial." },
];

const enReviews = [
  { name: "Marina Duarte", role: "Sales manager", text: "Every customer gets an immediate reply now, and it feels natural." },
  { name: "Thiago Ramos", role: "Business owner", text: "The AI qualifies contacts before I even open WhatsApp." },
  { name: "Camila Nogueira", role: "Sales coordinator", text: "No contact is left waiting for an answer anymore." },
  { name: "Bruno Castro", role: "Partner", text: "Support is finally as fast as I always wanted." },
  { name: "Renata Alves", role: "Support manager", text: "The team no longer loses messages outside business hours." },
  { name: "Diego Farias", role: "Entrepreneur", text: "The speed of the first reply changed our sales routine." },
];

const esReviews = [
  { name: "Marina Duarte", role: "Gerente comercial", text: "Ahora cada cliente recibe una respuesta inmediata y natural." },
  { name: "Thiago Ramos", role: "Dueño de negocio", text: "La IA califica los contactos antes de que abra WhatsApp." },
  { name: "Camila Nogueira", role: "Coordinadora de ventas", text: "Ningún contacto vuelve a quedarse esperando respuesta." },
  { name: "Bruno Castro", role: "Socio", text: "La atención por fin es tan rápida como siempre quise." },
  { name: "Renata Alves", role: "Gerente de atención", text: "El equipo ya no pierde mensajes fuera del horario." },
  { name: "Diego Farias", role: "Emprendedor", text: "La velocidad de la primera respuesta cambió nuestra rutina comercial." },
];

export const ptSegmentCampaigns: SegmentCampaigns = {
  clinicas: {
    heroFlow: ptSegmentHeroFlows.clinicas,
    socialProof: "66% dos médicos já usam IA na prática · AMA 2024",
    title: "Mais pacientes,\nmenos horários vazios.",
    subtitle: "A IA atende no WhatsApp, entende o interesse inicial e encaminha cada contato para o próximo passo da sua clínica.",
    highlightWords: ["pacientes", "horários"],
    painHeadline: "Quando a resposta demora, [o paciente procura outra clínica].",
    painBody: "A primeira conversa decide se o interesse avança para a agenda.",
    painBodyMobile: "O interesse precisa de resposta.",
    howItWorksCards: [
      { title: "Capture o interesse", desc: "Cada mensagem ou formulário chega com o contexto que sua recepção precisa para continuar." },
      { title: "Atenda no WhatsApp", desc: "A IA responde dúvidas iniciais com rapidez, inclusive fora do horário comercial." },
      { title: "Entenda a intenção", desc: "A conversa identifica o serviço procurado sem substituir a avaliação da sua equipe." },
      { title: "Organize no CRM nativo", desc: "Cada oportunidade fica registrada com histórico, etapa e próximo passo." },
      { title: "Agende conversas", desc: "Quem demonstra interesse recebe o caminho certo para marcar com sua equipe." },
      { title: "Acompanhe funil e métricas", desc: "Veja de onde vêm os contatos e onde sua operação pode converter mais." },
    ],
    reviews: ptReviews,
    comparison: [
      { old: "Paciente espera resposta e procura outra clínica.", new: "O primeiro contato recebe resposta no momento certo." },
      { old: "Recepção alterna entre mensagens, agenda e anotações.", new: "Conversas e próximos passos ficam organizados no CRM." },
      { old: "Cada contato chega sem contexto para a equipe.", new: "A equipe recebe o histórico antes de continuar o atendimento." },
      { old: "Interesses antigos ficam esquecidos no WhatsApp.", new: "Follow-up ajuda a retomar conversas que ficaram em aberto." },
      { old: "Não fica claro qual canal gera mais agendamentos.", new: "O funil mostra o caminho de cada oportunidade até a agenda." },
    ],
  },
  escolas: {
    heroFlow: ptSegmentHeroFlows.escolas,
    socialProof: "Escolas que acompanham cada família até a visita",
    title: "Mais matrículas,\nmenos famílias esperando.",
    subtitle: "A IA atende famílias no WhatsApp, apresenta os próximos passos e ajuda sua equipe a transformar interesse em visita.",
    highlightWords: ["matrículas", "famílias"],
    painHeadline: "Quando a família espera, [ela continua a busca em outra escola].",
    painBody: "Velocidade e contexto fazem diferença na decisão de matrícula.",
    painBodyMobile: "Famílias esperam resposta.",
    howItWorksCards: [
      { title: "Capture o interesse", desc: "Cada família entra com origem e informações iniciais organizadas." },
      { title: "Atenda no WhatsApp", desc: "A IA responde o primeiro contato em segundos, mesmo nos períodos de maior procura." },
      { title: "Apresente os próximos passos", desc: "A conversa explica como conhecer a escola com o tom da sua instituição." },
      { title: "Organize no CRM nativo", desc: "Cada interesse de matrícula fica na etapa certa, sem depender de planilha." },
      { title: "Agende visitas", desc: "Famílias interessadas recebem um caminho claro para agendar com sua equipe." },
      { title: "Acompanhe funil e métricas", desc: "Veja os canais, etapas e oportunidades que precisam de acompanhamento." },
    ],
    reviews: ptReviews,
    comparison: [
      { old: "Família espera retorno e procura outra escola.", new: "O primeiro contato é respondido assim que acontece." },
      { old: "Interesses de matrícula ficam espalhados em mensagens.", new: "Cada família segue organizada no mesmo funil comercial." },
      { old: "Visitas dependem de uma resposta manual para acontecer.", new: "A conversa encaminha famílias interessadas para a visita." },
      { old: "A equipe perde o momento certo para retomar contato.", new: "Follow-up mantém a conversa ativa até o próximo passo." },
      { old: "Não há visão clara da origem das matrículas.", new: "O funil ajuda a entender o caminho de cada matrícula." },
    ],
  },
  assessorias: {
    heroFlow: ptSegmentHeroFlows.assessorias,
    socialProof: "Assessorias que respondem enquanto a oportunidade está quente",
    title: "Todo contato atendido,\nno tempo certo.",
    subtitle: "A IA responde novos contatos, entende o contexto comercial e direciona oportunidades para a conversa certa com sua assessoria.",
    highlightWords: ["contato", "tempo"],
    painHeadline: "Quando o contato esfria, [a oportunidade procura outra assessoria].",
    painBody: "O tempo da primeira resposta influencia a próxima reunião.",
    painBodyMobile: "O timing decide oportunidades.",
    howItWorksCards: [
      { title: "Capture o contexto", desc: "Cada novo contato chega com origem e informações iniciais organizadas." },
      { title: "Atenda no WhatsApp", desc: "A IA inicia a conversa imediatamente e mantém seu padrão de atendimento." },
      { title: "Qualifique oportunidades", desc: "Perguntas do seu playbook ajudam a entender quando faz sentido avançar." },
      { title: "Organize no CRM nativo", desc: "Conversas, dados e próximos passos ficam no mesmo lugar para sua equipe." },
      { title: "Agende diagnósticos", desc: "Quem tem perfil recebe o caminho para marcar uma conversa com o especialista." },
      { title: "Acompanhe funil e métricas", desc: "Veja onde estão as oportunidades e quais pedem uma nova abordagem." },
    ],
    reviews: ptReviews,
    comparison: [
      { old: "Novo contato espera até alguém estar disponível.", new: "A primeira resposta acontece sem depender da agenda da equipe." },
      { old: "Contexto comercial se perde entre mensagens e planilhas.", new: "Cada oportunidade segue registrada no CRM com histórico." },
      { old: "Reuniões são marcadas sem entender o perfil do contato.", new: "O playbook orienta a conversa antes do diagnóstico." },
      { old: "Follow-up depende de memória e disponibilidade.", new: "A operação acompanha quem precisa de uma nova conversa." },
      { old: "A equipe não enxerga o avanço de cada oportunidade.", new: "O funil mostra a etapa e o próximo passo de cada contato." },
    ],
  },
  advocacia: {
    heroFlow: ptSegmentHeroFlows.advocacia,
    socialProof: "Escritórios que organizam cada contato desde o início",
    title: "Todo contato respondido,\ncom contexto desde o início.",
    subtitle: "A IA organiza o primeiro atendimento no WhatsApp e encaminha cada contato para a conversa certa com seu escritório.",
    highlightWords: ["contato", "contexto"],
    painHeadline: "Quando a resposta demora, [a pessoa procura outro escritório].",
    painBody: "O primeiro atendimento precisa ser rápido, claro e organizado.",
    painBodyMobile: "O primeiro contato importa.",
    howItWorksCards: [
      { title: "Receba novos contatos", desc: "Cada mensagem chega organizada para sua equipe, com origem e histórico da conversa." },
      { title: "Atenda no WhatsApp", desc: "A IA acolhe o primeiro contato com agilidade e o tom do seu escritório." },
      { title: "Organize o contexto inicial", desc: "A conversa reúne informações iniciais sem substituir a orientação jurídica." },
      { title: "Distribua no CRM nativo", desc: "Cada contato fica na etapa certa, com visibilidade para a equipe responsável." },
      { title: "Agende a conversa", desc: "O contato recebe um caminho claro para falar com o profissional adequado." },
      { title: "Acompanhe funil e métricas", desc: "Veja os contatos em andamento e onde é preciso retomar a conversa." },
    ],
    reviews: ptReviews,
    comparison: [
      { old: "Novo contato espera retorno e procura outro escritório.", new: "O primeiro atendimento começa assim que a mensagem chega." },
      { old: "Informações iniciais ficam soltas em conversas.", new: "Contexto e histórico ficam organizados para a equipe." },
      { old: "A equipe descobre tarde quem ainda espera retorno.", new: "O funil mostra cada contato e o próximo passo necessário." },
      { old: "O primeiro atendimento varia a cada pessoa do time.", new: "A IA segue o padrão definido pelo seu escritório." },
      { old: "Conversas abertas dependem de lembretes manuais.", new: "Follow-up ajuda a retomar contatos que ficaram em aberto." },
    ],
  },
};

export const enSegmentCampaigns: SegmentCampaigns = {
  clinicas: {
    heroFlow: enSegmentHeroFlows.clinicas,
    socialProof: "66% of physicians already use AI in practice · AMA 2024",
    title: "More patients,\nfewer empty time slots.", subtitle: "AI answers on WhatsApp, understands initial interest, and directs each contact to your clinic's next step.", highlightWords: ["patients", "slots"], painHeadline: "When replies take too long, [the patient looks for another clinic].", painBody: "The first conversation decides whether interest reaches the schedule.", painBodyMobile: "Interest needs a reply.", reviews: enReviews,
    howItWorksCards: [{ title: "Capture interest", desc: "Every message or form arrives with the context your front desk needs." }, { title: "Answer on WhatsApp", desc: "AI answers initial questions quickly, even outside business hours." }, { title: "Understand intent", desc: "The conversation identifies the requested service without replacing your team's assessment." }, { title: "Organize in the native CRM", desc: "Every opportunity is recorded with history, stage, and next step." }, { title: "Book conversations", desc: "Interested contacts receive the right path to book with your team." }, { title: "Track funnel and metrics", desc: "See where contacts come from and where your operation can convert more." }],
    comparison: [{ old: "Patients wait for a reply and look for another clinic.", new: "The first contact receives a reply at the right time." }, { old: "The front desk switches between messages, calendars, and notes.", new: "Conversations and next steps stay organized in the CRM." }, { old: "Contacts reach the team with no context.", new: "The team receives the history before continuing service." }, { old: "Old opportunities get forgotten in WhatsApp.", new: "Follow-up helps resume conversations left open." }, { old: "It is unclear which channel produces bookings.", new: "The funnel shows each opportunity's path to the calendar." }],
  },
  escolas: {
    heroFlow: enSegmentHeroFlows.escolas,
    socialProof: "Schools that guide every family through the visit",
    title: "More enrollments,\nfewer families waiting.", subtitle: "AI answers families on WhatsApp, presents next steps, and helps your team turn interest into a visit.", highlightWords: ["enrollments", "families"], painHeadline: "When a family waits, [they keep looking at other schools].", painBody: "Speed and context influence the enrollment decision.", painBodyMobile: "Families expect a reply.", reviews: enReviews,
    howItWorksCards: [{ title: "Capture interest", desc: "Every family enters with source and initial information organized." }, { title: "Answer on WhatsApp", desc: "AI answers the first contact in seconds, even during peak periods." }, { title: "Present the next steps", desc: "The conversation explains how to visit the school in your institution's voice." }, { title: "Organize in the native CRM", desc: "Every enrollment interest stays in the right stage without spreadsheets." }, { title: "Book visits", desc: "Interested families receive a clear path to schedule with your team." }, { title: "Track funnel and metrics", desc: "See channels, stages, and opportunities that need follow-up." }],
    comparison: [{ old: "Families wait and continue searching for another school.", new: "The first contact is answered as soon as it happens." }, { old: "Enrollment interests are scattered across messages.", new: "Every family stays organized in the same sales funnel." }, { old: "Visits depend on a manual reply to happen.", new: "The conversation directs interested families to a visit." }, { old: "The team misses the right moment to follow up.", new: "Follow-up keeps the conversation active until the next step." }, { old: "There is no clear view of enrollment sources.", new: "The funnel shows the path behind every enrollment." }],
  },
  assessorias: {
    heroFlow: enSegmentHeroFlows.assessorias,
    socialProof: "Advisory firms that reply while opportunities are warm",
    title: "Every contact answered,\nat the right time.", subtitle: "AI answers new contacts, understands sales context, and directs opportunities to the right conversation with your advisory firm.", highlightWords: ["contact", "time"], painHeadline: "When a contact goes cold, [the opportunity looks for another firm].", painBody: "First response time influences the next meeting.", painBodyMobile: "Timing decides opportunities.", reviews: enReviews,
    howItWorksCards: [{ title: "Capture context", desc: "Every new contact arrives with source and initial information organized." }, { title: "Answer on WhatsApp", desc: "AI starts the conversation immediately and follows your service standard." }, { title: "Qualify opportunities", desc: "Questions from your playbook help determine when it makes sense to advance." }, { title: "Organize in the native CRM", desc: "Conversations, data, and next steps stay together for your team." }, { title: "Book diagnostics", desc: "Qualified contacts receive the path to meet with a specialist." }, { title: "Track funnel and metrics", desc: "See where opportunities stand and which ones need another approach." }],
    comparison: [{ old: "New contacts wait until someone is available.", new: "The first reply happens without depending on team availability." }, { old: "Sales context gets lost between messages and spreadsheets.", new: "Every opportunity stays in the CRM with its history." }, { old: "Meetings are booked without understanding fit.", new: "The playbook guides the conversation before the diagnostic." }, { old: "Follow-up depends on memory and availability.", new: "The operation tracks who needs another conversation." }, { old: "The team cannot see each opportunity's progress.", new: "The funnel shows every contact's stage and next step." }],
  },
  advocacia: {
    heroFlow: enSegmentHeroFlows.advocacia,
    socialProof: "Law firms that organize every contact from the start",
    title: "Every contact answered,\nwith context from the start.", subtitle: "AI organizes the first WhatsApp interaction and directs each contact to the right conversation with your law firm.", highlightWords: ["contact", "context"], painHeadline: "When replies take too long, [the person looks for another firm].", painBody: "The first interaction needs to be fast, clear, and organized.", painBodyMobile: "The first contact matters.", reviews: enReviews,
    howItWorksCards: [{ title: "Receive new contacts", desc: "Every message reaches your team organized with source and conversation history." }, { title: "Answer on WhatsApp", desc: "AI welcomes the first contact quickly and in your firm's voice." }, { title: "Organize initial context", desc: "The conversation gathers initial information without replacing legal counsel." }, { title: "Distribute in the native CRM", desc: "Every contact stays in the right stage with visibility for the responsible team." }, { title: "Book the conversation", desc: "The contact receives a clear path to speak with the right professional." }, { title: "Track funnel and metrics", desc: "See active contacts and where the conversation needs to resume." }],
    comparison: [{ old: "New contacts wait and look for another law firm.", new: "The first interaction starts as soon as the message arrives." }, { old: "Initial information is scattered across conversations.", new: "Context and history stay organized for the team." }, { old: "The team finds out too late who is still waiting.", new: "The funnel shows every contact and required next step." }, { old: "The first interaction varies across team members.", new: "AI follows the standard defined by your firm." }, { old: "Open conversations depend on manual reminders.", new: "Follow-up helps resume conversations left open." }],
  },
};

export const esSegmentCampaigns: SegmentCampaigns = {
  clinicas: {
    heroFlow: esSegmentHeroFlows.clinicas,
    socialProof: "El 66% de los médicos ya usa IA en su práctica · AMA 2024",
    title: "Más pacientes,\nmenos horarios vacíos.", subtitle: "La IA atiende en WhatsApp, entiende el interés inicial y dirige cada contacto al siguiente paso de tu clínica.", highlightWords: ["pacientes", "horarios"], painHeadline: "Cuando la respuesta demora, [el paciente busca otra clínica].", painBody: "La primera conversación decide si el interés llega a la agenda.", painBodyMobile: "El interés necesita respuesta.", reviews: esReviews,
    howItWorksCards: [{ title: "Captura el interés", desc: "Cada mensaje o formulario llega con el contexto que recepción necesita." }, { title: "Atiende en WhatsApp", desc: "La IA responde dudas iniciales con rapidez, incluso fuera del horario." }, { title: "Entiende la intención", desc: "La conversación identifica el servicio sin reemplazar la evaluación del equipo." }, { title: "Organiza en el CRM nativo", desc: "Cada oportunidad queda registrada con historial, etapa y próximo paso." }, { title: "Agenda conversaciones", desc: "Quien muestra interés recibe el camino correcto para agendar con tu equipo." }, { title: "Sigue el embudo y las métricas", desc: "Mira de dónde vienen los contactos y dónde puedes convertir más." }],
    comparison: [{ old: "El paciente espera y busca otra clínica.", new: "El primer contacto recibe respuesta en el momento correcto." }, { old: "Recepción alterna entre mensajes, agenda y notas.", new: "Conversaciones y próximos pasos quedan organizados en el CRM." }, { old: "Cada contacto llega sin contexto para el equipo.", new: "El equipo recibe el historial antes de continuar." }, { old: "Los intereses antiguos se olvidan en WhatsApp.", new: "El seguimiento retoma conversaciones abiertas." }, { old: "No está claro qué canal genera más citas.", new: "El embudo muestra el camino de cada oportunidad a la agenda." }],
  },
  escolas: {
    heroFlow: esSegmentHeroFlows.escolas,
    socialProof: "Escuelas que acompañan a cada familia hasta la visita",
    title: "Más matrículas,\nmenos familias esperando.", subtitle: "La IA atiende familias en WhatsApp, presenta los próximos pasos y ayuda a convertir interés en visitas.", highlightWords: ["matrículas", "familias"], painHeadline: "Cuando una familia espera, [sigue buscando otra escuela].", painBody: "Velocidad y contexto influyen en la decisión de matrícula.", painBodyMobile: "Las familias esperan respuesta.", reviews: esReviews,
    howItWorksCards: [{ title: "Captura el interés", desc: "Cada familia entra con origen e información inicial organizada." }, { title: "Atiende en WhatsApp", desc: "La IA responde el primer contacto en segundos, incluso en períodos de alta demanda." }, { title: "Presenta los próximos pasos", desc: "La conversación explica cómo conocer la escuela con el tono de tu institución." }, { title: "Organiza en el CRM nativo", desc: "Cada interés de matrícula queda en la etapa correcta, sin planillas." }, { title: "Agenda visitas", desc: "Las familias interesadas reciben un camino claro para agendar." }, { title: "Sigue el embudo y las métricas", desc: "Mira canales, etapas y oportunidades que necesitan seguimiento." }],
    comparison: [{ old: "La familia espera y busca otra escuela.", new: "El primer contacto se responde en cuanto sucede." }, { old: "Los intereses quedan dispersos en mensajes.", new: "Cada familia sigue organizada en el mismo embudo." }, { old: "Las visitas dependen de una respuesta manual.", new: "La conversación dirige a las familias interesadas a una visita." }, { old: "El equipo pierde el momento correcto para retomar.", new: "El seguimiento mantiene activa la conversación." }, { old: "No hay una visión clara del origen de las matrículas.", new: "El embudo muestra el camino de cada matrícula." }],
  },
  assessorias: {
    heroFlow: esSegmentHeroFlows.assessorias,
    socialProof: "Asesorías que responden mientras la oportunidad está activa",
    title: "Cada contacto atendido,\nen el momento correcto.", subtitle: "La IA responde nuevos contactos, entiende el contexto comercial y dirige oportunidades a la conversación correcta con tu asesoría.", highlightWords: ["contacto", "momento"], painHeadline: "Cuando el contacto se enfría, [la oportunidad busca otra asesoría].", painBody: "El tiempo de la primera respuesta influye en la próxima reunión.", painBodyMobile: "El timing decide oportunidades.", reviews: esReviews,
    howItWorksCards: [{ title: "Captura el contexto", desc: "Cada nuevo contacto llega con origen e información inicial organizada." }, { title: "Atiende en WhatsApp", desc: "La IA inicia la conversación al instante y mantiene tu estándar." }, { title: "Califica oportunidades", desc: "Las preguntas de tu playbook ayudan a decidir cuándo avanzar." }, { title: "Organiza en el CRM nativo", desc: "Conversaciones, datos y próximos pasos quedan en un solo lugar." }, { title: "Agenda diagnósticos", desc: "Quien tiene perfil recibe el camino para conversar con un especialista." }, { title: "Sigue el embudo y las métricas", desc: "Mira dónde están las oportunidades y cuáles necesitan otra acción." }],
    comparison: [{ old: "El nuevo contacto espera hasta que alguien esté disponible.", new: "La primera respuesta no depende de la agenda del equipo." }, { old: "El contexto comercial se pierde entre mensajes y planillas.", new: "Cada oportunidad queda registrada en el CRM." }, { old: "Las reuniones se agendan sin entender el perfil.", new: "El playbook guía la conversación antes del diagnóstico." }, { old: "El seguimiento depende de memoria y disponibilidad.", new: "La operación acompaña a quien necesita otra conversación." }, { old: "El equipo no ve el avance de cada oportunidad.", new: "El embudo muestra etapa y próximo paso de cada contacto." }],
  },
  advocacia: {
    heroFlow: esSegmentHeroFlows.advocacia,
    socialProof: "Estudios que organizan cada contacto desde el inicio",
    title: "Cada contacto respondido,\ncon contexto desde el inicio.", subtitle: "La IA organiza la primera atención en WhatsApp y dirige cada contacto a la conversación correcta con tu estudio.", highlightWords: ["contacto", "contexto"], painHeadline: "Cuando la respuesta demora, [la persona busca otro estudio].", painBody: "La primera atención debe ser rápida, clara y organizada.", painBodyMobile: "El primer contacto importa.", reviews: esReviews,
    howItWorksCards: [{ title: "Recibe nuevos contactos", desc: "Cada mensaje llega organizado con origen e historial de conversación." }, { title: "Atiende en WhatsApp", desc: "La IA recibe el primer contacto con rapidez y el tono de tu estudio." }, { title: "Organiza el contexto inicial", desc: "La conversación reúne información sin reemplazar la orientación jurídica." }, { title: "Distribuye en el CRM nativo", desc: "Cada contacto queda en la etapa correcta para el equipo responsable." }, { title: "Agenda la conversación", desc: "El contacto recibe un camino claro para hablar con el profesional adecuado." }, { title: "Sigue el embudo y las métricas", desc: "Mira los contactos activos y dónde retomar la conversación." }],
    comparison: [{ old: "El nuevo contacto espera y busca otro estudio.", new: "La primera atención comienza cuando llega el mensaje." }, { old: "La información inicial queda suelta en conversaciones.", new: "Contexto e historial quedan organizados para el equipo." }, { old: "El equipo descubre tarde quién espera respuesta.", new: "El embudo muestra cada contacto y el próximo paso." }, { old: "La primera atención cambia según la persona.", new: "La IA sigue el estándar definido por tu estudio." }, { old: "Las conversaciones abiertas dependen de recordatorios.", new: "El seguimiento ayuda a retomar contactos abiertos." }],
  },
};
