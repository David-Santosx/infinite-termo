import type { Metadata, Viewport } from "next";
import { Inter, Mitr } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/features/game/components/header";

const mitr = Mitr({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-mitr" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const description =
  "Termo sem limite diário: adivinhe palavras em português quantas vezes quiser, nos modos Termo, Dueto, Quarteto e Campanha.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
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
    { media: "(prefers-color-scheme: dark)", color: "#6e5c62" },
    { media: "(prefers-color-scheme: light)", color: "#f7f4f5" },
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
            __html: `try{if(JSON.parse(localStorage.getItem("it_high_contrast")))document.documentElement.setAttribute("data-contrast","high")}catch(e){}`,
          }}
        />
      </head>
      <body className={`${mitr.variable} ${inter.variable} antialiased`}>
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
