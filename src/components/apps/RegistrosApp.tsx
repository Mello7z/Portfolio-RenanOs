import { useState, useEffect, type MouseEvent } from 'react';
import {
  X,
  Image as ImageIcon,
  Trash2,
  Download,
  Maximize2,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { safeStorage } from '../../utils/storage';

export interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
  isCustom?: boolean;
}

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  { id: 'galeria-1', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.51.jpeg', caption: 'Registro Pessoal #1' },
  { id: 'galeria-2', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.51 (1).jpeg', caption: 'Registro Pessoal #2' },
  { id: 'galeria-3', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.51 (2).jpeg', caption: 'Registro Pessoal #3' },
  { id: 'galeria-4', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.51 (3).jpeg', caption: 'Registro Pessoal #4' },
  { id: 'galeria-5', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52.jpeg', caption: 'Registro Pessoal #5' },
  { id: 'galeria-6', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (1).jpeg', caption: 'Registro Pessoal #6' },
  { id: 'galeria-7', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (2).jpeg', caption: 'Registro Pessoal #7' },
  { id: 'galeria-8', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (3).jpeg', caption: 'Registro Pessoal #8' },
  { id: 'galeria-9', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (4).jpeg', caption: 'Registro Pessoal #9' },
  { id: 'galeria-10', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (6).jpeg', caption: 'Registro Pessoal #10' },
  { id: 'galeria-11', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (7).jpeg', caption: 'Registro Pessoal #11' },
  { id: 'galeria-12', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (9).jpeg', caption: 'Registro Pessoal #12' },
  { id: 'galeria-13', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (10).jpeg', caption: 'Registro Pessoal #13' },
  { id: 'galeria-14', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (11).jpeg', caption: 'Registro Pessoal #14' },
  { id: 'galeria-15', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (12).jpeg', caption: 'Registro Pessoal #15' },
  { id: 'galeria-16', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (13).jpeg', caption: 'Registro Pessoal #16' },
  { id: 'galeria-17', src: '/galeria/WhatsApp Image 2026-07-31 at 10.00.52 (14).jpeg', caption: 'Registro Pessoal #17' },
];

interface GalleryCardProps {
  key?: string;
  photo: GalleryPhoto;
  index: number;
  onZoom: () => void;
  onDelete: (e: MouseEvent<HTMLButtonElement>) => void;
}

function GalleryCard({ photo, onZoom, onDelete }: GalleryCardProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0f17] hover:border-amber-500/50 hover:bg-[#121522] transition-all shadow-md">
      {/* Image Box */}
      <div
        onClick={onZoom}
        className="relative aspect-video w-full overflow-hidden bg-zinc-950 flex items-center justify-center cursor-pointer group"
      >
        <img
          src={photo.src}
          alt={photo.caption}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setHasError(true)}
        />

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="grid size-7 place-items-center rounded-lg border border-white/20 bg-black/60 text-white backdrop-blur">
            <Maximize2 className="size-3.5" />
          </span>
        </div>
      </div>

      {/* Photo Card Footer */}
      <div className="p-3 flex items-center justify-between gap-2 border-t border-zinc-800/60">
        <p className="font-bold text-xs text-white truncate flex-1">{photo.caption}</p>
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-200 hover:bg-red-500/20 rounded-lg p-1.5 cursor-pointer transition-all"
          title="Excluir imagem do arquivo"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function RegistrosApp() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    try {
      const savedCustom = safeStorage.getItem('renanos_custom_photos');
      let customList: GalleryPhoto[] = [];
      if (savedCustom) {
        customList = JSON.parse(savedCustom);
      }
      return [...customList, ...DEFAULT_PHOTOS];
    } catch {
      return DEFAULT_PHOTOS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save custom photos
  useEffect(() => {
    try {
      const customOnly = photos.filter((p) => p.isCustom);
      safeStorage.setItem('renanos_custom_photos', JSON.stringify(customOnly));
    } catch {
      // Storage quota fallback
    }
  }, [photos]);

  // Delete photo
  function handleDeletePhoto(id: string, e?: MouseEvent) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (confirm('Deseja realmente remover esta foto da sua galeria?')) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      if (zoomIndex !== null) setZoomIndex(null);
      setToastMessage('Imagem removida do arquivo.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  }

  const filteredPhotos = photos.filter((p) =>
    p.caption.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="hud-grid min-h-full p-4 sm:p-5 overflow-y-auto space-y-4 font-mono select-none text-foreground bg-[#0b0d14]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 right-4 z-[99] flex items-center gap-2 rounded-2xl border border-emerald-500/60 bg-[#0c121d] px-4 py-3 text-xs font-bold text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-[#10131d] p-3.5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <ImageIcon className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white">Galeria Pessoal & Registros</h3>
            <p className="text-[10px] text-amber-400/80">{photos.length} fotos registradas no arquivo</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar foto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-[#141824] pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredPhotos.map((photo, index) => (
          <GalleryCard
            key={photo.id}
            photo={photo}
            index={index}
            onZoom={() => setZoomIndex(index)}
            onDelete={(e) => handleDeletePhoto(photo.id, e)}
          />
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500 space-y-3">
          <ImageIcon className="size-10 text-zinc-600 stroke-[1.5]" />
          <p className="text-xs">Nenhuma foto encontrada para "{searchQuery}".</p>
        </div>
      )}

      {/* Zoom Preview Modal */}
      {zoomIndex !== null && filteredPhotos[zoomIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setZoomIndex(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-3xl border border-amber-500/40 bg-[#0d0f17] p-4 overflow-hidden shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-xs text-white">
                {filteredPhotos[zoomIndex].caption}
              </span>
              <button
                onClick={() => setZoomIndex(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={filteredPhotos[zoomIndex].src}
                alt={filteredPhotos[zoomIndex].caption}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-1 font-mono text-xs">
              <button
                onClick={(e) => handleDeletePhoto(filteredPhotos[zoomIndex].id, e)}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/20 px-3.5 py-2 font-bold text-red-300 hover:bg-red-500/30 cursor-pointer transition-colors"
              >
                <Trash2 className="size-4" /> Excluir
              </button>

              <a
                href={filteredPhotos[zoomIndex].src}
                download="imagem.jpg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 font-bold text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                <Download className="size-4" /> Abrir / Baixar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
