import { useEffect, useRef, useState } from 'react';
import { cyberBank, SHOP_ITEMS } from '../../utils/cyberBank';

interface Line {
  type: 'in' | 'out' | 'sys';
  text: string;
}

const BANNER: Line[] = [
  { type: 'sys', text: 'RenanOS Shell v3.0 — Canal Seguro Criptografado' },
  { type: 'sys', text: 'Digite "ajuda" para comandos gerais ou "cyber" para comandos de hacking.' },
];

const COMMANDS: Record<string, string[]> = {
  ajuda: [
    'Comandos do Sistema:',
    '  whoami      — perfil e estudante de Sistemas de Informação',
    '  projetos    — lista de projetos (FantasyHub, RenanOS, PortDev, etc.)',
    '  arsenal     — stack (React, Next.js, Node, Python, Cyber, SQL)',
    '  cyber       — lista os comandos de hacking e simulação',
    '  status      — estado do sistema e conexão',
    '  limpar      — limpa o histórico da tela',
  ],
  cyber: [
    '🎯 COMANDOS TÁTICOS DE HACKING & SIMULAÇÃO:',
    '  scan 10.240.88.99     — escanear o servidor do BankOfCyber',
    '  exploit bankofcyber   — executar injeção de payload no banco',
    '  saldo                 — consultar saldo da carteira digital',
    '  loja                  — listar itens VIPs disponíveis na loja',
    '  comprar <item_id>     — comprar item com dinheiro hackeado',
    '  reset-banco           — reiniciar o estado da simulação de hacking',
  ],
  whoami: [
    'nome:       Renan Mello',
    'formação:   Estudante de Sistemas de Informação',
    'atuação:    Dev em Formação (Full-Stack, IA & Cybersecurity)',
    'foco:       Desenvolvimento de Software, Interfaces e Segurança Web',
  ],
  projetos: [
    'PROJ-01  FantasyHub ......... Marketplace (fantasytoca.netlify.app)',
    'PROJ-02  VT Music ........... Experiência Digital (vt-music.netlify.app)',
    'PROJ-03  PortDev ............ SaaS de Portfólios com IA (Next.js/FastAPI)',
    'PROJ-04  AutoJob AI ......... Gerador de Documentos com IA',
    'PROJ-05  RenanOS ............ Portfólio Interativo & Cyber Security OS',
  ],
  arsenal: [
    'front: React, Next.js, Tailwind CSS, GSAP, Three.js, Framer Motion',
    'back:  Node.js, Express, Python, FastAPI, APIs REST',
    'banco: MySQL, PostgreSQL, SQL, Modelagem de Dados',
    'cyber: OWASP Top 10, Redes, Linux, Análise de Vulnerabilidades, Pentest',
  ],
  experiencia: [
    'FAPESP — Auxiliar de Escritório Geral',
    '  - Processos administrativos digitais e sistemas corporativos',
    '  - Consulta e verificação de dados de empresas via CNPJ',
    '  - Gestão de documentos, atenção aos detalhes e organização',
  ],
  contato: [
    'email:    renan.rochaa0@gmail.com',
    'github:   github.com/Mello7z',
    'linkedin: linkedin.com/in/renan-emanoel-5237273b7',
  ],
  lema: [
    '"Transformando conhecimento em tecnologia, e tecnologia em soluções."',
  ],
  status: [
    'status:     ONLINE',
    'firewall:   ATIVO',
    'curso:      Sistemas de Informação',
    'objetivo:   Oportunidade em Dev Full-Stack / Cybersecurity / IA',
  ],
};

