import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveLeadSubmission, updateLeadSubmissionNotification } from "@/lib/supabase-leads";
import { bookAppointment, searchContactByPhone, type DeskcommContact } from "@/lib/deskcomm-mcp";
import { getLeadNotificationHtml, getWelcomeEmailHtml } from "@/lib/emailTemplates";

const DESKCOMM_WEBHOOK_URL = process.env.DESKCOMM_WEBHOOK_URL || "";
const DESKCOMM_DEMO_EVENT_TYPE_SLUG = process.env.DESKCOMM_DEMO_EVENT_TYPE_SLUG || "reuniao";

type DemoBookingOutcome = {
  attempted: boolean;
  booked: boolean;
  pendingConfirmation?: boolean;
  error?: string;
};

/** Envia o lead pro webhook de captacao ja configurado no Deskcomm (cria/atualiza contato + lead). */
async function sendToDeskcommWebhook(input: { name?: string; fullPhone: string; email?: string }) {
  if (!DESKCOMM_WEBHOOK_URL) return;
  try {
    await fetch(DESKCOMM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: input.name || undefined,
        telefone: input.fullPhone,
        email: input.email || undefined,
      }),
    });
  } catch (err) {
    console.error("Erro ao enviar lead para o webhook do Deskcomm:", err);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Busca o contato recem-criado pelo webhook, com retry: o webhook responde assim que
 * o contato e gravado, mas `crm_search_contacts` observou um pequeno atraso de leitura
 * logo em seguida (contato inexistente na primeira busca, encontrado segundos depois).
 */
async function findContactWithRetry(fullPhone: string, attempts = 4, delayMs = 700) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const result = await searchContactByPhone(fullPhone);
    if (result.ok === false) return result;
    if (result.data.contacts.length > 0) return result;
    if (attempt < attempts) await sleep(delayMs);
  }
  return { ok: true as const, data: { contacts: [] as DeskcommContact[] } };
}

/** Resolve o contato no Deskcomm e cria o agendamento da demo (data/hora ja escolhidos na LP). */
async function bookDemoInDeskcomm(input: {
  fullPhone: string;
  startsAt: string;
  name?: string;
}): Promise<DemoBookingOutcome> {
  const contactResult = await findContactWithRetry(input.fullPhone);
  if (contactResult.ok === false) {
    return { attempted: true, booked: false, error: contactResult.error };
  }
  if (contactResult.data.contacts.length === 0) {
    return {
      attempted: true,
      booked: false,
      error: "Contato nao encontrado no Deskcomm apos o webhook de captacao.",
    };
  }

  const contactId = contactResult.data.contacts[0].id;
  const bookResult = await bookAppointment({
    eventTypeSlug: DESKCOMM_DEMO_EVENT_TYPE_SLUG,
    startsAt: input.startsAt,
    contactId,
    title: input.name ? `Demo Tlin - ${input.name}` : "Demo Tlin",
  });

  if (bookResult.ok === false) {
    return { attempted: true, booked: false, error: bookResult.error };
  }
  if (!bookResult.data.marcado) {
    return { attempted: true, booked: false, error: bookResult.data.mensagem || bookResult.data.motivo };
  }

  return { attempted: true, booked: true };
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, phone, countryCode, volume, team, email, planName, lead_score, lead_quality, utm, demoSlot } = data;

    const supabaseResult = await saveLeadSubmission({
      name,
      phone,
      countryCode,
      volume,
      team,
      email,
      planName,
      lead_score,
      lead_quality,
      utm,
      payload: data,
    });
    const supabaseLeadId = Array.isArray(supabaseResult.row)
      ? (supabaseResult.row[0] as any)?.id || null
      : (supabaseResult.row as any)?.id || null;

    const fullPhone = `+${String(countryCode || "+55").replace(/\D/g, "")}${String(phone || "").replace(/\D/g, "")}`;

    let demoBooking: DemoBookingOutcome = { attempted: false, booked: false };
    if (demoSlot?.starts_at) {
      await sendToDeskcommWebhook({ name, fullPhone, email });
      demoBooking = await bookDemoInDeskcomm({ fullPhone, startsAt: demoSlot.starts_at, name });
    }

    // Notifications are email-only; Evolution delivery has been removed.
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";
    let emailSent = false;
    let emailError = null;

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

      const teamEmail = process.env.NOTIFICATION_EMAIL || "contato@tlin.ia.br";

      const internalMailOptions = {
        from: `"Tlin" <${process.env.SMTP_FROM || "nao-responda@tlin.ia.br"}>`,
        to: teamEmail,
        subject: `Novo lead Tlin - ${name || "Sem nome"} - ${planName || "Sem plano"}`,
        html: getLeadNotificationHtml({
          name,
          phone,
          countryCode,
          volume,
          team,
          email,
          planName,
          lead_score,
          lead_quality,
          utm,
        }),
      };
      
      const mailOptions = {
        from: `"Tlin" <${process.env.SMTP_FROM || "nao-responda@tlin.ia.br"}>`,
        to: email || teamEmail,
        subject: `Bem-vindo à Tlin, ${name || "Empreendedor"}! 👋`,
        html: getWelcomeEmailHtml(name || "Empreendedor", planName || "TLIN")
      };

      try {
        console.log(`Tentando enviar e-mail via Resend SMTP direto pelo código para: ${mailOptions.to}...`);
        const internalInfo = await transporter.sendMail(internalMailOptions);
        console.log("Notificacao interna enviada com sucesso! Resposta SMTP:", internalInfo.response);

        const info = await transporter.sendMail(mailOptions);
        console.log("E-mail enviado com sucesso! Resposta SMTP:", info.response);
        emailSent = true;
      } catch (err) {
        console.error("Erro ao enviar e-mail via Nodemailer/Resend:", err);
        emailError = formatErrorMessage(err);
      }
    } else {
      console.log("Aviso: Credenciais de envio ausentes. Pulando disparo de e-mail.");
      emailError = "Variáveis SMTP_USER ou SMTP_PASS ausentes";
    }

    const success = emailSent;
    const notificationResult = {
      success,
      whatsappTriggered: false,
      whatsappError: null,
      groupTriggered: false,
      groupError: null,
      emailSent,
      emailError,
      demoBooking,
    };

    await updateLeadSubmissionNotification(supabaseLeadId, notificationResult);

    return NextResponse.json({
      success,
      supabaseSaved: supabaseResult.saved,
      supabaseError: supabaseResult.error,
      supabaseLeadId,
      whatsappTriggered: false,
      whatsappResponse: null,
      whatsappError: null,
      groupTriggered: false,
      groupResponse: null,
      groupError: null,
      emailSent,
      emailError,
      demoBooking,
    }, { status: success ? 200 : 502 });

  } catch (error: any) {
    console.error("Erro no endpoint /api/notify:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function formatErrorMessage(error: any) {
  const parts = [error?.message, error?.cause?.code, error?.cause?.message]
    .filter(Boolean)
    .map(String);

  return parts.join(" | ") || "Falha ao enviar notificação";
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
