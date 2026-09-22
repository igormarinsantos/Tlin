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
  howItWorksTitle?: string;
  howItWorksCtaTitle?: string;
  comparisonTitle?: string;
  faqs?: Array<{ q: string; a: string }>;
};

type SegmentCampaigns = Record<"clinicas" | "escolas" | "assessorias" | "advocacia", CampaignEntry>;

const ptClinicReviews = [
  { name: "Marina Duarte", role: "Gestora de clínica", text: "A recepção recebe o paciente com o contexto organizado antes de continuar o atendimento." },
  { name: "Thiago Ramos", role: "Diretor de clínica", text: "Quem chama fora do horário já encontra resposta e um próximo passo claro." },
  { name: "Camila Nogueira", role: "Coordenadora de atendimento", text: "Ficou muito mais simples enxergar quem pediu informação e ainda não agendou." },
  { name: "Bruno Castro", role: "Gestor de consultório", text: "A equipe deixou de alternar entre mensagens, agenda e anotações soltas." },
  { name: "Renata Alves", role: "Supervisora de recepção", text: "As dúvidas iniciais chegam organizadas sem tirar da equipe a decisão clínica." },
  { name: "Diego Farias", role: "Sócio de clínica", text: "Agora sabemos de onde vêm os contatos e quais precisam de retorno." },
];

const ptSchoolReviews = [
  { name: "Marina Duarte", role: "Diretora escolar", text: "A família recebe os próximos passos enquanto o interesse pela matrícula ainda está quente." },
  { name: "Thiago Ramos", role: "Mantenedor escolar", text: "Mesmo no pico de matrículas, cada família entra organizada no nosso funil." },
  { name: "Camila Nogueira", role: "Coordenadora de admissões", text: "A equipe sabe quem pediu informações, quem quer visitar e quem precisa de retorno." },
  { name: "Bruno Castro", role: "Gestor educacional", text: "As visitas deixaram de depender de alguém encontrar a conversa no WhatsApp." },
  { name: "Renata Alves", role: "Secretária escolar", text: "A IA responde o básico e entrega a conversa pronta para nossa equipe continuar." },
  { name: "Diego Farias", role: "Diretor administrativo", text: "Passamos a enxergar quais campanhas realmente trazem famílias interessadas." },
];

const ptAdvisoryReviews = [
  { name: "Marina Duarte", role: "Diretora de assessoria", text: "O especialista entra na reunião sabendo o objetivo, o momento e o tamanho da empresa." },
  { name: "Thiago Ramos", role: "Sócio de consultoria", text: "Paramos de gastar diagnóstico com contato sem perfil para o nosso serviço." },
  { name: "Camila Nogueira", role: "Coordenadora comercial", text: "O follow-up continua acontecendo mesmo quando o time está focado nas entregas." },
  { name: "Bruno Castro", role: "Consultor empresarial", text: "Cada oportunidade chega no CRM com contexto e próximo passo definido." },
  { name: "Renata Alves", role: "Head de novos negócios", text: "O primeiro contato ficou rápido sem transformar nossos especialistas em SDRs." },
  { name: "Diego Farias", role: "Sócio-diretor", text: "Hoje o funil mostra quais empresários têm fit e quais conversas precisam avançar." },
];

