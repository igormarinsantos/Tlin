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
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
    </style>
    <!-- Outer Table Container garantindo Dark Mode absoluto em qualquer Webmail -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0c0d0d" style="background-color: #0c0d0d; width: 100%;">
      <tr>
        <td align="center" bgcolor="#0c0d0d" style="padding: 40px 16px; background-color: #0c0d0d;">
          
          <!-- Inner Content Box -->
          <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#0c0d0d" style="max-width: 600px; width: 100%; background-color: #0c0d0d; border: 1px solid #27272a; border-radius: 24px;">
            <tr>
              <td style="padding: 40px 24px;">
                
                <!-- Logo Header JPG/PNG Universal -->
                <div style="text-align: center; margin-bottom: 32px;">
                  <img src="https://tlin.cloud/web-app-manifest-512x512.png" alt="Tlin" width="64" height="64" style="display: block; margin: 0 auto; width: 64px; height: 64px; border-radius: 16px;" />
                </div>
                
                <!-- Main Title -->
                <h2 style="font-family: 'DM Sans', Arial, sans-serif; font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 20px 0; line-height: 1.3; text-align: left;">
                  Olá, <span style="color: #38E3FF;">${name}</span>! Bem-vindo à Tlin 🚀
                </h2>
                
                <!-- Chat Message Cell (Avatar Externo JPG em Tabela Inviolável) -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px; width: 100%;">
                  <tr>
                    <td width="44" valign="top" style="padding-right: 12px; padding-top: 2px; width: 44px;">
                      <img src="https://tlin.cloud/lia-perfil-email.jpg" alt="Lia" width="40" height="40" style="display: block; width: 40px; height: 40px; border-radius: 50%;" />
                    </td>
                    <td valign="top" align="left">
                      <!-- Tabela interna base do balão com Cores Absolutas Declaradas -->
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#18181b" style="background-color: #18181b; width: 100%; border: 1px solid #27272a; border-left: 4px solid #38E3FF; border-radius: 8px 20px 20px 20px;">
                        <tr>
                          <td style="padding: 16px 20px; font-family: 'DM Sans', Arial, sans-serif; font-size: 15px; line-height: 1.5; color: #ffffff; font-weight: 500; text-align: left;">
                            Recebemos a sua solicitação com sucesso! Ficamos muito felizes pelo seu interesse em dar o próximo passo e escalar o faturamento da sua operação usando nossos agentes de Inteligência Artificial.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                <!-- Video Media Card JPG Universal -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#18181b" style="margin-bottom: 32px; width: 100%; background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td align="center" style="line-height: 0; font-size: 0; padding: 0;">
                      <a href="https://tlin.cloud#demo" target="_blank" style="display: block;">
                        <img src="https://tlin.cloud/platform-preview-email.jpg" alt="Plataforma Tlin" width="600" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0;" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 16px; background-color: #ffffff;">
                      <a href="https://tlin.cloud#demo" target="_blank" style="font-family: 'DM Sans', Arial, sans-serif; font-size: 15px; font-weight: 700; color: #0c0d0d; text-decoration: none; display: block;">
                        ▶&nbsp;&nbsp;Assistir demonstração
                      </a>
                    </td>
                  </tr>
                </table>
                
                <p style="font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #e4e4e7; margin: 0 0 32px 0; text-align: center;">
                  Nossos especialistas já estão analisando o seu perfil para preparar uma demonstração personalizada. Se quiser acelerar o seu atendimento agora mesmo, clique no botão abaixo:
                </p>
                
                <!-- Bulletproof CTA Button -->
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 24px; margin-left: auto; margin-right: auto;">
                  <tr>
                    <td align="center" bgcolor="#7c3aed" style="background-color: #7c3aed; border-radius: 50px;">
                      <a href="https://wa.me/5511916248604?text=${encodeURIComponent(`Olá! Recebi o e-mail de boas-vindas da Tlin e gostaria de falar com um consultor especialista 🚀`)}" target="_blank" style="font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; display: inline-block;">
                        💬&nbsp;&nbsp;Falar com Especialista de Vendas
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Link Secundário -->
                <div style="text-align: center; margin-bottom: 40px;">
                  <a href="https://app.tlin.cloud" target="_blank" style="font-family: 'DM Sans', Arial, sans-serif; color: #a1a1aa; font-size: 14px; text-decoration: underline; font-weight: 500;">
                    Acessar plataforma Tlin →
                  </a>
                </div>
                
                <!-- Premium Footer -->
                <div style="border-top: 1px solid #27272a; padding-top: 32px; text-align: center;">
                  <div style="margin-bottom: 24px;">
                    <a href="https://tlin.cloud" target="_blank" style="font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: #a1a1aa; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
                      🌐 Site Oficial
                    </a>
                    <a href="https://instagram.com/tlin.aii" target="_blank" style="font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: #a1a1aa; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
                      📸 Instagram
                    </a>
                    <a href="https://linkedin.com/company/tlin" target="_blank" style="font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: #a1a1aa; text-decoration: none; margin: 0 12px; font-weight: 500; display: inline-block;">
                      💼 LinkedIn
                    </a>
                  </div>
                  <p style="font-family: 'DM Sans', Arial, sans-serif; font-size: 12px; color: #71717a; margin: 0; line-height: 1.5;">
                    © ${currentYear} Tlin. Todos os direitos reservados.
                  </p>
                </div>
                
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>
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
