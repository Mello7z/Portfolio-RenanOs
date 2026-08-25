import type { AppId } from '../../types';
import { DossieApp } from '../apps/DossieApp';
import { MissoesApp } from '../apps/MissoesApp';
import { ArsenalApp } from '../apps/ArsenalApp';
import { TerminalApp } from '../apps/TerminalApp';
import { SinalApp } from '../apps/SinalApp';
import { TrilhaApp } from '../apps/TrilhaApp';
import { RegistrosApp } from '../apps/RegistrosApp';
import { DiarioApp } from '../apps/DiarioApp';
import { CalendarioApp } from '../apps/CalendarioApp';
import { ArcadeApp } from '../apps/ArcadeApp';
import { MemoriaApp } from '../apps/MemoriaApp';
import { BombaApp } from '../apps/BombaApp';
import { SnakeApp } from '../apps/SnakeApp';
import { TypingApp } from '../apps/TypingApp';
import { CalcApp } from '../apps/CalcApp';
import { BrowserApp } from '../apps/BrowserApp';
import { VaultApp } from '../apps/VaultApp';
import { CodeApp } from '../apps/CodeApp';
import { CurriculoApp } from '../apps/CurriculoApp';
import { PlanoDeFundoApp } from '../apps/PlanoDeFundoApp';

export function AppContent({ appId, onOpenApp }: { appId: AppId; onOpenApp?: (appId: AppId) => void }) {
  switch (appId) {
    case 'dossie':
      return <DossieApp onOpenApp={onOpenApp} />;
    case 'curriculo':
      return <CurriculoApp />;
    case 'plano':
      return <PlanoDeFundoApp />;
    case 'missoes':
      return <MissoesApp />;
    case 'arsenal':
      return <ArsenalApp />;
    case 'terminal':
      return <TerminalApp />;
    case 'sinal':
      return <SinalApp />;
    case 'trilha':
      return <TrilhaApp />;
    case 'registros':
      return <RegistrosApp />;
    case 'diario':
      return <DiarioApp />;
    case 'calendario':
      return <CalendarioApp />;
    case 'arcade':
      return <ArcadeApp />;
    case 'memoria':
      return <MemoriaApp />;
    case 'bomba':
      return <BombaApp />;
    case 'snake':
      return <SnakeApp />;
    case 'typing':
      return <TypingApp />;
    case 'calc':
      return <CalcApp />;
    case 'browser':
      return <BrowserApp />;
    case 'vault':
      return <VaultApp />;
    case 'code':
      return <CodeApp />;
    default:
      return null;
  }
}
