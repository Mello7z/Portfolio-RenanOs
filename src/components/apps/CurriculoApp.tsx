import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  FileText,
  Download,
  Eye,
  Lock,
  Unlock,
  ShieldCheck,
  FileUp,
  KeyRound,
  ExternalLink,
  AlertTriangle,
  UserCheck,
  Mail,
  MapPin,
  Check,
  Code2,
  Building2,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
  Printer,
  Copy,
  Share2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ADMIN_PIN = '0987654123';

export const DEFAULT_CV_DATA = {
  nome: 'Renan Mello',
  titulo: 'Desenvolvedor Full-Stack & Especialista Cyber Security',
  email: 'renan.rochaa0@gmail.com',
  localizacao: 'Brasil (Disponível para Remoto & Presencial)',
  perfil: 'Desenvolvedor Full-Stack apaixonado por criar aplicações completas, ágeis e altamente seguras. Atuo com excelência desde a arquitetura de banco de dados, APIs REST e microsserviços até interfaces modernas, responsivas e intuitivas com React e TypeScript. Obsessão por performance, acessibilidade e blindagem de sistemas.',
  habilidades: [
    { categoria: 'Linguagens', itens: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3'] },
    { categoria: 'Frontend', itens: ['React', 'Vite', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'UI/UX Design'] },
    { categoria: 'Backend & DB', itens: ['Node.js', 'Express', 'PostgreSQL', 'MySQL', 'REST APIs', 'GraphQL'] },
    { categoria: 'Segurança & DevOps', itens: ['Hardening de Servidores', 'OWASP Top 10', 'Penetration Testing', 'Git', 'Docker', 'CI/CD'] },
  ],
  experiencias: [
    {
      cargo: 'Desenvolvedor Full-Stack & Segurança Cibernética',
      empresa: 'Projetos Independentes & Consultoria',
      periodo: '3+ Anos em Campo',
      descricao: 'Desenvolvimento de sistemas web completos, dashboards táticos de alta performance e APIs REST. Implementação de testes de invasão (pentest), auditorias de código e hardening de servidores.'
    },
    {
      cargo: 'Auxiliar de Escritório & Suporte Técnico',
      empresa: 'FAPESP',
      periodo: 'Atuação Profissional',
      descricao: 'Gestão e consulta em bancos de dados internos e sistemas corporativos. Suporte na otimização de rotinas digitais e garantia da integridade de informações empresariais.'
    }
  ],
  formacao: [
    {
      curso: 'Bacharelado em Sistemas de Informação',
      instituicao: 'Em Formação Acadêmica (Ensino Superior)',
      detalhes: 'Foco em Engenharia de Software, Segurança da Informação, Banco de Dados e Arquitetura Web.'
    },
    {
      curso: 'Programação Web com Ênfase em Design Gráfico',
      instituicao: 'Formação Técnica & Design UI/UX',
      detalhes: 'Desenvolvimento de aplicações e páginas web responsivas unindo princípios de UI/UX, prototipagem, criação gráfica visual, tipografia e código limpo.'
    },
    {
      curso: 'Assistente Administrativo',
      instituicao: 'Formação Profissionalizante',
      detalhes: 'Capacitação em Gestão Empresarial, fluxo de documentos, organização de processos digitais e suporte operacional em rotinas corporativas de escritório.'
    },
    {
      curso: 'Assistente de Logística com Ênfase em Qualidade e Produção',
      instituicao: 'Formação Técnica & Operacional',
      detalhes: 'Capacitação em Gestão de Processos Produtivos, controle rigoroso de estoque e inventários, auditoria dos padrões de qualidade no fluxo logístico, recebimento e expedição.'
    },
    {
      curso: 'Assistente de Recursos Humanos',
      instituicao: 'Formação Profissionalizante',
      detalhes: 'Capacitação em Gestão de Pessoas, rotinas de Departamento Pessoal, triagem e seleção de talentos, onboarding de colaboradores, controle de ponto e benefícios.'
    }
  ],
  certificacoes: [
    { nome: 'Python para Programação & Automação', emissor: 'Especialização Técnica', area: 'Lógica, Algoritmos & Scripting Avançado' },
    { nome: 'Administração & Modelagem de Banco de Dados', emissor: 'Gestão de Dados', area: 'SQL, PostgreSQL, MySQL & Otimização de Consultas' },
    { nome: 'Soluções & Engenharia de Inteligência Artificial', emissor: 'IA & Inovação', area: 'Engenharia de Prompts, LLMs & Integrações' },
    { nome: 'Segurança Cibernética & Testes de Invasão', emissor: 'Cyber Security', area: 'OWASP Top 10, Penetration Testing & Hardening' },
    { nome: 'Desenvolvimento Web Full-Stack Moderno', emissor: 'Engenharia Web', area: 'React, TypeScript, Node.js & REST APIs' },
    { nome: 'Redes de Computadores & Segurança de Infraestrutura', emissor: 'Infraestrutura IT', area: 'Arquitetura TCP/IP, Firewalls & VPNs' },
    { nome: 'Git & Controle de Versão Corporativo', emissor: 'DevOps & Engenharia', area: 'Workflows CI/CD, GitHub & Gestão de Código' },
    { nome: 'Gestão de Processos & Sistemas Digitais', emissor: 'Sistemas Corporativos', area: 'Integridade de Dados & Rotinas Empresariais' }
  ]
};

export const DEFAULT_CV_DATA_EN = {
  nome: 'Renan Mello',
  titulo: 'Full-Stack Developer & Cybersecurity Specialist',
  email: 'renan.rochaa0@gmail.com',
  localizacao: 'Brazil (Available for Remote & On-Site)',
  perfil: 'Full-Stack Developer passionate about building complete, fast, and highly secure applications. Expertise ranging from database architecture, REST APIs, and microservices to modern, responsive, and intuitive user interfaces built with React and TypeScript. Obsessed with performance, accessibility, and system hardening.',
  habilidades: [
    { categoria: 'Languages', itens: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3'] },
    { categoria: 'Frontend', itens: ['React', 'Vite', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'UI/UX Design'] },
    { categoria: 'Backend & DB', itens: ['Node.js', 'Express', 'PostgreSQL', 'MySQL', 'REST APIs', 'GraphQL'] },
    { categoria: 'Security & DevOps', itens: ['Server Hardening', 'OWASP Top 10', 'Penetration Testing', 'Git', 'Docker', 'CI/CD'] },
  ],
  experiencias: [
    {
      cargo: 'Full-Stack Developer & Cybersecurity Specialist',
      empresa: 'Independent Projects & Consulting',
      periodo: '3+ Years Field Experience',
      descricao: 'Development of complete web systems, high-performance tactical dashboards, and REST APIs. Execution of penetration testing, code audits, and server hardening.'
    },
    {
      cargo: 'Office Assistant & IT Support',
      empresa: 'FAPESP',
      periodo: 'Professional Experience',
      descricao: 'Data management and querying in internal databases and enterprise systems. Support in optimizing digital routines and ensuring enterprise data integrity.'
    }
  ],
  formacao: [
    {
      curso: 'Bachelor of Information Systems',
      instituicao: 'Higher Education (In Progress)',
      detalhes: 'Focus on Software Engineering, Information Security, Databases, and Web Architecture.'
    },
    {
      curso: 'Web Development & UI/UX Graphic Design',
      instituicao: 'Technical & Design Training',
      detalhes: 'Development of responsive web applications combining UI/UX principles, prototyping, visual art, typography, and clean code.'
    },
    {
      curso: 'Administrative Assistant',
      instituicao: 'Professional Training',
      detalhes: 'Training in Business Management, document flow, digital process organization, and operational support in corporate office routines.'
    },
    {
      curso: 'Logistics Assistant with Quality & Production Focus',
      instituicao: 'Technical & Operational Training',
      detalhes: 'Training in Production Process Management, strict inventory control, quality standards auditing in logistical flow, receiving, and dispatch.'
    },
    {
      curso: 'Human Resources Assistant',
      instituicao: 'Professional Training',
      detalhes: 'Training in People Management, Personnel Department routines, talent screening and selection, employee onboarding, time control, and benefits.'
    }
  ],
  certificacoes: [
    { nome: 'Python for Programming & Automation', emissor: 'Technical Specialization', area: 'Logic, Algorithms & Advanced Scripting' },
    { nome: 'Database Administration & Modeling', emissor: 'Data Management', area: 'SQL, PostgreSQL, MySQL & Query Optimization' },
    { nome: 'Artificial Intelligence Engineering & Solutions', emissor: 'AI & Innovation', area: 'Prompt Engineering, LLMs & Integrations' },
    { nome: 'Cybersecurity & Penetration Testing', emissor: 'Cyber Security', area: 'OWASP Top 10, Penetration Testing & Hardening' },
    { nome: 'Modern Full-Stack Web Development', emissor: 'Web Engineering', area: 'React, TypeScript, Node.js & REST APIs' },
    { nome: 'Computer Networks & Infrastructure Security', emissor: 'IT Infrastructure', area: 'TCP/IP Architecture, Firewalls & VPNs' },
    { nome: 'Git & Corporate Version Control', emissor: 'DevOps & Engineering', area: 'CI/CD Workflows, GitHub & Code Management' },
    { nome: 'Process Management & Digital Systems', emissor: 'Enterprise Systems', area: 'Data Integrity & Business Operations' }
  ]
};

export const DEFAULT_CV_TXT = `==================================================
CURRÍCULO PROFISSIONAL — RENAN MELLO
==================================================
DESENVOLVEDOR FULL-STACK & ESPECIALISTA CYBER SECURITY

[ DADOS DE CONTATO ]
• Nome: Renan Mello
• Email: renan.rochaa0@gmail.com
• Localização: Brasil (Disponível para Remoto & Presencial)
• Perfil: Full-Stack & Segurança Cibernética

[ SOBRE MIM ]
Desenvolvedor Full-Stack apaixonado por criar aplicações completas, ágeis e highly seguras. Atuo com excelência desde a arquitetura de banco de dados, APIs REST e microsserviços até interfaces modernas, responsivas e intuitivas com React e TypeScript. Obsessão por performance, acessibilidade e blindagem de sistemas.

[ HABILIDADES TÉCNICAS ]
• Linguagens: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3/Tailwind
• Frontend: React, Vite, Next.js, State Management, UI/UX Design, Framer Motion
• Backend & Databases: Node.js, Express, PostgreSQL, MySQL, REST APIs, GraphQL
• Segurança & DevOps: Hardening de Servidores, OWASP Top 10, Git, Docker, CI/CD

[ TRAJETÓRIA PROFISSIONAL & EXPERIÊNCIA ]
• Desenvolvedor Full-Stack & Segurança Cibernética (3+ Anos em Campo)
  - Desenvolvimento de sistemas web completos, dashboards táticos de alta performance e APIs REST.
  - Implementação de testes de invasão (pentest), auditorias de código e hardening de servidores.

• Auxiliar de Escritório & Suporte Técnico — FAPESP
  - Gestão e consulta em bancos de dados internos e sistemas corporativos.
  - Suporte na otimização de rotinas digitais e integridade de informações empresariais.

[ FORMAÇÃO ACADÊMICA & TÉCNICA ]
• Bacharelado em Sistemas de Informação (Em Formação - Ensino Superior)
  - Foco em Engenharia de Software, Segurança da Informação e Arquitetura Web.

• Programação Web com Ênfase em Design Gráfico
  - Desenvolvimento web com foco em criação visual, UI/UX, prototipagem gráfica e páginas responsivas.

• Assistente Administrativo
  - Capacitação em Gestão Empresarial, fluxo de documentos digitais e rotinas corporativas de escritório.

• Assistente de Logística com Ênfase em Qualidade e Produção
  - Acompanhamento de processos produtivos, controle de estoque e auditoria dos padrões de qualidade logísticos.

• Assistente de Recursos Humanos
  - Capacitação em Gestão de Pessoas, rotinas de Departamento Pessoal, triagem de currículos e onboarding.

[ CERTIFICAÇÕES & DIPLOMAS ]
• Python para Programação & Automação — Lógica, Algoritmos & Scripting Avançado
• Administração & Modelagem de Banco de Dados — SQL, PostgreSQL, MySQL & Otimização
• Soluções & Engenharia de Inteligência Artificial — Engenharia de Prompts & Modelos LLM
• Segurança Cibernética & Testes de Invasão — OWASP Top 10, Penetration Testing & Hardening
• Desenvolvimento Web Full-Stack Moderno — React, TypeScript, Node.js & REST APIs
• Redes de Computadores & Segurança de Infraestrutura — Arquitetura TCP/IP, Firewalls & VPNs
• Git & Controle de Versão Corporativo — Workflows CI/CD & Gestão de Código
• Gestão de Processos & Sistemas Digitais — Integridade de Dados & Rotinas Empresariais
==================================================`;

export function CurriculoApp() {
  const { language } = useLanguage();
  const cvData = language === 'en' ? DEFAULT_CV_DATA_EN : DEFAULT_CV_DATA;
  const [activeTab, setActiveTab] = useState<'visual' | 'pdf' | 'admin'>('visual');
  const [copied, setCopied] = useState(false);

  // CV PDF State (Data URL)
  const [cvPdf, setCvPdf] = useState<string | null>(() => {
    return localStorage.getItem('renanos_cv_pdf') || null;
  });

  const [cvText, setCvText] = useState<string>(() => {
    return localStorage.getItem('renanos_cv_txt') || DEFAULT_CV_TXT;
  });

  // Admin Security Lock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [pdfFileName, setPdfFileName] = useState<string>(() => {
    return localStorage.getItem('renanos_cv_pdf_name') || 'Curriculo_Renan_Mello.pdf';
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('renanos_cv_txt', cvText);
  }, [cvText]);

  useEffect(() => {
    if (cvPdf) {
      localStorage.setItem('renanos_cv_pdf', cvPdf);
      localStorage.setItem('renanos_cv_pdf_name', pdfFileName);
    }
  }, [cvPdf, pdfFileName]);

  // Authenticate Admin
  function handleAuthenticate(e: FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PIN) {
      setIsUnlocked(true);
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError('Senha incorreta! Acesso negado pela segurança do sistema.');
      setPasswordInput('');
    }
  }

  // Handle PDF Upload
  function handlePdfUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione um arquivo em formato PDF (.pdf).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCvPdf(result);
        setPdfFileName(file.name);
        setUploadSuccess(true);
        setActiveTab('pdf');
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    };
    reader.readAsDataURL(file);
  }

  // Download PDF CV
  function handleDownloadPdf() {
    if (cvPdf) {
      const a = document.createElement('a');
      a.href = cvPdf;
      a.download = pdfFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      handlePrintTxtAsPdf();
    }
  }

  // Download TXT CV
  function handleDownloadTxt() {
    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Curriculo_Renan_Mello.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Fallback PDF print window for formatted version
  function handlePrintTxtAsPdf() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <title>Currículo - Renan Mello</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; max-width: 850px; margin: 0 auto; background: #fff; }
            .header { border-bottom: 2px solid #d97706; padding-bottom: 16px; margin-bottom: 24px; }
            h1 { color: #0f172a; margin: 0; font-size: 32px; letter-spacing: -0.5px; }
            .subtitle { color: #d97706; font-size: 16px; font-weight: bold; margin-top: 4px; }
            .contact { margin-top: 10px; font-size: 13px; color: #475569; display: flex; gap: 20px; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 16px; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
            p { margin: 0 0 10px 0; font-size: 14px; }
            ul { margin: 0; padding-left: 20px; font-size: 13.5px; }
            li { margin-bottom: 6px; }
            .item-title { font-weight: bold; color: #0f172a; font-size: 14.5px; }
            .item-sub { color: #d97706; font-weight: 600; font-size: 13px; }
            .btn-print { margin-bottom: 24px; padding: 12px 24px; background: #d97706; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            @media print { .btn-print { display: none; } }
          </style>
        </head>
        <body>
          <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Salvar como PDF</button>
          
          <div class="header">
            <h1>RENAN MELLO</h1>
            <div class="subtitle">Desenvolvedor Full-Stack & Especialista Cyber Security</div>
            <div class="contact">
              <span>📧 renan.rochaa0@gmail.com</span>
              <span>📍 Brasil (Remoto & Presencial)</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Resumo Profissional</div>
            <p>${cvData.perfil}</p>
          </div>

          <div class="section">
            <div class="section-title">Habilidades Técnicas</div>
            <ul>
              ${cvData.habilidades.map(h => `<li><strong>${h.categoria}:</strong> ${h.itens.join(', ')}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Experiência Profissional</div>
            ${cvData.experiencias.map(e => `
              <div style="margin-bottom: 14px;">
                <div class="item-title">${e.cargo} — <span style="color:#475569;">${e.empresa}</span></div>
                <div class="item-sub">${e.periodo}</div>
                <p style="margin-top:4px; font-size:13px; color:#334155;">${e.descricao}</p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="section-title">Formação Acadêmica</div>
            ${cvData.formacao.map(f => `
              <div>
                <div class="item-title">${f.curso}</div>
                <div class="item-sub">${f.instituicao}</div>
                <p style="margin-top:4px; font-size:13px; color:#334155;">${f.detalhes}</p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="section-title">Certificações & Diplomas</div>
            <ul>
              ${cvData.certificacoes.map(c => `<li><strong>${c.nome}:</strong> ${c.area} ${c.emissor ? `(${c.emissor})` : ''}</li>`).join('')}
            </ul>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  // Reset PDF
  function handleRemovePdf() {
    if (confirm('Deseja remover o PDF atual e restaurar a visualização interativa do currículo?')) {
      setCvPdf(null);
      localStorage.removeItem('renanos_cv_pdf');
      localStorage.removeItem('renanos_cv_pdf_name');
      setActiveTab('visual');
    }
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText(DEFAULT_CV_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="hud-grid min-h-full bg-[#0a0c10] p-4 sm:p-6 overflow-y-auto font-sans flex flex-col justify-between text-foreground">
      <div className="space-y-5">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-[#10131d] p-3 shadow-lg backdrop-blur-xl">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold transition-all cursor-pointer ${
                activeTab === 'visual'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'bg-[#161a26] text-zinc-400 border border-white/5 hover:text-white'
              }`}
            >
              <Eye className="size-3.5 text-amber-400" /> Curriculum Interativo
            </button>

            {cvPdf && (
              <button
                onClick={() => setActiveTab('pdf')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold transition-all cursor-pointer ${
                  activeTab === 'pdf'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-[#161a26] text-zinc-400 border border-white/5 hover:text-white'
                }`}
              >
                <FileText className="size-3.5 text-amber-400" /> Documento PDF Enviado
              </button>
            )}

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-sm'
                  : 'bg-[#161a26] text-zinc-400 border border-white/5 hover:text-white'
              }`}
            >
              {isUnlocked ? <Unlock className="size-3.5 text-emerald-400" /> : <Lock className="size-3.5 text-red-400" />}
              Gerenciar PDF
            </button>
          </div>

          {/* Download & Print Actions */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2 font-bold text-emerald-300 hover:bg-emerald-500/25 active:scale-95 transition-all cursor-pointer shadow-sm"
              title="Baixar em formato PDF"
            >
              <Download className="size-3.5" /> Baixar PDF
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-bold text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer"
              title="Baixar versão texto simples"
            >
              <FileText className="size-3.5" /> .TXT
            </button>
          </div>
        </div>

        {/* Tab 1: Visual Interactive Curriculum (Always Available) */}
        {activeTab === 'visual' && (
          <div className="rounded-2xl border border-amber-500/30 bg-[#0f121a] p-5 sm:p-8 shadow-2xl space-y-7">
            {/* Header Identity & Contact */}
            <div className="border-b border-amber-500/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
              <div className="flex items-start gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-500/60 bg-[#121622] shadow-xl">
                  <img
                    src="/galeria/WhatsApp Image 2026-07-31 at 10.00.51.jpeg"
                    alt="Renan Mello"
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.src.includes('/galeria/WhatsApp Image 2026-07-31 at 10.00.52.jpeg')) {
                        img.src = '/galeria/WhatsApp Image 2026-07-31 at 10.00.52.jpeg';
                      } else {
                        img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      <UserCheck className="size-3" /> Currículo Verificado
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300 font-bold">
                      <ShieldCheck className="size-3" /> Verificado
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                    {cvData.nome}
                  </h1>

                  <p className="text-amber-400 font-mono text-xs sm:text-sm font-bold">
                    {cvData.titulo}
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div className="w-full md:w-auto font-mono text-xs text-zinc-300 bg-[#151926] p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-bold text-white">
                    <Mail className="size-4 text-amber-400" /> {cvData.email}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 hover:bg-amber-500/30 cursor-pointer"
                  >
                    {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="size-4 text-amber-400" /> {cvData.localizacao}
                </div>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
                <Sparkles className="size-4" /> Resumo Profissional & Sobre Mim
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300 bg-[#121520] p-4 rounded-xl border border-white/5">
                {cvData.perfil}
              </p>
            </div>

            {/* Technical Skills Grid */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
                <Code2 className="size-4" /> Competências & Habilidades Técnicas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cvData.habilidades.map((sk) => (
                  <div key={sk.categoria} className="rounded-xl border border-white/10 bg-[#121520] p-3.5 space-y-2">
                    <span className="font-mono text-xs font-bold text-amber-300 block border-b border-white/5 pb-1">
                      {sk.categoria}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sk.itens.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] text-zinc-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience & Career */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
                <Briefcase className="size-4" /> Trajetória Profissional & Experiência
              </h3>
              <div className="space-y-3">
                {cvData.experiencias.map((exp) => (
                  <div key={exp.cargo} className="rounded-xl border border-white/10 bg-[#121520] p-4 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {exp.cargo} <span className="text-amber-400 font-normal">@ {exp.empresa}</span>
                      </span>
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                        {exp.periodo}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                      {exp.descricao}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Education */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
                  <GraduationCap className="size-4" /> Formação Acadêmica
                </h3>
                {cvData.formacao.map((f) => (
                  <div key={f.curso} className="rounded-xl border border-white/10 bg-[#121520] p-4 space-y-1">
                    <span className="font-mono text-xs font-bold text-white block">
                      {f.curso}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400/90 font-semibold block">
                      {f.instituicao}
                    </span>
                    <p className="text-xs text-zinc-400 pt-1">
                      {f.detalhes}
                    </p>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
                  <Award className="size-4" /> Certificações & Diplomas
                </h3>
                <div className="space-y-2.5">
                  {cvData.certificacoes.map((c) => (
                    <div key={c.nome} className="rounded-xl border border-white/10 bg-[#121520] p-3.5 flex items-start justify-between gap-3 hover:border-amber-500/30 transition-all">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-300">
                            {c.nome}
                          </span>
                          {c.emissor && (
                            <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-400 uppercase">
                              {c.emissor}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400">
                          {c.area}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg text-emerald-300 font-mono text-[10px] font-bold">
                        <ShieldCheck className="size-3.5 text-emerald-400" /> Verificado
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Quick Download Banner */}
            <div className="rounded-xl border border-amber-500/30 bg-[#141824] p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="size-5 text-amber-400" />
                <div>
                  <span className="font-bold text-white block">Precisa do Currículo em arquivo?</span>
                  <span className="text-[11px] text-zinc-400">Faça o download imediato em PDF formatado ou TXT simples.</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 font-bold text-black hover:bg-amber-400 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <Download className="size-4 stroke-[2.5]" /> Baixar Currículo PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Embedded PDF Viewer (When PDF is Uploaded) */}
        {activeTab === 'pdf' && cvPdf && (
          <div className="rounded-2xl border border-amber-500/30 bg-[#0f121a] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400 bg-[#141824] px-4 py-3 rounded-xl border border-white/10">
              <span className="text-amber-300 font-bold flex items-center gap-2">
                <FileText className="size-4" /> Exibindo PDF Oficial: {pdfFileName}
              </span>
              <a
                href={cvPdf}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-amber-400 hover:underline font-bold"
              >
                Abrir em Nova Aba <ExternalLink className="size-3" />
              </a>
            </div>

            {/* PDF Embedded Object Frame */}
            <div className="w-full h-[580px] rounded-xl border border-amber-500/30 overflow-hidden bg-[#080a0f] shadow-inner">
              <object
                data={cvPdf}
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="p-8 text-center space-y-4 font-mono text-xs text-zinc-300">
                  <p>Visualizador de PDF pronto!</p>
                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-black hover:bg-amber-400 cursor-pointer"
                  >
                    <Download className="size-4" /> Clique para Baixar PDF ({pdfFileName})
                  </button>
                </div>
              </object>
            </div>
          </div>
        )}

        {/* Tab 3: Admin Security Lock & PDF Upload Panel */}
        {activeTab === 'admin' && (
          <div className="rounded-2xl border border-red-500/30 bg-[#0f121a] p-5 sm:p-8 shadow-2xl space-y-6 max-w-2xl mx-auto">
            {!isUnlocked ? (
              /* Password Security Lock Screen */
              <div className="space-y-5 text-center py-4">
                <div className="mx-auto grid size-16 place-items-center rounded-3xl border border-red-500/40 bg-red-500/10 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <Lock className="size-8 animate-pulse" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                    Painel do Administrador
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    Digite a senha de segurança para enviar ou substituir o arquivo PDF do seu Currículo.
                  </p>
                </div>

                <form onSubmit={handleAuthenticate} className="space-y-4 max-w-sm mx-auto">
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 size-4 text-amber-400" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Senha de Acesso..."
                      className="w-full rounded-2xl border border-amber-500/40 bg-[#080a0f] py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-zinc-600 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      autoFocus
                    />
                  </div>

                  {passwordError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono bg-red-500/10 p-2.5 rounded-xl border border-red-500/30">
                      <AlertTriangle className="size-4 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-mono text-xs font-extrabold text-black hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all shadow-lg cursor-pointer"
                  >
                    🔒 Autenticar & Desbloquear
                  </button>
                </form>

                <div className="pt-2 text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="size-3 text-emerald-400" /> RenanOS Security Engine
                </div>
              </div>
            ) : (
              /* Unlocked PDF Manager & File Upload Panel */
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="grid size-9 place-items-center rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
                      <Unlock className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white font-mono">
                        Acesso Liberado — Enviar Currículo PDF
                      </h3>
                      <p className="text-[11px] text-emerald-400 font-mono">
                        Autenticado com Sucesso • Selecione seu arquivo .PDF
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsUnlocked(false)}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-mono font-bold text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                  >
                    Bloquear Painel
                  </button>
                </div>

                {uploadSuccess && (
                  <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-3.5 font-mono text-xs font-bold text-emerald-300 animate-bounce">
                    <Check className="size-4" /> Currículo PDF enviado e atualizado com sucesso!
                  </div>
                )}

                {/* PDF File Drag and Drop / Input Upload */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-amber-300 font-mono block">
                    Enviar Novo Arquivo PDF do seu Currículo:
                  </label>

                  <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-amber-500/40 bg-[#080a0f] p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-500/5 transition-all group">
                    <div className="grid size-12 place-items-center rounded-2xl border border-amber-500/50 bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                      <FileUp className="size-6" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-white">
                        Clique aqui para selecionar seu arquivo .PDF
                      </p>
                      <p className="font-mono text-[10px] text-zinc-400 mt-1">
                        Formato aceito: .pdf (Seu currículo em PDF)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Current PDF Status & Reset */}
                {cvPdf && (
                  <div className="rounded-2xl border border-white/10 bg-[#121622] p-4 font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                        <FileText className="size-4 text-amber-400" /> PDF Salvo: {pdfFileName}
                      </span>
                      <button
                        onClick={handleRemovePdf}
                        className="text-red-400 hover:text-red-300 font-bold underline cursor-pointer text-[11px]"
                      >
                        Remover PDF
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-400">
                      Seu arquivo PDF está pronto e disponível para download e visualização por recrutadores e visitantes do site.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/10 font-mono text-[11px] text-zinc-500 flex justify-between items-center">
        <span>RenanOS Curriculum Module</span>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <ShieldCheck className="size-3" /> Protegido & Verificado
        </span>
      </div>
    </div>
  );
}
