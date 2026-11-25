import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import './style.css'

// StrictMode: in development it runs components and effects twice
// to help you find bugs. This is why some console logs appear twice.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter enables routing for everything inside it.
        useTransitions={false}: update the screen immediately on URL change.
        Without it, an input bound to the URL (lesson 13) loses fast typing. */}
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
