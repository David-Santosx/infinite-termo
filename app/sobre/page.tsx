import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src="/photo.jfif" alt="David Santos" />
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">Olá, tudo bom?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            O <Link href="https://term.ooo" target="_blank" className="font-semibold underline" rel="noopener noreferrer">Termo</Link> foi criado em Janeiro de 2022 por <Link href="https://fserb.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline">Fernando Serboncini</Link>.
          </p>
          <p>
            Essa versão infinita do jogo foi criada em Fevereiro de 2026 por mim, David Santos, e é uma versão ilimitada do jogo, onde você pode jogar quantas vezes quiser, sem ter que esperar por uma nova palavra a cada dia.
          </p>
          <p>
            A lista de palavras utilizadas nos jogos vem do <Link href="https://github.com/fserb/pt-br" target="_blank" rel="noopener noreferrer" className="font-semibold underline">léxico pt-br</Link>, e também o repositório verbete de <Link href="https://github.com/csamuelsm" target="_blank" rel="noopener noreferrer" className="font-semibold underline">csamuelsm</Link>.
          </p>
          <div className="text-center">
            <Button asChild>
              <Link href="https://instagram.com/leao.willians" target="_blank" rel="noopener noreferrer" className="font-semibold">
                Me siga no Instagram <Instagram className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Termos de Privacidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            O Infinite Termo não coleta nenhum dado pessoal. As informações registradas no servidor são as palavras usadas, de forma anônima, para validação do jogo.
          </p>
          <p>
            O Infinite Termo utiliza cookies apenas para manter a sessão do usuário ativa durante o jogo, e esses cookies não contêm informações pessoais ou de rastreamento.
          </p>
          <p>
            O Infinite Termo não compartilha dados com terceiros, e todas as informações coletadas são usadas exclusivamente para melhorar a experiência do jogo e garantir seu funcionamento adequado.
          </p>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Copyright © 2026 David Santos. Todos os direitos reservados.
      </div>
    </div>
  );
}