const ptLegalReviews = [
  { name: "Marina Duarte", role: "Gestora de escritório", text: "O contato é acolhido e o contexto inicial chega organizado para o advogado responsável." },
  { name: "Thiago Ramos", role: "Sócio de escritório", text: "A equipe identifica área, prazo informado e responsável sem procurar em várias conversas." },
  { name: "Camila Nogueira", role: "Coordenadora de atendimento", text: "Nenhum novo contato fica sem saber qual será o próximo passo do escritório." },
  { name: "Bruno Castro", role: "Advogado empresarial", text: "A IA organiza o primeiro atendimento sem oferecer orientação jurídica no lugar do advogado." },
  { name: "Renata Alves", role: "Administradora jurídica", text: "A distribuição por área ficou visível e muito menos dependente de repasse manual." },
  { name: "Diego Farias", role: "Sócio-diretor", text: "O histórico fica disponível antes da conversa com o profissional responsável." },
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
    socialProof: "+790 médicos já usam IA",
    title: "Mais agenda preenchida,\nmenos pressão na recepção.",
    subtitle: "A IA responde dúvidas iniciais no WhatsApp, organiza o interesse e conduz cada paciente até o próximo passo da sua clínica.",
    highlightWords: ["agenda", "recepção"],
    painHeadline: "Se a recepção demora, [o paciente agenda em outra clínica].",
    painBody: "Cada conversa sem retorno pode virar um horário vazio na agenda.",
    painBodyMobile: "Demora vira horário vazio.",
    howItWorksTitle: "Da primeira dúvida ao [agendamento]",
    howItWorksCtaTitle: "Pronto para aliviar a recepção e [preencher melhor a agenda]?",
    comparisonTitle: "Da recepção sobrecarregada para uma [agenda organizada]",
    howItWorksCards: [
      { title: "Receba cada paciente", desc: "Toda mensagem chega com origem e histórico para a recepção continuar sem pedir tudo de novo." },
      { title: "Responda dúvidas iniciais", desc: "A IA informa horários, localização e próximos passos, inclusive fora do expediente." },
      { title: "Entenda o que ele procura", desc: "A conversa identifica o serviço de interesse sem fazer diagnóstico ou avaliação clínica." },
      { title: "Organize no CRM nativo", desc: "Paciente, interesse e etapa ficam registrados no mesmo lugar para toda a equipe." },
      { title: "Conduza ao agendamento", desc: "Quem quer avançar recebe um caminho claro para marcar com a sua recepção." },
      { title: "Reduza horários perdidos", desc: "Veja contatos sem retorno, origem dos agendamentos e pontos de abandono da jornada." },
    ],
    reviews: ptClinicReviews,
    comparison: [
      { old: "Paciente pergunta valor ou horário e espera a recepção responder.", new: "A IA responde o primeiro contato e indica o próximo passo." },
      { old: "Recepção alterna entre mensagens, agenda e anotações.", new: "Conversas, interesse e histórico ficam organizados no CRM." },
      { old: "A equipe repete perguntas porque perdeu o contexto.", new: "A recepção continua a conversa com o histórico disponível." },
      { old: "Quem ainda não agendou some no WhatsApp.", new: "O follow-up retoma pacientes que deixaram a conversa em aberto." },
      { old: "Horários vazios aparecem sem uma causa clara.", new: "O funil mostra onde o interesse parou antes do agendamento." },
    ],
    faqs: [
      { q: "A IA pode orientar ou diagnosticar o paciente?", a: "Não. A Tlin cuida apenas do atendimento comercial inicial, reúne o contexto informado e encaminha a conversa. Diagnóstico, triagem clínica e orientação continuam com profissionais habilitados." },
      { q: "Ela consegue trabalhar com a agenda da clínica?", a: "Sim. O fluxo pode consultar a disponibilidade definida pela operação e conduzir o paciente ao agendamento, mantendo a equipe no controle das regras e exceções." },
      { q: "A recepção consegue assumir a conversa?", a: "Sim. Quando o caso pede atenção humana, a equipe recebe o histórico e continua do ponto em que a IA parou." },
    ],
  },
  escolas: {
    heroFlow: ptSegmentHeroFlows.escolas,
    socialProof: "+250 gestores escolares já usam IA",
    title: "Mais visitas agendadas,\nmenos famílias sem retorno.",
    subtitle: "A IA atende famílias no WhatsApp, esclarece os primeiros passos e conduz o interesse de matrícula até uma visita à escola.",
    highlightWords: ["matrículas", "famílias"],
    painHeadline: "Enquanto sua escola demora, [a família visita outra].",
    painBody: "No pico de matrículas, cada conversa esquecida pode custar uma visita.",
    painBodyMobile: "Demora custa visitas.",
    howItWorksTitle: "Do interesse da família à [visita na escola]",
    howItWorksCtaTitle: "Pronto para transformar procura em [visitas agendadas]?",
    comparisonTitle: "Da caixa cheia para um [funil de matrículas]",
    howItWorksCards: [
      { title: "Receba cada família", desc: "Origem, série de interesse e informações iniciais entram organizadas desde o primeiro contato." },
      { title: "Responda no pico de matrículas", desc: "A IA atende em segundos mesmo quando campanhas e rematrículas aumentam o volume." },
      { title: "Apresente a jornada", desc: "A conversa explica documentos, etapas e como conhecer a escola no tom da instituição." },
      { title: "Organize no CRM nativo", desc: "Cada família fica na etapa certa, de novo interesse até visita e matrícula." },
      { title: "Agende visitas", desc: "Famílias prontas para avançar escolhem um horário para conhecer a escola." },
      { title: "Acompanhe as matrículas", desc: "Veja campanhas, visitas pendentes e famílias que precisam de uma nova abordagem." },
    ],
    reviews: ptSchoolReviews,
    comparison: [
      { old: "Família pede informações e espera a secretaria responder.", new: "A primeira resposta acontece enquanto o interesse está ativo." },
      { old: "Série, período e origem ficam espalhados em mensagens.", new: "Cada família entra no funil com o contexto organizado." },
      { old: "Visitas dependem de troca manual de mensagens.", new: "A IA conduz a família interessada até o agendamento da visita." },
      { old: "A equipe esquece quem disse que voltaria a conversar.", new: "O follow-up retoma famílias antes que escolham outra escola." },
      { old: "A gestão não sabe qual campanha gera visitas.", new: "O funil conecta origem, atendimento, visita e matrícula." },
    ],
    faqs: [
      { q: "A IA responde dúvidas sobre série, período e matrícula?", a: "Sim. Ela usa as informações aprovadas pela escola para explicar os primeiros passos e encaminha situações específicas para a equipe responsável." },
      { q: "Ela consegue agendar visitas à escola?", a: "Sim. A família pode receber os horários disponíveis e confirmar a visita dentro da própria conversa no WhatsApp." },
      { q: "Funciona durante o pico de matrículas?", a: "Sim. A IA atende conversas simultâneas sem criar fila e mantém cada família organizada no funil para a equipe acompanhar." },
    ],
  },
  assessorias: {
    heroFlow: ptSegmentHeroFlows.assessorias,
    socialProof: "+560 empresários veem a IA como chave para crescer",
    title: "Mais diagnósticos com fit,\nmenos reunião desperdiçada.",
    subtitle: "A IA responde o novo lead, aplica seu playbook e agenda o diagnóstico quando objetivo, momento e perfil fazem sentido para a assessoria.",
    highlightWords: ["diagnósticos", "reunião"],
    painHeadline: "Sem qualificação, [seu especialista vende para quem não tem fit].",
    painBody: "Cada reunião errada consome o tempo que deveria estar nas entregas ou no fechamento.",
    painBodyMobile: "Reunião sem fit custa caro.",
    howItWorksTitle: "Do anúncio ao [diagnóstico com contexto]",
    howItWorksCtaTitle: "Pronto para encher a agenda com [oportunidades que fazem sentido]?",
    comparisonTitle: "De reunião sem contexto para um [funil qualificado]",
    howItWorksCards: [
      { title: "Capture a origem", desc: "Cada empresário entra com campanha, serviço de interesse e histórico já identificados." },
      { title: "Responda enquanto está quente", desc: "A IA inicia a conversa em segundos sem interromper consultores que estão em entrega." },
      { title: "Aplique seu playbook", desc: "Perguntas sobre objetivo, estrutura e momento revelam se existe aderência à oferta." },
      { title: "Organize no CRM nativo", desc: "Contexto, respostas e próxima ação ficam visíveis para comercial e especialistas." },
      { title: "Agende o diagnóstico", desc: "Quem tem perfil escolhe um horário e chega à reunião com o contexto registrado." },
      { title: "Recupere oportunidades", desc: "O follow-up retoma decisores que demonstraram interesse e pararam de responder." },
    ],
    reviews: ptAdvisoryReviews,
    comparison: [
      { old: "Lead do anúncio espera o especialista sair de uma entrega.", new: "A IA responde e começa a qualificação em segundos." },
      { old: "O consultor entra na reunião sem saber objetivo ou estrutura.", new: "O diagnóstico começa com contexto e respostas do playbook." },
      { old: "A agenda enche com curiosos e empresas sem perfil.", new: "Só quem atende aos critérios avança para o especialista." },
      { old: "Follow-up para quando a operação fica ocupada.", new: "A IA retoma oportunidades sem depender da memória do time." },
      { old: "Marketing e consultores enxergam números diferentes.", new: "Origem, conversa e etapa ficam no mesmo funil comercial." },
    ],
    faqs: [
      { q: "Como a IA sabe se uma empresa tem fit?", a: "Ela segue os critérios e as perguntas do seu playbook, como objetivo, estrutura, urgência e capacidade de avançar. A regra continua sendo definida pela sua assessoria." },
      { q: "O especialista recebe o contexto antes do diagnóstico?", a: "Sim. As respostas, a origem do lead e o histórico da conversa ficam registrados no CRM antes da reunião." },
      { q: "A IA também faz follow-up?", a: "Sim. Ela retoma oportunidades nos intervalos definidos e interrompe a automação quando a pessoa responde ou quando sua equipe assume a conversa." },
    ],
  },
  advocacia: {
    heroFlow: ptSegmentHeroFlows.advocacia,
    socialProof: "+155 advogados relatam uso de IA no escritório",
    title: "Primeiro atendimento ágil,\nsem advogado no plantão.",
    subtitle: "A IA acolhe o novo contato, registra área e contexto informado e encaminha a conversa ao responsável, sem oferecer orientação jurídica.",
    highlightWords: ["atendimento", "advogado"],
    painHeadline: "Quando ninguém responde, [o potencial cliente procura outro escritório].",
    painBody: "Urgência, prazo e contexto não podem ficar perdidos em uma caixa de entrada.",
    painBodyMobile: "Urgência não pode esperar.",
    howItWorksTitle: "Do primeiro contato ao [advogado responsável]",
    howItWorksCtaTitle: "Pronto para organizar a entrada sem [sobrecarregar os advogados]?",
    comparisonTitle: "Da caixa de entrada para um [atendimento organizado]",
    howItWorksCards: [
      { title: "Acolha o novo contato", desc: "A IA confirma o recebimento e explica como funciona o primeiro atendimento do escritório." },
      { title: "Registre o contexto informado", desc: "Área, tipo de demanda e eventual prazo são organizados sem análise ou orientação jurídica." },
      { title: "Encaminhe por área", desc: "Contratos, trabalhista ou outra frente seguem para a equipe definida pelo escritório." },
      { title: "Organize no CRM nativo", desc: "Origem, histórico e responsável ficam registrados para evitar repasses sem contexto." },
      { title: "Agende a conversa", desc: "Quando aplicável, o contato escolhe um horário com o profissional responsável." },
      { title: "Retome quem aguarda", desc: "O funil mostra contatos pendentes e ajuda a evitar que conversas urgentes sejam esquecidas." },
    ],
    reviews: ptLegalReviews,
    comparison: [
      { old: "Novo contato fica sem resposta fora do expediente.", new: "O escritório confirma o recebimento e orienta o próximo passo." },
      { old: "Área, prazo e contexto ficam soltos no WhatsApp.", new: "As informações declaradas chegam organizadas ao responsável." },
      { old: "Advogados interrompem o trabalho para filtrar mensagens.", new: "A IA organiza a entrada antes do atendimento profissional." },
      { old: "O contato é repassado sem histórico entre as áreas.", new: "Conversa, origem e responsável ficam registrados no CRM." },
      { old: "Pendências dependem de lembretes individuais.", new: "O funil mostra quem aguarda retorno e qual é o próximo passo." },
    ],
    faqs: [
      { q: "A IA oferece orientação jurídica?", a: "Não. Ela acolhe o contato, registra apenas as informações declaradas e encaminha a conversa. Análise, estratégia e orientação jurídica permanecem com o advogado responsável." },
      { q: "Como o contato chega ao advogado certo?", a: "O escritório define regras de encaminhamento por área, unidade ou equipe. A IA organiza o contexto inicial e direciona a conversa conforme essas regras." },
      { q: "O advogado consegue assumir o atendimento?", a: "Sim. A equipe pode entrar na conversa quando necessário e recebe o histórico completo para continuar sem pedir que a pessoa repita tudo." },
    ],
  },
};

