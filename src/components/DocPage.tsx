'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import { api } from '@/lib/api';
import { buildExtensions, stepSize } from '@/lib/extensions';
import Icon from '@/components/Icon';
import { Dropdown } from '@/components/Menu';
import MenuBar, { type MenuActions } from '@/components/MenuBar';
import Toolbar from '@/components/Toolbar';
import type { DocFull, Tab } from '@/lib/types';

/** One editor per tab (keyed) so every tab keeps its own undo history. */
function TabEditor({ tab, initial, onChange, onReady }: {
  tab: Tab; initial: string; onChange: (id: string, html: string) => void; onReady: (e: Editor | null) => void;
}) {
  const extensions = useMemo(buildExtensions, []);
  const editor = useEditor({
    extensions,
    content: initial,
    autofocus: 'end',
    immediatelyRender: false, // avoid SSR hydration mismatch in Next.js
    editorProps: { attributes: { class: 'page-content', spellcheck: 'true' } },
    onUpdate: ({ editor }) => onChange(tab._id, editor.getHTML()),
  });
  useEffect(() => { onReady(editor); return () => onReady(null); }, [editor, onReady]);
  return <EditorContent editor={editor} />;
}

const SHORTCUTS = [
  ['Bold / Italic / Underline', 'Ctrl+B / I / U'],
  ['Strikethrough', 'Alt+Shift+5'],
  ['Heading 1–6', 'Ctrl+Alt+1…6'],
  ['Normal text', 'Ctrl+Alt+0'],
  ['Numbered / Bulleted / Checklist', 'Ctrl+Shift+7 / 8 / 9'],
  ['Align left / center / right / justify', 'Ctrl+Shift+L / E / R / J'],
  ['Superscript / Subscript', 'Ctrl+. / Ctrl+,'],
  ['Increase / decrease font size', 'Ctrl+Shift+. / ,'],
  ['Insert link', 'Ctrl+K'],
  ['Clear formatting', 'Ctrl+\\'],
  ['Indent / outdent list item', 'Ctrl+] / Ctrl+['],
  ['Undo / Redo', 'Ctrl+Z / Ctrl+Y'],
  ['Save now', 'Ctrl+S'],
  ['Print', 'Ctrl+P'],
  ['Find', 'Ctrl+F (browser)'],
  ['Show this list', 'Ctrl+/'],
];

