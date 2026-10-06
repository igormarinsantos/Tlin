"use client";

import Image from "next/image";

const logos = [
  { name: "Google", src: "/logos/google.svg" },
  { name: "OpenAI", src: "/logos/openai.svg" },
  { name: "WhatsApp", src: "/logos/whatsapp.svg" },
  { name: "Microsoft", src: "/logos/microsoft.svg" },
  { name: "AWS", src: "/logos/aws.svg" },
  { name: "Stripe", src: "/logos/stripe.svg" },
  { name: "HubSpot", src: "/logos/hubspot.svg" },
];

export function TrustedBy({ transparentBg }: { transparentBg?: boolean } = {}) {
  return (
    <section className={`w-full py-16 overflow-hidden ${transparentBg ? "" : "bg-white"}`}>
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-16">
          {/* Label */}
          <div className="shrink-0 flex items-center gap-6">
            <p className="text-zinc-400 font-medium text-xs md:text-sm leading-tight text-center md:text-left">
              Confiança para <br className="hidden md:block" /> escalar sua operação
            </p>
            <div className="h-10 w-[1px] bg-zinc-200 hidden md:block" />
          </div>

          {/* Carousel */}
          <div className="w-full md:flex-1 min-w-0 relative overflow-hidden">
            {/* Gradients to fade edges -- acompanham a cor de fundo da section
                (branco normalmente, azul claro quando embutida no wrapper
                azul das paginas de campanha) pra nao criar uma emenda visivel */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r to-transparent z-10 ${transparentBg ? "from-[#EAFBFF]" : "from-white"}`}
            />
            <div
              className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l to-transparent z-10 ${transparentBg ? "from-[#EAFBFF]" : "from-white"}`}
            />
            
            <div className="trusted-logo-track flex w-max items-center">
              {/* Double the logos for seamless loop */}
              {[...logos, ...logos].map((logo, idx) => (
                <div key={idx} aria-hidden={idx >= logos.length ? true : undefined} className="shrink-0 flex items-center pr-16 md:pr-24">
                  <Image 
                    src={logo.src} 
                    alt={logo.name}
                    width={96}
                    height={24}
                    className="h-5 md:h-6 w-auto grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer"
                    style={{ width: 'auto', height: '24px' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
