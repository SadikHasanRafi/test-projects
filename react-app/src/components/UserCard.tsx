// PROPS carry data IN and also functions to talk OUT. There is no "emit".
type Props = {
  name: string
  role?: string
  onGreet: (message: string) => void
}

// "= 'member'" sets a default
export default function UserCard({ name, role = 'member', onGreet }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p>
        <b>{name}</b> ({role})
      </p>
      <button className="btn mt-2" onClick={() => onGreet(`Hello from ${name}`)}>Greet parent</button>
    </div>
  )
}