export const enSegmentCampaigns: SegmentCampaigns = {
  clinicas: {
    heroFlow: enSegmentHeroFlows.clinicas,
    socialProof: "+790 physicians already use AI",
    title: "More patients,\nfewer empty time slots.", subtitle: "AI answers on WhatsApp, understands initial interest, and directs each contact to your clinic's next step.", highlightWords: ["patients", "slots"], painHeadline: "When replies take too long, [the patient looks for another clinic].", painBody: "The first conversation decides whether interest reaches the schedule.", painBodyMobile: "Interest needs a reply.", reviews: enReviews,
    howItWorksCards: [{ title: "Capture interest", desc: "Every message or form arrives with the context your front desk needs." }, { title: "Answer on WhatsApp", desc: "AI answers initial questions quickly, even outside business hours." }, { title: "Understand intent", desc: "The conversation identifies the requested service without replacing your team's assessment." }, { title: "Organize in the native CRM", desc: "Every opportunity is recorded with history, stage, and next step." }, { title: "Book conversations", desc: "Interested contacts receive the right path to book with your team." }, { title: "Track funnel and metrics", desc: "See where contacts come from and where your operation can convert more." }],
    comparison: [{ old: "Patients wait for a reply and look for another clinic.", new: "The first contact receives a reply at the right time." }, { old: "The front desk switches between messages, calendars, and notes.", new: "Conversations and next steps stay organized in the CRM." }, { old: "Contacts reach the team with no context.", new: "The team receives the history before continuing service." }, { old: "Old opportunities get forgotten in WhatsApp.", new: "Follow-up helps resume conversations left open." }, { old: "It is unclear which channel produces bookings.", new: "The funnel shows each opportunity's path to the calendar." }],
  },
  escolas: {
    heroFlow: enSegmentHeroFlows.escolas,
    socialProof: "+250 school leaders already use AI",
    title: "More enrollments,\nfewer families waiting.", subtitle: "AI answers families on WhatsApp, presents next steps, and helps your team turn interest into a visit.", highlightWords: ["enrollments", "families"], painHeadline: "When a family waits, [they keep looking at other schools].", painBody: "Speed and context influence the enrollment decision.", painBodyMobile: "Families expect a reply.", reviews: enReviews,
    howItWorksCards: [{ title: "Capture interest", desc: "Every family enters with source and initial information organized." }, { title: "Answer on WhatsApp", desc: "AI answers the first contact in seconds, even during peak periods." }, { title: "Present the next steps", desc: "The conversation explains how to visit the school in your institution's voice." }, { title: "Organize in the native CRM", desc: "Every enrollment interest stays in the right stage without spreadsheets." }, { title: "Book visits", desc: "Interested families receive a clear path to schedule with your team." }, { title: "Track funnel and metrics", desc: "See channels, stages, and opportunities that need follow-up." }],
    comparison: [{ old: "Families wait and continue searching for another school.", new: "The first contact is answered as soon as it happens." }, { old: "Enrollment interests are scattered across messages.", new: "Every family stays organized in the same sales funnel." }, { old: "Visits depend on a manual reply to happen.", new: "The conversation directs interested families to a visit." }, { old: "The team misses the right moment to follow up.", new: "Follow-up keeps the conversation active until the next step." }, { old: "There is no clear view of enrollment sources.", new: "The funnel shows the path behind every enrollment." }],
  },
  assessorias: {
    heroFlow: enSegmentHeroFlows.assessorias,
    socialProof: "+560 business leaders see AI as key to growth",
    title: "Every contact answered,\nat the right time.", subtitle: "AI answers new contacts, understands sales context, and directs opportunities to the right conversation with your advisory firm.", highlightWords: ["contact", "time"], painHeadline: "When a contact goes cold, [the opportunity looks for another firm].", painBody: "First response time influences the next meeting.", painBodyMobile: "Timing decides opportunities.", reviews: enReviews,
    howItWorksCards: [{ title: "Capture context", desc: "Every new contact arrives with source and initial information organized." }, { title: "Answer on WhatsApp", desc: "AI starts the conversation immediately and follows your service standard." }, { title: "Qualify opportunities", desc: "Questions from your playbook help determine when it makes sense to advance." }, { title: "Organize in the native CRM", desc: "Conversations, data, and next steps stay together for your team." }, { title: "Book diagnostics", desc: "Qualified contacts receive the path to meet with a specialist." }, { title: "Track funnel and metrics", desc: "See where opportunities stand and which ones need another approach." }],
    comparison: [{ old: "New contacts wait until someone is available.", new: "The first reply happens without depending on team availability." }, { old: "Sales context gets lost between messages and spreadsheets.", new: "Every opportunity stays in the CRM with its history." }, { old: "Meetings are booked without understanding fit.", new: "The playbook guides the conversation before the diagnostic." }, { old: "Follow-up depends on memory and availability.", new: "The operation tracks who needs another conversation." }, { old: "The team cannot see each opportunity's progress.", new: "The funnel shows every contact's stage and next step." }],
  },
  advocacia: {
    heroFlow: enSegmentHeroFlows.advocacia,
    socialProof: "+155 attorneys report AI use in their firms",
    title: "Every contact answered,\nwith context from the start.", subtitle: "AI organizes the first WhatsApp interaction and directs each contact to the right conversation with your law firm.", highlightWords: ["contact", "context"], painHeadline: "When replies take too long, [the person looks for another firm].", painBody: "The first interaction needs to be fast, clear, and organized.", painBodyMobile: "The first contact matters.", reviews: enReviews,
    howItWorksCards: [{ title: "Receive new contacts", desc: "Every message reaches your team organized with source and conversation history." }, { title: "Answer on WhatsApp", desc: "AI welcomes the first contact quickly and in your firm's voice." }, { title: "Organize initial context", desc: "The conversation gathers initial information without replacing legal counsel." }, { title: "Distribute in the native CRM", desc: "Every contact stays in the right stage with visibility for the responsible team." }, { title: "Book the conversation", desc: "The contact receives a clear path to speak with the right professional." }, { title: "Track funnel and metrics", desc: "See active contacts and where the conversation needs to resume." }],
    comparison: [{ old: "New contacts wait and look for another law firm.", new: "The first interaction starts as soon as the message arrives." }, { old: "Initial information is scattered across conversations.", new: "Context and history stay organized for the team." }, { old: "The team finds out too late who is still waiting.", new: "The funnel shows every contact and required next step." }, { old: "The first interaction varies across team members.", new: "AI follows the standard defined by your firm." }, { old: "Open conversations depend on manual reminders.", new: "Follow-up helps resume conversations left open." }],
  },
};

