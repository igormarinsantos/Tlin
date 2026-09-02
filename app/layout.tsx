import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { UTMTracker } from "@/components/UTMTracker";
import { LanguageProvider } from "@/lib/LanguageContext";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import { stringifyStructuredData } from "@/lib/structuredData";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: "tlin.ai",
  title: "tlin.ai | Agência de Inteligência Artificial e Automação de Vendas",
  description:
    "A tlin.ai é um software comercial impulsionado por IA para responder leads, qualificar oportunidades e organizar vendas no WhatsApp.",
  keywords: [
    "tlin.ai",
    "agência de inteligência artificial",
    "automação de vendas",
    "agentes de IA",
    "IA para vendas",
    "qualificação de leads",
    "SDR com IA",
    "automação comercial",
    "software comercial com IA",
    "software de vendas para WhatsApp",
    "gestão de conversas comerciais",
  ],
  alternates: {
    canonical: absoluteUrl("/"),
    languages: {
      "pt-BR": absoluteUrl("/"),
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl("/platform-preview-email.jpg"),
        width: 1200,
        height: 630,
        alt: "tlin.ai - Agentes de IA para vendas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl("/platform-preview-email.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  creator: "tlin.ai",
  publisher: "tlin.ai",
  formatDetection: {
    telephone: false,
  },
  other: {
    "geo.region": "BR-SP",
    "geo.placename": "Sao Paulo, Brazil",
    "business:contact_data:country_name": "Brazil",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-9LQN3ZWCNS";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NH79DSND";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifyStructuredData(),
          }}
        />
      </head>
      <body className={`${dmSans.className} flex flex-col`} suppressHydrationWarning>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  send_page_view: true,
                  cookie_flags: 'SameSite=Lax;Secure',
                });
              `}
            </Script>
          </>
        )}

        <UTMTracker />

        <LanguageProvider>
          <SmoothScroll>
            <Header />
            {children}
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
