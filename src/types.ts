export type AppId =
  | 'dossie'
  | 'missoes'
  | 'arsenal'
  | 'terminal'
  | 'sinal'
  | 'trilha'
  | 'registros'
  | 'diario'
  | 'calendario'
  | 'arcade'
  | 'memoria'
  | 'bomba'
  | 'snake'
  | 'typing'
  | 'calc'
  | 'browser'
  | 'vault'
  | 'code'
  | 'curriculo'
  | 'plano';

export interface AppMeta {
  id: AppId;
  label: string;
  title: string;
  subtitle: string;
  onDesktop: boolean;
  inDock: boolean;
  defaultSize: { width: number; height: number };
}

export interface WindowState {
  id: string;
  appId: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}
