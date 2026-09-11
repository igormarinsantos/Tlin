export function escapeHtml(value: unknown) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatAttributionValue(value: unknown) {
  const text = String(value || "").trim();
  return text || "nao informado";
}

export function getLeadNotificationHtml(lead: Record<string, any>) {
  const utm = lead.utm || {};
  const fullPhone = `${lead.countryCode || "+55"} ${lead.phone || ""}`.trim();
  const cleanPhone = String(`${lead.countryCode || "+55"}${lead.phone || ""}`).replace(/\D/g, "");
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/5511916248604";

  const rows = [
    ["Nome", lead.name],
    ["WhatsApp", fullPhone],
    ["E-mail", lead.email],
    ["Plano", lead.planName],
    ["Volume de leads", lead.volume],
    ["Equipe", lead.team],
    ["Lead score", lead.lead_score ? `${lead.lead_score}/100` : ""],
    ["Qualidade do lead", lead.lead_quality],
    ["Google Analytics Client ID", utm.client_id],
    ["Origem atual", `${formatAttributionValue(utm.last_utm_source)} / ${formatAttributionValue(utm.last_utm_medium)}`],
    ["Campanha atual", utm.last_utm_campaign],
    ["Termo atual", utm.last_utm_term],
    ["Conteudo atual", utm.last_utm_content],
    ["Pagina de entrada atual", utm.last_landing_page],
    ["Pagina atual", utm.last_current_page],
    ["Referencia atual", utm.last_referrer],
    ["Dominio de referencia atual", utm.last_referrer_host],
    ["Primeira origem", `${formatAttributionValue(utm.first_utm_source)} / ${formatAttributionValue(utm.first_utm_medium)}`],
    ["Primeira campanha", utm.first_utm_campaign],
    ["Primeira pagina de entrada", utm.first_landing_page],
    ["Primeira referencia", utm.first_referrer],
    ["Primeiro dominio de referencia", utm.first_referrer_host],
  ];

  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #52525b; font-size: 13px;">${escapeHtml(label)}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 700;">${escapeHtml(formatAttributionValue(value))}</td>
    </tr>
  `).join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #111827;">
      <h1 style="font-size: 22px; margin: 0 0 8px;">Novo lead qualificado Tlin</h1>
      <p style="margin: 0 0 20px; color: #52525b;">Este lead confirmou os dados na landing page. A origem abaixo veio escondida da URL/cookies de UTM.</p>
      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
        ${tableRows}
      </table>
      <p style="margin: 22px 0 0;">
        <a href="${escapeHtml(whatsappUrl)}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 700;">Abrir WhatsApp do lead</a>
      </p>
    </div>
  `;
}

/**
 * Função utilitária que gera o HTML premium do e-mail de Boas-vindas
 * Totalmente convertido para o White Mode (fundo branco, texto escuro) para máxima legibilidade
 */
