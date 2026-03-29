import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DynamicIconProps {
  name: string | null | undefined;
  size?: number;
  className?: string;
}

export function DynamicIcon({ name, size = 16, className }: DynamicIconProps) {
  if (!name) return null;
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[pascalName];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
