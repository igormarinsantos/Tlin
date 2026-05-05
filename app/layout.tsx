import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { TopBanner } from "@/components/TopBanner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Tlin.ai | Agência de Inteligência Artificial e Automação de Vendas",
  description: "A Tlin.ai cria Agentes de IA autônomos treinados para converter leads, qualificar clientes e escalar seu comercial 24/7 sem inchar sua folha de pagamento.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className={`${dmSans.className} min-h-full flex flex-col`}>
        <TopBanner />
        <Header />
        {children}
      </body>
    </html>
  );
}
