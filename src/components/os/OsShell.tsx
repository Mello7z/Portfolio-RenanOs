import { useState, useEffect, type MouseEvent } from 'react';
import type { AppId, WindowState } from '../../types';
import { safeStorage } from '../../utils/storage';
import { APPS } from './AppsConfig';
import { TopBar } from './TopBar';
import { DesktopIcons } from './DesktopIcons';
import { Dock } from './Dock';
import { WindowFrame } from './WindowFrame';
import { LockScreen } from './LockScreen';
import { BootScreen } from './BootScreen';
import { WallpaperModal } from './WallpaperModal';
import { MobileHomeGrid } from './MobileHomeGrid';
import { MobileBottomBar } from './MobileBottomBar';
import { MobileAppSwitcher } from './MobileAppSwitcher';
import {
  Image,
  Layers,
  RefreshCw,
  Grid2X2,
  Brain,
  Bomb,
  Gamepad2,
  NotebookPen,
  MousePointer2,
  Smartphone,
  Monitor,
} from 'lucide-react';

export function OsShell() {
  const [booting, setBooting] = useState(true);
  const [locked, setLocked] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [topZ, setTopZ] = useState(10);

  // Icon position reset trigger
  const [resetIconTrigger, setResetIconTrigger] = useState<number>(0);

  // Mobile mode state with automatic mobile device detection
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
    return window.innerWidth < 768 || isMobileUA || isTouch;
  });
  const [mobileOverride, setMobileOverride] = useState<boolean | null>(null);
  const [showMobileSwitcher, setShowMobileSwitcher] = useState<boolean>(false);

  // Detect window resize for mobile breakpoint (< 768px)
  useEffect(() => {
    function handleResize() {
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
      setIsSmallScreen(window.innerWidth < 768 || isMobileUA || isTouch);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = mobileOverride !== null ? mobileOverride : isSmallScreen;

  // Custom Cursor mouse tracker
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isPointerVisible, setIsPointerVisible] = useState<boolean>(true);

  // Wallpaper state with safeStorage persistence
  const [wallpaper, setWallpaper] = useState<string>(() => {
    return safeStorage.getItem('renanos_wallpaper') || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
  });
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);

  // Listen for global wallpaper changes
  useEffect(() => {
    function handleWallpaperChange(e: Event) {
      const customEv = e as CustomEvent<string>;
      const newWp = customEv.detail || safeStorage.getItem('renanos_wallpaper') || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
      if (newWp) {
        setWallpaper(newWp);
      }
    }
    window.addEventListener('renanos_wallpaper_changed', handleWallpaperChange);
    return () => window.removeEventListener('renanos_wallpaper_changed', handleWallpaperChange);
  }, []);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    safeStorage.setItem('renanos_wallpaper', wallpaper);
  }, [wallpaper]);

  // Track global mouse position for custom tactical mouse pointer
  useEffect(() => {
    function handleMouseMove(e: globalThis.MouseEvent) {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsPointerVisible(true);
    }
    function handleMouseLeave() {
      setIsPointerVisible(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  function handleDesktopContextMenu(e: MouseEvent) {
    // Only trigger if directly clicking desktop background
    if ((e.target as HTMLElement).getAttribute('data-desktop-bg')) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    } else {
      setContextMenu(null);
    }
  }

  function openApp(appId: AppId) {
    setContextMenu(null);
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      if (isMobileView) {
        setWindows((prev) =>
          prev.map((w) =>
            w.id === existing.id
              ? { ...w, minimized: false, z: topZ + 1 }
              : { ...w, minimized: true }
          )
        );
      } else {
        if (existing.minimized) {
          setWindows((prev) =>
            prev.map((w) => (w.id === existing.id ? { ...w, minimized: false, z: topZ + 1 } : w))
          );
        } else {
          setWindows((prev) =>
            prev.map((w) => (w.id === existing.id ? { ...w, z: topZ + 1 } : w))
          );
        }
      }
      setTopZ((z) => z + 1);
      return;
    }

    const meta = APPS[appId];
    const offset = (windows.length % 5) * 24;
    const isMobile = isMobileView;
    const defaultW = Math.min(meta.defaultSize.width, window.innerWidth - 32);
    const defaultH = Math.min(meta.defaultSize.height, window.innerHeight - 120);

    const newWin: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      x: isMobile ? 0 : Math.max(20, (window.innerWidth - defaultW) / 2 + offset),
      y: isMobile ? 36 : Math.max(50, (window.innerHeight - defaultH) / 2 + offset - 30),
      width: defaultW,
      height: defaultH,
      z: topZ + 1,
      minimized: false,
      maximized: isMobile,
    };

    setTopZ((z) => z + 1);
    if (isMobile) {
      setWindows((prev) => [...prev.map((w) => ({ ...w, minimized: true })), newWin]);
    } else {
      setWindows((prev) => [...prev, newWin]);
    }
  }

  function closeWindow(id: string) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }

  function minimizeWindow(id: string) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
  }

  function maximizeWindow(id: string) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    );
  }

  function focusWindow(id: string) {
    if (isMobileView) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, minimized: false, z: topZ + 1 }
            : { ...w, minimized: true }
        )
      );
    } else {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, z: topZ + 1 } : w))
      );
    }
    setTopZ((z) => z + 1);
  }

  function moveWindow(id: string, x: number, y: number) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  }

  function minimizeAll() {
    setWindows((prev) => prev.map((w) => ({ ...w, minimized: true })));
  }

  function closeAll() {
    setWindows([]);
  }

  const openAppsSet = new Set<AppId>(windows.filter((w) => !w.minimized).map((w) => w.appId));

  const activeWindow = [...windows]
    .filter((w) => !w.minimized)
    .sort((a, b) => b.z - a.z)[0];

  const isGradient = wallpaper.startsWith('radial-gradient') || wallpaper.startsWith('linear-gradient');

  return (
    <div
      onClick={() => setContextMenu(null)}
      className="relative h-screen w-screen overflow-hidden bg-black select-none font-sans"
    >
      {/* Custom Tactical Arrow Mouse Pointer (Desktop Only) */}
      {!isMobileView && isPointerVisible && (
        <div
          className="pointer-events-none fixed z-[9999] transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          }}
        >
          <div className="relative">
            {/* Glowing Arrow Pointer SVG */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_10px_rgba(251,191,36,0.85)] filter"
            >
              <path
                d="M2 2L10.5 24L14.8 14.8L24 10.5L2 2Z"
                fill="#fbbf24"
                stroke="#000000"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M4.8 5.8L11.2 19.8L14.1 14.1L19.8 11.2L4.8 5.8Z"
                fill="#0e111a"
              />
              <path
                d="M6 7L11.5 18L13.5 13.5L18 11.5L6 7Z"
                fill="#fbbf24"
                fillOpacity="0.3"
              />
            </svg>
            {/* Subtle pulse trail dot */}
            <div className="absolute top-0 left-0 size-1 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,1)]" />
          </div>
        </div>
      )}

      {booting && <BootScreen onDone={() => setBooting(false)} />}

      {!booting && locked && <LockScreen onUnlock={() => setLocked(false)} />}

      {!booting && (
        <div
          data-desktop-bg="true"
          onContextMenu={handleDesktopContextMenu}
          className="relative h-full w-full overflow-hidden bg-[#0a0c10] transition-all duration-500"
        >
          {/* Wallpaper background element */}
          {isGradient ? (
            <div
              data-desktop-bg="true"
              className="absolute inset-0 h-full w-full"
              style={{ background: wallpaper }}
            />
          ) : (
            <img
              data-desktop-bg="true"
              src={wallpaper}
              alt="Desktop Background"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
                safeStorage.setItem('renanos_wallpaper', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80');
              }}
            />
          )}

          {/* Subtle overlay */}
          <div data-desktop-bg="true" className="absolute inset-0 bg-black/35 backdrop-blur-[1px] pointer-events-none" />

          {/* Top system bar */}
          <TopBar
            activeApp={activeWindow ? activeWindow.appId : null}
            windows={windows}
            onLock={() => setLocked(true)}
            onReboot={() => setBooting(true)}
            onOpenApp={openApp}
            onFocusWindow={focusWindow}
            onMinimizeAll={minimizeAll}
            onCloseAll={closeAll}
            onOpenWallpaperModal={() => setShowWallpaperModal(true)}
            isMobileMode={isMobileView}
            onToggleMobileMode={() => setMobileOverride((prev) => (prev === null ? !isSmallScreen : !prev))}
          />

          {/* Desktop or Mobile Home Layout */}
          {isMobileView ? (
            <div className="relative flex flex-col h-full w-full pt-9 pb-14 overflow-hidden">
              {/* Show Mobile Home Launcher if all windows are minimized or no windows exist */}
              {(!activeWindow || windows.every((w) => w.minimized)) && (
                <MobileHomeGrid onOpenApp={openApp} openAppsSet={openAppsSet} />
              )}

              {/* Active Mobile Application Windows */}
              {windows.map((win) => (
                <WindowFrame
                  key={win.id}
                  win={win}
                  onClose={closeWindow}
                  onMinimize={minimizeWindow}
                  onMaximize={maximizeWindow}
                  onFocus={focusWindow}
                  onMove={moveWindow}
                  isMobile={true}
                  onOpenApp={openApp}
                />
              ))}

              {/* Mobile Bottom Navigation Bar */}
              <MobileBottomBar
                openAppsCount={windows.length}
                onHome={minimizeAll}
                onBack={() => {
                  if (activeWindow) {
                    minimizeWindow(activeWindow.id);
                  }
                }}
                onToggleAppSwitcher={() => setShowMobileSwitcher(true)}
                onLock={() => setLocked(true)}
                activeApp={activeWindow ? activeWindow.appId : null}
              />

              {/* Mobile App Switcher Overlay */}
              {showMobileSwitcher && (
                <MobileAppSwitcher
                  windows={windows}
                  activeAppId={activeWindow ? activeWindow.appId : null}
                  onSelectApp={(id) => focusWindow(id)}
                  onCloseApp={(id) => closeWindow(id)}
                  onCloseSwitcher={() => setShowMobileSwitcher(false)}
                  onCloseAll={closeAll}
                  onOpenApp={openApp}
                />
              )}
            </div>
          ) : (
            <>
              {/* Desktop shortcut icons */}
              <DesktopIcons onOpen={openApp} resetTrigger={resetIconTrigger} />

              {/* Active open window frames */}
              {windows.map((win) => (
                <WindowFrame
                  key={win.id}
                  win={win}
                  onClose={closeWindow}
                  onMinimize={minimizeWindow}
                  onMaximize={maximizeWindow}
                  onFocus={focusWindow}
                  onMove={moveWindow}
                  onOpenApp={openApp}
                />
              ))}

              {/* Bottom dock bar */}
              <Dock onOpen={openApp} openApps={openAppsSet} />
            </>
          )}

          {/* Desktop Right-Click Context Menu */}
          {contextMenu && (
            <div
              style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
              className="fixed z-50 min-w-[220px] rounded-2xl border border-amber-500/40 bg-[#0e111a]/95 p-2 shadow-2xl backdrop-blur-xl font-mono text-xs text-zinc-200 space-y-1 animate-in fade-in duration-150"
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/80 border-b border-border/40 pb-1.5 flex items-center gap-1.5">
                <MousePointer2 className="size-3" /> Menu do Sistema OS
              </div>

              <button
                onClick={() => {
                  setContextMenu(null);
                  setMobileOverride((prev) => (prev === null ? !isSmallScreen : !prev));
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
              >
                {isMobileView ? (
                  <>
                    <Monitor className="size-4 text-amber-400" /> Mudar para Modo Desktop
                  </>
                ) : (
                  <>
                    <Smartphone className="size-4 text-amber-400" /> Mudar para Modo Smartphone
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setContextMenu(null);
                  setResetIconTrigger((t) => t + 1);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Grid2X2 className="size-4 text-amber-400" /> Organizar em 2 Fileiras
              </button>

              <button
                onClick={() => {
                  setContextMenu(null);
                  setShowWallpaperModal(true);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Image className="size-4 text-amber-400" /> Trocar Fundo de Tela
              </button>

              <div className="my-1 border-t border-border/40" />

              <div className="px-2 pt-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Jogos & Aplicativos
              </div>

              <button
                onClick={() => {
                  setContextMenu(null);
                  openApp('memoria');
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Brain className="size-4 text-amber-400" /> Jogo da Memória
              </button>

              <button
                onClick={() => {
                  setContextMenu(null);
                  openApp('bomba');
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Bomb className="size-4 text-amber-400" /> Campo Minado (Bomba)
              </button>

              <button
                onClick={() => {
                  setContextMenu(null);
                  openApp('arcade');
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Gamepad2 className="size-4 text-amber-400" /> Protocolo Arcade
              </button>

              <div className="my-1 border-t border-border/40" />

              <button
                onClick={() => {
                  setContextMenu(null);
                  openApp('diario');
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <NotebookPen className="size-4 text-amber-400" /> Abrir Diário / Notas
              </button>

              <button
                onClick={() => {
                  setContextMenu(null);
                  openApp('dossie');
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Layers className="size-4 text-amber-400" /> Abrir Dossiê
              </button>

              <div className="my-1 border-t border-border/40" />

              <button
                onClick={() => {
                  setContextMenu(null);
                  minimizeAll();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="size-4 text-amber-400" /> Minimizar Janelas
              </button>
            </div>
          )}

          {/* Wallpaper Selection Modal */}
          {showWallpaperModal && (
            <WallpaperModal
              currentWallpaper={wallpaper}
              onSelectWallpaper={(newWp) => {
                setWallpaper(newWp);
                try {
                  safeStorage.setItem('renanos_wallpaper', newWp);
                } catch {
                  // Storage quota fallback
                }
                window.dispatchEvent(new CustomEvent('renanos_wallpaper_changed', { detail: newWp }));
              }}
              onClose={() => setShowWallpaperModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

