import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, phone, countryCode, volume, team, email, planName } = data;

    const fullPhone = `${countryCode || "+55"}${phone || ""}`.replace(/\D/g, "");

    // 1. Evo API (Evolution API) integration para WhatsApp
    // Dispara mensagem de confirmação
    const evoApiUrl = process.env.EVO_API_URL || "";
    const evoApiKey = process.env.EVO_API_KEY || "";
    const evoInstanceName = process.env.EVO_INSTANCE_NAME || "";
    let whatsappResponse = null;

    if (evoApiUrl && evoApiKey && evoInstanceName && fullPhone) {
      // Remove o '+' do início se houver (A Evo API utiliza o formato DDI+DDD+Numero)
      const cleanPhone = fullPhone.replace("+", "");
      const messagesToSend = [
        `Olá, ${name || "Empresa"}! Tudo bem? 👋`,
        `Me chamo *Igor* e sou *especialista da Tlin*, dedicado ao atendimento da sua solicitação`,
        `Para começarmos, me diz: como você prefere que eu te chame?`
      ];

      try {
        const baseUrl = evoApiUrl.endsWith('/') ? evoApiUrl.slice(0, -1) : evoApiUrl;
        const endpoint = `${baseUrl}/message/sendText/${evoInstanceName}`;
        
        const responses = [];

        console.log(`Iniciando envio sequencial via Evo API para: ${cleanPhone}...`);

        for (let i = 0; i < messagesToSend.length; i++) {
          const text = messagesToSend[i];
          // Delay aumenta ligeiramente para textos maiores, garantindo naturalidade
          const calculatedDelay = Math.max(1500, text.length * 40); 
          
          const payload = {
            number: cleanPhone,
            text: text,
            options: {
              delay: calculatedDelay,
              presence: "composing",
              linkPreview: false
            }
          };

          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              "apikey": evoApiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
          });
          
          const jsonResponse = await res.json();
          responses.push(jsonResponse);
          
          // Aguarda o término de um disparo antes do próximo para não encavalar
          // Embora a Evo API já coloque em fila, o delay aqui no Node previne problemas
        }
        
        whatsappResponse = responses;
        console.log("Mensagens sequenciais do WhatsApp enviadas com sucesso!");
      } catch (err: any) {
        console.error("Erro ao disparar WhatsApp sequencial via Evo API:", err);
      }
    } else {
      console.log("Aviso: Variáveis da Evo API não estão configuradas corretamente. Pulando disparo de WhatsApp.");
    }

    // 2. Envio de E-mail via Resend SMTP com credenciais fixadas no código
    // Desobriga a inserção de variáveis de ambiente no painel da Vercel para funcionar instantaneamente
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";
    let emailSent = false;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.resend.com",
        port: Number(process.env.SMTP_PORT || 465),
        secure: true,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const teamEmail = process.env.NOTIFICATION_EMAIL || "contato@tlin.cloud";
      
      const mailOptions = {
        from: `"Tlin" <${process.env.SMTP_FROM || "nao-responda@tlin.cloud"}>`,
        to: email || teamEmail,
        bcc: email ? teamEmail : undefined, // Garante que a equipe comercial também receba uma cópia em tempo real
        subject: `Bem-vindo à Tlin, ${name || "Empreendedor"}! 👋`,
        html: getWelcomeEmailHtml(name || "Empreendedor", planName || "TLIN")
      };

      try {
        console.log(`Tentando enviar e-mail via Resend SMTP direto pelo código para: ${mailOptions.to}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log("E-mail enviado com sucesso! Resposta SMTP:", info.response);
        emailSent = true;
      } catch (err) {
        console.error("Erro ao enviar e-mail via Nodemailer/Resend:", err);
      }
    } else {
      console.log("Aviso: Credenciais de envio ausentes. Pulando disparo de e-mail.");
    }

    return NextResponse.json({ 
      success: true, 
      whatsappTriggered: !!whatsappResponse, 
      whatsappResponse,
      emailSent 
    });

  } catch (error: any) {
    console.error("Erro no endpoint /api/notify:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Função utilitária que gera o HTML premium do e-mail de Boas-vindas
 * Totalmente convertido para o White Mode (fundo branco, texto escuro) para máxima legibilidade
 */
function getWelcomeEmailHtml(name: string, planName: string) {
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
              <a href="https://tlin.cloud" target="_blank" style="display: inline-block;">
                <img src="https://tlin.cloud/favicon.svg" alt="Tlin" width="24" style="display: block; margin: 0 auto; width: 24px; height: auto;" />
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
                  <img src="https://tlin.cloud/tlin-mascote-email.png?v=final12" alt="Tlin" width="28" style="display: block; width: 28px; height: auto; background: transparent;" />
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
                <td align="center" valign="middle" height="320" background="https://tlin.cloud/platform-preview-email.jpg?v=final12" style="background-image: url('https://tlin.cloud/platform-preview-email.jpg?v=final12'); background-size: cover; background-position: center; height: 320px; text-align: center;">
                  <!--[if gte mso 9]>
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:320px;">
                    <v:fill type="frame" src="https://tlin.cloud/platform-preview-email.jpg?v=final12" color="#fafafa" />
                    <v:textbox inset="0,0,0,0">
                  <![endif]-->
                  <div>
                    <a href="https://tlin.cloud#demo" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d0d; color: #ffffff; padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.2);">
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
                <a href="https://app.tlin.cloud" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #71717a; font-size: 14px; text-decoration: underline; font-weight: 500;">
                  Acessar plataforma Tlin →
                </a>
              </div>
            </div>
            
            <!-- Premium Footer -->
            <div style="border-top: 1px solid #e4e4e7; padding-top: 32px; text-align: center;">
              <div style="margin-bottom: 24px;">
                <a href="https://tlin.cloud" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #71717a; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
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

/**
 * Rota GET /api/notify
 * Permite visualizar o template de e-mail instantaneamente direto no navegador em http://localhost:3000/api/notify
 */
export async function GET() {
  const sampleHtml = getWelcomeEmailHtml("Empresa de Elite Tlin", "TLIN");
  
  return new NextResponse(sampleHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
