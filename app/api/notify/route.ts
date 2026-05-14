import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, phone, countryCode, volume, team, email, planName } = data;

    const fullPhone = `${countryCode || "+55"}${phone || ""}`.replace(/\D/g, "");

    // 1. WhatsApp Official API integration (Cloud API)
    // Dispara mensagem template
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    let whatsappResponse = null;

    if (token && phoneId && fullPhone) {
      const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "lead_qualification";
      
      const payload = {
        messaging_product: "whatsapp",
        to: fullPhone,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: "pt_BR"
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: name || "Cliente" },
                { type: "text", text: planName || "TLIN" }
              ]
            }
          ]
        }
      };

      try {
        const res = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload)
        });
        whatsappResponse = await res.json();
      } catch (err: any) {
        console.error("Erro ao disparar WhatsApp API Oficial:", err);
      }
    } else {
      console.log("Aviso: Variáveis WHATSAPP_API_TOKEN ou WHATSAPP_PHONE_NUMBER_ID não configuradas. Pulando disparo oficial.");
    }

    // 2. Envio de E-mail via Resend SMTP com credenciais fixadas no código
    // Desobriga a inserção de variáveis de ambiente no painel da Vercel para funcionar instantaneamente
    const smtpUser = process.env.SMTP_USER || "resend";
    const smtpPass = process.env.SMTP_PASS || "re_8VppHXFD_6u7HhuUvymwWCPDKDmHcBTuV";
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
 * Reutilizada tanto no disparo real (POST) quanto na visualização de testes (GET)
 */
function getWelcomeEmailHtml(name: string, planName: string) {
  const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://tlin.cloud";
  const currentYear = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", year: "numeric" });
  return `
    <!-- Importação da fonte DM Sans via Google Fonts com múltiplas estratégias para clientes de e-mail -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
    </style>
    <div style="background-color: #0c0d0d; color: #ffffff; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; box-sizing: border-box; margin: 0 auto; padding: 40px 24px; border: 1px solid #27272a; border-radius: 24px;">
      <!-- Logo Header Horizontal Universal em PNG Estático -->
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="https://tlin.cloud/logo-horizontal-email.png" alt="Tlin" width="160" style="display: block; margin: 0 auto; max-width: 160px; height: auto;" />
      </div>
      
      <!-- Main Title -->
      <h2 style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 800; color: #ffffff; margin-top: 0; margin-bottom: 24px; line-height: 1.3;">
        Olá, <span style="color: #38E3FF;">${name}</span>! Bem-vindo à Tlin 🚀
      </h2>
      
      <!-- Seção Principal de Conteúdo -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px;">
        <tr>
          <!-- Avatar da Tlin AI Injetado em JPG Universal à prova de bloqueio -->
          <td width="32" valign="top" style="padding-right: 10px; padding-top: 2px;">
            <img src="https://tlin.cloud/lia-perfil-email.jpg" alt="Lia" width="28" height="28" style="display: block; width: 28px; height: 28px; border-radius: 50%; background-color: #38e3ff;" />
          </td>
          <!-- Chat Bubble com Gradiente Deslumbrante Original -->
          <td valign="top" align="left">
            <div style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(90deg, #B597FF 0%, #38E3FF 100%); background-color: #38E3FF; color: #0c0d0d; font-weight: 600; font-size: 15px; line-height: 1.5; padding: 16px 20px; border-radius: 0px 20px 20px 20px; display: inline-block; text-align: left;">
              Recebemos a sua solicitação com sucesso! Ficamos muito felizes pelo seu interesse em dar o próximo passo e escalar o faturamento da sua operação usando nossos agentes de Inteligência Artificial.
            </div>
          </td>
          <!-- Espaçador à direita para impedir que o balão ocupe a largura total -->
          <td width="20%" valign="top"></td>
        </tr>
      </table>
      
      <!-- Video Player Component (Controle Centralizado como Painel Inferior Inquebrável) -->
      <div style="margin-bottom: 32px; text-align: center; background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden;">
        <a href="https://tlin.cloud#demo" target="_blank" style="display: block; text-decoration: none; line-height: 0;">
          <img src="https://tlin.cloud/platform-preview-email.jpg" alt="Demonstração da Plataforma Tlin" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; opacity: 0.95;" />
        </a>
        <div style="padding: 16px; text-align: center; background-color: #18181b;">
          <a href="https://tlin.cloud#demo" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #0c0d0d; padding: 12px 28px; border-radius: 50px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; text-align: center;">
            ▶&nbsp;&nbsp;Assistir demo
          </a>
        </div>
      </div>
      
      <p style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #e4e4e7; margin-bottom: 32px; text-align: center;">
        Nossos especialistas já estão analisando o seu perfil para preparar uma demonstração personalizada. Se quiser acelerar o seu atendimento agora mesmo, clique no botão abaixo:
      </p>
      
      <!-- Gorgeous CTA Button Original Deslumbrante -->
      <div style="text-align: center; margin-bottom: 40px;">
        <a href="https://wa.me/5511916248604?text=${encodeURIComponent(`Olá! Recebi o e-mail de boas-vindas da Tlin e gostaria de falar com um consultor especialista 🚀`)}" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #B597FF; background: linear-gradient(90deg, #B597FF 0%, #38E3FF 100%); color: #0c0d0d; font-weight: 800; font-size: 16px; text-decoration: none; padding: 18px 36px; border-radius: 50px; display: inline-block;">
          💬 Falar com Especialista de Vendas
        </a>
        <!-- Link adicional secundário -->
        <div style="margin-top: 16px;">
          <a href="https://app.tlin.cloud" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #a1a1aa; font-size: 14px; text-decoration: underline; font-weight: 500;">
            Acessar plataforma Tlin →
          </a>
        </div>
      </div>
      
      <!-- Premium Footer com Badges Universais -->
      <div style="border-top: 1px solid #27272a; padding-top: 32px; text-align: center;">
        <div style="margin-bottom: 24px;">
          <a href="https://tlin.cloud" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #a1a1aa; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
            🌐 Site Oficial
          </a>
          <a href="https://instagram.com/tlin.aii" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #a1a1aa; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
            📸 Instagram
          </a>
          <a href="https://linkedin.com/company/tlin" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #a1a1aa; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
            💼 LinkedIn
          </a>
        </div>
        <p style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #71717a; margin: 0; line-height: 1.5;">
          © ${currentYear} Tlin. Todos os direitos reservados.
        </p>
      </div>
    </div>
  `;
}

/**
 * Rota GET /api/notify
 * Permite visualizar o template de e-mail instantaneamente direto no navegador
 * Excelente para testar e refinar o design sem precisar disparar e-mails reais!
 */
export async function GET() {
  const sampleHtml = getWelcomeEmailHtml("Empresa de Elite Tlin", "TLIN");
  
  return new NextResponse(sampleHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
