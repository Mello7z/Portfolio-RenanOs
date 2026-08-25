import { useState } from 'react';
import {
  Code2,
  Play,
  RotateCcw,
  Terminal,
  FileCode,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { cyberBank } from '../../utils/cyberBank';

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  initialCode: string;
}

const TEMPLATES: CodeSnippet[] = [
  {
    id: 'exploit_bank',
    title: '1. Script de Exploit (Hack BankOfCyber)',
    description: 'Injete payload SQL no banco de dados para transferir R$ 250.000,00.',
    initialCode: `// Script de Exploit para Invasão do BankOfCyber
console.log("=== INICIANDO CONEXÃO EXPLOIT EM BANKOFCYBER ===");
console.log("Injetando SQL Payload no banco PostgreSQL...");

if (typeof cyberBank !== "undefined") {
  if (cyberBank.isHacked()) {
    console.warn("⚠️ O sistema do BankOfCyber já foi hackeado!");
    console.log("Saldo Atual:", "R$ " + cyberBank.getBalance().toLocaleString('pt-BR') + ",00");
  } else {
    cyberBank.setHacked(true);
    console.log("✅ [SUCESSO]: Payload aceito! Credenciais de ADMIN ignoradas.");
    console.log("💰 +R$ 250.000,00 transferidos para a sua carteira digital RenanOS!");
    console.log("Novo Saldo Total:", "R$ " + cyberBank.getBalance().toLocaleString('pt-BR') + ",00");
    console.log("🚀 Abra o Navegador no site matrix://cybergame-store para gastar suas moedas!");
  }
} else {
  console.error("Erro: API cyberBank não encontrada");
}
`,
  },
  {
    id: 'calculator',
    title: '2. Calculadora de Hashes',
    description: 'Crie uma função para simular hash de senha e verificação.',
    initialCode: `// Crie uma função de Hash de Segurança
function gerarHash(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return 'HEX-' + Math.abs(hash).toString(16).toUpperCase();
}

console.log("Hash de 'renanos':", gerarHash('renanos'));
console.log("Hash de 'admin123':", gerarHash('admin123'));
`,
  },
  {
    id: 'port_scanner',
    title: '3. Simulador de Port Scanner',
    description: 'Verifique portas abertas em um servidor local virtual.',
    initialCode: `// Simulador de Varredura de Portas (Port Scanner)
const portas = [21, 22, 80, 443, 3306, 8080];

function escanearPorta(porta) {
  const abertas = [22, 80, 443];
  if (abertas.includes(porta)) {
    return \`[ABERTA] Porta \${porta} respondendo (HTTP/SSH)\`;
  }
  return \`[FECHADA] Porta \${porta} sem resposta\`;
}

console.log("=== INICIANDO VARREDURA DE PORTAS ===");
portas.forEach(p => {
  console.log(escanearPorta(p));
});
`,
  },
  {
    id: 'cipher',
    title: '4. Cifra de César (Criptografia)',
    description: 'Escreva um algoritmo de criptografia por deslocamento.',
    initialCode: `// Algoritmo de Cifra de César
function encriptar(texto, deslocamento) {
  return texto
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(code + deslocamento);
    })
    .join('');
}

const mensagemOriginal = "RENANOS CYBER SYSTEM";
const mensagemSecreta = encriptar(mensagemOriginal, 3);

console.log("Original:", mensagemOriginal);
console.log("Criptografado:", mensagemSecreta);
`,
  },
];

