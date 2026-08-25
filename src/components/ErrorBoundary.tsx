import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  props: Props;
  state: State = {
    hasError: false,
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RenanOS Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a0c10] p-6 text-white font-mono select-none">
          <div className="max-w-md w-full rounded-2xl border border-amber-500/40 bg-[#0e111a] p-6 text-center space-y-4 shadow-2xl">
            <div className="size-14 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-400 grid place-items-center mx-auto">
              <ShieldAlert className="size-8 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider">
              Falha de Execução de Kernel
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Ocorreu uma exceção inesperada ao carregar a interface do sistema.
            </p>
            {this.state.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-[11px] text-red-300 text-left font-mono break-all max-h-32 overflow-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-xs text-black hover:bg-amber-400 transition-transform active:scale-95 cursor-pointer"
            >
              <RefreshCw className="size-4" /> Recarregar RenanOS
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
