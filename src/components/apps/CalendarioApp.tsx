import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const EVENTS: Record<number, string> = {
  5: 'Deploy — Projeto Radar',
  12: 'Auditoria de Segurança Pentest',
  18: 'Refatoração de Arquitetura',
  25: 'Code Review & Security Check',
};

export function CalendarioApp() {
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const view = new Date(base.getFullYear(), base.getMonth() + offset, 1);

  const { cells, monthLabel } = useMemo(() => {
    const year = view.getFullYear();
    const month = view.getMonth();
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    const monthLabel = view.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
    return { cells, monthLabel };
  }, [view]);

  const isCurrentMonth = offset === 0;
  const today = base.getDate();

  return (
    <div className="flex min-h-full flex-col bg-background/50 p-4 overflow-y-auto">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setOffset((o) => o - 1)}
          className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <h3 className="font-mono text-sm font-bold capitalize text-foreground">
          {monthLabel}
        </h3>
        <button
          onClick={() => setOffset((o) => o + 1)}
          className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Próximo mês"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-muted-foreground font-bold">
        {WEEKDAYS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const hasEvent = d != null && isCurrentMonth && EVENTS[d];
          const isToday = d === today && isCurrentMonth;
          return (
            <div
              key={i}
              className={`relative flex aspect-square items-center justify-center rounded-md font-mono text-xs ${
                isToday
                  ? 'bg-amber-500 font-bold text-black'
                  : d
                    ? 'border border-border/60 text-foreground/90'
                    : ''
              }`}
            >
              {d}
              {hasEvent && !isToday && (
                <span className="absolute bottom-1 size-1.5 rounded-full bg-amber-400" />
              )}
            </div>
          );
        })}
      </div>

      {isCurrentMonth && (
        <div className="mt-4 flex-1 space-y-1.5 border-t border-border pt-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground font-bold">
            Próximas Operações do Mês
          </p>
          {Object.entries(EVENTS).map(([day, label]) => (
            <div
              key={day}
              className="flex items-center gap-2 rounded-md border border-border bg-card/60 px-2.5 py-1.5 font-mono text-xs text-foreground/80"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded bg-amber-500/20 text-amber-400 font-bold tabular-nums">
                {day}
              </span>
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
