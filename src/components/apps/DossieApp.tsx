import { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  Zap,
  Building2,
  Award,
  Code2,
  FileText,
  Download,
  Check,
  Copy,
  Mail,
  UserCheck,
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DEFAULT_CV_DATA, DEFAULT_CV_DATA_EN } from './CurriculoApp';
import { useLanguage } from '../../context/LanguageContext';

export function DossieApp({ onOpenApp }: { onOpenApp?: (appId: string) => void }) {
  const { language } = useLanguage();
  const cvData = language === 'en' ? DEFAULT_CV_DATA_EN : DEFAULT_CV_DATA;
  const [copied, setCopied] = useState(false);

  const stats = [
    { value: '3+', label: language === 'en' ? 'Years Field Exp.' : 'Anos em Campo' },
    { value: '10+', label: language === 'en' ? 'Missions Done' : 'Missões Concluídas' },
    { value: '18+', label: language === 'en' ? 'Secured Systems' : 'Sistemas Blindados' },
    { value: '∞', label: language === 'en' ? 'Coffee / Day' : 'Cafés / Dia' },
  ];

  function handleDownloadPdf() {
    const pdfData = localStorage.getItem('renanos_cv_pdf');
    const pdfName = localStorage.getItem('renanos_cv_pdf_name') || 'Curriculo_Renan_Mello.pdf';

    if (pdfData) {
      const a = document.createElement('a');
      a.href = pdfData;
      a.download = pdfName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      handlePrintFormattedCv();
    }
  }

  function handleDownloadTxt() {
    const txt = localStorage.getItem('renanos_cv_txt') || `==================================================
CURRÍCULO PROFISSIONAL — RENAN MELLO
==================================================
DESENVOLVEDOR FULL-STACK & ESPECIALISTA CYBER SECURITY

[ DADOS DE CONTATO ]
• Nome: Renan Mello
• Email: renan.rochaa0@gmail.com
• Localização: Brasil (Disponível para Remoto & Presencial)
• Perfil: Full-Stack & Segurança Cibernética

[ SOBRE MIM ]
${DEFAULT_CV_DATA.perfil}

[ HABILIDADES TÉCNICAS ]
${DEFAULT_CV_DATA.habilidades.map(h => `• ${h.categoria}: ${h.itens.join(', ')}`).join('\n')}

[ TRAJETÓRIA PROFISSIONAL & EXPERIÊNCIA ]
${DEFAULT_CV_DATA.experiencias.map(e => `• ${e.cargo} (${e.empresa}) — ${e.periodo}\n  ${e.descricao}`).join('\n\n')}

[ FORMAÇÃO ACADÊMICA ]
${DEFAULT_CV_DATA.formacao.map(f => `• ${f.curso} — ${f.instituicao}\n  ${f.detalhes}`).join('\n\n')}

[ CERTIFICAÇÕES ]
${DEFAULT_CV_DATA.certificacoes.map(c => `• ${c.nome}: ${c.area}`).join('\n')}`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Curriculo_Renan_Mello.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handlePrintFormattedCv() {
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
            .btn-print { margin-bottom: 24px; padding: 12px 24px; background: #d97706; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; }
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
            <p>${DEFAULT_CV_DATA.perfil}</p>
          </div>

          <div class="section">
            <div class="section-title">Habilidades Técnicas</div>
            <ul>
              ${DEFAULT_CV_DATA.habilidades.map(h => `<li><strong>${h.categoria}:</strong> ${h.itens.join(', ')}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Experiência Profissional</div>
            ${DEFAULT_CV_DATA.experiencias.map(e => `
              <div style="margin-bottom: 14px;">
                <div class="item-title">${e.cargo} — <span style="color:#475569;">${e.empresa}</span></div>
                <div class="item-sub">${e.periodo}</div>
                <p style="margin-top:4px; font-size:13px; color:#334155;">${e.descricao}</p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="section-title">Formação Acadêmica</div>
            ${DEFAULT_CV_DATA.formacao.map(f => `
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
              ${DEFAULT_CV_DATA.certificacoes.map(c => `<li><strong>${c.nome}:</strong> ${c.area} ${c.emissor ? `(${c.emissor})` : ''}</li>`).join('')}
            </ul>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText(DEFAULT_CV_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="hud-grid min-h-full bg-[#0a0c10] p-4 sm:p-6 overflow-y-auto space-y-6 text-foreground font-sans">
      {/* Header Profile Section */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-5 shadow-xl">
        <div className="flex flex-col gap-5 sm:flex-row items-center sm:items-start">
          {/* Avatar frame */}
          <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-500/60 bg-[#0d0f14] shadow-xl flex items-center justify-center">
            <img
              src="/renan.png"
              alt="Renan Mello"
              className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.src.includes('/renan.png') && !img.src.includes('/wallpapers/renan.png')) {
                  img.src = '/wallpapers/renan.png';
                } else if (img.src.includes('/wallpapers/renan.png')) {
                  img.src = '/avatar.png';
                }
              }}
            />
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">
              Identidade Confidencial
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              RENAN MELLO
            </h2>

            <p className="font-mono text-xs text-amber-300/80 font-semibold tracking-wide">
              Codinome: <span className="text-white">// NIGHTBUILD</span>
            </p>

            <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2 font-mono text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-[#161a24] px-3 py-1 text-foreground/90 font-medium">
                <Code2 className="size-3.5 text-amber-400" /> Full-Stack
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-[#161a24] px-3 py-1 text-foreground/90 font-medium">
                <ShieldCheck className="size-3.5 text-amber-400" /> Cyber Security
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-[#161a24] px-3 py-1 text-foreground/90 font-medium">
                <MapPin className="size-3.5 text-amber-400" /> Brasil · Remoto
              </span>
            </div>
          </div>
        </div>

        {/* Bio summary */}
        <p className="mt-5 text-xs sm:text-sm leading-relaxed text-zinc-300 border-t border-border/40 pt-4 font-sans">
          De dia, construo aplicações web robustas de ponta a ponta. De noite, caço vulnerabilidades e blindo sistemas contra ameaças. Atuo em toda a stack — do pixel ao pipeline — com obsessão por performance, segurança e código limpo.
        </p>

        {/* Stats grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border/40 pt-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border/60 bg-[#0d0f14] p-3 text-center"
            >
              <p className="font-mono text-xl font-bold text-amber-400">{s.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Directive Principal */}
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3">
          <Zap className="size-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="font-mono text-xs">
            <p className="font-bold uppercase tracking-wider text-amber-400">Diretiva Principal</p>
            <p className="text-zinc-300 mt-1 font-sans text-xs sm:text-sm">
              Transformar problemas complexos em soluções seguras, rápidas e elegantes — protegendo dados e usuários em cada linha de código.
            </p>
          </div>
        </div>

        {/* Top Download CV Action Banner */}
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-[#161a26] p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileText className="size-5" />
            </div>
            <div>
              <span className="font-bold text-white block">Currículo Profissional (CV)</span>
              <span className="text-[11px] text-zinc-400">Disponível para leitura direta abaixo e download em PDF/TXT</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/20 px-4 py-2 font-bold text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <Download className="size-4" /> Baixar PDF
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0d0f14] px-3.5 py-2 font-bold text-zinc-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="size-4" /> .TXT
            </button>

            {onOpenApp && (
              <button
                onClick={() => onOpenApp('curriculo')}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 font-bold text-black hover:bg-amber-400 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                Abrir App CV <ExternalLink className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FULL CURRICULUM VIEW SECTION */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#10131a] p-5 sm:p-7 shadow-xl space-y-6">
        <div className="border-b border-amber-500/20 pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <UserCheck className="size-5 text-amber-400" /> Currículo Profissional Completo
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Apresentação formal de qualificações, habilidades e histórico profissional.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#161a24] px-3 py-1.5 text-zinc-300 hover:text-white cursor-pointer"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5 text-amber-400" />}
              {copied ? 'Email Copiado!' : 'Copiar Email'}
            </button>
          </div>
        </div>

        {/* Resumo & Habilidades */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
            <Sparkles className="size-4" /> Resumo de Atuação
          </h4>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#0d0f14] p-4 rounded-xl border border-white/5">
            {cvData.perfil}
          </p>
        </div>

        {/* Habilidades Técnicas */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
            <Code2 className="size-4" /> Habilidades Técnicas
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cvData.habilidades.map((sk) => (
              <div key={sk.categoria} className="rounded-xl border border-white/10 bg-[#0d0f14] p-3.5 space-y-2">
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

        {/* Trajetória & Formação */}
        <div className="space-y-4 pt-2">
          {/* Experiences Section */}
          <div className="rounded-xl border border-border/80 bg-[#0d0f14] p-4 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
              <Briefcase className="size-4" /> Experiência Profissional
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {cvData.experiencias.map((exp) => (
                <div key={exp.cargo} className="rounded-lg border border-border/60 bg-[#121520] p-3.5 space-y-1.5 hover:border-amber-500/30 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-mono font-bold text-white block">{exp.cargo}</span>
                    <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                      {exp.periodo}
                    </span>
                  </div>
                  <span className="text-amber-400/90 font-mono text-[11px] block">{exp.empresa}</span>
                  <p className="text-zinc-300 text-[11px] pt-1 leading-relaxed">
                    {exp.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Formations & Certificates side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Academic & Technical Formations */}
            <div className="rounded-xl border border-border/80 bg-[#0d0f14] p-4 space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
                <GraduationCap className="size-4" /> Formação Acadêmica & Técnica
              </h4>
              <div className="space-y-2 text-xs">
                {cvData.formacao.map((f) => (
                  <div key={f.curso} className="rounded-lg border border-border/60 bg-[#121520] p-3 space-y-1 hover:border-amber-500/30 transition-all">
                    <span className="font-mono font-bold text-white block">{f.curso}</span>
                    <span className="text-amber-400/90 font-mono text-[11px] block">{f.instituicao}</span>
                    <p className="text-zinc-300 text-[11px] pt-1 leading-relaxed">
                      {f.detalhes}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div className="rounded-xl border border-border/80 bg-[#0d0f14] p-4 space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
                <Award className="size-4" /> Certificações & Diplomas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {cvData.certificacoes.map((c) => (
                  <div key={c.nome} className="rounded-xl border border-border/60 bg-[#121520] p-3 flex items-start justify-between gap-2.5 hover:border-amber-500/30 transition-all">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-amber-300 font-bold block">{c.nome}</span>
                        {c.emissor && (
                          <span className="rounded bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-400 uppercase">
                            {c.emissor}
                          </span>
                        )}
                      </div>
                      <span className="text-zinc-400 text-[11px] block">{c.area}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-300 font-mono text-[10px] font-bold">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Download Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 font-mono text-xs">
          <span className="text-zinc-400">Gostou do perfil? Faça o download para análise.</span>
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
    </div>
  );
}
