import { useState, useEffect } from 'react';
import { Plus, Trash2, Cloud, Sparkles, Loader2 } from 'lucide-react';
import { createNote, removeNote, subscribeToNotes, type NoteItem } from '../../lib/firebase';

const DEFAULT_ENTRIES = [
  {
    id: 'def-1',
    date: '03:14',
    title: 'Nota Tática #01',
    body: 'A melhor defesa contra bugs é o teste automatizado rigoroso. Confie, mas verifique — sempre.',
  },
  {
    id: 'def-2',
    date: '01:02',
    title: 'Diretiva de Deploy',
    body: 'Nunca faça deploy crítico na sexta-feira à noite. A cidade dorme, os incidentes não.',
  },
  {
    id: 'def-3',
    date: '23:47',
    title: 'Princípio da Criptografia',
    body: 'Segurança não é uma camada adicionada no final, é a fundação de cada endpoint.',
  },
];

export function DiarioApp() {
  const [scratch, setScratch] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [cloudNotes, setCloudNotes] = useState<NoteItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToNotes((notes) => {
      setCloudNotes(notes);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  async function handleAddNote() {
    if (!scratch.trim()) return;
    setSaving(true);
    try {
      const title = noteTitle.trim() || `Registro #${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      await createNote(title, scratch.trim());
      setScratch('');
      setNoteTitle('');
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNote(id: string) {
    try {
      await removeNote(id);
    } catch (err) {
      console.error('Error removing note:', err);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-background/50 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold flex items-center gap-1.5">
          <Sparkles className="size-3.5" /> Diário de Bordo — Sincronizado na Nuvem
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          <Cloud className="size-3 text-amber-400" /> Firestore Conectado
        </span>
      </div>

      {/* Cloud Notes list */}
      {cloudNotes.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
            Notas Salvas no Firebase ({cloudNotes.length})
          </p>
          {cloudNotes.map((n) => (
            <article
              key={n.id}
              className="group rounded-lg border border-amber-500/30 bg-[#0e111a] p-3 transition-all hover:border-amber-500/50"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-bold text-amber-300">
                  {n.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {n.createdAt instanceof Date ? n.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(n.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                    title="Excluir nota"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-zinc-200 font-sans whitespace-pre-wrap">{n.body}</p>
            </article>
          ))}
        </div>
      )}

      {/* Default tactical notes */}
      <div className="space-y-2.5">
        <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
          Diretrizes & Princípios Táticos
        </p>
        {DEFAULT_ENTRIES.map((e) => (
          <article
            key={e.id}
            className="rounded-lg border border-border bg-card/70 p-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs font-bold text-foreground">
                {e.title}
              </h4>
              <span className="font-mono text-[10px] text-muted-foreground">{e.date}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-foreground/80 font-sans">{e.body}</p>
          </article>
        ))}
      </div>

      {/* Add New Note to Firebase */}
      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-border/80 bg-secondary/30 p-3.5">
        <p className="font-mono text-[11px] uppercase tracking-wide text-amber-400 font-bold">
          Criar Nova Nota na Nuvem
        </p>
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Título da nota (opcional)..."
          className="rounded-lg border border-border bg-[#0a0c12] px-3 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-amber-500/50 font-mono"
        />
        <textarea
          value={scratch}
          onChange={(e) => setScratch(e.target.value)}
          placeholder="Escreva sua reflexão, insight ou código para salvar..."
          rows={3}
          className="resize-none rounded-lg border border-border bg-[#0a0c12] p-3 text-xs text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-amber-500/50 font-mono"
        />
        <button
          onClick={handleAddNote}
          disabled={saving || !scratch.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-3.5 py-2 font-mono text-xs font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Gravando no Firestore...
            </>
          ) : (
            <>
              <Plus className="size-3.5" /> Salvar no Firebase
            </>
          )}
        </button>
      </div>
    </div>
  );
}

