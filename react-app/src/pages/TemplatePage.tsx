// LESSON 1: Showing data in the markup
// A component is a function that returns JSX (HTML-like syntax inside JavaScript).
import DemoCard from '../components/DemoCard'

const name = 'React'
const price = 25
const link = 'https://react.dev'
const isActive = true
const textColor = 'tomato'
const inputProps = { placeholder: 'spread attributes', maxLength: 10 }
const htmlText = '<strong>bold from a string</strong>'

export default function TemplatePage() {
  return (
    // <>...</> is a Fragment: return many elements without an extra div
    <>
      <DemoCard title="[1] Print a value: { }">
        <p>Hello {name}!</p>
        <p>
          Any JS expression works: {price * 2} / {name.toUpperCase()}
        </p>
      </DemoCard>

      <DemoCard title="[2] Dynamic attribute: href={}">
        <a href={link} target="_blank" className="text-blue-600 underline">
          React docs
        </a>
      </DemoCard>

      <DemoCard title="[3] Dynamic class and style">
        {/* use className (not class). Build the string with a template literal */}
        <p className={`rounded p-2 ${isActive ? 'bg-sky-200' : 'opacity-50'}`}>
          class chosen by a condition
        </p>
        {/* outer {} = JavaScript, inner {} = the style object */}
        <p style={{ color: textColor, fontSize: '20px' }}>inline style object</p>
      </DemoCard>

      <DemoCard title="[4] Many attributes at once: {...props}">
        <input {...inputProps} className="input" />
      </DemoCard>

      <DemoCard title="[5] Raw HTML: dangerouslySetInnerHTML">
        {/* {} escapes HTML. This does not, so NEVER use it with user input (XSS) */}
        <p>{htmlText}</p>
        <p dangerouslySetInnerHTML={{ __html: htmlText }} />
      </DemoCard>
    </>
  )
}
