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

    // 2. Envio de E-mail gratuito via Nodemailer
    // Usando SMTP genérico configurável (Gmail, Webmail, etc.)
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    let emailSent = false;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const teamEmail = process.env.NOTIFICATION_EMAIL || (smtpUser === "resend" ? "contato@tlin.cloud" : smtpUser);
      
      const mailOptions = {
        from: `"Tlin" <${process.env.SMTP_FROM || (smtpUser === "resend" ? "nao-responda@tlin.cloud" : smtpUser)}>`,
        to: email || teamEmail,
        bcc: email ? teamEmail : undefined, // Garante que a equipe comercial também receba uma cópia em tempo real
        subject: `Bem-vindo à Tlin, ${name || "Empreendedor"}! 👋`,
        html: getWelcomeEmailHtml(name || "Empreendedor", planName || "TLIN")
      };

      try {
        console.log(`Tentando enviar e-mail via Resend SMTP para: ${mailOptions.to}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log("E-mail enviado com sucesso! Resposta SMTP:", info.response);
        emailSent = true;
      } catch (err) {
        console.error("Erro ao enviar e-mail via Nodemailer/Resend:", err);
      }
    } else {
      console.log("Aviso: Variáveis SMTP_USER ou SMTP_PASS não configuradas. Pulando envio de e-mail.");
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
  // Ano vigente baseado no fuso horário do Brasil
  const currentYear = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", year: "numeric" });
  return `
    <!-- Importação da fonte DM Sans via Google Fonts -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
    </style>
    <div style="background-color: #0c0d0d; color: #ffffff; font-family: 'DM Sans', sans-serif; width: 100%; max-width: 600px; box-sizing: border-box; margin: 0 auto; padding: 40px 24px; border: 1px solid #27272a; border-radius: 24px;">
      <!-- Logo / Brand Header em SVG (Versão Branca para Fundo Escuro) -->
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="${baseUrl}/Logo_Branco.svg" alt="Tlin" width="120" style="display: block; margin: 0 auto; max-width: 120px; height: auto;" />
      </div>
      
      <!-- Main Title -->
      <h2 style="font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 16px; line-height: 1.3;">
        Olá, <span style="color: #B597FF;">${name}</span>! Bem-vindo à Tlin 🚀
      </h2>
      
      <!-- Chat Message Component (Estilo Mensagem Recebida da Lia/Tlin AI alinhada à esquerda com max-width de ~75%) -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px;">
        <tr>
          <!-- Avatar da Tlin AI à esquerda -->
          <td width="32" valign="top" style="padding-right: 10px; padding-top: 2px;">
            <img src="${baseUrl}/TlinIA.svg" alt="Tlin" width="28" height="28" style="display: block; width: 28px; height: 28px;" />
          </td>
          <!-- Chat Bubble com Gradiente -->
          <td valign="top" align="left">
            <div style="background: linear-gradient(90deg, #B597FF 0%, #38E3FF 100%); background-color: #38E3FF; color: #0c0d0d; font-weight: 600; font-size: 15px; line-height: 1.5; padding: 16px 20px; border-radius: 0px 20px 20px 20px; display: inline-block; text-align: left;">
              Recebemos a sua solicitação com sucesso! Ficamos muito felizes pelo seu interesse em dar o próximo passo e escalar o faturamento da sua operação usando nossos agentes de Inteligência Artificial.
            </div>
          </td>
          <!-- Espaçador à direita para impedir que o balão ocupe a largura total -->
          <td width="20%" valign="top"></td>
        </tr>
      </table>
      
      <!-- Video Player Component (Apenas a Thumbnail com Botão Play Centralizado Sobreposto) -->
      <div style="margin-bottom: 32px; text-align: center;">
        <a href="https://tlin.cloud#demo" target="_blank" style="display: block; text-decoration: none; position: relative; border-radius: 16px; overflow: hidden; border: 1px solid #27272a; line-height: 0;">
          <!-- Thumbnail Image em 16:9 pura -->
          <img src="${baseUrl}/platform-preview.png" alt="Demonstração da Plataforma Tlin" style="width: 100%; max-width: 600px; height: auto; aspect-ratio: 16/9; object-fit: cover; display: block; opacity: 0.9;" />
          
          <!-- Botão sobreposto no centro da imagem (Com ícone idêntico ao Lucide Play da Hero) -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #ffffff; color: #0c0d0d; padding: 12px 24px; border-radius: 50px; border: 1px solid #e4e4e7; font-weight: 700; font-size: 14px; line-height: 1;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#0c0d0d" stroke="#0c0d0d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 6px; display: inline-block;"><polygon points="6 3 20 12 6 21 6 3"/></svg> Assistir demo
          </div>
        </a>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #e4e4e7; margin-bottom: 32px; text-align: center;">
        Nossos especialistas já estão analisando o seu perfil para preparar uma demonstração personalizada. Se quiser acelerar o seu atendimento agora mesmo, clique no botão abaixo:
      </p>
      
      <!-- Gorgeous CTA Button (Sem brilho externo/box-shadow) -->
      <div style="text-align: center; margin-bottom: 40px;">
        <a href="https://wa.me/5511916248604?text=${encodeURIComponent(`Olá! Recebi o e-mail de boas-vindas da Tlin e gostaria de falar com um consultor especialista 🚀`)}" target="_blank" style="background-color: #B597FF; background: linear-gradient(90deg, #B597FF 0%, #38E3FF 100%); color: #0c0d0d; font-weight: 800; font-size: 16px; text-decoration: none; padding: 18px 36px; border-radius: 50px; display: inline-block;">
          💬 Falar com Especialista de Vendas
        </a>
        <!-- Link adicional secundário conforme solicitado -->
        <div style="margin-top: 16px;">
          <a href="https://app.tlin.cloud" target="_blank" style="color: #a1a1aa; font-size: 14px; text-decoration: underline; font-weight: 500;">
            Acessar plataforma Tlin →
          </a>
        </div>
      </div>
      
      <!-- Premium Footer com Ícones Sociais em SVG -->
      <div style="border-top: 1px solid #27272a; padding-top: 32px; text-align: center;">
        <div style="margin-bottom: 24px;">
          <a href="https://tlin.cloud" target="_blank" title="Site Oficial" style="display: inline-block; margin: 0 16px; text-decoration: none;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          </a>
          <a href="https://instagram.com/tlin.aii" target="_blank" title="Instagram" style="display: inline-block; margin: 0 16px; text-decoration: none;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://linkedin.com/company/tlin" target="_blank" title="LinkedIn" style="display: inline-block; margin: 0 16px; text-decoration: none;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </div>
        <p style="font-size: 12px; color: #71717a; margin: 0; line-height: 1.5;">
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
