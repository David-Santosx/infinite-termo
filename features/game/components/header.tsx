"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartColumn, CircleHelp, Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MODE_LABELS } from "@/features/game/engine/modes";

const TABS = [
  { href: "/", label: MODE_LABELS.campaign },
  { href: "/termo", label: MODE_LABELS.termo },
  { href: "/dueto", label: MODE_LABELS.dueto },
  { href: "/quarteto", label: MODE_LABELS.quarteto },
] as const;

export function Header() {
  const pathname = usePathname();
  const [, setDialog] = useState<"help" | "stats" | "settings" | null>(null);

  return (
    <header className="mx-auto w-full max-w-xl px-3 pt-2">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center justify-start">
          <Button variant="ghost" size="icon" aria-label="Como jogar" onClick={() => setDialog("help")}>
            <CircleHelp />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Configurações" onClick={() => setDialog("settings")}>
            <Settings />
          </Button>
        </div>
        <Link href="/" className="font-display text-2xl uppercase tracking-[0.2em] sm:text-3xl">
          Infinite Termo
        </Link>
        <div className="flex items-center justify-end">
          <Button variant="ghost" size="icon" aria-label="Estatísticas" onClick={() => setDialog("stats")}>
            <ChartColumn />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Sobre" asChild>
            <Link href="/sobre">
              <Info />
            </Link>
          </Button>
        </div>
      </div>
      <nav aria-label="Modos de jogo" className="mt-2 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
