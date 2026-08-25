import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useClock, formatTime, formatFullDate } from '../../hooks/useClock';
import { safeStorage } from '../../utils/storage';
import { useLanguage } from '../../context/LanguageContext';

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const now = useClock();
  const { language, t } = useLanguage();

  const [wallpaper, setWallpaper] = useState<string>(() => {
    return safeStorage.getItem('renanos_wallpaper') || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
  });

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

  const isGradient = wallpaper.startsWith('linear-gradient') || wallpaper.startsWith('radial-gradient');

  return (
    <button
      onClick={onUnlock}
      className="group fixed inset-0 z-40 flex w-full cursor-pointer flex-col items-center justify-between bg-[#0a0c10] px-6 py-14 text-center select-none overflow-hidden"
      aria-label="Desbloquear sistema"
    >
      {/* Background Image / Gradient */}
      {isGradient ? (
        <div className="absolute inset-0 h-full w-full" style={{ background: wallpaper }} />
      ) : (
        <img
          src={wallpaper}
          alt="Lockscreen Wallpaper"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
          }}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Top clock */}
      <div className="relative flex flex-col items-center gap-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-amber-400 font-semibold">
          {language === 'pt' ? 'Sistema Bloqueado' : 'System Locked'}
        </span>
        <h1 className="font-mono text-7xl leading-none font-bold text-foreground text-glow tabular-nums md:text-8xl">
          {now ? formatTime(now) : '--:--'}
        </h1>
        <p className="font-mono text-sm capitalize text-foreground/80 mt-1">
          {now ? formatFullDate(now) : ''}
        </p>
      </div>

      {/* Identity card */}
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative size-20 overflow-hidden rounded-full border-2 border-amber-500/60 bg-card/80 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] backdrop-blur-md">
          <img
            src="/renan.png"
            alt="Renan Mello"
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src.includes('/renan.png') && !img.src.includes('/wallpapers/renan.png')) {
                img.src = '/wallpapers/renan.png';
              } else if (img.src.includes('/wallpapers/renan.png')) {
                img.src = '/avatar.png';
              }
            }}
          />
        </div>
        <div>
          <p className="font-mono text-2xl font-bold tracking-wide text-foreground">
            RENAN MELLO
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400/90 mt-1">
            {language === 'pt' ? 'Sistemas de Informação · Dev & Cyber' : 'Information Systems · Dev & Cyber'}
          </p>
        </div>
      </div>

      {/* Touch to unlock hint */}
      <div className="relative flex flex-col items-center gap-1 text-foreground/80 transition-transform duration-300 group-hover:-translate-y-1">
        <ChevronUp className="size-5 animate-bounce text-amber-400" />
        <span className="font-mono text-xs uppercase tracking-[0.3em]">
          {t('lock.unlockInstruction')}
        </span>
      </div>
    </button>
  );
}
