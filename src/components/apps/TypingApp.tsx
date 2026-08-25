import { useState, useEffect, useRef } from 'react';
import { Keyboard, RefreshCw, Trophy, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { safeStorage } from '../../utils/storage';

const SNIPPETS = [
  'const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);',
  'sudo systemctl restart nginx.service --now',
  'SELECT * FROM credentials WHERE access_level >= 5;',
  'npm run build && esbuild server.ts --bundle',
  'git checkout -b feature/cyber-protocol-encryption',
  'docker exec -it matrix_node_1 /bin/bash',
  'chmod 700 ~/.ssh/authorized_keys',
];

export function TypingApp() {
  const [snippetIndex, setSnippetIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [highWpm, setHighWpm] = useState<number>(() => {
    const saved = safeStorage.getItem('renanos_typing_high_wpm');
    return saved ? Number(saved) : 0;
  });

  const targetText = SNIPPETS[snippetIndex];
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [snippetIndex]);

  function handleChange(value: string) {
    if (startTime === null) {
      setStartTime(Date.now());
    }

    setUserInput(value);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === targetText[i]) correct++;
    }
    const currentAcc = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;
    setAccuracy(currentAcc);

    // Calculate WPM
    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        const words = value.length / 5;
        const currentWpm = Math.round(words / elapsedMinutes);
        setWpm(currentWpm);
      }
    }

    // Check completion
    if (value === targetText) {
      const finalMinutes = (Date.now() - (startTime || Date.now())) / 60000;
      const finalWpm = Math.round((targetText.length / 5) / (finalMinutes || 0.01));

      if (finalWpm > highWpm) {
        setHighWpm(finalWpm);
        safeStorage.setItem('renanos_typing_high_wpm', String(finalWpm));
      }

      setCompletedCount((c) => c + 1);

      // Next snippet
      setTimeout(() => {
        setUserInput('');
        setStartTime(null);
        setSnippetIndex((idx) => (idx + 1) % SNIPPETS.length);
      }, 500);
    }
  }

  function resetGame() {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setSnippetIndex((idx) => (idx + 1) % SNIPPETS.length);
  }

  return (
    <div className="flex min-h-full flex-col bg-[#0a0c10] p-4 text-foreground font-mono select-none space-y-4 overflow-y-auto">
      {/* Header Info */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Keyboard className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Hack Speed — Teste de Digitação Shell</h3>
            <p className="text-[11px] text-amber-400/80">Digite os comandos da matriz com máxima precisão</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Trophy className="size-4" />
            <span>Recorde: {highWpm} WPM</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/70 bg-[#10131a] p-3 text-center">
          <p className="text-[10px] uppercase text-zinc-400 font-semibold">Velocidade</p>
          <p className="text-xl font-bold text-amber-400 mt-0.5">{wpm} WPM</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-[#10131a] p-3 text-center">
          <p className="text-[10px] uppercase text-zinc-400 font-semibold">Precisão</p>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">{accuracy}%</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-[#10131a] p-3 text-center">
          <p className="text-[10px] uppercase text-zinc-400 font-semibold">Comandos Hacks</p>
          <p className="text-xl font-bold text-amber-400 mt-0.5">{completedCount}</p>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#0e111a] p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-2 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <Terminal className="size-3.5" /> Alvo de Criptografia #{snippetIndex + 1}
          </span>
          <span>Digite o código exatamente como mostrado</span>
        </div>

        {/* Highlighted text rendering */}
        <div className="rounded-xl border border-zinc-800 bg-[#07090e] p-4 font-mono text-sm leading-relaxed tracking-wider break-all leading-6 min-h-[80px]">
          {targetText.split('').map((char, i) => {
            let charClass = 'text-zinc-600';
            if (i < userInput.length) {
              charClass =
                userInput[i] === char
                  ? 'text-emerald-400 font-bold bg-emerald-500/20 rounded'
                  : 'text-red-400 font-bold bg-red-500/30 underline decoration-red-500';
            }
            return (
              <span key={i} className={charClass}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Digite aqui para descriptografar..."
            className="w-full rounded-xl border border-amber-500/40 bg-[#121622] px-4 py-3 text-white font-mono text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-[11px] text-zinc-500">Dica: Quanto mais rápido e preciso, maior seu WPM!</span>
        <button
          onClick={resetGame}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
        >
          <RefreshCw className="size-3.5" /> Mudar Comando
        </button>
      </div>
    </div>
  );
}
