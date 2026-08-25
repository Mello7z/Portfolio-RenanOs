import { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Wifi,
  BatteryFull,
  Radio,
  Lock,
  RotateCcw,
  User,
  Terminal,
  FolderOpen,
  X,
  Info,
  Layers,
  HelpCircle,
  Minimize2,
  Maximize2,
  Code2,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Globe,
} from 'lucide-react';
import { useClock, formatTime } from '../../hooks/useClock';
import { APPS } from './AppsConfig';
import type { AppId, WindowState } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface TopBarProps {
  activeApp: AppId | null;
  windows: WindowState[];
  onLock: () => void;
  onReboot: () => void;
  onOpenApp: (id: AppId) => void;
  onFocusWindow: (id: string) => void;
  onMinimizeAll: () => void;
  onCloseAll: () => void;
  onOpenWallpaperModal?: () => void;
  isMobileMode?: boolean;
  onToggleMobileMode?: () => void;
}

type MenuType = 'sistema' | 'janelas' | 'ajuda' | 'wifi' | null;

export function TopBar({
  activeApp,
  windows,
  onLock,
  onReboot,
  onOpenApp,
  onFocusWindow,
  onMinimizeAll,
  onCloseAll,
  onOpenWallpaperModal,
  isMobileMode,
  onToggleMobileMode,
}: TopBarProps) {
  const now = useClock();
  const { language, toggleLanguage, t } = useLanguage();
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleMenu(menu: MenuType) {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  }

  const activeWin = windows.find((w) => w.appId === activeApp && !w.minimized);

  return (
    <>
      <header
        ref={navRef}
        className="absolute inset-x-0 top-0 z-40 flex h-9 items-center justify-between border-b border-border/60 bg-black/80 px-3.5 backdrop-blur-xl select-none"
      >
        <div className="flex items-center gap-3">
          {/* Logo / System Menu Trigger */}
          <button
            onClick={() => toggleMenu('sistema')}
            className="flex items-center gap-1.5 rounded px-2 py-1 transition-colors hover:bg-white/10 cursor-pointer"
            title="Menu do Sistema"
            aria-label="Abrir menu do sistema"
          >
            <ShieldCheck className="size-4 text-amber-400" />
            <span className="font-mono text-xs font-bold tracking-wider text-foreground">
              RENAN<span className="text-amber-400">·</span>OS
            </span>
          </button>

          <nav className="flex items-center gap-1 font-mono text-xs">
            {/* Quick Dossiê Link */}
            <button
              onClick={() => onOpenApp('dossie')}
              className={`rounded px-2 py-1 transition-colors hover:text-amber-300 cursor-pointer ${
                activeApp === 'dossie'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-zinc-300 hover:bg-white/10'
              }`}
            >
              Dossiê
            </button>

            {/* Sistema Menu Button */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('sistema')}
                className={`rounded px-2 py-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer ${
                  openMenu === 'sistema' ? 'bg-white/10 text-foreground' : ''
                }`}
              >
                {t('topbar.system')}
              </button>

              {openMenu === 'sistema' && (
                <div className="absolute left-0 top-8 z-50 min-w-[210px] rounded-lg border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl font-mono text-xs text-foreground space-y-0.5">
                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      setShowAboutModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-amber-500/15 hover:text-amber-300 transition-colors text-left cursor-pointer"
                  >
                    <Info className="size-3.5 text-amber-400" /> {t('topbar.about')}
                  </button>
                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenApp('dossie');
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-amber-500/15 hover:text-amber-300 transition-colors text-left cursor-pointer"
                  >
                    <User className="size-3.5 text-amber-400" /> {language === 'pt' ? 'Dossiê Profissional' : 'Professional Dossier'}
                  </button>
                  {onOpenWallpaperModal && (
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        onOpenWallpaperModal();
                      }}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-amber-500/15 hover:text-amber-300 transition-colors text-left cursor-pointer"
                    >
                      <ImageIcon className="size-3.5 text-amber-400" /> {t('topbar.wallpaper')}
                    </button>
                  )}
                  <div className="my-1 border-t border-border/60" />
                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      onLock();
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-amber-500/15 hover:text-amber-300 transition-colors text-left cursor-pointer"
                  >
                    <Lock className="size-3.5 text-amber-400" /> {t('topbar.lock')}
                  </button>
                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      onReboot();
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-red-500/15 hover:text-red-400 transition-colors text-left cursor-pointer"
                  >
                    <RotateCcw className="size-3.5 text-red-400" /> {t('topbar.reboot')}
                  </button>
                </div>
              )}
            </div>

            {/* Janelas Menu Button */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('janelas')}
                className={`rounded px-2 py-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer ${
                  openMenu === 'janelas' ? 'bg-white/10 text-foreground' : ''
                }`}
              >
                {t('topbar.windows')} {windows.length > 0 && `(${windows.length})`}
              </button>

              {openMenu === 'janelas' && (
                <div className="absolute left-0 top-8 z-50 min-w-[220px] rounded-lg border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl font-mono text-xs text-foreground space-y-0.5">
                  <p className="px-2.5 py-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    {t('topbar.openWindows')}
                  </p>

                  {windows.length === 0 ? (
                    <p className="px-2.5 py-1.5 text-muted-foreground italic text-[11px]">
                      {t('topbar.noWindows')}
                    </p>
                  ) : (
                    windows.map((win) => (
                      <button
                        key={win.id}
                        onClick={() => {
                          setOpenMenu(null);
                          onFocusWindow(win.id);
                        }}
                        className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 transition-colors text-left cursor-pointer ${
                          win.appId === activeApp && !win.minimized
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate flex items-center gap-2">
                          <Layers className="size-3 text-amber-400 shrink-0" />
                          {APPS[win.appId].label}
                        </span>
                        {win.minimized && (
                          <span className="text-[10px] text-muted-foreground">(min)</span>
                        )}
                      </button>
                    ))
                  )}

                  <div className="my-1 border-t border-border/60" />

                  <button
                    disabled={windows.length === 0}
                    onClick={() => {
                      setOpenMenu(null);
                      onMinimizeAll();
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-white/10 transition-colors text-left disabled:opacity-40 cursor-pointer"
                  >
                    <Minimize2 className="size-3.5 text-amber-400" /> {t('topbar.minimizeAll')}
                  </button>

                  <button
                    disabled={windows.length === 0}
                    onClick={() => {
                      setOpenMenu(null);
                      onCloseAll();
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-red-500/15 hover:text-red-400 transition-colors text-left disabled:opacity-40 cursor-pointer"
                  >
                    <X className="size-3.5 text-red-400" /> {t('topbar.closeAll')}
                  </button>
                </div>
              )}
            </div>

            {/* Ajuda Menu Button */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('ajuda')}
                className={`rounded px-2 py-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer ${
                  openMenu === 'ajuda' ? 'bg-white/10 text-foreground' : ''
                }`}
              >
                {t('topbar.help')}
              </button>

              {openMenu === 'ajuda' && (
                <div className="absolute left-0 top-8 z-50 min-w-[210px] rounded-lg border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl font-mono text-xs text-foreground space-y-0.5">
                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenApp('terminal');
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-amber-500/15 hover:text-amber-300 transition-colors text-left cursor-pointer"
                  >
                    <Terminal className="size-3.5 text-amber-400" /> {t('topbar.terminalHelp')}
                  </button>
                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenApp('sinal');
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-amber-500/15 hover:text-amber-300 transition-colors text-left cursor-pointer"
                  >
                    <Radio className="size-3.5 text-amber-400" /> {t('topbar.contactHelp')}
                  </button>
                  <div className="my-1 border-t border-border/60" />
                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      setShowHelpModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-amber-500/15 hover:text-amber-300 transition-colors text-left cursor-pointer"
                  >
                    <HelpCircle className="size-3.5 text-amber-400" /> {t('topbar.systemGuide')}
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right System Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs text-foreground/80">
          {/* Language Selector Button (Replaces ONLINE) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/80 px-2.5 py-1 text-[11px] font-bold text-foreground hover:border-amber-500/50 hover:bg-amber-500/15 hover:text-amber-300 active:scale-95 transition-all cursor-pointer shadow-sm"
            title={language === 'pt' ? 'Alternar para Inglês (Switch to English)' : 'Alternar para Português (Switch to Portuguese)'}
            aria-label="Alternar Idioma"
          >
            <Globe className="size-3.5 text-amber-400" />
            <span className="font-mono tracking-wider">{language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded bg-secondary/80 px-1.5 py-0.5 text-[11px] text-muted-foreground border border-border/60"
              title="Rede Wifi: 100% Sinal"
            >
              <Wifi className="size-3 text-emerald-400" />
            </span>
            <span
              className="inline-flex items-center gap-1 rounded bg-secondary/80 px-1.5 py-0.5 text-[11px] text-muted-foreground border border-border/60"
              title="Bateria: 100% Carregada"
            >
              <BatteryFull className="size-3.5 text-emerald-400" />
            </span>
          </div>

          {/* Mobile / Desktop View Mode Toggle Button */}
          {onToggleMobileMode && (
            <button
              onClick={onToggleMobileMode}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold border transition-all cursor-pointer ${
                isMobileMode
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                  : 'border-border/60 bg-secondary/60 text-zinc-300 hover:bg-white/10 hover:text-amber-300'
              }`}
              title={isMobileMode ? 'Modo Smartphone Ativo (Toque para Desktop)' : 'Modo Computador Ativo (Toque para Smartphone)'}
              aria-label="Alternar modo de exibição entre Celular e Computador"
            >
              {isMobileMode ? (
                <>
                  <Smartphone className="size-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Celular</span>
                </>
              ) : (
                <>
                  <Monitor className="size-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Desktop</span>
                </>
              )}
            </button>
          )}

          {/* Quick Lock Button */}
          <button
            onClick={onLock}
            className="flex items-center gap-1 rounded px-2 py-1 text-muted-foreground transition-colors hover:text-red-400 hover:bg-white/10 cursor-pointer"
            title="Bloquear Sistema"
            aria-label="Bloquear sistema"
          >
            <Lock className="size-3.5" />
          </button>

          {/* Clock Display */}
          <span className="tabular-nums font-bold text-foreground bg-secondary/60 px-2 py-0.5 rounded border border-border/40">
            {now ? formatTime(now) : '--:--'}
          </span>
        </div>
      </header>

      {/* About RenanOS Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-4 select-none">
          <div className="w-full max-w-md rounded-xl border border-amber-500/40 bg-card/95 p-5 shadow-2xl font-mono text-foreground space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg border border-amber-500/50 bg-amber-500/10 text-amber-400">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-400">RenanOS v3.0</h3>
                  <p className="text-xs text-muted-foreground">Sistema Operacional Pessoal</p>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="rounded-lg border border-border bg-secondary/40 p-3 text-xs space-y-1.5">
              <p>
                <span className="text-amber-400 font-bold">Desenvolvedor:</span> Renan Mello
              </p>
              <p>
                <span className="text-amber-400 font-bold">Formação:</span> Sistemas de Informação
              </p>
              <p>
                <span className="text-amber-400 font-bold">Foco:</span> Full-Stack, IA & Cybersecurity
              </p>
              <p>
                <span className="text-amber-400 font-bold">Atuação:</span> FAPESP (Processos Digitais)
              </p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed font-sans italic">
              "Ambiente tático interativo projetado para apresentar habilidades, projetos reais e trajetórias de forma inovadora."
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowAboutModal(false);
                  onOpenApp('dossie');
                }}
                className="inline-flex items-center gap-1.5 rounded bg-amber-500 px-3 py-1.5 text-xs font-bold text-black transition-opacity hover:opacity-90 cursor-pointer"
              >
                <User className="size-3.5" /> Abrir Dossiê
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-4 select-none">
          <div className="w-full max-w-md rounded-xl border border-amber-500/40 bg-card/95 p-5 shadow-2xl font-mono text-foreground space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <HelpCircle className="size-5" />
                <h3>Guia Rápido do RenanOS</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="rounded border border-border bg-secondary/40 p-2.5 space-y-1">
                <p className="font-bold text-amber-400">📌 Navegação por Aplicativos:</p>
                <p className="text-muted-foreground">
                  Use os ícones na área de trabalho ou na barra inferior (Dock) para abrir os módulos.
                </p>
              </div>

              <div className="rounded border border-border bg-secondary/40 p-2.5 space-y-1">
                <p className="font-bold text-amber-400">🕹️ Controle de Janelas:</p>
                <p className="text-muted-foreground">
                  O botão vermelho fecha, o amarelo minimiza e o verde maximiza/restaura. Você também pode arrastar as janelas pela barra de título.
                </p>
              </div>

              <div className="rounded border border-border bg-secondary/40 p-2.5 space-y-1">
                <p className="font-bold text-amber-400">💻 Shell Interativo:</p>
                <p className="text-muted-foreground">
                  Abra o aplicativo <span className="text-amber-300">Terminal</span> e digite <span className="text-amber-300">"ajuda"</span> para explorar comandos interativos.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowHelpModal(false)}
                className="rounded border border-border bg-secondary px-3 py-1.5 text-xs text-foreground hover:bg-secondary/80 cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
