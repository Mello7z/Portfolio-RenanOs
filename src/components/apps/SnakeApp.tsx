import { useState, useEffect, useRef } from 'react';
import { Gamepad, Play, Pause, RefreshCw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { safeStorage } from '../../utils/storage';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 18;

export function SnakeApp() {
  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ]);
  const [food, setFood] = useState<Point>({ x: 12, y: 8 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = safeStorage.getItem('renanos_snake_highscore');
    return saved ? Number(saved) : 0;
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random food point
  function generateFood(currentSnake: Point[]): Point {
    while (true) {
      const rx = Math.floor(Math.random() * GRID_SIZE);
      const ry = Math.floor(Math.random() * GRID_SIZE);
      const collision = currentSnake.some((segment) => segment.x === rx && segment.y === ry);
      if (!collision) return { x: rx, y: ry };
    }
  }

  function resetGame() {
    const initialSnake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  }

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (['ArrowUp', 'KeyW'].includes(e.code) && direction !== 'DOWN') {
        setNextDirection('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && direction !== 'UP') {
        setNextDirection('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && direction !== 'RIGHT') {
        setNextDirection('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && direction !== 'LEFT') {
        setNextDirection('RIGHT');
      } else if (e.code === 'Space') {
        setIsPaused((p) => !p);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Game Loop
  useEffect(() => {
    if (isPaused || isGameOver) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setDirection(nextDirection);

      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        if (nextDirection === 'UP') head.y -= 1;
        if (nextDirection === 'DOWN') head.y += 1;
        if (nextDirection === 'LEFT') head.x -= 1;
        if (nextDirection === 'RIGHT') head.x += 1;

        // Check Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check Food Collision
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            safeStorage.setItem('renanos_snake_highscore', String(newScore));
          }
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    }, 120);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, nextDirection, food, score, highScore]);

  return (
    <div className="flex min-h-full flex-col bg-[#0a0c10] p-4 text-foreground font-mono select-none space-y-4 overflow-y-auto">
      {/* Header Info */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Gamepad className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Cobrinha Cyber</h3>
            <p className="text-[11px] text-amber-400/80">Colete dados neon e evite colidir com as bordas</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Trophy className="size-4" />
            <span>High: {highScore}</span>
          </div>
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-white">
            Pontos: <span className="text-amber-400 font-bold">{score}</span>
          </div>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div
          className="relative grid bg-[#0c0e15] border-2 border-amber-500/30 rounded-2xl shadow-2xl p-2 gap-1 max-w-sm w-full aspect-square"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some((seg) => seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`rounded-md transition-all ${
                  isHead
                    ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] scale-105 z-10'
                    : isBody
                    ? 'bg-amber-500/70'
                    : isFood
                    ? 'bg-red-500 rounded-full animate-ping shadow-[0_0_12px_rgba(239,68,68,0.9)]'
                    : 'bg-[#121622]/50'
                }`}
              />
            );
          })}

          {/* Pause / Game Over Overlay */}
          {(isPaused || isGameOver) && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 rounded-2xl p-4 text-center space-y-3 backdrop-blur-sm">
              {isGameOver ? (
                <>
                  <h4 className="font-bold text-red-400 text-lg uppercase tracking-wider">
                    Conexão Interrompida
                  </h4>
                  <p className="text-xs text-zinc-300">
                    Sua cobrinha colidiu! Pontuação final: <strong className="text-amber-400">{score}</strong>
                  </p>
                  <button
                    onClick={resetGame}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 font-bold text-xs text-black hover:bg-amber-400 transition-transform active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="size-4" /> Jogar Novamente
                  </button>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-amber-400 text-base uppercase tracking-wider">
                    Partida Pausada
                  </h4>
                  <p className="text-xs text-zinc-400">Use W,A,S,D ou setas no teclado para mover</p>
                  <button
                    onClick={() => {
                      if (snake.length === 3 && score === 0) resetGame();
                      else setIsPaused(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 font-bold text-xs text-black hover:bg-amber-400 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="size-4" /> Iniciar / Continuar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* On-screen Direction Pad for touch / mouse */}
      <div className="flex flex-col items-center justify-center space-y-1 pt-1">
        <button
          onClick={() => direction !== 'DOWN' && setNextDirection('UP')}
          className="grid size-10 place-items-center rounded-xl border border-amber-500/30 bg-[#121622] text-amber-400 hover:bg-amber-500/20 cursor-pointer"
        >
          <ArrowUp className="size-5" />
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => direction !== 'RIGHT' && setNextDirection('LEFT')}
            className="grid size-10 place-items-center rounded-xl border border-amber-500/30 bg-[#121622] text-amber-400 hover:bg-amber-500/20 cursor-pointer"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="grid size-10 place-items-center rounded-xl border border-amber-500/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 cursor-pointer"
          >
            {isPaused ? <Play className="size-4 pl-0.5" /> : <Pause className="size-4" />}
          </button>
          <button
            onClick={() => direction !== 'LEFT' && setNextDirection('RIGHT')}
            className="grid size-10 place-items-center rounded-xl border border-amber-500/30 bg-[#121622] text-amber-400 hover:bg-amber-500/20 cursor-pointer"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
        <button
          onClick={() => direction !== 'UP' && setNextDirection('DOWN')}
          className="grid size-10 place-items-center rounded-xl border border-amber-500/30 bg-[#121622] text-amber-400 hover:bg-amber-500/20 cursor-pointer"
        >
          <ArrowDown className="size-5" />
        </button>
      </div>
    </div>
  );
}
