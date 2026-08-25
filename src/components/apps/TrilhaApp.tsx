import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Disc3,
  Volume2,
  VolumeX,
  Radio,
  Plus,
  Repeat,
  Shuffle,
  Music,
  ExternalLink,
} from 'lucide-react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
  isRadio?: boolean;
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: 'lofi-night',
    title: 'Midnight Cyber Protocol',
    artist: 'Lofi Cyber Beats',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  },
  {
    id: 'synthwave-ops',
    title: 'Neon Patrol Synthwave',
    artist: 'Synth Ops & Cyberpunk',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
  },
  {
    id: 'chill-ambient',
    title: 'Rooftop Rain Focus',
    artist: 'Noir Ambient Sessions',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
  },
  {
    id: 'deep-beat',
    title: 'Encrypted Dreams Lofi',
    artist: 'Nightbuild Audio',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_85d53a94a2.mp3',
  },
  {
    id: 'lofi-study',
    title: 'Chillhop Code & Coffee',
    artist: 'Developer Lofi',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3',
  },
  {
    id: 'radio-live',
    title: 'Rádio Lofi Cyber (Ao Vivo)',
    artist: 'Transmissão Contínua',
    url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    isRadio: true,
  },
];

function fmtTime(seconds: number) {
  if (isNaN(seconds) || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TrilhaApp() {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  // Custom song modal input
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentIdx] || tracks[0];

  // Initialize and update Audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
    } else {
      audioRef.current.src = currentTrack.url;
    }

    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (isShuffle) {
        const next = Math.floor(Math.random() * tracks.length);
        setCurrentIdx(next);
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIdx, tracks]);

  // Handle play / pause toggle
  function togglePlay() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Play error:', e);
          setIsPlaying(false);
        });
    }
  }

  function handleSelectTrack(index: number) {
    if (index === currentIdx) {
      togglePlay();
      return;
    }
    setCurrentIdx(index);
    setIsPlaying(true);
  }

  function handleNext() {
    const nextIdx = (currentIdx + 1) % tracks.length;
    setCurrentIdx(nextIdx);
    setIsPlaying(true);
  }

  function handlePrev() {
    const prevIdx = (currentIdx - 1 + tracks.length) % tracks.length;
    setCurrentIdx(prevIdx);
    setIsPlaying(true);
  }

  function handleVolumeChange(val: number) {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  }

  function toggleMute() {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioRef.current.volume = nextMute ? 0 : volume;
  }

  function handleSeek(val: number) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = val;
    setCurrentTime(val);
  }

  function handleAddCustomTrack(e: FormEvent) {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) return;

    const newTrack: Track = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Artista Desconhecido',
      url: newUrl.trim(),
    };

    setTracks((prev) => [...prev, newTrack]);
    setCurrentIdx(tracks.length);
    setIsPlaying(true);
    setShowAddModal(false);
    setNewTitle('');
    setNewArtist('');
    setNewUrl('');
  }

  return (
    <div className="flex min-h-full flex-col bg-[#0a0c10] p-4 text-foreground font-mono select-none overflow-y-auto space-y-4">
      {/* Player Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-5 shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Animated Background Pulse */}
        {isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none animate-pulse" />
        )}

        {/* Spinning Vinyl Disc */}
        <div className="relative my-2">
          <div
            className={`grid size-32 place-items-center rounded-full border-2 border-amber-500/40 bg-[#0c0e14] text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.25)] ${
              isPlaying ? 'animate-spin [animation-duration:6s]' : ''
            }`}
          >
            <Disc3 className="size-20 opacity-90" />
          </div>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="size-6 rounded-full border-2 border-amber-400/80 bg-black" />
          </div>
        </div>

        {/* Track info */}
        <h3 className="mt-3 text-center font-bold text-sm text-white truncate max-w-full px-2">
          {currentTrack.title}
        </h3>
        <p className="text-xs text-amber-400/90 font-semibold">{currentTrack.artist}</p>

        {/* Live indicator if radio */}
        {currentTrack.isRadio && (
          <span className="mt-1 inline-flex items-center gap-1 rounded bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] text-red-400 animate-pulse">
            <Radio className="size-3" /> Transmissão Ao Vivo
          </span>
        )}

        {/* Timeline Slider */}
        <div className="mt-4 w-full max-w-xs space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            disabled={currentTrack.isRadio}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 tabular-nums">
            <span>{currentTrack.isRadio ? 'AO VIVO' : fmtTime(currentTime)}</span>
            <span>{currentTrack.isRadio ? '∞' : fmtTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => setIsShuffle((s) => !s)}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isShuffle ? 'text-amber-400 bg-amber-500/20' : 'text-zinc-400 hover:text-white'
            }`}
            title="Aleatório"
          >
            <Shuffle className="size-4" />
          </button>

          <button
            onClick={handlePrev}
            className="text-zinc-300 hover:text-amber-300 transition-colors p-1.5 cursor-pointer"
            title="Anterior"
          >
            <SkipBack className="size-5" />
          </button>

          <button
            onClick={togglePlay}
            className="grid size-12 place-items-center rounded-full border border-amber-400 bg-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? <Pause className="size-6" /> : <Play className="size-6 pl-0.5" />}
          </button>

          <button
            onClick={handleNext}
            className="text-zinc-300 hover:text-amber-300 transition-colors p-1.5 cursor-pointer"
            title="Próxima"
          >
            <SkipForward className="size-5" />
          </button>

          <button
            onClick={() => setIsRepeat((r) => !r)}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isRepeat ? 'text-amber-400 bg-amber-500/20' : 'text-zinc-400 hover:text-white'
            }`}
            title="Repetir"
          >
            <Repeat className="size-4" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="mt-4 flex items-center gap-2 w-full max-w-xs px-4">
          <button
            onClick={toggleMute}
            className="text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-[10px] text-zinc-400 w-8 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>

      {/* Track List Section */}
      <div className="rounded-2xl border border-border/80 bg-[#10131a] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-2">
            <Music className="size-4 text-amber-400" />
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">
              Sinais de Áudio ({tracks.length})
            </h4>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" /> Adicionar Música
          </button>
        </div>

        <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
          {tracks.map((t, idx) => {
            const isSelected = idx === currentIdx;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTrack(idx)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border border-amber-500/40 bg-amber-500/15 text-amber-300 font-bold'
                    : 'border border-transparent bg-[#141824] hover:bg-[#1a2030] text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-[11px] text-zinc-500 w-4 font-mono">{idx + 1}.</span>
                  <div className="truncate">
                    <p className="text-xs font-semibold truncate">{t.title}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{t.artist}</p>
                  </div>
                </div>

                {isSelected && isPlaying ? (
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <span className="size-1 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-[10px] font-bold">TOCANDO</span>
                  </span>
                ) : (
                  <Play className="size-3.5 text-zinc-500 opacity-0 group-hover:opacity-100" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* VT Music External Showcase Banner */}
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-[#121622] via-[#171c2b] to-[#121622] p-3.5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-amber-500/50 bg-amber-500/20 text-amber-400 shadow-sm">
            <Music className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">VT Music Experience</h4>
            <p className="text-[10px] text-amber-300/80">Plataforma e Apresentação Musical por Renan Mello</p>
          </div>
        </div>
        <a
          href="https://vt-music.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <ExternalLink className="size-3.5" /> Acessar VT Music
        </a>
      </div>

      {/* Add Song Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm select-none">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#10131a] p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
              <Plus className="size-4" /> Adicionar Link de Música / Rádio
            </h3>
            <form onSubmit={handleAddCustomTrack} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Título da Música:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Minha Música Favorita"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-[#161a26] px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Artista / Canal:</label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Ex: Lofi Girl"
                  className="w-full rounded-lg border border-zinc-700 bg-[#161a26] px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-zinc-300 font-bold block mb-1">URL de Áudio Direct MP3 / Stream:</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://exemplo.com/musica.mp3"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-[#161a26] px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded bg-amber-500 px-4 py-1.5 font-bold text-black hover:bg-amber-400 cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
