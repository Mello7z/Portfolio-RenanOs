import { useState, useEffect, type ChangeEvent, type FormEvent, type MouseEvent } from 'react';
import {
  Image as ImageIcon,
  Check,
  Upload,
  Link as LinkIcon,
  Sparkles,
  RefreshCw,
  Trash2,
  Plus,
  Lock,
  Maximize2,
  X,
  Eye,
} from 'lucide-react';
import { safeStorage } from '../../utils/storage';

export interface WallpaperItem {
  id: string;
  name: string;
  category: 'Oficial' | 'Heróis & Cinema' | 'Animes & Gaming' | 'Super Carros' | 'Cyberpunk & Natureza' | 'Meus Uploads';
  url: string;
  thumbnail?: string;
  fallbackUrl?: string;
  isCustom?: boolean;
}

export const WALLPAPER_CATALOG: WallpaperItem[] = [
  // Oficiais
  {
    id: 'off-1',
    name: 'Base RenanOS — Padrão Systema',
    category: 'Oficial',
    url: '/wallpapers/wallpaper.png',
    fallbackUrl: '/wallpaper.png',
  },
  {
    id: 'off-2',
    name: 'Workstation Nightbuild — Operações',
    category: 'Oficial',
    url: '/wallpapers/reg-1.png',
    fallbackUrl: '/reg-1.png',
  },
  {
    id: 'off-3',
    name: 'Patrulha Noturna — Visão Urbana',
    category: 'Oficial',
    url: '/wallpapers/reg-2.png',
    fallbackUrl: '/reg-2.png',
  },
  {
    id: 'off-4',
    name: 'HUD de Monitoramento — Segurança',
    category: 'Oficial',
    url: '/wallpapers/reg-3.png',
    fallbackUrl: '/reg-3.png',
  },
  {
    id: 'off-5',
    name: 'Renan Mello — Perfil Tático',
    category: 'Oficial',
    url: '/wallpapers/renan.png',
    fallbackUrl: '/renan.png',
  },
  {
    id: 'off-6',
    name: 'Dossiê Avatar — Perfil OS',
    category: 'Oficial',
    url: '/wallpapers/avatar.png',
    fallbackUrl: '/avatar.png',
  },
  {
    id: 'off-7',
    name: 'Renan Mello — Foto Perfil (Icon Light)',
    category: 'Oficial',
    url: '/icon-light-32x32.png',
    fallbackUrl: '/wallpapers/icon-light-32x32.png',
  },

  // Heróis & Cinema
  {
    id: 'hero-1',
    name: 'Spider-Man Brand — Miles & Peter',
    category: 'Heróis & Cinema',
    url: '/wallpapers/spider-man-brand-3840x2160-26881.jpg',
    fallbackUrl: '/spider-man-brand-3840x2160-26881.jpg',
  },
  {
    id: 'hero-2',
    name: 'Spider-Man Suit — Spider Verse',
    category: 'Heróis & Cinema',
    url: '/wallpapers/spider-man-brand-3840x2160-26882.jpg',
    fallbackUrl: '/spider-man-brand-3840x2160-26882.jpg',
  },
  {
    id: 'hero-3',
    name: 'Thanos — Infinity Gauntlet',
    category: 'Heróis & Cinema',
    url: '/wallpapers/thanos-infinity-gauntlet-infinity-stones-avengers-endgame-3840x2160-69.jpg',
    fallbackUrl: '/thanos-infinity-gauntlet-infinity-stones-avengers-endgame-3840x2160-69.jpg',
  },
  {
    id: 'hero-4',
    name: 'Harry Potter — Hogwarts Legacy',
    category: 'Heróis & Cinema',
    url: '/wallpapers/harry-potter-and-3840x2160-10561.jpg',
    fallbackUrl: '/harry-potter-and-3840x2160-10561.jpg',
  },
  {
    id: 'hero-5',
    name: 'Cyclops — X-Men Optic Blast',
    category: 'Heróis & Cinema',
    url: '/wallpapers/cyclops-season-8-3840x2160-26863.jpg',
    fallbackUrl: '/cyclops-season-8-3840x2160-26863.jpg',
  },
  {
    id: 'hero-6',
    name: 'Toy Story 5 — Woody & Buzz',
    category: 'Heróis & Cinema',
    url: '/wallpapers/toy-story-5-3840x2160-26885.jpg',
    fallbackUrl: '/toy-story-5-3840x2160-26885.jpg',
  },
  {
    id: 'hero-7',
    name: 'Minions — Despicable Monsters',
    category: 'Heróis & Cinema',
    url: '/wallpapers/minions-monsters-3840x2160-26730.jpg',
    fallbackUrl: '/minions-monsters-3840x2160-26730.jpg',
  },
  {
    id: 'hero-8',
    name: 'Shah Rukh Khan — Bollywood Icon',
    category: 'Heróis & Cinema',
    url: '/wallpapers/shah-rukh-khan-8k-3840x2160-14729.png',
    fallbackUrl: '/shah-rukh-khan-8k-3840x2160-14729.png',
  },

  // Animes & Gaming
  {
    id: 'game-1',
    name: 'Grand Theft Auto VI — Vice City',
    category: 'Animes & Gaming',
    url: '/wallpapers/grand-theft-auto-vi-3840x2160-26757.jpg',
    fallbackUrl: '/grand-theft-auto-vi-3840x2160-26757.jpg',
  },
  {
    id: 'game-2',
    name: 'Solo Leveling — Sung Jinwoo',
    category: 'Animes & Gaming',
    url: '/wallpapers/solo-leveling-3840x2160-26864.jpg',
    fallbackUrl: '/solo-leveling-3840x2160-26864.jpg',
  },
  {
    id: 'game-3',
    name: 'Dragon Ball Z — Super Saiyan Goku',
    category: 'Animes & Gaming',
    url: '/wallpapers/dragon-ball-z-super-3840x2160-13878.jpg',
    fallbackUrl: '/dragon-ball-z-super-3840x2160-13878.jpg',
  },
  {
    id: 'game-4',
    name: 'Pain Nagato — Akatsuki Rinnegan',
    category: 'Animes & Gaming',
    url: '/wallpapers/pain-nagato-black-3840x2160-26691.jpg',
    fallbackUrl: '/pain-nagato-black-3840x2160-26691.jpg',
  },

  // Super Carros
  {
    id: 'car-1',
    name: 'Lamborghini Urus SE — Hybrid Hypercar',
    category: 'Super Carros',
    url: '/wallpapers/lamborghini-urus-se-3840x2160-26857.jpg',
    fallbackUrl: '/lamborghini-urus-se-3840x2160-26857.jpg',
  },
  {
    id: 'car-2',
    name: 'Porsche GT3 RS — Night Racing',
    category: 'Super Carros',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
  },

  // Cyberpunk & Natureza
  {
    id: 'cyber-1',
    name: 'Tóquio Cyberpunk — Neon City',
    category: 'Cyberpunk & Natureza',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'cyber-2',
    name: 'Chuva e Neon — Night City Skyline',
    category: 'Cyberpunk & Natureza',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'space-1',
    name: 'Nebulosa Cósmica — Deep Space',
    category: 'Cyberpunk & Natureza',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'nature-1',
    name: 'Montanhas Estreladas — Night Peaks',
    category: 'Cyberpunk & Natureza',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'cyber-3',
    name: 'Matrix Cyber Security — Terminal Grid',
    category: 'Cyberpunk & Natureza',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
  },
];

