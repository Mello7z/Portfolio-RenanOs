import { useState } from 'react';
import { ExternalLink, Code2, Target, CheckCircle2, Loader2 } from 'lucide-react';

interface Mission {
  code: string;
  title: string;
  status: 'concluída' | 'em andamento';
  tag: 'Acadêmico' | 'Design & Music' | 'SaaS & IA' | 'Cyber Security' | 'Full-Stack & Cyber';
  description: string;
  stack: string[];
  features?: string[];
  githubUrl?: string;
  demoUrl?: string;
}

const MISSIONS: Mission[] = [
  {
    code: 'PROJ-01',
    title: 'FantasyHub — Marketplace',
    status: 'concluída',
    tag: 'Acadêmico',
    description:
      'Marketplace de fantasias desenvolvido como projeto acadêmico. Uma plataforma criada para conectar clientes e produtos através de uma experiência digital moderna.',
    stack: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    features: ['Cadastro de usuários', 'Gerenciamento de produtos', 'Organização de informações', 'Interface responsiva'],
    githubUrl: 'https://github.com/Mello7z/-FantasyToca',
    demoUrl: 'https://fantasytoca.netlify.app/',
  },
  {
    code: 'PROJ-02',
    title: 'VT Music Experience',
    status: 'concluída',
    tag: 'Design & Music',
    description:
      'Experiência digital criada para apresentação de um artista musical. O projeto busca unir tecnologia, música e design através de uma interface visual cinematográfica.',
    stack: ['HTML', 'Tailwind CSS', 'JavaScript', 'Animações', 'Experiência Multimídia'],
    features: ['Interface cinematográfica', 'Animações fluidas', 'Player de áudio customizado', 'Design imersivo'],
    githubUrl: 'https://github.com/Mello7z',
    demoUrl: 'https://vt-music.netlify.app/',
  },
  {
    code: 'PROJ-03',
    title: 'PortDev — SaaS Portfólios',
    status: 'em andamento',
    tag: 'SaaS & IA',
    description:
      'Plataforma SaaS para criação de portfólios profissionais. Permite que desenvolvedores criem apresentações digitais modernas utilizando recursos de inteligência artificial.',
    stack: ['Next.js', 'React', 'FastAPI', 'PostgreSQL', 'Inteligência Artificial'],
    features: ['Geração assistida por IA', 'Templates customizáveis', 'Hospedagem rápida', 'Integração com GitHub'],
    githubUrl: 'https://github.com/Mello7z',
  },
  {
    code: 'PROJ-04',
    title: 'AutoJob AI — Documentos',
    status: 'em andamento',
    tag: 'SaaS & IA',
    description:
      'Ferramenta baseada em inteligência artificial para auxiliar candidatos na criação de documentos profissionais personalizados, facilitando o processo de candidatura.',
    stack: ['React', 'Next.js', 'Python', 'AI Prompts', 'Tailwind CSS'],
    features: ['Otimização de currículos', 'Geração de cartas de apresentação', 'Análise de vaga x perfil'],
    githubUrl: 'https://github.com/Mello7z',
  },
  {
    code: 'PROJ-05',
    title: 'RenanOS — Portfólio Interativo & Cyber OS',
    status: 'concluída',
    tag: 'Full-Stack & Cyber',
    description:
      'Sistema Operacional Web completo e interativo servindo como Portfólio Profissional, Central Tática Cyber Security, Simulador de Hacking e Gerenciador de Currículo/Dossiê em tempo real.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Cyber Security OS UI'],
    features: [
      'HUD Tático e Terminal Interativo',
      'Simulador de Hacking & Bank Scan',
      'Gerenciador de Currículo PDF e Dossiê',
      'Música, Jogos, Wallpapers e Apps Integrados',
    ],
    githubUrl: 'https://github.com/Mello7z',
  },
];

export function MissoesApp() {
  const [active, setActive] = useState(0);
  const m = MISSIONS[active];

  return (
    <div className="grid min-h-full grid-cols-1 sm:grid-cols-[230px_1fr]">
      {/* Sidebar list */}
      <div className="border-b border-border bg-secondary/30 p-2 sm:border-r sm:border-b-0 overflow-y-auto">
        <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
          Projetos Ativos
        </p>
        <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
          {MISSIONS.map((mission, i) => (
            <button
              key={mission.code}
              onClick={() => setActive(i)}
              className={`flex min-w-[200px] items-center gap-2.5 rounded-md border px-2.5 py-2 text-left transition-colors sm:min-w-0 cursor-pointer ${
                i === active
                  ? 'border-amber-500/60 bg-amber-500/10 text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {mission.status === 'concluída' ? (
                <CheckCircle2 className="size-4 shrink-0 text-amber-400" />
              ) : (
                <Loader2 className="size-4 shrink-0 animate-spin text-amber-300" />
              )}
              <span className="min-w-0">
                <span className="block font-mono text-[10px] text-muted-foreground">
                  {mission.code}
                </span>
                <span className="block truncate font-mono text-xs font-medium">
                  {mission.title}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mission details */}
      <div className="hud-grid p-5 overflow-y-auto flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground font-bold">{m.code}</span>
            <span className="rounded border border-amber-500/50 bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-amber-400 font-semibold">
              {m.tag}
            </span>
            <span className="rounded border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-foreground/80">
              {m.status}
            </span>
          </div>

          <h3 className="mt-3 flex items-center gap-2 font-mono text-xl font-bold text-foreground">
            <Target className="size-5 text-amber-400" />
            {m.title}
          </h3>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-foreground/85 font-sans">
            {m.description}
          </p>

          {m.features && (
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                Funcionalidades Chave
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-sans text-xs text-foreground/85 list-disc list-inside">
                {m.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
              Tecnologias Utilizadas
            </p>
            <div className="flex flex-wrap gap-2">
              {m.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border bg-card/80 px-2.5 py-1 font-mono text-[11px] text-amber-300 shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap gap-3">
          {m.demoUrl && (
            <a
              href={m.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3.5 py-2 font-mono text-xs font-bold text-black transition-opacity hover:opacity-90 cursor-pointer shadow-md"
            >
              <ExternalLink className="size-3.5" /> Acessar Site (Live Demo)
            </a>
          )}
          {m.githubUrl && (
            <a
              href={m.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 font-mono text-xs font-bold transition-colors cursor-pointer ${
                m.demoUrl
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-amber-500 text-black hover:opacity-90'
              }`}
            >
              <Code2 className="size-3.5" /> Ver no GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
