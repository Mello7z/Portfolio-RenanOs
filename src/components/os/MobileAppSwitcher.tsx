import { X, Layers, Smartphone, Play, Trash2, Home, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { APPS, getLocalizedApp } from './AppsConfig';
import { AppIcon } from './AppIcon';
import type { WindowState, AppId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MobileAppSwitcherProps {
  windows: WindowState[];
  activeAppId: AppId | null;
  onSelectApp: (id: string) => void;
  onCloseApp: (id: string) => void;
  onCloseSwitcher: () => void;
  onCloseAll: () => void;
  onOpenApp?: (id: AppId) => void;
}

export function MobileAppSwitcher({
  windows,
  activeAppId,
  onSelectApp,
  onCloseApp,
  onCloseSwitcher,
  onCloseAll,
  onOpenApp,
}: MobileAppSwitcherProps) {
  const { language } = useLanguage();
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#07090e]/95 p-4 text-white font-mono backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Smartphone Status & Header */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Smartphone className="size-4" />
          </div>
          <div>
            <h2 className="font-bold text-xs text-white tracking-wider uppercase">
              Gerenciador de Abas Mobile
            </h2>
            <p className="text-[10px] text-amber-400/80">
              {windows.length} {windows.length === 1 ? 'app em segundo plano' : 'apps em segundo plano'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {windows.length > 0 && (
            <button
              onClick={() => {
                onCloseAll();
                onCloseSwitcher();
              }}
              className="flex items-center gap-1 rounded-xl border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="size-3.5" /> Fechar Todos
            </button>
          )}
          <button
            onClick={onCloseSwitcher}
            className="grid size-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Cards Multitasking List */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {windows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-10 max-w-sm mx-auto">
            <div className="grid size-20 place-items-center rounded-3xl border border-amber-500/30 bg-[#121622] text-amber-400 shadow-2xl">
              <Layers className="size-10 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white mb-1">Nenhum aplicativo aberto</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Escolha um aplicativo abaixo para iniciar rapidamente no modo celular.
              </p>
            </div>

            {/* Quick App Launcher Shortcuts */}
            <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
              <button
                onClick={() => {
                  onCloseSwitcher();
                  if (onOpenApp) onOpenApp('dossie');
                }}
                className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-[#121622] p-3 text-left hover:border-amber-400 active:scale-95 transition-all cursor-pointer"
              >
                <ShieldCheck className="size-5 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-zinc-200 truncate">Dossiê</span>
              </button>

              <button
                onClick={() => {
                  onCloseSwitcher();
                  if (onOpenApp) onOpenApp('browser');
                }}
                className="flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-[#161028] p-3 text-left hover:border-purple-400 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="size-5 text-purple-400 shrink-0" />
                <span className="text-xs font-bold text-zinc-200 truncate">NuCyber Bank</span>
              </button>

              <button
                onClick={() => {
                  onCloseSwitcher();
                  if (onOpenApp) onOpenApp('terminal');
                }}
                className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-[#0e1c16] p-3 text-left hover:border-emerald-400 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="size-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-zinc-200 truncate">Terminal</span>
              </button>

              <button
                onClick={() => {
                  onCloseSwitcher();
                  if (onOpenApp) onOpenApp('bomba');
                }}
                className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-[#1a0e12] p-3 text-left hover:border-red-400 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="size-5 text-red-400 shrink-0" />
                <span className="text-xs font-bold text-zinc-200 truncate">Campo Minado</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {windows.map((win) => {
              const meta = getLocalizedApp(win.appId, language);
              const isActive = win.appId === activeAppId && !win.minimized;

              return (
                <div
                  key={win.id}
                  onClick={() => {
                    onSelectApp(win.id);
                    onCloseSwitcher();
                  }}
                  className={`relative flex flex-col rounded-3xl border p-4 transition-all cursor-pointer shadow-xl active:scale-98 overflow-hidden group ${
                    isActive
                      ? 'border-amber-400 bg-gradient-to-b from-[#1a1f30] to-[#101422] shadow-[0_0_25px_rgba(251,191,36,0.25)]'
                      : 'border-amber-500/30 bg-[#10131d] hover:border-amber-500/60 hover:bg-[#141926]'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-8 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
                        <AppIcon appId={win.appId} className="size-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-white block leading-tight">{meta.title}</span>
                        <span className="text-[10px] text-zinc-400">
                          {isActive ? 'Ativo na tela' : 'Em segundo plano'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseApp(win.id);
                      }}
                      className="grid size-8 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/30 active:scale-90 transition-all cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* Mock Screenshot / Preview Frame */}
                  <div className="rounded-2xl border border-white/10 bg-[#080a0f] p-3 mb-3 text-xs text-zinc-400 h-24 overflow-hidden relative font-mono">
                    <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 mb-2 text-[10px] text-amber-400/80 font-bold">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      {meta.subtitle}
                    </div>
                    <p className="text-[11px] leading-snug line-clamp-2 text-zinc-300">
                      {meta.subtitle}
                    </p>
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#080a0f] to-transparent pointer-events-none" />
                  </div>

                  {/* Card Footer Action */}
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                      <Play className="size-3 fill-amber-400" /> Alternar para App
                    </span>
                    <span className="rounded-xl bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-300 flex items-center gap-1 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                      Abrir <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Switcher Control Bar */}
      <div className="border-t border-amber-500/20 pt-3 text-center">
        <button
          onClick={onCloseSwitcher}
          className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/20 py-2.5 font-bold text-xs text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all cursor-pointer shadow-lg"
        >
          <Home className="size-4" /> Voltar para a Tela Inicial
        </button>
      </div>
    </div>
  );
}

