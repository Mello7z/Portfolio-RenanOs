import { APPS, APP_ORDER, getLocalizedApp } from './AppsConfig';
import { AppIcon } from './AppIcon';
import type { AppId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export function Dock({
  onOpen,
  openApps,
}: {
  onOpen: (id: AppId) => void;
  openApps: Set<AppId>;
}) {
  const { language } = useLanguage();
  const items = APP_ORDER.filter((id) => APPS[id].inDock);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center px-3 select-none">
      <div className="pointer-events-auto flex items-end gap-1.5 rounded-2xl border border-amber-500/20 bg-[#0c0e14]/85 px-3 py-2 backdrop-blur-xl shadow-2xl sm:gap-2">
        {items.map((id) => {
          const meta = getLocalizedApp(id, language);
          const isOpen = openApps.has(id);
          return (
            <button
              key={id}
              onClick={() => onOpen(id)}
              title={meta.label}
              aria-label={meta.label}
              className="group relative flex flex-col items-center cursor-pointer"
            >
              <span
                className={`grid size-11 place-items-center rounded-xl border border-border/80 bg-[#131722] text-amber-400 transition-all duration-200 sm:size-12 group-hover:-translate-y-1 group-hover:border-amber-400/80 group-hover:bg-[#1a1f2e] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]`}
              >
                <AppIcon appId={id} className="size-5 sm:size-6" />
              </span>
              <span className="pointer-events-none absolute -top-9 rounded-md border border-amber-500/30 bg-[#10131b] px-2 py-1 font-mono text-[11px] whitespace-nowrap text-zinc-200 opacity-0 transition-opacity group-hover:opacity-100 shadow-xl">
                {meta.label}
              </span>
              <span
                className={`mt-1 size-1 rounded-full transition-colors ${
                  isOpen ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
