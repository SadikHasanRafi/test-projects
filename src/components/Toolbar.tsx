'use client';

import type { Editor } from '@tiptap/react';
import Icon from '@/components/Icon';
import { stepSize, setLink } from '@/lib/extensions';

const FONTS = ['Arial', 'Roboto', 'Open Sans', 'Lora', 'Merriweather', 'Playfair Display', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New', 'Roboto Mono'];
const ZOOMS = [50, 75, 90, 100, 125, 150, 200];

const Btn = ({ title, active, onClick, disabled, children }: {
  title: string; active?: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode;
}) => (
  <button
    className={`tb-btn${active ? ' on' : ''}`}
    title={title}
    disabled={disabled}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
  >
    {children}
  </button>
);

const Sep = () => <span className="tb-sep" />;

export default function Toolbar({ editor, zoom, setZoom }: { editor: Editor | null; zoom: number; setZoom: (z: number) => void }) {
  if (!editor) return <div className="toolbar" />;
  const c = () => editor.chain().focus();
  const a = (n: string | Record<string, unknown>, p?: Record<string, unknown>) =>
    typeof n === 'string' ? editor.isActive(n, p) : editor.isActive(n);

  const style = a('heading', { level: 1 }) ? 'h1' : a('heading', { level: 2 }) ? 'h2' : a('heading', { level: 3 }) ? 'h3'
    : a('heading', { level: 4 }) ? 'h4' : 'p';
  const setStyle = (v: string) => {
    if (v === 'p') c().setParagraph().run();
    else c().setHeading({ level: +v[1] as 1 | 2 | 3 | 4 }).run();
  };

  const ts = editor.getAttributes('textStyle');
  const size = parseInt(ts.fontSize) || 11;
  const family = (ts.fontFamily || 'Arial').replace(/["']/g, '').split(',')[0];

  const addImage = () => {
    const url = prompt('Image URL');
    if (url) c().setImage({ src: url }).run();
  };

  return (
    <div className="toolbar" role="toolbar">
      <Btn title="Undo (Ctrl+Z)" onClick={() => c().undo().run()} disabled={!editor.can().undo()}><Icon name="undo" /></Btn>
      <Btn title="Redo (Ctrl+Y)" onClick={() => c().redo().run()} disabled={!editor.can().redo()}><Icon name="redo" /></Btn>
      <Btn title="Print (Ctrl+P)" onClick={() => window.print()}><Icon name="print" /></Btn>
      <Sep />
      <select className="tb-select zoom" title="Zoom" value={zoom} onChange={(e) => setZoom(+e.target.value)}>
        {ZOOMS.map((z) => <option key={z} value={z}>{z}%</option>)}
      </select>
      <Sep />
      <select className="tb-select style" title="Styles" value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="p">Normal text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>
      <Sep />
      <select
        className="tb-select font"
        title="Font"
        value={FONTS.includes(family) ? family : 'Arial'}
        onChange={(e) => c().setFontFamily(e.target.value).run()}
      >
        {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
      </select>
      <Sep />
      <Btn title="Decrease font size (Ctrl+Shift+,)" onClick={() => stepSize(editor, -1)}>−</Btn>
      <input
        className="size-input"
        value={size}
        title="Font size"
        onChange={(e) => {
          const n = parseInt(e.target.value);
          if (n > 0 && n < 400) c().setFontSize(`${n}pt`).run();
        }}
      />
      <Btn title="Increase font size (Ctrl+Shift+.)" onClick={() => stepSize(editor, 1)}>+</Btn>
      <Sep />
      <Btn title="Bold (Ctrl+B)" active={a('bold')} onClick={() => c().toggleBold().run()}><b>B</b></Btn>
      <Btn title="Italic (Ctrl+I)" active={a('italic')} onClick={() => c().toggleItalic().run()}><i>I</i></Btn>
      <Btn title="Underline (Ctrl+U)" active={a('underline')} onClick={() => c().toggleUnderline().run()}><u>U</u></Btn>
      <Btn title="Strikethrough (Alt+Shift+5)" active={a('strike')} onClick={() => c().toggleStrike().run()}><s>S</s></Btn>
      <label className="tb-btn color" title="Text color">
        <span className="A">A</span>
        <i style={{ background: ts.color || '#000' }} />
        <input type="color" value={ts.color || '#000000'} onChange={(e) => c().setColor(e.target.value).run()} />
      </label>
      <label className="tb-btn color" title="Highlight color">
        <span className="A hl">ab</span>
        <i style={{ background: editor.getAttributes('highlight').color || '#ffff00' }} />
        <input type="color" value={editor.getAttributes('highlight').color || '#ffff00'} onChange={(e) => c().setHighlight({ color: e.target.value }).run()} />
      </label>
      <Sep />
      <Btn title="Insert link (Ctrl+K)" active={a('link')} onClick={() => setLink(editor)}><Icon name="link" /></Btn>
      <Btn title="Insert image" onClick={addImage}><Icon name="image" /></Btn>
      <Sep />
      <Btn title="Align left (Ctrl+Shift+L)" active={a({ textAlign: 'left' })} onClick={() => c().setTextAlign('left').run()}><Icon name="left" /></Btn>
      <Btn title="Center (Ctrl+Shift+E)" active={a({ textAlign: 'center' })} onClick={() => c().setTextAlign('center').run()}><Icon name="center" /></Btn>
      <Btn title="Align right (Ctrl+Shift+R)" active={a({ textAlign: 'right' })} onClick={() => c().setTextAlign('right').run()}><Icon name="right" /></Btn>
      <Btn title="Justify (Ctrl+Shift+J)" active={a({ textAlign: 'justify' })} onClick={() => c().setTextAlign('justify').run()}><Icon name="justify" /></Btn>
      <Sep />
      <Btn title="Checklist (Ctrl+Shift+9)" active={a('taskList')} onClick={() => c().toggleTaskList().run()}><Icon name="checklist" /></Btn>
      <Btn title="Bulleted list (Ctrl+Shift+8)" active={a('bulletList')} onClick={() => c().toggleBulletList().run()}><Icon name="bullets" /></Btn>
      <Btn title="Numbered list (Ctrl+Shift+7)" active={a('orderedList')} onClick={() => c().toggleOrderedList().run()}><Icon name="numbered" /></Btn>
      <Sep />
      <Btn title="Clear formatting (Ctrl+\)" onClick={() => c().unsetAllMarks().clearNodes().unsetTextAlign().run()}><Icon name="clear" /></Btn>
    </div>
  );
}
