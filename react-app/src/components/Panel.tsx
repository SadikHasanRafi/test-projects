import type { ReactNode } from 'react'

// "Slots" are just props that hold JSX. `children` is the default one.
type Props = { header?: ReactNode; children: ReactNode }

export default function Panel({ header = 'Default header', children }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-300">
      <header className="bg-slate-200 px-3 py-1 font-semibold">{header}</header>
      <div className="p-3">{children}</div>
    </div>
  )
}