export default function DocPage({ id }: { id: string }) {
  const router = useRouter();
  const [doc, setDoc] = useState<DocFull | null>(null);
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [, force] = useState(0);
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [zoom, setZoom] = useState(100);
  const [sidebar, setSidebar] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [wordCount, setWordCount] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [renamingTab, setRenamingTab] = useState<string | null>(null);

  const content = useRef<Record<string, string>>({});   // tabId -> latest html
  const dirty = useRef(new Set<string>());
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const titleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const docRef = useRef<DocFull | null>(null);
  docRef.current = doc;

  // ---- load
  useEffect(() => {
    api.get(id).then((d) => {
      d.tabs.forEach((t) => (content.current[t._id] = t.content));
      setDoc(d);
      setActiveId(d.tabs[0]._id);
      document.title = d.title;
    }).catch((e: Error) => setError(e.message));
  }, [id]);

  // re-render toolbar on every editor transaction
  useEffect(() => {
    if (!editor) return;
    const f = () => force((n) => n + 1);
    editor.on('transaction', f);
    return () => { editor.off('transaction', f); };
  }, [editor]);

  // ---- saving
  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    const ids = [...dirty.current];
    if (!ids.length) return;
    dirty.current.clear();
    try {
      await Promise.all(ids.map((t) => api.saveTab(id, t, { content: content.current[t] })));
      setStatus(dirty.current.size ? 'saving' : 'saved');
    } catch {
      ids.forEach((t) => dirty.current.add(t));
      setStatus('error');
      timer.current = setTimeout(flush, 4000); // retry
    }
  }, [id]);

  const onChange = useCallback((tabId: string, html: string) => {
    content.current[tabId] = html;
    dirty.current.add(tabId);
    setStatus('saving');
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, 700);
  }, [flush]);

  useEffect(() => {
    const unload = () => dirty.current.forEach((t) => api.saveTabBeacon(id, t, { content: content.current[t] }));
    window.addEventListener('beforeunload', unload);
    return () => { window.removeEventListener('beforeunload', unload); unload(); clearTimeout(timer.current); };
  }, [id]);

  const onTitle = (title: string) => {
    setDoc((d) => d && { ...d, title });
    document.title = title || 'Untitled document';
    setStatus('saving');
    clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(() => api.rename(id, title).then(() => setStatus(dirty.current.size ? 'saving' : 'saved')).catch(() => setStatus('error')), 600);
  };

  // ---- tabs
  const switchTab = (tabId: string) => { flush(); setActiveId(tabId); };

  const addTab = async () => {
    const n = docRef.current!.tabs.length + 1;
    const tab = await api.addTab(id, { title: `Tab ${n}` });
    content.current[tab._id] = '';
    setDoc((d) => d && { ...d, tabs: [...d.tabs, tab] });
    setActiveId(tab._id);
  };
  const dupTab = async (t: Tab) => {
    await flush();
    const tab = await api.addTab(id, { title: `Copy of ${t.title}`, content: content.current[t._id] });
    content.current[tab._id] = tab.content;
    setDoc((d) => d && { ...d, tabs: [...d.tabs, tab] });
    setActiveId(tab._id);
  };
  const delTab = async (t: Tab) => {
    if (docRef.current!.tabs.length <= 1) return alert('A document needs at least one tab.');
    if (!confirm(`Delete tab “${t.title}”?`)) return;
    dirty.current.delete(t._id);
    await api.removeTab(id, t._id);
    setDoc((d) => {
      if (!d) return d;
      const tabs = d.tabs.filter((x) => x._id !== t._id);
      if (activeId === t._id) setActiveId(tabs[Math.max(0, d.tabs.findIndex((x) => x._id === t._id) - 1)]._id);
      return { ...d, tabs };
    });
  };
  const renameTab = async (t: Tab, title: string) => {
    setRenamingTab(null);
    title = title.trim() || t.title;
    setDoc((d) => d && { ...d, tabs: d.tabs.map((x) => (x._id === t._id ? { ...x, title } : x)) });
    api.saveTab(id, t._id, { title });
  };

  // ---- actions
  const activeTab = doc?.tabs.find((t) => t._id === activeId);
  const actions: MenuActions = {
    newDoc: async () => { await flush(); router.push(`/d/${(await api.create())._id}`); },
    copyDoc: async () => { await flush(); router.push(`/d/${(await api.copy(id))._id}`); },
    deleteDoc: async () => {
      if (!doc || !confirm(`Delete “${doc.title}” permanently?`)) return;
      dirty.current.clear();
      await api.remove(id);
      router.push('/');
    },
    home: async () => { await flush(); router.push('/'); },
    rename: () => (document.getElementById('doc-title') as HTMLInputElement | null)?.select(),
    saveNow: () => flush(),
    addTab,
    toggleSidebar: () => setSidebar((v) => !v),
    toggleToolbar: () => setShowToolbar((v) => !v),
    toggleWordCount: () => setWordCount((v) => !v),
    showShortcuts: () => setShortcutsOpen(true),
    sizeStep: (d) => editor && stepSize(editor, d),
    sidebar, showToolbar, wordCount,
    download: (kind) => {
      if (!doc || !activeTab || !activeId || !editor) return;
      const html = content.current[activeId] || '';
      const body = kind === 'html'
        ? `<!doctype html><meta charset="utf-8"><title>${doc.title}</title><body style="font-family:Arial;max-width:816px;margin:40px auto">${html}</body>`
        : editor.getText({ blockSeparator: '\n' });
      const url = URL.createObjectURL(new Blob([body], { type: kind === 'html' ? 'text/html' : 'text/plain' }));
      Object.assign(document.createElement('a'), { href: url, download: `${doc.title} - ${activeTab.title}.${kind}` }).click();
      URL.revokeObjectURL(url);
    },
  };

  // global shortcuts (Ctrl+S, Ctrl+/)
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === 's') { e.preventDefault(); flush(); }
      if (e.key === '/') { e.preventDefault(); setShortcutsOpen((v) => !v); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [flush]);

  if (error) return <div className="center-msg">Could not open this document: {error}<br /><Link href="/">Back to documents</Link></div>;
  if (!doc) return <div className="center-msg">Loading…</div>;

  const words = editor ? editor.storage.characterCount.words() : 0;
  const chars = editor ? editor.storage.characterCount.characters() : 0;

  return (
    <div className="editor-app">
      <header className="top">
        <Link className="home-link" href="/" title="Docs home"><Icon name="doc" size={40} /></Link>
        <div className="top-main">
          <div className="title-row">
            <input
              id="doc-title"
              className="title-input"
              value={doc.title}
              onChange={(e) => onTitle(e.target.value)}
              onBlur={() => !doc.title.trim() && onTitle('Untitled document')}
              onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget.blur(), editor?.commands.focus())}
              style={{ width: `${Math.max(12, doc.title.length + 2)}ch` }}
            />
            <span className={`save-status ${status}`} title={status === 'error' ? 'Retrying…' : ''}>
              <Icon name="cloud" size={18} />
              {status === 'saved' ? 'Saved to MongoDB' : status === 'saving' ? 'Saving…' : 'Save failed — retrying'}
            </span>
          </div>
          <MenuBar editor={editor} actions={actions} />
        </div>
      </header>

      {showToolbar && <Toolbar editor={editor} zoom={zoom} setZoom={setZoom} />}

      <div className="body">
        {sidebar && (
          <aside className="tabs-side">
            <div className="tabs-head">
              <span>Document tabs</span>
              <button className="icon-btn sm" title="Add tab" onClick={addTab}><Icon name="add" size={20} /></button>
            </div>
            <ul>
              {doc.tabs.map((t) => (
                <li key={t._id} className={t._id === activeId ? 'active' : ''} onClick={() => switchTab(t._id)}>
                  <Icon name="tab" size={18} />
                  {renamingTab === t._id ? (
                    <input
                      autoFocus
                      defaultValue={t.title}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => renameTab(t, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setRenamingTab(null); }}
                    />
                  ) : (
                    <span className="tab-name" onDoubleClick={() => setRenamingTab(t._id)} title={t.title}>{t.title}</span>
                  )}
                  <span onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      align="right"
                      trigger={() => <button className="icon-btn xs"><Icon name="more" size={18} /></button>}
                      items={[
                        { label: 'Rename', onClick: () => setRenamingTab(t._id) },
                        { label: 'Duplicate tab', onClick: () => dupTab(t) },
                        { label: 'Delete tab', onClick: () => delTab(t), disabled: doc.tabs.length <= 1 },
                      ]}
                    />
                  </span>
                </li>
              ))}
            </ul>
            <button className="add-tab" onClick={addTab}><Icon name="add" size={18} /> New tab</button>
          </aside>
        )}

        <main className="canvas">
          <div className="page" style={{ zoom: zoom / 100 }}>
            {activeTab && (
              <TabEditor
                key={activeTab._id}
                tab={activeTab}
                initial={content.current[activeTab._id]}
                onChange={onChange}
                onReady={setEditor}
              />
            )}
          </div>
        </main>
      </div>

      {wordCount && <div className="wordcount">{words} words · {chars} characters</div>}

      {shortcutsOpen && (
        <div className="modal-bg" onMouseDown={() => setShortcutsOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <h2>Keyboard shortcuts</h2>
            <p className="hint">On Mac use ⌘ instead of Ctrl.</p>
            <table><tbody>{SHORTCUTS.map(([a, b]) => <tr key={a}><td>{a}</td><td><kbd>{b}</kbd></td></tr>)}</tbody></table>
            <button className="primary" onClick={() => setShortcutsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
