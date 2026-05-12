import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, phone, countryCode, volume, team, pain, planName } = data;

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
        secure: true,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"Tlin IA" <${smtpUser}>`,
        to: process.env.NOTIFICATION_EMAIL || smtpUser, // envia para a equipe ou pro cliente
        subject: `Novo Lead Qualificado: ${name || "Empresa"} - Plano ${planName || "TLIN"}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px;">
            <h2 style="color: #0c0d0d; margin-bottom: 16px;">Novo Lead Capturado e Qualificado 🚀</h2>
            <p style="color: #52525b; font-size: 15px;">Um novo contato acabou de preencher a qualificação na plataforma Tlin.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="border-bottom: 1px solid #f4f4f5;">
                <td style="padding: 10px 0; font-weight: bold; color: #71717a; width: 140px;">Empresa:</td>
                <td style="padding: 10px 0; color: #0c0d0d; font-weight: bold;">${name || "-"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f5;">
                <td style="padding: 10px 0; font-weight: bold; color: #71717a;">Plano de Interesse:</td>
                <td style="padding: 10px 0; color: #b597ff; font-weight: bold;">${planName || "TLIN"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f5;">
                <td style="padding: 10px 0; font-weight: bold; color: #71717a;">WhatsApp:</td>
                <td style="padding: 10px 0; color: #0c0d0d;">${countryCode || ""}${phone || "-"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f5;">
                <td style="padding: 10px 0; font-weight: bold; color: #71717a;">Volume Mensal:</td>
                <td style="padding: 10px 0; color: #0c0d0d;">${volume || "-"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f5;">
                <td style="padding: 10px 0; font-weight: bold; color: #71717a;">Tamanho da Equipe:</td>
                <td style="padding: 10px 0; color: #0c0d0d;">${team || "-"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #71717a;">Principal Dor:</td>
                <td style="padding: 10px 0; color: #0ea5e9; font-weight: bold;">${pain || "-"}</td>
              </tr>
            </table>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #a1a1aa; text-align: center;">
              Enviado automaticamente pelo sistema de Notificações Tlin AI.
            </div>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (err) {
        console.error("Erro ao enviar e-mail via Nodemailer:", err);
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
