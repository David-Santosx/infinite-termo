import type { Metadata } from "next";
import Image from "next/image";
import { Github, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Sobre" };

const linkClass = "font-semibold underline underline-offset-2";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}

export default function SobrePage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-xl space-y-6 px-4 py-6 text-sm">
        <section className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/david.webp"
            alt="David Santos"
            width={96}
            height={96}
            className="rounded-full"
            priority
          />
          <h1 className="font-display text-2xl">Feito por David Santos</h1>
          <p>
            O <ExternalLink href="https://term.ooo">Termo</ExternalLink> foi criado por{" "}
            <ExternalLink href="https://fserb.com">Fernando Serboncini</ExternalLink> a partir do Wordle de
            Josh Wardle. Esta versão remove o limite diário e adiciona Dueto, Quarteto e Campanha.
          </p>
        </section>

        <section className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <a
              href="https://github.com/David-Santosx/infinite-termo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github /> GitHub
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://instagram.com/leao.willians" target="_blank" rel="noopener noreferrer">
              <Instagram /> Instagram
            </a>
          </Button>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg">Palavras</h2>
          <p>
            As respostas vêm de uma lista curada de ~1.500 palavras comuns; palpites aceitam todo o léxico
            pt-br de 5 letras.
          </p>
          <p>
            Créditos: léxico pt-br (
            <ExternalLink href="https://github.com/fserb/pt-br">github.com/fserb/pt-br</ExternalLink>) e
            verbete (<ExternalLink href="https://github.com/csamuelsm">github.com/csamuelsm</ExternalLink>
            ).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg">Privacidade</h2>
          <p>
            Nenhum dado pessoal é coletado. O jogo em andamento fica em um cookie criptografado no seu
            navegador, usado apenas para validar palpites; suas estatísticas ficam salvas só no seu
            dispositivo.
          </p>
        </section>

        <footer className="pt-2 text-center text-muted-foreground">© 2026 David Santos</footer>
      </div>
    </div>
  );
}
