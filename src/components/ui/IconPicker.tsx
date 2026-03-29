import { useState, useEffect, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "./input";
import { DynamicIcon } from "./DynamicIcon";

type IconEntry = { name: string; Icon: LucideIcon };

let cachedIcons: IconEntry[] | null = null;

async function loadIcons(): Promise<IconEntry[]> {
  if (cachedIcons) return cachedIcons;
  const mod = await import("lucide-react");
  cachedIcons = (Object.entries(mod) as [string, unknown][])
    .filter(([name, value]) =>
      typeof value === "object" && value !== null &&
      /^[A-Z]/.test(name) && !name.endsWith("Icon")
    )
    .map(([name, value]) => ({
      name: name.charAt(0).toLowerCase() + name.slice(1),
      Icon: value as unknown as LucideIcon,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return cachedIcons;
}

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [allIcons, setAllIcons] = useState<IconEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { loadIcons().then(setAllIcons); }, []);

  const filtered = useMemo(
    () => allIcons.filter(({ name }) => name.includes(search.toLowerCase())),
    [allIcons, search]
  );

  function close() {
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full h-8 px-2.5 rounded-lg border border-input bg-transparent text-sm hover:bg-accent/50 transition-colors"
      >
        {value ? (
          <>
            <DynamicIcon name={value} size={15} className="shrink-0" />
            <span>{value}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Choisir une icône…</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={close} />
          <div className="absolute z-50 mt-1 w-full min-w-64 bg-popover border border-border rounded-lg shadow-md p-2">
            <Input
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2 h-7 text-sm"
              autoFocus
            />
            <div className="grid grid-cols-8 gap-0.5 max-h-52 overflow-y-auto">
              {allIcons.length === 0 ? (
                <p className="col-span-8 text-xs text-muted-foreground text-center py-4">Chargement…</p>
              ) : filtered.length === 0 ? (
                <p className="col-span-8 text-xs text-muted-foreground text-center py-2">Aucune icône trouvée</p>
              ) : (
                filtered.map(({ name, Icon }) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => { onChange(name); close(); }}
                    className={`flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors ${value === name ? "bg-accent" : ""}`}
                  >
                    <Icon size={16} />
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
