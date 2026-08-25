const CATEGORIES = [
  {
    title: 'Desenvolvimento Front-end',
    skills: [
      'HTML5',
      'CSS3',
      'JavaScript (ES6+)',
      'React',
      'Next.js',
      'Tailwind CSS',
      'GSAP',
      'Framer Motion',
      'Three.js',
    ],
  },
  {
    title: 'Desenvolvimento Back-end',
    skills: [
      'Node.js',
      'Express',
      'Python',
      'FastAPI',
      'APIs REST',
      'Sistemas Web',
      'Integrações de APIs',
    ],
  },
  {
    title: 'Banco de Dados',
    skills: [
      'MySQL',
      'PostgreSQL',
      'Linguagem SQL',
      'Modelagem de Dados',
      'Administração de BD',
    ],
  },
  {
    title: 'Cybersecurity & Redes',
    skills: [
      'Fundamentos de Segurança',
      'Segurança Web',
      'OWASP Top 10',
      'Redes de Computadores',
      'Linux',
      'Análise de Vulnerabilidades',
      'Ethical Hacking',
      'Estudos de Pentest',
    ],
  },
  {
    title: 'Ferramentas & Workflow',
    skills: [
      'Git',
      'GitHub',
      'Docker',
      'VS Code',
      'Figma',
      'Vercel',
      'Firebase',
    ],
  },
];

export function ArsenalApp() {
  return (
    <div className="hud-grid min-h-full space-y-6 p-5 overflow-y-auto">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold">
        Conhecimentos Técnicos & Stack de Trabalho
      </p>

      {CATEGORIES.map((cat) => (
        <section key={cat.title} className="rounded-lg border border-border bg-card/60 p-4">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold">
            {cat.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cat.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-md border border-border/80 bg-secondary/60 px-3 py-1.5 font-mono text-xs text-foreground/90 transition-colors hover:border-amber-500/50 hover:text-amber-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
