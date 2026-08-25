import { useState, type FormEvent } from 'react';
import { FolderLock, KeyRound, FileText, Lock, Unlock, ShieldCheck, Download, Eye } from 'lucide-react';

interface SecretFile {
  id: string;
  name: string;
  size: string;
  date: string;
  classification: string;
  content: string;
}

const SECRET_FILES: SecretFile[] = [
  {
    id: 'f1',
    name: 'plano_operacao_alpha.txt',
    size: '14.2 KB',
    date: '2026-07-28',
    classification: 'TOP SECRET',
    content:
      'REPOSITÓRIO SEGREDO RENANOS\n\nObjetivo: Desenvolver o ambiente operacional web mais ágil, fluido e impactante.\n\nRegras de Engajamento:\n1. Alta performance visual cyberpunk tática.\n2. Interface fluida com animações reativas.\n3. Jogos interativos para pausas táticas.',
  },
  {
    id: 'f2',
    name: 'coordenadas_servidor_master.json',
    size: '8.7 KB',
    date: '2026-07-29',
    classification: 'CONFIDENCIAL',
    content:
      '{\n  "datacenter": "GRU-01",\n  "status": "SECURE",\n  "encryption": "AES-256-GCM",\n  "failover_nodes": ["SP-01", "NYC-04", "TYO-09"]\n}',
  },
  {
    id: 'f3',
    name: 'chaves_ssh_backup.key',
    size: '2.1 KB',
    date: '2026-07-25',
    classification: 'RESTRITO',
    content:
      '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAABCG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\nQyNTUxOQAAACBA1m/8... [ENCRYPTED RENANOS KEY]\n-----END OPENSSH PRIVATE KEY-----',
  },
];

export function VaultApp() {
  const [password, setPassword] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<SecretFile | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  function handleUnlock(e: FormEvent) {
    e.preventDefault();
    if (password === '1234' || password === 'admin' || password === 'renan' || password === 'renanos') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Senha incorreta! Dica: tente "1234" ou "renanos"');
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#0a0c10] p-4 text-foreground font-mono select-none space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <FolderLock className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Cofre de Arquivos Confidenciais</h3>
            <p className="text-[11px] text-amber-400/80">
              {isUnlocked ? 'Acesso Concedido — Arquivos Descriptografados' : 'Acesso Bloqueado — Requer Senha de Mestre'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1">
              <Unlock className="size-3.5" /> Desbloqueado
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1">
              <Lock className="size-3.5" /> Bloqueado
            </span>
          )}
        </div>
      </div>

      {!isUnlocked ? (
        /* Password Prompt */
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <form
            onSubmit={handleUnlock}
            className="rounded-2xl border border-amber-500/30 bg-[#0e111a] p-6 shadow-2xl max-w-sm w-full space-y-4 text-center"
          >
            <div className="size-12 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 grid place-items-center mx-auto">
              <KeyRound className="size-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Digite a Senha do Vault</h4>
              <p className="text-xs text-zinc-400 mt-1">Dica de mestre: use "1234" ou "renanos"</p>
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha..."
              className="w-full rounded-xl border border-amber-500/40 bg-[#121622] px-4 py-2.5 text-center text-amber-300 font-mono outline-none focus:border-amber-400"
            />

            {errorMsg && <p className="text-xs font-bold text-red-400">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Descriptografar Vault
            </button>
          </form>
        </div>
      ) : (
        /* File Explorer inside Vault */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {/* File list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Documentos ({SECRET_FILES.length})</h4>
            {SECRET_FILES.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`w-full p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                  selectedFile?.id === file.id
                    ? 'border-amber-400 bg-amber-500/20 text-white'
                    : 'border-zinc-800 bg-[#121622] text-zinc-300 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-amber-400" />
                  <div>
                    <h5 className="font-bold text-xs">{file.name}</h5>
                    <p className="text-[10px] text-zinc-400">{file.size} • {file.classification}</p>
                  </div>
                </div>
                <Eye className="size-3.5 text-zinc-500" />
              </button>
            ))}
          </div>

          {/* File viewer */}
          <div className="md:col-span-2 rounded-2xl border border-amber-500/30 bg-[#0e111a] p-4 flex flex-col space-y-3">
            {selectedFile ? (
              <>
                <div className="flex justify-between items-center border-b border-border/40 pb-2">
                  <div>
                    <h4 className="font-bold text-xs text-amber-300">{selectedFile.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-bold">{selectedFile.classification}</span>
                  </div>
                  <button
                    onClick={() => {
                      const blob = new Blob([selectedFile.content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = selectedFile.name;
                      a.click();
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                  >
                    <Download className="size-3" /> Baixar
                  </button>
                </div>
                <pre className="flex-1 rounded-xl bg-[#07090e] p-3 text-xs text-zinc-300 font-mono overflow-auto whitespace-pre-wrap leading-relaxed border border-zinc-800">
                  {selectedFile.content}
                </pre>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-zinc-500">
                <ShieldCheck className="size-10 text-amber-500/40 mb-2" />
                <p className="text-xs">Selecione um arquivo à esquerda para visualizar seu conteúdo confidencial.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