const ALIASES: Record<string, string> = {
  help: 'ajuda',
  sobre: 'whoami',
  quem: 'whoami',
  missoes: 'projetos',
  skills: 'arsenal',
  stack: 'arsenal',
  contact: 'contato',
  clear: 'limpar',
  fapesp: 'experiencia',
  nmap: 'scan 10.240.88.99',
  hack: 'exploit bankofcyber',
  balance: 'saldo',
};

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  async function run(raw: string) {
    if (isExecuting) return;
    let cmd = raw.trim().toLowerCase();
    cmd = ALIASES[cmd] ?? cmd;
    const next: Line[] = [...lines, { type: 'in', text: raw }];

    if (!cmd) {
      setLines(next);
      return;
    }
    if (cmd === 'limpar') {
      setLines(BANNER);
      return;
    }

    // Dynamic Hacking Commands
    if (cmd.startsWith('scan') || cmd.startsWith('nmap')) {
      setIsExecuting(true);
      setLines([
        ...next,
        { type: 'sys', text: '🔍 INICIANDO VARREDURA NMAP EM 10.240.88.99 (BankOfCyber Servidor Central)...' },
      ]);

      await new Promise((r) => setTimeout(r, 600));
      setLines((prev) => [
        ...prev,
        { type: 'out', text: '[+] Porta 22/tcp   ABERTA  OpenSSH 8.9p1 (Ubuntu)' },
        { type: 'out', text: '[+] Porta 80/tcp   ABERTA  Nginx 1.24 (BankOfCyber Web)' },
        { type: 'out', text: '[+] Porta 5432/tcp ABERTA  PostgreSQL 15.2 (Database)' },
        { type: 'sys', text: '⚠️ [VULNERABILIDADE DETECTADA]: CVE-2026-SQLI-BYPASS no endpoint /api/v1/transfer' },
        { type: 'sys', text: '👉 Dica: Execute "exploit bankofcyber" ou use o app Code Studio para injetar a payload.' },
      ]);
      setIsExecuting(false);
      return;
    }

    if (cmd.startsWith('exploit') || cmd === 'hack' || cmd === 'hack-bank') {
      if (cyberBank.isHacked()) {
        setLines([
          ...next,
          { type: 'out', text: '⚠️ O BankOfCyber já foi invadido anteriormente!' },
          { type: 'out', text: `Seu saldo atual é R$ ${cyberBank.getBalance().toLocaleString('pt-BR')},00.` },
          { type: 'sys', text: 'Acesse o Navegador no site matrix://cybergame-store para gastar suas moedas!' },
        ]);
        return;
      }

      setIsExecuting(true);
      setLines([
        ...next,
        { type: 'sys', text: '⚡ ESTABELECENDO TÚNEL REVERSO E INJETANDO PAYLOAD SQL BYPASS...' },
      ]);

      await new Promise((r) => setTimeout(r, 700));
      setLines((prev) => [
        ...prev,
        { type: 'out', text: '[1/3] Conectando a 10.240.88.99:5432...' },
      ]);

      await new Promise((r) => setTimeout(r, 700));
      setLines((prev) => [
        ...prev,
        { type: 'out', text: "[2/3] Executando: ' UNION SELECT admin_token, balance FROM users WHERE '1'='1" },
      ]);

      await new Promise((r) => setTimeout(r, 800));
      cyberBank.setHacked(true);

      setLines((prev) => [
        ...prev,
        { type: 'sys', text: '✅ [INVADIDO COM SUCESSO!]: Acesso Admin concedido no BankOfCyber.' },
        { type: 'sys', text: '💰 +R$ 250.000,00 transferidos para a sua carteira digital RenanOS!' },
        { type: 'out', text: `Novo saldo total: R$ ${cyberBank.getBalance().toLocaleString('pt-BR')},00` },
        { type: 'sys', text: '🚀 DICA: Abra o Navegador e vá em matrix://cybergame-store para comprar itens VIP!' },
      ]);
      setIsExecuting(false);
      return;
    }

    if (cmd === 'saldo' || cmd === 'balance') {
      const bal = cyberBank.getBalance();
      const inv = cyberBank.getInventory();
      setLines([
        ...next,
        { type: 'out', text: `💳 Carteira RenanOS: R$ ${bal.toLocaleString('pt-BR')},00 Cyber Dollars` },
        { type: 'out', text: `📦 Itens comprados (${inv.length}): ${inv.length ? inv.join(', ') : 'Nenhum item ainda.'}` },
      ]);
      return;
    }

    if (cmd === 'loja') {
      const itemsText = SHOP_ITEMS.map(
        (it) => `  - [${it.id}] ${it.icon} ${it.name} — R$ ${it.price.toLocaleString('pt-BR')},00 (${it.category})`
      );
      setLines([
        ...next,
        { type: 'sys', text: '🛒 ITENS DISPONÍVEIS NA LOJA VIRTUAL CYBER:' },
        ...itemsText.map((t) => ({ type: 'out' as const, text: t })),
        { type: 'sys', text: 'Para comprar digite: comprar <id_do_item>' },
      ]);
      return;
    }

    if (cmd.startsWith('comprar ')) {
      const itemId = cmd.replace('comprar ', '').trim();
      const item = SHOP_ITEMS.find((i) => i.id === itemId);

      if (!item) {
        setLines([
          ...next,
          { type: 'out', text: `❌ Item "${itemId}" não encontrado. Digite "loja" para ver a lista.` },
        ]);
        return;
      }

      const res = cyberBank.buyItem(item.id, item.price);
      if (res.success) {
        setLines([
          ...next,
          { type: 'sys', text: `🎉 COMPRA REALIZADA COM SUCESSO!` },
          { type: 'sys', text: `Você adquiriu: ${item.icon} ${item.name} por R$ ${item.price.toLocaleString('pt-BR')},00.` },
          { type: 'out', text: `Saldo restante: R$ ${cyberBank.getBalance().toLocaleString('pt-BR')},00` },
        ]);
      } else {
        setLines([
          ...next,
          { type: 'out', text: `❌ FALHA NA COMPRA: ${res.message}` },
        ]);
      }
      return;
    }

    if (cmd === 'reset-banco') {
      cyberBank.resetSimulation();
      setLines([
        ...next,
        { type: 'sys', text: '🔄 Simulação reiniciada. O BankOfCyber está protegido novamente e seu saldo voltou a R$ 500,00.' },
      ]);
      return;
    }

    const out = COMMANDS[cmd];
    if (out) {
      setLines([...next, ...out.map((t) => ({ type: 'out' as const, text: t }))]);
    } else {
      setLines([
        ...next,
        { type: 'out', text: `comando não reconhecido: ${cmd}. Digite "ajuda" ou "cyber" para a lista.` },
      ]);
    }
  }

  const QUICK_COMMANDS = [
    { label: '⚡ HACK BANK', cmd: 'exploit bankofcyber' },
    { label: '🔍 SCAN', cmd: 'scan 10.240.88.99' },
    { label: '💳 SALDO', cmd: 'saldo' },
    { label: '🛒 LOJA', cmd: 'loja' },
    { label: '❓ AJUDA', cmd: 'ajuda' },
    { label: '👤 WHOAMI', cmd: 'whoami' },
    { label: '📂 PROJETOS', cmd: 'projetos' },
    { label: '🧹 LIMPAR', cmd: 'limpar' },
  ];

  return (
    <div
      className="min-h-full cursor-text bg-black/90 p-3 sm:p-4 font-mono text-xs sm:text-sm leading-relaxed flex flex-col justify-between overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      <div>
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.type === 'in'
                ? 'text-foreground'
                : l.type === 'sys'
                  ? 'text-amber-400 font-bold'
                  : 'text-foreground/80'
            }
          >
            {l.type === 'in' ? (
              <span>
                <span className="text-amber-400">renan@renan-os</span>
                <span className="text-muted-foreground">:~$ </span>
                {l.text}
              </span>
            ) : (
              <span className="whitespace-pre-wrap">{l.text}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {/* Mobile Quick Action Chips */}
        <div className="flex flex-wrap gap-1.5 pb-1 select-none">
          {QUICK_COMMANDS.map((qc) => (
            <button
              key={qc.cmd}
              onClick={(e) => {
                e.stopPropagation();
                run(qc.cmd);
              }}
              disabled={isExecuting}
              className="rounded-lg border border-amber-500/30 bg-[#121622] px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
            >
              {qc.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
            setInput('');
          }}
          className="flex items-center border-t border-amber-500/20 pt-2"
        >
          <span className="text-amber-400 font-bold">renan@renan-os</span>
          <span className="text-muted-foreground">:~$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isExecuting}
            className="flex-1 bg-transparent text-foreground caret-amber-400 outline-none font-mono disabled:opacity-50"
            autoFocus
            spellCheck={false}
            aria-label="Entrada do terminal"
          />
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
}
