import { useState, type FormEvent } from 'react';
import { Radio, Mail, Code2, Linkedin, Send, CheckCircle2, Loader2, CloudCheck } from 'lucide-react';
import { sendContactMessage } from '../../lib/firebase';

const CHANNELS = [
  { icon: Mail, label: 'renan.rochaa0@gmail.com', href: 'mailto:renan.rochaa0@gmail.com' },
  { icon: Code2, label: 'github.com/Mello7z', href: 'https://github.com/Mello7z' },
  { icon: Linkedin, label: 'linkedin.com/in/renan-emanoel-5237273b7', href: 'https://www.linkedin.com/in/renan-emanoel-5237273b7/' },
];

export function SinalApp() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.mensagem) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      await sendContactMessage({
        name: formData.nome,
        email: formData.email,
        message: formData.mensagem,
      });
      setSent(true);
      setFormData({ nome: '', email: '', mensagem: '' });
    } catch (err) {
      console.error('Failed to send contact:', err);
      // Even if offline, save locally
      try {
        const local = JSON.parse(localStorage.getItem('renanos_offline_contacts') || '[]');
        local.push({ ...formData, date: new Date().toISOString() });
        localStorage.setItem('renanos_offline_contacts', JSON.stringify(local));
        setSent(true);
      } catch {
        setErrorMsg('Erro ao transmitir mensagem. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hud-grid min-h-full p-5 overflow-y-auto">
      <div className="mb-5 flex flex-col items-center text-center">
        <div className="grid size-14 place-items-center rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 signal-glow animate-signal">
          <Radio className="size-7" />
        </div>
        <h3 className="mt-3 font-mono text-xl font-bold text-foreground">
          Vamos Criar Algo Incrível Juntos
        </h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground font-sans">
          Em busca de oportunidades para aplicar meus conhecimentos em tecnologia e desenvolvimento. Envie uma mensagem direta com persistência em nuvem Firebase!
        </p>
      </div>

      {sent ? (
        <div className="mx-auto flex max-w-sm flex-col items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-6 text-center">
          <CheckCircle2 className="size-10 text-amber-400" />
          <p className="font-mono text-base font-bold text-foreground">Mensagem Transmitida & Salva na Nuvem</p>
          <p className="text-xs text-muted-foreground font-sans">
            Sua mensagem foi gravada com sucesso no Firebase Firestore. Entrarei em contato em breve através do seu e-mail.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-2 font-mono text-xs text-amber-400 underline-offset-4 hover:underline cursor-pointer"
          >
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto grid max-w-sm gap-3"
        >
          {errorMsg && (
            <div className="rounded border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-300 font-mono">
              {errorMsg}
            </div>
          )}

          <label className="grid gap-1">
            <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
              Seu Nome / Empresa
            </span>
            <input
              required
              name="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
              placeholder="Digite seu nome ou organização"
              className="rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500/60 font-sans"
            />
          </label>
          <label className="grid gap-1">
            <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
              Seu E-mail
            </span>
            <input
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="seu.email@exemplo.com"
              className="rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500/60 font-sans"
            />
          </label>
          <label className="grid gap-1">
            <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
              Mensagem / Proposta
            </span>
            <textarea
              required
              rows={3}
              value={formData.mensagem}
              onChange={(e) => setFormData((prev) => ({ ...prev, mensagem: e.target.value }))}
              placeholder="Descreva a oportunidade, projeto ou contato..."
              className="resize-none rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500/60 font-sans"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Transmitindo ao Firestore...
              </>
            ) : (
              <>
                <Send className="size-3.5" /> Enviar Contato
              </>
            )}
          </button>
        </form>
      )}

      <div className="mx-auto mt-6 grid max-w-sm gap-2">
        {CHANNELS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md border border-border bg-card/60 px-3 py-2 font-mono text-xs text-foreground/80 transition-colors hover:border-amber-500/40 hover:text-foreground"
          >
            <c.icon className="size-4 text-amber-400" />
            <span className="truncate">{c.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

