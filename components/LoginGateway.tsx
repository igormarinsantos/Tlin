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
    <main className="relative min-h-[100svh] overflow-hidden bg-[#fbfbfd] text-[#0c0d0d]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#B597FF]/18 blur-[120px]" />
        <div className="absolute bottom-[-12rem] right-1/4 h-[30rem] w-[30rem] rounded-full bg-[#38E3FF]/14 blur-[140px]" />
      </div>

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[1600px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex min-h-[100svh] flex-col px-5 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-6 xl:px-16 xl:py-8">
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
              className="object-contain"
            />
          </Link>

          <div className="my-auto w-full max-w-[470px] self-center py-8 lg:self-auto [@media(max-height:800px)]:py-5">
            <span className="inline-flex rounded-full border border-[#B597FF]/20 bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#8b6be0]">
              ✨ Sua operação continua aqui
            </span>

            <h1 className="mt-7 text-[40px] font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl xl:text-[54px] [@media(max-height:800px)]:mt-5 [@media(max-height:800px)]:text-[42px]">
              Entre na sua operação comercial com{" "}
              <span className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">
                IA
              </span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] font-medium leading-relaxed text-zinc-500 sm:text-base [@media(max-height:800px)]:mt-4">
              Acompanhe conversas, oportunidades e próximos passos em um só lugar
            </p>

            <div className="mt-9 rounded-[1.75rem] border border-zinc-200/80 bg-white p-4 sm:p-5 [@media(max-height:800px)]:mt-6 [@media(max-height:800px)]:p-4">
              <a
                href={appLoginUrl}
                onClick={() => continueToApp("google")}
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-[15px] font-bold text-[#0c0d0d] transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B597FF]"
              >
                <Image src="/logos/google.svg" alt="" width={18} height={18} aria-hidden="true" />
                Continuar com Google
              </a>

              <div className="my-4 flex items-center gap-3" aria-hidden="true">
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
                  className="min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-[15px] font-semibold text-[#0c0d0d] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#B597FF]/70 focus:ring-4 focus:ring-[#B597FF]/10"
                />
                <button
                  type="submit"
                  className="group mt-3 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B597FF] to-[#38E3FF] px-5 text-[15px] font-extrabold text-[#0c0d0d] transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c0d0d] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Continuar
                </button>
              </form>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium leading-relaxed text-zinc-400">
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                O acesso seguro acontece no app da Tlin
              </p>
            </div>

            <p className="mt-6 text-center text-[12px] font-medium text-zinc-500 [@media(max-height:800px)]:mt-4">
              Ainda não usa a Tlin?{" "}
              <Link href="/demo" className="font-bold text-[#0c0d0d] transition-colors hover:text-[#7254c8]">
                Agende uma demonstração
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 text-[11px] font-medium text-zinc-400">
            <span>© {new Date().getFullYear()} tlin.ai</span>
            <Link href="/legal?tab=privacidade" className="transition-colors hover:text-zinc-700">
              Privacidade
            </Link>
          </div>
        </section>

        <section className="hidden min-h-[100svh] items-center bg-[#fbfbfd] p-8 lg:flex xl:p-12 [@media(max-height:800px)]:p-6">
          <motion.div
            aria-hidden="true"
            className="h-[calc(100svh-4rem)] w-full rounded-[2rem] border border-white/60 [@media(max-height:800px)]:h-[calc(100svh-3rem)]"
            style={{
              backgroundImage: "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.82) 0%, transparent 28%), radial-gradient(circle at 82% 76%, rgba(56,227,255,0.72) 0%, transparent 34%), linear-gradient(135deg, #f3edff 0%, #d8c9ff 28%, #9d8aff 52%, #6ddff5 76%, #e9fbff 100%)",
              backgroundSize: "180% 180%",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 38%", "58% 100%", "0% 0%"],
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
