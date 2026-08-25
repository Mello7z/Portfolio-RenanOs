import { useState, useEffect } from 'react';
import { APPS, APP_ORDER, getLocalizedApp } from './AppsConfig';
import { AppIcon } from './AppIcon';
import type { AppId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Gamepad2,
  Briefcase,
  Zap,
  Smartphone,
  Wallet,
  Building2,
  Send,
  Wifi,
  Shield,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Lock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { cyberBank } from '../../utils/cyberBank';

interface MobileHomeGridProps {
  onOpenApp: (id: AppId) => void;
  openAppsSet: Set<AppId>;
}

export function MobileHomeGrid({ onOpenApp, openAppsSet }: MobileHomeGridProps) {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [balance, setBalance] = useState<number>(cyberBank.getBalance());
  const [vpnActive, setVpnActive] = useState<boolean>(true);
  const [soundActive, setSoundActive] = useState<boolean>(true);

  useEffect(() => {
    function handleState() {
      setBalance(cyberBank.getBalance());
    }
    window.addEventListener('renanos_cyber_state_changed', handleState);
    return () => window.removeEventListener('renanos_cyber_state_changed', handleState);
  }, []);

  const allApps = APP_ORDER.map((id) => getLocalizedApp(id, language));

  const GAME_IDS = ['memoria', 'bomba', 'arcade', 'snake', 'typing'];
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tools' | 'games'>('all');

  const filteredApps = allApps.filter(
    (app) =>
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.label.toLowerCase().includes(search.toLowerCase()) ||
      app.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const games = filteredApps.filter((app) => GAME_IDS.includes(app.id));
  const mainApps = filteredApps.filter((app) => !GAME_IDS.includes(app.id));

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-12 pb-20 select-none font-mono">
      {/* Mobile Header Widget */}
      <div className="mx-auto max-w-md mb-4 rounded-3xl border border-amber-500/35 bg-[#0e111a]/90 p-4 shadow-2xl backdrop-blur-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-500/20 to-amber-900/30 text-amber-400 shadow-md">
              <AppIcon appId="dossie" className="size-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-wider">RenanOS Mobile</h2>
              <p className="text-[10px] text-amber-400/80">Smartphone Cyber OS v3.0</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> 5G Cyber • 100%
          </span>
        </div>

        {/* Quick App Launcher Shortcuts with Official App Icons */}
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
            <span>Atalhos Rápidos</span>
            <span className="text-[9px] text-amber-400/80 font-normal">Toque para abrir</span>
          </p>
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            <button
              onClick={() => onOpenApp('dossie')}
              className="p-2.5 rounded-2xl border border-amber-500/30 bg-[#141824] hover:bg-amber-500/15 text-amber-300 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              <AppIcon appId="dossie" className="size-5 text-amber-400" />
              <span className="font-bold truncate w-full text-center">Dossiê</span>
            </button>

            <button
              onClick={() => onOpenApp('curriculo')}
              className="p-2.5 rounded-2xl border border-amber-500/30 bg-[#141824] hover:bg-amber-500/15 text-amber-300 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              <AppIcon appId="curriculo" className="size-5 text-amber-400" />
              <span className="font-bold truncate w-full text-center">Currículo</span>
            </button>

            <button
              onClick={() => onOpenApp('registros')}
              className="p-2.5 rounded-2xl border border-purple-500/30 bg-[#141824] hover:bg-purple-500/15 text-purple-300 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              <AppIcon appId="registros" className="size-5 text-purple-400" />
              <span className="font-bold truncate w-full text-center">Galeria</span>
            </button>

            <button
              onClick={() => onOpenApp('terminal')}
              className="p-2.5 rounded-2xl border border-emerald-500/30 bg-[#141824] hover:bg-emerald-500/15 text-emerald-300 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              <AppIcon appId="terminal" className="size-5 text-emerald-400" />
              <span className="font-bold truncate w-full text-center">Terminal</span>
            </button>
          </div>
        </div>

        {/* Quick Search & Category Filter */}
        <div className="space-y-2 pt-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-amber-400/70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar aplicativo, jogo ou ferramenta..."
              className="w-full rounded-2xl border border-amber-500/20 bg-[#161a26] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 transition-all"
            />
          </div>

          <div className="flex gap-2 font-mono text-[11px]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-xl px-3 py-1 font-bold border transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#121622] text-zinc-400 border-border/40 hover:text-white'
              }`}
            >
              Todos ({filteredApps.length})
            </button>
            <button
              onClick={() => setSelectedCategory('tools')}
              className={`rounded-xl px-3 py-1 font-bold border transition-colors cursor-pointer ${
                selectedCategory === 'tools'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#121622] text-zinc-400 border-border/40 hover:text-white'
              }`}
            >
              Ferramentas ({mainApps.length})
            </button>
            <button
              onClick={() => setSelectedCategory('games')}
              className={`rounded-xl px-3 py-1 font-bold border transition-colors cursor-pointer ${
                selectedCategory === 'games'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#121622] text-zinc-400 border-border/40 hover:text-white'
              }`}
            >
              Jogos ({games.length})
            </button>
          </div>
        </div>
      </div>

      {/* NuCyber Bank Interactive Mobile Widget */}
      <div
        onClick={() => onOpenApp('browser')}
        className="mx-auto max-w-md mb-6 rounded-3xl border border-purple-500/40 bg-gradient-to-r from-[#170a2c] via-[#100720] to-[#0d041a] p-4 shadow-xl cursor-pointer hover:border-purple-400 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-[#8A05BE] to-[#C142F4] flex items-center justify-center font-extrabold text-white text-base shadow-md">
              Nu
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white">NuCyber Bank</span>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Ao Vivo
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                R$ {balance.toLocaleString('pt-BR')},00
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-purple-300 group-hover:underline flex items-center">
              Abrir App <ChevronRight className="size-3.5 text-purple-400" />
            </span>
          </div>
        </div>
      </div>

      {/* Apps Container */}
      <div className="mx-auto max-w-md space-y-6">
        {(selectedCategory === 'all' || selectedCategory === 'tools') && mainApps.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-3 px-1">
              <Briefcase className="size-4" /> Ferramentas & Sistema
            </div>
            <div className="grid grid-cols-4 gap-3">
              {mainApps.map((app) => {
                const isOpen = openAppsSet.has(app.id);
                return (
                  <button
                    key={app.id}
                    onClick={() => onOpenApp(app.id)}
                    className="group flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-transform active:scale-90 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="grid size-14 place-items-center rounded-2xl border border-amber-500/40 bg-[#111420] text-amber-400 shadow-xl transition-all group-hover:border-amber-400 group-hover:bg-[#1a2030] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.35)]">
                        <AppIcon appId={app.id} className="size-7" />
                      </div>
                      {isOpen && (
                        <span className="absolute -top-1 -right-1 size-3 rounded-full border-2 border-black bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-200 text-center leading-tight line-clamp-1 group-hover:text-amber-300">
                      {app.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Games Category */}
        {(selectedCategory === 'all' || selectedCategory === 'games') && games.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-3 px-1">
              <Gamepad2 className="size-4" /> Jogos Cyber
            </div>
            <div className="grid grid-cols-4 gap-3">
              {games.map((app) => {
                const isOpen = openAppsSet.has(app.id);
                return (
                  <button
                    key={app.id}
                    onClick={() => onOpenApp(app.id)}
                    className="group flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-transform active:scale-90 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="grid size-14 place-items-center rounded-2xl border border-amber-500/40 bg-[#111420] text-amber-400 shadow-xl transition-all group-hover:border-amber-400 group-hover:bg-[#1a2030] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.35)]">
                        <AppIcon appId={app.id} className="size-7" />
                      </div>
                      {isOpen && (
                        <span className="absolute -top-1 -right-1 size-3 rounded-full border-2 border-black bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-200 text-center leading-tight line-clamp-1 group-hover:text-amber-300">
                      {app.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
