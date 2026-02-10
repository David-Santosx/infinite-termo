import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Dice1, Dice2, Dice4, Info } from "lucide-react";

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
              <div className="flex space-x-2 sm:space-x-8">
                <Link href="/" className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base hover:underline transition-colors">
                  <Dice1 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Termo</span>
                </Link>
                <Link href="/dueto" className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base hover:underline transition-colors">
                  <Dice2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Dueto</span>
                </Link>
                <Link href="/quarteto" className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base hover:underline transition-colors">
                  <Dice4 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Quarteto</span>
                </Link>
                <Link href="/sobre" className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base hover:underline transition-colors">
                  <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Sobre</span>
                </Link>
              </div>
            </nav>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center pt-4 mb-4 sm:mb-6">Infinite Termo</h1>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
