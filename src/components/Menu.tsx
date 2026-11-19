'use client';

import { useEffect, useRef, useState } from 'react';

export type MenuItem =
  | 'sep'
  | { label: string; shortcut?: string; onClick?: () => void; disabled?: boolean; checked?: boolean };

export function Dropdown({ trigger, items, className = '', align = 'left' }: {
  trigger: (open: boolean) => React.ReactNode;
  items: MenuItem[];
  className?: string;
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <div className={`dd ${className}`} ref={ref}>
      <div onMouseDown={(e) => e.preventDefault()} onClick={() => setOpen((o) => !o)}>
        {trigger(open)}
      </div>
      {open && (
        <div className={`dd-panel ${align}`} onMouseDown={(e) => e.preventDefault()}>
          {items.map((it, i) =>
            it === 'sep' ? <div key={i} className="dd-sep" /> : (
              <button
                key={i}
                className="dd-item"
                disabled={it.disabled}
                onClick={() => { setOpen(false); it.onClick?.(); }}
              >
                <span className="dd-check">{it.checked ? '✓' : ''}</span>
                <span className="dd-label">{it.label}</span>
                {it.shortcut && <span className="dd-short">{it.shortcut}</span>}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
