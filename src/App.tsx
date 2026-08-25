import { OsShell } from './components/os/OsShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <OsShell />
      </LanguageProvider>
    </ErrorBoundary>
  );
}