export function CodeApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<CodeSnippet>(TEMPLATES[0]);
  const [code, setCode] = useState<string>(TEMPLATES[0].initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);

  function handleRun() {
    setOutput([]);
    setHasError(false);

    const logs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
      },
      error: (...args: unknown[]) => {
        logs.push('❌ [ERRO]: ' + args.join(' '));
      },
      warn: (...args: unknown[]) => {
        logs.push('⚠️ [AVISO]: ' + args.join(' '));
      },
    };

    try {
      // Execute in isolated function scope with captured console and live cyberBank API
      const runFn = new Function('console', 'cyberBank', code);
      runFn(customConsole, cyberBank);

      if (logs.length === 0) {
        setOutput(['(Código executado com sucesso sem saída de console.log)']);
      } else {
        setOutput(logs);
      }
    } catch (err: unknown) {
      setHasError(true);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setOutput([`❌ Erro de Sintaxe/Execução:\n${errorMsg}`]);
    }
  }

  function handleSelectTemplate(snippet: CodeSnippet) {
    setSelectedTemplate(snippet);
    setCode(snippet.initialCode);
    setOutput([]);
    setHasError(false);
  }

  function handleReset() {
    setCode(selectedTemplate.initialCode);
    setOutput([]);
    setHasError(false);
  }

  return (
    <div className="flex min-h-full flex-col bg-[#0a0c10] p-4 text-foreground font-mono select-none space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-4 shadow-xl flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Code2 className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">RenanCode — Studio JS IDE</h3>
            <p className="text-[11px] text-amber-400/80">
              Ambiente de Programação e Testes de Código JavaScript em Tempo Real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:bg-zinc-700 cursor-pointer transition-transform active:scale-95"
          >
            <RotateCcw className="size-3.5" /> Resetar
          </button>
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-bold text-black hover:bg-amber-400 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-transform active:scale-95"
          >
            <Play className="size-3.5 fill-black" /> Executar
          </button>
        </div>
      </div>

      {/* Main Grid: Template Selector + Editor + Console */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {/* Templates Sidebar */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="size-3.5" /> Modelos & Exploits ({TEMPLATES.length})
          </h4>
          <div className="space-y-2">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedTemplate.id === tmpl.id
                    ? 'border-amber-400 bg-amber-500/15 text-white shadow-lg'
                    : 'border-zinc-800 bg-[#121622] text-zinc-300 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className="size-4 text-amber-400 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs">{tmpl.title}</h5>
                    <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{tmpl.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-[#0e111a] p-3 text-[11px] text-zinc-400 space-y-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Sparkles className="size-3" /> Dica de Programação
            </span>
            <p className="text-[10px] leading-relaxed">
              Escreva qualquer lógica em JavaScript nativo. Você pode usar a API global <code className="text-amber-400">cyberBank.setHacked(true)</code> para acionar a simulação do hacking!
            </p>
          </div>
        </div>

        {/* Editor & Terminal Column */}
        <div className="md:col-span-2 flex flex-col space-y-3">
          {/* Code Editor Box */}
          <div className="flex-1 flex flex-col rounded-2xl border border-amber-500/30 bg-[#0e111a] overflow-hidden">
            <div className="flex items-center justify-between bg-[#121622] px-4 py-2 border-b border-border/40 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <FileCode className="size-3.5 text-amber-400" /> script.js
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">ECMAScript 2026 Engine</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Escreva seu código JavaScript aqui..."
              spellCheck={false}
              className="flex-1 w-full bg-[#07090e] p-4 text-xs font-mono text-emerald-300 outline-none resize-none leading-relaxed border-none focus:ring-0"
              style={{ minHeight: '220px' }}
            />
          </div>

          {/* Terminal Console Output */}
          <div className="rounded-2xl border border-amber-500/30 bg-[#07090e] p-3 flex flex-col space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Terminal className="size-3.5" /> Saída do Console
              </span>
              {output.length > 0 && (
                <span className={`text-[10px] font-bold flex items-center gap-1 ${hasError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {hasError ? <AlertCircle className="size-3" /> : <CheckCircle className="size-3" />}
                  {hasError ? 'Erro na Execução' : 'Concluído'}
                </span>
              )}
            </div>

            <div className="min-h-24 max-h-40 overflow-y-auto font-mono text-xs text-zinc-300 space-y-1 p-2 rounded-xl bg-[#0b0e14]">
              {output.length === 0 ? (
                <span className="text-zinc-600 italic">Clique em "Executar" para ver os resultados do console...</span>
              ) : (
                output.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
