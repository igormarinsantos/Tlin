"use client";

import Image from "next/image";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { trackFunnelEvent } from "@/lib/utm";
import { siteConfig } from "@/lib/siteConfig";

const appLoginUrl = siteConfig.appUrl;

function continueToApp(method: "google" | "email" | "direct") {
  trackFunnelEvent("login_gateway_continue", {
    login_method: method,
    cta_source: "login_gateway",
  });
}

export function LoginGateway() {
  return (
    <main className="relative h-[100vh] min-h-[100vh] max-h-[100vh] overflow-hidden bg-[#fbfbfd] text-[#0c0d0d]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#B597FF]/18 blur-[120px]" />
        <div className="absolute bottom-[-12rem] right-1/4 h-[30rem] w-[30rem] rounded-full bg-[#38E3FF]/14 blur-[140px]" />
      </div>

      <div className="relative mx-auto grid h-full min-h-full max-h-full w-full max-w-[1600px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex h-full min-h-0 flex-col px-5 py-5 sm:px-10 sm:py-8 lg:px-12 lg:py-6 xl:px-16 xl:py-8 [@media(max-height:640px)]:px-4 [@media(max-height:640px)]:py-3">
          <Link
            href="/"
            className="inline-flex w-fit items-center"
            aria-label="Voltar para a página inicial da Tlin"
          >
            <Image
              src="/Logo%20Horizontal.svg"
              alt="tlin.ai"
              width={102}
              height={37}
              priority
              className="h-auto w-[94px] object-contain sm:w-[102px] [@media(max-height:640px)]:w-[84px]"
            />
          </Link>

          <div className="my-auto w-full max-w-[470px] self-center py-5 sm:py-8 lg:self-auto [@media(max-height:800px)]:py-4 [@media(max-height:640px)]:py-2">
            <h1 className="text-[clamp(2.25rem,10.25vw,2.5rem)] font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl xl:text-[54px] [@media(max-height:640px)]:text-[32px]">
              Entre na sua operação comercial com{" "}
              <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">
                IA
              </span>
            </h1>
            <p className="mt-4 max-w-md text-[14px] font-medium leading-relaxed text-zinc-500 sm:mt-5 sm:text-base [@media(max-height:800px)]:mt-3 [@media(max-height:640px)]:mt-2 [@media(max-height:640px)]:text-[12px]">
              Acompanhe conversas, oportunidades e próximos passos em um só lugar
            </p>

            <div className="mt-7 rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 sm:mt-9 sm:rounded-[1.75rem] sm:p-5 [@media(max-height:800px)]:mt-5 [@media(max-height:800px)]:p-4 [@media(max-height:640px)]:mt-3 [@media(max-height:640px)]:rounded-[1.25rem] [@media(max-height:640px)]:p-3">
              <a
                href={appLoginUrl}
                onClick={() => continueToApp("google")}
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-[15px] font-bold text-[#0c0d0d] transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B597FF] [@media(max-height:640px)]:min-h-10 [@media(max-height:640px)]:text-[13px]"
              >
                <Image src="/logos/google.svg" alt="" width={18} height={18} aria-hidden="true" />
                Continuar com Google
              </a>

              <div className="my-4 flex items-center gap-3 [@media(max-height:640px)]:my-2" aria-hidden="true">
                <span className="h-px flex-1 bg-zinc-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">ou</span>
                <span className="h-px flex-1 bg-zinc-200" />
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  continueToApp("email");
                  window.location.assign(appLoginUrl);
                }}
              >
                <label htmlFor="login-email" className="sr-only">E-mail profissional</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Digite seu e-mail profissional"
                  className="min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-[15px] font-semibold text-[#0c0d0d] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#B597FF]/70 focus:ring-4 focus:ring-[#B597FF]/10 [@media(max-height:640px)]:min-h-10 [@media(max-height:640px)]:text-[13px]"
                />
                <button
                  type="submit"
                  className="group mt-3 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] px-5 text-[15px] font-extrabold text-[#0c0d0d] transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c0d0d] focus-visible:ring-offset-2 focus-visible:ring-offset-white [@media(max-height:640px)]:mt-2 [@media(max-height:640px)]:min-h-10 [@media(max-height:640px)]:text-[13px]"
                >
                  Continuar
                </button>
              </form>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium leading-relaxed text-zinc-400 [@media(max-height:640px)]:mt-2 [@media(max-height:640px)]:text-[9px]">
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                Seus dados permanecem seguros na Tlin
              </p>
            </div>

            <p className="mt-5 text-center text-[12px] font-medium text-zinc-500 [@media(max-height:800px)]:mt-3 [@media(max-height:640px)]:mt-2 [@media(max-height:640px)]:text-[10px]">
              Ainda não usa a Tlin?{" "}
              <Link href="/demo" className="font-bold text-[#0c0d0d] transition-colors hover:text-[#7254c8]">
                Agende uma demonstração
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 text-[10px] font-medium text-zinc-400 sm:text-[11px] [@media(max-height:640px)]:text-[9px]">
            <span>© {new Date().getFullYear()} tlin.ai</span>
            <Link href="/legal?tab=privacidade" className="transition-colors hover:text-zinc-700">
              Privacidade
            </Link>
          </div>
        </section>

        <section className="hidden h-full min-h-0 max-h-full items-center bg-[#fbfbfd] p-8 lg:flex xl:p-12 [@media(max-height:800px)]:p-6">
          <motion.div
            aria-hidden="true"
            className="h-full max-h-full w-full rounded-[2rem]"
            style={{
              backgroundColor: "#9279f4",
              backgroundImage: "radial-gradient(ellipse at 12% 18%, #38E3FF 0%, rgba(56,227,255,0.78) 18%, transparent 52%), radial-gradient(ellipse at 88% 82%, #7254c8 0%, rgba(114,84,200,0.9) 22%, transparent 58%), radial-gradient(ellipse at 72% 16%, #B597FF 0%, rgba(181,151,255,0.82) 24%, transparent 60%), linear-gradient(145deg, #38E3FF 0%, #8a78f0 48%, #B597FF 100%)",
              backgroundSize: "170% 170%, 180% 180%, 160% 160%, 140% 140%",
            }}
            animate={{
              backgroundPosition: [
                "0% 0%, 100% 100%, 100% 0%, 0% 0%",
                "72% 28%, 18% 82%, 35% 75%, 100% 45%",
                "100% 82%, 0% 20%, 72% 18%, 45% 100%",
                "0% 0%, 100% 100%, 100% 0%, 0% 0%",
              ],
            }}
            transition={{
              duration: 16,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </section>
      </div>
    </main>
  );
}