export function getWelcomeEmailHtml(name: string, planName: string) {
  const currentYear = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", year: "numeric" });
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
      :root {
        color-scheme: light dark;
        supported-color-schemes: light dark;
      }
    </style>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff; width: 100%;">
      <tr>
        <td align="center" style="padding: 20px 12px; background-color: #ffffff;">
          <div style="background-color: #ffffff; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; box-sizing: border-box; margin: 0 auto; padding: 40px 24px; border: 1px solid #e4e4e7; border-radius: 24px;">
            <!-- Isotipo Tlin Centralizado Pequeno como Header -->
            <div style="text-align: center; margin-bottom: 24px; line-height: 0;">
              <a href="https://tlin.ia.br" target="_blank" style="display: inline-block;">
                <img src="https://tlin.ia.br/favicon.svg" alt="Tlin" width="24" style="display: block; margin: 0 auto; width: 24px; height: auto;" />
              </a>
            </div>
            
            <!-- Main Title Limpo em Preto -->
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; color: #0c0d0d; margin: 0; line-height: 1.3;">
                Olá, <span style="color: #9333ea;">${name}</span>! <br/>Bem-vindo à Tlin 🚀
              </h2>
            </div>
            
            <!-- Seção Principal de Conteúdo -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px;">
              <tr>
                <!-- Tlin IA Mascote PNG Fundo Transparente Sem Moldura -->
                <td width="32" valign="top" style="padding-right: 10px; padding-top: 2px;">
                  <img src="https://tlin.ia.br/email/tlin-mascote-email.png?v=final12" alt="Tlin" width="28" style="display: block; width: 28px; height: auto; background: transparent;" />
                </td>
                <!-- Chat Bubble com Fundo em Degradê da Marca e Texto Escuro de Alto Contraste -->
                <td valign="top" align="left">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse: separate; border-radius: 0px 20px 20px 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(181,151,255,0.15);">
                    <tr>
                      <td bgcolor="#D5C2FF" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #B597FF 0%, #38E3FF 100%); background-color: #D5C2FF; color: #0c0d0d; font-weight: 700; font-size: 15px; line-height: 1.6; padding: 18px 22px; border-radius: 0px 20px 20px 20px; text-align: left; border: none;">
                        Recebemos a sua solicitação com sucesso! Ficamos muito felizes pelo seu interesse em dar o próximo passo e escalar o faturamento da sua operação usando nossos agentes de Inteligência Artificial.
                      </td>
                    </tr>
                  </table>
                </td>
                <!-- Espaçador à direita para impedir que o balão ocupe a largura total -->
                <td width="20%" valign="top"></td>
              </tr>
            </table>
            
            <!-- Video Player Component com CTA Sobreposto ao Centro da Thumb -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; border-radius: 16px; overflow: hidden; border: 1px solid #e4e4e7;">
              <tr>
                <td align="center" valign="middle" height="320" background="https://tlin.ia.br/og/platform-preview-email.jpg?v=final12" style="background-image: url('https://tlin.ia.br/og/platform-preview-email.jpg?v=final12'); background-size: cover; background-position: center; height: 320px; text-align: center;">
                  <!--[if gte mso 9]>
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:320px;">
                    <v:fill type="frame" src="https://tlin.ia.br/og/platform-preview-email.jpg?v=final12" color="#fafafa" />
                    <v:textbox inset="0,0,0,0">
                  <![endif]-->
                  <div>
                    <a href="https://tlin.ia.br/demo" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d0d; color: #ffffff; padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.2);">
                      ▶&nbsp;&nbsp;Assistir demo
                    </a>
                  </div>
                  <!--[if gte mso 9]>
                    </v:textbox>
                  </v:rect>
                  <![endif]-->
                </td>
              </tr>
            </table>
      
            <!-- Descrição Limpa -->
            <div style="text-align: center; margin-bottom: 32px;">
              <p style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #3f3f46; margin: 0;">
                Nossos especialistas já estão analisando o seu perfil para preparar uma demonstração personalizada. Se quiser acelerar o seu atendimento agora mesmo, clique no botão abaixo:
              </p>
            </div>
      
            <!-- Gorgeous CTA Button -->
            <div style="text-align: center; margin-bottom: 40px;">
              <a href="https://wa.me/5511916248604?text=${encodeURIComponent(`Olá! Recebi o e-mail de boas-vindas da Tlin e gostaria de falar com um consultor especialista 🚀`)}" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d0d; color: #ffffff; font-weight: 800; font-size: 16px; text-decoration: none; padding: 18px 36px; border-radius: 50px; display: inline-block;">
                💬 Falar com Especialista de Vendas
              </a>
              <!-- Link adicional secundário -->
              <div style="margin-top: 16px;">
                <a href="https://app.tlin.ia.br" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #71717a; font-size: 14px; text-decoration: underline; font-weight: 500;">
                  Acessar plataforma Tlin →
                </a>
              </div>
            </div>
            
            <!-- Premium Footer -->
            <div style="border-top: 1px solid #e4e4e7; padding-top: 32px; text-align: center;">
              <div style="margin-bottom: 24px;">
                <a href="https://tlin.ia.br" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #71717a; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
                  🌐 Site Oficial
                </a>
                <a href="https://instagram.com/tlin.aii" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #71717a; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
                  📸 Instagram
                </a>
                <a href="https://linkedin.com/company/tlin" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #71717a; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
                  💼 LinkedIn
                </a>
              </div>
              <p style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #a1a1aa; margin: 0; line-height: 1.5;">
                © ${currentYear} Tlin. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  `;
}