export const esSegmentCampaigns: SegmentCampaigns = {
  clinicas: {
    heroFlow: esSegmentHeroFlows.clinicas,
    socialProof: "+790 médicos ya usan IA",
    title: "Más pacientes,\nmenos horarios vacíos.", subtitle: "La IA atiende en WhatsApp, entiende el interés inicial y dirige cada contacto al siguiente paso de tu clínica.", highlightWords: ["pacientes", "horarios"], painHeadline: "Cuando la respuesta demora, [el paciente busca otra clínica].", painBody: "La primera conversación decide si el interés llega a la agenda.", painBodyMobile: "El interés necesita respuesta.", reviews: esReviews,
    howItWorksCards: [{ title: "Captura el interés", desc: "Cada mensaje o formulario llega con el contexto que recepción necesita." }, { title: "Atiende en WhatsApp", desc: "La IA responde dudas iniciales con rapidez, incluso fuera del horario." }, { title: "Entiende la intención", desc: "La conversación identifica el servicio sin reemplazar la evaluación del equipo." }, { title: "Organiza en el CRM nativo", desc: "Cada oportunidad queda registrada con historial, etapa y próximo paso." }, { title: "Agenda conversaciones", desc: "Quien muestra interés recibe el camino correcto para agendar con tu equipo." }, { title: "Sigue el embudo y las métricas", desc: "Mira de dónde vienen los contactos y dónde puedes convertir más." }],
    comparison: [{ old: "El paciente espera y busca otra clínica.", new: "El primer contacto recibe respuesta en el momento correcto." }, { old: "Recepción alterna entre mensajes, agenda y notas.", new: "Conversaciones y próximos pasos quedan organizados en el CRM." }, { old: "Cada contacto llega sin contexto para el equipo.", new: "El equipo recibe el historial antes de continuar." }, { old: "Los intereses antiguos se olvidan en WhatsApp.", new: "El seguimiento retoma conversaciones abiertas." }, { old: "No está claro qué canal genera más citas.", new: "El embudo muestra el camino de cada oportunidad a la agenda." }],
  },
  escolas: {
    heroFlow: esSegmentHeroFlows.escolas,
    socialProof: "+250 líderes escolares ya usan IA",
    title: "Más matrículas,\nmenos familias esperando.", subtitle: "La IA atiende familias en WhatsApp, presenta los próximos pasos y ayuda a convertir interés en visitas.", highlightWords: ["matrículas", "familias"], painHeadline: "Cuando una familia espera, [sigue buscando otra escuela].", painBody: "Velocidad y contexto influyen en la decisión de matrícula.", painBodyMobile: "Las familias esperan respuesta.", reviews: esReviews,
    howItWorksCards: [{ title: "Captura el interés", desc: "Cada familia entra con origen e información inicial organizada." }, { title: "Atiende en WhatsApp", desc: "La IA responde el primer contacto en segundos, incluso en períodos de alta demanda." }, { title: "Presenta los próximos pasos", desc: "La conversación explica cómo conocer la escuela con el tono de tu institución." }, { title: "Organiza en el CRM nativo", desc: "Cada interés de matrícula queda en la etapa correcta, sin planillas." }, { title: "Agenda visitas", desc: "Las familias interesadas reciben un camino claro para agendar." }, { title: "Sigue el embudo y las métricas", desc: "Mira canales, etapas y oportunidades que necesitan seguimiento." }],
    comparison: [{ old: "La familia espera y busca otra escuela.", new: "El primer contacto se responde en cuanto sucede." }, { old: "Los intereses quedan dispersos en mensajes.", new: "Cada familia sigue organizada en el mismo embudo." }, { old: "Las visitas dependen de una respuesta manual.", new: "La conversación dirige a las familias interesadas a una visita." }, { old: "El equipo pierde el momento correcto para retomar.", new: "El seguimiento mantiene activa la conversación." }, { old: "No hay una visión clara del origen de las matrículas.", new: "El embudo muestra el camino de cada matrícula." }],
  },
  assessorias: {
    heroFlow: esSegmentHeroFlows.assessorias,
    socialProof: "+560 empresarios ven la IA como clave para crecer",
    title: "Cada contacto atendido,\nen el momento correcto.", subtitle: "La IA responde nuevos contactos, entiende el contexto comercial y dirige oportunidades a la conversación correcta con tu asesoría.", highlightWords: ["contacto", "momento"], painHeadline: "Cuando el contacto se enfría, [la oportunidad busca otra asesoría].", painBody: "El tiempo de la primera respuesta influye en la próxima reunión.", painBodyMobile: "El timing decide oportunidades.", reviews: esReviews,
    howItWorksCards: [{ title: "Captura el contexto", desc: "Cada nuevo contacto llega con origen e información inicial organizada." }, { title: "Atiende en WhatsApp", desc: "La IA inicia la conversación al instante y mantiene tu estándar." }, { title: "Califica oportunidades", desc: "Las preguntas de tu playbook ayudan a decidir cuándo avanzar." }, { title: "Organiza en el CRM nativo", desc: "Conversaciones, datos y próximos pasos quedan en un solo lugar." }, { title: "Agenda diagnósticos", desc: "Quien tiene perfil recibe el camino para conversar con un especialista." }, { title: "Sigue el embudo y las métricas", desc: "Mira dónde están las oportunidades y cuáles necesitan otra acción." }],
    comparison: [{ old: "El nuevo contacto espera hasta que alguien esté disponible.", new: "La primera respuesta no depende de la agenda del equipo." }, { old: "El contexto comercial se pierde entre mensajes y planillas.", new: "Cada oportunidad queda registrada en el CRM." }, { old: "Las reuniones se agendan sin entender el perfil.", new: "El playbook guía la conversación antes del diagnóstico." }, { old: "El seguimiento depende de memoria y disponibilidad.", new: "La operación acompaña a quien necesita otra conversación." }, { old: "El equipo no ve el avance de cada oportunidad.", new: "El embudo muestra etapa y próximo paso de cada contacto." }],
  },
  advocacia: {
    heroFlow: esSegmentHeroFlows.advocacia,
    socialProof: "+155 abogados informan que usan IA en su estudio",
    title: "Cada contacto respondido,\ncon contexto desde el inicio.", subtitle: "La IA organiza la primera atención en WhatsApp y dirige cada contacto a la conversación correcta con tu estudio.", highlightWords: ["contacto", "contexto"], painHeadline: "Cuando la respuesta demora, [la persona busca otro estudio].", painBody: "La primera atención debe ser rápida, clara y organizada.", painBodyMobile: "El primer contacto importa.", reviews: esReviews,
    howItWorksCards: [{ title: "Recibe nuevos contactos", desc: "Cada mensaje llega organizado con origen e historial de conversación." }, { title: "Atiende en WhatsApp", desc: "La IA recibe el primer contacto con rapidez y el tono de tu estudio." }, { title: "Organiza el contexto inicial", desc: "La conversación reúne información sin reemplazar la orientación jurídica." }, { title: "Distribuye en el CRM nativo", desc: "Cada contacto queda en la etapa correcta para el equipo responsable." }, { title: "Agenda la conversación", desc: "El contacto recibe un camino claro para hablar con el profesional adecuado." }, { title: "Sigue el embudo y las métricas", desc: "Mira los contactos activos y dónde retomar la conversación." }],
    comparison: [{ old: "El nuevo contacto espera y busca otro estudio.", new: "La primera atención comienza cuando llega el mensaje." }, { old: "La información inicial queda suelta en conversaciones.", new: "Contexto e historial quedan organizados para el equipo." }, { old: "El equipo descubre tarde quién espera respuesta.", new: "El embudo muestra cada contacto y el próximo paso." }, { old: "La primera atención cambia según la persona.", new: "La IA sigue el estándar definido por tu estudio." }, { old: "Las conversaciones abiertas dependen de recordatorios.", new: "El seguimiento ayuda a retomar contactos abiertos." }],
  },
};
