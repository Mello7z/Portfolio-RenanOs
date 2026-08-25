import { ChevronLeft, Circle, Square, Layers, Lock, Phone } from 'lucide-react';
import type { AppId } from '../../types';

interface MobileBottomBarProps {
  openAppsCount: number;
  onHome: () => void;
  onBack: () => void;
  onToggleAppSwitcher: () => void;
  onLock: () => void;
  activeApp: AppId | null;
}

export function MobileBottomBar({
  openAppsCount,
  onHome,
  onBack,
  onToggleAppSwitcher,
  onLock,
  activeApp,
}: MobileBottomBarProps) {
  return (
    <nav
      aria-label="Navegação Mobile"
      className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-around border-t border-amber-500/30 bg-[#07090e]/95 px-4 shadow-[0_-5px_25px_rgba(0,0,0,0.8)] backdrop-blur-2xl select-none"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        title="Voltar"
        className="flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer active:scale-90"
      >
        <ChevronLeft className="size-6" />
        <span className="text-[9px] font-mono tracking-tighter text-zinc-500 mt-0.5">Voltar</span>
      </button>

      {/* Home button */}
      <button
        onClick={onHome}
        title="Início"
        className="flex flex-col items-center justify-center p-2 text-amber-400 hover:text-amber-300 transition-transform active:scale-90 cursor-pointer"
      >
        <div className="grid size-9 place-items-center rounded-full border-2 border-amber-400 bg-amber-500/20 shadow-[0_0_12px_rgba(251,191,36,0.4)]">
          <Circle className="size-4 text-amber-400 fill-amber-400/30" />
        </div>
        <span className="text-[9px] font-mono font-bold tracking-tighter text-amber-400 mt-0.5">Início</span>
      </button>

      {/* App Switcher button */}
      <button
        onClick={onToggleAppSwitcher}
        title="Alternar Apps"
        className="relative flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer active:scale-90"
      >
        <div className="relative">
          <Layers className="size-5" />
          {openAppsCount > 0 && (
            <span className="absolute -top-1 -right-2 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black shadow-md">
              {openAppsCount}
            </span>
          )}
        </div>
        <span className="text-[9px] font-mono tracking-tighter text-zinc-500 mt-0.5">Apps</span>
      </button>

      {/* Lock screen button */}
      <button
        onClick={onLock}
        title="Bloquear"
        className="flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer active:scale-90"
      >
        <Lock className="size-5" />
        <span className="text-[9px] font-mono tracking-tighter text-zinc-500 mt-0.5">Bloquear</span>
      </button>
    </nav>
  );
}
