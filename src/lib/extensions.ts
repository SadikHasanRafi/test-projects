import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/react';
import { FontSize } from './FontSize';

export const SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

export const stepSize = (editor: Editor, dir: number) => {
  const cur = parseInt(editor.getAttributes('textStyle').fontSize) || 11;
  const next = dir > 0 ? SIZES.find((s) => s > cur) ?? cur : [...SIZES].reverse().find((s) => s < cur) ?? cur;
  editor.chain().focus().setFontSize(`${next}pt`).run();
};

export const setLink = (editor: Editor) => {
  const prev = editor.getAttributes('link').href || 'https://';
  const url = prompt('Link URL (empty to remove)', prev);
  if (url === null) return;
  if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run();
  else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

/** Google Docs keyboard shortcuts (Mod = Ctrl on Windows/Linux, ⌘ on Mac). */
const DocsShortcuts = Extension.create({
  name: 'docsShortcuts',
  addKeyboardShortcuts() {
    const e = () => this.editor;
    const heading = (level: 1 | 2 | 3 | 4 | 5 | 6) => () => e().chain().focus().toggleHeading({ level }).run();
    return {
      'Mod-Alt-0': () => e().chain().focus().setParagraph().run(),
      'Mod-Alt-1': heading(1), 'Mod-Alt-2': heading(2), 'Mod-Alt-3': heading(3),
      'Mod-Alt-4': heading(4), 'Mod-Alt-5': heading(5), 'Mod-Alt-6': heading(6),
      'Mod-Shift-7': () => e().chain().focus().toggleOrderedList().run(),
      'Mod-Shift-8': () => e().chain().focus().toggleBulletList().run(),
      'Mod-Shift-9': () => e().chain().focus().toggleTaskList().run(),
      'Mod-Shift-l': () => e().chain().focus().setTextAlign('left').run(),
      'Mod-Shift-e': () => e().chain().focus().setTextAlign('center').run(),
      'Mod-Shift-r': () => e().chain().focus().setTextAlign('right').run(),
      'Mod-Shift-j': () => e().chain().focus().setTextAlign('justify').run(),
      'Mod-Shift-x': () => e().chain().focus().toggleStrike().run(),
      'Alt-Shift-5': () => e().chain().focus().toggleStrike().run(),
      'Mod-,': () => e().chain().focus().toggleSubscript().run(),
      'Mod-.': () => e().chain().focus().toggleSuperscript().run(),
      'Mod-\\': () => e().chain().focus().unsetAllMarks().clearNodes().unsetTextAlign().run(),
      'Mod-k': () => { setLink(e()); return true; },
      'Mod-Shift-.': () => { stepSize(e(), 1); return true; },
      'Mod-Shift->': () => { stepSize(e(), 1); return true; },
      'Mod-Shift-,': () => { stepSize(e(), -1); return true; },
      'Mod-Shift-<': () => { stepSize(e(), -1); return true; },
      'Mod-]': () => e().chain().focus().sinkListItem('listItem').run() || e().chain().focus().sinkListItem('taskItem').run(),
      'Mod-[': () => e().chain().focus().liftListItem('listItem').run() || e().chain().focus().liftListItem('taskItem').run(),
    };
  },
});

export const buildExtensions = () => [
  StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
  Underline,
  Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow' } }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TextStyle, FontFamily, FontSize, Color,
  Highlight.configure({ multicolor: true }),
  Subscript, Superscript,
  TaskList, TaskItem.configure({ nested: true }),
  Table.configure({ resizable: true }), TableRow, TableHeader, TableCell,
  Image.configure({ inline: false, allowBase64: true }),
  Placeholder.configure({ placeholder: 'Type @ or start writing…' }),
  CharacterCount,
  DocsShortcuts,
];
