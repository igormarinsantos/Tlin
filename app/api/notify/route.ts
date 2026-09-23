import { NextRequest, NextResponse } from "next/server";
import { operationKey, runOnce } from "@/lib/funnel-store";
import nodemailer from "nodemailer";
import { sanitizeLeadAttribution, saveLeadSubmission, updateLeadSubmissionNotification } from "@/lib/supabase-leads";
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
  slotUnavailable?: boolean;
  error?: string;
  leadCaptureId?: string;
  contactId?: string;
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
  return typeof startsAt === "string" && Date.parse(startsAt) > Date.now();
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
    const contacts = result.data.contacts.filter(contact => contact.phone?.replace(/\D/g, "") === fullPhone.replace(/\D/g, ""));
    if (contacts.length > 0) return { ok: true as const, data: { contacts } };
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
    return { attempted: true, booked: false, pendingConfirmation: true, error: bookResult.error };
  }
  if (bookResult.data.marcado === false) {
    return { attempted: true, booked: false, slotUnavailable: true, error: bookResult.data.mensagem || bookResult.data.motivo };
  }
  if (bookResult.data.marcado !== true) {
    return { attempted: true, booked: false, pendingConfirmation: true, error: "Resposta de agendamento invalida." };
  }

  return { attempted: true, booked: true, contactId };
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(req, "lead-notification", 5, 60 * 60_000);
  if (!rateLimit.allowed) return rateLimitedResponse(rateLimit.retryAfter);
  if (requestIsTooLarge(req, 32_000)) {
    return NextResponse.json({ success: false, error: "Dados enviados são grandes demais." }, { status: 413 });
  }

  let demoBooking: DemoBookingOutcome = { attempted: false, booked: false };
  try {
    const data = await req.json().catch(() => null);
    if (!isValidLead(data)) {
      return NextResponse.json({ success: false, error: "Dados de contato inválidos." }, { status: 400 });
    }
    if (!(await verifyTurnstileToken(data.turnstileToken, req))) {
      return NextResponse.json({ success: false, error: "Não foi possível validar o envio. Tente novamente." }, { status: 403 });
    }
    const { name, phone, countryCode, volume, team, email, planName, lead_score, lead_quality, demoSlot } = data;
    const attribution = sanitizeLeadAttribution(data.utm);
    const mirroredPayload: Record<string, unknown> = { ...data, utm: attribution };
    delete mirroredPayload.turnstileToken;
    const leadCaptureId = typeof data.leadCaptureId === "string" && data.leadCaptureId.length > 0 && data.leadCaptureId.length <= 128
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
      utm: attribution,
    });

    let supabaseResult = await saveLeadSubmission({
      leadCaptureId,
      deskcommLeadId: deskcommCapture.ok ? deskcommCapture.leadId : undefined,
      deskcommContactId: deskcommCapture.ok ? deskcommCapture.contactId : undefined,
      contactKey: operationKey("contact", fullPhone),
      capturedAt: deskcommCapture.ok ? new Date().toISOString() : undefined,
      name,
      phone,
      countryCode,
      volume,
      team,
      email,
      planName,
      lead_score,
      lead_quality,
      utm: attribution,
      payload: mirroredPayload,
    });
    const supabaseLeadId = Array.isArray(supabaseResult.row)
      ? (supabaseResult.row[0] as any)?.id || null
      : (supabaseResult.row as any)?.id || null;

    if (deskcommCapture.ok && demoSlot?.starts_at) {
      demoBooking = { attempted: true, booked: false, pendingConfirmation: true };
      const bookingKey = operationKey("booking", fullPhone + ":" + new Date(demoSlot.starts_at).toISOString());
      const guarded = await runOnce<DemoBookingOutcome>(bookingKey, async () => {
        const result = await bookDemoInDeskcomm({ fullPhone, startsAt: demoSlot.starts_at, name });
        result.leadCaptureId = leadCaptureId;
        return { result, definitive: !result.pendingConfirmation, retryable: !result.booked && !result.pendingConfirmation };
      });
      demoBooking = guarded.state === "done" ? guarded.result : {
        attempted: guarded.state === "pending", booked: false,
        pendingConfirmation: guarded.state === "pending", error: "Booking coordination unavailable",
      };
      if (demoBooking.booked) {
        supabaseResult = await saveLeadSubmission({
          leadCaptureId: demoBooking.leadCaptureId || leadCaptureId, payload: {},
          contactKey: operationKey("contact", fullPhone), capturedAt: new Date().toISOString(),
          bookedAt: new Date().toISOString(), bookingKey, bookingStartsAt: demoSlot.starts_at,
        });
      }
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
        connectionTimeout: 5_000,
        greetingTimeout: 5_000,
        socketTimeout: 10_000,
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
          utm: attribution,
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
        const delivered = await runOnce(operationKey("notification", leadCaptureId), async () => {
        const internalInfo = await transporter.sendMail(internalMailOptions);
        console.log("Notificacao interna enviada com sucesso! Resposta SMTP:", internalInfo.response);

        const info = await transporter.sendMail(mailOptions);
        console.log("E-mail enviado com sucesso! Resposta SMTP:", info.response);
        return { result: true, definitive: true };
        });
        emailSent = delivered.state === "done";
      } catch (err) {
        console.error("Erro ao enviar e-mail via Nodemailer/Resend:", err);
        emailError = formatErrorMessage(err);
      }
    } else {
      console.log("Aviso: Credenciais de envio ausentes. Pulando disparo de e-mail.");
      emailError = "Variáveis SMTP_USER ou SMTP_PASS ausentes";
    }

    const success = deskcommCapture.ok && demoBooking.booked;
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
    return NextResponse.json({ success: demoBooking.booked, demoBooking, error: "Não foi possível concluir todas as etapas agora." }, { status: demoBooking.booked ? 200 : 500 });
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
