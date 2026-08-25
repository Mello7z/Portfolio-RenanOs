import { useState, useEffect } from 'react';
import { safeStorage } from '../../utils/storage';
import {
  Shield,
  Cpu,
  Lock,
  Terminal,
  Database,
  Key,
  Wifi,
  Eye,
  RefreshCw,
  Trophy,
  Brain,
  Timer,
  CheckCircle2,
} from 'lucide-react';

const CARD_ICONS = [
  { id: 'shield', icon: Shield, label: 'Firewall' },
  { id: 'cpu', icon: Cpu, label: 'Processador' },
  { id: 'lock', icon: Lock, label: 'Criptografia' },
  { id: 'terminal', icon: Terminal, label: 'Shell' },
  { id: 'database', icon: Database, label: 'Banco' },
  { id: 'key', icon: Key, label: 'Chave SSH' },
  { id: 'wifi', icon: Wifi, label: 'Sinal' },
  { id: 'eye', icon: Eye, label: 'Cyber Eye' },
];

interface CardItem {
  instanceId: number;
  cardId: string;
  label: string;
  Icon: typeof Shield;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoriaApp() {
  const [pairCount, setPairCount] = useState<number>(6); // Default 6 pairs (12 cards)
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [bestScore, setBestScore] = useState<number | null>(() => {
    const saved = safeStorage.getItem('renanos_memory_best');
    return saved ? Number(saved) : null;
  });

  // Start / restart game
  function resetGame(count = pairCount) {
    const selectedIcons = CARD_ICONS.slice(0, count);
    const duplicated = [...selectedIcons, ...selectedIcons];

    // Shuffle
    const shuffled = duplicated
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }, index) => ({
        instanceId: index,
        cardId: item.id,
        label: item.label,
        Icon: item.icon,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setIsWon(false);
  }

  useEffect(() => {
    resetGame(pairCount);
  }, [pairCount]);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !isWon) {
      timer = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isWon]);

  // Card click handler
  function handleCardClick(instanceId: number) {
    if (!isPlaying || isWon) return;
    if (flippedCards.length >= 2) return;

    const clicked = cards.find((c) => c.instanceId === instanceId);
    if (!clicked || clicked.isFlipped || clicked.isMatched) return;

    // Flip card
    const nextCards = cards.map((c) =>
      c.instanceId === instanceId ? { ...c, isFlipped: true } : c
    );
    setCards(nextCards);

    const newFlipped = [...flippedCards, instanceId];
    setFlippedCards(newFlipped);

    // If 2 cards flipped, check match
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = nextCards.find((c) => c.instanceId === firstId);
      const secondCard = nextCards.find((c) => c.instanceId === secondId);

      if (firstCard && secondCard && firstCard.cardId === secondCard.cardId) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.cardId === firstCard.cardId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);

          // Check if all matched
          const remainingUnmatched = nextCards.filter(
            (c) => !c.isMatched && c.cardId !== firstCard.cardId
          );
          if (remainingUnmatched.length === 0) {
            setIsWon(true);
            setIsPlaying(false);
            const currentMoves = moves + 1;
            if (!bestScore || currentMoves < bestScore) {
              setBestScore(currentMoves);
              safeStorage.setItem('renanos_memory_best', String(currentMoves));
            }
          }
        }, 400);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.instanceId === firstId || c.instanceId === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#0a0c10] p-4 text-foreground font-mono select-none space-y-4 overflow-y-auto">
      {/* Top Header */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Brain className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Memória Hacker</h3>
            <p className="text-[11px] text-amber-400/80">Encontre os pares de componentes criptográficos</p>
          </div>
        </div>

        {/* Difficulty switcher */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setPairCount(4)}
            className={`rounded px-2.5 py-1 border transition-colors cursor-pointer ${
              pairCount === 4
                ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-500/50'
                : 'border-zinc-800 text-zinc-400 hover:bg-white/5'
            }`}
          >
            Fácil (8)
          </button>
          <button
            onClick={() => setPairCount(6)}
            className={`rounded px-2.5 py-1 border transition-colors cursor-pointer ${
              pairCount === 6
                ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-500/50'
                : 'border-zinc-800 text-zinc-400 hover:bg-white/5'
            }`}
          >
            Médio (12)
          </button>
          <button
            onClick={() => setPairCount(8)}
            className={`rounded px-2.5 py-1 border transition-colors cursor-pointer ${
              pairCount === 8
                ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-500/50'
                : 'border-zinc-800 text-zinc-400 hover:bg-white/5'
            }`}
          >
            Difícil (16)
          </button>
        </div>
      </div>

      {/* Game Stats & Reset */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/70 bg-[#10131a] p-3 text-center">
          <p className="text-[10px] uppercase text-zinc-400 font-semibold">Jogadas</p>
          <p className="text-lg font-bold text-amber-400 mt-0.5">{moves}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-[#10131a] p-3 text-center">
          <p className="text-[10px] uppercase text-zinc-400 font-semibold flex items-center justify-center gap-1">
            <Timer className="size-3" /> Tempo
          </p>
          <p className="text-lg font-bold text-amber-400 mt-0.5">{time}s</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-[#10131a] p-3 text-center">
          <p className="text-[10px] uppercase text-zinc-400 font-semibold flex items-center justify-center gap-1">
            <Trophy className="size-3 text-amber-400" /> Recorde
          </p>
          <p className="text-lg font-bold text-amber-400 mt-0.5">
            {bestScore ? `${bestScore} mov.` : '—'}
          </p>
        </div>
      </div>

      {/* Cards Grid Container */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <div
          className={`grid gap-3.5 w-full max-w-xl mx-auto ${
            pairCount === 4
              ? 'grid-cols-4'
              : pairCount === 6
              ? 'grid-cols-4'
              : 'grid-cols-4 sm:grid-cols-4'
          }`}
        >
          {cards.map((card) => {
            const IconComponent = card.Icon;
            const showContent = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.instanceId}
                onClick={() => handleCardClick(card.instanceId)}
                disabled={showContent || isWon}
                className={`relative aspect-square max-h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer ${
                  card.isMatched
                    ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : card.isFlipped
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-105'
                    : 'border-amber-500/20 bg-[#121622] text-zinc-500 hover:border-amber-500/50 hover:bg-[#1a2030] hover:scale-102'
                }`}
              >
                {showContent ? (
                  <>
                    <IconComponent className="size-7 sm:size-8 transition-transform duration-300 scale-110" />
                    <span className="mt-1 text-[10px] font-bold tracking-wider uppercase text-zinc-200 text-center truncate max-w-full">
                      {card.label}
                    </span>
                  </>
                ) : (
                  <div className="grid size-9 place-items-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500/40 font-mono text-xs font-bold">
                    //
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory Overlay / Banner */}
      {isWon && (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-center space-y-2 animate-bounce">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="size-5" /> Sistema Descriptografado com Sucesso!
          </div>
          <p className="text-xs text-zinc-300">
            Você completou o protocolo em <strong className="text-white">{moves} jogadas</strong> e{' '}
            <strong className="text-white">{time} segundos</strong>.
          </p>
          <button
            onClick={() => resetGame(pairCount)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 font-bold text-xs text-black hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3.5" /> Jogar Novamente
          </button>
        </div>
      )}

      {/* Reset button at bottom */}
      {!isWon && (
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => resetGame(pairCount)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3.5" /> Reiniciar Partida
          </button>
        </div>
      )}
    </div>
  );
}
