import { useState, useEffect, type MouseEvent } from 'react';
import {
  Bomb,
  Flag,
  RefreshCw,
  Trophy,
  Timer,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export function BombaApp() {
  const [rows, setRows] = useState<number>(8);
  const [cols, setCols] = useState<number>(8);
  const [minesCount, setMinesCount] = useState<number>(10);

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [flagMode, setFlagMode] = useState<boolean>(false);
  const [flagsUsed, setFlagsUsed] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);

  // Initialize board
  function initBoard(numRows = rows, numCols = cols, totalMines = minesCount) {
    // Empty board
    const newGrid: Cell[][] = [];
    for (let r = 0; r < numRows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < numCols; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }

    // Place mines randomly
    let placed = 0;
    while (placed < totalMines) {
      const rr = Math.floor(Math.random() * numRows);
      const cc = Math.floor(Math.random() * numCols);
      if (!newGrid[rr][cc].isMine) {
        newGrid[rr][cc].isMine = true;
        placed++;
      }
    }

    // Calculate neighbor mines
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
                if (newGrid[nr][nc].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameState('idle');
    setFlagsUsed(0);
    setTimer(0);
  }

  useEffect(() => {
    initBoard(rows, cols, minesCount);
  }, [rows, cols, minesCount]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Reveal Cell recursively if 0 neighbor mines
  function revealCell(r: number, c: number, currentGrid: Cell[][]): Cell[][] {
    const updated = currentGrid.map((row) => row.map((cell) => ({ ...cell })));
    const stack: [number, number][] = [[r, c]];

    while (stack.length > 0) {
      const [currR, currC] = stack.pop()!;
      const cell = updated[currR][currC];

      if (cell.isRevealed || cell.isFlagged) continue;

      cell.isRevealed = true;

      if (cell.neighborMines === 0 && !cell.isMine) {
        // Add neighbors to stack
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = currR + dr;
            const nc = currC + dc;
            if (
              nr >= 0 &&
              nr < rows &&
              nc >= 0 &&
              nc < cols &&
              !updated[nr][nc].isRevealed &&
              !updated[nr][nc].isFlagged
            ) {
              stack.push([nr, nc]);
            }
          }
        }
      }
    }

    return updated;
  }

  // Handle cell click
  function handleCellClick(r: number, c: number) {
    if (gameState === 'won' || gameState === 'lost') return;

    const cell = grid[r][c];
    if (cell.isRevealed) return;

    if (flagMode) {
      toggleFlag(r, c);
      return;
    }

    if (cell.isFlagged) return;

    if (gameState === 'idle') {
      setGameState('playing');
    }

    // Clicked mine!
    if (cell.isMine) {
      // Reveal all mines
      const revealedGrid = grid.map((row) =>
        row.map((item) => ({
          ...item,
          isRevealed: item.isMine ? true : item.isRevealed,
        }))
      );
      setGrid(revealedGrid);
      setGameState('lost');
      return;
    }

    // Safe cell
    const newGrid = revealCell(r, c, grid);
    setGrid(newGrid);

    // Check win condition
    let unrevealedSafe = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newGrid[i][j].isMine && !newGrid[i][j].isRevealed) {
          unrevealedSafe++;
        }
      }
    }

    if (unrevealedSafe === 0) {
      setGameState('won');
    }
  }

  // Handle right click or flag toggle
  function handleCellRightClick(e: MouseEvent, r: number, c: number) {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    toggleFlag(r, c);
  }

  function toggleFlag(r: number, c: number) {
    const cell = grid[r][c];
    if (cell.isRevealed) return;

    if (gameState === 'idle') setGameState('playing');

    const nextGrid = grid.map((row) =>
      row.map((item) => {
        if (item.r === r && item.c === c) {
          const nextFlagged = !item.isFlagged;
          setFlagsUsed((f) => (nextFlagged ? f + 1 : f - 1));
          return { ...item, isFlagged: nextFlagged };
        }
        return item;
      })
    );

    setGrid(nextGrid);
  }

  return (
    <div className="flex min-h-full flex-col bg-[#0a0c10] p-4 text-foreground font-mono select-none space-y-4 overflow-y-auto">
      {/* Header Info */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Bomb className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Desarme de Bomba</h3>
            <p className="text-[11px] text-amber-400/80">Localize e isole todos os explosivos táticos</p>
          </div>
        </div>

        {/* Difficulty presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => {
              setRows(8);
              setCols(8);
              setMinesCount(10);
            }}
            className={`rounded px-2.5 py-1 border transition-colors cursor-pointer ${
              rows === 8
                ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-500/50'
                : 'border-zinc-800 text-zinc-400 hover:bg-white/5'
            }`}
          >
            Fácil (8x8)
          </button>
          <button
            onClick={() => {
              setRows(10);
              setCols(10);
              setMinesCount(18);
            }}
            className={`rounded px-2.5 py-1 border transition-colors cursor-pointer ${
              rows === 10
                ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-500/50'
                : 'border-zinc-800 text-zinc-400 hover:bg-white/5'
            }`}
          >
            Médio (10x10)
          </button>
        </div>
      </div>

      {/* Control Panel: Mines Left, Status, Timer, Flag Toggle */}
      <div className="rounded-2xl border border-border/80 bg-[#10131a] p-3 flex items-center justify-between shadow-md">
        {/* Remaining Mines */}
        <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
          <Bomb className="size-4" />
          <span className="text-sm">{minesCount - flagsUsed}</span>
        </div>

        {/* Reset / Status Button */}
        <button
          onClick={() => initBoard(rows, cols, minesCount)}
          className="grid size-10 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer active:scale-95"
          title="Nova Partida"
        >
          {gameState === 'won' ? (
            <CheckCircle2 className="size-5 text-emerald-400" />
          ) : gameState === 'lost' ? (
            <AlertTriangle className="size-5 text-red-400 animate-bounce" />
          ) : (
            <RefreshCw className="size-5" />
          )}
        </button>

        {/* Mobile / Touch Flag Mode Toggle Button */}
        <button
          onClick={() => setFlagMode((m) => !m)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
            flagMode
              ? 'border-red-500 bg-red-500/20 text-red-400'
              : 'border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
          }`}
          title="Alternar Modo de Marcador de Bandeira"
        >
          <Flag className="size-3.5" />
          <span>{flagMode ? 'Marcando' : 'Revelando'}</span>
        </button>

        {/* Timer */}
        <div className="flex items-center gap-1.5 font-mono text-zinc-300 text-xs">
          <Timer className="size-4 text-amber-400" />
          <span>{timer}s</span>
        </div>
      </div>

      {/* Mines Grid */}
      <div className="flex justify-center py-2">
        <div
          className="grid gap-1.5 p-3 rounded-2xl border border-amber-500/20 bg-[#0d0f17] shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row) =>
            row.map((cell) => {
              const isRevealed = cell.isRevealed;
              const isFlagged = cell.isFlagged;
              const isMine = cell.isMine;

              let colorClass = 'text-zinc-400';
              if (cell.neighborMines === 1) colorClass = 'text-blue-400';
              if (cell.neighborMines === 2) colorClass = 'text-emerald-400';
              if (cell.neighborMines === 3) colorClass = 'text-red-400';
              if (cell.neighborMines >= 4) colorClass = 'text-amber-400 font-extrabold';

              return (
                <button
                  key={`${cell.r}-${cell.c}`}
                  onClick={() => handleCellClick(cell.r, cell.c)}
                  onContextMenu={(e) => handleCellRightClick(e, cell.r, cell.c)}
                  className={`grid size-9 sm:size-10 place-items-center rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer ${
                    isRevealed
                      ? isMine
                        ? 'border-red-500 bg-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                        : 'border-zinc-800 bg-[#161a26] text-zinc-200'
                      : isFlagged
                      ? 'border-red-500/60 bg-red-500/10 text-red-400'
                      : 'border-amber-500/20 bg-[#121622] hover:border-amber-500/50 hover:bg-[#1b2132] text-zinc-500'
                  }`}
                >
                  {isRevealed ? (
                    isMine ? (
                      <Bomb className="size-4 animate-pulse" />
                    ) : cell.neighborMines > 0 ? (
                      <span className={colorClass}>{cell.neighborMines}</span>
                    ) : (
                      ''
                    )
                  ) : isFlagged ? (
                    <Flag className="size-4 text-red-400" />
                  ) : (
                    ''
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Win / Loss Message */}
      {gameState === 'won' && (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-center space-y-2 animate-bounce">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="size-5" /> Todas as Bombas Desarmadas!
          </div>
          <p className="text-xs text-zinc-300">
            Sua varredura tática eliminou todas as ameaças em <strong className="text-white">{timer} segundos</strong>.
          </p>
          <button
            onClick={() => initBoard(rows, cols, minesCount)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 font-bold text-xs text-black hover:bg-emerald-400 cursor-pointer"
          >
            <RefreshCw className="size-3.5" /> Nova Varredura
          </button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-4 text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-red-400 font-bold text-sm">
            <ShieldAlert className="size-5" /> Detonação Detectada!
          </div>
          <p className="text-xs text-zinc-300">Você atingiu uma mina terrestre no campo de operações.</p>
          <button
            onClick={() => initBoard(rows, cols, minesCount)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 font-bold text-xs text-white hover:bg-red-400 cursor-pointer"
          >
            <RefreshCw className="size-3.5" /> Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
