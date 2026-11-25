import type { ReactNode } from 'react'

// Used by every lesson page. `title` is a prop, `children` is whatever you put inside.
export default function DemoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
