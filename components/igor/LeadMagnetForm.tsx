"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getUtmLeadPayload, trackFunnelEvent } from "@/lib/utm";
import styles from "./LeadMagnetForm.module.css";

type Props = { campaignSlug: string; campaignKeyword: string; consentVersion: string; buttonLabel: string; tone?: "light" | "dark" };

export function LeadMagnetForm({ campaignSlug, campaignKeyword, consentVersion, buttonLabel, tone = "light" }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lead, setLead] = useState({ name: "", email: "", whatsapp: "" });

  function updateLead(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as keyof typeof lead;
    setLead((current) => ({ ...current, [field]: event.target.value }));
  }

  function nextStep() {
    const name = formRef.current?.querySelector<HTMLInputElement>('input[name="name"]');
    if (name?.reportValidity()) setStep(2);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = formRef.current?.querySelector<HTMLInputElement>('input[name="email"]');
    const whatsapp = formRef.current?.querySelector<HTMLInputElement>('input[name="whatsapp"]');
    if (!email?.reportValidity() || !whatsapp?.reportValidity()) return;
    setError(""); setIsLoading(true);
    const payload = { name: lead.name.trim(), email: lead.email.trim(), whatsapp: lead.whatsapp.trim(), consentMarketing: false, campaignSlug, campaignKeyword, consentVersion, utm: getUtmLeadPayload() };
    try {
      const response = await fetch("/api/growth-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível liberar o material.");
      trackFunnelEvent("igor_lead_captured", { campaign: campaignSlug, keyword: campaignKeyword });
      router.push(`/playbook/${campaignSlug}/obrigado`);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Tente novamente em alguns instantes."); }
    finally { setIsLoading(false); }
  }

  return <form ref={formRef} onSubmit={submit} className={`${styles.form} ${tone === "dark" ? styles.dark : styles.light}`} noValidate>
    {step === 1 ? <section className={styles.step}>
      <p className={styles.kicker}>ACESSO GRATUITO</p>
      <h3>Como eu te chamo?</h3>
      <div className={styles.fields}><label><span>NOME</span><input required name="name" value={lead.name} onChange={updateLead} autoComplete="name" placeholder="Como posso te chamar?" /></label></div>
      <button type="button" onClick={nextStep}>Continuar <span>→</span></button>
    </section> : <section className={styles.step}>
      <p className={styles.kicker}>TUDO CERTO</p>
      <h3>Para onde eu<br />te envio?</h3>
      <p className={styles.helper}>Você recebe o playbook gratuito agora no e-mail e WhatsApp.</p>
      <div className={styles.fields}>
        <label><span>E-MAIL</span><input required name="email" value={lead.email} onChange={updateLead} type="email" autoComplete="email" placeholder="voce@empresa.com" /></label>
        <label><span>WHATSAPP</span><input required name="whatsapp" value={lead.whatsapp} onChange={updateLead} inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" /></label>
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.actions}><button className={styles.back} type="button" onClick={() => setStep(1)}>Voltar</button><button type="submit" disabled={isLoading}>{isLoading ? "Liberando..." : <>{buttonLabel} <span>→</span></>}</button></div>
      <p className={styles.terms}>Ao continuar, você concorda com a <a href="/legal/privacy" target="_blank">Política de Privacidade</a> para o envio deste material.</p>
    </section>}
  </form>;
}
