import {
  ShieldCheck,
  Briefcase,
  Crosshair,
  Shield,
  TerminalSquare,
  Radio,
  Music,
  Images,
  NotebookPen,
  CalendarClock,
  Gamepad2,
  Brain,
  Bomb,
  Gamepad,
  Keyboard,
  Calculator,
  Globe,
  FolderLock,
  Code2,
  Image,
  type LucideIcon,
} from 'lucide-react';
import type { AppId } from '../../types';

export const APP_ICONS: Record<AppId, LucideIcon> = {
  dossie: ShieldCheck,
  missoes: Crosshair,
  arsenal: Shield,
  terminal: TerminalSquare,
  sinal: Radio,
  trilha: Music,
  registros: Images,
  diario: NotebookPen,
  calendario: CalendarClock,
  arcade: Gamepad2,
  memoria: Brain,
  bomba: Bomb,
  snake: Gamepad,
  typing: Keyboard,
  calc: Calculator,
  browser: Globe,
  vault: FolderLock,
  code: Code2,
  curriculo: Briefcase,
  plano: Image,
};

export function AppIcon({
  appId,
  className,
}: {
  appId: AppId;
  className?: string;
}) {
  const Icon = APP_ICONS[appId];
  return <Icon className={className} aria-hidden="true" />;
}
