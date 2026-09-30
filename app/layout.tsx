import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { UTMTracker } from "@/components/UTMTracker";
import { SiteChrome } from "@/components/SiteChrome";
import { ConsentManager } from "@/components/ConsentManager";
import { LanguageProvider } from "@/lib/LanguageContext";
import { CONSENT_MAX_AGE_MS, CONSENT_STORAGE_KEY } from "@/lib/consent";
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
  title: "tlin.ai | IA Comercial com CRM, Follow-up e Agendamento",
  description:
    "IA comercial que atende, qualifica e vende no WhatsApp — com CRM, follow-up automático e agendamento nativos, prontos pra escalar seu comercial 24/7.",
  keywords: [
    "tlin.ai",
    "IA comercial",
    "CRM com IA",
    "automação de vendas",
    "agentes de IA",
    "follow-up automatizado",
    "agendamento automático",
    "automação de webhook",
    "qualificação de leads",
    "SDR com IA",
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
        url: absoluteUrl("/og/platform-preview-email.jpg"),
        width: 1200,
        height: 630,
        alt: "tlin.ai - IA comercial com CRM, follow-up e agendamento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl("/og/platform-preview-email.jpg")],
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

const GTM_ID = process.env.NEXT_PUBLIC_ANALYTICS_OWNER === "gtm" && /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID || "") ? process.env.NEXT_PUBLIC_GTM_ID : "";

const CONSENT_BOOTSTRAP = `
  (function(w){
    w.dataLayer=w.dataLayer||[];
    w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};
    var saved=null;
    try {
      var parsed=JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}')||'null');
      var updatedAt=parsed&&Date.parse(parsed.updatedAt);
      if(parsed&&parsed.version===1&&typeof parsed.analytics==='boolean'&&typeof parsed.marketing==='boolean'&&Number.isFinite(updatedAt)&&Date.now()-updatedAt<=${CONSENT_MAX_AGE_MS}&&updatedAt<=Date.now()+300000) saved=parsed;
    } catch(e) {}
    var analytics=saved&&saved.analytics===true?'granted':'denied';
    var marketing=saved&&saved.marketing===true?'granted':'denied';
    w.gtag('consent','default',{
      analytics_storage:analytics,
      ad_storage:marketing,
      ad_user_data:marketing,
      ad_personalization:marketing,
      functionality_storage:'granted',
      security_storage:'granted',
      wait_for_update:500
    });
    w.gtag('set','ads_data_redaction',true);
  })(window);
`;

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
        <script
          id="tlin-consent-defaults"
          dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP }}
        />
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

        <UTMTracker />

        <LanguageProvider>
          <SiteChrome>{children}</SiteChrome>
          <ConsentManager />
        </LanguageProvider>
      </body>
    </html>
  );
}
