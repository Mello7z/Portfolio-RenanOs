import { useState, type FormEvent, type ChangeEvent } from 'react';
import { X, Image as ImageIcon, Check, Sparkles, Link as LinkIcon, RefreshCw, Upload, Lock } from 'lucide-react';
import { WALLPAPER_CATALOG, type WallpaperItem } from '../apps/PlanoDeFundoApp';
import { safeStorage } from '../../utils/storage';

interface WallpaperModalProps {
  currentWallpaper: string;
  onSelectWallpaper: (url: string) => void;
  onClose: () => void;
}

export function WallpaperModal({
  currentWallpaper,
  onSelectWallpaper,
  onClose,
}: WallpaperModalProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'custom'>('preset');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const [customWallpapers, setCustomWallpapers] = useState<WallpaperItem[]>(() => {
    try {
      const saved = safeStorage.getItem('renanos_custom_wallpapers');
      if (saved) return JSON.parse(saved);
    } catch {
      // storage fallback
    }
    return [];
  });

  function handleCustomSubmit(e: FormEvent) {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelectWallpaper(customUrl.trim());
      onClose();
    }
  }

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
          saveAndApply(compressed, file.name);
        } else {
          saveAndApply(rawResult, file.name);
        }
      };
      img.onerror = () => saveAndApply(rawResult, file.name);
      img.src = rawResult;
    };
    reader.readAsDataURL(file);

    function saveAndApply(src: string, fileName: string) {
      const cleanName = fileName.replace(/\.[^/.]+$/, '') || 'Imagem Local';
      const newWp: WallpaperItem = {
        id: `custom-${Date.now()}`,
        name: cleanName,
        category: 'Meus Uploads',
        url: src,
        isCustom: true,
      };

      const nextCustom = [newWp, ...customWallpapers];
      setCustomWallpapers(nextCustom);
      try {
        safeStorage.setItem('renanos_custom_wallpapers', JSON.stringify(nextCustom));
      } catch {
        // quota
      }

      onSelectWallpaper(src);
      onClose();
    }
  }

  const categories = ['Todas', 'Oficial', 'Heróis & Cinema', 'Animes & Gaming', 'Super Carros', 'Cyberpunk & Natureza', 'Meus Uploads'];
  const allWallpapers = [...customWallpapers, ...WALLPAPER_CATALOG];
  const filtered = selectedCategory === 'Todas' ? allWallpapers : allWallpapers.filter((w) => w.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md select-none font-sans">
      <div className="w-full max-w-3xl rounded-2xl border border-amber-500/30 bg-[#0d0f17]/95 p-5 shadow-2xl backdrop-blur-xl text-foreground font-mono space-y-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
              <ImageIcon className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-400 text-sm">Plano de Fundo da Tela</h3>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                <Lock className="size-3 text-amber-400/80" /> Aplica na Tela de Bloqueio e no Desktop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab Switcher & Upload Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2 text-xs shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveTab('preset')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="size-3.5 text-amber-400" /> Galeria ({allWallpapers.length})
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <LinkIcon className="size-3.5 text-amber-400" /> URL Externa
            </button>
          </div>

          <label className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 font-bold text-amber-300 hover:bg-amber-500/30 cursor-pointer text-xs transition-all active:scale-95 shadow">
            <Upload className="size-3.5" /> Enviar do Computador
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Category Filters */}
        {activeTab === 'preset' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[10px] transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Presets Grid */}
        {activeTab === 'preset' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto pr-1 flex-1 min-h-[260px]">
            {filtered.map((wp) => {
              const isSelected = currentWallpaper === wp.url;
              return (
                <button
                  key={wp.id}
                  onClick={() => {
                    onSelectWallpaper(wp.url);
                    onClose();
                  }}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)] bg-[#141828]'
                      : 'border-zinc-800 bg-[#121520] hover:border-amber-500/50 hover:scale-[1.02]'
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={wp.url}
                      alt={wp.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        if (wp.fallbackUrl) {
                          (e.target as HTMLImageElement).src = wp.fallbackUrl;
                        } else {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
                        }
                      }}
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full bg-amber-500 text-black shadow">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-bold text-[11px] text-zinc-200 truncate group-hover:text-amber-300">
                      {wp.name}
                    </p>
                    <p className="text-[9px] text-zinc-500 uppercase">{wp.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Custom URL Input Form */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCustomSubmit} className="space-y-4 py-3 flex-1">
            <div className="space-y-1.5">
              <label className="text-xs text-amber-300 font-bold block">
                Link direto da imagem (HTTPS):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://exemplo.com/minha-imagem.jpg"
                  required
                  className="flex-1 rounded-lg border border-zinc-700 bg-[#121520] px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-xs text-black hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
            </div>

            {customUrl && (
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-400">Prévia da imagem:</p>
                <div className="aspect-video w-full max-w-sm rounded-lg border border-zinc-700 overflow-hidden bg-black">
                  <img
                    src={customUrl}
                    alt="Prévia"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </form>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs shrink-0">
          <button
            onClick={() => {
              onSelectWallpaper('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80');
              onClose();
            }}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" /> Restaurar Padrão
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700 cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
