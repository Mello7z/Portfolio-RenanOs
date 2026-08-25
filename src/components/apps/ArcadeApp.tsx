import { useCallback, useEffect, useRef, useState } from 'react';
import { Crosshair, Play, RotateCcw, Trophy } from 'lucide-react';

type Phase = 'idle' | 'playing' | 'over';
interface Threat {
  id: number;
  x: number;
  y: number;
}

const GAME_TIME = 20;

export function ArcadeApp() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [time, setTime] = useState(GAME_TIME);
  const [threats, setThreats] = useState<Threat[]>([]);
  const idRef = useRef(0);

  const spawn = useCallback(() => {
    setThreats((prev) => {
      if (prev.length >= 5) return prev;
      const t: Threat = {
        id: idRef.current++,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 75,
      };
      return [...prev, t];
    });
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    const spawner = setInterval(spawn, 550);
    const ticker = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(spawner);
          clearInterval(ticker);
          setPhase('over');
          setThreats([]);
          setBest((b) => Math.max(b, score));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(spawner);
      clearInterval(ticker);
    };
  }, [phase, spawn, score]);

  function start() {
    setScore(0);
    setTime(GAME_TIME);
    setThreats([]);
    setPhase('playing');
  }

  function hit(id: number) {
    setThreats((prev) => prev.filter((t) => t.id !== id));
    setScore((s) => s + 1);
  }

  return (
    <div className="flex min-h-full flex-col bg-black/80 p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-xs">
        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Crosshair className="size-4" /> Ameaças Neutralizadas: {score}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground font-semibold">
          <Trophy className="size-4 text-amber-400" /> Recorde: {best}
        </span>
        <span className="tabular-nums font-bold text-foreground bg-secondary/80 px-2 py-0.5 rounded border border-border">
          {time}s
        </span>
      </div>

      <div className="scanlines relative flex-1 overflow-hidden rounded-lg border border-border bg-background/60 min-h-[300px]">
        {phase === 'playing' &&
          threats.map((t) => (
            <button
              key={t.id}
              onClick={() => hit(t.id)}
              aria-label="Neutralizar ameaça"
              className="absolute grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-red-500/80 bg-red-500/30 text-red-400 signal-glow transition-transform hover:scale-125 cursor-pointer"
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
            >
              <Crosshair className="size-5" />
            </button>
          ))}

        {phase !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-4">
            {phase === 'over' ? (
              <>
                <p className="font-mono text-2xl font-bold text-foreground">
                  Missão Encerrada
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  Você neutralizou <span className="text-amber-400 font-bold">{score}</span> ameaças em {GAME_TIME} segundos!
                </p>
                <button
                  onClick={start}
                  className="mt-2 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 font-mono text-xs font-bold text-black transition-opacity hover:opacity-90 cursor-pointer"
                >
                  <RotateCcw className="size-4" /> Jogar Novamente
                </button>
              </>
            ) : (
              <>
                <Crosshair className="size-12 text-amber-400 animate-signal" />
                <p className="max-w-xs font-mono text-xs text-muted-foreground leading-relaxed">
                  Protocolo de Treinamento de Reflexos. Neutralize o maior número de ameaças em {GAME_TIME}s.
                </p>
                <button
                  onClick={start}
                  className="mt-1 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black transition-opacity hover:opacity-90 cursor-pointer"
                >
                  <Play className="size-4" /> Iniciar Protocolo
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
