import type { Metadata, Viewport } from "next";
import { Geist, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { HIGH_CONTRAST_KEY } from "@/features/game/client/storage-keys";
import { Header } from "@/features/game/components/header";

const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-sora" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const description =
  "Termo sem limite diário: adivinhe palavras em português quantas vezes quiser, nos modos Termo, Dueto, Quarteto e Campanha.";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: "Infinite Termo", template: "%s · Infinite Termo" },
  description,
  applicationName: "Infinite Termo",
  openGraph: {
    title: "Infinite Termo",
    description,
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(JSON.parse(localStorage.getItem("${HIGH_CONTRAST_KEY}")))document.documentElement.setAttribute("data-contrast","high")}catch(e){}`,
          }}
        />
      </head>
      <body className={`${sora.variable} ${geist.variable} antialiased`}>
        <Providers>
          <div className="flex h-dvh flex-col">
            <Header />
            <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
