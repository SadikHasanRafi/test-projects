// Two-way binding = a value prop + an onChange prop. The parent owns the state.
type Props = { value: string; onChange: (value: string) => void }

export default function NameInput({ value, onChange }: Props) {
  return (
    <input
      className="input"
      placeholder="typing inside the child"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
