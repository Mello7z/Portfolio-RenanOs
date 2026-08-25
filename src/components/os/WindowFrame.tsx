import { useState, useRef, useEffect } from 'react';
import { Minus, Square, X, ChevronLeft } from 'lucide-react';
import { APPS, getLocalizedApp } from './AppsConfig';
import { AppIcon } from './AppIcon';
import { AppContent } from './AppContent';
import type { WindowState, AppId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export function WindowFrame({
  win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  isMobile,
  onOpenApp,
}: {
  key?: string;
  win: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  isMobile?: boolean;
  onOpenApp?: (appId: AppId) => void;
}) {
  const { language } = useLanguage();
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const meta = getLocalizedApp(win.appId, language);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      onMove(win.id, dragRef.current.initX + dx, dragRef.current.initY + dy);
    }
    function handlePointerUp() {
      setDragging(false);
    }

    if (dragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, win.id, onMove]);

  if (win.minimized) return null;

  const isSmallScreen = isMobile || (typeof window !== 'undefined' && window.innerWidth < 768);

  const style = isSmallScreen || win.maximized
    ? {
        top: '2.25rem',
        left: 0,
        right: 0,
        bottom: '3.5rem',
        width: '100%',
        height: 'calc(100vh - 5.75rem)',
      }
    : {
        top: `${win.y}px`,
        left: `${win.x}px`,
        width: `${win.width}px`,
        height: `${win.height}px`,
      };

  return (
    <div
      onPointerDown={() => onFocus(win.id)}
      style={{ ...style, zIndex: win.z }}
      className={`fixed flex flex-col overflow-hidden bg-[#0d0f14]/95 backdrop-blur-xl transition-all ${
        isSmallScreen ? 'rounded-none border-b border-amber-500/20 shadow-none' : 'rounded-xl border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
      } ${dragging ? 'opacity-90 select-none shadow-2xl' : ''}`}
    >
      {/* Window Titlebar */}
      <div
        onPointerDown={(e) => {
          if (win.maximized || isSmallScreen) return;
          setDragging(true);
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initX: win.x,
            initY: win.y,
          };
        }}
        className="flex h-10 shrink-0 items-center justify-between border-b border-amber-500/30 bg-gradient-to-r from-[#121622] via-[#161b29] to-[#121622] px-3.5 select-none"
      >
        <div className="flex items-center gap-2.5">
          {isSmallScreen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize(win.id);
              }}
              className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-mono font-bold text-amber-300 hover:bg-amber-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <ChevronLeft className="size-3.5" /> Voltar
            </button>
          )}
          <AppIcon appId={win.appId} className="size-4 text-amber-400 shrink-0" />
          <span className="font-mono text-xs font-bold text-zinc-200 tracking-wide truncate max-w-[150px] sm:max-w-xs">
            {meta.title}
          </span>
        </div>

        {/* Tactical window control buttons */}
        <div className="flex items-center gap-1.5 font-mono">
          {!isSmallScreen && (
            <>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize(win.id);
                }}
                title="Minimizar"
                aria-label="Minimizar janela"
                className="flex size-5.5 items-center justify-center rounded border border-zinc-700/60 bg-[#1a1e2c] text-zinc-400 hover:border-amber-500/60 hover:bg-amber-500/20 hover:text-amber-300 transition-all cursor-pointer"
              >
                <Minus className="size-3" />
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize(win.id);
                }}
                title={win.maximized ? 'Restaurar' : 'Maximizar'}
                aria-label="Maximizar ou restaurar janela"
                className="flex size-5.5 items-center justify-center rounded border border-zinc-700/60 bg-[#1a1e2c] text-zinc-400 hover:border-amber-500/60 hover:bg-amber-500/20 hover:text-amber-300 transition-all cursor-pointer"
              >
                <Square className="size-2.5" />
              </button>
            </>
          )}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onClose(win.id);
            }}
            title="Fechar"
            aria-label="Fechar janela"
            className="flex size-6 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/30 transition-all cursor-pointer active:scale-90"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-[#0a0c10]">
        <AppContent appId={win.appId} onOpenApp={onOpenApp} />
      </div>
    </div>
  );
}
