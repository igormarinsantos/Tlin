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
  // Ano vigente baseado no fuso horário do Brasil
  const currentYear = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", year: "numeric" });
  return `
    <!-- Importação da fonte DM Sans via Google Fonts com múltiplas estratégias para clientes de e-mail -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
    </style>
    <div style="background-color: #0c0d0d; color: #ffffff; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; box-sizing: border-box; margin: 0 auto; padding: 40px 24px; border: 1px solid #27272a; border-radius: 24px;">
      <!-- Logo / Brand Header em SVG Puro Injetado Diretamente no Código (Imune a quebra de imagens em Webmails) -->
      <div style="text-align: center; margin-bottom: 32px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 802.8 290" width="120" height="43" style="display: block; margin: 0 auto;">
          <g fill="#ffffff">
            <path d="M353.9,231.3c-6.3,0-11.9-1-16.7-3-4.8-2-8.6-5.3-11.3-10-2.7-4.7-4-11.1-4-19.2v-38.9h-15.8v-20.5h15.8l2.7-25.1h21.8v25.1h24.2v20.5h-24.2v39.3c0,4.1.9,7,2.7,8.5,1.8,1.6,4.9,2.4,9.3,2.4h11.8v20.9h-16.4Z"/>
            <path d="M393.2,231.3V100.4h24.5v130.8h-24.5Z"/>
            <path d="M456.4,127.1c-4.5,0-8.1-1.3-10.9-3.9-2.8-2.6-4.2-5.9-4.2-9.9s1.4-7.3,4.2-9.9c2.8-2.6,6.4-3.9,10.9-3.9s8.1,1.3,11,3.9c2.8,2.6,4.3,5.9,4.3,9.9s-1.4,7.3-4.3,9.9c-2.8,2.6-6.5,3.9-11,3.9ZM444.1,231.3v-91.6h24.5v91.6h-24.5Z"/>
            <path d="M495.1,231.3v-91.6h21.6l1.6,15.1c2.9-5.3,6.9-9.5,12.1-12.6,5.1-3.1,11.3-4.6,18.4-4.6s14.1,1.6,19.3,4.8c5.2,3.2,9.2,7.8,12,13.9,2.8,6.1,4.2,13.4,4.2,22.2v52.9h-24.5v-50.7c0-7.1-1.6-12.7-4.7-16.5-3.2-3.9-7.9-5.8-14.4-5.8s-7.6,1-10.8,2.9c-3.2,1.9-5.7,4.7-7.5,8.3-1.8,3.6-2.7,8-2.7,13.2v48.7h-24.5Z"/>
            <path d="M620.2,232.2c-4.6,0-8.3-1.4-11.1-4.1-2.8-2.7-4.2-6.1-4.2-10.1s1.4-7.4,4.2-10.1c2.8-2.7,6.5-4.1,11.1-4.1s8,1.4,10.8,4.1c2.8,2.7,4.3,6.1,4.3,10.1s-1.4,7.4-4.3,10.1c-2.8,2.7-6.5,4.1-10.8,4.1Z"/>
            <path d="M687.6,233.5c-7.5,0-13.8-1.2-18.7-3.7-5-2.5-8.7-5.8-11.2-10-2.5-4.2-3.7-8.8-3.7-13.9s1.4-10.7,4.3-14.9c2.8-4.2,7.2-7.5,13-9.9,5.8-2.4,13.2-3.5,22.2-3.5h22.4c0-4.6-.6-8.4-1.7-11.3-1.2-2.9-3-5.1-5.6-6.5-2.6-1.5-6-2.2-10.3-2.2s-8.5,1-11.7,2.9c-3.2,1.9-5.2,5-5.9,9.3h-23.8c.6-6.7,2.8-12.4,6.5-17.1,3.7-4.7,8.6-8.4,14.7-11.1,6.1-2.7,12.9-4,20.4-4s16.1,1.4,22.4,4.3c6.4,2.8,11.2,7,14.5,12.5,3.3,5.5,5,20.1v56.9h-20.5l-2.7-14c-1.3,2.4-2.9,4.6-4.8,6.5-1.9,1.9-4.1,3.6-6.5,5.1-2.5,1.5-5.2,2.6-8.1,3.4-2.9.8-6.2,1.2-10,1.2ZM693.6,214.6c3,0,5.8-.6,8.3-1.7,2.5-1.1,4.6-2.8,6.5-4.8,1.8-2.1,3.3-4.4,4.4-6.9,1.1-2.5,1.8-5.3,2.2-8.4v-.2h-18.7c-3.9,0-7,.5-9.4,1.4-2.4.9-4.1,2.2-5.2,3.9-1.1,1.7-1.6,3.6-1.6,5.8s.5,4.3,1.6,5.9c1.1,1.6,2.7,2.9,4.8,3.7,2.1.8,4.5,1.3,7.2,1.3Z"/>
            <path d="M777.9,127.1c-4.5,0-8.1-1.3-10.9-3.9-2.8-2.6-4.2-5.9-4.2-9.9s1.4-7.3,4.2-9.9c2.8-2.6,6.4-3.9,10.9-3.9s8.1,1.3,11,3.9c2.8,2.6,4.3,5.9,4.3,9.9s-1.4,7.3-4.3,9.9c-2.8,2.6-6.5,3.9-11,3.9ZM765.6,231.3v-91.6h24.5v91.6h-24.5Z"/>
          </g>
          <path fill="#38e3ff" d="M252.5,190.5c0,1.3-.3,4.5-.4,7.1-.1,2.6-.3,5.4-.4,6.1,0,.8-.2,2.5-.3,4,0,1.4-.2,3.3-.3,4.1,0,.8-.2,2.7-.4,4.3s-.3,3.3-.4,3.8c0,.5-.3,2-.4,3.3-.2,2.6-.8,7.5-.9,8.2,0,.2-.2,1.5-.4,2.7-.8,5.6-1.7,11-1.8,11.4,0,.1-.2.9-.3,1.7-.5,3.1-1.9,9.7-2.7,12.5-.5,1.8-1.6,5-1.9,5.4,0,0-.2.5-.4.8-.1.4-.5,1.1-.8,1.6-.3.5-.6.9-.6,1s-.3.5-.6.9c-.3.4-.7,1-.8,1.2-.4.6-2.2,2.6-3.5,3.7-1.1,1-1.7,1.5-2.9,2.2-.3.2-.6.4-.7.5-.4.4-4.7,2.4-6,2.8-.5.2-1.1.4-1.6.6-.4.2-2.8.8-5.6,1.4-1.2.3-2.5.6-2.8.7-.7.2-5.3,1.1-8.8,1.7-3.2.6-8.8,1.4-12.8,2-1.1.2-2.8.4-3.7.5-3.4.5-13.4,1.4-20.2,2-5.3.4-6.6.5-9.9.6-2,0-4.7.2-6.1.3-11.2.6-43.5.6-54.9,0-1.4,0-4.2-.2-6.1-.3-2,0-4.5-.2-5.6-.3-7.3-.5-8.8-.7-10.3-.8-.9,0-3.1-.3-4.9-.5-5-.5-12.9-1.4-14.9-1.7-.5,0-1.7-.3-2.6-.4-2.4-.4-6.3-1-8.3-1.3-3.5-.6-8.1-1.6-8.8-1.7-.3,0-1.6-.4-2.8-.7-2.8-.6-5.2-1.2-5.6-1.4-.2,0-.6-.2-1-.3-1.9-.6-6.2-2.6-6.9-3.2-.1-.1-.3-.2-.3-.2s-.4-.2-.7-.4c-.3-.2-.8-.6-1-.7-1.4-1-4-3.7-4.9-5-.2-.3-.6-.9-.9-1.3-.3-.4-.9-1.5-1.4-2.5-1.8-3.5-2.5-5.6-4-12.6-.4-2-1.1-5.2-1.3-6.8-.1-.7-.4-1.9-.5-2.6-.6-3.1-1.1-6.5-1.6-10-.1-1-.3-2.5-.5-3.3-.3-1.6-.6-4.1-1-7.9-.1-1.2-.3-2.7-.4-3.4,0-.7-.3-2.6-.4-4.1-.1-1.6-.3-3.4-.4-4.1-.1-1.1-.4-4.8-.8-10.3,0-1.1-.2-3.6-.3-5.5,0-1.9-.3-4.5-.3-5.7-.2-3-.5-11.7-.6-21.4-.1-7.8,0-22,.4-28.7.4-9,1.2-21.7,1.6-24.7,0-.8.3-2.7.4-4.3.1-1.6.3-3.1.3-3.4,0-.3.2-1.9.4-3.4.3-3.2.7-6.4,1.3-10.7.6-4.5,1.6-10.7,1.8-11.6,0-.3.2-1.1.3-1.7.1-.7.3-1.7.4-2.2.1-.6.4-1.6.5-2.3.8-4.2,2-9.2,2.3-9.9,0-.2.3-.9.6-1.6,1.6-4.5,4.7-9.1,8.1-11.9,3.6-2.9,8.2-5.2,12.9-6.3,0,0,.8-.2,1.7-.4.8-.2,2.1-.5,2.8-.7,2.5-.6,7-1.5,9.6-2,.7-.1,1.9-.3,2.6-.5.7-.1,1.8-.3,2.4-.4.6,0,1.7-.3,2.5-.4,3.5-.6,12-1.7,17.6-2.2,1.4-.1,3.2-.3,4.1-.4,3.5-.3,8.4-.7,13-1,9.8-.6,15.1-.9,22.4-1,12.1-.3,31.6-.2,42.2.3,5.5.2,15.4.8,18.9,1.1,1,0,2.8.2,3.8.3,1,0,2.6.2,3.5.3.9,0,2.7.3,4,.4,4.7.5,7,.7,7.5.8.3,0,1.6.2,2.9.4,6.5.8,16.5,2.5,19.6,3.2.7.2,1.4.3,2.1.5,2.5.5,3.7.8,4.3.9.9.2,1.7.4,2.5.6,4.9,1.2,8.8,2.9,12.2,5.5,1.7,1.3,4.6,4.3,5.8,6,.5.8,1.1,1.6,1.1,1.7.4.6,2.2,4.5,2.6,5.7.1.4.3.8.3,1,.2.4.7,2.4,1.1,4.5.2.8.5,2.1.6,2.9,1.2,5.6,2.7,13.9,3.5,19.9.2,1.3.3,2.6.4,2.8.1.5.6,4.7,1,8.5.2,1.6.3,3,.4,3.3,0,.2.2,1.6.3,3.2.1,1.5.3,3.1.3,3.4,0,.3.2,2.5.4,4.9.2,2.3.4,5.1.5,6.3,0,1.1.2,3.6.3,5.5,0,1.9.2,4.5.3,5.9.7,11.9.7,42.3,0,53.8Z"/>
          <path fill="#38e3ff" opacity="0.5" d="M231.5,186c0,1.1-.2,3.8-.3,6-.1,2.2-.3,4.5-.3,5.1,0,.6-.2,2.1-.3,3.3,0,1.2-.2,2.7-.3,3.4,0,.6-.2,2.3-.3,3.6s-.3,2.7-.3,3.2c0,.4-.2,1.7-.3,2.7-.2,2.1-.7,6.2-.8,6.8,0,.2-.2,1.2-.3,2.2-.7,4.6-1.4,9.2-1.5,9.5,0,.1-.2.7-.3,1.4-.4,2.6-1.6,8.1-2.2,10.4-.4,1.5-1.3,4.1-1.6,4.5,0,0-.2.4-.3.7-.1.3-.4.9-.7,1.3-.3.4-.5.8-.5.8s-.2.4-.5.8c-.3.4-.6.8-.7,1-.4.5-1.8,2.1-2.9,3.1-.9.9-1.4,1.2-2.5,1.9-.2.1-.5.3-.6.4-.3.3-3.9,2-5,2.4-.4.2-.9.3-1.3.5-.4.2-2.3.7-4.6,1.2-1,.2-2.1.5-2.3.6-.6.2-4.4.9-7.3,1.5-2.7.5-7.3,1.2-10.7,1.6-.9.1-2.3.3-3.1.4-2.8.4-11.2,1.2-16.8,1.6-4.4.3-5.5.4-8.3.5-1.6,0-3.9.2-5.1.3-9.3.5-36.3.5-45.7,0-1.2,0-3.5-.2-5.1-.3-1.6,0-3.7-.2-4.6-.3-6.1-.4-7.4-.5-8.6-.7-.8,0-2.6-.3-4.1-.4-4.2-.4-10.8-1.2-12.4-1.4-.4,0-1.4-.2-2.2-.3-2-.3-5.3-.8-7-1.1-2.9-.5-6.7-1.3-7.4-1.5-.3,0-1.3-.3-2.3-.6-2.3-.5-4.3-1-4.6-1.2-.1,0-.5-.2-.8-.3-1.6-.5-5.2-2.2-5.7-2.7-.1-.1-.2-.2-.3-.2s-.3-.2-.6-.4c-.3-.2-.6-.5-.8-.6-1.2-.9-3.4-3.1-4.1-4.2-.2-.3-.5-.7-.7-1.1-.2-.3-.8-1.3-1.2-2-1.5-2.9-2.1-4.6-3.3-10.5-.4-1.7-.9-4.3-1.1-5.6-.1-.6-.3-1.6-.4-2.2-.5-2.6-.9-5.4-1.3-8.3-.1-.8-.3-2.1-.4-2.8-.2-1.4-.5-3.4-.8-6.6,0-1-.3-2.3-.3-2.9,0-.6-.2-2.1-.3-3.4-.1-1.3-.3-2.8-.3-3.4-.1-1-.4-4-.7-8.5,0-.9-.2-3-.3-4.6,0-1.6-.2-3.7-.3-4.8-.2-2.5-.4-9.7-.5-17.8,0-6.5,0-18.4.3-23.9.3-7.5,1-18.1,1.3-20.5,0-.7.2-2.3.4-3.6.1-1.3.2-2.6.3-2.8,0-.3.2-1.5.3-2.9.3-2.7.6-5.3,1.1-8.9.5-3.8,1.3-8.9,1.5-9.7,0-.3.2-.9.3-1.5,0-.5.2-1.4.3-1.9.1-.5.3-1.3.4-1.9.7-3.5,1.7-7.7,1.9-8.2,0-.2.3-.7.5-1.3,1.3-3.8,3.9-7.6,6.8-9.9,3-2.4,6.8-4.3,10.7-5.2,0,0,.7-.2,1.4-.3.7-.2,1.7-.4,2.3-.6,2.1-.5,5.8-1.3,8-1.6.6,0,1.6-.3,2.2-.4.6-.1,1.5-.3,2-.3.5,0,1.4-.2,2-.3,3-.5,10-1.4,14.7-1.9,1.1-.1,2.7-.3,3.4-.3,2.9-.3,7-.6,10.8-.8,8.2-.5,12.6-.7,18.7-.9,10.1-.3,26.4-.1,35.2.3,4.6.2,12.8.7,15.8.9.9,0,2.3.2,3.2.3.9,0,2.2.2,2.9.3.7,0,2.2.2,3.3.3,3.9.4,5.8.6,6.2.7.2,0,1.3.2,2.4.3,5.4.7,13.7,2,16.3,2.7.6.1,1.2.3,1.8.4,2.1.4,3.1.6,3.6.8.7.2,1.4.4,2.1.5,4.1,1,7.3,2.4,10.2,4.5,1.4,1.1,3.9,3.6,4.8,5,.5.7.9,1.3.9,1.4.4.5,1.8,3.8,2.1,4.8,0,.3.2.6.3.8.1.3.6,2,1,3.7.2.6.4,1.7.5,2.4,1,4.7,2.2,11.6,2.9,16.6.1,1.1.3,2.1.3,2.3,0,.4.5,3.9.9,7.1.1,1.3.3,2.5.3,2.7,0,.2.2,1.4.3,2.7.1,1.3.2,2.6.3,2.8,0,.3.2,2.1.3,4,.2,1.9.3,4.3.4,5.2,0,.9.2,3-.3,4.6,0,1.6.2,3.8.3,4.9.6,9.9.6,35.2,0,44.9Z"/>
          <path fill="#211B33" d="M210.5,181.5c0,.9-.2,3-.3,4.8,0,1.8-.2,3.6-.3,4.1,0,.5-.2,1.7-.2,2.7,0,1-.2,2.2-.2,2.7,0,.5-.2,1.8-.3,2.9s-.2,2.2-.3,2.5c0,.4-.2,1.3-.3,2.2-.2,1.7-.5,5-.6,5.5,0,.2-.2,1-.3,1.8-.5,3.7-1.1,7.3-1.2,7.6,0,0-.1.6-.2,1.1-.3,2.1-1.3,6.4-1.8,8.3-.3,1.2-1.1,3.3-1.3,3.6,0,0-.1.3-.3.6,0,.3-.3.7-.5,1-.2.3-.4.6-.4.7s-.2.3-.4.6c-.2.3-.5.6-.6.8-.3.4-1.5,1.7-2.3,2.5-.8.7-1.1,1-2,1.5-.2.1-.4.3-.5.3-.2.2-3.1,1.6-4,1.9-.4.1-.7.2-1.1.4-.3.1-1.9.5-3.7.9-.8.2-1.7.4-1.9.4-.5.1-3.6.7-5.9,1.2-2.1.4-5.8,1-8.5,1.3-.7.1-1.8.2-2.5.3-2.3.3-8.9,1-13.5,1.3-3.5.3-4.4.3-6.6.4-1.3,0-3.1.1-4.1.2-7.4.4-29,.4-36.6,0-.9,0-2.8-.2-4.1-.2-1.3,0-3-.2-3.7-.2-4.9-.4-5.9-.4-6.9-.5-.6,0-2.1-.2-3.3-.3-3.3-.3-8.6-.9-9.9-1.2-.4,0-1.1-.2-1.8-.3-1.6-.2-4.2-.6-5.6-.9-2.3-.4-5.4-1-5.9-1.2-.2,0-1-.3-1.9-.4-1.9-.4-3.4-.8-3.7-.9-.1,0-.4-.2-.6-.2-1.3-.4-4.2-1.8-4.6-2.2,0,0-.2-.2-.2-.2s-.3-.1-.5-.3c-.2-.2-.5-.4-.7-.5-1-.7-2.7-2.4-3.3-3.3-.1-.2-.4-.6-.6-.8-.2-.3-.6-1-.9-1.6-1.2-2.3-1.6-3.7-2.7-8.4-.3-1.3-.7-3.4-.9-4.5,0-.5-.2-1.3-.3-1.7-.4-2.1-.8-4.3-1.1-6.7,0-.6-.2-1.6-.3-2.2-.2-1.1-.4-2.7-.6-5.2,0-.8-.2-1.8-.3-2.3,0-.5-.2-1.7-.3-2.8,0-1-.2-2.3-.3-2.7,0-.8-.3-3.2-.5-6.8,0-.7-.1-2.4-.2-3.7,0-1.3-.2-3-.2-3.8-.2-2-.3-7.8-.4-14.3,0-5.2,0-14.7.3-19.1.3-6,.8-14.5,1-16.4,0-.5.2-1.8.3-2.9,0-1,.2-2.1.2-2.3,0-.2.1-1.2.3-2.3.2-2.1.5-4.2.9-7.2.4-3,1.1-7.1,1.2-7.7,0-.2.1-.7.2-1.2,0-.4.2-1.1.3-1.5,0-.4.2-1.1.3-1.5.6-2.8,1.3-6.2,1.5-6.6,0-.1.2-.6.4-1.1,1-3,3.1-6,5.4-7.9,2.4-1.9,5.5-3.4,8.6-4.2,0,0,.6-.1,1.1-.3.6-.1,1.4-.3,1.9-.4,1.7-.4,4.7-1,6.4-1.3.5,0,1.3-.2,1.7-.3.5,0,1.2-.2,1.6-.3.4,0,1.1-.2,1.6-.3,2.4-.4,8-1.1,11.8-1.5.9,0,2.1-.2,2.7-.3,2.3-.2,5.6-.5,8.6-.7,6.5-.4,10.1-.6,14.9-.7,8.1-.2,21.1-.1,28.1.2,3.7.2,10.2.5,12.6.7.7,0,1.8.2,2.5.2.7,0,1.7.2,2.3.2.6,0,1.8.2,2.7.3,3.1.3,4.7.5,5,.5.2,0,1,.2,1.9.3,4.3.6,11,1.6,13,2.1.5.1,1,.2,1.4.3,1.7.3,2.5.5,2.9.6.6.1,1.1.3,1.7.4,3.3.8,5.8,2,8.1,3.6,1.2.8,3.1,2.9,3.8,4,.4.6.7,1,.7,1.1.3.4,1.5,3,1.7,3.8,0,.2.2.5.2.6.1.2.5,1.6.8,3,.1.5.3,1.4.4,1.9.8,3.8,1.8,9.3,2.3,13.3.1.9.2,1.7.3,1.9,0,.3.4,3.1.7,5.7.1,1,.2,2,.3,2.2,0,.2.1,1.1.2,2.1,0,1,.2,2,.2,2.3,0,.2.2,1.7.3,3.2.1,1.5.3,3.4.3,4.2,0,.7.1,2.4.2,3.7,0,1.3.2,3-.2,3.9.5,8,.5,28.2,0,35.9Z"/>
          <circle fill="#b597ff" cx="210.9" cy="58.1" r="58.1" opacity="0.2"/>
          <circle fill="#b597ff" cx="210.9" cy="58.1" r="46.9" opacity="0.5"/>
          <circle fill="#b597ff" cx="210.9" cy="58.1" r="35.7"/>
        </svg>
      </div>
      
      <!-- Main Title -->
      <h2 style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 16px; line-height: 1.3;">
        Olá, <span style="color: #B597FF;">${name}</span>! Bem-vindo à Tlin 🚀
      </h2>
      
      <!-- Chat Message Component (Estilo Mensagem Recebida da Lia/Tlin AI alinhada à esquerda com max-width de ~75%) -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px;">
        <tr>
          <!-- Avatar da Tlin AI Injetado Diretamente via SVG Puro (À prova de proxies e bloqueios) -->
          <td width="32" valign="top" style="padding-right: 10px; padding-top: 2px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 506.26 506.16" width="28" height="28" style="display: block;">
              <path fill="#38e3ff" d="M454.76,296.36c-.16,2.07-.41,7.25-.64,11.44-.21,4.21-.48,8.61-.64,9.8-.14,1.21-.36,4.05-.52,6.37-.14,2.31-.38,5.21-.53,6.49-.12,1.24-.4,4.35-.6,6.87-.21,2.52-.48,5.28-.64,6.11-.16,.85-.43,3.19-.64,5.23-.4,4.12-1.31,11.94-1.52,13.11-.09,.4-.36,2.36-.64,4.31-1.28,8.9-2.67,17.63-2.9,18.2-.09,.21-.31,1.4-.52,2.67-.81,4.97-3.05,15.48-4.24,19.93-.76,2.86-2.55,7.94-3.04,8.58-.1,.12-.35,.76-.6,1.35-.22,.6-.81,1.74-1.29,2.5s-.9,1.47-.9,1.57-.43,.74-.97,1.45c-.52,.69-1.12,1.55-1.35,1.92-.69,1.04-3.52,4.09-5.56,5.95-1.81,1.64-2.73,2.35-4.71,3.59-.43,.26-.93,.64-1.12,.81-.57,.57-7.51,3.85-9.59,4.54-.85,.29-1.69,.59-2.54,.9-.69,.29-4.5,1.26-8.9,2.26-1.97,.45-3.99,.93-4.47,1.07-1.16,.29-8.54,1.78-14.11,2.8-5.09,.93-14.01,2.29-20.5,3.12-1.76,.24-4.42,.59-5.97,.83-5.44,.76-21.45,2.31-32.34,3.14-8.49,.64-10.49,.78-15.91,1.04-3.16,.14-7.56,.35-9.8,.5-17.86,1.04-69.67,1.04-87.81,0-2.24-.12-6.64-.36-9.8-.5-3.16-.16-7.14-.4-8.9-.52-11.72-.85-14.15-1.05-16.55-1.29-1.47-.16-5-.48-7.89-.76-7.99-.78-20.72-2.24-23.79-2.78-.85-.16-2.73-.43-4.21-.64-3.92-.57-10.15-1.55-13.36-2.14-5.57-1.02-12.96-2.5-14.13-2.8-.48-.14-2.48-.62-4.45-1.07-4.5-1.02-8.25-1.97-8.9-2.26-.28-.14-.97-.36-1.54-.53-3-.9-9.99-4.23-10.99-5.19-.21-.21-.45-.4-.55-.4-.14,0-.62-.29-1.12-.71-.48-.38-1.23-.91-1.6-1.19-2.29-1.64-6.44-5.87-7.9-8.02-.33-.48-.97-1.4-1.4-2.04-.45-.64-1.47-2.42-2.26-3.93-2.88-5.54-3.95-8.89-6.38-20.12-.71-3.21-1.71-8.26-2.14-10.82-.22-1.19-.57-3.07-.76-4.19-.95-4.99-1.81-10.44-2.55-16.03-.21-1.55-.55-3.95-.76-5.35-.41-2.62-.9-6.57-1.54-12.6-.19-1.9-.48-4.37-.62-5.5-.14-1.14-.43-4.12-.64-6.63-.21-2.48-.52-5.47-.64-6.59-.22-1.83-.69-7.61-1.28-16.41-.12-1.76-.33-5.69-.48-8.78-.16-3.07-.41-7.2-.53-9.16-.36-4.83-.74-18.7-.91-34.23-.17-12.44,.16-35.29,.66-45.93,.66-14.39,1.98-34.79,2.52-39.46,.16-1.28,.47-4.35,.67-6.87,.22-2.52,.45-4.99,.53-5.47,.05-.5,.33-2.97,.6-5.49,.55-5.12,1.19-10.2,2.16-17.17,1-7.21,2.55-17.13,2.93-18.58,.12-.48,.33-1.76,.48-2.8,.19-1.05,.47-2.66,.66-3.57,.21-.91,.57-2.57,.78-3.69,1.35-6.66,3.23-14.8,3.66-15.77,.12-.29,.53-1.43,.95-2.55,2.48-7.23,7.45-14.51,12.99-19.01,5.71-4.66,13.11-8.25,20.57-10.02,.16-.02,1.35-.31,2.67-.6,1.33-.31,3.33-.79,4.45-1.07,4.05-.97,11.2-2.42,15.41-3.14,1.19-.19,3.07-.55,4.19-.76,1.12-.21,2.85-.5,3.83-.64,.98-.16,2.74-.43,3.93-.64,5.68-.97,19.17-2.67,28.25-3.55,2.17-.21,5.09-.48,6.51-.64,5.57-.55,13.48-1.19,20.74-1.62,15.67-.97,24.23-1.38,35.89-1.66,19.39-.48,50.64-.26,67.57,.48,8.77,.38,24.59,1.29,30.3,1.78,1.67,.12,4.42,.36,6.11,.48,1.67,.16,4.19,.38,5.59,.53,1.4,.12,4.28,.43,6.37,.64,7.51,.74,11.2,1.12,11.96,1.28,.43,.09,2.5,.38,4.59,.62,10.4,1.33,26.38,3.93,31.3,5.12,1.14,.26,2.29,.5,3.43,.74,4.05,.83,5.94,1.24,6.87,1.52,1.36,.35,2.73,.69,4.07,1.02,7.9,1.93,14.01,4.69,19.5,8.73,2.78,2.04,7.42,6.88,9.21,9.59,.88,1.33,1.69,2.52,1.79,2.67,.71,1,3.54,7.28,4.09,9.16,.17,.57,.41,1.24,.53,1.54,.28,.59,1.12,3.87,1.83,7.13,.29,1.24,.74,3.3,1.02,4.57,1.98,9.04,4.3,22.31,5.56,31.82,.28,2.09,.55,4.12,.64,4.49,.17,.79,.98,7.51,1.66,13.58,.28,2.52,.55,4.87,.62,5.23,.09,.36,.31,2.64,.52,5.09,.21,2.43,.43,4.92,.5,5.47,.09,.55,.36,4.05,.64,7.76,.29,3.71,.62,8.21,.78,10.06,.12,1.79,.35,5.76,.5,8.78,.16,3,.38,7.25,.52,9.4,1.14,19.1,1.14,67.66,0,86.17l-.02-.02Z"/>
              <path fill="#38e3ff" opacity="0.5" d="M505.17,307.17c-.19,2.59-.52,9.06-.8,14.3-.26,5.26-.6,10.76-.8,12.25-.17,1.51-.45,5.07-.65,7.96-.17,2.89-.47,6.51-.67,8.11-.15,1.55-.5,5.44-.75,8.58s-.6,6.6-.8,7.64c-.19,1.06-.54,3.99-.8,6.54-.5,5.15-1.64,14.93-1.9,16.39-.11,.5-.45,2.95-.8,5.39-1.6,11.13-3.34,22.04-3.62,22.75-.11,.26-.39,1.75-.65,3.34-1.01,6.21-3.82,19.35-5.31,24.91-.95,3.58-3.19,9.92-3.8,10.72-.13,.15-.43,.95-.75,1.68-.28,.75-1.01,2.18-1.62,3.13-.6,.95-1.12,1.83-1.12,1.96s-.54,.93-1.21,1.81c-.65,.86-1.4,1.94-1.68,2.39-.86,1.29-4.4,5.11-6.94,7.44-2.26,2.05-3.41,2.93-5.89,4.49-.54,.32-1.16,.8-1.4,1.01-.71,.71-9.38,4.81-11.99,5.67-1.06,.37-2.11,.73-3.17,1.12-.86,.37-5.63,1.57-11.13,2.83-2.46,.56-4.98,1.16-5.59,1.34-1.45,.37-10.68,2.22-17.64,3.49-6.36,1.16-17.51,2.87-25.62,3.9-2.2,.3-5.52,.73-7.46,1.04-6.79,.95-26.81,2.89-40.42,3.93-10.61,.8-13.11,.97-19.89,1.29-3.95,.17-9.45,.43-12.25,.63-22.32,1.29-87.09,1.29-109.76,0-2.8-.15-8.3-.45-12.25-.63-3.95-.19-8.93-.5-11.13-.65-14.64-1.06-17.69-1.32-20.68-1.62-1.83-.19-6.25-.6-9.86-.95-9.99-.97-25.9-2.8-29.74-3.47-1.06-.19-3.41-.54-5.26-.8-4.9-.71-12.68-1.94-16.69-2.67-6.97-1.27-16.2-3.13-17.66-3.49-.6-.17-3.11-.78-5.56-1.34-5.63-1.27-10.31-2.46-11.13-2.83-.35-.17-1.21-.45-1.92-.67-3.75-1.12-12.49-5.28-13.74-6.49-.26-.26-.56-.5-.69-.5-.17,0-.78-.37-1.4-.88-.6-.47-1.53-1.14-2.01-1.49-2.87-2.05-8.04-7.33-9.88-10.03-.41-.6-1.21-1.75-1.75-2.55-.56-.8-1.83-3.02-2.83-4.92-3.6-6.92-4.94-11.11-7.98-25.15-.88-4.01-2.14-10.33-2.67-13.52-.28-1.49-.71-3.84-.95-5.24-1.19-6.23-2.26-13.05-3.19-20.04-.26-1.94-.69-4.94-.95-6.69-.52-3.28-1.12-8.22-1.92-15.74-.24-2.37-.6-5.46-.78-6.88-.17-1.42-.54-5.15-.8-8.28-.26-3.11-.65-6.84-.8-8.24-.28-2.29-.86-9.51-1.6-20.51-.15-2.2-.41-7.12-.6-10.98-.19-3.84-.52-8.99-.67-11.45-.45-6.04-.93-23.38-1.14-42.79-.22-15.55,.19-44.11,.82-57.41,.82-17.99,2.48-43.48,3.15-49.33,.19-1.6,.58-5.44,.84-8.58,.28-3.15,.56-6.23,.67-6.84,.06-.63,.41-3.71,.75-6.86,.69-6.41,1.49-12.75,2.7-21.46,1.25-9.02,3.19-21.42,3.67-23.23,.15-.6,.41-2.2,.6-3.49,.24-1.32,.58-3.32,.82-4.46,.26-1.14,.71-3.21,.97-4.62,1.68-8.33,4.03-18.51,4.57-19.71,.15-.37,.67-1.79,1.19-3.19,3.11-9.04,9.32-18.14,16.24-23.77,7.14-5.82,16.39-10.31,25.71-12.53,.19-.02,1.68-.39,3.34-.75,1.66-.39,4.16-.99,5.56-1.34,5.07-1.21,14-3.02,19.26-3.93,1.49-.24,3.84-.69,5.24-.95,1.4-.26,3.56-.63,4.79-.8,1.23-.19,3.43-.54,4.92-.8,7.1-1.21,23.96-3.34,35.31-4.44,2.72-.26,6.36-.6,8.13-.8,6.97-.69,16.84-1.49,25.93-2.03,19.58-1.21,30.28-1.73,44.86-2.07C244.34-.28,283.4,0,304.56,.92c10.96,.47,30.73,1.62,37.87,2.22,2.09,.15,5.52,.45,7.64,.6,2.09,.19,5.24,.47,6.99,.67,1.75,.15,5.35,.54,7.96,.8,9.38,.93,14,1.4,14.95,1.6,.54,.11,3.13,.47,5.74,.78,13.01,1.66,32.98,4.92,39.12,6.41,1.42,.32,2.87,.63,4.29,.93,5.07,1.04,7.42,1.55,8.58,1.9,1.7,.43,3.41,.86,5.09,1.27,9.88,2.42,17.51,5.87,24.37,10.91,3.47,2.55,9.27,8.61,11.52,11.99,1.1,1.66,2.11,3.15,2.24,3.34,.88,1.25,4.42,9.1,5.11,11.45,.22,.71,.52,1.55,.67,1.92,.35,.73,1.4,4.83,2.29,8.91,.37,1.55,.93,4.12,1.27,5.72,2.48,11.3,5.37,27.89,6.95,39.77,.35,2.61,.69,5.15,.8,5.61,.22,.99,1.23,9.38,2.07,16.97,.35,3.15,.69,6.08,.78,6.54,.11,.45,.39,3.3,.65,6.36,.26,3.04,.54,6.15,.63,6.84,.11,.69,.45,5.07,.8,9.71,.37,4.64,.78,10.27,.97,12.57,.15,2.24,.43,7.2,.63,10.98,.19,3.75,.47,9.06,.65,11.75,1.42,23.88,1.42,84.57,0,107.71l-.02,.02Z"/>
              <rect fill="#000505" x="219.44" y="151.15" width="67.99" height="104.61" rx="34" ry="34"/>
              <rect fill="#000505" x="330.75" y="151.15" width="67.99" height="104.61" rx="34" ry="34"/>
            </svg>
          </td>
          <!-- Chat Bubble com Gradiente -->
          <td valign="top" align="left">
            <div style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(90deg, #B597FF 0%, #38E3FF 100%); background-color: #38E3FF; color: #0c0d0d; font-weight: 600; font-size: 15px; line-height: 1.5; padding: 16px 20px; border-radius: 0px 20px 20px 20px; display: inline-block; text-align: left;">
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
          <!-- Thumbnail Image com link absoluto inviolável hospedado direto no edge de produção -->
          <img src="https://tlin.cloud/platform-preview.png" alt="Demonstração da Plataforma Tlin" style="width: 100%; max-width: 600px; height: auto; aspect-ratio: 16/9; object-fit: cover; display: block; opacity: 0.9;" />
          
          <!-- Botão sobreposto no centro da imagem (Com ícone idêntico ao Lucide Play da Hero) -->
          <div style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #ffffff; color: #0c0d0d; padding: 12px 24px; border-radius: 50px; border: 1px solid #e4e4e7; font-weight: 700; font-size: 14px; line-height: 1;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#0c0d0d" stroke="#0c0d0d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 6px; display: inline-block;"><polygon points="6 3 20 12 6 21 6 3"/></svg> Assistir demo
          </div>
        </a>
      </div>
      
      <p style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #e4e4e7; margin-bottom: 32px; text-align: center;">
        Nossos especialistas já estão analisando o seu perfil para preparar uma demonstração personalizada. Se quiser acelerar o seu atendimento agora mesmo, clique no botão abaixo:
      </p>
      
      <!-- Gorgeous CTA Button (Sem brilho externo/box-shadow) -->
      <div style="text-align: center; margin-bottom: 40px;">
        <a href="https://wa.me/5511916248604?text=${encodeURIComponent(`Olá! Recebi o e-mail de boas-vindas da Tlin e gostaria de falar com um consultor especialista 🚀`)}" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #B597FF; background: linear-gradient(90deg, #B597FF 0%, #38E3FF 100%); color: #0c0d0d; font-weight: 800; font-size: 16px; text-decoration: none; padding: 18px 36px; border-radius: 50px; display: inline-block;">
          💬 Falar com Especialista de Vendas
        </a>
        <!-- Link adicional secundário conforme solicitado -->
        <div style="margin-top: 16px;">
          <a href="https://app.tlin.cloud" target="_blank" style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #a1a1aa; font-size: 14px; text-decoration: underline; font-weight: 500;">
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
