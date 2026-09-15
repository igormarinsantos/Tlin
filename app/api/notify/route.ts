import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveLeadSubmission, updateLeadSubmissionNotification } from "@/lib/supabase-leads";
import { bookAppointment, searchContactByPhone, type DeskcommContact } from "@/lib/deskcomm-mcp";
import { getLeadNotificationHtml, getWelcomeEmailHtml } from "@/lib/emailTemplates";
import { checkRateLimit, rateLimitedResponse, requestIsTooLarge } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { captureDeskcommLead } from "@/lib/deskcomm-leads";

const DESKCOMM_DEMO_EVENT_TYPE_SLUG = process.env.DESKCOMM_DEMO_EVENT_TYPE_SLUG || "reuniao";

type DemoBookingOutcome = {
  attempted: boolean;
  booked: boolean;
  pendingConfirmation?: boolean;
  error?: string;
};

function isValidLead(data: unknown): data is Record<string, any> {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const lead = data as Record<string, unknown>;
  const name = typeof lead.name === "string" ? lead.name.trim() : "";
  const phone = typeof lead.phone === "string" ? lead.phone.replace(/\D/g, "") : "";
  const email = typeof lead.email === "string" ? lead.email.trim() : "";
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || name.length > 120 || phone.length < 8 || phone.length > 15 || !validEmail || email.length > 254) {
    return false;
  }

  const startsAt = (lead.demoSlot as { starts_at?: unknown } | undefined)?.starts_at;
  return typeof startsAt === "undefined"
    || (typeof startsAt === "string" && !Number.isNaN(Date.parse(startsAt)));
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
  const rateLimit = checkRateLimit(req, "lead-notification", 5, 60 * 60_000);
  if (!rateLimit.allowed) return rateLimitedResponse(rateLimit.retryAfter);
  if (requestIsTooLarge(req, 32_000)) {
    return NextResponse.json({ success: false, error: "Dados enviados são grandes demais." }, { status: 413 });
  }

  try {
    const data = await req.json();
    if (!isValidLead(data)) {
      return NextResponse.json({ success: false, error: "Dados de contato inválidos." }, { status: 400 });
    }
    if (!(await verifyTurnstileToken(data.turnstileToken, req))) {
      return NextResponse.json({ success: false, error: "Não foi possível validar o envio. Tente novamente." }, { status: 403 });
    }
    const { name, phone, countryCode, volume, team, email, planName, lead_score, lead_quality, utm, demoSlot } = data;
    const leadCaptureId = typeof data.leadCaptureId === "string" && data.leadCaptureId.length <= 128
      ? data.leadCaptureId
      : crypto.randomUUID();
    const fullPhone = `+${String(countryCode || "+55").replace(/\D/g, "")}${String(phone || "").replace(/\D/g, "")}`;

    // Deskcomm e a fonte operacional do funil. O Supabase abaixo e somente uma
    // projecao de contingencia/analise e jamais decide se o lead foi recebido.
    const deskcommCapture = await captureDeskcommLead({
      leadCaptureId,
      name,
      phone: fullPhone,
      email,
      leadScore: lead_score,
      leadQuality: lead_quality,
      status: "novo",
      utm,
    });

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

    let demoBooking: DemoBookingOutcome = { attempted: false, booked: false };
    if (deskcommCapture.ok && demoSlot?.starts_at) {
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

    const success = deskcommCapture.ok;
    const notificationResult = {
      success,
      whatsappTriggered: false,
      whatsappError: null,
      groupTriggered: false,
      groupError: null,
      emailSent,
      emailError,
      deskcommCapture,
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
      crmCaptured: deskcommCapture.ok,
      crmError: deskcommCapture.ok === false ? deskcommCapture.error : null,
      leadCaptureId,
      demoBooking,
    }, { status: success ? 200 : 502 });

  } catch (error: any) {
    console.error("Erro no endpoint /api/notify:", error);
    return NextResponse.json({ success: false, error: "Não foi possível registrar o contato agora." }, { status: 500 });
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