export function PlanoDeFundoApp() {
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(() => {
    return safeStorage.getItem('renanos_wallpaper') || '/wallpapers/wallpaper.png';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [customUrl, setCustomUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewWp, setPreviewWp] = useState<WallpaperItem | null>(null);

  const [customWallpapers, setCustomWallpapers] = useState<WallpaperItem[]>(() => {
    try {
      const saved = safeStorage.getItem('renanos_custom_wallpapers');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Storage fallback
    }
    return [];
  });

  // Listen for global wallpaper changes
  useEffect(() => {
    function handleWpChange(e: Event) {
      const customEv = e as CustomEvent<string>;
      const newWp = customEv.detail || safeStorage.getItem('renanos_wallpaper') || '/wallpapers/wallpaper.png';
      setCurrentWallpaper(newWp);
    }
    window.addEventListener('renanos_wallpaper_changed', handleWpChange);
    return () => window.removeEventListener('renanos_wallpaper_changed', handleWpChange);
  }, []);

  // Save custom wallpapers
  useEffect(() => {
    try {
      safeStorage.setItem('renanos_custom_wallpapers', JSON.stringify(customWallpapers));
    } catch {
      // Storage quota fallback
    }
  }, [customWallpapers]);

  // Apply wallpaper to Lockscreen & Desktop
  function applyWallpaper(url: string, title?: string) {
    try {
      safeStorage.setItem('renanos_wallpaper', url);
    } catch {
      // Quota fallback
    }
    setCurrentWallpaper(url);
    window.dispatchEvent(new CustomEvent('renanos_wallpaper_changed', { detail: url }));

    const name = title ? `"${title}"` : 'Imagem';
    setToastMessage(`Wallpaper ${name} aplicado na Tela de Bloqueio e no Desktop!`);
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Handle local file upload
  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      if (!rawResult) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.75);
          saveAndApplyCustomWallpaper(compressed, file.name);
        } else {
          saveAndApplyCustomWallpaper(rawResult, file.name);
        }
      };
      img.onerror = () => saveAndApplyCustomWallpaper(rawResult, file.name);
      img.src = rawResult;
    };
    reader.readAsDataURL(file);

    function saveAndApplyCustomWallpaper(src: string, fileName: string) {
      const cleanName = fileName.replace(/\.[^/.]+$/, '') || 'Wallpaper do Usuário';
      const newWp: WallpaperItem = {
        id: `custom-${Date.now()}`,
        name: cleanName,
        category: 'Meus Uploads',
        url: src,
        isCustom: true,
      };

      setCustomWallpapers((prev) => [newWp, ...prev]);
      applyWallpaper(src, cleanName);
    }
  }

  // Handle custom URL submit
  function handleCustomUrlSubmit(e: FormEvent) {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const newWp: WallpaperItem = {
      id: `custom-url-${Date.now()}`,
      name: 'Imagem Web Customizada',
      category: 'Meus Uploads',
      url: customUrl.trim(),
      isCustom: true,
    };

    setCustomWallpapers((prev) => [newWp, ...prev]);
    applyWallpaper(customUrl.trim(), 'URL Externa');
    setCustomUrl('');
  }

  // Delete custom wallpaper
  function handleDeleteCustomWallpaper(id: string, e: MouseEvent) {
    e.stopPropagation();
    if (confirm('Deseja remover esta imagem da sua lista de wallpapers?')) {
      setCustomWallpapers((prev) => {
        const itemToDelete = prev.find((w) => w.id === id);
        const next = prev.filter((w) => w.id !== id);
        if (itemToDelete && itemToDelete.url === currentWallpaper) {
          applyWallpaper('/wallpapers/wallpaper.png', 'Base RenanOS');
        }
        return next;
      });
    }
  }

  const allWallpapers = [...customWallpapers, ...WALLPAPER_CATALOG];
  const categories = ['Todas', 'Oficial', 'Heróis & Cinema', 'Animes & Gaming', 'Super Carros', 'Cyberpunk & Natureza', 'Meus Uploads'];

  const filteredWallpapers = selectedCategory === 'Todas'
    ? allWallpapers
    : allWallpapers.filter((w) => w.category === selectedCategory);

  return (
    <div className="flex h-full w-full flex-col bg-[#0b0d14] text-zinc-100 font-mono select-none overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl border border-amber-500/50 bg-[#121624] px-4 py-2.5 text-xs text-amber-300 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="size-4 text-amber-400 shrink-0" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="shrink-0 border-b border-amber-500/20 bg-gradient-to-r from-[#121524] via-[#161a2e] to-[#121524] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <ImageIcon className="size-5" />
          </div>
          <div>
            <h2 className="font-bold text-amber-400 text-sm tracking-wide">Gerenciador de Plano de Fundo</h2>
            <p className="text-[11px] text-zinc-400">
              Personalize a imagem da <span className="text-amber-300 font-bold">Tela de Bloqueio</span> e da <span className="text-amber-300 font-bold">Área de Trabalho</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 cursor-pointer transition-colors active:scale-95 shadow">
            <Upload className="size-3.5" /> Enviar do Computador
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => applyWallpaper('/wallpapers/wallpaper.png', 'Base RenanOS')}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
            title="Restaurar padrão"
          >
            <RefreshCw className="size-3.5 text-amber-400" /> Restaurar Padrão
          </button>
        </div>
      </div>

      {/* Categories & URL Bar */}
      <div className="shrink-0 border-b border-zinc-800/80 bg-[#0e111a] px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-3 py-1 text-[11px] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50 shadow'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Quick URL form */}
        <form onSubmit={handleCustomUrlSubmit} className="flex items-center gap-1.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
            <input
              type="url"
              placeholder="Cole URL da imagem..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-[#141824] pl-8 pr-3 py-1 text-[11px] text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 cursor-pointer"
          >
            Aplicar
          </button>
        </form>
      </div>

      {/* Wallpapers Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWallpapers.map((wp) => {
            const fileName = wp.url.split('/').pop() || '';
            const isSelected =
              currentWallpaper === wp.url ||
              (wp.fallbackUrl && currentWallpaper === wp.fallbackUrl) ||
              (fileName && currentWallpaper.includes(fileName));

            return (
              <div
                key={wp.id}
                onClick={() => applyWallpaper(wp.url, wp.name)}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-[#161a29]'
                    : 'border-zinc-800 bg-[#111420] hover:border-amber-500/50 hover:scale-[1.02] hover:shadow-xl'
                }`}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/90">
                  <img
                    src={wp.url}
                    alt={wp.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (wp.fallbackUrl && img.src !== wp.fallbackUrl) {
                        img.src = wp.fallbackUrl;
                      } else {
                        img.src = '/wallpapers/wallpaper.png';
                      }
                    }}
                  />

                  {/* Active Indicator Badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-black shadow-lg">
                      <Check className="size-3 stroke-[3]" /> Ativo
                    </div>
                  )}

                  {/* Action overlay: Eye / Preview */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewWp(wp);
                      }}
                      className="flex items-center gap-1 rounded-xl bg-black/70 border border-white/20 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-black backdrop-blur transition-all"
                      title="Visualizar em tamanho cheio"
                    >
                      <Eye className="size-3.5 text-amber-400" /> Visualizar
                    </button>
                  </div>

                  {/* Delete button for custom upload */}
                  {wp.isCustom && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomWallpaper(wp.id, e)}
                      className="absolute top-2.5 left-2.5 rounded-lg bg-red-500/80 p-1.5 text-white hover:bg-red-600 transition-colors cursor-pointer shadow z-10"
                      title="Excluir da galeria"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Info & Apply Footer */}
                <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <h3 className="font-bold text-xs text-zinc-200 truncate group-hover:text-amber-300">
                      {wp.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 uppercase mt-0.5">{wp.category}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px]">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Lock className="size-3 text-amber-400/80" /> Lock & Desktop
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        applyWallpaper(wp.url, wp.name);
                      }}
                      className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-black'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-amber-500 hover:text-black'
                      }`}
                    >
                      {isSelected ? 'Ativo' : 'Definir'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredWallpapers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 space-y-3">
            <ImageIcon className="size-10 text-zinc-600 stroke-[1.5]" />
            <p className="text-xs">Nenhum wallpaper encontrado nesta categoria.</p>
            <label className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 cursor-pointer">
              <Plus className="size-4" /> Enviar Nova Imagem
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}
      </div>

      {/* Full Resolution Preview Modal */}
      {previewWp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setPreviewWp(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl border border-amber-500/40 bg-[#0d0f17] p-4 overflow-hidden shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Maximize2 className="size-4 text-amber-400" />
                <span className="font-bold text-xs text-white">{previewWp.name}</span>
                <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {previewWp.category}
                </span>
              </div>
              <button
                onClick={() => setPreviewWp(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-zinc-800">
              <img
                src={previewWp.url}
                alt={previewWp.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (previewWp.fallbackUrl && img.src !== previewWp.fallbackUrl) {
                    img.src = previewWp.fallbackUrl;
                  } else {
                    img.src = '/wallpapers/wallpaper.png';
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-1 font-mono text-xs">
              <button
                onClick={() => setPreviewWp(null)}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-700 cursor-pointer"
              >
                Fechar
              </button>

              <button
                onClick={() => {
                  applyWallpaper(previewWp.url, previewWp.name);
                  setPreviewWp(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 font-bold text-black hover:bg-amber-400 cursor-pointer shadow-lg transition-transform active:scale-95"
              >
                <Check className="size-4 stroke-[3]" /> Aplicar Como Wallpaper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
