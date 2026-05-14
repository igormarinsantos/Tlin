export type TermEntry = {
  id: string;
  title: string;
  category: string;
  definition: string;
};

export const ENCYCLOPEDIA_DATA: TermEntry[] = [
  // Termos de Uso
  {
    id: "aceitacao",
    title: "Aceitação e Vigência",
    category: "Termos de Uso",
    definition: "Condições sob as quais o acesso e uso da plataforma Tlin.ai estabelecem um contrato legal vinculativo e imediato entre a contratante e os nossos serviços de automação."
  },
  {
    id: "licenca",
    title: "Licença de Uso da IA",
    category: "Termos de Uso",
    definition: "Concessão de direito de uso limitado, revogável, não exclusivo e intransferível para implantação de agentes inteligentes e fluxos automatizados na infraestrutura Tlin."
  },
  {
    id: "responsabilidade",
    title: "Limitação de Responsabilidade",
    category: "Termos de Uso",
    definition: "Diretrizes sobre a autonomia operacional dos agentes de IA. A contratante retém a responsabilidade primária sobre a aprovação e a adequação da comunicação gerada para seus clientes finais."
  },
  {
    id: "propriedade",
    title: "Propriedade Tecnológica",
    category: "Termos de Uso",
    definition: "Pertencimento exclusivo e integral de todos os códigos-fonte, algoritmos estruturais, prompts de sistema, pesos otimizados e interfaces visuais à marca Tlin.ai."
  },

  // Privacidade e LGPD
  {
    id: "dados-agentes",
    title: "Agentes e Dados Pessoais",
    category: "Privacidade e LGPD",
    definition: "Processamento e isolamento estrito de informações inseridas por leads e clientes durante as etapas de qualificação no widget de chat ou atendimento via WhatsApp."
  },
  {
    id: "base-legal",
    title: "Base Legal de Tratamento",
    category: "Privacidade e LGPD",
    definition: "Apoio normativo fundamentado primariamente na execução de contrato preliminar e no legítimo interesse da operação comercial para automação inteligente de vendas."
  },
  {
    id: "seguranca",
    title: "Criptografia e Armazenamento",
    category: "Privacidade e LGPD",
    definition: "Aplicação de camadas avançadas de segurança em trânsito e em repouso, garantindo que o contexto conversacional de cada cliente opere em silos totalmente protegidos."
  },
  {
    id: "direitos",
    title: "Direitos do Titular",
    category: "Privacidade e LGPD",
    definition: "Canais diretos e simplificados para que os usuários finais solicitem a portabilidade, retificação, anonimização ou exclusão definitiva de seus históricos de conversa."
  },

  // Cookies
  {
    id: "cookies-analiticos",
    title: "Cookies Analíticos",
    category: "Política de Cookies",
    definition: "Mapeamento estatístico anônimo focado no entendimento de tráfego, taxa de rejeição e engajamento nas seções da página, visando a otimização contínua de conversão."
  },
  {
    id: "cookies-sessao",
    title: "Cookies de Sessão",
    category: "Política de Cookies",
    definition: "Armazenamento local estritamente necessário para manter a persistência de estado do formulário de qualificação de leads, permitindo o retorno ao ponto exato de parada."
  },
  {
    id: "revogacao",
    title: "Gerenciamento e Revogação",
    category: "Política de Cookies",
    definition: "Autonomia assegurada ao visitante para limpar o cache local ou ajustar as permissões de rastreamento diretamente através das configurações padrão de seu navegador."
  },

  // Glossário Técnico Tlin
  {
    id: "afk-mascot",
    title: "AFK Mascot",
    category: "Glossário de IA",
    definition: "Comportamento autônomo do assistente virtual Tlin que entra em estado de patrulha na interface quando o usuário não está interagindo ativamente com o mouse."
  },
  {
    id: "handoff",
    title: "Handoff Inteligente",
    category: "Glossário de IA",
    definition: "Protocolo de roteamento imediato que transfere todo o sumário e o histórico da qualificação feita pela IA diretamente para a equipe humana de fechamento no WhatsApp."
  },
  {
    id: "prompt-sdr",
    title: "Prompt de SDR",
    category: "Glossário de IA",
    definition: "Arquitetura de instruções de alto nível injetada no modelo cognitivo para conduzir o lead com foco absoluto em destravamento e escalabilidade de faturamento."
  },
  {
    id: "vortex",
    title: "Vortex Abduction",
    category: "Glossário de IA",
    definition: "Efeito visual imersivo e de alta fidelidade ativado na seção hero para reter a atenção e simbolizar a atração gravitacional de novos negócios gerados pela plataforma."
  }
];
