// LESSON 5: Forms (controlled inputs)
// There is no v-model. You connect both directions yourself:
//   value={state}  (state -> input)   onChange={...}  (input -> state)
import { useState, type SubmitEvent } from 'react'
import DemoCard from '../components/DemoCard'

const emptyForm = {
  name: '',
  age: 18,
  bio: '',
  agree: false,
  skills: [] as string[],
  gender: 'other',
  country: 'bd',
}

export default function FormPage() {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState('')

  // one helper to update any single field
  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleSkill(skill: string, checked: boolean) {
    update('skills', checked ? [...form.skills, skill] : form.skills.filter((s) => s !== skill))
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault() // stop the page reload
    const data = { ...form, name: form.name.trim() }
    if (!data.name) {
      setError('Name is required')
      return
    }
    setError('')
    setSubmitted(JSON.stringify(data, null, 2))
    setForm(emptyForm) // reset
  }

  return (
    <>
      <DemoCard title="[1] A full form">
        <form className="flex flex-col items-start gap-3" onSubmit={onSubmit}>
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => update('name', e.target.value)} />
          {/* input values are strings: convert with Number() */}
          <input type="number" className="input" value={form.age} onChange={(e) => update('age', Number(e.target.value))} />
          <textarea className="input" placeholder="Bio" value={form.bio} onChange={(e) => update('bio', e.target.value)} />

          {/* single checkbox -> use `checked`, not `value` */}
          <label>
            <input type="checkbox" checked={form.agree} onChange={(e) => update('agree', e.target.checked)} /> I agree
          </label>

          <div className="flex gap-3">
            {['vue', 'react'].map((skill) => (
              <label key={skill}>
                <input
                  type="checkbox"
                  checked={form.skills.includes(skill)}
                  onChange={(e) => toggleSkill(skill, e.target.checked)}
                />{' '}
                {skill}
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            {['male', 'female', 'other'].map((g) => (
              <label key={g}>
                <input type="radio" value={g} checked={form.gender === g} onChange={() => update('gender', g)} /> {g}
              </label>
            ))}
          </div>

          <select className="input" value={form.country} onChange={(e) => update('country', e.target.value)}>
            <option value="bd">Bangladesh</option>
            <option value="in">India</option>
            <option value="us">USA</option>
          </select>

          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" className="btn" disabled={!form.agree}>Submit</button>
        </form>
      </DemoCard>

      <DemoCard title="[2] Live state">
        <pre className="text-xs">{JSON.stringify(form, null, 2)}</pre>
      </DemoCard>

      {submitted && (
        <DemoCard title="[3] Submitted data">
          <pre className="text-xs">{submitted}</pre>
        </DemoCard>
      )}
    </>
  )
}
