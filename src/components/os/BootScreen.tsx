import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const LINES = [
  'INICIANDO NÚCLEO SEGURO...',
  'MONTANDO SISTEMA DE ARQUIVOS CRIPTOGRAFADO... OK',
  'CARREGANDO MÓDULOS TÁTICOS DE DESENVOLVIMENTO... OK',
  'VERIFICANDO INTEGRIDADE DO ARSENAL... OK',
  'ESTABELECENDO CANAL DE SINAL CRIPTOGRAFADO... OK',
  'SISTEMA RENAN·OS PRONTO.',
];

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= LINES.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible((v) => v + 1), 350);
    return () => clearTimeout(t);
  }, [visible, onDone]);

  return (
    <div className="scanlines fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6">
      <ShieldCheck className="mb-8 size-16 text-amber-400 text-glow animate-signal" />
      <div className="w-full max-w-md font-mono text-xs leading-6 text-amber-400/90">
        {LINES.slice(0, visible).map((line, i) => (
          <p key={i} className="flex gap-2">
            <span className="text-muted-foreground">{'>'}</span>
            <span className={i === LINES.length - 1 ? 'text-foreground font-bold' : ''}>
              {line}
            </span>
          </p>
        ))}
        {visible < LINES.length && (
          <span className="inline-block h-4 w-2 animate-pulse bg-amber-400 align-middle" />
        )}
      </div>
    </div>
  );
}
