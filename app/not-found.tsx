import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-3xl">Página não encontrada</h1>
      <Button asChild>
        <Link href="/">Voltar ao jogo</Link>
      </Button>
    </div>
  );
}
