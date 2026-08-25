import { useState } from 'react';
import { Calculator, Delete, RotateCcw } from 'lucide-react';

export function CalcApp() {
  const [display, setDisplay] = useState<string>('0');
  const [equation, setEquation] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);

  function handleNumber(num: string) {
    if (display === '0' || isDone) {
      setDisplay(num);
      setIsDone(false);
    } else {
      setDisplay((d) => d + num);
    }
  }

  function handleOp(op: string) {
    setIsDone(false);
    setEquation(`${display} ${op} `);
    setDisplay('0');
  }

  function handleClear() {
    setDisplay('0');
    setEquation('');
    setIsDone(false);
  }

  function handleDelete() {
    if (display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay((d) => d.slice(0, -1));
    }
  }

  function handleEquals() {
    if (!equation) return;
    try {
      const fullExp = equation + display;
      // Sanitize input safely
      const cleanExp = fullExp.replace(/×/g, '*').replace(/÷/g, '/');
      const result = eval(cleanExp);
      setDisplay(String(Number(result.toFixed(6))));
      setEquation('');
      setIsDone(true);
    } catch {
      setDisplay('Erro');
      setEquation('');
      setIsDone(true);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#0a0c10] p-4 text-foreground font-mono select-none space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-3 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Calculator className="size-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white">Calculadora Tática</h3>
            <p className="text-[10px] text-amber-400/80">Cálculos Criptográficos & Operacionais</p>
          </div>
        </div>
      </div>

      {/* Screen Display */}
      <div className="rounded-2xl border border-amber-500/40 bg-[#0e111a] p-4 text-right shadow-2xl flex flex-col justify-end min-h-[90px]">
        <span className="text-xs text-zinc-400 min-h-[18px]">{equation}</span>
        <span className="text-2xl font-bold text-amber-400 tracking-wider truncate mt-1">
          {display}
        </span>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        <button
          onClick={handleClear}
          className="rounded-xl border border-red-500/40 bg-red-500/15 text-red-400 font-bold p-3 hover:bg-red-500/25 transition-colors cursor-pointer"
        >
          AC
        </button>
        <button
          onClick={handleDelete}
          className="rounded-xl border border-zinc-700 bg-[#141824] text-zinc-300 font-bold p-3 hover:bg-[#1a2030] transition-colors cursor-pointer flex items-center justify-center"
        >
          <Delete className="size-4" />
        </button>
        <button
          onClick={() => handleOp('÷')}
          className="rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 font-bold p-3 hover:bg-amber-500/25 transition-colors cursor-pointer text-lg"
        >
          ÷
        </button>
        <button
          onClick={() => handleOp('×')}
          className="rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 font-bold p-3 hover:bg-amber-500/25 transition-colors cursor-pointer text-lg"
        >
          ×
        </button>

        <button
          onClick={() => handleNumber('7')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          7
        </button>
        <button
          onClick={() => handleNumber('8')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          8
        </button>
        <button
          onClick={() => handleNumber('9')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          9
        </button>
        <button
          onClick={() => handleOp('-')}
          className="rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 font-bold p-3 hover:bg-amber-500/25 transition-colors cursor-pointer text-lg"
        >
          -
        </button>

        <button
          onClick={() => handleNumber('4')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          4
        </button>
        <button
          onClick={() => handleNumber('5')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          5
        </button>
        <button
          onClick={() => handleNumber('6')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          6
        </button>
        <button
          onClick={() => handleOp('+')}
          className="rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 font-bold p-3 hover:bg-amber-500/25 transition-colors cursor-pointer text-lg"
        >
          +
        </button>

        <button
          onClick={() => handleNumber('1')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          1
        </button>
        <button
          onClick={() => handleNumber('2')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          2
        </button>
        <button
          onClick={() => handleNumber('3')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          3
        </button>
        <button
          onClick={handleEquals}
          className="row-span-2 rounded-xl border border-amber-400 bg-amber-500 text-black font-extrabold p-3 hover:bg-amber-400 transition-transform active:scale-95 cursor-pointer flex items-center justify-center text-xl shadow-[0_0_15px_rgba(251,191,36,0.4)]"
        >
          =
        </button>

        <button
          onClick={() => handleNumber('0')}
          className="col-span-2 rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          0
        </button>
        <button
          onClick={() => handleNumber('.')}
          className="rounded-xl border border-zinc-800 bg-[#121622] text-white font-bold p-3 hover:bg-[#1b2132] transition-colors cursor-pointer text-lg"
        >
          .
        </button>
      </div>
    </div>
  );
}
