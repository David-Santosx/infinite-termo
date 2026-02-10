import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Infinite Termo - Uma versão infinita do jogo.",
  description: "Quer jogar Termo sem ter que esperar por palavra? Experimente o Infinite Termo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${poppins.className} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="w-full mx-auto h-screen flex flex-col">
            <nav className="w-full max-w-105 mx-auto py-4 px-2 sm:px-4 flex justify-center items-center">
              <div className="space-x-4">
                <Link href="/" className="text-sm sm:text-base hover:underline">
                  Termo
                </Link>
                <Link href="/dueto" className="text-sm sm:text-base hover:underline">
                  Dueto
                </Link>
                <Link href="/quarteto" className="text-sm sm:text-base hover:underline">
                  Quarteto
                </Link>
              </div>
            </nav>
            <Separator className="max-w-105 mx-auto my-2" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center pt-4 mb-4 sm:mb-6">Infinite Termo</h1>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
