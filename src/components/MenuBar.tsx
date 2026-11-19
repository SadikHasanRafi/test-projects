'use client';

import type { Editor } from '@tiptap/react';
import { Dropdown, type MenuItem } from '@/components/Menu';
import { setLink } from '@/lib/extensions';

const isMac = /Mac|iPhone|iPad/.test((typeof navigator === 'undefined' ? '' : navigator.platform));
const M = isMac ? '⌘' : 'Ctrl+';
const A = isMac ? '⌥' : 'Alt+';
const S = isMac ? '⇧' : 'Shift+';

export interface MenuActions {
  newDoc: () => void; copyDoc: () => void; deleteDoc: () => void; home: () => void; rename: () => void;
  saveNow: () => void; addTab: () => void; toggleSidebar: () => void; toggleToolbar: () => void;
  toggleWordCount: () => void; showShortcuts: () => void; sizeStep: (d: number) => void;
  download: (kind: 'html' | 'txt') => void; sidebar: boolean; showToolbar: boolean; wordCount: boolean;
}

export default function MenuBar({ editor, actions }: { editor: Editor | null; actions: MenuActions }) {
  const c = () => editor!.chain().focus();
  const a = (n: string) => !!editor?.isActive(n);
  const off = !editor;

  const menus: Record<string, MenuItem[]> = {
    File: [
      { label: 'New document', onClick: actions.newDoc },
      { label: 'Make a copy', onClick: actions.copyDoc },
      'sep',
      { label: 'Download tab as HTML (.html)', onClick: () => actions.download('html') },
      { label: 'Download tab as plain text (.txt)', onClick: () => actions.download('txt') },
      'sep',
      { label: 'Rename', onClick: actions.rename },
      { label: 'Save now', shortcut: `${M}S`, onClick: actions.saveNow },
      { label: 'Print', shortcut: `${M}P`, onClick: () => window.print() },
      'sep',
      { label: 'Delete document', onClick: actions.deleteDoc },
      { label: 'Close (all documents)', onClick: actions.home },
    ],
    Edit: [
      { label: 'Undo', shortcut: `${M}Z`, disabled: off, onClick: () => c().undo().run() },
      { label: 'Redo', shortcut: isMac ? '⇧⌘Z' : 'Ctrl+Y', disabled: off, onClick: () => c().redo().run() },
      'sep',
      { label: 'Select all', shortcut: `${M}A`, disabled: off, onClick: () => c().selectAll().run() },
      { label: 'Delete selection', disabled: off, onClick: () => c().deleteSelection().run() },
    ],
    View: [
      { label: 'Show tab sidebar', checked: actions.sidebar, onClick: actions.toggleSidebar },
      { label: 'Show toolbar', checked: actions.showToolbar, onClick: actions.toggleToolbar },
      { label: 'Show word count', checked: actions.wordCount, onClick: actions.toggleWordCount },
    ],
    Insert: [
      { label: 'Image (URL)', disabled: off, onClick: () => { const u = prompt('Image URL'); if (u) c().setImage({ src: u }).run(); } },
      { label: 'Table (3 × 3)', disabled: off, onClick: () => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
      { label: 'Horizontal line', disabled: off, onClick: () => c().setHorizontalRule().run() },
      { label: 'Link', shortcut: `${M}K`, disabled: off, onClick: () => setLink(editor!) },
      { label: 'Bulleted list', shortcut: `${M}${S}8`, disabled: off, onClick: () => c().toggleBulletList().run() },
      { label: 'Checklist', shortcut: `${M}${S}9`, disabled: off, onClick: () => c().toggleTaskList().run() },
      { label: 'Code block', disabled: off, onClick: () => c().toggleCodeBlock().run() },
      { label: 'Quote', disabled: off, onClick: () => c().toggleBlockquote().run() },
      'sep',
      { label: 'New tab', onClick: actions.addTab },
    ],
    Format: [
      { label: 'Bold', shortcut: `${M}B`, checked: a('bold'), disabled: off, onClick: () => c().toggleBold().run() },
      { label: 'Italic', shortcut: `${M}I`, checked: a('italic'), disabled: off, onClick: () => c().toggleItalic().run() },
      { label: 'Underline', shortcut: `${M}U`, checked: a('underline'), disabled: off, onClick: () => c().toggleUnderline().run() },
      { label: 'Strikethrough', shortcut: `${A}${S}5`, checked: a('strike'), disabled: off, onClick: () => c().toggleStrike().run() },
      { label: 'Superscript', shortcut: `${M}.`, checked: a('superscript'), disabled: off, onClick: () => c().toggleSuperscript().run() },
      { label: 'Subscript', shortcut: `${M},`, checked: a('subscript'), disabled: off, onClick: () => c().toggleSubscript().run() },
      'sep',
      { label: 'Normal text', shortcut: `${M}${A}0`, disabled: off, onClick: () => c().setParagraph().run() },
      { label: 'Heading 1', shortcut: `${M}${A}1`, disabled: off, onClick: () => c().toggleHeading({ level: 1 }).run() },
      { label: 'Heading 2', shortcut: `${M}${A}2`, disabled: off, onClick: () => c().toggleHeading({ level: 2 }).run() },
      { label: 'Heading 3', shortcut: `${M}${A}3`, disabled: off, onClick: () => c().toggleHeading({ level: 3 }).run() },
      'sep',
      { label: 'Align left', shortcut: `${M}${S}L`, disabled: off, onClick: () => c().setTextAlign('left').run() },
      { label: 'Align center', shortcut: `${M}${S}E`, disabled: off, onClick: () => c().setTextAlign('center').run() },
      { label: 'Align right', shortcut: `${M}${S}R`, disabled: off, onClick: () => c().setTextAlign('right').run() },
      { label: 'Justify', shortcut: `${M}${S}J`, disabled: off, onClick: () => c().setTextAlign('justify').run() },
      'sep',
      { label: 'Increase font size', shortcut: `${M}${S}.`, disabled: off, onClick: () => actions.sizeStep(1) },
      { label: 'Decrease font size', shortcut: `${M}${S},`, disabled: off, onClick: () => actions.sizeStep(-1) },
      'sep',
      { label: 'Clear formatting', shortcut: `${M}\\`, disabled: off, onClick: () => c().unsetAllMarks().clearNodes().unsetTextAlign().run() },
    ],
    Table: [
      { label: 'Insert table', disabled: off, onClick: () => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
      { label: 'Add row below', disabled: off, onClick: () => c().addRowAfter().run() },
      { label: 'Add column right', disabled: off, onClick: () => c().addColumnAfter().run() },
      { label: 'Delete row', disabled: off, onClick: () => c().deleteRow().run() },
      { label: 'Delete column', disabled: off, onClick: () => c().deleteColumn().run() },
      { label: 'Delete table', disabled: off, onClick: () => c().deleteTable().run() },
    ],
    Help: [{ label: 'Keyboard shortcuts', shortcut: `${M}/`, onClick: actions.showShortcuts }],
  };

  return (
    <nav className="menubar">
      {Object.entries(menus).map(([name, items]) => (
        <Dropdown key={name} items={items} trigger={(open) => <button className={`menu-btn${open ? ' open' : ''}`}>{name}</button>} />
      ))}
    </nav>
  );
}
