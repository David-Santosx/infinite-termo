import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useHighContrast } from "@/features/game/client/settings";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const THEMES = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
] as const;

const noopSubscribe = () => () => {};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const [highContrast, setHighContrast] = useHighContrast();
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>Ajuste a aparência do jogo.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Tema</span>
            <div className="h-9">
              {mounted && (
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={theme ?? "system"}
                  onValueChange={(v) => v && setTheme(v)}
                  aria-label="Tema"
                >
                  {THEMES.map(({ value, label }) => (
                    <ToggleGroupItem key={value} value={value}>
                      {label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <label htmlFor="high-contrast" className="text-sm font-medium">
                Alto contraste
              </label>
              <span
                id="high-contrast-hint"
                className="text-sm text-muted-foreground"
              >
                Cores laranja e azul, melhores para daltonismo.
              </span>
            </div>
            <Switch
              id="high-contrast"
              aria-describedby="high-contrast-hint"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
