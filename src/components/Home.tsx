'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { DocSummary } from '@/lib/types';
import { api } from '@/lib/api';
import Icon from '@/components/Icon';
import { Dropdown } from '@/components/Menu';

const fmt = (d: string) => {
  const dt = new Date(d), now = new Date();
  if (dt.toDateString() === now.toDateString()) return dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return dt.toLocaleDateString([], { month: 'short', day: 'numeric', year: dt.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
};

export default function Home() {
  const router = useRouter();
  const [docs, setDocs] = useState<DocSummary[] | null>(null);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');

  const load = () => api.list().then(setDocs).catch((e: Error) => setErr(e.message));
  useEffect(() => { document.title = 'Docs'; load(); }, []);

  const open = (id: string) => router.push(`/d/${id}`);
  const newDoc = async () => { const d = await api.create(); open(d._id); };

  const shown = useMemo(
    () => (docs || []).filter((d) => d.title.toLowerCase().includes(q.toLowerCase())),
    [docs, q]
  );

  const rename = async (d: DocSummary) => {
    const t = prompt('Rename document', d.title);
    if (t?.trim()) { await api.rename(d._id, t.trim()); load(); }
  };
  const del = async (d: DocSummary) => {
    if (confirm(`Delete “${d.title}” permanently?`)) { await api.remove(d._id); load(); }
  };
  const copy = async (d: DocSummary) => { await api.copy(d._id); load(); };

  return (
    <div className="home">
      <header className="home-bar">
        <div className="logo"><Icon name="doc" size={40} /><span>Docs</span></div>
        <div className="search">
          <Icon name="search" />
          <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </header>

      <section className="start">
        <div className="wrap">
          <div className="label">Start a new document</div>
          <button className="blank" onClick={newDoc} aria-label="Blank document">
            <span className="plus">+</span>
          </button>
          <div className="blank-name">Blank document</div>
        </div>
      </section>

      <section className="recent wrap">
        <div className="label">Recent documents</div>
        {err && <div className="error">Could not load documents: {err}. Is the API and MongoDB running?</div>}
        {docs && !shown.length && !err && <div className="empty">{q ? 'No matching documents.' : 'No documents yet — create one above.'}</div>}
        <div className="grid">
          {shown.map((d) => (
            <div className="card" key={d._id}>
              <button className="thumb" onClick={() => open(d._id)}>
                <span>{d.preview || ' '}</span>
              </button>
              <div className="card-foot">
                <div className="card-title" onClick={() => open(d._id)}>
                  <Icon name="doc" size={18} /> <b title={d.title}>{d.title}</b>
                </div>
                <div className="card-meta">
                  <span>{d.tabCount} tab{d.tabCount > 1 ? 's' : ''} · {fmt(d.updatedAt)}</span>
                  <Dropdown
                    align="right"
                    trigger={() => <button className="icon-btn sm"><Icon name="more" size={18} /></button>}
                    items={[
                      { label: 'Open', onClick: () => open(d._id) },
                      { label: 'Rename', onClick: () => rename(d) },
                      { label: 'Make a copy', onClick: () => copy(d) },
                      'sep',
                      { label: 'Delete', onClick: () => del(d) },
                    ]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
